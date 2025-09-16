"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import styles from "./DataSources.module.css";
import Button from "@leafygreen-ui/button";
import Card from "@leafygreen-ui/card";
import { RefreshCw } from "lucide-react";
import DocumentsAPIClient from "@/utils/api/documents/api-client";
import { useSelection } from "@/contexts/SelectionContext";
import ProgressIndicator from "@/components/progress/ProgressIndicator";

const DataSources = ({ onContinue, onBack }) => {
  const router = useRouter();
  const { useCase } = useSelection();
  const [selectedSources, setSelectedSources] = useState([]);
  const [selectedExample, setSelectedExample] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [workflow, setWorkflow] = useState(null); // { id, status }
  const [logs, setLogs] = useState([]);
  const [canContinue, setCanContinue] = useState(false);

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

  // Derived
  const sourcesSelected = selectedSources.length > 0;

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

  const formatUtc = (d) => {
    // Always convert to UTC and render yyyy-mm-dd HH:MM:SS UTC
    const date = new Date(d);
    const pad = (n) => String(n).padStart(2, '0');
    const yyyy = date.getUTCFullYear();
    const mm = pad(date.getUTCMonth() + 1);
    const dd = pad(date.getUTCDate());
    const HH = pad(date.getUTCHours());
    const MM = pad(date.getUTCMinutes());
    const SS = pad(date.getUTCSeconds());
    return `${yyyy}-${mm}-${dd} ${HH}:${MM}:${SS} UTC`;
  };

  const appendLog = (message) => {
    setLogs((prev) => [...prev, `[${formatUtc(new Date())}] ${message}`]);
  };

  const handleSyncSources = async () => {
    if (!useCase || !sourcesSelected || isSyncing) return;
    setIsSyncing(true);
    setCanContinue(false);
    setLogs([]);
    appendLog(`Starting ingestion for use case "${useCase}" with sources: ${selectedSources.join(', ')}`);
    try {
      const start = await DocumentsAPIClient.startIngestion({
        useCase,
        sources: selectedSources.map((s) => ({ local: '@local', s3: '@s3', 'google-drive': '@gdrive' }[s] || s)),
        industry: 'fsi',
      });
      setWorkflow({ id: start.workflow_id, status: start.status });
      appendLog(`Workflow started: ${start.workflow_id}`);

      // Poll logs until completed/error/cancelled detected via logs
      const poll = async () => {
        if (!start.workflow_id) return;
        try {
          const logRes = await DocumentsAPIClient.getIngestionLogs(start.workflow_id, 500);
          if (logRes && Array.isArray(logRes.logs)) {
            const pretty = logRes.logs.map(l => {
              const ts = l.timestamp ? formatUtc(l.timestamp) : formatUtc(Date.now());
              return `[${ts}] ${l.agent ? l.agent + ' - ' : ''}${l.message}`;
            });
            setLogs(prev => {
              const seen = new Set(prev);
              const combined = [...prev];
              pretty.forEach(line => { if (!seen.has(line)) { seen.add(line); combined.push(line); } });
              return combined;
            });
            // Detect completion across all seen lines
            const done = pretty.some(line => /completed successfully/i.test(line));
            if (done) {
              appendLog('Ingestion completed successfully.');
              setCanContinue(true);
              setIsSyncing(false);
              return; // Stop polling
            }
          }
          setTimeout(poll, 2000);
        } catch (err) {
          appendLog(`Polling error: ${err.message}`);
          setIsSyncing(false);
        }
      };
      setTimeout(poll, 1200);
    } catch (err) {
      appendLog(`Failed to start ingestion: ${err.message}`);
      setIsSyncing(false);
    }
  };

  const handleContinue = () => {
    if (canContinue && onContinue) {
      onContinue({ sources: selectedSources, example: null });
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
          Set-up your Sources
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 className={styles.examplesTitle}>Sync sources and show progress</h2>
          <Button
            size="large"
            leftGlyph={<RefreshCw size={16} />}
            onClick={handleSyncSources}
            disabled={!sourcesSelected || isSyncing}
          >
            {isSyncing ? 'Syncing…' : 'Sync Sources'}
          </Button>
        </div>

        <div style={{
          background: '#0b1220',
          color: '#e6edf3',
          borderRadius: 8,
          padding: 12,
          height: 280,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          fontSize: 12,
          overflowY: 'auto',
          border: '1px solid #1f2a44'
        }} aria-live="polite" role="log">
          {logs.length === 0 ? (
            <div style={{ opacity: 0.75 }}>Select at least one source, then click "Sync Sources" to start ingestion.</div>
          ) : (
            logs.map((line, idx) => (<div key={idx}>{line}</div>))
          )}
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
          variant={canContinue ? "primary" : "default"}
          size="large"
          onClick={handleContinue}
          disabled={!canContinue}
          className={styles.continueButton}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default DataSources;
