// SMS Verification Service - Real Implementation
import { vonageApi } from './vonageApi';

export interface SMSVerificationSession {
  id: string;
  userId: string;
  phoneNumber: string;
  requestId: string;
  status: 'pending' | 'sent' | 'delivered' | 'verified' | 'expired' | 'failed';
  createdAt: Date;
  expiresAt: Date;
  verifiedAt?: Date;
  attempts: number;
  maxAttempts: number;
  code: string;
  countryCode: string;
  carrier?: string;
  cost?: number;
  template: string;
  message: string;
}

export interface SMSTemplate {
  id: string;
  name: string;
  content: string;
  variables: string[];
  language: string;
  category: string;
}

export interface SMSAnalytics {
  totalSent: number;
  delivered: number;
  verified: number;
  failed: number;
  deliveryRate: number;
  verificationRate: number;
  averageResponseTime: number;
  costPerVerification: number;
  totalCost: number;
  byCountry: Record<string, { sent: number; verified: number; rate: number }>;
}

class SMSVerificationService {
  private sessions: Map<string, SMSVerificationSession> = new Map();
  private analytics: SMSAnalytics = {
    totalSent: 0,
    delivered: 0,
    verified: 0,
    failed: 0,
    deliveryRate: 0,
    verificationRate: 0,
    averageResponseTime: 0,
    costPerVerification: 0.05,
    totalCost: 0,
    byCountry: {}
  };

  private templates: SMSTemplate[] = [
    {
      id: 'verification_template',
      name: 'Verification Code',
      content: 'Your OnboardIQ verification code is: {code}. Valid for 10 minutes.',
      variables: ['code'],
      language: 'en',
      category: 'verification'
    },
    {
      id: 'welcome_template',
      name: 'Welcome Message',
      content: 'Welcome to OnboardIQ! Your verification code: {code}. Start your journey now!',
      variables: ['code'],
      language: 'en',
      category: 'welcome'
    },
    {
      id: 'reminder_template',
      name: 'Reminder',
      content: 'Complete your OnboardIQ setup with code: {code}. Expires soon!',
      variables: ['code'],
      language: 'en',
      category: 'reminder'
    }
  ];

  // Generate a 6-digit verification code
  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Create expiration time (10 minutes from now)
  private createExpirationTime(): Date {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);
    return expiresAt;
  }

  // Send SMS verification code
  async sendVerificationCode(userId: string, phoneNumber: string, templateId: string = 'verification_template'): Promise<SMSVerificationSession> {
    try {
      // Generate verification code
      const code = this.generateVerificationCode();
      const requestId = `sms_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create session
      const session: SMSVerificationSession = {
        id: requestId,
        userId,
        phoneNumber,
        requestId,
        status: 'pending',
        createdAt: new Date(),
        expiresAt: this.createExpirationTime(),
        attempts: 0,
        maxAttempts: 3,
        code,
        countryCode: this.extractCountryCode(phoneNumber),
        template: templateId,
        message: this.formatMessage(templateId, { code })
      };

      // Send SMS via Vonage API
      const smsResponse = await vonageApi.sendSMS({
        to: phoneNumber,
        text: session.message
      });
      
      if (smsResponse && smsResponse.message) {
        session.status = 'sent';
        session.carrier = 'vonage';
        session.cost = 0.01; // Default cost
        
        // Update analytics
        this.analytics.totalSent++;
        this.updateAnalytics();
        
        // Store session
        this.sessions.set(session.id, session);
        
        return session;
      } else {
        session.status = 'failed';
        this.sessions.set(session.id, session);
        throw new Error('Failed to send SMS');
      }
    } catch (error) {
      console.error('SMS Verification Error:', error);
      throw error;
    }
  }

  // Verify SMS code
  async verifyCode(requestId: string, code: string): Promise<{ success: boolean; message: string; session?: SMSVerificationSession }> {
    try {
      const session = this.sessions.get(requestId);
      
      if (!session) {
        return { success: false, message: 'Invalid request ID' };
      }

      // Check if session is expired
      if (new Date() > session.expiresAt) {
        session.status = 'expired';
        return { success: false, message: 'Verification code has expired' };
      }

      // Check if max attempts exceeded
      if (session.attempts >= session.maxAttempts) {
        session.status = 'failed';
        return { success: false, message: 'Maximum verification attempts exceeded' };
      }

      // Increment attempts
      session.attempts++;

      // Verify code
      if (session.code === code) {
        session.status = 'verified';
        session.verifiedAt = new Date();
        
        // Update analytics
        this.analytics.verified++;
        this.updateAnalytics();
        
        return { 
          success: true, 
          message: 'Verification successful',
          session 
        };
      } else {
        return { 
          success: false, 
          message: `Invalid code. ${session.maxAttempts - session.attempts} attempts remaining.`
        };
      }
    } catch (error) {
      console.error('SMS Verification Error:', error);
      return { success: false, message: 'Verification failed' };
    }
  }

  // Resend verification code
  async resendVerificationCode(requestId: string): Promise<SMSVerificationSession> {
    const session = this.sessions.get(requestId);
    
    if (!session) {
      throw new Error('Session not found');
    }

    if (session.status === 'verified') {
      throw new Error('Code already verified');
    }

    // Generate new code
    const newCode = this.generateVerificationCode();
    session.code = newCode;
    session.expiresAt = this.createExpirationTime();
    session.attempts = 0;
    session.status = 'pending';
    session.message = this.formatMessage(session.template, { code: newCode });

    // Send new SMS
    const smsResponse = await vonageApi.sendSMS({
      to: session.phoneNumber,
      text: session.message
    });
    
    if (smsResponse && smsResponse.message) {
      session.status = 'sent';
      this.analytics.totalSent++;
      this.updateAnalytics();
    } else {
      session.status = 'failed';
      throw new Error('Failed to resend SMS');
    }

    return session;
  }

  // Get session by ID
  getSession(requestId: string): SMSVerificationSession | undefined {
    return this.sessions.get(requestId);
  }

  // Get sessions by user ID
  getSessionsByUserId(userId: string): SMSVerificationSession[] {
    return Array.from(this.sessions.values()).filter(session => session.userId === userId);
  }

  // Get templates by category
  getTemplatesByCategory(category: string): SMSTemplate[] {
    return this.templates.filter(template => template.category === category);
  }

  // Get all templates
  getAllTemplates(): SMSTemplate[] {
    return this.templates;
  }

  // Get analytics
  getAnalytics(): SMSAnalytics {
    return { ...this.analytics };
  }

  // Update analytics
  private updateAnalytics(): void {
    if (this.analytics.totalSent > 0) {
      this.analytics.deliveryRate = this.analytics.delivered / this.analytics.totalSent;
      this.analytics.verificationRate = this.analytics.verified / this.analytics.totalSent;
    }
    this.analytics.totalCost = this.analytics.totalSent * this.analytics.costPerVerification;
  }

  // Extract country code from phone number
  private extractCountryCode(phoneNumber: string): string {
    if (phoneNumber.startsWith('+1')) return '+1';
    if (phoneNumber.startsWith('+44')) return '+44';
    if (phoneNumber.startsWith('+33')) return '+33';
    if (phoneNumber.startsWith('+49')) return '+49';
    if (phoneNumber.startsWith('+81')) return '+81';
    if (phoneNumber.startsWith('+91')) return '+91';
    return '+1'; // Default to US
  }

  // Format message with variables
  private formatMessage(templateId: string, variables: Record<string, string>): string {
    const template = this.templates.find(t => t.id === templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    let message = template.content;
    template.variables.forEach(variable => {
      const value = variables[variable];
      if (value) {
        message = message.replace(`{${variable}}`, value);
      }
    });

    return message;
  }

  // Clean up expired sessions (run periodically)
  cleanupExpiredSessions(): void {
    const now = new Date();
    for (const [requestId, session] of this.sessions.entries()) {
      if (session.status === 'pending' && now > session.expiresAt) {
        session.status = 'expired';
      }
    }
  }

  // Get session statistics
  getSessionStats(): { total: number; pending: number; verified: number; expired: number; failed: number } {
    const sessions = Array.from(this.sessions.values());
    return {
      total: sessions.length,
      pending: sessions.filter(s => s.status === 'pending').length,
      verified: sessions.filter(s => s.status === 'verified').length,
      expired: sessions.filter(s => s.status === 'expired').length,
      failed: sessions.filter(s => s.status === 'failed').length
    };
  }
}

// Export singleton instance
export const smsVerificationService = new SMSVerificationService();
export default smsVerificationService;
