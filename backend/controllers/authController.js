const User = require('../models/User');
const VonageService = require('../services/vonageService');
const FoxitService = require('../services/foxitService');
const EmailService = require('../services/emailService');
const { AnalyticsService } = require('../services/analyticsService');

const authController = {
  // Initiate signup process with phone verification
  async initiateSignup(req, res) {
    try {
      const { email, phoneNumber, companyName, planTier } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists with this email' });
      }

      // Send verification code via Vonage
      const startTime = Date.now();
      const vonageResult = await VonageService.sendVerificationCode(phoneNumber);
      const processingTime = Date.now() - startTime;

      // Create user in database
      const newUser = new User({
        email,
        phoneNumber,
        companyName,
        planTier: planTier || 'free',
        vonageRequestId: vonageResult.request_id
      });

      await newUser.save();

      // Track analytics events
      await AnalyticsService.trackEvent({
        userId: newUser._id.toString(),
        eventType: 'signup_initiated',
        channel: 'sms',
        metadata: { phoneNumber, planTier: planTier || 'free' }
      });

      await AnalyticsService.trackAPIInteraction(
        newUser._id.toString(),
        'vonage_verify',
        true,
        processingTime,
        { requestId: vonageResult.request_id }
      );

      res.status(200).json({
        message: 'Verification code sent',
        requestId: vonageResult.request_id,
        userId: newUser._id
      });
    } catch (error) {
      console.error('Signup initiation error:', error);
      res.status(500).json({ error: 'Failed to initiate signup process' });
    }
  },

  // Verify code and complete signup
  async verifyCode(req, res) {
    try {
      const { requestId, code, userId } = req.body;

      // Verify code with Vonage
      const startTime = Date.now();
      const verificationResult = await VonageService.verifyCode(requestId, code);
      const processingTime = Date.now() - startTime;

      if (verificationResult.status !== '0') {
        // Track failed verification
        await AnalyticsService.trackEvent({
          userId: userId,
          eventType: 'verification_failed',
          channel: 'sms',
          metadata: { requestId, code },
          success: false,
          errorMessage: 'Invalid verification code'
        });

        return res.status(400).json({ error: 'Invalid verification code' });
      }

      // Update user as verified
      const user = await User.findByIdAndUpdate(
        userId,
        { 
          isVerified: true,
          onboardingStep: 'verified'
        },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Track successful verification
      await AnalyticsService.trackEvent({
        userId: user._id.toString(),
        eventType: 'verification_completed',
        channel: 'sms',
        metadata: { requestId }
      });

      await AnalyticsService.trackAPIInteraction(
        user._id.toString(),
        'vonage_verify_check',
        true,
        processingTime,
        { requestId }
      );

      // Trigger personalized onboarding based on plan tier
      if (user.planTier === 'premium' || user.planTier === 'enterprise') {
        // This would be handled by a background job in production
        setTimeout(() => {
          this.triggerPremiumOnboarding(user);
        }, 1000);
      }

      res.status(200).json({
        message: 'Phone number verified successfully',
        user: {
          id: user._id,
          email: user.email,
          companyName: user.companyName,
          planTier: user.planTier
        }
      });
    } catch (error) {
      console.error('Verification error:', error);
      res.status(500).json({ error: 'Failed to verify code' });
    }
  },

  // Trigger premium onboarding workflow
  async triggerPremiumOnboarding(user) {
    try {
      console.log(`Starting premium onboarding for user: ${user.email}`);
      
      // 1. Create video session
      const videoSession = await VonageService.createVideoSession();
      await User.findByIdAndUpdate(user._id, {
        videoSessionId: videoSession.sessionId,
        onboardingStep: 'video_sent'
      });

      // In a real implementation, you would send this to the frontend
      // or trigger an email with the video session link
      console.log('Video session created:', videoSession.sessionId);

      // 2. Generate welcome documents
      const userData = {
        customer_name: user.name || user.email.split('@')[0],
        company_name: user.companyName,
        signup_date: new Date().toLocaleDateString(),
        plan_name: user.planTier
      };

      const welcomePackage = await FoxitService.createWelcomePackage(userData);
      
      // 3. Send welcome email with documents
      await EmailService.sendWelcomeEmail(user, welcomePackage.download_url);
      
      // 4. Update user record
      await User.findByIdAndUpdate(user._id, {
        $push: {
          documents: {
            type: 'welcome_packet',
            foxitDocumentId: welcomePackage.document_id,
            downloadUrl: welcomePackage.download_url
          }
        },
        onboardingStep: 'documents_sent'
      });

      console.log(`Premium onboarding completed for user: ${user.email}`);

      // 5. Schedule follow-up SMS for the next day
      setTimeout(async () => {
        try {
          await VonageService.sendSMS(
            user.phoneNumber,
            `Hi ${userData.customer_name}! How's your team setup going with ${user.companyName}? Reply HELP if you need assistance.`
          );
          console.log('Follow-up SMS scheduled for tomorrow');
        } catch (smsError) {
          console.error('Failed to send follow-up SMS:', smsError);
        }
      }, 24 * 60 * 60 * 1000); // 24 hours later

    } catch (error) {
      console.error('Premium onboarding failed:', error);
      // In production, you would implement retry logic or alert monitoring
    }
  }
};

module.exports = authController;
