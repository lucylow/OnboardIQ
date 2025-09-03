const User = require('../models/User');
const VonageService = require('../services/vonageService');

const videoController = {
  // Create a video session for user onboarding
  async createSession(req, res) {
    try {
      const { userId } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (!user.isVerified) {
        return res.status(400).json({ error: 'User must be verified first' });
      }

      const videoSession = await VonageService.createVideoSession();

      // Save session ID to user
      await User.findByIdAndUpdate(userId, {
        videoSessionId: videoSession.sessionId
      });

      res.status(200).json({
        message: 'Video session created successfully',
        session: videoSession
      });
    } catch (error) {
      console.error('Video session creation error:', error);
      res.status(500).json({ error: 'Failed to create video session' });
    }
  },

  // Get video session info for a user
  async getSession(req, res) {
    try {
      const { userId } = req.params;

      const user = await User.findById(userId).select('videoSessionId');
      if (!user || !user.videoSessionId) {
        return res.status(404).json({ error: 'Video session not found' });
      }

      // In a real implementation, you would generate a new token
      const token = VonageService.generateToken(user.videoSessionId);

      res.status(200).json({
        sessionId: user.videoSessionId,
        token: token,
        apiKey: process.env.VONAGE_API_KEY
      });
    } catch (error) {
      console.error('Get session error:', error);
      res.status(500).json({ error: 'Failed to retrieve video session' });
    }
  }
};

module.exports = videoController;
