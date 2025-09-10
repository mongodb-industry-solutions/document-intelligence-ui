"use client";

import { useSelection } from "@/contexts/SelectionContext";
import ProgressIndicator from "@/components/progress/ProgressIndicator";
import styles from "./AppHeader.module.css";

function AppHeader() {
  const { useCase } = useSelection();
  
  const formatUseCase = (useCase) => {
    if (!useCase) return '';
    return useCase
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <ProgressIndicator currentStep={3} />
        <div className={styles.titleSection}>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
