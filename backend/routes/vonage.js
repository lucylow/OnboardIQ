const express = require('express');
const router = express.Router();

/**
 * Vonage Integration Routes
 * Provides access to all Vonage communication features
 */

// SMS Routes
router.post('/sms/send', async (req, res) => {
  try {
    const { to, from, text, options } = req.body;
    
    if (!to || !text) {
      return res.status(400).json({
        success: false,
        error: 'Phone number and message text are required'
      });
    }

    const vonageIntegration = req.integrations.vonage;
    const result = await vonageIntegration.sendSMS(to, from, text, options);
    
    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('SMS send error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/sms/bulk', async (req, res) => {
  try {
    const { recipients, from, text, options } = req.body;
    
    if (!recipients || !Array.isArray(recipients) || !text) {
      return res.status(400).json({
        success: false,
        error: 'Recipients array and message text are required'
      });
    }

    const vonageIntegration = req.integrations.vonage;
    const result = await vonageIntegration.sendBulkSMS(recipients, from, text, options);
    
    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Bulk SMS error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Voice Routes
router.post('/voice/call', async (req, res) => {
  try {
    const { to, from, text, options } = req.body;
    
    if (!to || !text) {
      return res.status(400).json({
        success: false,
        error: 'Phone number and message text are required'
      });
    }

    const vonageIntegration = req.integrations.vonage;
    const result = await vonageIntegration.makeCall(to, from, text, options);
    
    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Voice call error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/voice/tts', async (req, res) => {
  try {
    const { text, options } = req.body;
    
    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'Text is required for TTS'
      });
    }

    const vonageIntegration = req.integrations.vonage;
    const result = await vonageIntegration.createTTSMessage(text, options);
    
    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('TTS error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Video Routes
router.post('/video/session', async (req, res) => {
  try {
    const { options } = req.body;

    const vonageIntegration = req.integrations.vonage;
    const result = await vonageIntegration.createVideoSession(options);
    
    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Video session creation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/video/token', async (req, res) => {
  try {
    const { sessionId, options } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Session ID is required'
      });
    }

    const vonageIntegration = req.integrations.vonage;
    const result = await vonageIntegration.generateVideoToken(sessionId, options);
    
    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Video token generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/video/invite', async (req, res) => {
  try {
    const { sessionId, email, options } = req.body;
    
    if (!sessionId || !email) {
      return res.status(400).json({
        success: false,
        error: 'Session ID and email are required'
      });
    }

    const vonageIntegration = req.integrations.vonage;
    const result = await vonageIntegration.inviteToVideoSession(sessionId, email, options);
    
    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Video invitation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Verify Routes
router.post('/verify/start', async (req, res) => {
  try {
    const { phoneNumber, options } = req.body;
    
    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        error: 'Phone number is required'
      });
    }

    const vonageIntegration = req.integrations.vonage;
    const result = await vonageIntegration.startVerification(phoneNumber, options);
    
    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Verification start error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/verify/check', async (req, res) => {
  try {
    const { requestId, code } = req.body;
    
    if (!requestId || !code) {
      return res.status(400).json({
        success: false,
        error: 'Request ID and verification code are required'
      });
    }

    const vonageIntegration = req.integrations.vonage;
    const result = await vonageIntegration.checkVerification(requestId, code);
    
    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Verification check error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/verify/cancel', async (req, res) => {
  try {
    const { requestId } = req.body;
    
    if (!requestId) {
      return res.status(400).json({
        success: false,
        error: 'Request ID is required'
      });
    }

    const vonageIntegration = req.integrations.vonage;
    const result = await vonageIntegration.cancelVerification(requestId);
    
    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Verification cancellation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// WhatsApp Routes
router.post('/whatsapp/send', async (req, res) => {
  try {
    const { to, from, text, options } = req.body;
    
    if (!to || !text) {
      return res.status(400).json({
        success: false,
        error: 'Phone number and message text are required'
      });
    }

    const vonageIntegration = req.integrations.vonage;
    const result = await vonageIntegration.sendWhatsApp(to, from, text, options);
    
    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('WhatsApp send error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Multi-channel messaging
router.post('/multi-channel', async (req, res) => {
  try {
    const { recipient, channels, message, options } = req.body;
    
    if (!recipient || !channels || !message) {
      return res.status(400).json({
        success: false,
        error: 'Recipient, channels, and message are required'
      });
    }

    const vonageIntegration = req.integrations.vonage;
    const result = await vonageIntegration.sendMultiChannelMessage(recipient, channels, message, options);
    
    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Multi-channel messaging error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Analytics and monitoring
router.get('/balance', async (req, res) => {
  try {
    const vonageIntegration = req.integrations.vonage;
    const result = await vonageIntegration.getAccountBalance();
    
    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Balance check error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/history', async (req, res) => {
  try {
    const { options } = req.query;
    const parsedOptions = options ? JSON.parse(options) : {};

    const vonageIntegration = req.integrations.vonage;
    const result = await vonageIntegration.getMessageHistory(parsedOptions);
    
    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Message history error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check
router.get('/health', async (req, res) => {
  try {
    const vonageIntegration = req.integrations.vonage;
    const health = await vonageIntegration.healthCheck();
    
    res.json({
      success: true,
      health
    });
  } catch (error) {
    console.error('Vonage health check error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
