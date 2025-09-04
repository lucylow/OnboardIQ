import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Shield, 
  Users, 
  FileText, 
  BarChart3, 
  ArrowRight,
  Check,
  Smartphone,
  Video,
  Mail,
  MessageSquare,
  Lock,
  Eye,
  Zap,
  Award,
  TrendingUp,
  Clock,
  Target,
  Star
} from 'lucide-react';

const DemoShowcase: React.FC = () => {
  const [currentDemo, setCurrentDemo] = useState('verification');
  const [isPlaying, setIsPlaying] = useState(false);

  const demoSteps = {
    verification: [
      {
        step: 1,
        title: 'User Registration',
        description: 'New user enters email and phone number',
        icon: Users,
        duration: '30 seconds',
        features: ['Email validation', 'Phone number formatting', 'Real-time verification']
      },
      {
        step: 2,
        title: '2FA Verification',
        description: 'Vonage Verify sends secure PIN via SMS',
        icon: Shield,
        duration: '45 seconds',
        features: ['SMS delivery', 'PIN generation', 'Security compliance']
      },
      {
        step: 3,
        title: 'PIN Entry & Validation',
        description: 'User enters PIN and system validates',
        icon: Lock,
        duration: '20 seconds',
        features: ['PIN validation', 'Session creation', 'Audit trail']
      }
    ],
    onboarding: [
      {
        step: 1,
        title: 'Welcome Video Call',
        description: 'AI-powered video onboarding session',
        icon: Video,
        duration: '2 minutes',
        features: ['Personalized greeting', 'Feature walkthrough', 'Q&A session']
      },
      {
        step: 2,
        title: 'Multi-Channel Engagement',
        description: 'SMS, email, and in-app notifications',
        icon: MessageSquare,
        duration: '1 minute',
        features: ['SMS reminders', 'Email sequences', 'In-app prompts']
      },
      {
        step: 3,
        title: 'Progress Tracking',
        description: 'Real-time onboarding progress monitoring',
        icon: BarChart3,
        duration: '30 seconds',
        features: ['Progress dashboard', 'Completion tracking', 'Engagement metrics']
      }
    ],
    documents: [
      {
        step: 1,
        title: 'Document Generation',
        description: 'Foxit API creates personalized documents',
        icon: FileText,
        duration: '1 minute',
        features: ['Template selection', 'Data merging', 'PDF generation']
      },
      {
        step: 2,
        title: 'Document Processing',
        description: 'Advanced PDF operations and optimization',
        icon: Zap,
        duration: '45 seconds',
        features: ['Compression', 'Watermarking', 'Encryption']
      },
      {
        step: 3,
        title: 'E-Signature Workflow',
        description: 'Digital signature and compliance automation',
        icon: Award,
        duration: '2 minutes',
        features: ['Signature fields', 'Recipient routing', 'Status tracking']
      }
    ],
    dashboard: [
      {
        step: 1,
        title: 'Real-Time Analytics',
        description: 'Live dashboard with key metrics',
        icon: TrendingUp,
        duration: '30 seconds',
        features: ['User activity', 'Conversion rates', 'Engagement scores']
      },
      {
        step: 2,
        title: 'Workflow Management',
        description: 'Customize and optimize onboarding flows',
        icon: Target,
        duration: '1 minute',
        features: ['Flow builder', 'Conditional logic', 'A/B testing']
      },
      {
        step: 3,
        title: 'Compliance Monitoring',
        description: 'Automated compliance and audit reporting',
        icon: Eye,
        duration: '45 seconds',
        features: ['Audit trails', 'Compliance reports', 'Risk alerts']
      }
    ]
  };

  const demoMetrics = [
    { metric: '98%', label: 'Verification Success Rate', icon: Shield },
    { metric: '85%', label: 'Onboarding Completion', icon: Users },
    { metric: '3.2x', label: 'Faster Document Processing', icon: FileText },
    { metric: '67%', label: 'Reduction in Churn', icon: TrendingUp }
  ];

  const narrativeStructure = {
    act1: {
      title: 'The Problem',
      subtitle: 'Churn and Security Risks in Customer Onboarding',
      points: [
        'High customer churn rates due to poor onboarding experiences',
        'Security vulnerabilities in traditional verification methods',
        'Manual processes causing delays and compliance issues',
        'Lack of personalization leading to disengagement'
      ]
    },
    act2: {
      title: 'The Solution',
      subtitle: 'OnboardIQ\'s Integrated Platform',
      points: [
        'Multi-channel engagement with AI-powered personalization',
        'Enterprise-grade security with Vonage Verify integration',
        'Automated document workflows powered by Foxit APIs',
        'Real-time analytics and compliance monitoring'
      ]
    },
    act3: {
      title: 'The Future',
      subtitle: 'Scalable AI-Driven Personalization',
      points: [
        'Predictive analytics for proactive engagement',
        'Advanced AI orchestration with MuleSoft integration',
        'Global compliance automation and risk management',
        'Seamless scaling to millions of users'
      ]
    }
  };

  const handleDemoPlay = (demoType: string) => {
    setCurrentDemo(demoType);
    setIsPlaying(true);
    // Simulate demo progression
    setTimeout(() => setIsPlaying(false), 5000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-blue-100 text-blue-800 mb-4">
              <Play className="h-3 w-3 mr-1" />
              Interactive Demo
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              See OnboardIQ in
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Action</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience our comprehensive onboarding platform through interactive demos 
              showcasing real-world use cases and business impact.
            </p>
          </div>

          {/* Demo Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {demoMetrics.map((metric, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <metric.icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-gray-900 mb-2">{metric.metric}</div>
                  <div className="text-gray-600 text-sm">{metric.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Narrative Structure */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Story: Three-Act Transformation
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A structured narrative showing the problem, solution, and future vision 
              for customer onboarding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(narrativeStructure).map(([act, content], index) => (
              <Card key={act} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{index + 1}</span>
                    </div>
                    <div>
                      <CardTitle className="text-xl">{content.title}</CardTitle>
                      <p className="text-gray-600 text-sm">{content.subtitle}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {content.points.map((point, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demos */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Interactive Feature Demos
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Click on any demo to see OnboardIQ's features in action with real-time examples.
            </p>
          </div>

          <Tabs value={currentDemo} onValueChange={setCurrentDemo} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="verification" className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>2FA Verification</span>
              </TabsTrigger>
              <TabsTrigger value="onboarding" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Multi-Channel</span>
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Document Automation</span>
              </TabsTrigger>
              <TabsTrigger value="dashboard" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Admin Dashboard</span>
              </TabsTrigger>
            </TabsList>

            {Object.entries(demoSteps).map(([demoType, steps]) => (
              <TabsContent key={demoType} value={demoType} className="space-y-6">
                <div className="text-center mb-8">
                  <Button 
                    onClick={() => handleDemoPlay(demoType)}
                    disabled={isPlaying}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {isPlaying ? 'Playing Demo...' : 'Play Demo'}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {steps.map((step, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">{step.step}</span>
                          </div>
                          <div>
                            <CardTitle className="text-lg">{step.title}</CardTitle>
                            <Badge variant="outline" className="text-blue-600">
                              <Clock className="h-3 w-3 mr-1" />
                              {step.duration}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4">{step.description}</p>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Features:</h4>
                          <ul className="space-y-1">
                            {step.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center text-sm text-gray-600">
                                <Check className="h-3 w-3 text-green-600 mr-2" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Demo Scripts */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Demo Scripts & Presentation Guide
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Structured demo scripts for consistent, compelling presentations 
              that highlight OnboardIQ's value proposition.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">User Signup & Verification Demo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Opening (30 seconds):</h4>
                  <p className="text-sm text-gray-600">
                    "Today, I'll show you how OnboardIQ transforms customer onboarding with 
                    enterprise-grade security and seamless user verification."
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Demo Flow:</h4>
                  <ol className="text-sm text-gray-600 space-y-2">
                    <li>1. User enters email and phone number</li>
                    <li>2. System validates and formats data</li>
                    <li>3. Vonage Verify sends secure PIN</li>
                    <li>4. User enters PIN for verification</li>
                    <li>5. System creates secure session</li>
                  </ol>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Key Points:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 98% verification success rate</li>
                    <li>• SOC2 compliant security</li>
                    <li>• Real-time audit trails</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Document Automation Demo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Opening (30 seconds):</h4>
                  <p className="text-sm text-gray-600">
                    "Watch how OnboardIQ automates document generation, processing, 
                    and e-signature workflows in minutes, not hours."
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Demo Flow:</h4>
                  <ol className="text-sm text-gray-600 space-y-2">
                    <li>1. Select document template</li>
                    <li>2. Merge user data automatically</li>
                    <li>3. Generate personalized PDF</li>
                    <li>4. Apply security features</li>
                    <li>5. Route for e-signature</li>
                  </ol>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Key Points:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 3.2x faster processing</li>
                    <li>• Automated compliance</li>
                    <li>• Multi-party signing</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Experience OnboardIQ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Schedule a personalized demo to see how OnboardIQ can transform your onboarding process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Schedule Live Demo
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
              Start Free Trial
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DemoShowcase;
