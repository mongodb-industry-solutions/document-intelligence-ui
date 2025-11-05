// Use Next.js API routes as proxy to backend (server-side)
// This avoids CORS issues with cross-origin requests in Kanopy/K8s deployments
const API_BASE_URL = '/api';

/**
 * Document API client for interacting with backend document endpoints
 */
class DocumentsAPIClient {
  /**
   * List documents filtered by use case and sources
   * @param {Object} params - Query parameters
   * @param {string} params.useCase - Use case filter (credit_rating, payment_processing_exception, etc.)
   * @param {string[]} params.sources - Array of sources (@local, @s3, @gdrive)
   * @param {string} params.status - Document status filter (default: completed)
   * @param {number} params.limit - Maximum number of documents to return
   * @param {number} params.skip - Number of documents to skip
   * @returns {Promise<Object>} Document list response
   */
  static async listDocuments({ useCase, sources, status = 'completed', limit = 100, skip = 0 }) {
    try {
      // Build query string
      const queryParams = new URLSearchParams({
        use_case: useCase,
        status,
        limit: limit.toString(),
        skip: skip.toString(),
      });

      // Add sources array to query params
      sources.forEach(source => {
        queryParams.append('sources', source);
      });

      const response = await fetch(`${API_BASE_URL}/documents/list?${queryParams}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to fetch documents');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  }

  /**
   * Get metadata for a specific document
   * @param {string} documentId - Document ID
   * @returns {Promise<Object>} Document metadata
   */
  static async getDocumentMetadata(documentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to fetch document metadata');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching document metadata:', error);
      throw error;
    }
  }

  /**
   * Get raw MongoDB document for display purposes
   * @param {string} documentId - Document ID
   * @returns {Promise<Object>} Raw MongoDB document
   */
  static async getRawDocument(documentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/${documentId}/raw`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to fetch raw document');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching raw document:', error);
      throw error;
    }
  }

  /**
   * Get raw MongoDB chunk for display purposes
   * @param {string} chunkId - Chunk's MongoDB _id
   * @returns {Promise<Object>} Raw MongoDB chunk document
   */
  static async getRawChunk(chunkId) {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/chunks/${chunkId}/raw`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to fetch raw chunk');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching raw chunk:', error);
      throw error;
    }
  }

  /**
   * Delete a document
   * @param {string} documentId - Document ID to delete
   * @returns {Promise<Object>} Delete response
   */
  static async deleteDocument(documentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to delete document');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  /**
   * Get collection statistics
   * @returns {Promise<Object>} Collection stats
   */
  static async getCollectionStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/documents/stats`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to fetch collection stats');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching collection stats:', error);
      throw error;
    }
  }

  /**
   * Check if a document already exists and is ready for interaction
   * @param {string} documentName - filename with extension
   * @returns {Promise<{exists_in_db:boolean, ready:boolean}>}
   */
  static async documentExists(documentName) {
    const params = new URLSearchParams({ document_name: documentName });
    const response = await fetch(`${API_BASE_URL}/documents/exists?${params}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Failed to check document existence');
    }
    return response.json();
  }

  /**
   * Start ingestion workflow based on selected sources and use case
   * @param {Object} params
   * @param {string} params.useCase - Use case id (e.g., credit_rating)
   * @param {string[]} params.sources - Array like ['@local','@s3','@gdrive']
   * @param {string} [params.industry='fsi'] - Industry code (defaults to fsi)
   * @returns {Promise<{workflow_id:string,status:string,message:string}>}
   */
  static async startIngestion({ useCase, sources, industry = 'fsi' }) {
    // Build source_paths from selection
    const source_paths = [];
    const add = (prefix) => {
      // Local requires full container path, S3/GDrive use industry/use_case
      if (prefix === '@local') {
        source_paths.push(`@local@/docs/${industry}/${useCase}`);
      } else if (prefix === '@s3') {
        source_paths.push(`@s3@${industry}/${useCase}`);
      } else if (prefix === '@gdrive') {
        source_paths.push(`@gdrive@${industry}/${useCase}`);
      }
    };
    (sources || []).forEach(add);

    const workflow_id = `${industry}_${useCase}_${Date.now()}`;

    const response = await fetch(`${API_BASE_URL}/ingestion/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source_paths, workflow_id }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Failed to start ingestion');
    }

    return response.json();
  }

  /**
   * Poll ingestion workflow status
   * @param {string} workflowId
   * @returns {Promise<Object>} IngestionStatus
   */
  static async getIngestionStatus(workflowId) {
    const response = await fetch(`${API_BASE_URL}/ingestion/status/${workflowId}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || 'Failed to fetch ingestion status');
    }
    return response.json();
  }

  /**
   * Fetch recent workflow logs (INFO) for console
   * @param {string} workflowId
   * @param {number} [limit=200]
   */
  static async getIngestionLogs(workflowId, limit = 200) {
    const response = await fetch(`${API_BASE_URL}/ingestion/logs/${workflowId}?limit=${limit}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (!response.ok) {
      return { logs: [] };
    }
    return response.json();
  }
}

export default DocumentsAPIClient;
