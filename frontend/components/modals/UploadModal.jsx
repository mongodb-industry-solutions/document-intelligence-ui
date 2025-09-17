"use client";

import { useState, useRef } from "react";
import Modal from "@leafygreen-ui/modal";
import Button from "@leafygreen-ui/button";
import { Upload, X } from "lucide-react";
import styles from "./UploadModal.module.css";
import UploadAPIClient from "@/utils/api/upload/api-client";
import DocumentsAPIClient from "@/utils/api/documents/api-client";
import { useToast } from "@/components/toast/Toast";

const UploadModal = ({ isOpen, onClose, onSuccess, onRefreshDocuments, useCase }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [isIngesting, setIsIngesting] = useState(false);
  const [showConsole, setShowConsole] = useState(false); // keep console visible until user closes
  const [workflow, setWorkflow] = useState(null); // { id, status }
  const [logs, setLogs] = useState([]);
  const [canClose, setCanClose] = useState(false);
  const [warning, setWarning] = useState(null); // inline warning message
  const { pushToast } = useToast();
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 1) {
      setError("Only one file can be uploaded at a time");
      setFiles([selectedFiles[0]]);
      return;
    }
    setFiles(selectedFiles.slice(0, 1));
    setError(null);
    setWarning(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 1) {
      setError("Only one file can be uploaded at a time");
      setFiles([droppedFiles[0]]);
      return;
    }
    setFiles(droppedFiles.slice(0, 1));
    setError(null);
    setWarning(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setError(null);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError("Please select files to upload");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const response = await UploadAPIClient.uploadDocuments({
        files,
        industry: 'fsi', // Default industry
        useCase: useCase || 'credit_rating',
      });
      // Response shape includes: status, files (uploaded), errors (skipped/failed), uploaded_count, skipped_count
      const uploadedCount = response.uploaded_count || (response.files ? response.files.length : 0);
      const skippedDuplicates = (response.errors || []).filter(e => e.error === 'duplicate');
      const otherErrors = (response.errors || []).filter(e => e.error !== 'duplicate');

      // Show warning for duplicates, if any
      if (skippedDuplicates.length > 0) {
        const names = skippedDuplicates.slice(0, 3).map(e => e.filename).join(', ');
        pushToast({
          variant: 'warning',
          title: 'Some files were skipped',
          description: `${skippedDuplicates.length} duplicate file${skippedDuplicates.length > 1 ? 's were' : ' was'} not uploaded${names ? `: ${names}${skippedDuplicates.length > 3 ? ', …' : ''}` : ''}.`,
          dismissible: true,
          progress: 1,
        });
      }

      // Show error toast for other failures
      if (otherErrors.length > 0) {
        pushToast({
          variant: 'error',
          title: 'Upload failed for some files',
          description: otherErrors[0]?.error || 'Some files could not be uploaded.',
          dismissible: true,
        });
      }

      // If duplicate and already in system, skip ingestion and just notify
      const fileName = files[0]?.name;
      if (skippedDuplicates.length > 0 && fileName) {
        try {
          const exists = await DocumentsAPIClient.documentExists(fileName);
          if (exists?.ready) {
            setWarning(`Document already available — ${fileName} is already processed and ready for interaction. Ingestion was not started.`);
            // Refresh listing but keep modal open
            if (onRefreshDocuments) onRefreshDocuments();
            // Do not show ingestion completed toast for this case
            return; // Do not start ingestion
          }
        } catch (_) {
          // If existence check fails, fall back to normal behavior below
        }
      }

      // Success if any actual uploads happened OR duplicate exists but not yet processed
      if (uploadedCount > 0 || skippedDuplicates.length > 0) {
        // First success toast: detection summary (less confusing wording)
        pushToast({
          variant: 'success',
          title: 'Documents detection',
          description: `${uploadedCount} file${uploadedCount === 1 ? '' : 's'} uploaded successfully.${skippedDuplicates.length > 0 ? ` ${skippedDuplicates.length} duplicate file${skippedDuplicates.length > 1 ? 's' : ''} on storage.` : ''}`,
          dismissible: true,
          progress: 1,
        });

        // Immediately start ingestion for @local source using current use case
        await startIngestionAfterUpload(useCase || 'credit_rating');
      } else {
        // No new files uploaded
        if (skippedDuplicates.length > 0 && otherErrors.length === 0) {
          // Pure duplicate case → keep modal open, let user adjust
          setError('All selected files are already uploaded. Please remove duplicates or choose different files.');
        } else if (otherErrors.length > 0) {
          setError('No files were uploaded due to errors.');
        }
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload documents');
      pushToast({
        variant: 'error',
        title: 'Upload error',
        description: err.message || 'Failed to upload documents',
        dismissible: true,
      });
    } finally {
      setUploading(false);
    }
  };

  const formatUtc = (d) => {
    const date = new Date(d);
    const pad = (n) => String(n).padStart(2, '0');
    const yyyy = date.getUTCFullYear();
    const mm = pad(date.getUTCMonth() + 1);
    const dd = pad(date.getUTCDate());
    const HH = pad(date.getUTCHours());
    const MM = pad(date.getUTCMinutes());
    const SS = pad(date.getUTCSeconds());
    return `${yyyy}-${mm}-${dd} ${HH}:${MM}:${SS} UTC`;
  };

  const appendLog = (message) => {
    setLogs((prev) => [...prev, `[${formatUtc(new Date())}] ${message}`]);
  };

  const startIngestionAfterUpload = async (effectiveUseCase) => {
    try {
      setIsIngesting(true);
      setShowConsole(true);
      setCanClose(false);
      setLogs([]);
      appendLog(`Starting ingestion for use case "${effectiveUseCase}" with sources: local`);

      const start = await DocumentsAPIClient.startIngestion({
        useCase: effectiveUseCase,
        sources: ['@local'],
        industry: 'fsi',
      });
      setWorkflow({ id: start.workflow_id, status: start.status });
      appendLog(`Workflow started: ${start.workflow_id}`);

      // Poll logs until completed
      const poll = async () => {
        if (!start.workflow_id) return;
        try {
          const logRes = await DocumentsAPIClient.getIngestionLogs(start.workflow_id, 500);
          if (logRes && Array.isArray(logRes.logs)) {
            const pretty = logRes.logs.map(l => {
              const ts = l.timestamp ? formatUtc(l.timestamp) : formatUtc(Date.now());
              return `[${ts}] ${l.agent ? l.agent + ' - ' : ''}${l.message}`;
            });
            setLogs(prev => {
              const seen = new Set(prev);
              const combined = [...prev];
              pretty.forEach(line => { if (!seen.has(line)) { seen.add(line); combined.push(line); } });
              return combined;
            });
            const done = pretty.some(line => /completed successfully/i.test(line));
            if (done) {
              appendLog('Ingestion completed successfully.');
              setIsIngesting(false); // stop the spinner but KEEP console open
              setCanClose(true);
              // Refresh list; do not auto-close
              if (onRefreshDocuments) {
                onRefreshDocuments();
              }
              if (onSuccess) {
                onSuccess();
              }
              return;
            }
          }
          setTimeout(poll, 2000);
        } catch (err) {
          appendLog(`Polling error: ${err.message}`);
          setIsIngesting(false);
          setCanClose(true);
        }
      };
      setTimeout(poll, 1200);
    } catch (err) {
      appendLog(`Failed to start ingestion: ${err.message}`);
      setIsIngesting(false);
      setCanClose(true);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return Math.round(bytes / 1024) + ' KB';
    else return Math.round(bytes / 1048576) + ' MB';
  };

  return (
    <Modal
      open={isOpen}
      setOpen={onClose}
      size="large"
      className={styles.modal}
    >
      <div className={styles.header}>
        <h2 className={styles.title}>{showConsole ? 'Ingestion Progress' : 'Upload Document'}</h2>
      </div>

      <div className={styles.content}>
        {!showConsole && (
          <div
            className={styles.dropZone}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={48} className={styles.uploadIcon} />
            <p className={styles.dropText}>
              Drop a file here or click to browse
            </p>
            <p className={styles.dropHint}>
              Maximum 1 file • Allowed types: .pdf, .doc, .docx
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple={false}
              accept=".pdf,.docx,.txt"
              onChange={handleFileSelect}
              className={styles.fileInput}
            />
          </div>
        )}

        {!showConsole && files.length > 0 && (
          <div className={styles.fileList}>
            <h3 className={styles.fileListTitle}>Selected Files</h3>
            {files.map((file, index) => (
              <div key={index} className={styles.fileItem}>
                <div className={styles.fileInfo}>
                  <span className={styles.fileName}>{file.name}</span>
                  <span className={styles.fileSize}>
                    {formatFileSize(file.size)}
                  </span>
                </div>
                <Button
                  size="xsmall"
                  leftGlyph={<X size={16} />}
                  onClick={() => removeFile(index)}
                  className={styles.removeButton}
                />
              </div>
            ))}
          </div>
        )}

        {!showConsole && error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        {!showConsole && warning && (
          <div className={styles.warning}>
            {warning}
          </div>
        )}

        {!showConsole && (
          <div className={styles.info}>
            <p className={styles.infoText}>
              <strong>Industry:</strong> FSI (Financial Services)
            </p>
            <p className={styles.infoText}>
              <strong>Use Case:</strong> {useCase || 'Credit Rating'}
            </p>
            <p className={styles.infoText}>
              <strong>Destination:</strong> Local storage
            </p>
          </div>
        )}

        {showConsole && (
          <div style={{
            background: '#0b1220',
            color: '#e6edf3',
            borderRadius: 8,
            padding: 16,
            height: '60vh',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            fontSize: 13,
            overflowY: 'auto',
            border: '1px solid #1f2a44'
          }} aria-live="polite" role="log">
            {logs.length === 0 ? (
              <div style={{ opacity: 0.75 }}>Starting ingestion…</div>
            ) : (
              logs.map((line, idx) => (<div key={idx}>{line}</div>))
            )}
          </div>
        )}
      </div>

      <div className={styles.footer}>
        {showConsole ? (
          <>
            <Button
              size="large"
              variant="default"
              onClick={onClose}
              disabled={isIngesting}
            >
              {isIngesting ? 'Close disabled while ingesting' : 'Close'}
            </Button>
            {isIngesting ? (
              <Button
                size="large"
                variant="primary"
                disabled
                className={styles.uploadButton}
              >
                Ingesting…
              </Button>
            ) : (
              <Button
                size="large"
                variant="default"
                disabled
              >
                Ingested!
              </Button>
            )}
          </>
        ) : (
          <>
            <Button
              size="large"
              variant="default"
              onClick={onClose}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              size="large"
              variant="primary"
              onClick={handleUpload}
              disabled={files.length === 0 || uploading}
              className={styles.uploadButton}
            >
              {uploading ? 'Uploading...' : 'Upload and Ingest'}
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
};

export default UploadModal;
