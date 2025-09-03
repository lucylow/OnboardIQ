// Authentication Routes - User signup, verification, and login with AI security
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// In-memory user store for demo (replace with database in production)
const users = new Map();
const verificationRequests = new Map();

// User signup with AI profiling
router.post('/signup', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phoneNumber, companyName, planTier, companySize, industry, role } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !phoneNumber) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['email', 'password', 'firstName', 'lastName', 'phoneNumber']
      });
    }

    // Check if user already exists
    if (users.has(email)) {
      return res.status(409).json({
        error: 'User already exists',
        message: 'An account with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user profile with AI profiling
    const userData = {
      email,
      firstName,
      lastName,
      phoneNumber,
      companyName: companyName || '',
      planTier: planTier || 'free',
      companySize: companySize || '1-10',
      industry: industry || '',
      role: role || '',
      signupTime: Date.now(),
      signupChannel: req.body.signupChannel || 'direct'
    };

    // AI-powered user profiling
    const userSegment = req.ai.userProfiling.classifyUser(userData);
    const personalizedWorkflow = req.ai.userProfiling.createPersonalizedWorkflow(userData);

    // Create user object
    const user = {
      id: `user_${Date.now()}`,
      ...userData,
      password: hashedPassword,
      segment: userSegment,
      workflow: personalizedWorkflow,
      verified: false,
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    // Store user
    users.set(email, user);

    // AI security assessment
    const securityAssessment = await req.ai.security.assessAuthenticationRisk(user.id, {
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      deviceFingerprint: req.body.deviceFingerprint,
      timestamp: Date.now()
    });

    // Determine verification requirements based on AI assessment
    const verificationRequired = securityAssessment.authenticationRequired.includes('vonage_verify');

    if (verificationRequired) {
      // Initiate Vonage verification
      const verifyResponse = await req.integrations.vonage.startVerification(phoneNumber, {
        brand: 'OnboardIQ',
        codeLength: 6
      });

      // Store verification request
      verificationRequests.set(verifyResponse.request_id, {
        userId: user.id,
        email: email,
        phoneNumber: phoneNumber,
        timestamp: Date.now(),
        expiresAt: Date.now() + (10 * 60 * 1000) // 10 minutes
      });

      return res.status(200).json({
        message: 'User created successfully. Verification required.',
        userId: user.id,
        verificationRequired: true,
        verifyRequestId: verifyResponse.request_id,
        securityAssessment: securityAssessment,
        userSegment: userSegment,
        estimatedOnboardingTime: personalizedWorkflow.estimatedDuration
      });
    } else {
      // No verification required
      user.verified = true;
      users.set(email, user);

      return res.status(201).json({
        message: 'User created successfully',
        userId: user.id,
        verificationRequired: false,
        securityAssessment: securityAssessment,
        userSegment: userSegment,
        estimatedOnboardingTime: personalizedWorkflow.estimatedDuration
      });
    }

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Verify phone number
router.post('/verify', async (req, res) => {
  try {
    const { verifyRequestId, code } = req.body;

    if (!verifyRequestId || !code) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['verifyRequestId', 'code']
      });
    }

    // Check if verification request exists and is not expired
    const verificationRequest = verificationRequests.get(verifyRequestId);
    if (!verificationRequest) {
      return res.status(404).json({
        error: 'Verification request not found'
      });
    }

    if (Date.now() > verificationRequest.expiresAt) {
      verificationRequests.delete(verifyRequestId);
      return res.status(410).json({
        error: 'Verification request expired'
      });
    }

    // Verify code with Vonage
    const verifyResponse = await req.integrations.vonage.checkVerification(verifyRequestId, code);

    if (verifyResponse.status === '0') {
      // Verification successful
      const user = users.get(verificationRequest.email);
      if (user) {
        user.verified = true;
        users.set(verificationRequest.email, user);

        // Clean up verification request
        verificationRequests.delete(verifyRequestId);

        // Generate JWT token
        const token = jwt.sign(
          { userId: user.id, email: user.email },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '24h' }
        );

        return res.status(200).json({
          message: 'Verification successful',
          token: token,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            verified: true,
            segment: user.segment
          }
        });
      } else {
        return res.status(404).json({
          error: 'User not found'
        });
      }
    } else {
      return res.status(400).json({
        error: 'Invalid verification code',
        message: 'The verification code you entered is incorrect'
      });
    }

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// User login with AI security
router.post('/login', async (req, res) => {
  try {
    const { email, password, deviceFingerprint } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['email', 'password']
      });
    }

    // Find user
    const user = users.get(email);
    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // AI security assessment for login
    const securityAssessment = await req.ai.security.assessAuthenticationRisk(user.id, {
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      deviceFingerprint: deviceFingerprint,
      timestamp: Date.now(),
      loginAttempt: true
    });

    // Update user's last login
    user.lastLogin = Date.now();
    users.set(email, user);

    // Check if step-up authentication is required
    if (securityAssessment.authenticationRequired.includes('vonage_verify')) {
      // Initiate step-up verification
      const verifyResponse = await req.integrations.vonage.startVerification(user.phoneNumber, {
        brand: 'OnboardIQ Security',
        codeLength: 6
      });

      // Store verification request
      verificationRequests.set(verifyResponse.request_id, {
        userId: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        timestamp: Date.now(),
        expiresAt: Date.now() + (10 * 60 * 1000), // 10 minutes
        type: 'step_up'
      });

      return res.status(200).json({
        message: 'Additional verification required',
        stepUpRequired: true,
        verifyRequestId: verifyResponse.request_id,
        securityAssessment: securityAssessment
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // AI churn prediction for returning users
    const engagementData = {
      lastActivityTime: user.lastLogin,
      totalLoginCount: (user.loginCount || 0) + 1,
      // Add more engagement data as available
    };

    const churnRisk = await req.ai.churnPredictor.predictChurnRisk(user, engagementData);

    return res.status(200).json({
      message: 'Login successful',
      token: token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        verified: user.verified,
        segment: user.segment,
        companyName: user.companyName,
        planTier: user.planTier
      },
      securityAssessment: securityAssessment,
      churnRisk: churnRisk
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Step-up verification for login
router.post('/step-up-verify', async (req, res) => {
  try {
    const { verifyRequestId, code } = req.body;

    if (!verifyRequestId || !code) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['verifyRequestId', 'code']
      });
    }

    // Check if verification request exists and is not expired
    const verificationRequest = verificationRequests.get(verifyRequestId);
    if (!verificationRequest || verificationRequest.type !== 'step_up') {
      return res.status(404).json({
        error: 'Step-up verification request not found'
      });
    }

    if (Date.now() > verificationRequest.expiresAt) {
      verificationRequests.delete(verifyRequestId);
      return res.status(410).json({
        error: 'Verification request expired'
      });
    }

    // Verify code with Vonage
    const verifyResponse = await req.integrations.vonage.checkVerification(verifyRequestId, code);

    if (verifyResponse.status === '0') {
      // Step-up verification successful
      const user = users.get(verificationRequest.email);
      if (user) {
        // Generate JWT token
        const token = jwt.sign(
          { userId: user.id, email: user.email },
          process.env.JWT_SECRET || 'your-secret-key',
          { expiresIn: '24h' }
        );

        // Clean up verification request
        verificationRequests.delete(verifyRequestId);

        return res.status(200).json({
          message: 'Step-up verification successful',
          token: token,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            verified: user.verified,
            segment: user.segment
          }
        });
      } else {
        return res.status(404).json({
          error: 'User not found'
        });
      }
    } else {
      return res.status(400).json({
        error: 'Invalid verification code',
        message: 'The verification code you entered is incorrect'
      });
    }

  } catch (error) {
    console.error('Step-up verification error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Resend verification code
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: 'Email is required'
      });
    }

    const user = users.get(email);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    if (user.verified) {
      return res.status(400).json({
        error: 'User is already verified'
      });
    }

    // Find existing verification request
    let existingRequest = null;
    for (const [requestId, request] of verificationRequests.entries()) {
      if (request.email === email) {
        existingRequest = { requestId, request };
        break;
      }
    }

    if (existingRequest) {
      // Cancel existing request
      await req.integrations.vonage.cancelVerification(existingRequest.requestId);
      verificationRequests.delete(existingRequest.requestId);
    }

    // Start new verification
    const verifyResponse = await req.integrations.vonage.startVerification(user.phoneNumber, {
      brand: 'OnboardIQ',
      codeLength: 6
    });

    // Store new verification request
    verificationRequests.set(verifyResponse.request_id, {
      userId: user.id,
      email: user.email,
      phoneNumber: user.phoneNumber,
      timestamp: Date.now(),
      expiresAt: Date.now() + (10 * 60 * 1000) // 10 minutes
    });

    return res.status(200).json({
      message: 'Verification code resent successfully',
      verifyRequestId: verifyResponse.request_id
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = users.get(req.user.email);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Get AI insights
    const userProfile = await req.ai.userProfiling.updateUserProfile(user.id, user);
    const churnRisk = await req.ai.churnPredictor.predictChurnRisk(user, {});

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        companyName: user.companyName,
        planTier: user.planTier,
        verified: user.verified,
        segment: user.segment,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      },
      aiInsights: {
        profile: userProfile,
        churnRisk: churnRisk,
        personalizedWorkflow: user.workflow
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const user = users.get(req.user.email);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Update allowed fields
    const allowedFields = ['firstName', 'lastName', 'companyName', 'industry', 'role'];
    const updates = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
        user[field] = req.body[field];
      }
    });

    // Update user in store
    users.set(req.user.email, user);

    // Re-run AI profiling with updated data
    const updatedProfile = await req.ai.userProfiling.updateUserProfile(user.id, user);

    return res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        companyName: user.companyName,
        planTier: user.planTier,
        verified: user.verified,
        segment: user.segment
      },
      aiInsights: {
        updatedProfile: updatedProfile
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Access token required',
      message: 'Please provide a valid authentication token'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({
        error: 'Invalid token',
        message: 'The provided authentication token is invalid or expired'
      });
    }

    req.user = user;
    next();
  });
}

// Cleanup expired verification requests
setInterval(() => {
  const now = Date.now();
  for (const [requestId, request] of verificationRequests.entries()) {
    if (now > request.expiresAt) {
      verificationRequests.delete(requestId);
    }
  }
}, 60000); // Run every minute

module.exports = router;
