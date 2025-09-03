// Vonage API Service - Enhanced Authentication and Multi-channel Communication
// Comprehensive service for Vonage Verify, SIM Swap, Insights, SMS, Voice, Video, and WhatsApp

export interface VonageVerifyRequest {
  phoneNumber: string;
  brand?: string;
  codeLength?: number;
  workflowId?: number;
  language?: string;
  pinExpiry?: number;
  nextEventWait?: number;
}

export interface VonageVerifyResponse {
  success: boolean;
  requestId: string;
  status: string;
  errorText?: string;
  estimatedCost?: string;
  remainingAttempts?: number;
}

export interface VonageVerifyCheckRequest {
  requestId: string;
  code: string;
}

export interface VonageVerifyCheckResponse {
  success: boolean;
  status: string;
  errorText?: string;
  requestId: string;
  eventId?: string;
  price?: string;
  currency?: string;
}

export interface VonageSimSwapRequest {
  phoneNumber: string;
  country?: string;
}

export interface VonageSimSwapResponse {
  success: boolean;
  requestId: string;
  status: string;
  swapped?: boolean;
  swappedAt?: string;
  errorText?: string;
}

export interface VonageInsightsRequest {
  phoneNumber: string;
  level?: 'basic' | 'standard' | 'advanced';
}

export interface VonageInsightsResponse {
  success: boolean;
  requestId: string;
  status: string;
  phoneNumber: string;
  country?: string;
  carrier?: string;
  type?: string;
  valid?: boolean;
  reachable?: boolean;
  ported?: boolean;
  roaming?: boolean;
  errorText?: string;
}

export interface VonageSMSRequest {
  to: string;
  from: string;
  text: string;
  options?: {
    ttl?: number;
    deliveryReceipt?: boolean;
    callbackUrl?: string;
  };
}

export interface VonageSMSResponse {
  success: boolean;
  messageId: string;
  status: string;
  to: string;
  from: string;
  remainingBalance: string;
  messagePrice: string;
  network: string;
  errorText?: string;
}

export interface VonageVoiceRequest {
  to: string;
  from: string;
  text: string;
  options?: {
    voiceName?: string;
    language?: string;
    speed?: number;
    level?: number;
    loop?: number;
  };
}

export interface VonageVoiceResponse {
  success: boolean;
  uuid: string;
  status: string;
  direction: string;
  rate: string;
  errorText?: string;
}

export interface VonageVideoSessionRequest {
  mediaMode?: 'routed' | 'relayed';
  archiveMode?: 'manual' | 'always';
  location?: string;
  options?: {
    p2p?: boolean;
    recording?: boolean;
  };
}

export interface VonageVideoSessionResponse {
  success: boolean;
  sessionId: string;
  mediaMode: string;
  archiveMode: string;
  location: string;
  errorText?: string;
}

export interface VonageVideoTokenRequest {
  sessionId: string;
  role?: 'publisher' | 'subscriber' | 'moderator';
  data?: string;
  expireTime?: number;
}

export interface VonageVideoTokenResponse {
  success: boolean;
  token: string;
  sessionId: string;
  role: string;
  expireTime: number;
  errorText?: string;
}

export interface VonageWhatsAppRequest {
  to: string;
  from: string;
  text: string;
  options?: {
    ttl?: number;
    deliveryReceipt?: boolean;
  };
}

export interface VonageWhatsAppResponse {
  success: boolean;
  messageUuid: string;
  to: string;
  from: string;
  status: string;
  errorText?: string;
}

export interface VonageMultiChannelRequest {
  recipient: {
    phone?: string;
    email?: string;
  };
  channels: string[];
  message: string;
  options?: {
    from?: string;
    priority?: 'low' | 'normal' | 'high';
    retryAttempts?: number;
  };
}

export interface VonageMultiChannelResponse {
  success: boolean;
  recipient: any;
  channels: string[];
  results: Record<string, any>;
  successful: number;
  failed: number;
  errorText?: string;
}

export interface VonageAccountBalance {
  balance: string;
  currency: string;
  autoReload: boolean;
}

export interface VonageMessageHistory {
  messages: Array<{
    messageId: string;
    to: string;
    from: string;
    text: string;
    status: string;
    timestamp: string;
  }>;
  count: number;
}

export interface VonageAnalytics {
  period: string;
  totalMessages: number;
  successfulMessages: number;
  failedMessages: number;
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  totalVerifications: number;
  successfulVerifications: number;
  failedVerifications: number;
  averageResponseTime: string;
  costPerMessage: string;
  costPerCall: string;
  costPerVerification: string;
}

// Enhanced Vonage API Service with comprehensive features
class VonageApiService {
  private baseUrl: string;
  private apiKey: string;
  private apiSecret: string;
  private isMockMode: boolean;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }>;
  private retryAttempts: number;
  private retryDelay: number;

  constructor() {
    this.baseUrl = import.meta.env.VITE_VONAGE_API_BASE_URL || 'http://localhost:3001/api/vonage';
    this.apiKey = import.meta.env.VITE_VONAGE_API_KEY || '';
    this.apiSecret = import.meta.env.VITE_VONAGE_API_SECRET || '';
    this.isMockMode = !this.apiKey || import.meta.env.VITE_USE_MOCK_VONAGE === 'true';
    this.cache = new Map();
    this.retryAttempts = 3;
    this.retryDelay = 1000;
  }

  // Enhanced request method with retry logic and caching
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    useCache: boolean = false,
    cacheKey?: string,
    cacheTTL: number = 5 * 60 * 1000
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
      'x-api-secret': this.apiSecret,
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
          console.warn(`Vonage API request failed (attempt ${attempt}/${this.retryAttempts}):`, error);
          await this.delay(this.retryDelay * attempt);
        }
      }
    }

    console.error(`Vonage API request failed after ${this.retryAttempts} attempts:`, lastError);
    
    if (this.isMockMode) {
      return this.getMockResponse<T>(endpoint, options);
    }
    
    throw lastError;
  }

  private generateRequestId(): string {
    return `vonage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Clear cache
  public clearCache(): void {
    this.cache.clear();
  }

  // Health check
  async checkHealth(): Promise<{ status: string; version: string; features: string[]; timestamp: string }> {
    return this.makeRequest('/health', { method: 'GET' }, true, 'health', 30 * 1000);
  }

  // === AUTHENTICATION & SECURITY ===

  // Start verification process
  async startVerification(request: VonageVerifyRequest): Promise<VonageVerifyResponse> {
    const payload = {
      number: request.phoneNumber,
      brand: request.brand || 'OnboardIQ',
      codeLength: request.codeLength || 6,
      workflowId: request.workflowId || 6,
      language: request.language || 'en-us',
      pinExpiry: request.pinExpiry || 300,
      nextEventWait: request.nextEventWait || 60
    };

    return this.makeRequest<VonageVerifyResponse>('/verify/start', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // Check verification code
  async checkVerification(request: VonageVerifyCheckRequest): Promise<VonageVerifyCheckResponse> {
    const payload = {
      request_id: request.requestId,
      code: request.code
    };

    return this.makeRequest<VonageVerifyCheckResponse>('/verify/check', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // Cancel verification
  async cancelVerification(requestId: string): Promise<{ success: boolean; requestId: string; status: string }> {
    return this.makeRequest(`/verify/cancel`, {
      method: 'POST',
      body: JSON.stringify({ request_id: requestId })
    });
  }

  // SIM Swap detection
  async checkSimSwap(request: VonageSimSwapRequest): Promise<VonageSimSwapResponse> {
    const payload = {
      number: request.phoneNumber,
      country: request.country || 'US'
    };

    return this.makeRequest<VonageSimSwapResponse>('/sim-swap', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // Phone number insights
  async getPhoneInsights(request: VonageInsightsRequest): Promise<VonageInsightsResponse> {
    const payload = {
      number: request.phoneNumber,
      level: request.level || 'standard'
    };

    return this.makeRequest<VonageInsightsResponse>('/insights', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // === MULTI-CHANNEL COMMUNICATION ===

  // Send SMS
  async sendSMS(request: VonageSMSRequest): Promise<VonageSMSResponse> {
    const payload = {
      to: request.to,
      from: request.from,
      text: request.text,
      ttl: request.options?.ttl || 259200,
      delivery_receipt: request.options?.deliveryReceipt || false,
      callback_url: request.options?.callbackUrl
    };

    return this.makeRequest<VonageSMSResponse>('/sms/send', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // Send bulk SMS
  async sendBulkSMS(recipients: string[], from: string, text: string, options = {}): Promise<{
    success: boolean;
    total: number;
    successful: number;
    failed: number;
    results: VonageSMSResponse[];
  }> {
    const results = [];
    let successful = 0;
    let failed = 0;

    for (const recipient of recipients) {
      try {
        const result = await this.sendSMS({ to: recipient, from, text, options });
        results.push(result);
        successful++;
      } catch (error) {
        results.push({
          success: false,
          messageId: '',
          status: 'failed',
          to: recipient,
          from,
          remainingBalance: '0',
          messagePrice: '0',
          network: 'unknown',
          errorText: (error as Error).message
        });
        failed++;
      }
    }

    return {
      success: failed === 0,
      total: recipients.length,
      successful,
      failed,
      results
    };
  }

  // Make voice call
  async makeVoiceCall(request: VonageVoiceRequest): Promise<VonageVoiceResponse> {
    const payload = {
      to: [{
        type: 'phone',
        number: request.to
      }],
      from: {
        type: 'phone',
        number: request.from
      },
      ncco: [
        {
          action: 'talk',
          text: request.text,
          voiceName: request.options?.voiceName || 'Amy',
          language: request.options?.language || 'en-US',
          speed: request.options?.speed || 1.0,
          level: request.options?.level || 0,
          loop: request.options?.loop || 1
        }
      ]
    };

    return this.makeRequest<VonageVoiceResponse>('/voice/call', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // Create video session
  async createVideoSession(request: VonageVideoSessionRequest): Promise<VonageVideoSessionResponse> {
    const payload = {
      mediaMode: request.mediaMode || 'routed',
      archiveMode: request.archiveMode || 'manual',
      location: request.location || 'auto',
      p2p: request.options?.p2p || false,
      recording: request.options?.recording || false
    };

    return this.makeRequest<VonageVideoSessionResponse>('/video/session', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // Generate video token
  async generateVideoToken(request: VonageVideoTokenRequest): Promise<VonageVideoTokenResponse> {
    const payload = {
      sessionId: request.sessionId,
      role: request.role || 'publisher',
      data: request.data || '',
      expireTime: request.expireTime || Math.floor(Date.now() / 1000) + 86400
    };

    return this.makeRequest<VonageVideoTokenResponse>('/video/token', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // Send WhatsApp message
  async sendWhatsApp(request: VonageWhatsAppRequest): Promise<VonageWhatsAppResponse> {
    const payload = {
      to: request.to,
      from: request.from,
      text: request.text,
      ttl: request.options?.ttl || 259200,
      delivery_receipt: request.options?.deliveryReceipt || false
    };

    return this.makeRequest<VonageWhatsAppResponse>('/whatsapp/send', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // Multi-channel messaging
  async sendMultiChannelMessage(request: VonageMultiChannelRequest): Promise<VonageMultiChannelResponse> {
    const payload = {
      recipient: request.recipient,
      channels: request.channels,
      message: request.message,
      from: request.options?.from || 'OnboardIQ',
      priority: request.options?.priority || 'normal',
      retry_attempts: request.options?.retryAttempts || 3
    };

    return this.makeRequest<VonageMultiChannelResponse>('/multi-channel/send', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // === ANALYTICS & MONITORING ===

  // Get account balance
  async getAccountBalance(): Promise<VonageAccountBalance> {
    return this.makeRequest<VonageAccountBalance>('/account/balance', {
      method: 'GET'
    }, true, 'balance', 5 * 60 * 1000);
  }

  // Get message history
  async getMessageHistory(options: {
    date?: string;
    to?: string;
    from?: string;
    limit?: number;
  } = {}): Promise<VonageMessageHistory> {
    const params = new URLSearchParams();
    if (options.date) params.append('date', options.date);
    if (options.to) params.append('to', options.to);
    if (options.from) params.append('from', options.from);
    if (options.limit) params.append('limit', options.limit.toString());

    return this.makeRequest<VonageMessageHistory>(`/messages/history?${params.toString()}`, {
      method: 'GET'
    }, true, `history_${params.toString()}`, 10 * 60 * 1000);
  }

  // Get analytics
  async getAnalytics(period: string = 'last_30_days'): Promise<VonageAnalytics> {
    return this.makeRequest<VonageAnalytics>(`/analytics?period=${period}`, {
      method: 'GET'
    }, true, `analytics_${period}`, 15 * 60 * 1000);
  }

  // === ENHANCED FEATURES ===

  // Poll verification status
  async pollVerificationStatus(requestId: string, onProgress?: (status: any) => void): Promise<VonageVerifyCheckResponse> {
    const maxAttempts = 60; // 5 minutes with 5-second intervals
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        const status = await this.getVerificationStatus(requestId);
        
        if (onProgress) {
          onProgress(status);
        }

        if (status.status === 'completed' || status.status === 'failed') {
          return status;
        }

        await this.delay(5000);
        attempts++;
      } catch (error) {
        console.error('Polling error:', error);
        attempts++;
      }
    }

    throw new Error('Verification polling timeout');
  }

  // Get verification status
  async getVerificationStatus(requestId: string): Promise<any> {
    return this.makeRequest(`/verify/status/${requestId}`, {
      method: 'GET'
    });
  }

  // Enhanced phone number validation
  async validatePhoneNumber(phoneNumber: string): Promise<{
    valid: boolean;
    formatted: string;
    country: string;
    carrier: string;
    type: string;
    suggestions: string[];
  }> {
    const insights = await this.getPhoneInsights({ phoneNumber, level: 'basic' });
    
    return {
      valid: insights.valid || false,
      formatted: phoneNumber,
      country: insights.country || 'Unknown',
      carrier: insights.carrier || 'Unknown',
      type: insights.type || 'Unknown',
      suggestions: insights.valid ? [] : ['Check phone number format', 'Verify country code']
    };
  }

  // Enhanced mock responses
  private getMockResponse<T>(endpoint: string, options: RequestInit): T {
    const mockResponses: Record<string, any> = {
      '/health': {
        status: 'healthy',
        version: '2.0.0',
        features: ['verify', 'sim_swap', 'insights', 'sms', 'voice', 'video', 'whatsapp', 'multi_channel'],
        timestamp: new Date().toISOString()
      },
      '/verify/start': {
        success: true,
        requestId: `verify_${Date.now()}`,
        status: '0',
        estimatedCost: '0.05',
        remainingAttempts: 3
      },
      '/verify/check': {
        success: true,
        status: '0',
        requestId: `verify_${Date.now()}`,
        eventId: `event_${Date.now()}`,
        price: '0.05',
        currency: 'USD'
      },
      '/sim-swap': {
        success: true,
        requestId: `simswap_${Date.now()}`,
        status: '0',
        swapped: false,
        swappedAt: null
      },
      '/insights': {
        success: true,
        requestId: `insights_${Date.now()}`,
        status: '0',
        phoneNumber: '+1234567890',
        country: 'US',
        carrier: 'Verizon',
        type: 'mobile',
        valid: true,
        reachable: true,
        ported: false,
        roaming: false
      },
      '/sms/send': {
        success: true,
        messageId: `msg_${Date.now()}`,
        status: '0',
        to: '+1234567890',
        from: 'OnboardIQ',
        remainingBalance: '100.00',
        messagePrice: '0.01',
        network: 'US'
      },
      '/voice/call': {
        success: true,
        uuid: `call_${Date.now()}`,
        status: 'started',
        direction: 'outbound',
        rate: '0.01'
      },
      '/video/session': {
        success: true,
        sessionId: `session_${Date.now()}`,
        mediaMode: 'routed',
        archiveMode: 'manual',
        location: 'auto'
      },
      '/video/token': {
        success: true,
        token: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        sessionId: `session_${Date.now()}`,
        role: 'publisher',
        expireTime: Math.floor(Date.now() / 1000) + 86400
      },
      '/whatsapp/send': {
        success: true,
        messageUuid: `whatsapp_${Date.now()}`,
        to: '+1234567890',
        from: 'OnboardIQ',
        status: 'sent'
      },
      '/multi-channel/send': {
        success: true,
        recipient: { phone: '+1234567890', email: 'user@example.com' },
        channels: ['sms', 'whatsapp'],
        results: {
          sms: { success: true, messageId: `msg_${Date.now()}` },
          whatsapp: { success: true, messageUuid: `whatsapp_${Date.now()}` }
        },
        successful: 2,
        failed: 0
      },
      '/account/balance': {
        balance: '100.00',
        currency: 'USD',
        autoReload: false
      },
      '/analytics': {
        period: 'last_30_days',
        totalMessages: 1250,
        successfulMessages: 1200,
        failedMessages: 50,
        totalCalls: 300,
        successfulCalls: 285,
        failedCalls: 15,
        totalVerifications: 500,
        successfulVerifications: 485,
        failedVerifications: 15,
        averageResponseTime: '1.2s',
        costPerMessage: '0.01',
        costPerCall: '0.05',
        costPerVerification: '0.05'
      }
    };

    return mockResponses[endpoint] || { success: false, error: 'Mock endpoint not found' };
  }
}

// Export singleton instance
export const vonageApiService = new VonageApiService();
