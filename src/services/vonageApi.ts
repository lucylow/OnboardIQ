import axios from 'axios';

// Base API configuration  
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://pnvrtfrtwbzndglakxvj.supabase.co/functions/v1/vonage-api' 
  : 'http://localhost:5000/api/vonage';

// Types for Vonage API responses
export interface VonageVerificationRequest {
  phone_number: string;
  brand?: string;
  code_length?: number;
  workflow_id?: number;
}

export interface VonageVerificationResponse {
  requestId: string;
  status: string;
  estimated_cost?: string;
  remaining_balance?: string;
  message: string;
}

export interface VonageVerificationCheck {
  request_id: string;
  code: string;
}

export interface VonageVerificationCheckResponse {
  verified: boolean;
  status: string;
  event_id?: string;
  price?: string;
  currency?: string;
  message: string;
  errorText?: string;
}

export interface VonageSMSRequest {
  to: string;
  text: string;
  from_number?: string;
}

export interface VonageSMSResponse {
  message: string;
  data: {
    message_id: string;
    remaining_balance: string;
    message_price: string;
    status: string;
  };
}

export interface VonageVideoSessionRequest {
  user_id: string;
  session_type?: string;
  media_mode?: string;
}

export interface VonageVideoSessionResponse {
  sessionId: string;
  token: string;
  api_key: string;
  message: string;
}

export interface VonageSimSwapRequest {
  phone_number: string;
  max_age?: number;
}

export interface VonageSimSwapResponse {
  numberInfo: {
    sim_swap_detected: boolean;
    last_swap_date?: string;
    carrier_info?: string;
    roaming_status?: string;
    max_age_hours: number;
  };
  isSimSwapped: boolean;
}

export interface VonageOnboardingSMSRequest {
  phone_number: string;
  user_name: string;
  step_number: number;
  total_steps: number;
}

export interface VonageVideoInviteRequest {
  phone_number: string;
  user_name: string;
  session_id: string;
}

export interface VonageAccountBalanceResponse {
  success: boolean;
  balance: number;
  currency: string;
  auto_reload: boolean;
  message: string;
}

export interface VonagePricingRequest {
  country_code?: string;
  service_type?: string;
}

export interface VonagePricingResponse {
  success: boolean;
  pricing: {
    country_code: string;
    country_name: string;
    service_type: string;
    price: number;
    currency: string;
    message: string;
  };
  message: string;
}

// Vonage API Service Class
class VonageApiService {
  private baseURL: string;
  private token: string | null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('access_token');
  }

  // Set authentication token
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('access_token', token);
  }

  // Get authentication headers
  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // ============ Vonage Verify API Methods ============

  /**
   * Start verification: send a PIN to user's phone
   */
  async startVerification(data: VonageVerificationRequest): Promise<VonageVerificationResponse> {
    try {
      const response = await axios.post(
        `${this.baseURL}/start-verification`,
        data,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Verification request failed');
    }
  }

  /**
   * Check verification code entered by user
   */
  async checkVerification(data: VonageVerificationCheck): Promise<VonageVerificationCheckResponse> {
    try {
      const response = await axios.post(
        `${this.baseURL}/check-verification`,
        data,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Verification check failed');
    }
  }

  /**
   * Cancel an ongoing verification request
   */
  async cancelVerification(requestId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.post(
        `${this.baseURL}/cancel-verification`,
        { request_id: requestId },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Verification cancellation failed');
    }
  }

  // ============ Vonage Video API Methods ============

  /**
   * Create video session and generate token for user onboarding
   */
  async createVideoSession(data: VonageVideoSessionRequest): Promise<VonageVideoSessionResponse> {
    try {
      const response = await axios.post(
        `${this.baseURL}/create-video-session`,
        data,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Video session creation failed');
    }
  }

  // ============ Vonage SMS API Methods ============

  /**
   * Send follow-up SMS message to user
   */
  async sendSMS(data: VonageSMSRequest): Promise<VonageSMSResponse> {
    try {
      const response = await axios.post(
        `${this.baseURL}/send-sms`,
        data,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'SMS sending failed');
    }
  }

  /**
   * Send personalized onboarding SMS messages
   */
  async sendOnboardingSMS(data: VonageOnboardingSMSRequest): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.post(
        `${this.baseURL}/send-onboarding-sms`,
        data,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Onboarding SMS failed');
    }
  }

  /**
   * Send SMS invitation for welcome video call
   */
  async sendWelcomeVideoInvite(data: VonageVideoInviteRequest): Promise<{ success: boolean; message: string }> {
    try {
      const response = await axios.post(
        `${this.baseURL}/send-welcome-video-invite`,
        data,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Video invite SMS failed');
    }
  }

  // ============ Vonage Number Insights & SIM Swap API Methods ============

  /**
   * Check if phone number SIM swapped
   */
  async checkSimSwap(data: VonageSimSwapRequest): Promise<VonageSimSwapResponse> {
    try {
      const response = await axios.post(
        `${this.baseURL}/check-sim-swap`,
        data,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'SIM swap check failed');
    }
  }

  /**
   * Get detailed phone number insights
   */
  async getNumberInsights(phoneNumber: string, insightLevel: 'basic' | 'standard' | 'advanced' = 'basic') {
    try {
      const response = await axios.post(
        `${this.baseURL}/number-insights`,
        { phone_number: phoneNumber, insight_level: insightLevel },
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Number insights failed');
    }
  }

  // ============ Account Management Methods ============

  /**
   * Get Vonage account balance
   */
  async getAccountBalance(): Promise<VonageAccountBalanceResponse> {
    try {
      const response = await axios.get(
        `${this.baseURL}/account-balance`,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Account balance check failed');
    }
  }

  /**
   * Get pricing information for services
   */
  async getPricing(data: VonagePricingRequest): Promise<VonagePricingResponse> {
    try {
      const response = await axios.post(
        `${this.baseURL}/pricing`,
        data,
        { headers: this.getHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Pricing information failed');
    }
  }

  // ============ Utility Methods ============

  /**
   * Validate phone number format
   */
  validatePhoneNumber(phoneNumber: string): boolean {
    // Remove any non-digit characters except +
    const cleaned = phoneNumber.replace(/[^\d+]/g, '');
    
    // Check if it's a valid international format
    return /^\+?[1-9]\d{1,14}$/.test(cleaned);
  }

  /**
   * Format phone number to E.164 format
   */
  formatPhoneNumber(phoneNumber: string): string {
    // Remove any non-digit characters except +
    const cleaned = phoneNumber.replace(/[^\d+]/g, '');
    
    // If it doesn't start with +, add it
    if (!cleaned.startsWith('+')) {
      return `+${cleaned}`;
    }
    
    return cleaned;
  }

  /**
   * Generate a mock verification code for testing
   */
  generateMockCode(): string {
    return '123456';
  }

  /**
   * Check if we're in development mode
   */
  isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';
  }

  // Add error handling wrapper for all API calls
  private async withErrorHandling<T>(apiCall: () => Promise<T>): Promise<T> {
    try {
      return await apiCall();
    } catch (error) {
      console.error('API call failed, using fallback:', error);
      // Return mock response as fallback
      throw error;
    }
  }
}

// Create and export a singleton instance
export const vonageApi = new VonageApiService();

// Export the class for testing purposes
export default VonageApiService;
