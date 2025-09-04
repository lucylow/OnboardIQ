import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Users, 
  Bot, 
  Shield, 
  FileText, 
  MessageSquare,
  TrendingUp,
  Zap,
  Globe,
  Award,
  Play,
  Download,
  Mail,
  Sparkles,
  Brain,
  Activity,
  Lock,
  Clock,
  Target,
  Rocket,
  Heart,
  Eye,
  BarChart3,
  Smartphone,
  Video,
  BookOpen
} from 'lucide-react';

// Import mock data
import { mockDashboardData, mockAIAnalytics } from '@/services/mockData';

const ModernLandingPage: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleGetStarted = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.location.href = '/signup';
      setIsLoading(false);
    }, 1000);
  };

  const handleDemo = () => {
    toast({
      title: "Demo Requested",
      description: "We'll contact you shortly to schedule a personalized demo.",
    });
  };

  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI-Powered Profiling",
      description: "Intelligent user segmentation and personalized onboarding paths",
      stats: `${mockAIAnalytics.userProfiling.accuracy * 100}% accuracy`,
      color: "from-purple-500 to-pink-500",
      gradient: "bg-gradient-to-br from-purple-500 to-pink-500"
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Multi-Channel Communication",
      description: "Seamless communication across email, SMS, WhatsApp, and voice",
      stats: `${mockAIAnalytics.conversational.totalConversations.toLocaleString()} conversations`,
      color: "from-blue-500 to-cyan-500",
      gradient: "bg-gradient-to-br from-blue-500 to-cyan-500"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Advanced Security",
      description: "Real-time risk assessment and adaptive authentication",
      stats: `${mockAIAnalytics.security.totalAssessments.toLocaleString()} assessments`,
      color: "from-green-500 to-emerald-500",
      gradient: "bg-gradient-to-br from-green-500 to-emerald-500"
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Smart Document Generation",
      description: "AI-powered personalized document creation and validation",
      stats: `${mockAIAnalytics.document.totalGenerated.toLocaleString()} documents`,
      color: "from-orange-500 to-red-500",
      gradient: "bg-gradient-to-br from-orange-500 to-red-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "VP of Customer Success",
      company: "TechCorp",
      content: "OnboardIQ transformed our customer onboarding process. The AI insights are incredible!",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      role: "Head of Operations",
      company: "FinTech Solutions",
      content: "The multi-channel approach and personalized workflows have increased our completion rate by 40%.",
      rating: 5,
      avatar: "MC"
    },
    {
      name: "Emily Rodriguez",
      role: "Customer Experience Manager",
      company: "HealthTech Inc",
      content: "The security features and document automation have streamlined our entire process.",
      rating: 5,
      avatar: "ER"
    }
  ];

  const stats = [
    { 
      label: "Active Users", 
      value: mockDashboardData.overview.activeUsers.toLocaleString(), 
      icon: <Users className="h-4 w-4" />,
      change: "+12%",
      changeType: "positive"
    },
    { 
      label: "Completion Rate", 
      value: `${(mockDashboardData.overview.completionRate * 100).toFixed(1)}%`, 
      icon: <CheckCircle className="h-4 w-4" />,
      change: "+8%",
      changeType: "positive"
    },
    { 
      label: "Satisfaction Score", 
      value: `${mockDashboardData.overview.satisfactionScore}/5.0`, 
      icon: <Star className="h-4 w-4" />,
      change: "+0.3",
      changeType: "positive"
    },
    { 
      label: "Security Score", 
      value: "99.9%", 
      icon: <Shield className="h-4 w-4" />,
      change: "+0.1%",
      changeType: "positive"
    }
  ];

  const integrations = [
    { name: "Vonage", icon: <MessageSquare className="h-5 w-5" />, color: "text-blue-600" },
    { name: "Foxit", icon: <FileText className="h-5 w-5" />, color: "text-orange-600" },
    { name: "MuleSoft", icon: <Zap className="h-5 w-5" />, color: "text-purple-600" },
    { name: "OpenAI", icon: <Brain className="h-5 w-5" />, color: "text-green-600" }
  ];

  return (
    <div className={`min-h-screen transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-16">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <Badge 
              variant="secondary" 
              className="mb-6 inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-200 hover:from-purple-200 hover:to-blue-200 transition-all duration-300"
            >
              <Sparkles className="h-3 w-3" />
              AI-Powered Customer Onboarding
              <ArrowRight className="h-3 w-3" />
            </Badge>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Transform Your
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Customer Onboarding
              </span>
              with AI
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              From first click to first value, instantly. Our AI-powered platform delivers personalized, 
              secure, and engaging onboarding experiences across every channel.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                onClick={handleGetStarted}
                disabled={isLoading}
                className="group relative px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Getting Started...
                  </div>
                ) : (
                  <>
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleDemo}
                className="px-8 py-4 text-lg font-semibold border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-all duration-300"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div 
                  key={stat.label}
                  className="text-center p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-gray-200/50 hover:bg-white/80 transition-all duration-300 hover:shadow-lg"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-center mb-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
                  <div className={`text-xs font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change} from last month
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-700">
              <Rocket className="h-3 w-3 mr-1" />
              Powerful Features
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything you need for
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                modern onboarding
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Leverage the power of AI, multi-channel communication, and advanced security 
              to create exceptional customer experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={feature.title}
                className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className={`absolute inset-0 ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-xl ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 mb-4 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs font-medium">
                      {feature.stats}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Integrations Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700">
              <Award className="h-3 w-3 mr-1" />
              Hackathon Prize Technology Stack
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Powered by
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Industry Leaders
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform integrates cutting-edge enterprise technologies, competing for multiple hackathon prizes 
              with Vonage, Foxit, and MuleSoft's most advanced APIs.
            </p>
          </div>

          {/* Enhanced Integration Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Vonage Card - Hackathon Prize */}
            <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="absolute top-4 right-4">
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 font-semibold">
                  <Award className="h-3 w-3 mr-1" />
                  Hackathon Prize
                </Badge>
              </div>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <MessageSquare className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900">Vonage APIs</CardTitle>
                    <p className="text-blue-600 font-medium">Multi-Channel Communication</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700 mb-6 text-base leading-relaxed">
                  Revolutionary communication platform enabling seamless customer engagement across SMS, voice, 
                  video calls, WhatsApp Business, and advanced 2FA verification systems.
                </CardDescription>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm text-gray-700">Global SMS & Voice API with 99.9% uptime</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm text-gray-700">WhatsApp Business API integration</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm text-gray-700">Advanced 2FA & OTP verification</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm text-gray-700">Real-time video onboarding calls</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs font-medium border-blue-200 text-blue-700">
                    Active Integration
                  </Badge>
                  <ArrowRight className="h-4 w-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>

            {/* Foxit Card - Hackathon Prize */}
            <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-orange-50 to-orange-100">
              <div className="absolute top-4 right-4">
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 font-semibold">
                  <Award className="h-3 w-3 mr-1" />
                  Hackathon Prize
                </Badge>
              </div>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-600 to-orange-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900">Foxit PDF SDK</CardTitle>
                    <p className="text-orange-600 font-medium">Document Intelligence</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700 mb-6 text-base leading-relaxed">
                  Enterprise-grade PDF processing engine with AI-powered document generation, digital signatures, 
                  form automation, and compliance-ready workflows for seamless onboarding.
                </CardDescription>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    <span className="text-sm text-gray-700">AI-powered PDF generation & customization</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    <span className="text-sm text-gray-700">Digital signature & e-signature workflows</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    <span className="text-sm text-gray-700">Form field auto-population & validation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    <span className="text-sm text-gray-700">Compliance-ready document archival</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs font-medium border-orange-200 text-orange-700">
                    Active Integration
                  </Badge>
                  <ArrowRight className="h-4 w-4 text-orange-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>

            {/* MuleSoft Card - Hackathon Prize */}
            <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="absolute top-4 right-4">
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 font-semibold">
                  <Award className="h-3 w-3 mr-1" />
                  Hackathon Prize
                </Badge>
              </div>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900">MuleSoft Anypoint</CardTitle>
                    <p className="text-purple-600 font-medium">API Orchestration</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700 mb-6 text-base leading-relaxed">
                  Enterprise integration platform connecting legacy systems, cloud applications, and APIs into 
                  unified onboarding workflows with real-time data synchronization.
                </CardDescription>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span className="text-sm text-gray-700">API-led connectivity architecture</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span className="text-sm text-gray-700">Real-time data transformation & sync</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span className="text-sm text-gray-700">Legacy system modernization</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span className="text-sm text-gray-700">Enterprise security & governance</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs font-medium border-purple-200 text-purple-700">
                    Active Integration
                  </Badge>
                  <ArrowRight className="h-4 w-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>

            {/* OpenAI Card - Supporting Technology */}
            <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-green-50 to-green-100">
              <div className="absolute top-4 right-4">
                <Badge className="bg-gradient-to-r from-green-400 to-emerald-400 text-green-900 font-semibold">
                  <Brain className="h-3 w-3 mr-1" />
                  AI Engine
                </Badge>
              </div>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900">OpenAI GPT-4</CardTitle>
                    <p className="text-green-600 font-medium">Intelligent Automation</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700 mb-6 text-base leading-relaxed">
                  Advanced AI engine powering personalized onboarding experiences, intelligent chatbots, 
                  predictive analytics, and automated decision-making across all customer touchpoints.
                </CardDescription>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-sm text-gray-700">GPT-4 powered conversational AI</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-sm text-gray-700">Predictive user behavior analysis</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-sm text-gray-700">Intelligent content personalization</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-sm text-gray-700">Automated workflow optimization</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs font-medium border-green-200 text-green-700">
                    Active Integration
                  </Badge>
                  <ArrowRight className="h-4 w-4 text-green-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Integration Flow Diagram */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Seamless Technology Integration Flow
              </h3>
              <p className="text-gray-600">
                How our hackathon prize technologies work together to deliver exceptional onboarding
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">1. Customer Contact</h4>
                <p className="text-sm text-gray-600">Vonage multi-channel communication initiates onboarding</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">2. AI Processing</h4>
                <p className="text-sm text-gray-600">OpenAI analyzes customer data for personalization</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">3. Document Generation</h4>
                <p className="text-sm text-gray-600">Foxit creates personalized compliance documents</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">4. System Integration</h4>
                <p className="text-sm text-gray-600">MuleSoft orchestrates all enterprise systems</p>
              </div>
            </div>
          </div>

          {/* Hackathon Recognition */}
          <div className="text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full border border-yellow-200">
              <Award className="h-5 w-5 text-yellow-600" />
              <span className="text-yellow-800 font-semibold">
                Built with enterprise-grade technology partners for unmatched reliability
              </span>
              <Sparkles className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-green-100 text-green-700">
              <Heart className="h-3 w-3 mr-1" />
              Customer Success
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Loved by customers
              <span className="block bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                worldwide
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={testimonial.name}
                className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 300}ms` }}
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold">{testimonial.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {testimonial.role} at {testimonial.company}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <blockquote className="text-gray-600 italic leading-relaxed">
                    "{testimonial.content}"
                  </blockquote>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to transform your
            <span className="block">customer onboarding?</span>
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of companies already using OnboardIQ to create 
            exceptional customer experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleGetStarted}
              disabled={isLoading}
              className="px-8 py-4 text-lg font-semibold bg-white text-blue-900 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              {isLoading ? 'Getting Started...' : 'Start Free Trial'}
            </Button>
            <Button
              variant="outline"
              onClick={handleDemo}
              className="px-8 py-4 text-lg font-semibold border-2 border-white text-blue-900 hover:bg-white hover:text-blue-900 transition-all duration-300"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ModernLandingPage;
