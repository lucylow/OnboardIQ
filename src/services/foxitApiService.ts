// Foxit API Service for Document Generation and PDF Processing
// Enhanced service with comprehensive error handling, caching, and progress tracking

export interface DocumentGenerationRequest {
  templateId: string;
  data: Record<string, any>;
  options?: {
    format?: 'pdf' | 'docx' | 'html';
    includeWatermark?: boolean;
    compression?: boolean;
    security?: 'standard' | 'high' | 'enterprise';
    include_metadata?: boolean;
    watermark?: boolean;
  };
}

export interface DocumentGenerationResponse {
  success: boolean;
  document_id?: string;
  document_url?: string;
  file_size?: string;
  generated_at?: string;
  processing_time?: string;
  compression_ratio?: number;
  watermark_applied?: boolean;
  security_level?: string;
  error?: string;
  details?: string;
}

export interface PDFWorkflowRequest {
  workflowId: string;
  documentIds: string[];
  operations: string[];
  options?: {
    watermark_text?: string;
    password_protection?: boolean;
    compression_level?: 'low' | 'medium' | 'high';
    encryption_level?: '128' | '256';
  };
}

export interface PDFWorkflowResponse {
  success: boolean;
  processed_document_id?: string;
  processed_document_url?: string;
  file_size?: string;
  processed_at?: string;
  processing_time?: string;
  compression_ratio?: number;
  watermark_text?: string;
  encryption_applied?: boolean;
  error?: string;
  details?: string;
}

export interface FoxitTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  fields: string[];
  preview_url?: string;
  estimated_time?: string;
  file_size_range?: string;
}

export interface FoxitTemplatesResponse {
  success: boolean;
  templates?: FoxitTemplate[];
  error?: string;
}

export interface DocumentMetadata {
  id: string;
  name: string;
  template: string;
  status: 'generating' | 'completed' | 'failed' | 'processing';
  url?: string;
  size?: string;
  generated_at?: string;
  type: 'generated' | 'processed';
  metadata?: Record<string, any>;
}

export interface JobStatus {
  success: boolean;
  job_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  result?: any;
  created_at: string;
  completed_at?: string;
  processing_time?: string;
  queue_position?: number;
}

export interface AnalyticsData {
  success: boolean;
  period: string;
  documents_generated: number;
  workflows_processed: number;
  average_processing_time: string;
  success_rate: number;
  popular_templates: Array<{ id: string; count: number }>;
  error_rate: number;
}

export interface BatchGenerationRequest {
  requests: DocumentGenerationRequest[];
}

export interface BatchGenerationResponse {
  success: boolean;
  results: DocumentGenerationResponse[];
  summary: {
    total: number;
    successful: number;
    failed: number;
    processing_time: string;
    average_time_per_document: string;
  };
}

// Enhanced Foxit API Service with caching, retry logic, and progress tracking
class FoxitApiService {
  private baseUrl: string;
  private apiKey: string;
  private isMockMode: boolean;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }>;
  private retryAttempts: number;
  private retryDelay: number;

  constructor() {
    this.baseUrl = import.meta.env.VITE_FOXIT_API_BASE_URL || 'http://localhost:3001/api/foxit';
    this.apiKey = import.meta.env.VITE_FOXIT_API_KEY || '';
    this.isMockMode = !this.apiKey || import.meta.env.VITE_USE_MOCK_FOXIT === 'true';
    this.cache = new Map();
    this.retryAttempts = 3;
    this.retryDelay = 1000; // 1 second
  }

  // Enhanced request method with retry logic and caching
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    useCache: boolean = false,
    cacheKey?: string,
    cacheTTL: number = 5 * 60 * 1000 // 5 minutes
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Check cache for GET requests
    if (useCache && cacheKey && options.method === 'GET') {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < cached.ttl) {
        return cached.data as T;
      }
    }

    const defaultHeaders = {
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey,
      'X-API-Version': 'v2',
      'X-Request-ID': this.generateRequestId(),
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Cache successful GET responses
        if (useCache && cacheKey && options.method === 'GET') {
          this.cache.set(cacheKey, {
            data,
            timestamp: Date.now(),
            ttl: cacheTTL
          });
        }

        return data;
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < this.retryAttempts) {
          console.warn(`Foxit API request failed (attempt ${attempt}/${this.retryAttempts}):`, error);
          await this.delay(this.retryDelay * attempt); // Exponential backoff
        }
      }
    }

    console.error(`Foxit API request failed after ${this.retryAttempts} attempts:`, lastError);
    
    if (this.isMockMode) {
      return this.getMockResponse<T>(endpoint, options);
    }
    
    throw lastError;
  }

  // Generate unique request ID
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Clear cache
  public clearCache(): void {
    this.cache.clear();
  }

  // Get cache statistics
  public getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }

  // Health check with enhanced error handling
  async checkHealth(): Promise<{ status: string; version: string; features: string[]; timestamp: string }> {
    return this.makeRequest('/health', { method: 'GET' }, true, 'health', 30 * 1000); // 30 seconds cache
  }

  // Get available templates with caching
  async getTemplates(): Promise<FoxitTemplatesResponse> {
    return this.makeRequest<FoxitTemplatesResponse>('/templates', { method: 'GET' }, true, 'templates', 10 * 60 * 1000); // 10 minutes cache
  }

  // Generate document with progress tracking
  async generateDocument(request: DocumentGenerationRequest): Promise<DocumentGenerationResponse> {
    const payload = {
      templateId: request.templateId,
      data: request.data,
      output_format: request.options?.format || 'pdf',
      options: {
        include_metadata: request.options?.include_metadata ?? true,
        includeWatermark: request.options?.includeWatermark || false,
        compression_level: request.options?.compression ? 'high' : 'none',
        security: request.options?.security || 'standard'
      }
    };

    return this.makeRequest<DocumentGenerationResponse>('/generate-document', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // Process PDF workflow with enhanced options
  async processPdfWorkflow(request: PDFWorkflowRequest): Promise<PDFWorkflowResponse> {
    const payload = {
      workflowId: request.workflowId,
      documentIds: request.documentIds,
      operations: request.operations,
      options: {
        watermark_text: request.options?.watermark_text,
        password_protection: request.options?.password_protection || false,
        compression_level: request.options?.compression_level || 'medium',
        encryption_level: request.options?.encryption_level || '128'
      }
    };

    return this.makeRequest<PDFWorkflowResponse>('/process-pdf-workflow', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // Get document metadata with caching
  async getDocumentMetadata(documentId: string): Promise<DocumentMetadata> {
    return this.makeRequest<DocumentMetadata>(`/documents/${documentId}/metadata`, {
      method: 'GET'
    }, true, `metadata_${documentId}`, 5 * 60 * 1000); // 5 minutes cache
  }

  // Download document with enhanced response
  async downloadDocument(documentId: string): Promise<{ url: string; filename: string; expires_at: string; file_size: string }> {
    const response = await this.makeRequest<{ download_url: string; filename: string; expires_at: string; file_size: string }>(
      `/documents/${documentId}/download`,
      { method: 'GET' }
    );
    
    return {
      url: response.download_url,
      filename: response.filename,
      expires_at: response.expires_at,
      file_size: response.file_size
    };
  }

  // Batch generate documents with progress tracking
  async batchGenerateDocuments(requests: DocumentGenerationRequest[]): Promise<BatchGenerationResponse> {
    const payload: BatchGenerationRequest = { requests };
    
    return this.makeRequest<BatchGenerationResponse>('/batch-generate', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // Get processing status with polling support
  async getProcessingStatus(jobId: string): Promise<JobStatus> {
    return this.makeRequest<JobStatus>(`/jobs/${jobId}/status`, {
      method: 'GET'
    });
  }

  // Poll job status until completion
  async pollJobStatus(jobId: string, onProgress?: (status: JobStatus) => void): Promise<JobStatus> {
    const maxAttempts = 60; // 5 minutes with 5-second intervals
    let attempts = 0;

    while (attempts < maxAttempts) {
      const status = await this.getProcessingStatus(jobId);
      
      if (onProgress) {
        onProgress(status);
      }

      if (status.status === 'completed' || status.status === 'failed') {
        return status;
      }

      await this.delay(5000); // Wait 5 seconds before next poll
      attempts++;
    }

    throw new Error('Job polling timeout');
  }

  // Get analytics data
  async getAnalytics(period: string = 'last_30_days'): Promise<AnalyticsData> {
    return this.makeRequest<AnalyticsData>(`/analytics?period=${period}`, {
      method: 'GET'
    }, true, `analytics_${period}`, 15 * 60 * 1000); // 15 minutes cache
  }

  // Delete document
  async deleteDocument(documentId: string): Promise<{ success: boolean; message: string; document_id: string; deleted_at: string }> {
    return this.makeRequest(`/documents/${documentId}`, {
      method: 'DELETE'
    });
  }

  // Validate template data
  validateTemplateData(templateId: string, data: Record<string, any>): {
    valid: boolean;
    missing: string[];
    extra: string[];
    suggestions: string[];
  } {
    const templates = this.getCachedTemplates();
    const template = templates.find(t => t.id === templateId);
    
    if (!template) {
      return {
        valid: false,
        missing: [],
        extra: [],
        suggestions: ['Template not found']
      };
    }

    const providedFields = Object.keys(data);
    const requiredFields = template.fields;
    const missing = requiredFields.filter(field => !providedFields.includes(field));
    const extra = providedFields.filter(field => !requiredFields.includes(field));

    return {
      valid: missing.length === 0,
      missing,
      extra,
      suggestions: missing.map(field => `Add missing field: ${field}`)
    };
  }

  // Get cached templates
  private getCachedTemplates(): FoxitTemplate[] {
    const cached = this.cache.get('templates');
    return cached ? cached.data.templates || [] : [];
  }

  // Enhanced mock responses for development
  private getMockResponse<T>(endpoint: string, options: RequestInit): T {
    const mockResponses: Record<string, any> = {
      '/health': {
        status: 'healthy',
        version: '2.0.0',
        features: ['document_generation', 'pdf_processing', 'workflow_automation', 'batch_processing', 'analytics'],
        timestamp: new Date().toISOString(),
        uptime: Math.random() * 86400, // Random uptime
        memory_usage: {
          rss: Math.random() * 100000000,
          heapTotal: Math.random() * 50000000,
          heapUsed: Math.random() * 25000000
        },
        active_connections: Math.floor(Math.random() * 50) + 10
      },
      '/templates': {
        success: true,
        templates: [
          {
            id: 'welcome_packet',
            name: 'Welcome Packet',
            description: 'Personalized welcome letter and onboarding guide',
            category: 'onboarding',
            fields: ['customer_name', 'company_name', 'start_date', 'welcome_message'],
            preview_url: 'https://mock-foxit.com/templates/welcome_packet_preview.pdf',
            estimated_time: '30s',
            file_size_range: '1-3 MB'
          },
          {
            id: 'contract',
            name: 'Service Contract',
            description: 'Professional service agreement with terms',
            category: 'legal',
            fields: ['client_name', 'service_type', 'contract_value', 'start_date', 'end_date'],
            preview_url: 'https://mock-foxit.com/templates/contract_preview.pdf',
            estimated_time: '45s',
            file_size_range: '2-4 MB'
          },
          {
            id: 'onboarding_guide',
            name: 'Onboarding Guide',
            description: 'Step-by-step customer onboarding process',
            category: 'onboarding',
            fields: ['customer_name', 'product_name', 'onboarding_steps', 'support_contact'],
            preview_url: 'https://mock-foxit.com/templates/onboarding_guide_preview.pdf',
            estimated_time: '60s',
            file_size_range: '3-5 MB'
          },
          {
            id: 'invoice',
            name: 'Invoice',
            description: 'Professional billing document',
            category: 'billing',
            fields: ['client_name', 'invoice_number', 'amount', 'due_date', 'services'],
            preview_url: 'https://mock-foxit.com/templates/invoice_preview.pdf',
            estimated_time: '25s',
            file_size_range: '1-2 MB'
          }
        ]
      },
      '/generate-document': {
        success: true,
        document_id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        document_url: `https://mock-foxit.com/documents/doc_${Date.now()}.pdf`,
        file_size: `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 9)} MB`,
        generated_at: new Date().toISOString(),
        processing_time: `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 9)}s`,
        compression_ratio: 0.7 + Math.random() * 0.2,
        watermark_applied: true,
        security_level: 'standard'
      },
      '/process-pdf-workflow': {
        success: true,
        processed_document_id: `processed_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        processed_document_url: `https://mock-foxit.com/processed/processed_${Date.now()}.pdf`,
        file_size: `${Math.floor(Math.random() * 2) + 0.5}.${Math.floor(Math.random() * 9)} MB`,
        processed_at: new Date().toISOString(),
        processing_time: `${Math.floor(Math.random() * 5) + 2}.${Math.floor(Math.random() * 9)}s`,
        compression_ratio: 0.6 + Math.random() * 0.3,
        watermark_text: 'OnboardIQ - Confidential',
        encryption_applied: false
      },
      '/analytics': {
        success: true,
        period: 'last_30_days',
        documents_generated: Math.floor(Math.random() * 1000) + 500,
        workflows_processed: Math.floor(Math.random() * 200) + 100,
        average_processing_time: `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 9)}s`,
        success_rate: 98.5 + Math.random() * 1.5,
        popular_templates: [
          { id: 'welcome_packet', count: Math.floor(Math.random() * 300) + 200 },
          { id: 'contract', count: Math.floor(Math.random() * 200) + 150 },
          { id: 'invoice', count: Math.floor(Math.random() * 150) + 100 }
        ],
        error_rate: 1.5 + Math.random() * 1.0
      }
    };

    return mockResponses[endpoint] || { success: false, error: 'Mock endpoint not found' };
  }

  // Health check for API connectivity
  async healthCheck(): Promise<{ connected: boolean; response_time?: number; version?: string }> {
    try {
      const startTime = Date.now();
      const response = await this.makeRequest<{ status: string; version: string }>('/health', {
        method: 'GET'
      });
      const responseTime = Date.now() - startTime;
      
      return {
        connected: true,
        response_time: responseTime,
        version: response.version
      };
    } catch (error) {
      return {
        connected: false
      };
    }
  }

  // Create welcome packet for user
  async createWelcomePacketForUser(userId: string): Promise<DocumentGenerationResponse> {
    return this.generateDocument({
      templateId: 'welcome_packet',
      data: {
        user_id: userId,
        generated_at: new Date().toISOString()
      }
    });
  }

  // Create onboarding guide for user  
  async createOnboardingGuideForUser(userId: string): Promise<DocumentGenerationResponse> {
    return this.generateDocument({
      templateId: 'onboarding_guide',
      data: {
        user_id: userId,
        generated_at: new Date().toISOString()
      }
    });
  }

  // Create invoice for user
  async createInvoiceForUser(userId: string): Promise<DocumentGenerationResponse> {
    return this.generateDocument({
      templateId: 'invoice',
      data: {
        user_id: userId,
        generated_at: new Date().toISOString()
      }
    });
  }

  // Utility method for delays
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const foxitApiService = new FoxitApiService();
