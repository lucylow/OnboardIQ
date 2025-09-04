const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

class FoxitService {
  constructor(config = {}) {
    this.config = {
      baseUrl: config.baseUrl || process.env.FOXIT_API_BASE_URL || 'http://localhost:3001/api/foxit',
      apiKey: config.apiKey || process.env.FOXIT_API_KEY,
      timeout: config.timeout || 30000,
      ...config
    };
    
    this.isConnected = false;
    this.initialize();
  }

  async initialize() {
    try {
      // Test connection
      const response = await axios.get(`${this.config.baseUrl}/health`, {
        timeout: this.config.timeout
      });
      
      if (response.data.success) {
        this.isConnected = true;
        console.log('✅ Foxit service initialized');
      } else {
        throw new Error('Foxit service health check failed');
      }
    } catch (error) {
      console.error('❌ Foxit service initialization failed:', error.message);
      this.isConnected = false;
    }
  }

  async generateDocument(templateId, data, options = {}) {
    try {
      console.log(`📄 Generating document with template: ${templateId}`);
      
      const response = await axios.post(`${this.config.baseUrl}/generate-document`, {
        template_id: templateId,
        data,
        options
      }, {
        timeout: this.config.timeout,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        console.log(`✅ Document generated: ${response.data.document_id}`);
        return response.data;
      } else {
        throw new Error(response.data.error || 'Document generation failed');
      }
    } catch (error) {
      console.error('❌ Document generation failed:', error.message);
      throw error;
    }
  }

  async downloadDocument(documentId, options = {}) {
    try {
      console.log(`📥 Downloading document: ${documentId}`);
      
      const response = await axios.get(`${this.config.baseUrl}/documents/${documentId}/file`, {
        timeout: this.config.timeout,
        responseType: 'arraybuffer',
        headers: {
          'Accept': 'application/pdf'
        }
      });
      
      if (response.status === 200) {
        console.log(`✅ Document downloaded: ${documentId}`);
        
        // Return the file buffer and metadata
        return {
          success: true,
          documentId,
          fileBuffer: response.data,
          contentType: response.headers['content-type'],
          contentLength: response.headers['content-length'],
          filename: `document_${documentId}.pdf`
        };
      } else {
        throw new Error('Download failed');
      }
    } catch (error) {
      console.error('❌ Document download failed:', error.message);
      throw error;
    }
  }

  async getDocumentMetadata(documentId) {
    try {
      console.log(`📊 Getting document metadata: ${documentId}`);
      
      const response = await axios.get(`${this.config.baseUrl}/documents/${documentId}/metadata`, {
        timeout: this.config.timeout
      });
      
      if (response.data.success) {
        console.log(`✅ Document metadata retrieved: ${documentId}`);
        return response.data;
      } else {
        throw new Error(response.data.error || 'Failed to get metadata');
      }
    } catch (error) {
      console.error('❌ Metadata retrieval failed:', error.message);
      throw error;
    }
  }

  async getTemplates() {
    try {
      console.log('📋 Getting available templates');
      
      const response = await axios.get(`${this.config.baseUrl}/templates`, {
        timeout: this.config.timeout
      });
      
      if (response.data.success) {
        console.log(`✅ Templates retrieved: ${response.data.templates.length} templates`);
        return response.data;
      } else {
        throw new Error(response.data.error || 'Failed to get templates');
      }
    } catch (error) {
      console.error('❌ Template retrieval failed:', error.message);
      throw error;
    }
  }

  async processPdfWorkflow(workflowId, documentIds, operations, options = {}) {
    try {
      console.log(`🔄 Processing PDF workflow: ${workflowId}`);
      
      const response = await axios.post(`${this.config.baseUrl}/process-pdf-workflow`, {
        workflow_id: workflowId,
        document_ids: documentIds,
        operations,
        options
      }, {
        timeout: this.config.timeout,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        console.log(`✅ PDF workflow completed: ${response.data.processed_document_id}`);
        return response.data;
      } else {
        throw new Error(response.data.error || 'PDF workflow failed');
      }
    } catch (error) {
      console.error('❌ PDF workflow failed:', error.message);
      throw error;
    }
  }

  async batchGenerate(requests, options = {}) {
    try {
      console.log(`📄 Batch generating ${requests.length} documents`);
      
      const response = await axios.post(`${this.config.baseUrl}/batch-generate`, {
        requests,
        options
      }, {
        timeout: this.config.timeout * 2, // Longer timeout for batch operations
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        console.log(`✅ Batch generation completed: ${response.data.batch_id}`);
        return response.data;
      } else {
        throw new Error(response.data.error || 'Batch generation failed');
      }
    } catch (error) {
      console.error('❌ Batch generation failed:', error.message);
      throw error;
    }
  }

  async getJobStatus(jobId) {
    try {
      console.log(`📊 Getting job status: ${jobId}`);
      
      const response = await axios.get(`${this.config.baseUrl}/jobs/${jobId}/status`, {
        timeout: this.config.timeout
      });
      
      if (response.data.success) {
        console.log(`✅ Job status retrieved: ${jobId} - ${response.data.status}`);
        return response.data;
      } else {
        throw new Error(response.data.error || 'Failed to get job status');
      }
    } catch (error) {
      console.error('❌ Job status retrieval failed:', error.message);
      throw error;
    }
  }

  async getAnalytics(period = 'last_30_days') {
    try {
      console.log(`📊 Getting analytics: ${period}`);
      
      const response = await axios.get(`${this.config.baseUrl}/analytics`, {
        params: { period },
        timeout: this.config.timeout
      });
      
      if (response.data.success) {
        console.log(`✅ Analytics retrieved: ${period}`);
        return response.data;
      } else {
        throw new Error(response.data.error || 'Failed to get analytics');
      }
    } catch (error) {
      console.error('❌ Analytics retrieval failed:', error.message);
      throw error;
    }
  }

  // Helper method to save downloaded document to local storage
  async saveDocument(documentId, savePath, options = {}) {
    try {
      console.log(`💾 Saving document to local storage: ${documentId}`);
      
      const downloadResult = await this.downloadDocument(documentId, options);
      
      if (!downloadResult.success) {
        throw new Error('Download failed');
      }
      
      // Ensure directory exists
      const dir = path.dirname(savePath);
      await fs.mkdir(dir, { recursive: true });
      
      // Write file
      await fs.writeFile(savePath, downloadResult.fileBuffer);
      
      console.log(`✅ Document saved: ${savePath}`);
      
      return {
        success: true,
        documentId,
        savedPath: savePath,
        fileSize: downloadResult.contentLength,
        filename: downloadResult.filename
      };
    } catch (error) {
      console.error('❌ Document save failed:', error.message);
      throw error;
    }
  }

  // Helper method to create download URL
  createDownloadUrl(documentId, type = 'file') {
    return `${this.config.baseUrl}/documents/${documentId}/${type}`;
  }

  // Helper method to create preview URL
  createPreviewUrl(documentId) {
    return `${this.config.baseUrl}/documents/${documentId}/preview`;
  }

  // Health check
  async healthCheck() {
    try {
      const response = await axios.get(`${this.config.baseUrl}/health`, {
        timeout: this.config.timeout
      });
      
      return {
        success: true,
        connected: this.isConnected,
        service: 'foxit',
        status: response.data.status,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        connected: false,
        service: 'foxit',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  isConnected() {
    return this.isConnected;
  }

  // Cleanup
  async cleanup() {
    console.log('🧹 Cleaning up Foxit service...');
    this.isConnected = false;
  }
}

module.exports = FoxitService;
