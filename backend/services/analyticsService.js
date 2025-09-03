const mongoose = require('mongoose');

// Analytics Event Schema for tracking user interactions
const analyticsEventSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  eventType: {
    type: String,
    required: true,
    enum: [
      'signup_initiated',
      'verification_sent',
      'verification_completed',
      'verification_failed',
      'video_session_created',
      'video_session_joined',
      'video_session_completed',
      'document_generation_started',
      'document_generation_completed',
      'document_downloaded',
      'sms_sent',
      'sms_delivered',
      'onboarding_step_completed',
      'onboarding_abandoned'
    ]
  },
  channel: {
    type: String,
    required: true,
    enum: ['sms', 'video', 'email', 'document', 'web']
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  sessionId: String,
  requestId: String,
  processingTime: Number, // in milliseconds
  success: {
    type: Boolean,
    default: true
  },
  errorMessage: String
}, {
  timestamps: true
});

// Indexes for efficient querying
analyticsEventSchema.index({ userId: 1, timestamp: -1 });
analyticsEventSchema.index({ eventType: 1, timestamp: -1 });
analyticsEventSchema.index({ channel: 1, timestamp: -1 });

const AnalyticsEvent = mongoose.model('AnalyticsEvent', analyticsEventSchema);

class AnalyticsService {
  // Track user interaction events
  static async trackEvent(eventData) {
    try {
      const event = new AnalyticsEvent(eventData);
      await event.save();
      
      // Log for real-time monitoring
      console.log(`Analytics Event: ${eventData.eventType} for user ${eventData.userId}`);
      
      return event;
    } catch (error) {
      console.error('Analytics tracking error:', error);
      // Don't throw error to avoid breaking main flow
    }
  }

  // Track onboarding funnel progression
  static async trackOnboardingStep(userId, step, metadata = {}) {
    return this.trackEvent({
      userId,
      eventType: 'onboarding_step_completed',
      channel: 'web',
      metadata: {
        step,
        ...metadata
      }
    });
  }

  // Track API interactions
  static async trackAPIInteraction(userId, apiName, success, processingTime, metadata = {}) {
    return this.trackEvent({
      userId,
      eventType: success ? `${apiName}_completed` : `${apiName}_failed`,
      channel: 'api',
      processingTime,
      success,
      metadata
    });
  }

  // Get onboarding funnel analytics
  static async getOnboardingFunnel(startDate, endDate) {
    const pipeline = [
      {
        $match: {
          timestamp: {
            $gte: startDate,
            $lte: endDate
          },
          eventType: {
            $in: [
              'signup_initiated',
              'verification_completed',
              'video_session_created',
              'document_generation_completed'
            ]
          }
        }
      },
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 },
          uniqueUsers: { $addToSet: '$userId' }
        }
      },
      {
        $project: {
          eventType: '$_id',
          count: 1,
          uniqueUsers: { $size: '$uniqueUsers' }
        }
      }
    ];

    return AnalyticsEvent.aggregate(pipeline);
  }

  // Get channel performance metrics
  static async getChannelPerformance(startDate, endDate) {
    const pipeline = [
      {
        $match: {
          timestamp: {
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      {
        $group: {
          _id: '$channel',
          totalEvents: { $sum: 1 },
          successfulEvents: {
            $sum: { $cond: ['$success', 1, 0] }
          },
          avgProcessingTime: { $avg: '$processingTime' }
        }
      },
      {
        $project: {
          channel: '$_id',
          totalEvents: 1,
          successRate: {
            $multiply: [
              { $divide: ['$successfulEvents', '$totalEvents'] },
              100
            ]
          },
          avgProcessingTime: 1
        }
      }
    ];

    return AnalyticsEvent.aggregate(pipeline);
  }

  // Get user journey timeline
  static async getUserJourney(userId) {
    return AnalyticsEvent.find({ userId })
      .sort({ timestamp: 1 })
      .select('eventType channel timestamp metadata success')
      .lean();
  }

  // Get real-time metrics
  static async getRealTimeMetrics() {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [hourlyStats, dailyStats] = await Promise.all([
      AnalyticsEvent.aggregate([
        {
          $match: {
            timestamp: { $gte: oneHourAgo }
          }
        },
        {
          $group: {
            _id: null,
            totalEvents: { $sum: 1 },
            uniqueUsers: { $addToSet: '$userId' }
          }
        },
        {
          $project: {
            totalEvents: 1,
            uniqueUsers: { $size: '$uniqueUsers' }
          }
        }
      ]),
      AnalyticsEvent.aggregate([
        {
          $match: {
            timestamp: { $gte: oneDayAgo }
          }
        },
        {
          $group: {
            _id: null,
            totalEvents: { $sum: 1 },
            uniqueUsers: { $addToSet: '$userId' }
          }
        },
        {
          $project: {
            totalEvents: 1,
            uniqueUsers: { $size: '$uniqueUsers' }
          }
        }
      ])
    ]);

    return {
      lastHour: hourlyStats[0] || { totalEvents: 0, uniqueUsers: 0 },
      lastDay: dailyStats[0] || { totalEvents: 0, uniqueUsers: 0 }
    };
  }

  // Predictive analytics: Identify at-risk users
  static async identifyAtRiskUsers() {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    // Find users who started but haven't completed verification
    const atRiskUsers = await AnalyticsEvent.aggregate([
      {
        $match: {
          timestamp: { $gte: oneDayAgo },
          eventType: 'signup_initiated'
        }
      },
      {
        $lookup: {
          from: 'analyticsevents',
          let: { userId: '$userId' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$userId', '$$userId'] },
                eventType: 'verification_completed'
              }
            }
          ],
          as: 'verificationEvents'
        }
      },
      {
        $match: {
          verificationEvents: { $size: 0 }
        }
      },
      {
        $group: {
          _id: '$userId',
          signupTime: { $first: '$timestamp' }
        }
      },
      {
        $sort: { signupTime: 1 }
      }
    ]);

    return atRiskUsers;
  }

  // Generate insights for dashboard
  static async generateInsights() {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const insights = await AnalyticsEvent.aggregate([
      {
        $match: {
          timestamp: { $gte: oneWeekAgo }
        }
      },
      {
        $group: {
          _id: {
            eventType: '$eventType',
            success: '$success'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.eventType',
          total: { $sum: '$count' },
          successCount: {
            $sum: {
              $cond: ['$_id.success', '$count', 0]
            }
          }
        }
      },
      {
        $project: {
          eventType: '$_id',
          total: 1,
          successRate: {
            $multiply: [
              { $divide: ['$successCount', '$total'] },
              100
            ]
          }
        }
      }
    ]);

    return insights;
  }
}

module.exports = { AnalyticsService, AnalyticsEvent };
