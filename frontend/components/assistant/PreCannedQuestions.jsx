"use client";

import { useState } from "react";
import Button from "@leafygreen-ui/button";
import { MessageCircle, Search, FileText, Brain, HelpCircle, TrendingUp, HistoryIcon } from "lucide-react";
import styles from "./PreCannedQuestions.module.css";

const PreCannedQuestions = ({ onQuestionSelect, useCase, hasSelectedDocuments, hasPreviousMessages }) => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  // Define pre-canned questions based on use case and capabilities
  const getPreCannedQuestions = () => {
    const baseQuestions = [
      {
        id: "capabilities",
        question: "What can you do for me?",
        icon: HelpCircle,
        description: "Learn about my capabilities and how I can help you",
        category: "general"
      },
      {
        id: "about",
        question: "What are these documents about?",
        icon: FileText,
        description: "Get a sense of what the documents contain",
        category: "analysis"
      },
      {
        id: "memory",
        question: "What questions have I asked you so far?",
        icon: HistoryIcon,
        description: "Review your conversation history",
        category: "memory"
      }
    ];

    // Add use-case specific questions
    if (useCase === "fsi") {
      baseQuestions.push(
        {
          id: "risk_assessment",
          question: "What are the key risk factors mentioned?",
          icon: Brain,
          description: "Identify and analyze risk factors in financial documents",
          category: "fsi"
        },
        {
          id: "compliance",
          question: "Are there any compliance issues or regulatory concerns?",
          icon: FileText,
          description: "Check for compliance and regulatory matters",
          category: "fsi"
        }
      );
    }

    return baseQuestions;
  };

  const questions = getPreCannedQuestions();

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question.id);
    onQuestionSelect(question);
  };

  const getQuestionIcon = (IconComponent) => {
    return <IconComponent size={16} className={styles.questionIcon} />;
  };

  const getCategoryColor = (category) => {
    const colors = {
      general: "#00A651",
      search: "#0066CC", 
      analysis: "#FF6B35",
      fsi: "#9B59B6"
    };
    return colors[category] || "#666";
  };

  return (
    <div className={styles.preCannedContainer}>
      <div className={styles.header}>
        {/*<MessageCircle size={20} className={styles.headerIcon} />*/}
        <h3 className={styles.headerTitle}>Quick Questions</h3>
        <p className={styles.headerSubtitle}>
          {hasSelectedDocuments 
            ? "Ask me anything about your selected documents" 
            : "Select documents first to ask questions about them"
          }
        </p>
      </div>
      
      <div className={styles.questionsGrid}>
        {questions.map((question) => {
          const IconComponent = question.icon;
          const isSelected = selectedQuestion === question.id;
          const isDisabled = !hasSelectedDocuments && question.category !== "general" && 
                            (question.id !== "memory" || !hasPreviousMessages);
          
          return (
            <button
              key={question.id}
              className={`${styles.questionBubble} ${isSelected ? styles.selected : ''} ${isDisabled ? styles.disabled : ''}`}
              onClick={() => !isDisabled && handleQuestionClick(question)}
              disabled={isDisabled}
              style={{
                '--category-color': getCategoryColor(question.category)
              }}
            >
              <div className={styles.questionContent}>
                <div className={styles.questionHeader}>
                  {getQuestionIcon(IconComponent)}
                  <span className={styles.questionText}>{question.question}</span>
                </div>
                <p className={styles.questionDescription}>{question.description}</p>
              </div>
              
              {isSelected && (
                <div className={styles.selectedIndicator}>
                  <div className={styles.selectedDot}></div>
                </div>
              )}
            </button>
          );
        })}
      </div>
      
    </div>
  );
};

export default PreCannedQuestions;
