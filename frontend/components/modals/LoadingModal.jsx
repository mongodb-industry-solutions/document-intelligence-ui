"use client";

import styles from "./LoadingModal.module.css";

function LoadingModal({ isOpen, message = "Loading source..." }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.spinner}></div>
        <p className={styles.message}>{message}</p>
      </div>
    </div>
  );
}

export default LoadingModal;
