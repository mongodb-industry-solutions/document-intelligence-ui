"use client";

import Modal from "@leafygreen-ui/modal";
import Button from "@leafygreen-ui/button";
import { H3, Body } from "@leafygreen-ui/typography";
import { AlertTriangle } from "lucide-react";
import styles from "./DeleteConfirmationModal.module.css";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, documentName }) => {
  return (
    <Modal 
      open={isOpen} 
      setOpen={onClose}
    >
      <div className={styles.modalContent}>
        <div className={styles.iconContainer}>
          <AlertTriangle size={36} color="#DC382D" />
        </div>
        
        <H3 className={styles.title}>Confirm Document Deletion</H3>
        
        <Body className={styles.message}>
          By confirming this deletion, all data and references associated with <strong>"{documentName}"</strong> will be permanently removed from the system. This includes:
        </Body>
        
        <ul className={styles.impactList}>
          <li>All document chunks and embeddings</li>
          <li>Assessment and relevance data</li>
          <li>Search index entries</li>
        </ul>
        
        <Body className={styles.warning}>
          <strong>Important:</strong> This document will no longer be available for Q&A interactions or included in any scheduled reports. Any future analysis or report generation will proceed without considering this document's content.
        </Body>
        
        <Body className={styles.finalWarning}>
          This action cannot be undone.
        </Body>
        
        <div className={styles.actions}>
          <Button
            variant="default"
            onClick={onClose}
            className={styles.cancelButton}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            className={styles.deleteButton}
          >
            Delete Document
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;
