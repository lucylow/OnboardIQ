const Vonage = require('@vonage/server-sdk');
const { mockVonageService } = require('../mockApi');

// Use mock service if no API credentials are provided
const useMock = !process.env.VONAGE_API_KEY || !process.env.VONAGE_API_SECRET;

const vonage = useMock ? null : new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET
});

class VonageService {
  // Send verification code via SMS
  static async sendVerificationCode(phoneNumber) {
    if (useMock) {
      return mockVonageService.sendVerificationCode(phoneNumber);
    }
    
    return new Promise((resolve, reject) => {
      vonage.verify.request({
        number: phoneNumber,
        brand: process.env.VONAGE_BRAND_NAME || 'OnboardIQ'
      }, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  // Verify the code entered by user
  static async verifyCode(requestId, code) {
    if (useMock) {
      return mockVonageService.verifyCode(requestId, code);
    }
    
    return new Promise((resolve, reject) => {
      vonage.verify.check({
        request_id: requestId,
        code: code
      }, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  // Send SMS message
  static async sendSMS(to, text) {
    if (useMock) {
      return mockVonageService.sendSMS(to, text);
    }
    
    return new Promise((resolve, reject) => {
      vonage.sms.send({
        from: process.env.VONAGE_BRAND_NAME || 'OnboardIQ',
        to: to,
        text: text
      }, (err, responseData) => {
        if (err) {
          reject(err);
        } else {
          resolve(responseData);
        }
      });
    });
  }

  // Create a Vonage Video API session
  static async createVideoSession() {
    if (useMock) {
      return mockVonageService.createVideoSession();
    }
    
    // Note: This is a simplified version
    // In a real implementation, you would use the Vonage Video API
    const sessionId = this.generateSessionId();
    return {
      sessionId: sessionId,
      apiKey: process.env.VONAGE_API_KEY,
      token: this.generateToken(sessionId)
    };
  }

  static generateSessionId() {
    return 'sid_' + Math.random().toString(36).substr(2, 9);
  }

  static generateToken(sessionId) {
    // In a real implementation, you would generate a proper token
    return 'tok_' + Math.random().toString(36).substr(2, 16);
  }
}

module.exports = VonageService;
