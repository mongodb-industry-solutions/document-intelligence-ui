"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSelection } from "@/contexts/SelectionContext";
import { useState } from "react";
import Button from "@leafygreen-ui/button";
import { RotateCcw, AlertTriangle } from "lucide-react";
import ClickableStepper from "./ClickableStepper";
import styles from "./AppHeader.module.css";

function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { useCase, clearSelection } = useSelection();
  const [showStartOverModal, setShowStartOverModal] = useState(false);

  const formatUseCase = (useCase) => {
    if (!useCase) return '';
    return useCase
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Determine current step based on pathname
  const getCurrentStep = () => {
    if (pathname.includes('/use-case')) return 1;
    if (pathname.includes('/sources')) return 2;
    if (pathname.includes('/document-intelligence')) return 3;
    return 1; // Default to first step
  };

  const handleStartOver = () => {
    setShowStartOverModal(true);
  };

  const confirmStartOver = () => {
    clearSelection();
    localStorage.removeItem('di_session_id');
    setShowStartOverModal(false);
    router.push('/use-case');
  };

  // Only show Start Over button on document-intelligence page
  const showStartOverButton = pathname.includes('/document-intelligence');

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <ClickableStepper currentStep={getCurrentStep()} />
          {showStartOverButton && (
            <Button
              variant="dangerOutline"
              size="default"
              leftGlyph={<RotateCcw size={16} />}
              onClick={handleStartOver}
              className={styles.startOverButton}
            >
              Start Over
            </Button>
          )}
        </div>
      </header>

      {/* Start Over Confirmation Modal */}
      {showStartOverModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleSection}>
                <AlertTriangle size={24} color="#DC3545" />
                <h2 className={styles.modalTitle}>Start Over?</h2>
              </div>
              <button 
                className={styles.modalCloseButton} 
                onClick={() => setShowStartOverModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <p className={styles.modalText}>
                This will clear your current session including:
              </p>
              <ul className={styles.modalList}>
                <li>Selected use case</li>
                <li>Selected data sources</li>
                <li>Selected documents</li>
                <li>Chat history and conversation</li>
              </ul>
              <p className={styles.modalWarning}>
                You will need to select your use case and sources again. Are you sure?
              </p>
            </div>
            
            <div className={styles.modalActions}>
              <Button
                variant="default"
                onClick={() => setShowStartOverModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={confirmStartOver}
              >
                Yes, Start Over
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AppHeader;
