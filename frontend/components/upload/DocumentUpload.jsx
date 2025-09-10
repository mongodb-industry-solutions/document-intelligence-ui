"use client";

import { useState, useRef } from "react";
import styles from "./DocumentUpload.module.css";

function DocumentUpload({ onUpload, isUploading }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type === 'application/pdf'
    );
    
    if (files.length > 0) {
      onUpload(files);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onUpload(files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.stepTitle}>1. Add Data Sources</h2>
      <p className={styles.stepDescription}>
        Select one or more content sources to compare.
      </p>
      
      <div
        className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className={styles.uploadIcon}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path d="M7 18H17V16H7V18ZM7 14H17V12H7V14ZM5 22C4.45 22 3.979 21.804 3.587 21.412C3.195 21.02 3 20.55 3 20V4C3 3.45 3.196 2.979 3.588 2.587C3.98 2.195 4.45 2 5 2H14L21 9V20C21 20.55 20.804 21.021 20.412 21.413C20.02 21.805 19.55 22 19 22H5ZM13 10V4H5V20H19V10H13Z" fill="#889397"/>
          </svg>
        </div>
        
        <p className={styles.dropText}>
          Drag & drop files or click to upload
        </p>
        <p className={styles.fileType}>PDF</p>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          multiple
          onChange={handleFileSelect}
          className={styles.fileInput}
        />
      </div>
      
      <button 
        className={styles.uploadButton}
        disabled={isUploading}
      >
        {isUploading ? 'Uploading...' : 'Upload and Ingest'}
      </button>
    </div>
  );
}

export default DocumentUpload;
