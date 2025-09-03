// Environment configuration and validation
export const ENV_CONFIG = {
  // API endpoints
  BACKEND_URL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000',
  VONAGE_API_URL: process.env.REACT_APP_VONAGE_API_URL || 'http://localhost:5000/api/vonage',
  
  // Feature flags
  ENABLE_VONAGE: process.env.REACT_APP_ENABLE_VONAGE !== 'false',
  ENABLE_MOCK_MODE: process.env.REACT_APP_ENABLE_MOCK_MODE === 'true',
  
  // Development flags
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
};

// Environment validation
export const validateEnvironment = () => {
  const issues: string[] = [];
  
  // Check if we're in development mode
  if (!ENV_CONFIG.IS_DEVELOPMENT) {
    console.warn('Running in production mode. Some features may be limited.');
  }
  
  // Check backend connectivity
  if (ENV_CONFIG.BACKEND_URL.includes('localhost')) {
    console.info('Using local backend:', ENV_CONFIG.BACKEND_URL);
  }
  
  // Check Vonage configuration
  if (!ENV_CONFIG.ENABLE_VONAGE) {
    issues.push('Vonage API is disabled');
  }
  
  if (ENV_CONFIG.ENABLE_MOCK_MODE) {
    console.info('Running in mock mode - no real API calls will be made');
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    config: ENV_CONFIG
  };
};

// API URL helpers
export const getApiUrl = (endpoint: string) => {
  return `${ENV_CONFIG.BACKEND_URL}${endpoint}`;
};

export const getVonageApiUrl = (endpoint: string) => {
  return `${ENV_CONFIG.VONAGE_API_URL}${endpoint}`;
};

// Error handling helpers
export const handleApiError = (error: any, context: string = 'API call') => {
  console.error(`${context} failed:`, error);
  
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return {
      error: 'Network error',
      message: 'Unable to connect to the server. Please check your internet connection.',
      details: error.message
    };
  }
  
  if (error.status === 404) {
    return {
      error: 'Not found',
      message: 'The requested resource was not found.',
      details: error.message
    };
  }
  
  if (error.status === 500) {
    return {
      error: 'Server error',
      message: 'An internal server error occurred. Please try again later.',
      details: error.message
    };
  }
  
  return {
    error: 'Unknown error',
    message: 'An unexpected error occurred.',
    details: error.message
  };
};

// Development helpers
export const devLog = (message: string, data?: any) => {
  if (ENV_CONFIG.IS_DEVELOPMENT) {
    console.log(`[DEV] ${message}`, data || '');
  }
};

export const devError = (message: string, error?: any) => {
  if (ENV_CONFIG.IS_DEVELOPMENT) {
    console.error(`[DEV ERROR] ${message}`, error || '');
  }
};

// Feature flag helpers
export const isFeatureEnabled = (feature: keyof typeof ENV_CONFIG) => {
  return ENV_CONFIG[feature] === true;
};

// Mock data helpers
export const getMockData = (type: string) => {
  const mockData = {
    user: {
      id: 'mock_user_123',
      phone_number: '+1234567890',
      email: 'test@example.com',
      company_name: 'Test Company',
      plan_type: 'premium',
      status: 'verified'
    },
    verification: {
      request_id: 'mock_verify_123',
      code: '123456',
      status: 'success'
    },
    onboarding: {
      steps: ['welcome_video_call', 'personalized_tour', 'document_generation', 'follow_up_sms'],
      current_step: 0,
      progress: 0
    }
  };
  
  return mockData[type as keyof typeof mockData] || null;
};
