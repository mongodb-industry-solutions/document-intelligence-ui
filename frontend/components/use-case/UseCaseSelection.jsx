"use client";

import { useState } from "react";
import styles from "./UseCaseSelection.module.css";
import Button from "@leafygreen-ui/button";
import Card from "@leafygreen-ui/card";
import ProgressIndicator from "@/components/progress/ProgressIndicator";
import Stepper, { Step } from "@leafygreen-ui/stepper";
import { H1, Body, Subtitle } from "@leafygreen-ui/typography";

const UseCaseSelection = ({ onContinue }) => {
  const [selectedCase, setSelectedCase] = useState(null);

  const useCases = [
    {
      id: "credit_rating",
      title: "Companies Credit Rating and Market Research",
      icon: "bank.png"
    },
    {
      id: "payment_exception",
      title: "Exception Handling in Payment Processing",
      icon: "card.png"
    },
    {
      id: "investment_research",
      title: "AI-Powered Investment Research Summarization",
      icon: "ai.png"
    },
    {
      id: "kyc_onboarding",
      title: "Client Onboarding KYC Document Review",
      icon: "user.png"
    },
    {
      id: "loan_origination",
      title: "Loan Origination Document Intelligence",
      icon: "doc.png"
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
        <H1 className={styles.title}>
          Choose a Use Case
        </H1>

        <Body>From the options below choose the financial use case that best aligns with what you want to showcase.</Body>

        <Stepper currentStep={1} maxDisplayedSteps={3} className={styles.stepper}>
          <Step>Use Case</Step>
          <Step>Sources</Step>
          <Step>Document Intelligence</Step>
        </Stepper>
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
              <img 
                src={`/` + useCase.icon}
                alt={useCase.title + ' icon'}
                className={styles.iconPlaceholder}
              />
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
