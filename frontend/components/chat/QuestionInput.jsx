"use client";

import { useState } from "react";
import styles from "./QuestionInput.module.css";
import Button from "@leafygreen-ui/button";

function QuestionInput({ onSubmit, isLoading, suggestedQuestions = [] }) {
  const [question, setQuestion] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (question.trim() && !isLoading) {
      onSubmit(question);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuestion(suggestion);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.stepTitle}>2. Ask a question</h2>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g., What are the main differences between the documents?"
          className={styles.input}
          disabled={isLoading}
          aria-label="Enter your question about the documents"
        />
        
        <Button
          type="submit"
          variant="primary"
          darkMode={true}
          disabled={!question.trim() || isLoading}
          className={styles.submitButton}
        >
          {isLoading ? (
            <>
              <span className={styles.spinner}></span>
              Processing...
            </>
          ) : (
            'Ask'
          )}
        </Button>
      </form>

      {suggestedQuestions.length > 0 && !isLoading && (
        <div className={styles.suggestions}>
          <h3 className={styles.suggestionsTitle}>Suggested Questions</h3>
          <div className={styles.suggestionsList}>
            {suggestedQuestions.map((suggestion, index) => (
              <button
                key={index}
                className={styles.suggestionButton}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {isLoading && (
        <div className={styles.loadingMessage}>
          <span className={styles.loadingSpinner}></span>
          <p>Ingesting documents...</p>
        </div>
      )}
    </div>
  );
}

export default QuestionInput;
