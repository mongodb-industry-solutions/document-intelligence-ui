"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@leafygreen-ui/button";
import Checkbox from "@leafygreen-ui/checkbox";
import { RefreshCw, Upload } from "lucide-react";
import styles from "./DocumentSidebar.module.css";
import UploadModal from "@/components/modals/UploadModal";

const DocumentSidebar = ({ 
  documents, 
  selectedDocuments, 
  onDocumentToggle, 
  onRefresh, 
  loading, 
  error,
  useCase 
}) => {
  const [showUploadModal, setShowUploadModal] = useState(false);

  const formatFileSize = (sizeInMB) => {
    if (sizeInMB < 1) {
      return `${Math.round(sizeInMB * 1024)} KB`;
    }
    return `${sizeInMB.toFixed(2)} MB`;
  };

  const formatDocumentName = (name) => {
    // Remove file extension for display
    return name.replace(/\.[^/.]+$/, "");
  };

  const getFileIcon = (fileExtension) => {
    if (fileExtension === 'pdf') {
      return '/PDF_file_icon.png';
    } else if (fileExtension === 'doc' || fileExtension === 'docx') {
      return '/DOC_or_DOCX_file_icon.png';
    }
    return null;
  };

  const getSourceName = (sourcePath) => {
    if (sourcePath.includes('@local@')) return 'local';
    if (sourcePath.includes('@s3@')) return 's3';
    if (sourcePath.includes('@gdrive@')) return 'google drive';
    return 'unknown';
  };

  const handleUploadSuccess = () => {
    setShowUploadModal(false);
    onRefresh();
  };

  return (
    <>
      <div className={styles.sidebar}>
        <div className={styles.header}>
          <h2 className={styles.title}>Sources</h2>
          <div className={styles.headerActions}>
            <Button
              size="default"
              leftGlyph={<RefreshCw size={16} />}
              onClick={onRefresh}
              disabled={loading}
              className={styles.refreshButton}
            >
              Sync Sources
            </Button>
            <Button
              size="default"
              leftGlyph={<Upload size={16} />}
              onClick={() => setShowUploadModal(true)}
              variant="primary"
              className={styles.addButton}
            >
              Add a local file
            </Button>
          </div>
        </div>

        <p className={styles.subtitle}>
          Find below the documents available for interaction.
        </p>

        {loading && (
          <div className={styles.loading}>
            Loading documents...
          </div>
        )}

        {error && (
          <div className={styles.error}>
            Error: {error}
          </div>
        )}

        {!loading && !error && documents.length === 0 && (
          <div className={styles.empty}>
            No documents found. Click "Add More" to upload documents.
          </div>
        )}

        {!loading && !error && documents.length > 0 && (
          <div className={styles.documentList}>
            {documents.map((doc) => (
              <div key={doc.document_id} className={styles.documentItem}>
                <Checkbox
                  checked={selectedDocuments.includes(doc.document_id)}
                  onChange={() => onDocumentToggle(doc.document_id)}
                  className={styles.checkbox}
                  aria-label={`Select ${doc.document_name}`}
                />
                <div className={styles.documentInfo}>
                  <div className={styles.documentHeader}>
                    <div className={styles.fileIcon}>
                      {getFileIcon(doc.file_extension) && (
                        <Image
                          src={getFileIcon(doc.file_extension)}
                          alt={`${doc.file_extension} file`}
                          width={20}
                          height={20}
                        />
                      )}
                    </div>
                    <span className={styles.documentName}>
                      {formatDocumentName(doc.document_name)}
                    </span>
                    <span className={styles.fileExtension}>
                      .{doc.file_extension}
                    </span>
                  </div>
                  <div className={styles.documentMeta}>
                    <span className={styles.fileSize}>
                      {formatFileSize(doc.file_size_mb)}
                    </span>
                    <span className={styles.separator}>•</span>
                    <span className={styles.pageCount}>
                      {doc.page_count} pages
                    </span>
                    <span className={styles.separator}>•</span>
                    <span className={styles.source}>
                      Source: {getSourceName(doc.source_path)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showUploadModal && (
        <UploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleUploadSuccess}
          useCase={useCase}
        />
      )}
    </>
  );
};

export default DocumentSidebar;
