// Security AI Engine - Behavioral biometrics, adaptive authentication, and fraud detection
const { Vonage } = require('@vonage/server-sdk');
const axios = require('axios');
const crypto = require('crypto');

class SecurityAIEngine {
  constructor() {
    this.vonage = new Vonage({
      apiKey: process.env.VONAGE_API_KEY,
      apiSecret: process.env.VONAGE_API_SECRET,
    });
    
    this.riskThresholds = {
      locationMismatch: 0.7,
      deviceChange: 0.6,
      timeAnomaly: 0.5,
      behaviorChange: 0.8
    };
    
    this.securityEvents = new Map();
    this.userSessions = new Map();
  }

  // Analyze login risk using Vonage APIs
  async analyzeLoginRisk(userId, loginData) {
    try {
      const riskFactors = [];
      let totalRiskScore = 0;

      // 1. Location-based risk analysis
      const locationRisk = await this.analyzeLocationRisk(userId, loginData.location);
      if (locationRisk.score > this.riskThresholds.locationMismatch) {
        riskFactors.push({
          type: 'location_mismatch',
          score: locationRisk.score,
          details: locationRisk.details
        });
        totalRiskScore += locationRisk.score * 0.3;
      }

      // 2. Device fingerprint analysis
      const deviceRisk = await this.analyzeDeviceRisk(userId, loginData.deviceFingerprint);
      if (deviceRisk.score > this.riskThresholds.deviceChange) {
        riskFactors.push({
          type: 'device_change',
          score: deviceRisk.score,
          details: deviceRisk.details
        });
        totalRiskScore += deviceRisk.score * 0.25;
      }

      // 3. Time-based anomaly detection
      const timeRisk = this.analyzeTimeRisk(loginData.timestamp, loginData.userTimezone);
      if (timeRisk.score > this.riskThresholds.timeAnomaly) {
        riskFactors.push({
          type: 'time_anomaly',
          score: timeRisk.score,
          details: timeRisk.details
        });
        totalRiskScore += timeRisk.score * 0.2;
      }

      // 4. Behavioral pattern analysis
      const behaviorRisk = await this.analyzeBehaviorRisk(userId, loginData.behaviorPattern);
      if (behaviorRisk.score > this.riskThresholds.behaviorChange) {
        riskFactors.push({
          type: 'behavior_change',
          score: behaviorRisk.score,
          details: behaviorRisk.details
        });
        totalRiskScore += behaviorRisk.score * 0.25;
      }

      // 5. SIM Swap detection using Vonage Insights API
      const simSwapRisk = await this.detectSimSwap(userId, loginData.phoneNumber);
      if (simSwapRisk.detected) {
        riskFactors.push({
          type: 'sim_swap',
          score: 0.9,
          details: simSwapRisk.details
        });
        totalRiskScore += 0.9;
      }

      const riskLevel = this.calculateRiskLevel(totalRiskScore);
      const requiresStepUp = riskLevel === 'high' || riskLevel === 'critical';

      // Store security event
      this.securityEvents.set(`${userId}_${Date.now()}`, {
        userId,
        timestamp: new Date(),
        riskFactors,
        totalRiskScore,
        riskLevel,
        requiresStepUp,
        loginData
      });

      return {
        riskLevel,
        totalRiskScore,
        riskFactors,
        requiresStepUp,
        recommendations: this.generateSecurityRecommendations(riskFactors)
      };
    } catch (error) {
      console.error('Error analyzing login risk:', error);
      return {
        riskLevel: 'medium',
        totalRiskScore: 0.5,
        riskFactors: [],
        requiresStepUp: false,
        recommendations: ['Enable two-factor authentication for enhanced security']
      };
    }
  }

  // Trigger step-up authentication using Vonage Verify
  async triggerStepUpAuth(userId, phoneNumber, reason = 'suspicious_activity') {
    try {
      const requestId = await this.initiateVonageVerify(phoneNumber, reason);
      
      // Store session for verification
      this.userSessions.set(userId, {
        requestId,
        stepUpReason: reason,
        initiatedAt: new Date(),
        verified: false
      });

      return {
        success: true,
        requestId,
        message: 'Step-up verification initiated',
        expiresIn: 300 // 5 minutes
      };
    } catch (error) {
      console.error('Error triggering step-up auth:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Verify step-up authentication code
  async verifyStepUpCode(userId, code) {
    try {
      const session = this.userSessions.get(userId);
      if (!session) {
        throw new Error('No step-up session found');
      }

      const result = await this.checkVonageVerify(session.requestId, code);
      
      if (result.status === '0') {
        session.verified = true;
        session.verifiedAt = new Date();
        
        // Log successful verification
        this.logSecurityEvent(userId, 'step_up_verified', {
          requestId: session.requestId,
          reason: session.stepUpReason
        });

        return {
          success: true,
          message: 'Step-up verification successful'
        };
      } else {
        return {
          success: false,
          message: 'Invalid verification code'
        };
      }
    } catch (error) {
      console.error('Error verifying step-up code:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Monitor SIM swap using Vonage Insights API
  async detectSimSwap(userId, phoneNumber) {
    try {
      // Call Vonage Insights API for SIM swap detection
      const response = await axios.get(
        `https://api.nexmo.com/ni/advanced/json`,
        {
          params: {
            api_key: process.env.VONAGE_API_KEY,
            api_secret: process.env.VONAGE_API_SECRET,
            number: phoneNumber,
            real_time_data: 'true'
          }
        }
      );

      const insights = response.data;
      
      // Check for SIM swap indicators
      const simSwapIndicators = [
        insights.valid === false,
        insights.reachable === 'unknown',
        insights.ported === 'true',
        insights.roaming === 'true'
      ];

      const swapDetected = simSwapIndicators.filter(Boolean).length >= 2;

      if (swapDetected) {
        this.logSecurityEvent(userId, 'sim_swap_detected', {
          phoneNumber,
          insights
        });
      }

      return {
        detected: swapDetected,
        details: {
          valid: insights.valid,
          reachable: insights.reachable,
          ported: insights.ported,
          roaming: insights.roaming,
          carrier: insights.current_carrier?.name
        }
      };
    } catch (error) {
      console.error('Error detecting SIM swap:', error);
      return {
        detected: false,
        details: { error: error.message }
      };
    }
  }

  // Get security dashboard data for admins
  async getSecurityDashboard() {
    try {
      const recentEvents = Array.from(this.securityEvents.values())
        .filter(event => new Date() - event.timestamp < 24 * 60 * 60 * 1000) // Last 24 hours
        .sort((a, b) => b.timestamp - a.timestamp);

      const riskStats = {
        total: recentEvents.length,
        high: recentEvents.filter(e => e.riskLevel === 'high').length,
        critical: recentEvents.filter(e => e.riskLevel === 'critical').length,
        stepUpRequired: recentEvents.filter(e => e.requiresStepUp).length
      };

      const topRiskFactors = this.analyzeTopRiskFactors(recentEvents);
      const activeSessions = Array.from(this.userSessions.values())
        .filter(session => !session.verified && new Date() - session.initiatedAt < 300000);

      return {
        riskStats,
        topRiskFactors,
        activeSessions: activeSessions.length,
        recentEvents: recentEvents.slice(0, 10),
        recommendations: this.generateAdminRecommendations(riskStats)
      };
    } catch (error) {
      console.error('Error getting security dashboard:', error);
      return {
        riskStats: { total: 0, high: 0, critical: 0, stepUpRequired: 0 },
        topRiskFactors: [],
        activeSessions: 0,
        recentEvents: [],
        recommendations: []
      };
    }
  }

  // Private helper methods
  async analyzeLocationRisk(userId, currentLocation) {
    // Get user's usual locations from database/cache
    const usualLocations = await this.getUserUsualLocations(userId);
    
    if (!usualLocations.length) {
      return { score: 0.3, details: 'No location history available' };
    }

    // Calculate distance from usual locations
    const distances = usualLocations.map(loc => 
      this.calculateDistance(currentLocation, loc)
    );
    
    const minDistance = Math.min(...distances);
    const score = Math.min(minDistance / 100, 1); // Normalize to 0-1

    return {
      score,
      details: {
        currentLocation,
        closestUsualLocation: usualLocations[distances.indexOf(minDistance)],
        distance: minDistance
      }
    };
  }

  async analyzeDeviceRisk(userId, deviceFingerprint) {
    // Get user's usual devices from database/cache
    const usualDevices = await this.getUserUsualDevices(userId);
    
    if (!usualDevices.length) {
      return { score: 0.4, details: 'No device history available' };
    }

    // Compare device fingerprint
    const deviceMatch = usualDevices.some(device => 
      this.compareDeviceFingerprints(deviceFingerprint, device.fingerprint)
    );

    return {
      score: deviceMatch ? 0.1 : 0.8,
      details: {
        deviceFingerprint,
        matched: deviceMatch
      }
    };
  }

  analyzeTimeRisk(timestamp, userTimezone) {
    const loginTime = new Date(timestamp);
    const hour = loginTime.getHours();
    
    // Check if login is during unusual hours (2 AM - 6 AM)
    const isUnusualHour = hour >= 2 && hour <= 6;
    
    return {
      score: isUnusualHour ? 0.7 : 0.2,
      details: {
        hour,
        timezone: userTimezone,
        unusualHour: isUnusualHour
      }
    };
  }

  async analyzeBehaviorRisk(userId, behaviorPattern) {
    // Get user's usual behavior patterns
    const usualPatterns = await this.getUserBehaviorPatterns(userId);
    
    if (!usualPatterns) {
      return { score: 0.3, details: 'No behavior history available' };
    }

    // Compare current behavior with usual patterns
    const patternMatch = this.compareBehaviorPatterns(behaviorPattern, usualPatterns);
    
    return {
      score: patternMatch ? 0.2 : 0.8,
      details: {
        currentPattern: behaviorPattern,
        matched: patternMatch
      }
    };
  }

  calculateRiskLevel(score) {
    if (score >= 0.8) return 'critical';
    if (score >= 0.6) return 'high';
    if (score >= 0.4) return 'medium';
    return 'low';
  }

  generateSecurityRecommendations(riskFactors) {
    const recommendations = [];
    
    riskFactors.forEach(factor => {
      switch (factor.type) {
        case 'location_mismatch':
          recommendations.push('Enable location-based security alerts');
          break;
        case 'device_change':
          recommendations.push('Verify new device login via email');
          break;
        case 'time_anomaly':
          recommendations.push('Set up time-based access restrictions');
          break;
        case 'behavior_change':
          recommendations.push('Review recent account activity');
          break;
        case 'sim_swap':
          recommendations.push('Contact support immediately - potential SIM swap detected');
          break;
      }
    });

    return recommendations;
  }

  generateAdminRecommendations(riskStats) {
    const recommendations = [];
    
    if (riskStats.critical > 0) {
      recommendations.push('Review critical security events immediately');
    }
    
    if (riskStats.stepUpRequired > 10) {
      recommendations.push('Consider adjusting risk thresholds');
    }
    
    if (riskStats.total > 50) {
      recommendations.push('Implement additional security measures');
    }

    return recommendations;
  }

  analyzeTopRiskFactors(events) {
    const factorCounts = {};
    
    events.forEach(event => {
      event.riskFactors.forEach(factor => {
        factorCounts[factor.type] = (factorCounts[factor.type] || 0) + 1;
      });
    });

    return Object.entries(factorCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([type, count]) => ({ type, count }));
  }

  async initiateVonageVerify(phoneNumber, reason) {
    return new Promise((resolve, reject) => {
      this.vonage.verify.request(
        { 
          number: phoneNumber, 
          brand: 'OnboardIQ Security',
          code_length: 6,
          lg: 'en-us'
        },
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result.request_id);
          }
        }
      );
    });
  }

  async checkVonageVerify(requestId, code) {
    return new Promise((resolve, reject) => {
      this.vonage.verify.check(
        { request_id: requestId, code },
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  }

  logSecurityEvent(userId, eventType, details) {
    const eventId = crypto.randomUUID();
    this.securityEvents.set(eventId, {
      userId,
      eventType,
      timestamp: new Date(),
      details
    });
  }

  // Mock methods for demonstration (replace with actual database calls)
  async getUserUsualLocations(userId) {
    return [
      { lat: 40.7128, lng: -74.0060, city: 'New York' },
      { lat: 34.0522, lng: -118.2437, city: 'Los Angeles' }
    ];
  }

  async getUserUsualDevices(userId) {
    return [
      { fingerprint: 'device_hash_1', lastUsed: new Date() },
      { fingerprint: 'device_hash_2', lastUsed: new Date() }
    ];
  }

  async getUserBehaviorPatterns(userId) {
    return {
      loginFrequency: 'daily',
      preferredHours: [9, 17],
      sessionDuration: 120
    };
  }

  calculateDistance(loc1, loc2) {
    // Simple distance calculation (replace with proper geolocation library)
    const dx = loc1.lat - loc2.lat;
    const dy = loc1.lng - loc2.lng;
    return Math.sqrt(dx * dx + dy * dy) * 111; // Rough km conversion
  }

  compareDeviceFingerprints(fp1, fp2) {
    return fp1 === fp2;
  }

  compareBehaviorPatterns(current, usual) {
    // Simple pattern comparison
    return current.loginFrequency === usual.loginFrequency;
  }

  isReady() {
    return true; // SecurityAIEngine is always ready
  }
}

module.exports = SecurityAIEngine;
