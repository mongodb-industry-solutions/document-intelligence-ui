"use client";

import React from 'react';
import styles from './CitationsModal.module.css';

const CitationsModal = ({ isOpen, onClose, citations = [] }) => {
  if (!isOpen) return null;

  return (
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
                  <span>Chunk #{citation.chunk_index}</span>
                  <span className={styles.separator}>•</span>
                  <span>Relevance: {(citation.similarity_score * 100).toFixed(1)}%</span>
                </div>
                
                <div className={styles.citationContent}>
                  <p>{citation.chunk_text}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CitationsModal;
