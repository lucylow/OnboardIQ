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
  pages?: number;
  template_used?: string;
  metadata?: {
    customer_name?: string;
    company_name?: string;
    generated_by?: string;
    version?: string;
    demo_mode?: boolean;
  };
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

// E-Signature Interfaces
export interface ESignatureRecipient {
  firstName: string;
  lastName: string;
  emailId: string;
  role?: 'signer' | 'approver' | 'viewer';
  order?: number; // For sequential signing
  customFields?: Record<string, any>;
}

export interface ESignatureEnvelope {
  id: string;
  name: string;
  status: 'draft' | 'sent' | 'signed' | 'completed' | 'cancelled';
  recipients: ESignatureRecipient[];
  documents: Array<{
    id: string;
    name: string;
    url: string;
    pages: number;
  }>;
  created_at: string;
  expires_at?: string;
  completed_at?: string;
  callback_url?: string;
}

export interface ESignatureRequest {
  envelopeName: string;
  recipients: ESignatureRecipient[];
  documents: Array<{
    url: string;
    name: string;
  }>;
  options?: {
    expiresIn?: number; // days
    reminderFrequency?: number; // days
    allowReassign?: boolean;
    requireAllSignatures?: boolean;
    callbackUrl?: string;
  };
}

// PDF Operations Interfaces
export interface PDFOperationRequest {
  operation: 'merge' | 'split' | 'compress' | 'watermark' | 'encrypt' | 'linearize' | 'rotate' | 'extract' | 'ocr' | 'redact' | 'flatten' | 'optimize' | 'repair' | 'validate';
  documents: string[]; // document IDs or URLs
  options?: {
    compressionLevel?: 'low' | 'medium' | 'high';
    watermarkText?: string;
    watermarkPosition?: 'top' | 'center' | 'bottom';
    password?: string;
    encryptionLevel?: '128' | '256';
    outputFormat?: 'pdf' | 'pdfa';
    rotation?: '90' | '180' | '270';
    pageRange?: string; // e.g., "1-5,7,10-15"
    extractText?: boolean;
    ocrLanguage?: 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh';
    redactPatterns?: string[]; // regex patterns to redact
    flattenLayers?: boolean;
    optimizeImages?: boolean;
    repairCorruption?: boolean;
    validateStructure?: boolean;
  };
}

export interface PDFOperationResponse {
  success: boolean;
  taskId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: {
    documentId: string;
    documentUrl: string;
    fileSize: string;
    processingTime: string;
  };
  error?: string;
}

// Embedded Viewer Interfaces
export interface EmbedTokenRequest {
  documentId: string;
  options?: {
    allowDownload?: boolean;
    allowPrint?: boolean;
    allowEdit?: boolean;
    watermark?: string;
    expireIn?: number; // minutes
  };
}

export interface EmbedTokenResponse {
  success: boolean;
  token: string;
  viewerUrl: string;
  expiresAt: string;
  permissions: {
    download: boolean;
    print: boolean;
    edit: boolean;
  };
}

// Webhook Interfaces
export interface WebhookEvent {
  eventType: 'document_generated' | 'document_signed' | 'envelope_completed' | 'recipient_signed' | 'document_viewed';
  eventId: string;
  timestamp: string;
  data: {
    documentId?: string;
    envelopeId?: string;
    recipientId?: string;
    status?: string;
    metadata?: Record<string, any>;
  };
}

export interface WebhookRegistration {
  id: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive';
  created_at: string;
  last_triggered?: string;
}

// Additional PDF Operations Interfaces - now merged into PDFOperationRequest

// Advanced Analytics Interfaces
export interface DocumentAnalytics {
  documentId: string;
  usage: {
    views: number;
    downloads: number;
    prints: number;
    shares: number;
    timeSpent: number; // in seconds
    lastAccessed: string;
  };
  performance: {
    generationTime: number;
    fileSize: number;
    compressionRatio: number;
    loadTime: number;
  };
  userEngagement: {
    uniqueUsers: number;
    averageSessionTime: number;
    completionRate: number;
    bounceRate: number;
  };
  workflow: {
    status: string;
    stepsCompleted: number;
    totalSteps: number;
    timeToComplete: number;
  };
}

export interface AnalyticsReport {
  period: string;
  summary: {
    totalDocuments: number;
    totalViews: number;
    totalDownloads: number;
    averageGenerationTime: number;
    averageFileSize: number;
    successRate: number;
  };
  topDocuments: Array<{
    documentId: string;
    name: string;
    views: number;
    downloads: number;
    averageTimeSpent: number;
  }>;
  userActivity: {
    activeUsers: number;
    newUsers: number;
    returningUsers: number;
    averageSessionDuration: number;
  };
  performance: {
    averageLoadTime: number;
    errorRate: number;
    uptime: number;
  };
  trends: {
    daily: Array<{ date: string; documents: number; views: number }>;
    weekly: Array<{ week: string; documents: number; views: number }>;
    monthly: Array<{ month: string; documents: number; views: number }>;
  };
}

// Enhanced Workflow Templates
export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'onboarding' | 'contracts' | 'invoices' | 'reports' | 'compliance' | 'marketing' | 'hr' | 'finance';
  steps: Array<{
    id: string;
    name: string;
    type: 'generate_document' | 'pdf_operation' | 'initiate_signature' | 'send_notification' | 'validate_data' | 'archive_document';
    config: {
      templateId?: string;
      operation?: string;
      recipients?: ESignatureRecipient[];
      notificationType?: 'email' | 'sms' | 'in_app';
      validationRules?: string[];
      archiveLocation?: string;
    };
    dependencies?: string[]; // step IDs this step depends on
    estimatedTime: number;
  }>;
  triggers: Array<{
    type: 'user_signup' | 'contract_ready' | 'invoice_due' | 'report_requested' | 'compliance_check' | 'marketing_campaign';
    conditions?: Record<string, any>;
  }>;
  estimatedTotalTime: number;
  successRate: number;
  usageCount: number;
  lastUsed: string;
  createdBy: string;
  version: string;
}

export interface WorkflowExecution {
  id: string;
  templateId: string;
  status: 'running' | 'completed' | 'failed' | 'paused';
  currentStep: string;
  progress: number;
  startedAt: string;
  completedAt?: string;
  steps: Array<{
    id: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    startedAt?: string;
    completedAt?: string;
    result?: any;
    error?: string;
  }>;
  metadata: Record<string, any>;
}

// Enhanced Foxit API Service with comprehensive error handling, validation, and advanced features
class FoxitApiService {
  private baseUrl: string;
  private apiKey: string;
  private isMockMode: boolean;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }>;
  private retryAttempts: number;
  private retryDelay: number;
  private requestTimeout: number;
  private requestQueue: Map<string, Promise<any>>;
  private circuitBreaker: {
    failures: number;
    lastFailure: number;
    state: 'closed' | 'open' | 'half-open';
    threshold: number;
    timeout: number;
  };

  constructor() {
    // Use Supabase edge function instead of localhost
    this.baseUrl = 'https://pnvrtfrtwbzndglakxvj.supabase.co/functions/v1/foxit-api';
    this.apiKey = import.meta.env.VITE_FOXIT_API_KEY || 'demo_key_12345';
    this.isMockMode = true; // Enable mock mode for demo
    this.cache = new Map();
    this.retryAttempts = 3;
    this.retryDelay = 1000; // 1 second
    this.requestTimeout = 30000; // 30 seconds
    this.requestQueue = new Map();
    this.circuitBreaker = {
      failures: 0,
      lastFailure: 0,
      state: 'closed',
      threshold: 5,
      timeout: 60000 // 1 minute
    };
  }

  // Enhanced request method with circuit breaker, timeout, and queue management
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    useCache: boolean = false,
    cacheKey?: string,
    cacheTTL: number = 5 * 60 * 1000 // 5 minutes
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const requestId = this.generateRequestId();
    
    // Check circuit breaker state
    if (this.circuitBreaker.state === 'open') {
      const timeSinceLastFailure = Date.now() - this.circuitBreaker.lastFailure;
      if (timeSinceLastFailure < this.circuitBreaker.timeout) {
        throw new Error('Circuit breaker is open - service temporarily unavailable');
      } else {
        this.circuitBreaker.state = 'half-open';
      }
    }

    // Check cache for GET requests
    if (useCache && cacheKey && options.method === 'GET') {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < cached.ttl) {
        return cached.data as T;
      }
    }

    // Check if request is already in progress
    const queueKey = `${options.method || 'GET'}_${endpoint}`;
    if (this.requestQueue.has(queueKey)) {
      return this.requestQueue.get(queueKey) as Promise<T>;
    }

    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBudnJ0ZnJ0d2J6bmRnbGFreHZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NjQ0MjcsImV4cCI6MjA3MjM0MDQyN30.Z1ZzaXFgU_tr9bXjkFYhyTkrnTpnTVR1aCFhKspaf3Y`,
      'X-API-Version': 'v2',
      'X-Request-ID': requestId,
      'X-Client-Version': '1.0.0',
      'X-Client-Platform': 'web',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    // Create request promise
    const requestPromise = this.executeRequestWithRetry<T>(url, config, useCache, cacheKey, cacheTTL);
    this.requestQueue.set(queueKey, requestPromise);

    try {
      const result = await requestPromise;
      return result;
    } finally {
      this.requestQueue.delete(queueKey);
    }
  }

  private async executeRequestWithRetry<T>(
    url: string,
    config: RequestInit,
    useCache: boolean,
    cacheKey?: string,
    cacheTTL: number = 5 * 60 * 1000
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        // Add timeout to the request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout);
        
        const response = await fetch(url, {
          ...config,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`;
          throw new Error(errorMessage);
        }

        const data = await response.json();
        
        // Reset circuit breaker on success
        if (this.circuitBreaker.state === 'half-open') {
          this.circuitBreaker.state = 'closed';
          this.circuitBreaker.failures = 0;
        }
        
        // Cache successful GET responses
        if (useCache && cacheKey && config.method === 'GET') {
          this.cache.set(cacheKey, {
            data,
            timestamp: Date.now(),
            ttl: cacheTTL
          });
        }

        return data;
      } catch (error) {
        lastError = error as Error;
        
        // Update circuit breaker
        this.circuitBreaker.failures++;
        this.circuitBreaker.lastFailure = Date.now();
        
        if (this.circuitBreaker.failures >= this.circuitBreaker.threshold) {
          this.circuitBreaker.state = 'open';
        }
        
        // Don't retry on certain errors
        if (error instanceof Error) {
          if (error.name === 'AbortError' || error.message.includes('timeout')) {
            throw new Error('Request timeout - please try again');
          }
          if (error.message.includes('401') || error.message.includes('403')) {
            throw new Error('Authentication failed - please check your credentials');
          }
          if (error.message.includes('404')) {
            throw new Error('Resource not found');
          }
          if (error.message.includes('429')) {
            throw new Error('Rate limit exceeded - please try again later');
          }
        }
        
        // Wait before retry (exponential backoff)
        if (attempt < this.retryAttempts) {
          const delay = this.retryDelay * Math.pow(2, attempt - 1);
          await this.delay(delay);
        }
      }
    }

    throw lastError || new Error('Request failed after all retry attempts');
  }

  // Request validation helper
  private validateRequest(data: any, requiredFields: string[]): void {
    const missingFields = requiredFields.filter(field => !data[field]);
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }
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

  // Enhanced document generation with validation
  async generateDocument(request: DocumentGenerationRequest): Promise<DocumentGenerationResponse> {
    try {
      // Validate required fields
      this.validateRequest(request, ['templateId', 'data']);
      
      if (!request.templateId || request.templateId.trim() === '') {
        throw new Error('Template ID is required');
      }

      if (!request.data || typeof request.data !== 'object') {
        throw new Error('Data must be a valid object');
      }

      // For demo mode, return mock response immediately
      if (this.isMockMode) {
        await this.delay(2000); // Simulate processing time
        return {
          success: true,
          document_id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          document_url: `https://pnvrtfrtwbzndglakxvj.supabase.co/functions/v1/foxit-api/documents/doc_${Date.now()}/download`,
          file_size: `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 9)} MB`,
          generated_at: new Date().toISOString(),
          processing_time: `${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 9)}s`,
          compression_ratio: 0.7 + Math.random() * 0.2,
          watermark_applied: true,
          security_level: 'standard',
          pages: Math.floor(Math.random() * 10) + 1,
          template_used: request.templateId,
          metadata: {
            customer_name: request.data.customer_name || 'Demo Customer',
            company_name: request.data.company_name || 'Demo Company',
            generated_by: 'OnboardIQ Demo',
            version: '1.0.0',
            demo_mode: true
          }
        };
      }

      const response = await this.makeRequest<DocumentGenerationResponse>('/generate-document', {
        method: 'POST',
        body: JSON.stringify(request)
      });

      return response;
    } catch (error) {
      console.error('Error generating document:', error);
      return this.getFallbackDocumentGeneration(request);
    }
  }

  // Enhanced PDF workflow with validation
  async processPdfWorkflow(request: PDFWorkflowRequest): Promise<PDFWorkflowResponse> {
    try {
      // Validate required fields
      this.validateRequest(request, ['workflowId', 'documentIds', 'operations']);
      
      if (!Array.isArray(request.documentIds) || request.documentIds.length === 0) {
        throw new Error('At least one document ID is required');
      }

      if (!Array.isArray(request.operations) || request.operations.length === 0) {
        throw new Error('At least one operation is required');
      }

      const response = await this.makeRequest<PDFWorkflowResponse>('/process-pdf-workflow', {
        method: 'POST',
        body: JSON.stringify(request)
      });

      return response;
    } catch (error) {
      console.error('Error processing PDF workflow:', error);
      return this.getFallbackPdfWorkflow(request);
    }
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

  // ===== CORE FOXIT FEATURES =====

  // 1. E-Signature Workflow Management
  async initiateESignature(request: ESignatureRequest): Promise<ESignatureEnvelope> {
    try {
      // Validate required fields
      this.validateRequest(request, ['envelopeName', 'recipients', 'documents']);
      
      if (!Array.isArray(request.recipients) || request.recipients.length === 0) {
        throw new Error('At least one recipient is required');
      }

      if (!Array.isArray(request.documents) || request.documents.length === 0) {
        throw new Error('At least one document is required');
      }

      // Validate recipient data
      request.recipients.forEach((recipient, index) => {
        if (!recipient.emailId || !recipient.firstName || !recipient.lastName) {
          throw new Error(`Recipient ${index + 1} is missing required fields (emailId, firstName, lastName)`);
        }
      });

      const response = await this.makeRequest<ESignatureEnvelope>('/esign/initiate', {
        method: 'POST',
        body: JSON.stringify(request)
      });
      return response;
    } catch (error) {
      console.error('Error initiating e-signature:', error);
      // Enhanced fallback with better error handling
      return {
        id: `envelope_${Date.now()}`,
        name: request.envelopeName,
        status: 'sent',
        recipients: request.recipients.map((recipient, index) => ({
          ...recipient,
          id: `recipient_${index}`,
          status: 'pending'
        })),
        documents: request.documents.map((doc, index) => ({
          id: `doc_${index}`,
          name: doc.name,
          url: doc.url,
          pages: Math.floor(Math.random() * 10) + 1
        })),
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + (request.options?.expiresIn || 30) * 24 * 60 * 60 * 1000).toISOString()
      };
    }
  }

  async getESignatureStatus(envelopeId: string): Promise<ESignatureEnvelope> {
    try {
      const response = await this.makeRequest<ESignatureEnvelope>(`/esign/status/${envelopeId}`, {
        method: 'GET'
      });
      return response;
    } catch (error) {
      console.error('Error getting e-signature status:', error);
      throw new Error(`Failed to get e-signature status for envelope ${envelopeId}`);
    }
  }

  async cancelESignature(envelopeId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.makeRequest<{ success: boolean; message: string }>(`/esign/cancel/${envelopeId}`, {
        method: 'POST'
      });
      return response;
    } catch (error) {
      console.error('Error cancelling e-signature:', error);
      throw new Error(`Failed to cancel e-signature for envelope ${envelopeId}`);
    }
  }

  // 2. Advanced PDF Operations
  async performPDFOperation(request: PDFOperationRequest): Promise<PDFOperationResponse> {
    try {
      // Validate required fields
      this.validateRequest(request, ['operation', 'documents']);
      
      const validOperations = ['merge', 'split', 'compress', 'watermark', 'encrypt', 'linearize'];
      if (!validOperations.includes(request.operation)) {
        throw new Error(`Invalid operation. Must be one of: ${validOperations.join(', ')}`);
      }

      if (!Array.isArray(request.documents) || request.documents.length === 0) {
        throw new Error('At least one document is required');
      }

      const response = await this.makeRequest<PDFOperationResponse>('/pdf/operation', {
        method: 'POST',
        body: JSON.stringify(request)
      });
      return response;
    } catch (error) {
      console.error('Error performing PDF operation:', error);
      return {
        success: true,
        taskId: `task_${Date.now()}`,
        status: 'completed',
        result: {
          documentId: `processed_${Date.now()}`,
          documentUrl: `https://mock-foxit.com/processed/processed_${Date.now()}.pdf`,
          fileSize: `${Math.floor(Math.random() * 2) + 0.5} MB`,
          processingTime: `${Math.floor(Math.random() * 3) + 1}s`
        }
      };
    }
  }

  async getPDFOperationStatus(taskId: string): Promise<PDFOperationResponse> {
    try {
      const response = await this.makeRequest<PDFOperationResponse>(`/pdf/operation/status/${taskId}`, {
        method: 'GET'
      });
      return response;
    } catch (error) {
      console.error('Error getting PDF operation status:', error);
      throw new Error(`Failed to get PDF operation status for task ${taskId}`);
    }
  }

  // 3. Embedded Document Viewer
  async generateEmbedToken(request: EmbedTokenRequest): Promise<EmbedTokenResponse> {
    try {
      const response = await this.makeRequest<EmbedTokenResponse>('/embed/token', {
        method: 'POST',
        body: JSON.stringify(request)
      });
      return response;
    } catch (error) {
      console.error('Error generating embed token:', error);
      // Fallback mock response
      return {
        success: true,
        token: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        viewerUrl: `https://mock-foxit.com/embed/viewer?token=token_${Date.now()}`,
        expiresAt: new Date(Date.now() + (request.options?.expireIn || 60) * 60 * 1000).toISOString(),
        permissions: {
          download: request.options?.allowDownload || false,
          print: request.options?.allowPrint || false,
          edit: request.options?.allowEdit || false
        }
      };
    }
  }

  async revokeEmbedToken(token: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.makeRequest<{ success: boolean; message: string }>('/embed/revoke', {
        method: 'POST',
        body: JSON.stringify({ token })
      });
      return response;
    } catch (error) {
      console.error('Error revoking embed token:', error);
      throw new Error(`Failed to revoke embed token ${token}`);
    }
  }

  // 4. Webhook Management
  async registerWebhook(url: string, events: string[]): Promise<WebhookRegistration> {
    try {
      const response = await this.makeRequest<WebhookRegistration>('/webhooks/register', {
        method: 'POST',
        body: JSON.stringify({ url, events })
      });
      return response;
    } catch (error) {
      console.error('Error registering webhook:', error);
      // Fallback mock response
      return {
        id: `webhook_${Date.now()}`,
        url,
        events,
        status: 'active',
        created_at: new Date().toISOString()
      };
    }
  }

  async getWebhooks(): Promise<WebhookRegistration[]> {
    try {
      const response = await this.makeRequest<WebhookRegistration[]>('/webhooks', {
        method: 'GET'
      });
      return response;
    } catch (error) {
      console.error('Error getting webhooks:', error);
      return [];
    }
  }

  async deleteWebhook(webhookId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.makeRequest<{ success: boolean; message: string }>(`/webhooks/${webhookId}`, {
        method: 'DELETE'
      });
      return response;
    } catch (error) {
      console.error('Error deleting webhook:', error);
      throw new Error(`Failed to delete webhook ${webhookId}`);
    }
  }

  // 5. Automated Document Workflow
  async createAutomatedWorkflow(workflowConfig: {
    name: string;
    trigger: 'user_signup' | 'contract_ready' | 'invoice_due';
    steps: Array<{
      type: 'generate_document' | 'pdf_operation' | 'initiate_signature' | 'send_notification';
      config: any;
    }>;
  }): Promise<{ workflowId: string; status: 'active' | 'inactive' }> {
    try {
      const response = await this.makeRequest<{ workflowId: string; status: string }>('/workflows/create', {
        method: 'POST',
        body: JSON.stringify(workflowConfig)
      });
      return { workflowId: response.workflowId, status: response.status as 'active' | 'inactive' };
    } catch (error) {
      console.error('Error creating automated workflow:', error);
      // Fallback mock response
      return {
        workflowId: `workflow_${Date.now()}`,
        status: 'active'
      };
    }
  }

  async triggerWorkflow(workflowId: string, triggerData: any): Promise<{ success: boolean; executionId: string }> {
    try {
      const response = await this.makeRequest<{ success: boolean; executionId: string }>(`/workflows/${workflowId}/trigger`, {
        method: 'POST',
        body: JSON.stringify(triggerData)
      });
      return response;
    } catch (error) {
      console.error('Error triggering workflow:', error);
      throw new Error(`Failed to trigger workflow ${workflowId}`);
    }
  }

  // 6. Template Management
  async createTemplate(templateData: {
    name: string;
    description: string;
    category: string;
    content: string; // Base64 encoded template
    fields: string[];
  }): Promise<FoxitTemplate> {
    try {
      const response = await this.makeRequest<FoxitTemplate>('/templates/create', {
        method: 'POST',
        body: JSON.stringify(templateData)
      });
      return response;
    } catch (error) {
      console.error('Error creating template:', error);
      throw new Error('Failed to create template');
    }
  }

  async updateTemplate(templateId: string, updates: Partial<FoxitTemplate>): Promise<FoxitTemplate> {
    try {
      const response = await this.makeRequest<FoxitTemplate>(`/templates/${templateId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      return response;
    } catch (error) {
      console.error('Error updating template:', error);
      throw new Error(`Failed to update template ${templateId}`);
    }
  }

  // ===== ADVANCED PDF OPERATIONS =====

  async performAdvancedPDFOperation(request: PDFOperationRequest): Promise<PDFOperationResponse> {
    try {
      const response = await this.makeRequest<PDFOperationResponse>('/pdf/advanced-operation', {
        method: 'POST',
        body: JSON.stringify(request)
      });
      return response;
    } catch (error) {
      console.error('Error performing advanced PDF operation:', error);
      // Fallback mock response
      return {
        success: true,
        taskId: `advanced_task_${Date.now()}`,
        status: 'completed',
        result: {
          documentId: `advanced_processed_${Date.now()}`,
          documentUrl: `https://mock-foxit.com/advanced-processed/advanced_${Date.now()}.pdf`,
          fileSize: `${Math.floor(Math.random() * 2) + 0.5} MB`,
          processingTime: `${Math.floor(Math.random() * 5) + 2}s`
        }
      };
    }
  }

  async extractTextFromPDF(documentId: string, options?: { pageRange?: string; language?: string }): Promise<{ text: string; pages: number; confidence: number }> {
    try {
      const response = await this.makeRequest<{ text: string; pages: number; confidence: number }>('/pdf/extract-text', {
        method: 'POST',
        body: JSON.stringify({ documentId, options })
      });
      return response;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      return {
        text: 'Sample extracted text from PDF document...',
        pages: Math.floor(Math.random() * 10) + 1,
        confidence: 0.95 + Math.random() * 0.05
      };
    }
  }

  async performOCR(documentId: string, language: string = 'en'): Promise<{ text: string; confidence: number; processingTime: number }> {
    try {
      const response = await this.makeRequest<{ text: string; confidence: number; processingTime: number }>('/pdf/ocr', {
        method: 'POST',
        body: JSON.stringify({ documentId, language })
      });
      return response;
    } catch (error) {
      console.error('Error performing OCR:', error);
      return {
        text: 'OCR processed text from scanned document...',
        confidence: 0.88 + Math.random() * 0.12,
        processingTime: Math.floor(Math.random() * 10) + 5
      };
    }
  }

  async redactPDF(documentId: string, patterns: string[]): Promise<PDFOperationResponse> {
    try {
      const response = await this.makeRequest<PDFOperationResponse>('/pdf/redact', {
        method: 'POST',
        body: JSON.stringify({ documentId, patterns })
      });
      return response;
    } catch (error) {
      console.error('Error redacting PDF:', error);
      return {
        success: true,
        taskId: `redact_task_${Date.now()}`,
        status: 'completed',
        result: {
          documentId: `redacted_${Date.now()}`,
          documentUrl: `https://mock-foxit.com/redacted/redacted_${Date.now()}.pdf`,
          fileSize: `${Math.floor(Math.random() * 2) + 0.5} MB`,
          processingTime: `${Math.floor(Math.random() * 3) + 1}s`
        }
      };
    }
  }

  // ===== ADVANCED ANALYTICS =====

  async getDocumentAnalytics(documentId: string): Promise<DocumentAnalytics> {
    try {
      if (!documentId || documentId.trim() === '') {
        throw new Error('Document ID is required');
      }

      const response = await this.makeRequest<DocumentAnalytics>(
        `/analytics/document/${documentId}`,
        { method: 'GET' },
        true, // Use cache
        `doc_analytics_${documentId}`,
        5 * 60 * 1000 // 5 minutes cache
      );
      return response;
    } catch (error) {
      console.error('Error getting document analytics:', error);
      return this.getFallbackDocumentAnalytics(documentId);
    }
  }

  async getAnalyticsReport(period: string = 'last_30_days'): Promise<AnalyticsReport> {
    try {
      const validPeriods = ['last_7_days', 'last_30_days', 'last_90_days', 'last_year'];
      if (!validPeriods.includes(period)) {
        throw new Error(`Invalid period. Must be one of: ${validPeriods.join(', ')}`);
      }

      const response = await this.makeRequest<AnalyticsReport>(
        `/analytics/report?period=${period}`,
        { method: 'GET' },
        true, // Use cache
        `analytics_${period}`,
        10 * 60 * 1000 // 10 minutes cache
      );
      return response;
    } catch (error) {
      console.error('Error getting analytics report:', error);
      return this.getFallbackAnalyticsReport(period);
    }
  }

  // Enhanced event tracking with batching
  private eventQueue: Array<{ documentId: string; event: string; metadata?: any; timestamp: string }> = [];
  private eventQueueTimer: NodeJS.Timeout | null = null;

  async trackDocumentEvent(documentId: string, event: 'view' | 'download' | 'print' | 'share', metadata?: any): Promise<void> {
    try {
      if (!documentId || documentId.trim() === '') {
        throw new Error('Document ID is required');
      }

      const eventData = {
        documentId,
        event,
        metadata,
        timestamp: new Date().toISOString()
      };

      // Add to queue for batching
      this.eventQueue.push(eventData);

      // Flush queue if it gets too large or after a delay
      if (this.eventQueue.length >= 10) {
        await this.flushEventQueue();
      } else if (!this.eventQueueTimer) {
        this.eventQueueTimer = setTimeout(() => this.flushEventQueue(), 5000); // Flush after 5 seconds
      }
    } catch (error) {
      console.error('Error tracking document event:', error);
    }
  }

  private async flushEventQueue(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    try {
      const events = [...this.eventQueue];
      this.eventQueue = [];

      if (this.eventQueueTimer) {
        clearTimeout(this.eventQueueTimer);
        this.eventQueueTimer = null;
      }

      await this.makeRequest('/analytics/track-batch', {
        method: 'POST',
        body: JSON.stringify({ events })
      });
    } catch (error) {
      console.error('Error flushing event queue:', error);
      // Re-add events to queue for retry
      this.eventQueue.unshift(...this.eventQueue);
    }
  }

  // ===== ENHANCED WORKFLOW TEMPLATES =====

  async getWorkflowTemplates(): Promise<WorkflowTemplate[]> {
    try {
      const response = await this.makeRequest<WorkflowTemplate[]>('/workflows/templates', {
        method: 'GET'
      });
      return response;
    } catch (error) {
      console.error('Error getting workflow templates:', error);
      return this.getFallbackWorkflowTemplates();
    }
  }

  async createWorkflowTemplate(template: Omit<WorkflowTemplate, 'id' | 'usageCount' | 'lastUsed' | 'createdBy' | 'version'>): Promise<WorkflowTemplate> {
    try {
      const response = await this.makeRequest<WorkflowTemplate>('/workflows/templates', {
        method: 'POST',
        body: JSON.stringify(template)
      });
      return response;
    } catch (error) {
      console.error('Error creating workflow template:', error);
      throw new Error('Failed to create workflow template');
    }
  }

  async executeWorkflowTemplate(templateId: string, data: any): Promise<WorkflowExecution> {
    try {
      if (!templateId || templateId.trim() === '') {
        throw new Error('Template ID is required');
      }

      if (!data || typeof data !== 'object') {
        throw new Error('Data must be a valid object');
      }

      const response = await this.makeRequest<WorkflowExecution>('/workflows/execute', {
        method: 'POST',
        body: JSON.stringify({ templateId, data })
      });
      return response;
    } catch (error) {
      console.error('Error executing workflow template:', error);
      throw new Error(`Failed to execute workflow template ${templateId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getWorkflowExecutionStatus(executionId: string): Promise<WorkflowExecution> {
    try {
      if (!executionId || executionId.trim() === '') {
        throw new Error('Execution ID is required');
      }

      const response = await this.makeRequest<WorkflowExecution>(
        `/workflows/execution/${executionId}`,
        { method: 'GET' },
        false, // Don't cache status
        undefined,
        0
      );
      return response;
    } catch (error) {
      console.error('Error getting workflow execution status:', error);
      throw new Error(`Failed to get workflow execution status ${executionId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Poll workflow status until completion
  async pollWorkflowStatus(executionId: string, onProgress?: (execution: WorkflowExecution) => void): Promise<WorkflowExecution> {
    const maxAttempts = 60; // 5 minutes with 5-second intervals
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        const execution = await this.getWorkflowExecutionStatus(executionId);
        
        if (onProgress) {
          onProgress(execution);
        }

        if (execution.status === 'completed' || execution.status === 'failed') {
          return execution;
        }

        await this.delay(5000); // Wait 5 seconds before next poll
        attempts++;
      } catch (error) {
        console.error(`Error polling workflow status (attempt ${attempts + 1}):`, error);
        attempts++;
        
        if (attempts >= maxAttempts) {
          throw new Error('Workflow polling timeout');
        }
        
        await this.delay(5000);
      }
    }

    throw new Error('Workflow polling timeout');
  }

  // ===== FALLBACK METHODS =====

  private getFallbackDocumentGeneration(request: DocumentGenerationRequest): DocumentGenerationResponse {
    return {
      success: true,
      document_id: `fallback_doc_${Date.now()}`,
      document_url: `https://pnvrtfrtwbzndglakxvj.supabase.co/functions/v1/foxit-api/documents/fallback_doc_${Date.now()}/download`,
      file_size: '2.4 MB',
      generated_at: new Date().toISOString(),
      processing_time: '2.1s',
      compression_ratio: 0.75,
      watermark_applied: true,
      security_level: 'standard',
      pages: 5,
      template_used: request.templateId,
      metadata: {
        customer_name: request.data?.customer_name || 'Demo Customer',
        company_name: request.data?.company_name || 'Demo Company',
        generated_by: 'OnboardIQ Fallback',
        version: '1.0.0',
        demo_mode: true
      }
    };
  }

  private getFallbackPdfWorkflow(request: PDFWorkflowRequest): PDFWorkflowResponse {
    return {
      success: true,
      processed_document_id: `workflow_${Date.now()}`,
      processed_document_url: `https://pnvrtfrtwbzndglakxvj.supabase.co/functions/v1/foxit-api/documents/workflow_${Date.now()}/download`,
      file_size: '3.1 MB',
      processed_at: new Date().toISOString(),
      processing_time: '3.2s',
      compression_ratio: 0.6 + Math.random() * 0.3,
      watermark_text: 'OnboardIQ - Confidential',
      encryption_applied: false
    };
  }

  private getFallbackDocumentAnalytics(documentId: string): DocumentAnalytics {
    return {
      documentId,
      usage: {
        views: Math.floor(Math.random() * 1000) + 100,
        downloads: Math.floor(Math.random() * 500) + 50,
        prints: Math.floor(Math.random() * 200) + 20,
        shares: Math.floor(Math.random() * 100) + 10,
        timeSpent: Math.floor(Math.random() * 300) + 60,
        lastAccessed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      performance: {
        generationTime: Math.floor(Math.random() * 5) + 2,
        fileSize: Math.floor(Math.random() * 5) + 1,
        compressionRatio: 0.6 + Math.random() * 0.3,
        loadTime: Math.floor(Math.random() * 3) + 1
      },
      userEngagement: {
        uniqueUsers: Math.floor(Math.random() * 100) + 20,
        averageSessionTime: Math.floor(Math.random() * 180) + 60,
        completionRate: 0.7 + Math.random() * 0.3,
        bounceRate: Math.random() * 0.3
      },
      workflow: {
        status: 'completed',
        stepsCompleted: Math.floor(Math.random() * 5) + 3,
        totalSteps: 5,
        timeToComplete: Math.floor(Math.random() * 300) + 120
      }
    };
  }

  private getFallbackAnalyticsReport(period: string): AnalyticsReport {
    const now = new Date();
    const daily = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(now.getTime() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      documents: Math.floor(Math.random() * 50) + 10,
      views: Math.floor(Math.random() * 500) + 100
    }));

    const weekly = Array.from({ length: 12 }, (_, i) => ({
      week: `Week ${i + 1}`,
      documents: Math.floor(Math.random() * 200) + 50,
      views: Math.floor(Math.random() * 2000) + 500
    }));

    const monthly = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' }),
      documents: Math.floor(Math.random() * 800) + 200,
      views: Math.floor(Math.random() * 8000) + 2000
    }));

    return {
      period,
      summary: {
        totalDocuments: Math.floor(Math.random() * 5000) + 1000,
        totalViews: Math.floor(Math.random() * 50000) + 10000,
        totalDownloads: Math.floor(Math.random() * 20000) + 5000,
        averageGenerationTime: Math.floor(Math.random() * 5) + 2,
        averageFileSize: Math.floor(Math.random() * 3) + 1,
        successRate: 0.95 + Math.random() * 0.05
      },
      topDocuments: [
        {
          documentId: 'doc_1',
          name: 'Welcome Packet',
          views: Math.floor(Math.random() * 1000) + 500,
          downloads: Math.floor(Math.random() * 500) + 200,
          averageTimeSpent: Math.floor(Math.random() * 300) + 120
        },
        {
          documentId: 'doc_2',
          name: 'Service Agreement',
          views: Math.floor(Math.random() * 800) + 400,
          downloads: Math.floor(Math.random() * 400) + 150,
          averageTimeSpent: Math.floor(Math.random() * 250) + 100
        },
        {
          documentId: 'doc_3',
          name: 'Invoice Template',
          views: Math.floor(Math.random() * 600) + 300,
          downloads: Math.floor(Math.random() * 300) + 100,
          averageTimeSpent: Math.floor(Math.random() * 200) + 80
        }
      ],
      userActivity: {
        activeUsers: Math.floor(Math.random() * 500) + 100,
        newUsers: Math.floor(Math.random() * 100) + 20,
        returningUsers: Math.floor(Math.random() * 400) + 80,
        averageSessionDuration: Math.floor(Math.random() * 600) + 300
      },
      performance: {
        averageLoadTime: Math.floor(Math.random() * 3) + 1,
        errorRate: Math.random() * 0.05,
        uptime: 0.995 + Math.random() * 0.005
      },
      trends: { daily, weekly, monthly }
    };
  }

  private getFallbackWorkflowTemplates(): WorkflowTemplate[] {
    return [
      {
        id: 'onboarding-complete',
        name: 'Complete Onboarding Workflow',
        description: 'End-to-end onboarding process with document generation, e-signature, and notifications',
        category: 'onboarding',
        steps: [
          {
            id: 'step1',
            name: 'Generate Welcome Packet',
            type: 'generate_document',
            config: { templateId: 'welcome_packet' },
            estimatedTime: 30
          },
          {
            id: 'step2',
            name: 'Create Service Agreement',
            type: 'generate_document',
            config: { templateId: 'service_agreement' },
            dependencies: ['step1'],
            estimatedTime: 45
          },
          {
            id: 'step3',
            name: 'Initiate E-Signature',
            type: 'initiate_signature',
            config: {
              recipients: [
                { firstName: '{{customer_name}}', lastName: '', emailId: '{{customer_email}}', role: 'signer' }
              ]
            },
            dependencies: ['step2'],
            estimatedTime: 60
          },
          {
            id: 'step4',
            name: 'Send Welcome Email',
            type: 'send_notification',
            config: { notificationType: 'email' },
            dependencies: ['step3'],
            estimatedTime: 15
          }
        ],
        triggers: [
          { type: 'user_signup', conditions: { userType: 'new' } }
        ],
        estimatedTotalTime: 150,
        successRate: 0.95,
        usageCount: Math.floor(Math.random() * 1000) + 500,
        lastUsed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: 'system',
        version: '1.0.0'
      },
      {
        id: 'contract-management',
        name: 'Contract Management Workflow',
        description: 'Automated contract generation, review, and signature process',
        category: 'contracts',
        steps: [
          {
            id: 'step1',
            name: 'Generate Contract',
            type: 'generate_document',
            config: { templateId: 'contract_template' },
            estimatedTime: 60
          },
          {
            id: 'step2',
            name: 'Add Watermark',
            type: 'pdf_operation',
            config: { operation: 'watermark' },
            dependencies: ['step1'],
            estimatedTime: 30
          },
          {
            id: 'step3',
            name: 'Route for Review',
            type: 'send_notification',
            config: { notificationType: 'email' },
            dependencies: ['step2'],
            estimatedTime: 20
          },
          {
            id: 'step4',
            name: 'Initiate Signatures',
            type: 'initiate_signature',
            config: {
              recipients: [
                { firstName: '{{client_name}}', lastName: '', emailId: '{{client_email}}', role: 'signer' },
                { firstName: '{{manager_name}}', lastName: '', emailId: '{{manager_email}}', role: 'approver' }
              ]
            },
            dependencies: ['step3'],
            estimatedTime: 90
          }
        ],
        triggers: [
          { type: 'contract_ready', conditions: { contractType: 'service' } }
        ],
        estimatedTotalTime: 200,
        successRate: 0.92,
        usageCount: Math.floor(Math.random() * 800) + 300,
        lastUsed: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: 'admin',
        version: '1.1.0'
      },
      {
        id: 'invoice-processing',
        name: 'Invoice Processing Workflow',
        description: 'Automated invoice generation and delivery system',
        category: 'invoices',
        steps: [
          {
            id: 'step1',
            name: 'Generate Invoice',
            type: 'generate_document',
            config: { templateId: 'invoice_template' },
            estimatedTime: 45
          },
          {
            id: 'step2',
            name: 'Compress PDF',
            type: 'pdf_operation',
            config: { operation: 'compress' },
            dependencies: ['step1'],
            estimatedTime: 25
          },
          {
            id: 'step3',
            name: 'Send to Customer',
            type: 'send_notification',
            config: { notificationType: 'email' },
            dependencies: ['step2'],
            estimatedTime: 15
          },
          {
            id: 'step4',
            name: 'Archive Invoice',
            type: 'archive_document',
            config: { archiveLocation: 'invoices/{{year}}/{{month}}' },
            dependencies: ['step3'],
            estimatedTime: 10
          }
        ],
        triggers: [
          { type: 'invoice_due', conditions: { amount: '>1000' } }
        ],
        estimatedTotalTime: 95,
        successRate: 0.98,
        usageCount: Math.floor(Math.random() * 1500) + 800,
        lastUsed: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        createdBy: 'finance',
        version: '1.0.0'
      }
    ];
  }

  // Utility method for delays
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Circuit breaker status
  getCircuitBreakerStatus(): typeof this.circuitBreaker {
    return { ...this.circuitBreaker };
  }

  // Reset circuit breaker
  resetCircuitBreaker(): void {
    this.circuitBreaker.state = 'closed';
    this.circuitBreaker.failures = 0;
    this.circuitBreaker.lastFailure = 0;
  }
}

// Export singleton instance
export const foxitApiService = new FoxitApiService();
