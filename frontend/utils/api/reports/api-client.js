// Reports API client for scheduled reports operations

// Use environment variable for backend URL with fallback
const API_BASE_URL = process.env.NEXT_PUBLIC_INTERNAL_API_URL || 
                    process.env.NEXT_PUBLIC_API_URL || 
                    "http://localhost:8080";

export const ReportsAPIClient = {
  // Get latest report for a specific industry/use case
  async getLatestReport(industry, useCase) {
    const response = await fetch(`${API_BASE_URL}/api/reports/latest/${industry}/${useCase}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null; // No report found
      }
      throw new Error('Failed to fetch latest report');
    }
    
    return response.json();
  },

  // Get all available reports with filtering
  async listReports(filters = {}) {
    const queryParams = new URLSearchParams();
    
    if (filters.industry) queryParams.append('industry', filters.industry);
    if (filters.useCase) queryParams.append('use_case', filters.useCase);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.limit) queryParams.append('limit', filters.limit);
    
    const response = await fetch(`${API_BASE_URL}/api/reports/list?${queryParams}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch reports');
    }
    
    return response.json();
  },

  // Download a specific report
  async downloadReport(reportId, industry = null, useCase = null) {
    // Handle seed report downloads
    if (reportId === "seed" && industry && useCase) {
      const response = await fetch(`${API_BASE_URL}/api/reports/seed/${industry}/${useCase}/download`);
      
      if (!response.ok) {
        throw new Error('Failed to download seed report');
      }
      
      return response.blob();
    }
    
    // Handle regular report downloads
    const response = await fetch(`${API_BASE_URL}/api/reports/${reportId}/download`);
    
    if (!response.ok) {
      throw new Error('Failed to download report');
    }
    
    return response.blob();
  },

  // Get report preview/info
  async getReportInfo(reportId) {
    const response = await fetch(`${API_BASE_URL}/api/reports/${reportId}/preview`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch report info');
    }
    
    return response.json();
  },

  // Generate a new report manually
  async generateReport(industry, useCase) {
    const response = await fetch(`${API_BASE_URL}/api/reports/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ industry, use_case: useCase }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate report');
    }
    
    return response.json();
  },

  // Generate an ad-hoc report (stored both as scheduled and seed)
  async generateAdhocReport(industry, useCase) {
    const response = await fetch(`${API_BASE_URL}/api/reports/generate-adhoc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ industry, use_case: useCase }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate ad-hoc report');
    }
    
    return response.json();
  },

  // Get scheduler status
  async getSchedulerStatus() {
    const response = await fetch(`${API_BASE_URL}/api/reports/status`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch scheduler status');
    }
    
    return response.json();
  },

  // Get available industries and use cases
  async getAvailableIndustries() {
    const response = await fetch(`${API_BASE_URL}/api/reports/industries`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch available industries');
    }
    
    return response.json();
  },

  // Clean up orphaned reports
  async cleanupOrphanedReports() {
    const response = await fetch(`${API_BASE_URL}/api/reports/cleanup-orphaned`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Failed to cleanup orphaned reports');
    }
    
    return response.json();
  }
};

export default ReportsAPIClient;
