// Foxit API Service for Document Generation and PDF Processing
// Enhanced service with comprehensive error handling and type safety

export interface DocumentGenerationRequest {
  template_id: string;
  data: Record<string, any>;
  output_format?: 'pdf' | 'docx' | 'html';
  options?: {
    include_metadata?: boolean;
    watermark?: boolean;
    compression_level?: 'low' | 'medium' | 'high';
  };
}

export interface DocumentGenerationResponse {
  success: boolean;
  document_url?: string;
  document_id?: string;
  file_size?: number;
  generated_at?: string;
  error?: string;
  details?: string;
  timestamp?: string;
}

export interface PDFWorkflowRequest {
  document_urls: string[];
  workflow_config?: {
    compress?: boolean;
    compression_level?: 'low' | 'medium' | 'high';
    watermark?: {
      type: 'text' | 'image';
      text?: string;
      image_url?: string;
      opacity?: number;
      rotation?: number;
      position?: 'top-left' | 'top-right' | 'center' | 'bottom-left' | 'bottom-right';
      font_size?: number;
      color?: string;
    };
    add_security?: {
      password?: string;
      permissions?: string[];
      encryption_level?: '128' | '256';
    };
  };
}

export interface PDFWorkflowResponse {
  success: boolean;
  final_document_url?: string;
  workflow_id?: string;
  processing_time?: number;
  file_size?: number;
  completed_at?: string;
  error?: string;
  details?: string;
  timestamp?: string;
}

export interface WelcomePacketRequest {
  name: string;
  company: string;
  plan: string;
  email: string;
  phone: string;
  account_id?: string;
  signup_date?: string;
}

export interface WelcomePacketResponse {
  success: boolean;
  final_document_url?: string;
  welcome_document_url?: string;
  contract_document_url?: string;
  workflow_id?: string;
  user_data?: Record<string, any>;
  created_at?: string;
  error?: string;
  details?: string;
  timestamp?: string;
}

export interface OnboardingGuideRequest {
  name: string;
  company: string;
  plan: string;
  features?: string[];
}

export interface InvoiceRequest {
  invoice_number: string;
  customer_name: string;
  company_name: string;
  plan_name: string;
  amount: number;
  currency?: 'USD' | 'EUR' | 'GBP';
  due_date?: string;
  items?: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    total: number;
  }>;
}

export interface BatchDocumentRequest {
  documents: Array<DocumentGenerationRequest & { request_id?: string }>;
}

export interface BatchDocumentResponse {
  success: boolean;
  batch_results: Array<{
    request_id: string;
    success: boolean;
    document_url?: string;
    error?: string;
    details?: string;
  }>;
  total_documents: number;
  successful_documents: number;
  failed_documents: number;
  timestamp?: string;
}

export interface WorkflowTemplate {
  name: string;
  description: string;
  steps: string[];
  config: Record<string, any>;
}

export interface WorkflowTemplatesResponse {
  success: boolean;
  workflow_templates: Record<string, WorkflowTemplate>;
  timestamp?: string;
}

export interface FoxitHealthResponse {
  success: boolean;
  service: string;
  status: string;
  api_key_configured: boolean;
  templates_configured: boolean;
  response_time?: number;
  timestamp?: string;
}

export interface FoxitTemplatesResponse {
  success: boolean;
  templates: Record<string, string>;
  api_base_url: string;
  endpoints: {
    document_generation: string;
    pdf_services: string;
  };
  status: string;
  timestamp?: string;
}

class FoxitApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    this.token = localStorage.getItem('auth_token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}/api/foxit${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error(`Foxit API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Health Check
  async healthCheck(): Promise<FoxitHealthResponse> {
    return this.makeRequest<FoxitHealthResponse>('/health');
  }

  // Get Templates
  async getTemplates(): Promise<FoxitTemplatesResponse> {
    return this.makeRequest<FoxitTemplatesResponse>('/templates');
  }

  // Generate Document
  async generateDocument(request: DocumentGenerationRequest): Promise<DocumentGenerationResponse> {
    return this.makeRequest<DocumentGenerationResponse>('/generate-document', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Process PDF Workflow
  async processPdfWorkflow(request: PDFWorkflowRequest): Promise<PDFWorkflowResponse> {
    return this.makeRequest<PDFWorkflowResponse>('/process-pdf-workflow', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Create Welcome Packet
  async createWelcomePacket(request: WelcomePacketRequest): Promise<WelcomePacketResponse> {
    return this.makeRequest<WelcomePacketResponse>('/create-welcome-packet', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Create Onboarding Guide
  async createOnboardingGuide(request: OnboardingGuideRequest): Promise<DocumentGenerationResponse> {
    return this.makeRequest<DocumentGenerationResponse>('/create-onboarding-guide', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Create Invoice
  async createInvoice(request: InvoiceRequest): Promise<DocumentGenerationResponse> {
    return this.makeRequest<DocumentGenerationResponse>('/create-invoice', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Batch Generate Documents
  async batchGenerateDocuments(request: BatchDocumentRequest): Promise<BatchDocumentResponse> {
    return this.makeRequest<BatchDocumentResponse>('/batch-generate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Get Workflow Templates
  async getWorkflowTemplates(): Promise<WorkflowTemplatesResponse> {
    return this.makeRequest<WorkflowTemplatesResponse>('/workflow-templates');
  }

  // Utility Methods
  async downloadDocument(documentUrl: string, filename?: string): Promise<void> {
    try {
      const response = await fetch(documentUrl);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || 'document.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download document:', error);
      throw error;
    }
  }

  async openDocumentInNewTab(documentUrl: string): Promise<void> {
    try {
      window.open(documentUrl, '_blank');
    } catch (error) {
      console.error('Failed to open document:', error);
      throw error;
    }
  }

  // Helper method to create welcome packet for a new user
  async createWelcomePacketForUser(userData: {
    name: string;
    company: string;
    plan: string;
    email: string;
    phone: string;
    account_id?: string;
  }): Promise<WelcomePacketResponse> {
    const request: WelcomePacketRequest = {
      ...userData,
      signup_date: new Date().toISOString().split('T')[0],
    };

    return this.createWelcomePacket(request);
  }

  // Helper method to create onboarding guide for a user
  async createOnboardingGuideForUser(userData: {
    name: string;
    company: string;
    plan: string;
    features?: string[];
  }): Promise<DocumentGenerationResponse> {
    const request: OnboardingGuideRequest = {
      ...userData,
    };

    return this.createOnboardingGuide(request);
  }

  // Helper method to create invoice
  async createInvoiceForUser(billingData: {
    customer_name: string;
    company_name: string;
    plan_name: string;
    amount: number;
    currency?: 'USD' | 'EUR' | 'GBP';
    due_date?: string;
    items?: Array<{
      description: string;
      quantity: number;
      unit_price: number;
      total: number;
    }>;
  }): Promise<DocumentGenerationResponse> {
    const request: InvoiceRequest = {
      invoice_number: `INV-${Date.now()}`,
      ...billingData,
    };

    return this.createInvoice(request);
  }

  // Helper method to process multiple documents with a workflow
  async processDocumentsWithWorkflow(
    documentUrls: string[],
    workflowType: 'welcome_packet' | 'contract_package' | 'invoice_package' | 'custom'
  ): Promise<PDFWorkflowResponse> {
    let workflowConfig: PDFWorkflowRequest['workflow_config'] = {};

    // Get predefined workflow templates
    const templates = await this.getWorkflowTemplates();
    
    if (templates.success && templates.workflow_templates[workflowType]) {
      workflowConfig = templates.workflow_templates[workflowType].config;
    } else {
      // Default workflow configuration
      workflowConfig = {
        compress: true,
        compression_level: 'high',
        watermark: {
          type: 'text',
          text: 'OnboardIQ',
          opacity: 0.3,
          rotation: 45,
          position: 'center',
        },
      };
    }

    const request: PDFWorkflowRequest = {
      document_urls: documentUrls,
      workflow_config: workflowConfig,
    };

    return this.processPdfWorkflow(request);
  }

  // Helper method to validate document URL
  isValidDocumentUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }

  // Helper method to get file extension from URL
  getFileExtension(url: string): string {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const extension = pathname.split('.').pop()?.toLowerCase();
      return extension || 'pdf';
    } catch {
      return 'pdf';
    }
  }

  // Helper method to format file size
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Helper method to check if service is available
  async isServiceAvailable(): Promise<boolean> {
    try {
      const health = await this.healthCheck();
      return health.success && health.status === 'healthy';
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const foxitApiService = new FoxitApiService();

// Export default instance
export default foxitApiService;
