import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navigation from "./components/Navigation";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";
import OnboardingPage from "./components/OnboardingPage";
import AdminDashboard from "./components/AdminDashboard";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import LandingPage from "./components/LandingPage";
import ModernLandingPage from "./components/ModernLandingPage";
import TestPage from "./components/TestPage";
import EnhancedDashboard from "./components/EnhancedDashboard";
import FunctionalDashboard from "./components/FunctionalDashboard";
import DemoPage from "./components/DemoPage";
import AuthTest from "./components/AuthTest";
import RealTimeAnalytics from "./components/RealTimeAnalytics";
import AIChatbot from "./components/AIChatbot";
import SecurityMonitoring from "./components/SecurityMonitoring";
import AdaptiveOnboarding from "./components/AdaptiveOnboarding";
import ContinuousRiskMonitoring from "./components/ContinuousRiskMonitoring";
import MuleSoftMCPDashboard from "./components/MuleSoftMCPDashboard";
import FoxitDemoPage from "./components/FoxitDemoPage";
import FoxitPDFGenerator from "./components/FoxitPDFGenerator";
import FoxitWorkflow from "./components/FoxitWorkflow";
import VonageAuthentication from "./components/VonageAuthentication";
import VonageMultiChannel from "./components/VonageMultiChannel";
import VonageDemoPage from "./components/VonageDemoPage";
import MuleSoftDemoPage from "./components/MuleSoftDemoPage";
import OnboardIQ from "./components/OnboardIQ";
import OnboardIQCore from "./components/OnboardIQCore";
import DocumentGeneration from "./components/DocumentGeneration";
import ChurnPrediction from "./components/ChurnPrediction";
import UserProfiling from "./components/UserProfiling";
import VideoOnboarding from "./components/VideoOnboarding";
import DocumentationPage from "./components/DocumentationPage";
import NotFound from "./pages/NotFound";
import HelpPage from "./components/HelpPage";
import DynamicCharts from "./components/DynamicCharts";
import BillingAndPricing from "./components/BillingAndPricing";
import CustomerSuccess from "./components/CustomerSuccess";
import SalesPipeline from "./components/SalesPipeline";
import EnterpriseFeatures from "./components/EnterpriseFeatures";
import ActivityChart from "./components/ActivityChart";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Wrapper component to conditionally render Navigation
const AppContent = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/' || location.pathname === '/landing';
  const isAuthPage = location.pathname === '/signup' || location.pathname === '/login' || location.pathname === '/get-started';
  const shouldShowNavigation = !isLandingPage && !isAuthPage;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Global Navigation - only show on non-landing and non-auth pages */}
      {shouldShowNavigation && <Navigation variant="default" showAuthButtons={true} />}
      
      {/* Main Content */}
      <main className={isLandingPage || isAuthPage ? '' : 'pt-16'}>
        {/* AI Chatbot - Global Component */}
        <AIChatbot />
        <Routes>
          {/* Landing page as the default route */}
          <Route path="/" element={<ModernLandingPage />} />
          <Route path="/landing" element={<LandingPage />} />
          
          {/* Authentication routes */}
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/get-started" element={<AuthPage />} />
          <Route path="/login" element={<AuthPage />} />
          
          {/* Protected/Feature routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/analytics" element={<AnalyticsDashboard />} />
          <Route path="/enhanced" element={<EnhancedDashboard />} />
          <Route path="/functional-dashboard" element={<FunctionalDashboard />} />
          <Route path="/enhanced-dashboard" element={<EnhancedDashboard />} />
          
          {/* Enhanced Features */}
          <Route path="/real-time-analytics" element={<RealTimeAnalytics />} />
          <Route path="/security-monitoring" element={<SecurityMonitoring />} />
          <Route path="/adaptive-onboarding" element={<AdaptiveOnboarding />} />
          <Route path="/user-profiling" element={<UserProfiling />} />
          <Route path="/risk-monitoring" element={<ContinuousRiskMonitoring />} />
          <Route path="/documents" element={<DocumentGeneration userId="demo_user" />} />
          <Route path="/churn-prediction" element={<ChurnPrediction />} />
          <Route path="/video-onboarding" element={<VideoOnboarding />} />
          <Route path="/dynamic-charts" element={<DynamicCharts />} />
          
          {/* Business Features Routes */}
          <Route path="/billing" element={<BillingAndPricing />} />
          <Route path="/customer-success" element={<CustomerSuccess />} />
          <Route path="/sales-pipeline" element={<SalesPipeline />} />
          <Route path="/enterprise" element={<EnterpriseFeatures />} />
          <Route path="/activity-chart" element={<ActivityChart />} />
          
          {/* Document Management Routes */}
          <Route path="/documents" element={<DocumentGeneration userId="demo_user" />} />
          
          {/* Foxit Integration Routes */}
          <Route path="/foxit-demo" element={<FoxitDemoPage />} />
          <Route path="/foxit-generator" element={<FoxitPDFGenerator userId="demo_user" />} />
          <Route path="/foxit-pdf-generator" element={<FoxitPDFGenerator userId="demo_user" />} />
          <Route path="/foxit-workflow" element={<FoxitWorkflow />} />
          
          {/* Vonage Integration Routes */}
          <Route path="/vonage-auth" element={<VonageAuthentication />} />
          <Route path="/vonage-multichannel" element={<VonageMultiChannel />} />
          <Route path="/vonage-demo" element={<VonageDemoPage />} />
          
          {/* MuleSoft Integration Routes */}
          <Route path="/mulesoft-demo" element={<MuleSoftDemoPage />} />
          <Route path="/mulesoft-mcp" element={<MuleSoftMCPDashboard />} />
          
          {/* OnboardIQ Integration Routes */}
          <Route path="/onboardiq" element={<OnboardIQ />} />
          <Route path="/onboardiq-core" element={<OnboardIQCore />} />
          
          {/* Test route */}
          <Route path="/test" element={<TestPage />} />
          <Route path="/auth-test" element={<AuthTest />} />
          
          {/* Demo route */}
          <Route path="/demo" element={<DemoPage />} />
          
          {/* Resource routes */}
          <Route path="/docs" element={<DocumentationPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/tutorials" element={<NotFound />} />
          <Route path="/api" element={<NotFound />} />
          <Route path="/contact" element={<NotFound />} />
          
          {/* 404 fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
