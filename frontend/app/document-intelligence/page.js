"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelection } from "@/contexts/SelectionContext";
import { ToastProvider } from "@/components/toast/Toast";
import styles from "../page.module.css";
import AppHeader from "@/components/layout/AppHeader";
import DocumentSidebar from "@/components/documents/DocumentSidebar";
import DocumentAssistant from "@/components/assistant/DocumentAssistant";
import DocumentsAPIClient from "@/utils/api/documents/api-client";


export default function DocumentIntelligencePage() {
  const router = useRouter();
  const { useCase, sources, isSelectionComplete, isLoading } = useSelection();
  const [documents, setDocuments] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect if selection not complete
  useEffect(() => {
    if (!isLoading && !isSelectionComplete()) {
      router.replace("/use-case");
    }
  }, [isLoading, isSelectionComplete, router]);

  // Reset state when useCase or sources change
  useEffect(() => {
    // Clear selected documents when context changes
    setSelectedDocuments([]);
    setDocuments([]);
    setError(null);
  }, [useCase, sources]);

  // Fetch documents when selection changes
  useEffect(() => {
    if (!isLoading && isSelectionComplete()) {
      fetchDocuments();
    }
  }, [isLoading, useCase, sources]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await DocumentsAPIClient.listDocuments({
        useCase,
        sources,
        status: 'completed',
      });
      
      const docs = response.documents || [];
      setDocuments(docs);
      
      // Select all documents by default when they're first loaded
      if (docs.length > 0) {
        const allDocIds = docs.map(doc => doc.document_id);
        setSelectedDocuments(allDocIds);
        console.log(`✅ Auto-selected all ${allDocIds.length} documents`);
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentToggle = (documentId) => {
    setSelectedDocuments(prev => {
      if (prev.includes(documentId)) {
        return prev.filter(id => id !== documentId);
      } else {
        return [...prev, documentId];
      }
    });
  };

  const handleSelectAll = (selectAll) => {
    if (selectAll) {
      // Select all documents
      const allDocIds = documents.map(doc => doc.document_id);
      setSelectedDocuments(allDocIds);
    } else {
      // Deselect all documents
      setSelectedDocuments([]);
    }
  };

  const handleRefresh = () => {
    fetchDocuments();
  };

  const handleDocumentDeleted = (documentId) => {
    // Remove the deleted document from selected documents if it was selected
    setSelectedDocuments(prev => prev.filter(id => id !== documentId));
  };


  // Don't render anything until we know if we need to redirect
  if (isLoading || !isSelectionComplete()) {
    return null;
  }



  return (
    <ToastProvider>
      <div className={styles.container}>
        <AppHeader />
        
        <div className={styles.main}>
          <DocumentSidebar
            documents={documents}
            selectedDocuments={selectedDocuments}
            onDocumentToggle={handleDocumentToggle}
            onSelectAll={handleSelectAll}
            onRefresh={handleRefresh}
            loading={loading}
            error={error}
            useCase={useCase}
            onDocumentDeleted={handleDocumentDeleted}
          />
          
          <DocumentAssistant
            selectedDocuments={selectedDocuments}
            documents={documents}
            useCase={useCase}
          />
        </div>
      </div>
    </ToastProvider>
  );
}
