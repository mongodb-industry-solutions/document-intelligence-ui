// Use environment variable for backend URL with fallback
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * Document API client for interacting with backend document endpoints
 */
class DocumentsAPIClient {
  /**
   * List documents filtered by use case and sources
   * @param {Object} params - Query parameters
   * @param {string} params.useCase - Use case filter (credit_rating, payment_exception, etc.)
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

      const response = await fetch(`${API_BASE_URL}/api/documents/list?${queryParams}`, {
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
      const response = await fetch(`${API_BASE_URL}/api/documents/${documentId}`, {
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
   * Delete a document
   * @param {string} documentId - Document ID to delete
   * @returns {Promise<Object>} Delete response
   */
  static async deleteDocument(documentId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/documents/${documentId}`, {
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
      const response = await fetch(`${API_BASE_URL}/api/documents/stats/summary`, {
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
}

export default DocumentsAPIClient;
