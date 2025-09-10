"use client";

import { useState } from "react";
import styles from "./UseCaseSelection.module.css";
import Button from "@leafygreen-ui/button";
import Card from "@leafygreen-ui/card";
import ProgressIndicator from "@/components/progress/ProgressIndicator";

const UseCaseSelection = ({ onContinue }) => {
  const [selectedCase, setSelectedCase] = useState(null);

  const useCases = [
    {
      id: "credit_rating",
      title: "Companies Credit Rating and Market Research",
      icon: "icon/illo"
    },
    {
      id: "payment_exception",
      title: "Exception Handling in Payment Processing",
      icon: "icon/illo"
    },
    {
      id: "investment_research",
      title: "AI-Powered Investment Research Summarization",
      icon: "icon/illo"
    },
    {
      id: "kyc_onboarding",
      title: "Client Onboarding KYC Document Review",
      icon: "icon/illo"
    },
    {
      id: "loan_origination",
      title: "Loan Origination Document Intelligence",
      icon: "icon/illo"
    }
  ];

  const handleCardSelect = (caseId) => {
    setSelectedCase(caseId);
  };

  const handleContinue = () => {
    if (selectedCase && onContinue) {
      onContinue(selectedCase);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          Choose a Use Case
        </h1>
        
        <ProgressIndicator currentStep={1} />
      </div>

      <div className={styles.cardsGrid}>
        {useCases.map((useCase) => (
          <Card
            key={useCase.id}
            className={`${styles.card} ${selectedCase === useCase.id ? styles.cardSelected : ''}`}
            onClick={() => handleCardSelect(useCase.id)}
            contentStyle="clickable"
          >
            <div className={styles.cardContent}>
              <div className={styles.iconPlaceholder}>
                {useCase.icon}
              </div>
              <h3 className={styles.cardTitle}>
                {useCase.title}
              </h3>
            </div>
          </Card>
        ))}
      </div>

      <div className={styles.footer}>
        <Button 
          variant="primary"
          size="large"
          onClick={handleContinue}
          disabled={!selectedCase}
          className={styles.continueButton}
        >
          Continue with Selection
        </Button>
      </div>
    </div>
  );
};

export default UseCaseSelection;
