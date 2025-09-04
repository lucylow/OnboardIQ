const User = require('../models/User');

const videoController = {
  // Create a video session for user onboarding
  async createSession(req, res) {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ 
          success: false,
          error: 'User ID is required' 
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ 
          success: false,
          error: 'User not found' 
        });
      }

      if (!user.isVerified) {
        return res.status(400).json({ 
          success: false,
          error: 'User must be verified first' 
        });
      }

      // Use the VonageIntegration from req.integrations
      const vonageIntegration = req.integrations.vonage;
      
      if (!vonageIntegration || !vonageIntegration.isConnected()) {
        return res.status(503).json({ 
          success: false,
          error: 'Vonage service unavailable' 
        });
      }

      const videoSession = await vonageIntegration.createVideoSession({
        mediaMode: 'routed',
        archiveMode: 'manual'
      });

      // Save session ID to user
      await User.findByIdAndUpdate(userId, {
        videoSessionId: videoSession.sessionId,
        videoSessionCreatedAt: new Date()
      });

      res.status(200).json({
        success: true,
        message: 'Video session created successfully',
        session: videoSession
      });
    } catch (error) {
      console.error('Video session creation error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to create video session',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Get video session info for a user
  async getSession(req, res) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ 
          success: false,
          error: 'User ID is required' 
        });
      }

      const user = await User.findById(userId).select('videoSessionId videoSessionCreatedAt');
      if (!user || !user.videoSessionId) {
        return res.status(404).json({ 
          success: false,
          error: 'Video session not found' 
        });
      }

      // Use the VonageIntegration from req.integrations
      const vonageIntegration = req.integrations.vonage;
      
      if (!vonageIntegration || !vonageIntegration.isConnected()) {
        return res.status(503).json({ 
          success: false,
          error: 'Vonage service unavailable' 
        });
      }

      // Generate a new token for the session
      const token = await vonageIntegration.generateVideoToken(user.videoSessionId, {
        role: 'publisher',
        expireTime: Math.floor(Date.now() / 1000) + 86400 // 24 hours
      });

      res.status(200).json({
        success: true,
        sessionId: user.videoSessionId,
        token: token.token,
        apiKey: process.env.VONAGE_API_KEY,
        createdAt: user.videoSessionCreatedAt,
        expiresAt: new Date(token.expireTime * 1000)
      });
    } catch (error) {
      console.error('Get session error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to retrieve video session',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // Invite user to video session
  async inviteToSession(req, res) {
    try {
      const { userId, email } = req.body;

      if (!userId || !email) {
        return res.status(400).json({ 
          success: false,
          error: 'User ID and email are required' 
        });
      }

      const user = await User.findById(userId).select('videoSessionId');
      if (!user || !user.videoSessionId) {
        return res.status(404).json({ 
          success: false,
          error: 'Video session not found' 
        });
      }

      const vonageIntegration = req.integrations.vonage;
      
      if (!vonageIntegration || !vonageIntegration.isConnected()) {
        return res.status(503).json({ 
          success: false,
          error: 'Vonage service unavailable' 
        });
      }

      const invitation = await vonageIntegration.inviteToVideoSession(
        user.videoSessionId, 
        email,
        {
          subject: 'Join your OnboardIQ video session',
          message: 'You have been invited to join your onboarding video session.'
        }
      );

      res.status(200).json({
        success: true,
        message: 'Video invitation sent successfully',
        invitation: invitation
      });
    } catch (error) {
      console.error('Video invitation error:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to send video invitation',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

module.exports = videoController;
