"use client";

import { useState, useRef, useEffect } from "react";
import Button from "@leafygreen-ui/button";
import TextInput from "@leafygreen-ui/text-input";
import Card from "@leafygreen-ui/card";
import { FileText } from "lucide-react";
import Typewriter from "@/components/common/Typewriter";
import CitationsModal from "@/components/modals/CitationsModal";
import ReportModal from "@/components/modals/ReportModal";
import PreCannedQuestions from "./PreCannedQuestions";
import DocumentsAPIClient from "@/utils/api/documents/api-client";
import styles from "./DocumentAssistant.module.css";
import IconButton from '@leafygreen-ui/icon-button';
import Icon from '@leafygreen-ui/icon';
import InfoWizard from "@/components/InfoWizard/InfoWizard";

import { assistantTalkTrack as assistantsTalkTrack } from "../../app/sources/assistants_talkTrack.js";
import { docTalkTrack as docsTalkTrack } from "@/app/sources/docs_talkTrack.js";
import { sourceTalkTrack as sourcesTalkTrack } from "@/app/sources/sources_talkTrack.js";


// Use environment variable for backend URL with fallback
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;


const DocumentAssistant = ({ selectedDocuments, documents, useCase }) => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [completedMessages, setCompletedMessages] = useState({});
  const [showCitationsModal, setShowCitationsModal] = useState(false);
  const [selectedCitations, setSelectedCitations] = useState([]);
  const [workflowSteps, setWorkflowSteps] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const messagesEndRef = useRef(null);
  const [openAssistantHelpModal, setOpenAssistantHelpModal] = useState(false);
  const [openDocsHelpModal, setOpenDocsHelpModal] = useState(false);
  const [agentPersona, setAgentPersona] = useState(null);

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

  // Fetch agent persona when use case changes
  useEffect(() => {
    if (useCase) {
      fetchAgentPersona();
    }
  }, [useCase]);

  const fetchAgentPersona = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/qa/persona?use_case=${useCase}&industry=fsi`);
      if (response.ok) {
        const data = await response.json();
        setAgentPersona(data);
        console.log('Agent persona loaded:', data.persona_name);
      }
    } catch (err) {
      console.error('Error fetching agent persona:', err);
      // Use default if fetch fails
      setAgentPersona(null);
    }
  };

  const getSelectedDocumentNames = () => {
    return documents
      .filter(doc => selectedDocuments.includes(doc.document_id))
      .map(doc => doc.document_name);
  };

  //Copy answers
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        console.log("Copied to clipboard:", text);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const handlePreCannedQuestion = (question) => {
    if (question.id === "capabilities") {
      // Handle capabilities question without requiring documents
      setQuery(question.question);
      handleSubmit(new Event('submit'), question.question);
    } else if (question.id === "memory") {
      // Handle memory question without requiring documents - clear selected documents
      setQuery(question.question);
      handleSubmit(new Event('submit'), question.question);
    } else if (selectedDocuments.length > 0) {
      setQuery(question.question);
      handleSubmit(new Event('submit'), question.question);
    }
  };

  const handleStartNewChat = async () => {
    try {
      // Call backend to start new session
      const res = await fetch(`${API_BASE_URL}/api/qa/new-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        const data = await res.json();
        // Store new session ID
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('di_session_id', data.session_id);
        }
      }
    } catch (error) {
      console.error('Error starting new session:', error);
    }

    // Clear all messages and reset state
    setMessages([]);
    setCompletedMessages({});
    setWorkflowSteps([]);
    setQuery("");
    setShowCitationsModal(false);
    setSelectedCitations([]);
  };


  const handleSubmit = async (e, customQuery = null) => {
    e.preventDefault();

    const questionText = customQuery || query;

    // Allow capabilities and memory questions without documents
    const allowedWithoutDocuments = ["What can you do for me?", "What questions have I asked you so far?"];
    if (!questionText.trim() || (selectedDocuments.length === 0 && !allowedWithoutDocuments.includes(questionText))) {
      return;
    }

    const userMessage = {
      type: 'user',
      content: questionText,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setQuery("");
    setLoading(true);
    setWorkflowSteps([]);

    try {
      // Generate session ID with timestamp format
      const sessionId = typeof window !== 'undefined' ? (sessionStorage.getItem('di_session_id') || (() => {
        const now = new Date();
        const id = `session_${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
        sessionStorage.setItem('di_session_id', id);
        return id;
      })()) : undefined;

      // Use agentic RAG endpoint
      const endpoint = '/api/qa/query';
      // For memory questions, don't filter by documents
      const documentIds = questionText === "What questions have I asked you so far?" ? [] : selectedDocuments;
      const requestBody = {
        query: questionText,
        selected_document_ids: documentIds,
        session_id: sessionId,
        use_case: useCase
      };

      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
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
        // Agentic RAG specific fields
        workflowSteps: data.workflow_steps || [],
        gradingResults: data.grading_results || null,
        queryRewrites: data.query_rewrites || null,
        reasoning: data.reasoning || null,
        isAgenticRAG: true
      };

      // Update workflow steps for display
      if (data.workflow_steps) {
        setWorkflowSteps(data.workflow_steps);
      }
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


  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <div className={styles.titleSectionRow}>
            <img src="/coachGTM_Headshot.png" alt="Coach Headshot" className={styles.titleSectionImage} />
            <div>
              <div className={styles.titleWizard}>
                <h2 className={styles.title}>Document Assistant</h2>
                <InfoWizard
                  open={openAssistantHelpModal}
                  setOpen={setOpenAssistantHelpModal}
                  tooltipText="Tell me more!"
                  iconGlyph="Wizard"
                  sections={assistantsTalkTrack}
                  openModalIsButton={true}
                />
              </div>
              <p className={styles.subtitle}>
                <span className={styles.pulseCircle}></span>
                Available for {formatUseCase(useCase)}
              </p>
            </div>
          </div>
        </div>
        <div className={styles.headerActions}>

          {selectedDocuments.length > 0 && (
            <div className={styles.selectionStatus}>
              <span className={styles.statusIcon}>📄</span>
              <span className={styles.statusText}>
                {selectedDocuments.length} document{selectedDocuments.length > 1 ? 's' : ''} selected
              </span>
            </div>
          )}

          {messages.length > 0 && (
            <Button
              variant="default"
              onClick={handleStartNewChat}
              className={styles.newChatButton}
            >
              Start New Chat
            </Button>
          )}
        </div>
      </div>

      <div className={styles.chatContainer}>
        {/* Sticky Scheduled Report Section */}
        <div className={styles.stickyReportSection}>
          <Card className={styles.reportCard}>
            <div className={styles.reportContent}>
              <div className={styles.reportIcon}>
                <FileText size={24} color="#00684A" />
              </div>
              <div className={styles.reportInfo}>
                <h4 className={styles.reportTitle}>Scheduled Report #1</h4>
                <p className={styles.reportDescription}>Description</p>
              </div>

              <InfoWizard
                open={openDocsHelpModal}
                setOpen={setOpenDocsHelpModal}
                tooltipText="Tell me more!"
                iconGlyph="Wizard"
                sections={docsTalkTrack}
                openModalIsButton={false}
              />

              <div className={styles.reportActions}>
                <Button
                  size="default"
                  variant="default"
                  className={styles.reportButton}
                  onClick={() => setShowReportModal(true)}
                >
                  Open
                </Button>
                {/** <Button 
                  size="default" 
                  variant="primary" 
                  className={styles.reportButton}
                >
                  Download
                </Button> */}
              </div>
            </div>
          </Card>
        </div>

        <div className={`${styles.messagesContainer} ${messages.length > 0 ? styles.hasMessages : ''}`}>

          <div className={`${styles.assistantMessage} ${styles.welcome}`}>
            <div className={styles.messageAvatar}>AI</div>
            <div className={`${styles.messageBubble} ${styles.welcomeBubble}`}>
              <p>{agentPersona?.greeting || "Hi! I'm your AI Assistant. How can I help you?"}</p>
            </div>
          </div>

          {messages.map((message, index) => (
            <div
              key={index}
              className={`${styles.message} ${message.type === 'user' ? styles.userMessage : styles.assistantMessage
                }`}
            >
              {message.type === 'assistant' && (
                <div className={styles.messageAvatar}>AI</div>
              )}
              <div className={message.type === 'assistant' ? styles.messageBubble : styles.userBubble}>
                {message.type === 'assistant' ? (
                  <div className={styles.messageBubbleContent}>
                    <IconButton
                      aria-label="Copy"
                      className={styles.copyButton}
                      onClick={() => handleCopy(message.content)}
                    >
                      <Icon glyph="Copy" />
                    </IconButton>
                    <Typewriter
                      text={message.content}
                      speed={10}
                      messageId={message.messageId}
                      completedMessages={completedMessages}
                      onComplete={() => {
                        setCompletedMessages(prev => ({ ...prev, [message.messageId]: true }));
                      }}
                    />
                    {message.citations && message.citations.length > 0 && completedMessages[message.messageId] && (

                      <Button
                        size="default"
                        variant="default"
                        className={styles.citationsButton}
                        onClick={() => {
                          setSelectedCitations(message.citations);
                          setShowCitationsModal(true);
                        }}
                      >
                        📚 View {message.citations.length} source{message.citations.length > 1 ? 's' : ''}
                      </Button>
                    )}
                  </div>
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
                <div className={styles.loadingMessage}>The agent is thinking</div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions Section - positioned above input */}
        <div className={styles.quickQuestionsSection}>
          <PreCannedQuestions
            onQuestionSelect={handlePreCannedQuestion}
            useCase={useCase}
            hasSelectedDocuments={selectedDocuments.length > 0}
            hasPreviousMessages={messages.length > 1} // More than 1 because first message is AI greeting
            personaQuestions={agentPersona?.example_questions || []}
          />
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

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        industry="fsi"
        useCase={useCase}
      />
    </div>
  );
};

export default DocumentAssistant;
