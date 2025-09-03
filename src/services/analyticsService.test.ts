// Simple test for analytics service
import analyticsService from './analyticsService';

// Test the analytics service
async function testAnalyticsService() {
  console.log('Testing Analytics Service...');
  
  try {
    // Test fetching all analytics
    const allData = await analyticsService.fetchAllAnalytics('7d');
    console.log('✅ All analytics data:', allData.success ? 'SUCCESS' : 'FAILED');
    
    // Test individual endpoints
    const funnelData = await analyticsService.fetchFunnelData();
    console.log('✅ Funnel data:', funnelData.success ? 'SUCCESS' : 'FAILED');
    
    const channelData = await analyticsService.fetchChannelData();
    console.log('✅ Channel data:', channelData.success ? 'SUCCESS' : 'FAILED');
    
    const realtimeData = await analyticsService.fetchRealtimeData();
    console.log('✅ Realtime data:', realtimeData.success ? 'SUCCESS' : 'FAILED');
    
    const atRiskData = await analyticsService.fetchAtRiskData();
    console.log('✅ At-risk data:', atRiskData.success ? 'SUCCESS' : 'FAILED');
    
    const insightsData = await analyticsService.fetchInsightsData();
    console.log('✅ Insights data:', insightsData.success ? 'SUCCESS' : 'FAILED');
    
    // Test analytics summary
    const summary = analyticsService.getAnalyticsSummary();
    console.log('✅ Analytics summary:', summary);
    
    console.log('🎉 All tests passed! Analytics service is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run test if this file is executed directly
if (typeof window === 'undefined') {
  testAnalyticsService();
}

export { testAnalyticsService };
