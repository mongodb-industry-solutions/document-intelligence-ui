"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./DataSources.module.css";
import Button from "@leafygreen-ui/button";
import Card from "@leafygreen-ui/card";
import ProgressIndicator from "@/components/progress/ProgressIndicator";

const DataSources = ({ onContinue, onBack }) => {
  const router = useRouter();
  const [selectedSources, setSelectedSources] = useState([]);
  const [selectedExample, setSelectedExample] = useState(null);

  const dataSources = [
    {
      id: "local",
      title: "Connect with a local drive",
      icon: "icon/logo"
    },
    {
      id: "s3",
      title: "Connect with S3",
      icon: "icon/logo"
    },
    {
      id: "google-drive",
      title: "Connect with Google Drive",
      icon: "icon/logo"
    }
  ];

  const exampleDocs = [
    {
      id: "doc1",
      title: "Example Doc One",
      description: "Description"
    },
    {
      id: "doc2",
      title: "Example Doc",
      description: "Description"
    },
    {
      id: "doc3",
      title: "Example Doc",
      description: "Description"
    },
    {
      id: "doc4",
      title: "Example Doc",
      description: "Description"
    }
  ];

  const handleSourceSelect = (sourceId) => {
    setSelectedSources(prev => {
      if (prev.includes(sourceId)) {
        // Remove if already selected
        return prev.filter(id => id !== sourceId);
      } else {
        // Add to selection
        return [...prev, sourceId];
      }
    });
    setSelectedExample(null); // Clear example selection when source is selected
  };

  const handleExampleSelect = (exampleId) => {
    setSelectedExample(exampleId);
    setSelectedSources([]); // Clear source selections when example is selected
  };

  const handleContinue = () => {
    if ((selectedSources.length > 0 || selectedExample) && onContinue) {
      onContinue({ sources: selectedSources, example: selectedExample });
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push("/use-case");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          Set-up your Data Sources
        </h1>
        
        <ProgressIndicator currentStep={2} />
      </div>

      <div className={styles.sourcesSection}>
        <p className={styles.sourcesHint}>You can select multiple sources</p>
        <div className={styles.sourcesGrid}>
          {dataSources.map((source) => (
            <div
              key={source.id}
              className={`${styles.sourceCard} ${selectedSources.includes(source.id) ? styles.sourceCardSelected : ''}`}
              onClick={() => handleSourceSelect(source.id)}
            >
              <div className={styles.sourceIcon}>
                {source.icon}
              </div>
              <span className={styles.sourceTitle}>{source.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.examplesSection}>
        <h2 className={styles.examplesTitle}>Try with example files</h2>
        
        <div className={styles.examplesGrid}>
          {exampleDocs.map((doc) => (
            <Card
              key={doc.id}
              className={`${styles.exampleCard} ${selectedExample === doc.id ? styles.exampleCardSelected : ''}`}
              onClick={() => handleExampleSelect(doc.id)}
              contentStyle="clickable"
            >
              <h3 className={styles.exampleTitle}>{doc.title}</h3>
              <p className={styles.exampleDescription}>{doc.description}</p>
            </Card>
          ))}
        </div>
      </div>

      <div className={styles.footer}>
        <Button 
          variant="default"
          size="large"
          onClick={handleBack}
          className={styles.backButton}
        >
          Go Back
        </Button>
        
        <Button 
          variant="primary"
          size="large"
          onClick={handleContinue}
          disabled={selectedSources.length === 0 && !selectedExample}
          className={styles.continueButton}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default DataSources;
