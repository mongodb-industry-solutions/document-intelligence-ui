"use client";

import { useState, useRef } from "react";
import Modal from "@leafygreen-ui/modal";
import Button from "@leafygreen-ui/button";
import { Upload, X } from "lucide-react";
import styles from "./UploadModal.module.css";
import UploadAPIClient from "@/utils/api/upload/api-client";

const UploadModal = ({ isOpen, onClose, onSuccess, useCase }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Limit to 3 files
    if (selectedFiles.length > 3) {
      setError("Maximum 3 files can be uploaded at once");
      return;
    }

    setFiles(selectedFiles);
    setError(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    
    // Limit to 3 files
    if (droppedFiles.length > 3) {
      setError("Maximum 3 files can be uploaded at once");
      return;
    }

    setFiles(droppedFiles);
    setError(null);
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

      console.log('Upload successful:', response);
      onSuccess();
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload documents');
    } finally {
      setUploading(false);
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
        <h2 className={styles.title}>Upload Documents</h2>
      </div>

      <div className={styles.content}>
        <div
          className={styles.dropZone}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={48} className={styles.uploadIcon} />
          <p className={styles.dropText}>
            Drop files here or click to browse
          </p>
          <p className={styles.dropHint}>
            Maximum 3 files • Allowed types: .pdf, .doc, .docx
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.docx,.txt"
            onChange={handleFileSelect}
            className={styles.fileInput}
          />
        </div>

        {files.length > 0 && (
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

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

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
      </div>

      <div className={styles.footer}>
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
      </div>
    </Modal>
  );
};

export default UploadModal;
