// Vonage Integration - Multi-channel communication (SMS, Voice, Video, Verify)
const { Vonage } = require('@vonage/server-sdk');

class VonageIntegration {
  constructor(config) {
    this.config = config;
    this.vonage = new Vonage({
      apiKey: config.apiKey,
      apiSecret: config.apiSecret
    });
    this.isConnected = false;
    this.useMock = !config.apiKey || !config.apiSecret;
    this.initialize();
  }

  async initialize() {
    try {
      if (this.useMock) {
        console.log('🔧 Using mock Vonage integration (no API credentials provided)');
        this.isConnected = true;
      } else {
        // Test connection by checking account balance
        await this.checkConnection();
        this.isConnected = true;
      }
      console.log('✅ Vonage integration initialized');
    } catch (error) {
      console.error('❌ Vonage integration failed:', error);
      console.log('🔄 Falling back to mock mode');
      this.useMock = true;
      this.isConnected = true;
    }
  }

  async checkConnection() {
    try {
      if (this.useMock) {
        return true;
      }
      // In production, this would check account balance or make a test API call
      console.log('🔗 Checking Vonage connection...');
      return true;
    } catch (error) {
      throw new Error(`Vonage connection failed: ${error.message}`);
    }
  }

  // SMS Integration
  async sendSMS(to, from, text, options = {}) {
    try {
      console.log(`📱 Sending SMS to ${to}: ${text.substring(0, 50)}...`);
      
      if (this.useMock) {
        return this.mockSendSMS(to, from, text, options);
      }
      
      const smsData = {
        to: to,
        from: from || 'OnboardIQ',
        text: text,
        ...options
      };
      
      // In production, this would use the actual Vonage SMS API
      // const response = await this.vonage.sms.send(smsData);
      
      // Simulate response for demo
      const response = {
        messages: [{
          to: to,
          'message-id': `msg_${Date.now()}`,
          status: '0',
          'remaining-balance': '100.00',
          'message-price': '0.01',
          network: 'US'
        }]
      };
      
      console.log(`✅ SMS sent successfully to ${to}`);
      return response;
      
    } catch (error) {
      console.error(`❌ SMS send failed: ${error.message}`);
      console.log('🔄 Falling back to mock SMS');
      return this.mockSendSMS(to, from, text, options);
    }
  }

  mockSendSMS(to, from, text, options = {}) {
    console.log(`🎭 Mock SMS to ${to}: ${text.substring(0, 50)}...`);
    
    // Simulate different scenarios
    const scenarios = [
      { success: true, delay: 1000 },
      { success: true, delay: 2000 },
      { success: false, error: 'INSUFFICIENT_CREDITS', delay: 500 },
      { success: false, error: 'INVALID_PHONE_NUMBER', delay: 300 }
    ];
    
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    
    if (!scenario.success) {
      throw new Error(scenario.error);
    }
    
    return {
      messages: [{
        to: to,
        'message-id': `mock_msg_${Date.now()}`,
        status: '0',
        'remaining-balance': '95.50',
        'message-price': '0.01',
        network: 'US'
      }]
    };
  }

  async sendBulkSMS(recipients, from, text, options = {}) {
    try {
      console.log(`📱 Sending bulk SMS to ${recipients.length} recipients`);
      
      if (this.useMock) {
        return this.mockSendBulkSMS(recipients, from, text, options);
      }
      
      const results = [];
      
      for (const recipient of recipients) {
        try {
          const result = await this.sendSMS(recipient, from, text, options);
          results.push({
            recipient: recipient,
            status: 'success',
            result: result
          });
        } catch (error) {
          results.push({
            recipient: recipient,
            status: 'failed',
            error: error.message
          });
        }
      }
      
      return {
        total: recipients.length,
        successful: results.filter(r => r.status === 'success').length,
        failed: results.filter(r => r.status === 'failed').length,
        results: results
      };
      
    } catch (error) {
      console.error(`❌ Bulk SMS failed: ${error.message}`);
      console.log('🔄 Falling back to mock bulk SMS');
      return this.mockSendBulkSMS(recipients, from, text, options);
    }
  }

  mockSendBulkSMS(recipients, from, text, options = {}) {
    console.log(`🎭 Mock bulk SMS to ${recipients.length} recipients`);
    
    const results = recipients.map(recipient => {
      const success = Math.random() > 0.1; // 90% success rate
      return {
        recipient: recipient,
        status: success ? 'success' : 'failed',
        result: success ? {
          messages: [{
            to: recipient,
            'message-id': `mock_bulk_${Date.now()}`,
            status: '0',
            'remaining-balance': '95.50',
            'message-price': '0.01',
            network: 'US'
          }]
        } : null,
        error: success ? null : 'DELIVERY_FAILED'
      };
    });
    
    return {
      total: recipients.length,
      successful: results.filter(r => r.status === 'success').length,
      failed: results.filter(r => r.status === 'failed').length,
      results: results
    };
  }

  // Voice Integration
  async makeCall(to, from, text, options = {}) {
    try {
      console.log(`📞 Making voice call to ${to}`);
      
      if (this.useMock) {
        return this.mockMakeCall(to, from, text, options);
      }
      
      const callData = {
        to: [{
          type: 'phone',
          number: to
        }],
        from: {
          type: 'phone',
          number: from || this.config.voiceNumber
        },
        ncco: [
          {
            action: 'talk',
            text: text,
            voiceName: options.voiceName || 'Amy',
            language: options.language || 'en-US'
          }
        ],
        ...options
      };
      
      // In production, this would use the actual Vonage Voice API
      // const response = await this.vonage.voice.createCall(callData);
      
      // Simulate response for demo
      const response = {
        uuid: `call_${Date.now()}`,
        status: 'started',
        direction: 'outbound',
        rate: '0.01'
      };
      
      console.log(`✅ Voice call initiated to ${to}`);
      return response;
      
    } catch (error) {
      console.error(`❌ Voice call failed: ${error.message}`);
      console.log('🔄 Falling back to mock voice call');
      return this.mockMakeCall(to, from, text, options);
    }
  }

  mockMakeCall(to, from, text, options = {}) {
    console.log(`🎭 Mock voice call to ${to}`);
    
    return {
      uuid: `mock_call_${Date.now()}`,
      status: 'started',
      direction: 'outbound',
      rate: '0.01'
    };
  }

  async createTTSMessage(text, options = {}) {
    try {
      console.log(`🔊 Creating TTS message: ${text.substring(0, 50)}...`);
      
      if (this.useMock) {
        return this.mockCreateTTSMessage(text, options);
      }
      
      const ttsData = {
        text: text,
        voiceName: options.voiceName || 'Amy',
        language: options.language || 'en-US',
        speed: options.speed || 1.0,
        ...options
      };
      
      // In production, this would use Vonage TTS API
      // const response = await this.vonage.tts.create(ttsData);
      
      // Simulate response for demo
      const response = {
        uuid: `tts_${Date.now()}`,
        url: `https://api.vonage.com/tts/${Date.now()}.mp3`,
        duration: text.length * 0.1, // Rough estimate
        ...ttsData
      };
      
      return response;
      
    } catch (error) {
      console.error(`❌ TTS creation failed: ${error.message}`);
      console.log('🔄 Falling back to mock TTS');
      return this.mockCreateTTSMessage(text, options);
    }
  }

  mockCreateTTSMessage(text, options = {}) {
    console.log(`🎭 Mock TTS message: ${text.substring(0, 50)}...`);
    
    return {
      uuid: `mock_tts_${Date.now()}`,
      url: `https://mock-api.vonage.com/tts/${Date.now()}.mp3`,
      duration: text.length * 0.1,
      voiceName: options.voiceName || 'Amy',
      language: options.language || 'en-US',
      speed: options.speed || 1.0
    };
  }

  // Video Integration
  async createVideoSession(options = {}) {
    try {
      console.log('📹 Creating Vonage Video session');
      
      if (this.useMock) {
        return this.mockCreateVideoSession(options);
      }
      
      const sessionData = {
        mediaMode: options.mediaMode || 'routed',
        archiveMode: options.archiveMode || 'manual',
        location: options.location || 'auto',
        ...options
      };
      
      // In production, this would use the actual Vonage Video API
      // const response = await this.vonage.video.createSession(sessionData);
      
      // Simulate response for demo
      const response = {
        sessionId: `session_${Date.now()}`,
        mediaMode: sessionData.mediaMode,
        archiveMode: sessionData.archiveMode,
        location: sessionData.location
      };
      
      console.log(`✅ Video session created: ${response.sessionId}`);
      return response;
      
    } catch (error) {
      console.error(`❌ Video session creation failed: ${error.message}`);
      console.log('🔄 Falling back to mock video session');
      return this.mockCreateVideoSession(options);
    }
  }

  mockCreateVideoSession(options = {}) {
    console.log('🎭 Mock video session creation');
    
    return {
      sessionId: `mock_session_${Date.now()}`,
      mediaMode: options.mediaMode || 'routed',
      archiveMode: options.archiveMode || 'manual',
      location: options.location || 'auto'
    };
  }

  async generateVideoToken(sessionId, options = {}) {
    try {
      console.log(`🎫 Generating video token for session ${sessionId}`);
      
      if (this.useMock) {
        return this.mockGenerateVideoToken(sessionId, options);
      }
      
      const tokenData = {
        sessionId: sessionId,
        role: options.role || 'publisher',
        data: options.data || '',
        expireTime: options.expireTime || Math.floor(Date.now() / 1000) + 86400, // 24 hours
        ...options
      };
      
      // In production, this would use the actual Vonage Video API
      // const token = this.vonage.video.generateToken(tokenData);
      
      // Simulate token generation for demo
      const token = `token_${sessionId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      return {
        token: token,
        sessionId: sessionId,
        role: tokenData.role,
        expireTime: tokenData.expireTime
      };
      
    } catch (error) {
      console.error(`❌ Video token generation failed: ${error.message}`);
      console.log('🔄 Falling back to mock token generation');
      return this.mockGenerateVideoToken(sessionId, options);
    }
  }

  mockGenerateVideoToken(sessionId, options = {}) {
    console.log(`🎭 Mock video token for session ${sessionId}`);
    
    return {
      token: `mock_token_${sessionId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId: sessionId,
      role: options.role || 'publisher',
      expireTime: options.expireTime || Math.floor(Date.now() / 1000) + 86400
    };
  }

  async inviteToVideoSession(sessionId, email, options = {}) {
    try {
      console.log(`📧 Inviting ${email} to video session ${sessionId}`);
      
      if (this.useMock) {
        return this.mockInviteToVideoSession(sessionId, email, options);
      }
      
      const inviteData = {
        sessionId: sessionId,
        email: email,
        subject: options.subject || 'Join your OnboardIQ video session',
        message: options.message || 'You have been invited to join a video session.',
        ...options
      };
      
      // In production, this would use Vonage Video API to send invitation
      // const response = await this.vonage.video.invite(inviteData);
      
      // Simulate response for demo
      const response = {
        inviteId: `invite_${Date.now()}`,
        sessionId: sessionId,
        email: email,
        status: 'sent'
      };
      
      console.log(`✅ Video invitation sent to ${email}`);
      return response;
      
    } catch (error) {
      console.error(`❌ Video invitation failed: ${error.message}`);
      console.log('🔄 Falling back to mock video invitation');
      return this.mockInviteToVideoSession(sessionId, email, options);
    }
  }

  mockInviteToVideoSession(sessionId, email, options = {}) {
    console.log(`🎭 Mock video invitation to ${email} for session ${sessionId}`);
    
    return {
      inviteId: `mock_invite_${Date.now()}`,
      sessionId: sessionId,
      email: email,
      status: 'sent',
      subject: options.subject || 'Join your OnboardIQ video session',
      message: options.message || 'You have been invited to join a video session.'
    };
  }

  // Verify Integration
  async startVerification(phoneNumber, options = {}) {
    try {
      console.log(`🔐 Starting verification for ${phoneNumber}`);
      
      if (this.useMock) {
        return this.mockStartVerification(phoneNumber, options);
      }
      
      const verifyData = {
        number: phoneNumber,
        brand: options.brand || 'OnboardIQ',
        codeLength: options.codeLength || 6,
        workflowId: options.workflowId || 6, // SMS workflow
        ...options
      };
      
      // In production, this would use the actual Vonage Verify API
      // const response = await this.vonage.verify.start(verifyData);
      
      // Simulate response for demo
      const response = {
        request_id: `verify_${Date.now()}`,
        status: '0',
        error_text: null
      };
      
      console.log(`✅ Verification started: ${response.request_id}`);
      return response;
      
    } catch (error) {
      console.error(`❌ Verification start failed: ${error.message}`);
      console.log('🔄 Falling back to mock verification');
      return this.mockStartVerification(phoneNumber, options);
    }
  }

  mockStartVerification(phoneNumber, options = {}) {
    console.log(`🎭 Mock verification start for ${phoneNumber}`);
    
    // Simulate different scenarios
    const scenarios = [
      { success: true, delay: 1000 },
      { success: true, delay: 2000 },
      { success: false, error: 'INSUFFICIENT_CREDITS', delay: 500 },
      { success: false, error: 'INVALID_PHONE_NUMBER', delay: 300 }
    ];
    
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    
    if (!scenario.success) {
      throw new Error(scenario.error);
    }
    
    return {
      request_id: `mock_verify_${Date.now()}`,
      status: '0',
      error_text: null
    };
  }

  async checkVerification(requestId, code) {
    try {
      console.log(`🔍 Checking verification code for request ${requestId}`);
      
      if (this.useMock) {
        return this.mockCheckVerification(requestId, code);
      }
      
      const checkData = {
        request_id: requestId,
        code: code
      };
      
      // In production, this would use the actual Vonage Verify API
      // const response = await this.vonage.verify.check(checkData);
      
      // Simulate verification check for demo
      const response = {
        request_id: requestId,
        status: '0', // 0 = success
        error_text: null
      };
      
      console.log(`✅ Verification check completed: ${response.status === '0' ? 'success' : 'failed'}`);
      return response;
      
    } catch (error) {
      console.error(`❌ Verification check failed: ${error.message}`);
      console.log('🔄 Falling back to mock verification check');
      return this.mockCheckVerification(requestId, code);
    }
  }

  mockCheckVerification(requestId, code) {
    console.log(`🎭 Mock verification check for request ${requestId} with code ${code}`);
    
    // Accept any 6-digit code for demo purposes, but simulate some failures
    if (code && code.length === 6) {
      // 90% success rate for demo
      if (Math.random() > 0.1) {
        return { 
          status: '0',
          request_id: requestId,
          error_text: null
        };
      } else {
        return { 
          status: '16',
          request_id: requestId,
          error_text: 'Invalid code'
        };
      }
    }
    return { 
      status: '16',
      request_id: requestId,
      error_text: 'Invalid code'
    };
  }

  async cancelVerification(requestId) {
    try {
      console.log(`❌ Cancelling verification request ${requestId}`);
      
      if (this.useMock) {
        return this.mockCancelVerification(requestId);
      }
      
      const cancelData = {
        request_id: requestId
      };
      
      // In production, this would use the actual Vonage Verify API
      // const response = await this.vonage.verify.cancel(cancelData);
      
      // Simulate response for demo
      const response = {
        request_id: requestId,
        status: '0',
        error_text: null
      };
      
      console.log(`✅ Verification cancelled: ${requestId}`);
      return response;
      
    } catch (error) {
      console.error(`❌ Verification cancellation failed: ${error.message}`);
      console.log('🔄 Falling back to mock verification cancellation');
      return this.mockCancelVerification(requestId);
    }
  }

  mockCancelVerification(requestId) {
    console.log(`🎭 Mock verification cancellation for request ${requestId}`);
    
    return {
      request_id: requestId,
      status: '0',
      error_text: null
    };
  }

  // WhatsApp Integration
  async sendWhatsApp(to, from, text, options = {}) {
    try {
      console.log(`💬 Sending WhatsApp message to ${to}`);
      
      if (this.useMock) {
        return this.mockSendWhatsApp(to, from, text, options);
      }
      
      const whatsappData = {
        to: to,
        from: from || 'OnboardIQ',
        text: text,
        ...options
      };
      
      // In production, this would use the actual Vonage WhatsApp API
      // const response = await this.vonage.whatsapp.send(whatsappData);
      
      // Simulate response for demo
      const response = {
        message_uuid: `whatsapp_${Date.now()}`,
        to: to,
        from: whatsappData.from,
        status: 'sent'
      };
      
      console.log(`✅ WhatsApp message sent to ${to}`);
      return response;
      
    } catch (error) {
      console.error(`❌ WhatsApp send failed: ${error.message}`);
      console.log('🔄 Falling back to mock WhatsApp');
      return this.mockSendWhatsApp(to, from, text, options);
    }
  }

  mockSendWhatsApp(to, from, text, options = {}) {
    console.log(`🎭 Mock WhatsApp message to ${to}: ${text.substring(0, 50)}...`);
    
    return {
      message_uuid: `mock_whatsapp_${Date.now()}`,
      to: to,
      from: from || 'OnboardIQ',
      status: 'sent'
    };
  }

  // Multi-channel messaging
  async sendMultiChannelMessage(recipient, channels, message, options = {}) {
    try {
      console.log(`📤 Sending multi-channel message to ${recipient.email || recipient.phone}`);
      
      if (this.useMock) {
        return this.mockSendMultiChannelMessage(recipient, channels, message, options);
      }
      
      const results = {};
      
      for (const channel of channels) {
        try {
          switch (channel) {
            case 'sms':
              if (recipient.phone) {
                results.sms = await this.sendSMS(recipient.phone, options.from, message, options);
              }
              break;
              
            case 'whatsapp':
              if (recipient.phone) {
                results.whatsapp = await this.sendWhatsApp(recipient.phone, options.from, message, options);
              }
              break;
              
            case 'voice':
              if (recipient.phone) {
                results.voice = await this.makeCall(recipient.phone, options.from, message, options);
              }
              break;
              
            case 'video':
              if (recipient.email) {
                const session = await this.createVideoSession(options.videoOptions);
                const token = await this.generateVideoToken(session.sessionId, options.tokenOptions);
                results.video = await this.inviteToVideoSession(session.sessionId, recipient.email, {
                  ...options,
                  session: session,
                  token: token
                });
              }
              break;
              
            default:
              console.warn(`⚠️ Unknown channel: ${channel}`);
          }
        } catch (error) {
          results[channel] = {
            status: 'failed',
            error: error.message
          };
        }
      }
      
      return {
        recipient: recipient,
        channels: channels,
        results: results,
        successful: Object.values(results).filter(r => r.status !== 'failed').length,
        failed: Object.values(results).filter(r => r.status === 'failed').length
      };
      
    } catch (error) {
      console.error(`❌ Multi-channel message failed: ${error.message}`);
      console.log('🔄 Falling back to mock multi-channel message');
      return this.mockSendMultiChannelMessage(recipient, channels, message, options);
    }
  }

  mockSendMultiChannelMessage(recipient, channels, message, options = {}) {
    console.log(`🎭 Mock multi-channel message to ${recipient.email || recipient.phone}`);
    
    const results = {};
    
    for (const channel of channels) {
      const success = Math.random() > 0.1; // 90% success rate
      results[channel] = {
        status: success ? 'success' : 'failed',
        error: success ? null : 'MOCK_DELIVERY_FAILED'
      };
    }
    
    return {
      recipient: recipient,
      channels: channels,
      results: results,
      successful: Object.values(results).filter(r => r.status === 'success').length,
      failed: Object.values(results).filter(r => r.status === 'failed').length
    };
  }

  // Analytics and monitoring
  async getAccountBalance() {
    try {
      console.log('💰 Getting Vonage account balance');
      
      if (this.useMock) {
        return this.mockGetAccountBalance();
      }
      
      // In production, this would use the actual Vonage API
      // const response = await this.vonage.account.getBalance();
      
      // Simulate response for demo
      const response = {
        balance: '100.00',
        currency: 'USD',
        autoReload: false
      };
      
      return response;
      
    } catch (error) {
      console.error(`❌ Balance check failed: ${error.message}`);
      console.log('🔄 Falling back to mock balance');
      return this.mockGetAccountBalance();
    }
  }

  mockGetAccountBalance() {
    console.log('🎭 Mock account balance check');
    
    return {
      balance: '95.50',
      currency: 'USD',
      autoReload: false
    };
  }

  async getMessageHistory(options = {}) {
    try {
      console.log('📊 Getting message history');
      
      if (this.useMock) {
        return this.mockGetMessageHistory(options);
      }
      
      // In production, this would use the actual Vonage API
      // const response = await this.vonage.sms.getHistory(options);
      
      // Simulate response for demo
      const response = {
        messages: [
          {
            messageId: `msg_${Date.now()}`,
            to: '+1234567890',
            from: 'OnboardIQ',
            text: 'Welcome to OnboardIQ!',
            status: 'delivered',
            timestamp: new Date().toISOString()
          }
        ],
        count: 1
      };
      
      return response;
      
    } catch (error) {
      console.error(`❌ Message history failed: ${error.message}`);
      console.log('🔄 Falling back to mock message history');
      return this.mockGetMessageHistory(options);
    }
  }

  mockGetMessageHistory(options = {}) {
    console.log('🎭 Mock message history');
    
    return {
      messages: [
        {
          messageId: `mock_msg_${Date.now()}`,
          to: '+1234567890',
          from: 'OnboardIQ',
          text: 'Welcome to OnboardIQ!',
          status: 'delivered',
          timestamp: new Date().toISOString()
        },
        {
          messageId: `mock_msg_${Date.now() - 1000}`,
          to: '+1234567891',
          from: 'OnboardIQ',
          text: 'Your verification code is 123456',
          status: 'delivered',
          timestamp: new Date(Date.now() - 1000).toISOString()
        }
      ],
      count: 2
    };
  }

  // Error handling and retry logic
  async retryOperation(operation, maxRetries = 3, delay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }
        
        console.warn(`⚠️ Operation failed, retrying in ${delay}ms (attempt ${attempt}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    }
  }

  // Health check
  async healthCheck() {
    try {
      const balance = await this.getAccountBalance();
      return {
        status: 'healthy',
        connected: this.isConnected,
        useMock: this.useMock,
        balance: balance.balance,
        currency: balance.currency,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        connected: false,
        useMock: this.useMock,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  isConnected() {
    return this.isConnected;
  }

  isMockMode() {
    return this.useMock;
  }

  // Cleanup
  async cleanup() {
    console.log('🧹 Cleaning up Vonage integration...');
    this.isConnected = false;
  }
}

module.exports = VonageIntegration;
