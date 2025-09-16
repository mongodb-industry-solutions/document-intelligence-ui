"use client";

import { useState, useEffect, useRef, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import styles from './Toast.module.css';

// Toast Context
const ToastContext = createContext();

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const pushToast = (toast) => {
    // Generate a unique, monotonically increasing id to avoid key collisions
    idRef.current += 1;
    const id = idRef.current;
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);

    // Auto dismiss after 5 seconds if dismissible
    if (toast.dismissible !== false) {
      setTimeout(() => {
        removeToast(id);
      }, 5000);
    }
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ pushToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// Hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast Container Component
const ToastContainer = ({ toasts, removeToast }) => {
  const content = (
    <div className={styles.container}>
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
  if (typeof document !== 'undefined') {
    return createPortal(content, document.body);
  }
  return null;
};

// Individual Toast Component
const Toast = ({ id, variant = 'info', title, description, onClose, progress }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  const getIcon = () => {
    switch (variant) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <XCircle size={20} />;
      case 'warning':
        return <AlertCircle size={20} />;
      default:
        return <AlertCircle size={20} />;
    }
  };

  return (
    <div className={`${styles.toast} ${styles[variant]} ${isVisible ? styles.visible : ''}`}>
      <div className={styles.iconWrapper}>
        {getIcon()}
      </div>
      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        {description && <div className={styles.description}>{description}</div>}
      </div>
      <button className={styles.closeButton} onClick={handleClose}>
        <X size={16} />
      </button>
      {progress && (
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ animationDuration: '5s' }} />
        </div>
      )}
    </div>
  );
};
