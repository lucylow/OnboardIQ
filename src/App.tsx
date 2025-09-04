import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Business Components
import BusinessLanding from './components/BusinessLanding';
import BusinessModel from './components/BusinessModel';
import DemoShowcase from './components/DemoShowcase';
import InvestorPage from './components/InvestorPage';
import PricingPlans from './components/PricingPlans';
import Testimonials from './components/Testimonials';
import AboutUs from './components/AboutUs';
import BlogResources from './components/BlogResources';

// App Components
import VideoOnboarding from './components/VideoOnboarding';
import FoxitPDFGenerator from './components/FoxitPDFGenerator';
import FoxitDemoPage from './components/FoxitDemoPage';

// Mobile Components
import MobileNavigation from './components/MobileNavigation';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        <div className="pb-16 sm:pb-0"> {/* Add bottom padding for mobile nav */}
          <Routes>
            {/* Business Landing Pages */}
            <Route path="/" element={<BusinessLanding />} />
            <Route path="/business-model" element={<BusinessModel />} />
            <Route path="/demo-showcase" element={<DemoShowcase />} />
            <Route path="/investors" element={<InvestorPage />} />
            <Route path="/pricing" element={<PricingPlans />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/blog" element={<BlogResources />} />
            
            {/* App Features */}
            <Route path="/video-onboarding" element={<VideoOnboarding />} />
            <Route path="/foxit-pdf-generator" element={<FoxitPDFGenerator userId="demo_user" />} />
            <Route path="/foxit-demo" element={<FoxitDemoPage />} />
            
            {/* Demo Routes */}
            <Route path="/demo" element={<VideoOnboarding />} />
            <Route path="/demo/foxit" element={<FoxitPDFGenerator userId="demo_user" />} />
            
            {/* Business Demo Routes */}
            <Route path="/demo/business" element={<BusinessModel />} />
            <Route path="/demo/showcase" element={<DemoShowcase />} />
          </Routes>
        </div>
        
        {/* Mobile Navigation - Only show on mobile */}
        <div className="sm:hidden">
          <MobileNavigation />
        </div>
      </div>
    </Router>
  );
}

export default App;
