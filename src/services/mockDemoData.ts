// Comprehensive Mock Demo Data for OnboardIQ Frontend
// Provides realistic fallback scenarios when APIs don't work

import { faker } from '@faker-js/faker';

// Mock API Response Types
export interface MockVonageResponse {
  success: boolean;
  requestId?: string;
  status?: string;
  error?: string;
  messageId?: string;
  remainingBalance?: string;
  sessionId?: string;
  token?: string;
}

export interface MockFoxitResponse {
  success: boolean;
  documentId?: string;
  downloadUrl?: string;
  fileSize?: string;
  pages?: number;
  error?: string;
  processingTime?: string;
}

export interface MockMuleSoftResponse {
  success: boolean;
  executionId?: string;
  status?: string;
  progress?: number;
  error?: string;
  results?: any;
}

export interface MockUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  plan: 'free' | 'premium' | 'enterprise';
  industry: string;
  companySize: string;
  onboardingProgress: number;
  churnRisk: 'low' | 'medium' | 'high';
  successProbability: number;
  signupDate: Date;
  lastLogin: Date;
  status: 'active' | 'pending' | 'completed' | 'churned';
}

export interface MockDocument {
  id: string;
  name: string;
  type: string;
  status: 'generating' | 'completed' | 'failed';
  downloadUrl?: string;
  fileSize?: string;
  createdAt: Date;
  templateUsed: string;
}

export interface MockWorkflow {
  id: string;
  userId: string;
  status: 'running' | 'completed' | 'failed' | 'paused';
  progress: number;
  currentStep: string;
  steps: Array<{
    id: string;
    name: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    completedAt?: Date;
  }>;
  startDate: Date;
  estimatedCompletion: Date;
}

// Mock Demo Data Service
export class MockDemoDataService {
  private static instance: MockDemoDataService;
  private demoUsers: MockUser[] = [];
  private demoDocuments: MockDocument[] = [];
  private demoWorkflows: MockWorkflow[] = [];

  constructor() {
    this.initializeDemoData();
  }

  static getInstance(): MockDemoDataService {
    if (!MockDemoDataService.instance) {
      MockDemoDataService.instance = new MockDemoDataService();
    }
    return MockDemoDataService.instance;
  }

  private initializeDemoData() {
    // Initialize demo users
    this.demoUsers = [
      {
        id: 'demo_user_1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@techstartup.com',
        phone: '+15551234567',
        company: 'TechStartup Inc.',
        plan: 'premium',
        industry: 'Technology',
        companySize: '11-50',
        onboardingProgress: 75,
        churnRisk: 'low',
        successProbability: 0.92,
        signupDate: faker.date.past(),
        lastLogin: faker.date.recent(),
        status: 'active'
      },
      {
        id: 'demo_user_2',
        name: 'Michael Chen',
        email: 'm.chen@globalfinance.com',
        phone: '+15559876543',
        company: 'Global Finance Corp.',
        plan: 'enterprise',
        industry: 'Finance',
        companySize: '201+',
        onboardingProgress: 45,
        churnRisk: 'medium',
        successProbability: 0.78,
        signupDate: faker.date.past(),
        lastLogin: faker.date.recent(),
        status: 'active'
      },
      {
        id: 'demo_user_3',
        name: 'Emily Rodriguez',
        email: 'emily@healthcareplus.com',
        phone: '+15551111111',
        company: 'Healthcare Plus',
        plan: 'premium',
        industry: 'Healthcare',
        companySize: '51-200',
        onboardingProgress: 90,
        churnRisk: 'low',
        successProbability: 0.95,
        signupDate: faker.date.past(),
        lastLogin: faker.date.recent(),
        status: 'active'
      },
      {
        id: 'demo_user_4',
        name: 'David Thompson',
        email: 'd.thompson@retailchain.com',
        phone: '+15552222222',
        company: 'Retail Chain Corp.',
        plan: 'free',
        industry: 'Retail',
        companySize: '51-200',
        onboardingProgress: 25,
        churnRisk: 'high',
        successProbability: 0.45,
        signupDate: faker.date.past(),
        lastLogin: faker.date.recent(),
        status: 'pending'
      }
    ];

    // Initialize demo documents
    this.demoDocuments = [
      {
        id: 'doc_1',
        name: 'Welcome Packet - Sarah Johnson',
        type: 'welcome_packet',
        status: 'completed',
        downloadUrl: 'https://example.com/mock-welcome-packet-sarah.pdf',
        fileSize: '2.3MB',
        createdAt: faker.date.recent(),
        templateUsed: 'welcome_packet_v2'
      },
      {
        id: 'doc_2',
        name: 'Service Agreement - Michael Chen',
        type: 'contract',
        status: 'completed',
        downloadUrl: 'https://example.com/mock-contract-michael.pdf',
        fileSize: '1.8MB',
        createdAt: faker.date.recent(),
        templateUsed: 'contract_v1'
      },
      {
        id: 'doc_3',
        name: 'User Guide - Emily Rodriguez',
        type: 'guide',
        status: 'generating',
        createdAt: faker.date.recent(),
        templateUsed: 'guide_v1'
      }
    ];

    // Initialize demo workflows
    this.demoWorkflows = [
      {
        id: 'workflow_1',
        userId: 'demo_user_1',
        status: 'running',
        progress: 75,
        currentStep: 'Document Generation',
        steps: [
          { id: 'welcome', name: 'Welcome Sequence', status: 'completed', completedAt: faker.date.recent() },
          { id: 'profile', name: 'Profile Setup', status: 'completed', completedAt: faker.date.recent() },
          { id: 'documents', name: 'Document Review', status: 'running' },
          { id: 'security', name: 'Security Verification', status: 'pending' },
          { id: 'final', name: 'Final Setup', status: 'pending' }
        ],
        startDate: faker.date.past(),
        estimatedCompletion: faker.date.future()
      },
      {
        id: 'workflow_2',
        userId: 'demo_user_2',
        status: 'completed',
        progress: 100,
        currentStep: 'Complete',
        steps: [
          { id: 'welcome', name: 'Welcome Sequence', status: 'completed', completedAt: faker.date.recent() },
          { id: 'profile', name: 'Profile Setup', status: 'completed', completedAt: faker.date.recent() },
          { id: 'documents', name: 'Document Review', status: 'completed', completedAt: faker.date.recent() },
          { id: 'security', name: 'Security Verification', status: 'completed', completedAt: faker.date.recent() },
          { id: 'final', name: 'Final Setup', status: 'completed', completedAt: faker.date.recent() }
        ],
        startDate: faker.date.past(),
        estimatedCompletion: faker.date.recent()
      }
    ];
  }

  // Vonage Mock API Methods
  async mockVonageVerify(phoneNumber: string): Promise<MockVonageResponse> {
    console.log(`Mock Vonage: Sending verification code to ${phoneNumber}`);
    
    // Simulate different scenarios
    const scenarios = [
      { success: true, delay: 1000 },
      { success: true, delay: 2000 },
      { success: false, error: 'INSUFFICIENT_CREDITS', delay: 500 },
      { success: false, error: 'INVALID_PHONE_NUMBER', delay: 300 }
    ];
    
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    await new Promise(resolve => setTimeout(resolve, scenario.delay));
    
    if (!scenario.success) {
      return { success: false, error: scenario.error };
    }
    
    return {
      success: true,
      requestId: 'mock_request_' + Math.random().toString(36).substr(2, 9),
      status: '0',
      remainingBalance: '95.50'
    };
  }

  async mockVonageVerifyCode(requestId: string, code: string): Promise<MockVonageResponse> {
    console.log(`Mock Vonage: Verifying code ${code} for request ${requestId}`);
    
    // Accept any 6-digit code for demo purposes, but simulate some failures
    if (code && code.length === 6) {
      // 90% success rate for demo
      if (Math.random() > 0.1) {
        return { 
          success: true,
          status: '0',
          requestId: requestId,
          remainingBalance: '95.49'
        };
      } else {
        return { success: false, error: 'INVALID_CODE' };
      }
    }
    return { success: false, error: 'INVALID_CODE' };
  }

  async mockVonageSMS(to: string, text: string): Promise<MockVonageResponse> {
    console.log(`Mock Vonage: Sending SMS to ${to}: ${text}`);
    
    // Simulate SMS delivery scenarios
    const scenarios = [
      { success: true, status: '0', delay: 800 },
      { success: true, status: '0', delay: 1200 },
      { success: false, status: '1', error: 'INSUFFICIENT_CREDITS', delay: 400 },
      { success: false, status: '2', error: 'INVALID_NUMBER', delay: 300 }
    ];
    
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    await new Promise(resolve => setTimeout(resolve, scenario.delay));
    
    if (!scenario.success) {
      return { success: false, error: scenario.error };
    }
    
    return { 
      success: true,
      messageId: 'mock_sms_' + Math.random().toString(36).substr(2, 9),
      status: scenario.status,
      remainingBalance: '95.48'
    };
  }

  async mockVonageVideoSession(): Promise<MockVonageResponse> {
    console.log('Mock Vonage: Creating video session');
    
    const sessionId = 'sid_' + Math.random().toString(36).substr(2, 9);
    const token = 'tok_' + Math.random().toString(36).substr(2, 16);
    
    return {
      success: true,
      sessionId: sessionId,
      token: token
    };
  }

  // Foxit Mock API Methods
  async mockFoxitGenerateDocument(templateId: string, data: any): Promise<MockFoxitResponse> {
    console.log(`Mock Foxit: Generating document with template ${templateId}`);
    
    const templates = {
      'welcome_packet': { name: 'Welcome Packet', fields: ['customer_name', 'company_name', 'plan_name'] },
      'contract': { name: 'Service Agreement', fields: ['customer_name', 'company_name', 'terms'] },
      'guide': { name: 'User Guide', fields: ['customer_name', 'features'] },
      'invoice': { name: 'Invoice', fields: ['customer_name', 'amount', 'services'] }
    };
    
    const template = templates[templateId as keyof typeof templates];
    if (!template) {
      return { success: false, error: `Template ${templateId} not found` };
    }
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    return {
      success: true,
      documentId: 'mock_doc_' + Math.random().toString(36).substr(2, 9),
      downloadUrl: `https://example.com/mock-${templateId}-${Date.now()}.pdf`,
      fileSize: (Math.random() * 3 + 1).toFixed(1) + 'MB',
      pages: Math.floor(Math.random() * 10) + 5,
      processingTime: '2.1s'
    };
  }

  async mockFoxitCompressDocument(documentUrl: string): Promise<MockFoxitResponse> {
    console.log(`Mock Foxit: Compressing document ${documentUrl}`);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      success: true,
      downloadUrl: documentUrl.replace('.pdf', '-compressed.pdf'),
      fileSize: '1.1MB',
      processingTime: '0.8s'
    };
  }

  async mockFoxitAddWatermark(documentUrl: string, watermarkText: string): Promise<MockFoxitResponse> {
    console.log(`Mock Foxit: Adding watermark "${watermarkText}" to ${documentUrl}`);
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      success: true,
      downloadUrl: documentUrl.replace('.pdf', '-watermarked.pdf'),
      processingTime: '0.6s'
    };
  }

  // MuleSoft Mock API Methods
  async mockMuleSoftExecuteWorkflow(workflowId: string, data: any): Promise<MockMuleSoftResponse> {
    console.log(`Mock MuleSoft: Executing workflow ${workflowId}`);
    
    const workflows = {
      'onboarding_workflow': {
        steps: ['intake', 'profiling', 'verification', 'communication', 'documentation'],
        estimated_duration: '5 minutes'
      },
      'churn_prevention': {
        steps: ['monitoring', 'analysis', 'intervention', 'followup'],
        estimated_duration: '3 minutes'
      },
      'document_processing': {
        steps: ['validation', 'generation', 'compression', 'delivery'],
        estimated_duration: '2 minutes'
      }
    };
    
    const workflow = workflows[workflowId as keyof typeof workflows];
    if (!workflow) {
      return { success: false, error: `Workflow ${workflowId} not found` };
    }
    
    // Simulate workflow execution
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      success: true,
      executionId: 'exec_' + Math.random().toString(36).substr(2, 9),
      status: 'completed',
      progress: 100,
      results: {
        user_profiled: true,
        documents_generated: 2,
        communications_sent: 1
      }
    };
  }

  async mockMuleSoftGetWorkflowStatus(executionId: string): Promise<MockMuleSoftResponse> {
    console.log(`Mock MuleSoft: Checking workflow status for ${executionId}`);
    
    const statuses = ['running', 'completed', 'failed', 'paused'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      success: true,
      executionId: executionId,
      status: status,
      progress: status === 'completed' ? 100 : Math.floor(Math.random() * 90)
    };
  }

  // Demo Data Getters
  getDemoUsers(): MockUser[] {
    return this.demoUsers;
  }

  getDemoUser(userId: string): MockUser | undefined {
    return this.demoUsers.find(user => user.id === userId);
  }

  getDemoDocuments(): MockDocument[] {
    return this.demoDocuments;
  }

  getDemoWorkflows(): MockWorkflow[] {
    return this.demoWorkflows;
  }

  getDemoWorkflow(workflowId: string): MockWorkflow | undefined {
    return this.demoWorkflows.find(workflow => workflow.id === workflowId);
  }

  // Error Simulation Methods
  simulateNetworkError(): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Network error: Unable to connect to service'));
      }, 1000);
    });
  }

  simulateTimeoutError(): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Request timeout: Service took too long to respond'));
      }, 5000);
    });
  }

  simulateRateLimitError(): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Rate limit exceeded: Too many requests'));
      }, 500);
    });
  }

  // Demo Scenarios
  getDemoScenarios() {
    return {
      highValueCustomer: {
        name: 'High-Value Enterprise Customer',
        description: 'Complete onboarding with video session and personalized documents',
        steps: ['Phone Verification', 'AI Profiling', 'Video Onboarding', 'Document Generation', 'Follow-up'],
        estimatedDuration: '15 minutes',
        successRate: '95%',
        user: this.demoUsers[1] // Michael Chen
      },
      mediumRiskCustomer: {
        name: 'Medium-Risk Customer',
        description: 'Standard onboarding with enhanced monitoring',
        steps: ['Phone Verification', 'AI Profiling', 'Document Generation', 'SMS Follow-up'],
        estimatedDuration: '8 minutes',
        successRate: '88%',
        user: this.demoUsers[3] // David Thompson
      },
      quickSetupCustomer: {
        name: 'Quick Setup Customer',
        description: 'Fast-track onboarding for immediate value',
        steps: ['Phone Verification', 'Document Generation', 'Email Welcome'],
        estimatedDuration: '5 minutes',
        successRate: '92%',
        user: this.demoUsers[0] // Sarah Johnson
      }
    };
  }

  // Error Scenarios
  getErrorScenarios() {
    return {
      smsDeliveryFailed: {
        type: 'SMS_DELIVERY_FAILED',
        description: 'SMS verification code delivery failed',
        recovery: 'Fallback to email verification',
        frequency: '2%',
        userImpact: 'Low - alternative verification method available'
      },
      documentGenerationTimeout: {
        type: 'DOCUMENT_GENERATION_TIMEOUT',
        description: 'Document generation exceeded time limit',
        recovery: 'Retry with simplified template',
        frequency: '1%',
        userImpact: 'Medium - slight delay in document delivery'
      },
      videoSessionUnavailable: {
        type: 'VIDEO_SESSION_UNAVAILABLE',
        description: 'Video onboarding session unavailable',
        recovery: 'Schedule for later or use alternative channel',
        frequency: '3%',
        userImpact: 'Medium - rescheduling required'
      },
      apiRateLimit: {
        type: 'API_RATE_LIMIT',
        description: 'API rate limit exceeded',
        recovery: 'Automatic retry with exponential backoff',
        frequency: '0.5%',
        userImpact: 'Low - automatic recovery'
      }
    };
  }
}

// Export singleton instance
export const mockDemoDataService = MockDemoDataService.getInstance();

// Export convenience functions
export const mockVonageVerify = (phoneNumber: string) => mockDemoDataService.mockVonageVerify(phoneNumber);
export const mockVonageVerifyCode = (requestId: string, code: string) => mockDemoDataService.mockVonageVerifyCode(requestId, code);
export const mockVonageSMS = (to: string, text: string) => mockDemoDataService.mockVonageSMS(to, text);
export const mockVonageVideoSession = () => mockDemoDataService.mockVonageVideoSession();
export const mockFoxitGenerateDocument = (templateId: string, data: any) => mockDemoDataService.mockFoxitGenerateDocument(templateId, data);
export const mockFoxitCompressDocument = (documentUrl: string) => mockDemoDataService.mockFoxitCompressDocument(documentUrl);
export const mockFoxitAddWatermark = (documentUrl: string, watermarkText: string) => mockDemoDataService.mockFoxitAddWatermark(documentUrl, watermarkText);
export const mockMuleSoftExecuteWorkflow = (workflowId: string, data: any) => mockDemoDataService.mockMuleSoftExecuteWorkflow(workflowId, data);
export const mockMuleSoftGetWorkflowStatus = (executionId: string) => mockDemoDataService.mockMuleSoftGetWorkflowStatus(executionId);
