"use client";

import { useEffect, useRef } from 'react';
import { Search, FileSearch, CheckCircle, RotateCcw, PenLine, Sparkles } from 'lucide-react';
import styles from './ThinkingProcess.module.css';

const ThinkingProcess = ({ logs = [], sessionId }) => {
  const stepsEndRef = useRef(null);

  // Auto-scroll to latest step
  useEffect(() => {
    stepsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getStepIcon = (stepType) => {
    switch (stepType) {
      case 'query_analyze':
        return <Search size={14} className={styles.stepIcon} />;
      case 'query_prepare':
      case 'retrieve_complete':
        return <FileSearch size={14} className={styles.stepIcon} />;
      case 'grade_start':
      case 'grade_relevant':
        return <CheckCircle size={14} className={styles.stepIcon} />;
      case 'grade_irrelevant':
      case 'rewrite':
        return <RotateCcw size={14} className={styles.stepIcon} />;
      case 'answer_generate':
        return <PenLine size={14} className={styles.stepIcon} />;
      case 'complete':
        return <Sparkles size={14} className={styles.stepIcon} />;
      default:
        return <div className={styles.stepDot}></div>;
    }
  };

  const formatMessage = (message) => {
    // Clean up emoji and formatting from log messages
    return message
      .replace(/🤖|🎯|🎭|📋|🧠|🔍|📊|✅|❌|✏️|📝/g, '')
      .trim();
  };

  const getStepClass = (stepType) => {
    if (stepType === 'complete' || stepType === 'grade_relevant') {
      return `${styles.thinkingStep} ${styles.stepSuccess}`;
    } else if (stepType === 'grade_irrelevant') {
      return `${styles.thinkingStep} ${styles.stepWarning}`;
    }
    return styles.thinkingStep;
  };

  return (
    <div className={styles.thinkingContainer}>
      <div className={styles.thinkingHeader}>
        <img 
          src="/animated_bot.gif" 
          alt="Agent thinking"
          className={styles.thinkingGif}
        />
        <span className={styles.thinkingTitle}>Agent is thinking...</span>
      </div>
      
      {logs.length > 0 && (
        <div className={styles.thinkingSteps}>
          {logs.map((log, idx) => (
            <div key={idx} className={getStepClass(log.step_type)}>
              {getStepIcon(log.step_type)}
              <span className={styles.stepMessage}>
                {formatMessage(log.message)}
              </span>
            </div>
          ))}
          <div ref={stepsEndRef} />
        </div>
      )}
    </div>
  );
};

export default ThinkingProcess;

