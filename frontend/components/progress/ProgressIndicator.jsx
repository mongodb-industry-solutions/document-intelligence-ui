"use client";

import { useRouter } from "next/navigation";
import styles from "./ProgressIndicator.module.css";
import { Check } from "lucide-react";

const steps = [
  { id: 1, label: "Use Case", path: "/use-case" },
  { id: 2, label: "Sources", path: "/sources" },
  { id: 3, label: "Document Intelligence", path: "/document-intelligence" }
];

const ProgressIndicator = ({ currentStep = 1 }) => {
  const router = useRouter();

  const handleStepClick = (step) => {
    // Only allow navigation to previous steps
    if (step.id < currentStep) {
      router.push(step.path);
    }
  };

  return (
    <div className={styles.container}>
      {steps.map((step, index) => (
        <div key={step.id} className={styles.stepWrapper}>
          <div 
            className={`${styles.stepContent} ${
              step.id < currentStep ? styles.clickable : ""
            }`}
            onClick={() => handleStepClick(step)}
          >
            <div className={`${styles.circle} ${
              step.id < currentStep ? styles.completed : 
              step.id === currentStep ? styles.active : 
              styles.inactive
            }`}>
              {step.id < currentStep ? (
                <Check size={16} strokeWidth={3} />
              ) : (
                <span className={styles.stepNumber}>{step.id}</span>
              )}
            </div>
            <span className={`${styles.label} ${
              step.id <= currentStep ? styles.labelActive : styles.labelInactive
            }`}>
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={`${styles.connector} ${
              step.id < currentStep ? styles.connectorCompleted : styles.connectorInactive
            }`} />
          )}
        </div>
      ))}
    </div>
  );
};

export default ProgressIndicator;
