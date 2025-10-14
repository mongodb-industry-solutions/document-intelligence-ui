"use client";

import { useState, useEffect } from "react";
import Button from "@leafygreen-ui/button";
import { MessageCircle, Search, FileText, Brain, HelpCircle, TrendingUp, HistoryIcon } from "lucide-react";
import styles from "./PreCannedQuestions.module.css";

const SMALL_SCREEN_BREAKPOINT = 1966; // adjust as needed

const PreCannedQuestions = ({ onQuestionSelect, useCase, hasSelectedDocuments, hasPreviousMessages, personaQuestions = [] }) => {
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsSmallScreen(typeof window !== "undefined" ? window.innerWidth <= SMALL_SCREEN_BREAKPOINT : false);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

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
        id: "memory",
        question: "What questions have I asked you so far?",
        icon: HistoryIcon,
        description: "Review your conversation history",
        category: "memory"
      }
    ];

    // Add persona-specific example questions if available
    if (personaQuestions && personaQuestions.length > 0) {
      // Map persona questions to component format (take first 3)
      personaQuestions.slice(0, 3).forEach((question, index) => {
        baseQuestions.push({
          id: `persona_${index}`,
          question: question,
          icon: index === 0 ? Search : (index === 1 ? TrendingUp : Brain),
          description: "Ask about this topic from the documents",
          category: "persona"
        });
      });
    } else {
      // Fallback: generic document question if no persona questions
      baseQuestions.push({
        id: "about",
        question: "What are these documents about?",
        icon: FileText,
        description: "Get a sense of what the documents contain",
        category: "analysis"
      });
    }

    return baseQuestions;
  };

  const questions = getPreCannedQuestions();

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question.id);
    onQuestionSelect(question);
  };

  const handleSelectChange = (e) => {
    const id = e.target.value;
    if (!id) return;
    const question = questions.find(q => q.id === id);
    if (!question) return;

    // compute disabled state same as grid
    const isDisabled = !hasSelectedDocuments && question.category !== "general" &&
                      (question.id !== "memory" || !hasPreviousMessages);
    if (isDisabled) return;

    setSelectedQuestion(id);
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
      fsi: "#9B59B6",
      persona: "#00684A",
      memory: "#666666"
    };
    return colors[category] || "#666";
  };

  return (
    <div className={styles.preCannedContainer}>
      <div className={styles.header}>
        <h3 className={styles.headerTitle}>Quick Questions</h3>
        <p className={styles.headerSubtitle}>
          {hasSelectedDocuments 
            ? "Ask me anything about your selected documents" 
            : "Select documents first to ask questions about them"
          }
        </p>
      </div>

      {isSmallScreen ? (
        <div className={styles.dropdownWrapper}>
          <select
            value={selectedQuestion || ""}
            onChange={handleSelectChange}
            className={styles.dropdownSelect}
            aria-label="Quick questions"
          >
            <option value="">Choose a question...</option>
            {questions.map((question) => {
              const isDisabled = !hasSelectedDocuments && question.category !== "general" &&
                                (question.id !== "memory" || !hasPreviousMessages);
              return (
                <option
                  key={question.id}
                  value={question.id}
                  disabled={isDisabled}
                >
                  {question.question}
                </option>
              );
            })}
          </select>
        </div>
      ) : (
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
      )}
      
    </div>
  );
};

export default PreCannedQuestions;
