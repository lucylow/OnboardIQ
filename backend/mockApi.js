// Enhanced Mock API service for development and demo
// This simulates the Vonage, Foxit, and MuleSoft APIs when real credentials aren't available

const mockVonageService = {
  // Enhanced SMS Verification
  async sendVerificationCode(phoneNumber) {
    console.log(`Mock: Sending verification code to ${phoneNumber}`);
    
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
      throw new Error(scenario.error);
    }
    
    return {
      request_id: 'mock_request_' + Math.random().toString(36).substr(2, 9),
      status: '0',
      remaining_balance: '95.50',
      message_price: '0.01'
    };
  },

  async verifyCode(requestId, code) {
    console.log(`Mock: Verifying code ${code} for request ${requestId}`);
    
    // Accept any 6-digit code for demo purposes, but simulate some failures
    if (code && code.length === 6) {
      // 90% success rate for demo
      if (Math.random() > 0.1) {
        return { 
          status: '0',
          request_id: requestId,
          remaining_balance: '95.49'
        };
      } else {
        return { status: '16' }; // Invalid code
      }
    }
    return { status: '16' }; // Invalid code
  },

  async sendSMS(to, text) {
    console.log(`Mock: Sending SMS to ${to}: ${text}`);
    
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
      throw new Error(scenario.error);
    }
    
    return { 
      message_id: 'mock_sms_' + Math.random().toString(36).substr(2, 9),
      status: scenario.status,
      remaining_balance: '95.48',
      message_price: '0.01'
    };
  },

  async createVideoSession() {
    console.log('Mock: Creating video session');
    
    const sessionId = 'sid_' + Math.random().toString(36).substr(2, 9);
    const token = 'tok_' + Math.random().toString(36).substr(2, 16);
    
    return {
      sessionId: sessionId,
      apiKey: 'mock_video_api_key',
      token: token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
  },

  async sendBulkSMS(recipients, text) {
    console.log(`Mock: Sending bulk SMS to ${recipients.length} recipients`);
    
    const results = recipients.map(recipient => {
      const success = Math.random() > 0.1; // 90% success rate
      return {
        recipient: recipient,
        status: success ? '0' : '1',
        message_id: success ? 'mock_bulk_' + Math.random().toString(36).substr(2, 9) : null,
        error: success ? null : 'DELIVERY_FAILED'
      };
    });
    
    return {
      total: recipients.length,
      successful: results.filter(r => r.status === '0').length,
      failed: results.filter(r => r.status !== '0').length,
      results: results
    };
  }
};

const mockFoxitService = {
  async createWelcomePackage(userData) {
    console.log(`Mock: Creating welcome package for ${userData.customer_name}`);
    
    // Simulate document generation with different scenarios
    const scenarios = [
      { success: true, delay: 2000, size: '2.3MB' },
      { success: true, delay: 1500, size: '1.8MB' },
      { success: false, error: 'TEMPLATE_NOT_FOUND', delay: 500 },
      { success: false, error: 'INSUFFICIENT_QUOTA', delay: 300 }
    ];
    
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    await new Promise(resolve => setTimeout(resolve, scenario.delay));
    
    if (!scenario.success) {
      throw new Error(scenario.error);
    }
    
    return {
      success: true,
      download_url: 'https://example.com/mock-welcome-package.pdf',
      document_id: 'mock_doc_' + Math.random().toString(36).substr(2, 9),
      file_size: scenario.size,
      generated_at: new Date().toISOString(),
      template_used: 'welcome_packet_v2'
    };
  },

  async generateDocument(templateId, data) {
    console.log(`Mock: Generating document with template ${templateId}`);
    
    const templates = {
      'welcome_packet': { name: 'Welcome Packet', fields: ['customer_name', 'company_name', 'plan_name'] },
      'contract': { name: 'Service Agreement', fields: ['customer_name', 'company_name', 'terms'] },
      'guide': { name: 'User Guide', fields: ['customer_name', 'features'] },
      'invoice': { name: 'Invoice', fields: ['customer_name', 'amount', 'services'] }
    };
    
    const template = templates[templateId];
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    return {
      document_id: 'mock_doc_' + Math.random().toString(36).substr(2, 9),
      download_url: `https://example.com/mock-${templateId}-${Date.now()}.pdf`,
      template_used: templateId,
      generated_at: new Date().toISOString(),
      file_size: (Math.random() * 3 + 1).toFixed(1) + 'MB',
      pages: Math.floor(Math.random() * 10) + 5
    };
  },

  async compressDocument(documentUrl) {
    console.log(`Mock: Compressing document ${documentUrl}`);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      original_size: '2.3MB',
      compressed_size: '1.1MB',
      compression_ratio: '52%',
      download_url: documentUrl.replace('.pdf', '-compressed.pdf')
    };
  },

  async addWatermark(documentUrl, watermarkText) {
    console.log(`Mock: Adding watermark "${watermarkText}" to ${documentUrl}`);
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      download_url: documentUrl.replace('.pdf', '-watermarked.pdf'),
      watermark_added: watermarkText,
      processing_time: '0.6s'
    };
  },

  async mergeDocuments(documentUrls) {
    console.log(`Mock: Merging ${documentUrls.length} documents`);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      merged_document_id: 'mock_merged_' + Math.random().toString(36).substr(2, 9),
      download_url: 'https://example.com/mock-merged-document.pdf',
      total_pages: documentUrls.length * 5,
      file_size: (documentUrls.length * 1.2).toFixed(1) + 'MB'
    };
  }
};

const mockMuleSoftService = {
  async authenticate() {
    console.log('Mock: Authenticating with MuleSoft');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      access_token: 'mock_mulesoft_token_' + Date.now(),
      token_type: 'Bearer',
      expires_in: 3600,
      scope: 'read write'
    };
  },

  async executeWorkflow(workflowId, data) {
    console.log(`Mock: Executing workflow ${workflowId}`);
    
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
    
    const workflow = workflows[workflowId];
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found`);
    }
    
    // Simulate workflow execution
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      workflow_id: workflowId,
      execution_id: 'exec_' + Math.random().toString(36).substr(2, 9),
      status: 'completed',
      steps_completed: workflow.steps.length,
      total_steps: workflow.steps.length,
      execution_time: '2.1s',
      results: {
        user_profiled: true,
        documents_generated: 2,
        communications_sent: 1
      }
    };
  },

  async getWorkflowStatus(executionId) {
    console.log(`Mock: Checking workflow status for ${executionId}`);
    
    const statuses = ['running', 'completed', 'failed', 'paused'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      execution_id: executionId,
      status: status,
      progress: status === 'completed' ? 100 : Math.floor(Math.random() * 90),
      current_step: 'documentation',
      estimated_completion: new Date(Date.now() + 60000).toISOString()
    };
  }
};

const mockEmailService = {
  async sendWelcomeEmail(user, documentUrl) {
    console.log(`Mock: Sending welcome email to ${user.email} with document ${documentUrl}`);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { 
      messageId: 'mock_email_' + Math.random().toString(36).substr(2, 9),
      status: 'sent',
      delivered_at: new Date().toISOString()
    };
  },

  async sendFollowUpEmail(user) {
    console.log(`Mock: Sending follow-up email to ${user.email}`);
    
    await new Promise(resolve => setTimeout(resolve, 400));
    
    return { 
      messageId: 'mock_followup_' + Math.random().toString(36).substr(2, 9),
      status: 'sent',
      delivered_at: new Date().toISOString()
    };
  },

  async sendBulkEmail(recipients, template, data) {
    console.log(`Mock: Sending bulk email to ${recipients.length} recipients`);
    
    const results = recipients.map(recipient => {
      const success = Math.random() > 0.05; // 95% success rate
      return {
        email: recipient,
        status: success ? 'sent' : 'failed',
        message_id: success ? 'mock_bulk_email_' + Math.random().toString(36).substr(2, 9) : null,
        error: success ? null : 'BOUNCE'
      };
    });
    
    return {
      total: recipients.length,
      successful: results.filter(r => r.status === 'sent').length,
      failed: results.filter(r => r.status === 'failed').length,
      results: results
    };
  }
};

// Enhanced mock data for comprehensive demo scenarios
const mockDemoData = {
  // User profiles for different scenarios
  users: [
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
      successProbability: 0.92
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
      successProbability: 0.78
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
      successProbability: 0.95
    }
  ],

  // Document templates
  documentTemplates: [
    {
      id: 'welcome_packet',
      name: 'Welcome Packet',
      description: 'Personalized welcome document with company branding',
      fields: ['customer_name', 'company_name', 'plan_name', 'signup_date'],
      estimatedGenerationTime: '2-3 seconds'
    },
    {
      id: 'contract',
      name: 'Service Agreement',
      description: 'Legal contract with terms and conditions',
      fields: ['customer_name', 'company_name', 'terms', 'effective_date'],
      estimatedGenerationTime: '3-4 seconds'
    },
    {
      id: 'guide',
      name: 'User Guide',
      description: 'Step-by-step onboarding guide',
      fields: ['customer_name', 'features', 'tutorials'],
      estimatedGenerationTime: '2-3 seconds'
    }
  ],

  // Workflow scenarios
  workflowScenarios: [
    {
      id: 'scenario_1',
      name: 'High-Value Enterprise Customer',
      description: 'Complete onboarding with video session and personalized documents',
      steps: ['Phone Verification', 'AI Profiling', 'Video Onboarding', 'Document Generation', 'Follow-up'],
      estimatedDuration: '15 minutes',
      successRate: '95%'
    },
    {
      id: 'scenario_2',
      name: 'Medium-Risk Customer',
      description: 'Standard onboarding with enhanced monitoring',
      steps: ['Phone Verification', 'AI Profiling', 'Document Generation', 'SMS Follow-up'],
      estimatedDuration: '8 minutes',
      successRate: '88%'
    },
    {
      id: 'scenario_3',
      name: 'Quick Setup Customer',
      description: 'Fast-track onboarding for immediate value',
      steps: ['Phone Verification', 'Document Generation', 'Email Welcome'],
      estimatedDuration: '5 minutes',
      successRate: '92%'
    }
  ],

  // Error scenarios for testing
  errorScenarios: [
    {
      id: 'error_1',
      type: 'SMS_DELIVERY_FAILED',
      description: 'SMS verification code delivery failed',
      recovery: 'Fallback to email verification',
      frequency: '2%'
    },
    {
      id: 'error_2',
      type: 'DOCUMENT_GENERATION_TIMEOUT',
      description: 'Document generation exceeded time limit',
      recovery: 'Retry with simplified template',
      frequency: '1%'
    },
    {
      id: 'error_3',
      type: 'VIDEO_SESSION_UNAVAILABLE',
      description: 'Video onboarding session unavailable',
      recovery: 'Schedule for later or use alternative channel',
      frequency: '3%'
    }
  ]
};

module.exports = {
  mockVonageService,
  mockFoxitService,
  mockMuleSoftService,
  mockEmailService,
  mockDemoData
};
