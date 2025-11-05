"use client";

import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import IconButton from "@leafygreen-ui/icon-button";
import Tooltip from "@leafygreen-ui/tooltip";
import Icon from "@leafygreen-ui/icon";
import DocumentModelModal from "./DocumentModelModal";
import DocumentsAPIClient from "@/utils/api/documents/api-client";
import styles from './CitationsModal.module.css';

const CitationsModal = ({ isOpen, onClose, citations = [] }) => {
  const [showModelModal, setShowModelModal] = useState(false);
  const [selectedChunkData, setSelectedChunkData] = useState(null);
  const [selectedChunkName, setSelectedChunkName] = useState("");

  if (!isOpen) return null;

  const handleViewDocument = (documentId) => {
    // Use proxy pattern
    const viewUrl = `/api/documents/${documentId}/view`;
    
    console.log('👁️ Opening source document from citation:', documentId);
    
    // Open document in new tab
    window.open(viewUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShowChunkModel = async (citation) => {
    try {
      console.log('📄 Fetching raw chunk model for:', citation);
      
      // Extract chunk ID from citation metadata
      const chunkId = citation.metadata?._id || citation.id;
      
      if (!chunkId) {
        console.error('No chunk ID found in citation');
        return;
      }
      
      const rawChunk = await DocumentsAPIClient.getRawChunk(chunkId);
      setSelectedChunkData(rawChunk);
      setSelectedChunkName(`${citation.document_name} - Chunk ${citation.chunk_index + 1}`);
      setShowModelModal(true);
    } catch (error) {
      console.error('Error fetching chunk model:', error);
      alert('Failed to load chunk model. Please try again.');
    }
  };

  return (
    <>
      <div className={styles.modalOverlay} onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <h2>Source Documents</h2>
            <button className={styles.closeButton} onClick={onClose}>×</button>
          </div>
          
          <div className={styles.citationsContainer}>
            {citations.length === 0 ? (
              <p className={styles.noCitations}>No citations available for this response.</p>
            ) : (
              citations.map((citation, index) => (
                <div key={index} className={styles.citation}>
                  <div className={styles.citationHeader}>
                    <span className={styles.citationNumber}>[{index + 1}]</span>
                    <span className={styles.documentName}>{citation.document_name}</span>
                    {citation.section_title && (
                      <span className={styles.sectionTitle}> - {citation.section_title}</span>
                    )}
                  </div>
                  
                  <div className={styles.citationMetadata}>
                    <span>Relevance: {(citation.similarity_score * 100).toFixed(1)}%</span>
                  </div>
                  
                  <div className={styles.citationContent}>
                    <p>{citation.chunk_text}</p>
                  </div>
                  
                  {/* Action buttons */}
                  {citation.document_id && (
                    <div className={styles.citationActions}>
                      <button
                        className={styles.viewDocButton}
                        onClick={() => handleViewDocument(citation.document_id)}
                      >
                        <FileText size={14} />
                        <span>View Full Document</span>
                      </button>
                      
                      <Tooltip
                        align="top"
                        justify="middle"
                        trigger={
                          <IconButton
                            aria-label="Doc Model"
                            className={styles.iconButton}
                            onClick={() => handleShowChunkModel(citation)}
                          >
                            <Icon glyph="CurlyBraces" />
                          </IconButton>
                        }
                      >
                        Doc Model
                      </Tooltip>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Render DocumentModelModal outside of CitationsModal overlay to prevent event bubbling */}
      {showModelModal && selectedChunkData && (
        <DocumentModelModal
          isOpen={showModelModal}
          onClose={() => {
            setShowModelModal(false);
            setSelectedChunkData(null);
            setSelectedChunkName("");
          }}
          documentData={selectedChunkData}
          documentName={selectedChunkName}
        />
      )}
    </>
  );
};

export default CitationsModal;
