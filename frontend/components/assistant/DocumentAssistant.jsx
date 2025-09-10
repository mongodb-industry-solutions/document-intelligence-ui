"use client";

import { useState, useRef, useEffect } from "react";
import Button from "@leafygreen-ui/button";
import TextInput from "@leafygreen-ui/text-input";
import Card from "@leafygreen-ui/card";
import { FileText } from "lucide-react";
import Typewriter from "@/components/common/Typewriter";
import CitationsModal from "@/components/modals/CitationsModal";
import DocumentsAPIClient from "@/utils/api/documents/api-client";
import styles from "./DocumentAssistant.module.css";

// Use environment variable for backend URL with fallback
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const DocumentAssistant = ({ selectedDocuments, documents, useCase }) => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [completedMessages, setCompletedMessages] = useState({});
  const [showCitationsModal, setShowCitationsModal] = useState(false);
  const [selectedCitations, setSelectedCitations] = useState([]);
  const messagesEndRef = useRef(null);
  
  const formatUseCase = (useCase) => {
    if (!useCase) return '';
    return useCase
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getSelectedDocumentNames = () => {
    return documents
      .filter(doc => selectedDocuments.includes(doc.document_id))
      .map(doc => doc.document_name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!query.trim() || selectedDocuments.length === 0) {
      return;
    }

    const userMessage = {
      type: 'user',
      content: query,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setQuery("");
    setLoading(true);

    try {
      // Generate session ID with timestamp format
      const sessionId = typeof window !== 'undefined' ? (sessionStorage.getItem('di_session_id') || (() => {
        const now = new Date();
        const id = `session_${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
        sessionStorage.setItem('di_session_id', id);
        return id;
      })()) : undefined;

      const res = await fetch(`${API_BASE_URL}/api/qa/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          selected_documents: selectedDocuments,
          max_chunks: 10,
          session_id: sessionId,
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Failed to get answer');
      }
      const data = await res.json();

      const assistantMessage = {
        type: 'assistant',
        content: data.answer,
        timestamp: new Date().toISOString(),
        sources: data.source_chunks || [],
        documents: data.source_documents || [],
        confidence: data.confidence,
        citations: data.citations || [],
        messageId: `msg_${Date.now()}`,
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      const assistantMessage = {
        type: 'assistant',
        content: `Error: ${err.message}`,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedQuestions = [
    "What are the main differences between the documents?",
    "Summarize the key findings from these reports",
    "What are the risk factors mentioned?",
    "Compare the financial metrics across documents"
  ];

  const suggestedActions = [
    {
      icon: "📄",
      title: "Summarize",
      description: "Provide a summary of the selected documents.",
    },
    {
      icon: "🔍",
      title: "Compare",
      description: "Compare key metrics across documents.",
    },
    {
      icon: "📊",
      title: "Extract Data",
      description: "Extract tables and figures.",
    },
  ];

  const handleSuggestedQuestion = (question) => {
    setQuery(question);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h2 className={styles.title}>Document Assistant</h2>
          <p className={styles.subtitle}>For {formatUseCase(useCase)}</p>
        </div>
        {selectedDocuments.length > 0 && (
          <div className={styles.selectionStatus}>
            <span className={styles.statusIcon}>📄</span>
            <span className={styles.statusText}>
              {selectedDocuments.length} document{selectedDocuments.length > 1 ? 's' : ''} selected
            </span>
          </div>
        )}
      </div>

      <div className={styles.chatContainer}>
        <div className={`${styles.messagesContainer} ${messages.length > 0 ? styles.hasMessages : ''}`}>
          <div className={`${styles.assistantMessage} ${styles.welcome}`}>
            <div className={styles.messageAvatar}>AI</div>
            <div className={`${styles.messageBubble} ${styles.welcomeBubble}`}>
              <p>Hi! I'm your AI Assistant. How can I help you?</p>
              {selectedDocuments.length === 0 ? (
                <p>Select documents to start asking questions.</p>
              ) : (
                <p>Perhaps, to start with, have a look at the pre-defined report base on your document selection.</p>
              )}
              
              <Card className={`${styles.reportCard} ${selectedDocuments.length === 0 ? styles.disabled : ''}`}>
                <div className={styles.reportContent}>
                  <div className={styles.reportIcon}>
                    <FileText size={24} color="#00684A" />
                  </div>
                  <div className={styles.reportInfo}>
                    <h4 className={styles.reportTitle}>Scheduled Report #1</h4>
                    <p className={styles.reportDescription}>Description</p>
                  </div>
                  <div className={styles.reportActions}>
                    <Button 
                      size="default" 
                      variant="default" 
                      className={styles.reportButton}
                      disabled={selectedDocuments.length === 0}
                    >
                      Open
                    </Button>
                    <Button 
                      size="default" 
                      variant="primary" 
                      className={styles.reportButton}
                      disabled={selectedDocuments.length === 0}
                    >
                      Download
                    </Button>
                  </div>
                </div>
              </Card>
              
              <div className={styles.suggestedActions}>
                <h4>Suggested Actions</h4>
                <div className={styles.actionCards}>
                  {suggestedActions.map((action, index) => (
                    <Card 
                      key={index} 
                      className={`${styles.actionCard} ${selectedDocuments.length === 0 ? styles.disabled : ''}`}
                      onClick={() => selectedDocuments.length > 0 && handleSuggestedQuestion(`${action.title} the selected documents`)}
                      contentStyle={selectedDocuments.length > 0 ? "clickable" : ""}
                    >
                      <div className={styles.actionIcon}>{action.icon}</div>
                      <h5 className={styles.actionTitle}>{action.title}</h5>
                      <p className={styles.actionDescription}>{action.description}</p>
                    </Card>
                  ))}
                </div>
              </div>

              <div className={styles.suggestions}>
                <h4>Suggested Questions</h4>
                <div className={styles.suggestionsList}>
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      className={`${styles.suggestionButton} ${selectedDocuments.length === 0 ? styles.disabled : ''}`}
                      onClick={() => selectedDocuments.length > 0 && handleSuggestedQuestion(question)}
                      disabled={selectedDocuments.length === 0}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${styles.message} ${
                message.type === 'user' ? styles.userMessage : styles.assistantMessage
              }`}
            >
              {message.type === 'assistant' && (
                <div className={styles.messageAvatar}>AI</div>
              )}
              <div className={message.type === 'assistant' ? styles.messageBubble : styles.userBubble}>
                {message.type === 'assistant' ? (
                  <>
                    <Typewriter 
                      text={message.content} 
                      speed={10}
                      messageId={message.messageId}
                      completedMessages={completedMessages}
                      onComplete={() => {
                        setCompletedMessages(prev => ({ ...prev, [message.messageId]: true }));
                      }}
                    />
                    {message.citations && message.citations.length > 0 && (
                      <button 
                        className={styles.citationsButton}
                        onClick={() => {
                          setSelectedCitations(message.citations);
                          setShowCitationsModal(true);
                        }}
                      >
                        📚 View {message.citations.length} source{message.citations.length > 1 ? 's' : ''}
                      </button>
                    )}
                  </>
                ) : (
                  message.content
                )}
                <div className={styles.messageTime}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className={styles.assistantMessage}>
              <div className={styles.messageAvatar}>AI</div>
              <div className={styles.messageBubble}>
                <div className={styles.loadingDots}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className={styles.inputForm}>
          <TextInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type your question"
            disabled={selectedDocuments.length === 0 || loading}
            className={styles.input}
            label="Type your question"
          />
          <Button
            type="submit"
            variant="primary"
            size="default"
            disabled={!query.trim() || selectedDocuments.length === 0 || loading}
            className={styles.submitButton}
          >
            Ask
          </Button>
        </form>
      </div>
      
      <CitationsModal 
        isOpen={showCitationsModal}
        onClose={() => setShowCitationsModal(false)}
        citations={selectedCitations}
      />
    </div>
  );
};

export default DocumentAssistant;
