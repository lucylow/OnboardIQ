const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const { mockFoxitService } = require('../mockApi');

// Use mock service if no API credentials are provided
const useMock = !process.env.FOXIT_CLIENT_ID || !process.env.FOXIT_CLIENT_SECRET;

class FoxitService {
  constructor() {
    this.baseURL = 'https://api.foxitsoftware.com';
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  // Authenticate with Foxit API
  async authenticate() {
    try {
      const response = await axios.post(`${this.baseURL}/auth/oauth2/token`, {
        client_id: process.env.FOXIT_CLIENT_ID,
        client_secret: process.env.FOXIT_CLIENT_SECRET,
        grant_type: 'client_credentials'
      });

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
      return true;
    } catch (error) {
      console.error('Foxit authentication failed:', error.message);
      throw new Error('Failed to authenticate with Foxit API');
    }
  }

  // Ensure we have a valid access token
  async ensureAuthenticated() {
    if (!this.accessToken || Date.now() >= this.tokenExpiry) {
      await this.authenticate();
    }
  }

  // Generate document from template
  async generateDocument(templateId, data) {
    if (useMock) {
      return mockFoxitService.generateDocument(templateId, data);
    }
    
    await this.ensureAuthenticated();

    try {
      const response = await axios.post(
        `${this.baseURL}/document/generate`,
        {
          template_id: templateId,
          data: data
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Document generation failed:', error.message);
      throw new Error('Failed to generate document');
    }
  }

  // Merge PDF documents
  async mergeDocuments(documentUrls, outputFileName) {
    await this.ensureAuthenticated();

    try {
      const response = await axios.post(
        `${this.baseURL}/pdf/merge`,
        {
          documents: documentUrls,
          output_filename: outputFileName
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Document merge failed:', error.message);
      throw new Error('Failed to merge documents');
    }
  }

  // Compress PDF document
  async compressDocument(inputUrl, compressionLevel = 'MEDIUM') {
    await this.ensureAuthenticated();

    try {
      const response = await axios.post(
        `${this.baseURL}/pdf/compress`,
        {
          input_url: inputUrl,
          compression_level: compressionLevel
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Document compression failed:', error.message);
      throw new Error('Failed to compress document');
    }
  }

  // Add watermark to PDF
  async addWatermark(inputUrl, watermarkText, options = {}) {
    await this.ensureAuthenticated();

    try {
      const response = await axios.post(
        `${this.baseURL}/pdf/watermark`,
        {
          input_url: inputUrl,
          watermark_text: watermarkText,
          options: options
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Watermark addition failed:', error.message);
      throw new Error('Failed to add watermark');
    }
  }

  // Chained workflow: Generate, process, and deliver document
  async createWelcomePackage(userData, templateId = 'welcome_template') {
    if (useMock) {
      return mockFoxitService.createWelcomePackage(userData);
    }
    
    try {
      // 1. Generate the initial document
      const generatedDoc = await this.generateDocument(templateId, userData);
      
      // 2. Add personalized watermark
      const watermarkedDoc = await this.addWatermark(
        generatedDoc.download_url, 
        `Prepared for ${userData.customer_name}`
      );
      
      // 3. Compress for email delivery
      const compressedDoc = await this.compressDocument(watermarkedDoc.output_url);
      
      return {
        success: true,
        download_url: compressedDoc.output_url,
        document_id: compressedDoc.document_id
      };
    } catch (error) {
      console.error('Welcome package creation failed:', error);
      throw error;
    }
  }
}

module.exports = new FoxitService();
