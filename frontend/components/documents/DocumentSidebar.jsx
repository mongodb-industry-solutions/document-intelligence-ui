"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@leafygreen-ui/button";
import Checkbox from "@leafygreen-ui/checkbox";
import { useToast } from "@/components/toast/Toast";
import { RefreshCw, Upload, X } from "lucide-react";
import styles from "./DocumentSidebar.module.css";
import UploadModal from "@/components/modals/UploadModal";
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal";
import InfoWizard from "@/components/InfoWizard/InfoWizard";

const DocumentSidebar = ({
  documents,
  selectedDocuments,
  onDocumentToggle,
  onRefresh,
  loading,
  error,
  useCase,
  onDocumentDeleted
}) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const { pushToast } = useToast();

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
    // Keep modal open; just refresh the list and notify user
    pushToast({
      variant: 'success',
      title: 'Ingestion completed',
      description: 'The document is now available for interaction. You can close this window.',
      dismissible: true,
      progress: 1,
    });
    onRefresh();
  };

  const handleDeleteClick = (doc) => {
    setDocumentToDelete(doc);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (documentToDelete) {
      try {
        const response = await fetch(`${process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/documents/${documentToDelete.document_id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setShowDeleteModal(false);
          const deletedDocName = documentToDelete.document_name;
          setDocumentToDelete(null);

          // Show success toast
          pushToast({
            variant: 'success',
            title: 'Document deleted successfully',
            description: `"${deletedDocName}" has been permanently removed from the system.`,
            dismissible: true,
            progress: 1,
          });

          // Call the parent callback to refresh the document list
          if (onDocumentDeleted) {
            onDocumentDeleted(documentToDelete.document_id);
          }
          onRefresh();
        } else {
          console.error('Failed to delete document');
          pushToast({
            variant: 'error',
            title: 'Deletion failed',
            description: 'Unable to delete the document. Please try again.',
            dismissible: true,
          });
        }
      } catch (error) {
        console.error('Error deleting document:', error);
        pushToast({
          variant: 'error',
          title: 'Deletion error',
          description: 'An error occurred while deleting the document. Please try again.',
          dismissible: true,
        });
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setDocumentToDelete(null);
  };


  return (
    <>
      <div className={styles.sidebar}>
        <div className={styles.header}>
          <div className={styles.headerRow}>
            <div className={styles.headerText}>
              <div className={styles.titleWizard}>
                <h2 className={styles.title}>Available Documents</h2>
              </div>
              <p className={styles.subtitle}>
                Select the documents you want to use to interact with the assistant.
              </p>
            </div>
            <div className={styles.headerActions}>
              <Button
                size="default"
                leftGlyph={<Upload size={16} color="black" />}
                onClick={() => setShowUploadModal(true)}
                variant="primary"
                className={styles.addButton}
              >
                Add a local file
              </Button>
            </div>
          </div>
        </div>



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
                {/**
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteClick(doc)}
                  aria-label={`Delete ${doc.document_name}`}
                  title="Delete document"
                >
                  <X size={16} />
                </button>
                 */}
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
          onRefreshDocuments={onRefresh}
          useCase={useCase}
        />
      )}

      {showDeleteModal && documentToDelete && (
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          documentName={documentToDelete.document_name}
        />
      )}
    </>
  );
};

export default DocumentSidebar;
