"use client";

import { useState } from "react";
import styles from "./DocumentList.module.css";
import Button from "@leafygreen-ui/button";
import Checkbox from "@leafygreen-ui/checkbox";

function DocumentList({ documents, onDelete, onClearAll }) {
  const [selectedDocs, setSelectedDocs] = useState(new Set());

  const handleToggleSelect = (filename) => {
    const newSelected = new Set(selectedDocs);
    if (newSelected.has(filename)) {
      newSelected.delete(filename);
    } else {
      newSelected.add(filename);
    }
    setSelectedDocs(newSelected);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    const kb = bytes / 1024;
    return kb.toFixed(0) + ' KB';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      })}`;
    }
    return date.toLocaleDateString();
  };

  if (documents.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Previously Uploaded</h3>
        <button 
          className={styles.clearButton}
          onClick={onClearAll}
        >
          Deselect All
        </button>
      </div>
      
      <div className={styles.documentList}>
        {documents.map((doc) => (
          <div key={doc.filename} className={styles.documentItem}>
            <Checkbox
              checked={selectedDocs.has(doc.filename)}
              onChange={() => handleToggleSelect(doc.filename)}
              darkMode={true}
              className={styles.checkbox}
            />
            
            <div className={styles.documentInfo}>
              <div className={styles.documentName}>{doc.filename}</div>
              <div className={styles.documentMeta}>
                {formatFileSize(doc.size)} • {formatDate(doc.uploadDate)}
              </div>
            </div>
            
            <div className={styles.actions}>
              <Button
                variant="primaryOutline"
                size="small"
                darkMode={true}
                className={styles.viewButton}
              >
                View
              </Button>
              <Button
                variant="dangerOutline"
                size="small"
                darkMode={true}
                onClick={() => onDelete(doc.filename)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DocumentList;
