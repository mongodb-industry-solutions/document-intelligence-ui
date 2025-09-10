"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelection } from "@/contexts/SelectionContext";
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
      
      setDocuments(response.documents || []);
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

  const handleRefresh = () => {
    fetchDocuments();
  };

  // Don't render anything until we know if we need to redirect
  if (isLoading || !isSelectionComplete()) {
    return null;
  }

  return (
    <div className={styles.container}>
      <AppHeader />
      
      <div className={styles.main}>
        <DocumentSidebar
          documents={documents}
          selectedDocuments={selectedDocuments}
          onDocumentToggle={handleDocumentToggle}
          onRefresh={handleRefresh}
          loading={loading}
          error={error}
          useCase={useCase}
        />
        
        <DocumentAssistant
          selectedDocuments={selectedDocuments}
          documents={documents}
          useCase={useCase}
        />
      </div>
    </div>
  );
}
