"use client";

import { useState, useEffect } from "react";
import { X, Download, FileText, Calendar, Database, AlertCircle } from "lucide-react";
import Button from "@leafygreen-ui/button";
import { useToast } from "@/components/toast/Toast";
import ReportsAPIClient from "@/utils/api/reports/api-client";
import styles from "./ReportModal.module.css";

const ReportModal = ({ isOpen, onClose, industry, useCase }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const { pushToast } = useToast();

  useEffect(() => {
    if (isOpen && industry && useCase) {
      fetchLatestReport();
    }
  }, [isOpen, industry, useCase]);

  const fetchLatestReport = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Log fetch report details
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      console.log('🔍 Fetch Latest Report - Backend API URL:', backendUrl);
      console.log('🏭 Industry:', industry);
      console.log('📋 Use Case:', useCase);
      console.log('🔗 Full URL:', `${backendUrl}/api/reports/latest/${industry}/${useCase}`);
      
      const reportData = await ReportsAPIClient.getLatestReport(industry, useCase);
      setReport(reportData);
    } catch (err) {
      console.error('Error fetching report:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!report) return;

    // Log download details
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    console.log('📥 Download Report - Backend API URL:', backendUrl);
    console.log('🆔 Report ID:', report.report_id);
    console.log('🏭 Industry:', industry);
    console.log('📋 Use Case:', useCase);
    console.log('📌 Status:', report.status);
    if (report.status === "seed") {
      console.log('🔗 Full URL:', `${backendUrl}/api/reports/seed/${industry}/${useCase}/download`);
    } else {
      console.log('🔗 Full URL:', `${backendUrl}/api/reports/${report.report_id}/download`);
    }

    try {
      setDownloading(true);
      
      const blob = await ReportsAPIClient.downloadReport(
        report.report_id, 
        industry, 
        useCase
      );
      
      // Create download link with proper filename
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename: credit_rating_report_20250926.pdf
      const today = new Date();
      const isoDate = today.toISOString().slice(0, 10).replace(/-/g, '');
      const filename = `${useCase}_report_${isoDate}.pdf`;
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      pushToast({
        variant: 'success',
        title: 'Report downloaded',
        description: 'The report has been downloaded successfully.',
        dismissible: true,
      });
    } catch (err) {
      console.error('Error downloading report:', err);
      pushToast({
        variant: 'error',
        title: 'Download failed',
        description: 'Unable to download the report. Please try again.',
        dismissible: true,
      });
    } finally {
      setDownloading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatFileSize = (sizeInKB) => {
    if (sizeInKB < 1024) {
      return `${sizeInKB.toFixed(1)} KB`;
    }
    return `${(sizeInKB / 1024).toFixed(2)} MB`;
  };

  const generateAdhocReport = async () => {
    setLoading(true);
    setError(null);
    
    // Log report generation details
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    console.log('📊 Generate Ad-hoc Report - Backend API URL:', backendUrl);
    console.log('🏭 Industry:', industry);
    console.log('📋 Use Case:', useCase);
    console.log('🔗 Full URL:', `${backendUrl}/api/reports/generate-adhoc`);
    
    try {
      const result = await ReportsAPIClient.generateAdhocReport(industry, useCase);
      if (result.status === "success") {
        pushToast({
          variant: "success",
          title: "Report Generated",
          description: "Ad-hoc report generated successfully.",
          dismissible: true,
        });
        // Refresh the report
        await fetchLatestReport();
      } else {
        throw new Error(result.message || "Failed to generate report");
      }
    } catch (err) {
      console.error("Error generating ad-hoc report:", err);
      setError(err.message);
      pushToast({
        variant: "error",
        title: "Generation Failed",
        description: "Could not generate ad-hoc report. Please try again.",
        dismissible: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.titleSection}>
              <FileText size={24} color="#00684A" />
              <div>
                <h2 className={styles.title}>
                  {useCase ? useCase.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Scheduled'} Report
                </h2>
                <p className={styles.subtitle}>
                  {industry ? `${industry.toUpperCase()} Industry` : 'Automated Report'}
                </p>
              </div>
            </div>

            <button className={styles.closeButton} onClick={onClose}>×</button>
            
          </div>
        </div>

        <div className={styles.content}>
          {loading && (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <div className={styles.loadingContent}>
                <h3>Generating Report</h3>
                <p>This process may take a few minutes to complete.</p>
                <p className={styles.loadingNote}>
                  You can safely close this modal - the report will be available once generation is complete.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className={styles.error}>
              <AlertCircle size={20} color="#E53E3E" />
              <div>
                <h3>Error loading report</h3>
                <p>{error}</p>
                <Button
                  variant="default"
                  size="small"
                  onClick={fetchLatestReport}
                  className={styles.retryButton}
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {!loading && !error && !report && (
            <div className={styles.empty}>
              <FileText size={48} color="#A0AEC0" />
              <h3>No report available</h3>
              <p>No scheduled report has been generated yet for this use case.</p>
              <div className={styles.adhocActions}>
                <Button
                  variant="primary"
                  onClick={generateAdhocReport}
                  disabled={loading}
                >
                  {loading ? "Generating..." : "Generate Report Now"}
                </Button>
              </div>
            </div>
          )}

          {!loading && !error && report && (
            <div className={styles.reportInfo}>
              <div className={styles.reportHeader}>
                <div className={styles.reportIcon}>
                  <FileText size={32} color={report.status === "seed" ? "#9CA3AF" : "#00684A"} />
                </div>
                <div className={styles.reportDetails}>
                  <h3 className={styles.reportTitle}>
                    {useCase.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Report
                    {report.status === "seed" && (
                      <span className={styles.fallbackBadge}>Fallback</span>
                    )}
                  </h3>
                  <p className={styles.reportDescription}>
                    {report.status === "seed" 
                      ? "Using fallback report (generated report unavailable)" 
                      : "Automated report generated from document analysis"
                    }
                  </p>
                </div>
              </div>

              <div className={styles.reportMeta}>
                <div className={styles.metaItem}>
                  <Calendar size={16} color="#718096" />
                  <span>
                    {report.status === "seed" ? "Available: " : "Generated: "}
                    {formatDate(report.generated_at)}
                  </span>
                </div>
                <div className={styles.metaItem}>
                  <FileText size={16} color="#718096" />
                  <span>Size: {formatFileSize(report.file_size_kb)}</span>
                </div>
                {report.status === "seed" && (
                  <div className={styles.metaItem}>
                    <AlertCircle size={16} color="#F59E0B" />
                    <span className={styles.warningText}>
                      Original report unavailable - using fallback
                    </span>
                  </div>
                )}
              </div>

              <div className={styles.actions}>
                <Button
                  variant="primary"
                  size="default"
                  leftGlyph={<Download size={16} />}
                  onClick={handleDownload}
                  disabled={downloading}
                  className={styles.downloadButton}
                >
                  {downloading ? 'Downloading...' : 'Download Report'}
                </Button>
                {report.status === "seed" && (
                  <Button
                    variant="default"
                    size="default"
                    onClick={generateAdhocReport}
                    disabled={loading}
                    className={styles.refreshButton}
                  >
                    {loading ? "Generating..." : "Generate Fresh Report"}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
