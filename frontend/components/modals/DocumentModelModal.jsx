"use client";

import Modal from "@leafygreen-ui/modal";
import Code from "@leafygreen-ui/code";
import { H3 } from "@leafygreen-ui/typography";
import styles from "./DocumentModelModal.module.css";

const DocumentModelModal = ({ isOpen, onClose, documentData, documentName }) => {
  // Handle the LeafyGreen Modal's setOpen callback properly
  const handleSetOpen = (open) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Modal 
      open={isOpen} 
      setOpen={handleSetOpen}
      className={styles.modal}
    >
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <H3 className={styles.title}>Doc Model</H3>
        
        <div className={styles.subtitle}>
          MongoDB Document Model for: <strong>{documentName}</strong>
        </div>
        
        <div className={styles.codeContainer}>
          <Code language="json">
            {JSON.stringify(documentData, null, 2)}
          </Code>
        </div>
      </div>
    </Modal>
  );
};

export default DocumentModelModal;

