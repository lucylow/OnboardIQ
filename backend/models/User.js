const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  planTier: {
    type: String,
    enum: ['free', 'premium', 'enterprise'],
    default: 'free'
  },
  vonageRequestId: {
    type: String,
    required: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  videoSessionId: {
    type: String,
    required: false
  },
  documents: [{
    type: {
      type: String,
      enum: ['welcome_packet', 'contract', 'custom']
    },
    foxitDocumentId: String,
    downloadUrl: String,
    generatedAt: {
      type: Date,
      default: Date.now
    }
  }],
  onboardingStep: {
    type: String,
    enum: ['signup', 'verified', 'video_sent', 'documents_sent', 'complete'],
    default: 'signup'
  }
}, {
  timestamps: true
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ createdAt: 1 });
userSchema.index({ planTier: 1, onboardingStep: 1 });

module.exports = mongoose.model('User', userSchema);
