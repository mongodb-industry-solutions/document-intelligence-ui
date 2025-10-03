// Client-side API service for document intelligence operations

// Use environment variable for backend URL with fallback
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const documentService = {
  // Upload PDF document
  async uploadDocument(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload document');
    }
    
    return response.json();
  },

  // Get list of uploaded files
  async getFiles() {
    const response = await fetch(`${API_BASE_URL}/api/files`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch files');
    }
    
    return response.json();
  },

  // Delete a file
  async deleteFile(filename) {
    const response = await fetch(`${API_BASE_URL}/api/files/${filename}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete file');
    }
    
    return response.json();
  },

  // Submit a question for document comparison
  async submitQuestion(question, files) {
    const response = await fetch(`${API_BASE_URL}/query-stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, files }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to process question');
    }
    
    return response;
  },

  // Get document preview
  async getPreview(filename, chunk) {
    const response = await fetch(`${API_BASE_URL}/api/preview?filename=${filename}&chunk=${chunk}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch preview');
    }
    
    return response.json();
  }
};
