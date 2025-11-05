"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@leafygreen-ui/button";
import Checkbox from "@leafygreen-ui/checkbox";
import IconButton from "@leafygreen-ui/icon-button";
import Tooltip from "@leafygreen-ui/tooltip";
import Icon from "@leafygreen-ui/icon";
import { useToast } from "@/components/toast/Toast";
import { RefreshCw, Upload, X, Eye } from "lucide-react";
import styles from "./DocumentSidebar.module.css";
import UploadModal from "@/components/modals/UploadModal";
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal";
import DocumentModelModal from "@/components/modals/DocumentModelModal";
import InfoWizard from "@/components/InfoWizard/InfoWizard";
import DocumentsAPIClient from "@/utils/api/documents/api-client";

const DocumentSidebar = ({
  documents,
  selectedDocuments,
  onDocumentToggle,
  onSelectAll,
  onRefresh,
  loading,
  error,
  useCase,
  onDocumentDeleted
}) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [showModelModal, setShowModelModal] = useState(false);
  const [selectedDocumentData, setSelectedDocumentData] = useState(null);
  const [selectedDocumentName, setSelectedDocumentName] = useState("");
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

  const handleViewDocument = (documentId) => {
    // Use proxy pattern
    const viewUrl = `/api/documents/${documentId}/view`;
    
    console.log('👁️ Opening document in new tab:', viewUrl);
    
    // Open document in new tab for preview
    window.open(viewUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShowDocModel = async (doc) => {
    try {
      console.log('📄 Fetching raw document model for:', doc.document_id);
      const rawDoc = await DocumentsAPIClient.getRawDocument(doc.document_id);
      setSelectedDocumentData(rawDoc);
      setSelectedDocumentName(doc.document_name);
      setShowModelModal(true);
    } catch (error) {
      console.error('Error fetching document model:', error);
      pushToast({
        variant: 'error',
        title: 'Failed to load document model',
        description: 'Unable to fetch the document model. Please try again.',
        dismissible: true,
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (documentToDelete) {
      try {
        // Use API client which uses proxy pattern
        await DocumentsAPIClient.deleteDocument(documentToDelete.document_id);
        
        const deletedDocName = documentToDelete.document_name;
        setShowDeleteModal(false);
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
      } catch (error) {
        // API client throws errors for both failed responses and network issues
        console.error('Error deleting document:', error);
        
        // Determine error type based on message
        const isFetchError = error.message?.includes('Failed to delete document');
        
        pushToast({
          variant: 'error',
          title: isFetchError ? 'Deletion failed' : 'Deletion error',
          description: isFetchError 
            ? 'Unable to delete the document. Please try again.'
            : 'An error occurred while deleting the document. Please try again.',
          dismissible: true,
        });
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setDocumentToDelete(null);
  };

  const handleSelectAllClick = () => {
    if (onSelectAll) {
      // Use parent's bulk select/deselect function
      onSelectAll(!allSelected);
    }
  };

  const allSelected = documents.length > 0 && selectedDocuments.length === documents.length;
  const someSelected = selectedDocuments.length > 0 && selectedDocuments.length < documents.length;


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

        {/* Select All Checkbox */}
        {!loading && !error && documents.length > 0 && (
          <div className={styles.selectAllContainer}>
            <Checkbox
              checked={allSelected}
              indeterminate={someSelected}
              onChange={handleSelectAllClick}
              label="Select All"
              className={styles.selectAllCheckbox}
            />
          </div>
        )}



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
                  
                  {/* Action buttons - positioned separately */}
                  <div className={styles.actionButtons}>
                    {/* View Document Button */}
                    <Tooltip
                      align="top"
                      justify="middle"
                      trigger={
                        <button
                          className={styles.viewButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDocument(doc.document_id);
                          }}
                          aria-label="View Full Document"
                        >
                          <Eye size={18} />
                        </button>
                      }
                    >
                      View Full Document
                    </Tooltip>
                    
                    {/* Doc Model Button */}
                    <Tooltip
                      align="top"
                      justify="middle"
                      trigger={
                        <IconButton
                          aria-label="Doc Model"
                          className={styles.iconButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShowDocModel(doc);
                          }}
                        >
                          <Icon glyph="CurlyBraces" />
                        </IconButton>
                      }
                    >
                      Doc Model
                    </Tooltip>
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

      {showModelModal && selectedDocumentData && (
        <DocumentModelModal
          isOpen={showModelModal}
          onClose={() => {
            setShowModelModal(false);
            setSelectedDocumentData(null);
            setSelectedDocumentName("");
          }}
          documentData={selectedDocumentData}
          documentName={selectedDocumentName}
        />
      )}
    </>
  );
};

export default DocumentSidebar;
