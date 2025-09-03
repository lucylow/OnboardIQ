const express = require('express');
const router = express.Router();
const { AnalyticsService } = require('../services/analyticsService');

// @route   GET /api/analytics/funnel
// @desc    Get onboarding funnel analytics
// @access  Public
router.get('/funnel', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const funnelData = await AnalyticsService.getOnboardingFunnel(start, end);
    res.status(200).json({
      success: true,
      data: funnelData,
      period: { start, end }
    });
  } catch (error) {
    console.error('Funnel analytics error:', error);
    res.status(500).json({ error: 'Failed to retrieve funnel analytics' });
  }
});

// @route   GET /api/analytics/channels
// @desc    Get channel performance metrics
// @access  Public
router.get('/channels', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const channelData = await AnalyticsService.getChannelPerformance(start, end);
    res.status(200).json({
      success: true,
      data: channelData,
      period: { start, end }
    });
  } catch (error) {
    console.error('Channel analytics error:', error);
    res.status(500).json({ error: 'Failed to retrieve channel analytics' });
  }
});

// @route   GET /api/analytics/realtime
// @desc    Get real-time metrics
// @access  Public
router.get('/realtime', async (req, res) => {
  try {
    const metrics = await AnalyticsService.getRealTimeMetrics();
    res.status(200).json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Real-time analytics error:', error);
    res.status(500).json({ error: 'Failed to retrieve real-time metrics' });
  }
});

// @route   GET /api/analytics/user/:userId
// @desc    Get user journey timeline
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const journey = await AnalyticsService.getUserJourney(userId);
    res.status(200).json({
      success: true,
      data: journey
    });
  } catch (error) {
    console.error('User journey error:', error);
    res.status(500).json({ error: 'Failed to retrieve user journey' });
  }
});

// @route   GET /api/analytics/at-risk
// @desc    Get at-risk users for proactive intervention
// @access  Public
router.get('/at-risk', async (req, res) => {
  try {
    const atRiskUsers = await AnalyticsService.identifyAtRiskUsers();
    res.status(200).json({
      success: true,
      data: atRiskUsers
    });
  } catch (error) {
    console.error('At-risk users error:', error);
    res.status(500).json({ error: 'Failed to identify at-risk users' });
  }
});

// @route   GET /api/analytics/insights
// @desc    Get automated insights and recommendations
// @access  Public
router.get('/insights', async (req, res) => {
  try {
    const insights = await AnalyticsService.generateInsights();
    res.status(200).json({
      success: true,
      data: insights
    });
  } catch (error) {
    console.error('Insights error:', error);
    res.status(500).json({ error: 'Failed to generate insights' });
  }
});

module.exports = router;
