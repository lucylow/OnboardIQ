import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  BookOpen, 
  Code, 
  Zap, 
  Shield, 
  MessageSquare, 
  FileText, 
  Video, 
  Smartphone,
  Brain,
  TrendingUp,
  Users,
  Settings,
  Play,
  Download,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

const DocumentationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const quickStartSteps = [
    {
      step: 1,
      title: 'Sign Up & Authentication',
      description: 'Create your account with Vonage Verify integration',
      icon: <Shield className="w-5 h-5" />,
      action: 'Get Started',
      link: '/signup'
    },
    {
      step: 2,
      title: 'Complete Onboarding Flow',
      description: 'AI-powered personalized onboarding experience',
      icon: <Brain className="w-5 h-5" />,
      action: 'Start Onboarding',
      link: '/onboarding'
    },
    {
      step: 3,
      title: 'Generate Documents',
      description: 'Create professional documents with Foxit integration',
      icon: <FileText className="w-5 h-5" />,
      action: 'Create Documents',
      link: '/foxit-workflow'
    },
    {
      step: 4,
      title: 'Monitor Analytics',
      description: 'Track progress and insights with real-time analytics',
      icon: <TrendingUp className="w-5 h-5" />,
      action: 'View Analytics',
      link: '/analytics'
    }
  ];

  const integrations = [
    {
      name: 'Vonage Verify',
      description: 'SMS PIN verification and risk-based authentication',
      status: 'Complete',
      features: ['SMS Verification', 'Risk Assessment', 'SIM Swap Detection'],
      icon: <Shield className="w-5 h-5" />
    },
    {
      name: 'Vonage Video',
      description: 'Personalized video onboarding sessions',
      status: 'Complete',
      features: ['HD Video Calls', 'Screen Sharing', 'Recording'],
      icon: <Video className="w-5 h-5" />
    },
    {
      name: 'Vonage SMS',
      description: 'Multi-channel templated messaging',
      status: 'Complete',
      features: ['Template Messages', 'Multi-language', 'Delivery Tracking'],
      icon: <MessageSquare className="w-5 h-5" />
    },
    {
      name: 'Foxit Document',
      description: 'Template-based PDF generation and manipulation',
      status: 'Complete',
      features: ['PDF Generation', 'Template Merging', 'Watermarking'],
      icon: <FileText className="w-5 h-5" />
    },
    {
      name: 'MuleSoft AI',
      description: 'AI-powered personalization and orchestration',
      status: 'In Development',
      features: ['AI Recommendations', 'Behavior Analysis', 'Predictive Insights'],
      icon: <Brain className="w-5 h-5" />
    }
  ];

  const apiEndpoints = [
    {
      method: 'POST',
      endpoint: '/api/auth/verify',
      description: 'Verify user identity via SMS',
      parameters: ['phone', 'code'],
      response: '{ "verified": true, "risk_score": 0.1 }'
    },
    {
      method: 'POST',
      endpoint: '/api/documents/generate',
      description: 'Generate PDF document from template',
      parameters: ['template_id', 'data', 'options'],
      response: '{ "document_url": "...", "status": "completed" }'
    },
    {
      method: 'GET',
      endpoint: '/api/analytics/user-progress',
      description: 'Get user onboarding progress',
      parameters: ['user_id'],
      response: '{ "progress": 75, "completed_steps": [...] }'
    },
    {
      method: 'POST',
      endpoint: '/api/ai/recommendations',
      description: 'Get AI-powered recommendations',
      parameters: ['user_id', 'context'],
      response: '{ "recommendations": [...] }'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            OnboardIQ Documentation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Complete guide to OnboardIQ's AI-powered multi-channel customer onboarding platform
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              Production Ready
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Shield className="w-4 h-4" />
              Enterprise Security
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Brain className="w-4 h-4" />
              AI-Powered
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="api">API Reference</TabsTrigger>
            <TabsTrigger value="guides">Guides</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    What is OnboardIQ?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    OnboardIQ is a production-ready, integrated platform that solves the three critical challenges 
                    of customer onboarding: time-to-value crisis, security vulnerabilities, and operational inefficiencies.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>AI-Personalized Multi-Channel Journeys</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Embedded, Frictionless Security</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Fully Automated Document Workflow</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Key Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-blue-600">75% Reduction in User Abandonment</h4>
                      <p className="text-sm text-gray-600">AI-powered personalization keeps users engaged</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-600">42% Fraud Prevention</h4>
                      <p className="text-sm text-gray-600">Advanced security with Vonage Verify integration</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-600">90% Process Automation</h4>
                      <p className="text-sm text-gray-600">Streamlined workflows reduce manual effort</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Market Opportunity:</strong> OnboardIQ addresses a $6.8 billion market growing at 22% annually. 
                The platform is designed for B2B SaaS companies facing onboarding challenges.
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* Quick Start Tab */}
          <TabsContent value="quickstart" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started with OnboardIQ</CardTitle>
                <CardDescription>
                  Follow these steps to get up and running with OnboardIQ in minutes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {quickStartSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {step.icon}
                          <h3 className="font-semibold">{step.title}</h3>
                        </div>
                        <p className="text-gray-600 mb-3">{step.description}</p>
                        <Button asChild size="sm">
                          <a href={step.link}>{step.action}</a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            <div className="grid gap-6">
              {integrations.map((integration, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {integration.icon}
                        <div>
                          <CardTitle>{integration.name}</CardTitle>
                          <CardDescription>{integration.description}</CardDescription>
                        </div>
                      </div>
                      <Badge variant={integration.status === 'Complete' ? 'default' : 'secondary'}>
                        {integration.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {integration.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* API Reference Tab */}
          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Endpoints</CardTitle>
                <CardDescription>
                  RESTful API endpoints for integrating OnboardIQ into your applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apiEndpoints.map((endpoint, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{endpoint.method}</Badge>
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                          {endpoint.endpoint}
                        </code>
                      </div>
                      <p className="text-gray-600 mb-2">{endpoint.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Parameters</h4>
                          <code className="text-xs bg-gray-100 p-2 rounded block">
                            {endpoint.parameters.join(', ')}
                          </code>
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm mb-1">Response</h4>
                          <code className="text-xs bg-gray-100 p-2 rounded block">
                            {endpoint.response}
                          </code>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Guides Tab */}
          <TabsContent value="guides" className="space-y-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="security-setup">
                <AccordionTrigger>Security Setup Guide</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <p>Configure Vonage Verify for secure user authentication:</p>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>Set up Vonage API credentials in your environment</li>
                      <li>Configure SMS templates for verification messages</li>
                      <li>Implement risk-based authentication workflows</li>
                      <li>Test the verification flow with test phone numbers</li>
                    </ol>
                    <Button asChild size="sm">
                      <a href="/vonage-auth">Configure Security</a>
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="document-workflow">
                <AccordionTrigger>Document Workflow Setup</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <p>Set up automated document generation with Foxit integration:</p>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>Upload document templates to Foxit</li>
                      <li>Configure data mapping for template variables</li>
                      <li>Set up automated document generation triggers</li>
                      <li>Test document generation with sample data</li>
                    </ol>
                    <Button asChild size="sm">
                      <a href="/foxit-workflow">Setup Documents</a>
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="analytics-config">
                <AccordionTrigger>Analytics Configuration</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <p>Configure real-time analytics and reporting:</p>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>Set up user behavior tracking</li>
                      <li>Configure conversion funnel analytics</li>
                      <li>Set up automated reporting schedules</li>
                      <li>Configure alert thresholds for key metrics</li>
                    </ol>
                    <Button asChild size="sm">
                      <a href="/analytics">Configure Analytics</a>
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="ai-personalization">
                <AccordionTrigger>AI Personalization Setup</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <p>Configure AI-powered personalization features:</p>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>Set up user behavior tracking</li>
                      <li>Configure learning style detection</li>
                      <li>Set up personalized content recommendations</li>
                      <li>Test AI recommendation accuracy</li>
                    </ol>
                    <Button asChild size="sm">
                      <a href="/adaptive-onboarding">Configure AI</a>
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <Separator className="my-8" />
        <div className="text-center text-gray-600">
          <p>Need help? Contact our support team or check out our demo at <a href="/demo" className="text-blue-600 hover:underline">/demo</a></p>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;
