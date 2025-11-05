// Direct backend API calls (no Next.js proxy)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * Upload API client for document upload functionality
 */
class UploadAPIClient {
  /**
   * Upload documents to the system
   * @param {Object} params - Upload parameters
   * @param {File[]} params.files - Array of files to upload (max 1)
   * @param {string} params.industry - Industry type (default: fsi)
   * @param {string} params.useCase - Use case (default: credit_rating)
   * @returns {Promise<Object>} Upload response
   */
  static async uploadDocuments({ files, industry = 'fsi', useCase = 'credit_rating' }) {
    try {
      // Validate files
      if (!files || files.length === 0) {
        throw new Error('No files selected');
      }

      if (files.length > 1) {
        throw new Error('Only one file can be uploaded at a time');
      }

      // Create FormData
      const formData = new FormData();
      
      // Add single file
      formData.append('files', files[0]);

      // Add other fields
      formData.append('industry', industry);
      formData.append('use_case', useCase);

      const response = await fetch(`${API_BASE_URL}/api/upload/documents`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to upload documents');
      }

      return await response.json();
    } catch (error) {
      console.error('Error uploading documents:', error);
      throw error;
    }
  }

  /**
   * Get available industries
   * @returns {Promise<string[]>} List of industries
   */
  static async getIndustries() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/upload/industries`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to fetch industries');
      }

      const data = await response.json();
      return data.industries || [];
    } catch (error) {
      console.error('Error fetching industries:', error);
      throw error;
    }
  }

  /**
   * Get storage information
   * @returns {Promise<Object>} Storage info
   */
  static async getStorageInfo() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/upload/storage-info`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to fetch storage info');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching storage info:', error);
      throw error;
    }
  }

  /**
   * List documents for a specific industry and use case
   * @param {string} industry - Industry type
   * @param {string} useCase - Use case (optional)
   * @returns {Promise<Object>} List of documents
   */
  static async listUploadedDocuments(industry, useCase) {
    try {
      let url = `${API_BASE_URL}/api/upload/list/${industry}`;
      if (useCase) {
        const queryParams = new URLSearchParams({ use_case: useCase });
        url += `?${queryParams}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to list documents');
      }

      return await response.json();
    } catch (error) {
      console.error('Error listing uploaded documents:', error);
      throw error;
    }
  }

  /**
   * Delete an uploaded document
   * @param {string} industry - Industry type
   * @param {string} filename - File name to delete
   * @returns {Promise<Object>} Delete response
   */
  static async deleteUploadedDocument(industry, filename) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/upload/delete/${industry}/${filename}`, {
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
}

export default UploadAPIClient;
