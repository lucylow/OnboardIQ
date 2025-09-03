// Comprehensive API service for OnboardIQ frontend
import axios from 'axios';

// API base URL - change this based on your backend setup
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('onboardiq_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('onboardiq_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  // User registration with AI profiling
  signup: async (userData: any) => {
    const response = await api.post('/api/auth/signup', userData);
    return response.data;
  },

  // Phone verification
  verify: async (verificationData: any) => {
    const response = await api.post('/api/auth/verify', verificationData);
    return response.data;
  },

  // User login with security assessment
  login: async (credentials: any) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  // Step-up authentication
  stepUpVerify: async (verificationData: any) => {
    const response = await api.post('/api/auth/step-up-verify', verificationData);
    return response.data;
  },

  // Resend verification code
  resendVerification: async (phoneNumber: string) => {
    const response = await api.post('/api/auth/resend-verification', { phoneNumber });
    return response.data;
  },

  // Get user profile with AI insights
  getProfile: async () => {
    const response = await api.get('/api/auth/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData: any) => {
    const response = await api.put('/api/auth/profile', profileData);
    return response.data;
  },
};

// Onboarding API
export const onboardingAPI = {
  // Start AI-powered onboarding workflow
  startWorkflow: async () => {
    const response = await api.post('/api/onboarding/start');
    return response.data;
  },

  // Get onboarding progress
  getProgress: async (workflowId: string) => {
    const response = await api.get(`/api/onboarding/progress?workflowId=${workflowId}`);
    return response.data;
  },

  // Complete onboarding step
  completeStep: async (stepData: any) => {
    const response = await api.post('/api/onboarding/step/complete', stepData);
    return response.data;
  },

  // Get personalized recommendations
  getRecommendations: async () => {
    const response = await api.get('/api/onboarding/recommendations');
    return response.data;
  },

  // Initiate multi-channel communication
  initiateCommunication: async (communicationData: any) => {
    const response = await api.post('/api/onboarding/communication/initiate', communicationData);
    return response.data;
  },

  // Schedule onboarding call
  scheduleCall: async (callData: any) => {
    const response = await api.post('/api/onboarding/call/schedule', callData);
    return response.data;
  },

  // Generate personalized documents
  generateDocuments: async (documentData: any) => {
    const response = await api.post('/api/onboarding/documents/generate', documentData);
    return response.data;
  },

  // Get onboarding analytics
  getAnalytics: async () => {
    const response = await api.get('/api/onboarding/analytics');
    return response.data;
  },

  // Complete onboarding
  completeOnboarding: async (completionData: any) => {
    const response = await api.post('/api/onboarding/complete', completionData);
    return response.data;
  },

  // Get onboarding status
  getStatus: async () => {
    const response = await api.get('/api/onboarding/status');
    return response.data;
  },
};

// AI Engines API
export const aiAPI = {
  // User Profiling
  classifyUser: async (userData: any) => {
    const response = await api.post('/api/ai/profiling/classify', { userData });
    return response.data;
  },

  getProfilingAnalytics: async () => {
    const response = await api.get('/api/ai/profiling/analytics');
    return response.data;
  },

  // Conversational AI
  processMessage: async (messageData: any) => {
    const response = await api.post('/api/ai/conversational/process', messageData);
    return response.data;
  },

  sendMultiChannelMessage: async (messageData: any) => {
    const response = await api.post('/api/ai/conversational/multi-channel', messageData);
    return response.data;
  },

  getConversationAnalytics: async () => {
    const response = await api.get('/api/ai/conversational/analytics');
    return response.data;
  },

  // Security AI
  assessSecurity: async (securityData: any) => {
    const response = await api.post('/api/ai/security/assess', securityData);
    return response.data;
  },

  initiateStepUpAuth: async (authData: any) => {
    const response = await api.post('/api/ai/security/step-up-auth', authData);
    return response.data;
  },

  getSecurityAnalytics: async () => {
    const response = await api.get('/api/ai/security/analytics');
    return response.data;
  },

  // Document AI
  generateDocument: async (documentData: any) => {
    const response = await api.post('/api/ai/documents/generate', documentData);
    return response.data;
  },

  validateDocument: async (validationData: any) => {
    const response = await api.post('/api/ai/documents/validate', validationData);
    return response.data;
  },

  getDocumentAnalytics: async () => {
    const response = await api.get('/api/ai/documents/analytics');
    return response.data;
  },

  // Churn Prediction
  predictChurn: async (churnData: any) => {
    const response = await api.post('/api/ai/churn/predict', churnData);
    return response.data;
  },

  executeIntervention: async (interventionData: any) => {
    const response = await api.post('/api/ai/churn/intervene', interventionData);
    return response.data;
  },

  getChurnAnalytics: async () => {
    const response = await api.get('/api/ai/churn/analytics');
    return response.data;
  },

  // Multi-Agent Orchestration
  executeWorkflow: async (workflowData: any) => {
    const response = await api.post('/api/ai/orchestrator/execute', workflowData);
    return response.data;
  },

  getOrchestratorStatus: async () => {
    const response = await api.get('/api/ai/orchestrator/status');
    return response.data;
  },

  // AI-Assisted Development
  generateDataWeave: async (transformationData: any) => {
    const response = await api.post('/api/ai/development/generate-dataweave', transformationData);
    return response.data;
  },

  generateTests: async (testData: any) => {
    const response = await api.post('/api/ai/development/generate-tests', testData);
    return response.data;
  },

  // System Health
  getHealth: async () => {
    const response = await api.get('/api/ai/health');
    return response.data;
  },

  getPerformance: async () => {
    const response = await api.get('/api/ai/performance');
    return response.data;
  },
};

// Documents API
export const documentsAPI = {
  // Generate document using Foxit
  generateDocument: async (documentData: any) => {
    const response = await api.post('/api/documents/generate', documentData);
    return response.data;
  },

  // Generate personalized document
  generatePersonalized: async (documentData: any) => {
    const response = await api.post('/api/documents/generate-personalized', documentData);
    return response.data;
  },

  // Compress document
  compressDocument: async (compressData: any) => {
    const response = await api.post('/api/documents/compress', compressData);
    return response.data;
  },

  // Add watermark
  addWatermark: async (watermarkData: any) => {
    const response = await api.post('/api/documents/watermark', watermarkData);
    return response.data;
  },

  // Merge documents
  mergeDocuments: async (mergeData: any) => {
    const response = await api.post('/api/documents/merge', mergeData);
    return response.data;
  },

  // Convert document format
  convertDocument: async (convertData: any) => {
    const response = await api.post('/api/documents/convert', convertData);
    return response.data;
  },

  // Execute document workflow
  executeWorkflow: async (workflowData: any) => {
    const response = await api.post('/api/documents/workflow', workflowData);
    return response.data;
  },

  // Validate document
  validateDocument: async (validationData: any) => {
    const response = await api.post('/api/documents/validate', validationData);
    return response.data;
  },

  // Get document templates
  getTemplates: async (params?: any) => {
    const response = await api.get('/api/documents/templates', { params });
    return response.data;
  },

  // Create document template
  createTemplate: async (templateData: any) => {
    const response = await api.post('/api/documents/templates', templateData);
    return response.data;
  },

  // Update document template
  updateTemplate: async (templateId: string, templateData: any) => {
    const response = await api.put(`/api/documents/templates/${templateId}`, templateData);
    return response.data;
  },

  // Get document analytics
  getAnalytics: async (params?: any) => {
    const response = await api.get('/api/documents/analytics', { params });
    return response.data;
  },

  // Get workflow history
  getWorkflowHistory: async (params?: any) => {
    const response = await api.get('/api/documents/workflow-history', { params });
    return response.data;
  },

  // Retry failed operation
  retryOperation: async (retryData: any) => {
    const response = await api.post('/api/documents/retry', retryData);
    return response.data;
  },

  // Document health check
  getHealth: async () => {
    const response = await api.get('/api/documents/health');
    return response.data;
  },

  // Cleanup old documents
  cleanupDocuments: async (cleanupData: any) => {
    const response = await api.post('/api/documents/cleanup', cleanupData);
    return response.data;
  },

  // Get document by ID
  getDocument: async (documentId: string) => {
    const response = await api.get(`/api/documents/${documentId}`);
    return response.data;
  },

  // Delete document
  deleteDocument: async (documentId: string) => {
    const response = await api.delete(`/api/documents/${documentId}`);
    return response.data;
  },
};

// Utility functions
export const apiUtils = {
  // Check if backend is available
  checkBackendHealth: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      throw new Error('Backend is not available');
    }
  },

  // Get API status
  getAPIStatus: async () => {
    try {
      const [health, aiHealth] = await Promise.all([
        api.get('/health'),
        api.get('/api/ai/health')
      ]);
      return {
        backend: health.data,
        ai: aiHealth.data
      };
    } catch (error) {
      throw new Error('Failed to get API status');
    }
  },

  // Handle API errors
  handleError: (error: any) => {
    if (error.response) {
      return {
        message: error.response.data?.message || 'An error occurred',
        status: error.response.status,
        data: error.response.data
      };
    } else if (error.request) {
      return {
        message: 'Network error - please check your connection',
        status: 0,
        data: null
      };
    } else {
      return {
        message: error.message || 'An unexpected error occurred',
        status: 0,
        data: null
      };
    }
  }
};

export default api;
