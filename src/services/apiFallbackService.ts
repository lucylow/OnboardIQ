// API Fallback Service - Provides mock data when real APIs fail
// Intelligent fallback mechanisms with error handling and graceful degradation

import { mockDemoDataService, MockVonageResponse, MockFoxitResponse, MockMuleSoftResponse } from './mockDemoData';

export interface APIFallbackConfig {
  enableMockMode: boolean;
  mockDelay: number;
  retryAttempts: number;
  retryDelay: number;
  fallbackTimeout: number;
}

export interface FallbackResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  isMockData: boolean;
  source: 'real' | 'mock' | 'fallback';
  timestamp: Date;
}

export class APIFallbackService {
  private static instance: APIFallbackService;
  private config: APIFallbackConfig;
  private mockMode: boolean = false;
  private retryCount: Map<string, number> = new Map();

  constructor(config?: Partial<APIFallbackConfig>) {
    this.config = {
      enableMockMode: config?.enableMockMode ?? false,
      mockDelay: config?.mockDelay ?? 1000,
      retryAttempts: config?.retryAttempts ?? 3,
      retryDelay: config?.retryDelay ?? 1000,
      fallbackTimeout: config?.fallbackTimeout ?? 5000
    };
  }

  static getInstance(config?: Partial<APIFallbackConfig>): APIFallbackService {
    if (!APIFallbackService.instance) {
      APIFallbackService.instance = new APIFallbackService(config);
    }
    return APIFallbackService.instance;
  }

  // Enable/Disable mock mode
  setMockMode(enabled: boolean): void {
    this.mockMode = enabled;
    console.log(`Mock mode ${enabled ? 'enabled' : 'disabled'}`);
  }

  isMockModeEnabled(): boolean {
    return this.mockMode || this.config.enableMockMode;
  }

  // Generic API call with fallback
  async callWithFallback<T>(
    realAPICall: () => Promise<T>,
    mockAPICall: () => Promise<T>,
    operationName: string
  ): Promise<FallbackResult<T>> {
    const startTime = Date.now();

    try {
      // If mock mode is enabled, use mock data
      if (this.isMockModeEnabled()) {
        console.log(`Using mock data for ${operationName}`);
        const mockData = await mockAPICall();
        return {
          success: true,
          data: mockData,
          isMockData: true,
          source: 'mock',
          timestamp: new Date()
        };
      }

      // Try real API first
      try {
        const realData = await this.withTimeout(realAPICall(), this.config.fallbackTimeout);
        return {
          success: true,
          data: realData,
          isMockData: false,
          source: 'real',
          timestamp: new Date()
        };
      } catch (realError) {
        console.warn(`Real API failed for ${operationName}:`, realError);
        
        // Try mock API as fallback
        try {
          const mockData = await mockAPICall();
          return {
            success: true,
            data: mockData,
            isMockData: true,
            source: 'fallback',
            timestamp: new Date()
          };
        } catch (mockError) {
          console.error(`Both real and mock APIs failed for ${operationName}:`, mockError);
          throw new Error(`All API attempts failed for ${operationName}`);
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        isMockData: false,
        source: 'fallback',
        timestamp: new Date()
      };
    }
  }

  // Vonage API Fallbacks
  async vonageVerifyWithFallback(phoneNumber: string): Promise<FallbackResult<MockVonageResponse>> {
    return this.callWithFallback(
      async () => {
        // Real Vonage API call would go here
        throw new Error('Real Vonage API not configured');
      },
      async () => mockDemoDataService.mockVonageVerify(phoneNumber),
      'Vonage Verify'
    );
  }

  async vonageVerifyCodeWithFallback(requestId: string, code: string): Promise<FallbackResult<MockVonageResponse>> {
    return this.callWithFallback(
      async () => {
        // Real Vonage API call would go here
        throw new Error('Real Vonage API not configured');
      },
      async () => mockDemoDataService.mockVonageVerifyCode(requestId, code),
      'Vonage Verify Code'
    );
  }

  async vonageSMSWithFallback(to: string, text: string): Promise<FallbackResult<MockVonageResponse>> {
    return this.callWithFallback(
      async () => {
        // Real Vonage SMS API call would go here
        throw new Error('Real Vonage SMS API not configured');
      },
      async () => mockDemoDataService.mockVonageSMS(to, text),
      'Vonage SMS'
    );
  }

  async vonageVideoSessionWithFallback(): Promise<FallbackResult<MockVonageResponse>> {
    return this.callWithFallback(
      async () => {
        // Real Vonage Video API call would go here
        throw new Error('Real Vonage Video API not configured');
      },
      async () => mockDemoDataService.mockVonageVideoSession(),
      'Vonage Video Session'
    );
  }

  // Foxit API Fallbacks
  async foxitGenerateDocumentWithFallback(templateId: string, data: any): Promise<FallbackResult<MockFoxitResponse>> {
    return this.callWithFallback(
      async () => {
        // Real Foxit API call would go here
        throw new Error('Real Foxit API not configured');
      },
      async () => mockDemoDataService.mockFoxitGenerateDocument(templateId, data),
      'Foxit Document Generation'
    );
  }

  async foxitCompressDocumentWithFallback(documentUrl: string): Promise<FallbackResult<MockFoxitResponse>> {
    return this.callWithFallback(
      async () => {
        // Real Foxit API call would go here
        throw new Error('Real Foxit API not configured');
      },
      async () => mockDemoDataService.mockFoxitCompressDocument(documentUrl),
      'Foxit Document Compression'
    );
  }

  async foxitAddWatermarkWithFallback(documentUrl: string, watermarkText: string): Promise<FallbackResult<MockFoxitResponse>> {
    return this.callWithFallback(
      async () => {
        // Real Foxit API call would go here
        throw new Error('Real Foxit API not configured');
      },
      async () => mockDemoDataService.mockFoxitAddWatermark(documentUrl, watermarkText),
      'Foxit Add Watermark'
    );
  }

  // MuleSoft API Fallbacks
  async muleSoftExecuteWorkflowWithFallback(workflowId: string, data: any): Promise<FallbackResult<MockMuleSoftResponse>> {
    return this.callWithFallback(
      async () => {
        // Real MuleSoft API call would go here
        throw new Error('Real MuleSoft API not configured');
      },
      async () => mockDemoDataService.mockMuleSoftExecuteWorkflow(workflowId, data),
      'MuleSoft Workflow Execution'
    );
  }

  async muleSoftGetWorkflowStatusWithFallback(executionId: string): Promise<FallbackResult<MockMuleSoftResponse>> {
    return this.callWithFallback(
      async () => {
        // Real MuleSoft API call would go here
        throw new Error('Real MuleSoft API not configured');
      },
      async () => mockDemoDataService.mockMuleSoftGetWorkflowStatus(executionId),
      'MuleSoft Workflow Status'
    );
  }

  // Error simulation methods
  async simulateErrorWithFallback(errorType: 'network' | 'timeout' | 'rateLimit'): Promise<FallbackResult<any>> {
    const errorMethods = {
      network: () => mockDemoDataService.simulateNetworkError(),
      timeout: () => mockDemoDataService.simulateTimeoutError(),
      rateLimit: () => mockDemoDataService.simulateRateLimitError()
    };

    return this.callWithFallback(
      errorMethods[errorType],
      async () => ({ success: true, message: 'Mock fallback successful' }),
      `Error Simulation - ${errorType}`
    );
  }

  // Utility methods
  private async withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
      )
    ]);
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get fallback statistics
  getFallbackStats() {
    return {
      mockModeEnabled: this.isMockModeEnabled(),
      retryAttempts: this.config.retryAttempts,
      fallbackTimeout: this.config.fallbackTimeout,
      retryCount: Object.fromEntries(this.retryCount)
    };
  }

  // Reset retry counters
  resetRetryCounters(): void {
    this.retryCount.clear();
  }

  // Health check
  async healthCheck(): Promise<{ status: 'healthy' | 'degraded' | 'unhealthy'; details: any }> {
    try {
      // Test mock data service
      const mockTest = await mockDemoDataService.mockVonageVerify('+15551234567');
      
      return {
        status: 'healthy',
        details: {
          mockMode: this.isMockModeEnabled(),
          mockDataService: 'operational',
          fallbackMechanisms: 'ready',
          lastCheck: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        status: 'degraded',
        details: {
          mockMode: this.isMockModeEnabled(),
          mockDataService: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
          lastCheck: new Date().toISOString()
        }
      };
    }
  }
}

// Export singleton instance
export const apiFallbackService = APIFallbackService.getInstance();

// Export convenience functions for common operations
export const vonageVerifyWithFallback = (phoneNumber: string) => 
  apiFallbackService.vonageVerifyWithFallback(phoneNumber);

export const vonageVerifyCodeWithFallback = (requestId: string, code: string) => 
  apiFallbackService.vonageVerifyCodeWithFallback(requestId, code);

export const vonageSMSWithFallback = (to: string, text: string) => 
  apiFallbackService.vonageSMSWithFallback(to, text);

export const vonageVideoSessionWithFallback = () => 
  apiFallbackService.vonageVideoSessionWithFallback();

export const foxitGenerateDocumentWithFallback = (templateId: string, data: any) => 
  apiFallbackService.foxitGenerateDocumentWithFallback(templateId, data);

export const foxitCompressDocumentWithFallback = (documentUrl: string) => 
  apiFallbackService.foxitCompressDocumentWithFallback(documentUrl);

export const foxitAddWatermarkWithFallback = (documentUrl: string, watermarkText: string) => 
  apiFallbackService.foxitAddWatermarkWithFallback(documentUrl, watermarkText);

export const muleSoftExecuteWorkflowWithFallback = (workflowId: string, data: any) => 
  apiFallbackService.muleSoftExecuteWorkflowWithFallback(workflowId, data);

export const muleSoftGetWorkflowStatusWithFallback = (executionId: string) => 
  apiFallbackService.muleSoftGetWorkflowStatusWithFallback(executionId);

// Export configuration helpers
export const configureAPIFallback = (config: Partial<APIFallbackConfig>) => {
  return APIFallbackService.getInstance(config);
};

export const enableMockMode = () => {
  apiFallbackService.setMockMode(true);
};

export const disableMockMode = () => {
  apiFallbackService.setMockMode(false);
};
