import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  HelpCircle, 
  BookOpen, 
  MessageSquare, 
  Video, 
  FileText, 
  Settings, 
  Users, 
  Shield, 
  BarChart3, 
  Zap, 
  Brain, 
  Play, 
  Workflow, 
  Phone, 
  Mail, 
  ExternalLink, 
  ChevronRight, 
  Star, 
  Clock, 
  Target,
  CheckCircle,
  AlertTriangle,
  Info,
  Lightbulb,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Settings2,
  User,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Bell,
  Calendar,
  TrendingUp,
  Activity,
  Database,
  Cloud,
  Code,
  Network,
  Globe,
  Award,
  Sparkles,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Plus,
  Minus,
  Copy,
  Share2,
  Edit,
  Trash2,
  Archive,
  Tag,
  Link,
  Hash,
  HashIcon,
  HashIcon as HashIcon2,
  HashIcon as HashIcon3,
  HashIcon as HashIcon4,
  HashIcon as HashIcon5,
  HashIcon as HashIcon6,
  HashIcon as HashIcon7,
  HashIcon as HashIcon8,
  HashIcon as HashIcon9,
  HashIcon as HashIcon10
} from 'lucide-react';

const HelpPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Topics', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'getting-started', label: 'Getting Started', icon: <Play className="w-4 h-4" /> },
    { id: 'features', label: 'Features', icon: <Zap className="w-4 h-4" /> },
    { id: 'integrations', label: 'Integrations', icon: <Link className="w-4 h-4" /> },
    { id: 'troubleshooting', label: 'Troubleshooting', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'api', label: 'API & Development', icon: <Code className="w-4 h-4" /> }
  ];

  const helpContent = {
    'getting-started': [
      {
        title: 'Welcome to OnboardIQ',
        content: 'OnboardIQ is an AI-powered onboarding platform that streamlines employee onboarding processes through intelligent automation, personalized experiences, and comprehensive analytics.',
        icon: <Sparkles className="w-5 h-5 text-blue-600" />
      },
      {
        title: 'Quick Start Guide',
        content: 'Get up and running in minutes with our step-by-step quick start guide. Learn how to set up your first onboarding workflow and invite team members.',
        icon: <Play className="w-5 h-5 text-green-600" />
      },
      {
        title: 'Account Setup',
        content: 'Configure your account settings, security preferences, and team permissions. Set up your organization profile and customize your onboarding experience.',
        icon: <Settings className="w-5 h-5 text-purple-600" />
      }
    ],
    'features': [
      {
        title: 'AI-Powered Onboarding',
        content: 'Our AI engine personalizes onboarding experiences based on role, department, and individual learning preferences. Get intelligent recommendations and automated task assignments.',
        icon: <Brain className="w-5 h-5 text-indigo-600" />
      },
      {
        title: 'Document Management',
        content: 'Streamline document workflows with automated generation, digital signatures, and intelligent routing. Integrate with Foxit for advanced PDF capabilities.',
        icon: <FileText className="w-5 h-4 text-orange-600" />
      },
      {
        title: 'Analytics & Insights',
        content: 'Track onboarding progress, identify bottlenecks, and measure success with comprehensive analytics. Get real-time insights into your onboarding effectiveness.',
        icon: <BarChart3 className="w-5 h-5 text-teal-600" />
      },
      {
        title: 'Communication Tools',
        content: 'Multi-channel communication with SMS, email, and video integration. Powered by Vonage for reliable, scalable messaging solutions.',
        icon: <MessageSquare className="w-5 h-5 text-pink-600" />
      }
    ],
    'integrations': [
      {
        title: 'Foxit PDF Integration',
        content: 'Advanced PDF generation, editing, and workflow automation. Create professional documents, forms, and contracts with intelligent data population.',
        icon: <FileText className="w-5 h-5 text-blue-600" />
      },
      {
        title: 'Vonage Communication',
        content: 'Reliable SMS, voice, and video communication. Multi-channel messaging with delivery tracking and analytics.',
        icon: <Phone className="w-5 h-5 text-green-600" />
      },
      {
        title: 'MuleSoft Integration',
        content: 'Enterprise-grade API integration and orchestration. Connect with existing systems and automate complex workflows.',
        icon: <Network className="w-5 h-5 text-purple-600" />
      }
    ],
    'troubleshooting': [
      {
        title: 'Common Issues',
        content: 'Quick solutions to frequently encountered problems. Learn how to resolve authentication issues, document processing errors, and integration problems.',
        icon: <AlertTriangle className="w-5 h-5 text-red-600" />
      },
      {
        title: 'Performance Optimization',
        content: 'Tips and best practices for optimizing your onboarding workflows. Improve load times, reduce errors, and enhance user experience.',
        icon: <TrendingUp className="w-5 h-5 text-yellow-600" />
      },
      {
        title: 'Error Codes',
        content: 'Comprehensive guide to error codes and their meanings. Understand what went wrong and how to fix it.',
        icon: <Hash className="w-5 h-5 text-gray-600" />
      }
    ],
    'security': [
      {
        title: 'Security Features',
        content: 'Enterprise-grade security with encryption, access controls, and audit trails. Learn about our security measures and compliance standards.',
        icon: <Shield className="w-5 h-5 text-green-600" />
      },
      {
        title: 'Authentication',
        content: 'Multi-factor authentication, SSO integration, and role-based access control. Secure your onboarding process with advanced authentication.',
        icon: <Lock className="w-5 h-5 text-blue-600" />
      },
      {
        title: 'Data Privacy',
        content: 'GDPR compliance, data retention policies, and privacy controls. Understand how we protect your data and maintain compliance.',
        icon: <Eye className="w-5 h-5 text-purple-600" />
      }
    ],
    'api': [
      {
        title: 'API Documentation',
        content: 'Complete API reference with examples, authentication methods, and best practices. Integrate OnboardIQ with your existing systems.',
        icon: <Code className="w-5 h-5 text-indigo-600" />
      },
      {
        title: 'Webhooks',
        content: 'Real-time notifications and event handling. Set up webhooks to receive updates about onboarding events and status changes.',
        icon: <Bell className="w-5 h-5 text-orange-600" />
      },
      {
        title: 'SDK & Libraries',
        content: 'Client libraries and SDKs for popular programming languages. Accelerate your integration with pre-built tools and examples.',
        icon: <Database className="w-5 h-5 text-teal-600" />
      }
    ]
  };

  const faqs = [
    {
      question: "How do I create my first onboarding workflow?",
      answer: "Navigate to the Onboarding section and click 'Create New Workflow'. Follow the step-by-step wizard to define tasks, assignees, and timelines. You can also use our AI-powered template suggestions."
    },
    {
      question: "Can I integrate OnboardIQ with my existing HR system?",
      answer: "Yes! OnboardIQ offers comprehensive API integration and pre-built connectors for popular HR systems. Our MuleSoft integration enables seamless data synchronization."
    },
    {
      question: "How secure is my data in OnboardIQ?",
      answer: "We implement enterprise-grade security measures including encryption at rest and in transit, multi-factor authentication, and regular security audits. We're SOC 2 Type II compliant."
    },
    {
      question: "What communication channels are supported?",
      answer: "OnboardIQ supports SMS, email, in-app notifications, and video calls through our Vonage integration. You can customize communication preferences for each user."
    },
    {
      question: "How does the AI personalization work?",
      answer: "Our AI analyzes user behavior, learning preferences, and role requirements to create personalized onboarding experiences. It adapts content, pace, and recommendations based on individual needs."
    },
    {
      question: "Can I generate custom documents and contracts?",
      answer: "Absolutely! Our Foxit integration enables dynamic document generation with intelligent data population, digital signatures, and automated workflows."
    },
    {
      question: "What analytics and reporting are available?",
      answer: "Get comprehensive insights into onboarding completion rates, time-to-productivity, user engagement, and process bottlenecks. Real-time dashboards and customizable reports are available."
    },
    {
      question: "How do I get support if I encounter issues?",
      answer: "We offer multiple support channels including in-app chat, email support, phone support, and comprehensive documentation. Premium customers get dedicated account management."
    }
  ];

  const filteredContent = Object.entries(helpContent).reduce((acc, [category, items]) => {
    if (selectedCategory === 'all' || selectedCategory === category) {
      acc[category] = items.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return acc;
  }, {} as typeof helpContent);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <HelpCircle className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-4xl font-bold text-gray-900">Help & Support</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Find answers to your questions, learn about features, and get the most out of OnboardIQ
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                {category.icon}
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-semibold">Live Chat Support</h3>
                <p className="text-sm text-gray-600">Get instant help from our team</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Video className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-semibold">Video Tutorials</h3>
                <p className="text-sm text-gray-600">Step-by-step video guides</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Mail className="w-6 h-6 text-purple-600" />
              <div>
                <h3 className="font-semibold">Email Support</h3>
                <p className="text-sm text-gray-600">Detailed assistance via email</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="help-topics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="help-topics">Help Topics</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="contact">Contact Support</TabsTrigger>
        </TabsList>

        <TabsContent value="help-topics" className="space-y-6">
          {Object.entries(filteredContent).map(([category, items]) => (
            items.length > 0 && (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {categories.find(c => c.id === category)?.icon}
                    {categories.find(c => c.id === category)?.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {items.map((item, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-shrink-0 mt-1">
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                          <p className="text-gray-600 mb-3">{item.content}</p>
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            Learn More
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          ))}
        </TabsContent>

        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Quick answers to common questions about OnboardIQ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-gray-600">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold">Email Support</p>
                    <p className="text-gray-600">support@onboardiq.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-semibold">Phone Support</p>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-semibold">Support Hours</p>
                    <p className="text-gray-600">24/7 for Premium customers</p>
                    <p className="text-gray-600">Mon-Fri 9AM-6PM EST for Standard</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Support Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start" variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Start Live Chat
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Video className="w-4 h-4 mr-2" />
                  Schedule Video Call
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email Ticket
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Request Callback
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Additional Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="flex flex-col items-center gap-2 h-auto p-4">
                  <BookOpen className="w-6 h-6" />
                  <span>Documentation</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center gap-2 h-auto p-4">
                  <Video className="w-6 h-6" />
                  <span>Video Library</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center gap-2 h-auto p-4">
                  <Users className="w-6 h-6" />
                  <span>Community</span>
                </Button>
                <Button variant="outline" className="flex flex-col items-center gap-2 h-auto p-4">
                  <Code className="w-6 h-6" />
                  <span>API Docs</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Feedback Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Was this helpful?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <ThumbsUp className="w-4 h-4" />
              Yes, this helped
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <ThumbsDown className="w-4 h-4" />
              No, I need more help
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpPage;
