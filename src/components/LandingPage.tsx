import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  Clock,
  Shield,
  TrendingUp,
  MessageSquare,
  FileText,
  Video,
  Mail,
  Phone,
  Globe,
  Zap,
  Target,
  Award,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Settings,
  Gamepad2,
  Dice1,
  Puzzle,
  Layers,
  Building,
  Book,
  Gem,
  Brain,
  Network,
  Bot,
  User,
  Smartphone,
  BarChart3,
  Sparkles,
  Signal,
  Wifi,
  Battery
} from "lucide-react";

const LandingPage: React.FC = () => {
  const [currentDemoStep, setCurrentDemoStep] = useState(0);
  const [isDemoPlaying, setIsDemoPlaying] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showLiveDemo, setShowLiveDemo] = useState(false);

  // Auto-advance demo
  useEffect(() => {
    if (isDemoPlaying) {
      const interval = setInterval(() => {
        setCurrentDemoStep((prev) => (prev + 1) % demoSteps.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isDemoPlaying]);

  // Auto-advance testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Multi-Factor Security",
      description: "Advanced phone verification with SIM swap detection and blockchain audit logging",
      benefits: ["99.9% fraud prevention", "Real-time threat detection", "Compliance ready"]
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI-Powered Personalization",
      description: "Intelligent journey optimization based on user behavior and preferences",
      benefits: ["74% higher conversion", "Personalized experiences", "Predictive analytics"]
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Multi-Channel Engagement",
      description: "Seamless SMS, video, email, and document delivery across all touchpoints",
      benefits: ["Omnichannel support", "Real-time sync", "Unified dashboard"]
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Real-Time Analytics",
      description: "Live insights and predictive analytics to optimize conversion rates",
      benefits: ["Live dashboards", "Predictive insights", "A/B testing"]
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Automated Workflows",
      description: "Streamline onboarding with intelligent automation and smart triggers",
      benefits: ["Zero manual work", "Smart triggers", "Custom workflows"]
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Global Compliance",
      description: "Meet international standards with built-in GDPR, SOC2, and regional compliance",
      benefits: ["GDPR compliant", "SOC2 certified", "Global support"]
    }
  ];

  const channels = [
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "SMS Verification",
      description: "Secure 2FA with Vonage Verify API",
      color: "bg-blue-500",
      features: ["OTP delivery", "SIM swap detection", "Global coverage"]
    },
    {
      icon: <Video className="h-8 w-8" />,
      title: "Video Onboarding",
      description: "Personalized video tours with Vonage Video",
      color: "bg-purple-500",
      features: ["HD quality", "Screen sharing", "Recording"]
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Document Generation",
      description: "Automated PDF creation with Foxit APIs",
      color: "bg-green-500",
      features: ["Templates", "E-signatures", "Version control"]
    },
    {
      icon: <Mail className="h-8 w-8" />,
      title: "Email Automation",
      description: "Smart email sequences with personalized content",
      color: "bg-orange-500",
      features: ["Drip campaigns", "A/B testing", "Analytics"]
    }
  ];

  const demoSteps = [
    {
      title: "User Registration",
      description: "Secure signup with multi-factor authentication",
      icon: <User className="h-6 w-6" />,
      progress: 25,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Phone Verification",
      description: "Instant SMS verification with fraud detection",
      icon: <Phone className="h-6 w-6" />,
      progress: 50,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Document Setup",
      description: "AI-powered document generation and signing",
      icon: <FileText className="h-6 w-6" />,
      progress: 75,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Video Onboarding",
      description: "Personalized video session with live support",
      icon: <Video className="h-6 w-6" />,
      progress: 100,
      color: "from-orange-500 to-orange-600"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CTO at TechFlow",
      company: "TechFlow Inc.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      content: "OnboardIQ reduced our customer churn by 68% in just 3 months. The AI-powered personalization is game-changing.",
      rating: 5,
      metrics: { conversion: "+74%", churn: "-68%", satisfaction: "4.9/5" }
    },
    {
      name: "Michael Chen",
      role: "Head of Growth",
      company: "GrowthLabs",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      content: "The multi-channel approach and real-time analytics have transformed how we onboard customers. ROI is incredible.",
      rating: 5,
      metrics: { conversion: "+82%", churn: "-71%", satisfaction: "4.8/5" }
    },
    {
      name: "Emily Rodriguez",
      role: "VP of Customer Success",
      company: "CustomerFirst",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      content: "Security features are top-notch, and the AI recommendations help us provide personalized experiences at scale.",
      rating: 5,
      metrics: { conversion: "+69%", churn: "-65%", satisfaction: "4.9/5" }
    }
  ];

  const stats = [
    { label: "Conversion Rate", value: "94%", icon: <TrendingUp className="h-4 w-4" />, change: "+74%" },
    { label: "Time to Value", value: "2.3 days", icon: <Clock className="h-4 w-4" />, change: "-68%" },
    { label: "Customer Satisfaction", value: "4.9/5", icon: <Star className="h-4 w-4" />, change: "+89%" },
    { label: "Security Score", value: "99.9%", icon: <Shield className="h-4 w-4" />, change: "A+" }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$99",
      period: "/month",
      description: "Perfect for small teams getting started",
      features: [
        "Up to 1,000 users",
        "Basic AI recommendations",
        "SMS verification",
        "Email support",
        "Basic analytics"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$299",
      period: "/month",
      description: "Ideal for growing businesses",
      features: [
        "Up to 10,000 users",
        "Advanced AI personalization",
        "Video onboarding",
        "Document generation",
        "Priority support",
        "Advanced analytics",
        "Custom workflows"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations with custom needs",
      features: [
        "Unlimited users",
        "Custom AI models",
        "White-label solution",
        "Dedicated support",
        "Custom integrations",
        "SLA guarantee",
        "On-premise option"
      ],
      popular: false
    }
  ];

  // Technology partners data
  const technologyPartners = [
    { 
      name: "Vonage", 
      logo: "V", 
      color: "from-blue-500 to-purple-600",
      title: "Multi-Channel Engagement",
      description: "Seamlessly connect with users through SMS, video, voice, and secure verification APIs, ensuring global reach and instant communication.",
      icon: MessageSquare
    },
    { 
      name: "Foxit", 
      logo: "F", 
      color: "from-red-500 to-orange-600",
      title: "Intelligent Document Automation",
      description: "Generate, validate, and deliver compliant onboarding documents in seconds with AI-enhanced PDF workflows.",
      icon: FileText
    },
    { 
      name: "MuleSoft", 
      logo: "M", 
      color: "from-green-500 to-blue-600",
      title: "API Orchestration at Scale",
      description: "Integrate legacy and modern systems into one onboarding flow with enterprise-grade connectors and orchestration.",
      icon: Network
    },
    { 
      name: "OpenAI", 
      logo: "AI", 
      color: "from-purple-500 to-pink-600",
      title: "Adaptive Intelligence",
      description: "Leverage cutting-edge AI to personalize onboarding journeys, predict drop-off risks, and automate engagement at scale.",
      icon: Brain
    }
  ];

  // Additional integration partners
  const integrationPartners = [
    { name: "Slack", logo: "S", color: "from-purple-500 to-pink-600" },
    { name: "Salesforce", logo: "SF", color: "from-blue-600 to-indigo-600" },
    { name: "HubSpot", logo: "H", color: "from-orange-500 to-red-600" },
    { name: "Zapier", logo: "Z", color: "from-yellow-500 to-orange-600" },
    { name: "Stripe", logo: "St", color: "from-indigo-500 to-purple-600" }
  ];

  const handleDemoControl = (action: 'play' | 'pause' | 'reset') => {
    switch (action) {
      case 'play':
        setIsDemoPlaying(true);
        break;
      case 'pause':
        setIsDemoPlaying(false);
        break;
      case 'reset':
        setCurrentDemoStep(0);
        setIsDemoPlaying(false);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="secondary" className="mb-4 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-200">
                <Sparkles className="h-3 w-3 mr-1" />
                AI-Powered Customer Onboarding
              </Badge>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Transform Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {" "}Customer Onboarding
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Reduce customer churn by 74% with our intelligent, multi-channel onboarding platform. 
              Secure, personalized, and data-driven experiences that convert.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setShowLiveDemo(true)}
              >
                <Play className="mr-2 h-4 w-4" />
                Live Demo
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dynamic Demo Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              See OnboardIQ in Action
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Watch how our AI-powered platform transforms the customer onboarding experience in real-time.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Demo Controls */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-6">
                <Button
                  onClick={() => handleDemoControl('play')}
                  disabled={isDemoPlaying}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Play Demo
                </Button>
                <Button
                  onClick={() => handleDemoControl('pause')}
                  disabled={!isDemoPlaying}
                  variant="outline"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
                <Button
                  onClick={() => handleDemoControl('reset')}
                  variant="outline"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>

              <div className="space-y-4">
                {demoSteps.map((step, index) => (
                  <motion.div
                    key={index}
                    className={`p-4 rounded-lg border-2 transition-all duration-500 ${
                      index === currentDemoStep 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 bg-gray-50'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${
                        index === currentDemoStep 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white' 
                          : 'bg-gray-200'
                      }`}>
                        {step.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{step.title}</h3>
                        <p className="text-sm text-gray-600">{step.description}</p>
                      </div>
                      {index === currentDemoStep && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-3 h-3 bg-blue-500 rounded-full"
                        />
                      )}
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{step.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className={`h-2 rounded-full bg-gradient-to-r ${step.color}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${step.progress}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Live Demo Preview */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden shadow-2xl">
                <CardHeader className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="text-sm">OnboardIQ Demo</div>
                    <div className="flex items-center gap-2">
                      <Signal className="h-4 w-4" />
                      <Wifi className="h-4 w-4" />
                      <Battery className="h-4 w-4" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-96 bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentDemoStep}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="text-center">
                          <motion.div
                            animate={{ 
                              rotate: isDemoPlaying ? 360 : 0,
                              scale: isDemoPlaying ? 1.1 : 1
                            }}
                            transition={{ 
                              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                              scale: { duration: 0.5 }
                            }}
                            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white mb-4 mx-auto"
                          >
                            {demoSteps[currentDemoStep].icon}
                          </motion.div>
                          <h3 className="text-xl font-semibold mb-2">
                            {demoSteps[currentDemoStep].title}
                          </h3>
                          <p className="text-gray-600 max-w-xs">
                            {demoSteps[currentDemoStep].description}
                          </p>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center justify-center mb-2">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-blue-100 mb-1">{stat.label}</div>
                <div className="text-sm text-green-300">{stat.change}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose OnboardIQ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built for modern businesses that demand security, personalization, and measurable results.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center mb-4">
                      {feature.description}
                    </CardDescription>
                    <div className="space-y-2">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by Customers Worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how OnboardIQ is transforming customer onboarding for businesses of all sizes.
            </p>
          </motion.div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
              >
                <Card className="border-0 shadow-xl">
                  <CardContent className="p-8">
                    <div className="text-center">
                      <Avatar className="w-16 h-16 mx-auto mb-4">
                        <AvatarImage src={testimonials[currentTestimonial].avatar} />
                        <AvatarFallback>
                          {testimonials[currentTestimonial].name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex justify-center mb-4">
                        {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <blockquote className="text-lg text-gray-700 mb-6 italic">
                        "{testimonials[currentTestimonial].content}"
                      </blockquote>
                      <div className="mb-4">
                        <div className="font-semibold text-gray-900">
                          {testimonials[currentTestimonial].name}
                        </div>
                        <div className="text-gray-600">
                          {testimonials[currentTestimonial].role} at {testimonials[currentTestimonial].company}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {Object.entries(testimonials[currentTestimonial].metrics).map(([key, value]) => (
                          <div key={key} className="text-center">
                            <div className="text-lg font-bold text-blue-600">{value}</div>
                            <div className="text-sm text-gray-600 capitalize">{key}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center mt-8 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Channels Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Multi-Channel Integration
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Seamlessly integrate with leading communication and document APIs for a complete onboarding solution.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {channels.map((channel, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                  <CardHeader className="text-center">
                    <div className={`mx-auto w-16 h-16 ${channel.color} rounded-full flex items-center justify-center text-white mb-4`}>
                      {channel.icon}
                    </div>
                    <CardTitle className="text-xl">{channel.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-base mb-4">
                      {channel.description}
                    </CardDescription>
                    <div className="space-y-2">
                      {channel.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your business needs. All plans include our core features.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full ${
                  plan.popular ? 'ring-2 ring-blue-500 relative' : ''
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-600 text-white">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="text-4xl font-bold text-gray-900">
                      {plan.price}
                      <span className="text-lg text-gray-600">{plan.period}</span>
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                          : ''
                      }`}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Partners */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powered by Industry-Leading Technology
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Trusted integrations that scale with your business
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {technologyPartners.map((partner, index) => (
              <motion.div
                key={partner.name}
                className="group"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="p-8 h-full hover:shadow-xl transition-all duration-300 bg-background/80 backdrop-blur-sm border-0 shadow-lg group-hover:border-primary/20">
                  <div className="flex flex-col space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${partner.color} flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform duration-300`}>
                        {partner.logo}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">{partner.title}</h3>
                        <p className="text-sm text-gray-600">{partner.name}</p>
                      </div>
                      <partner.icon className="w-8 h-8 text-gray-500 group-hover:text-primary transition-colors duration-300" />
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {partner.description}
                    </p>
                    <Button 
                      variant="outline" 
                      className="self-start group-hover:border-primary group-hover:text-primary transition-colors duration-300"
                    >
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Additional Integrations */}
          <div className="text-center">
            <p className="text-lg font-medium mb-6 text-gray-600">Plus seamless integration with</p>
            <div className="flex flex-wrap justify-center gap-6">
              {integrationPartners.map((partner, index) => (
                <motion.div
                  key={partner.name}
                  className="group"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="text-center">
                    <div className={`w-14 h-14 rounded-lg bg-gradient-to-r ${partner.color} flex items-center justify-center text-white font-bold text-sm group-hover:shadow-lg transition-all duration-300 mx-auto`}>
                      {partner.logo}
                    </div>
                    <p className="text-xs mt-2 text-gray-600">{partner.name}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Ready to Transform Your Onboarding?
          </motion.h2>
          <motion.p 
            className="text-xl text-blue-100 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Join thousands of businesses that have reduced customer churn and increased satisfaction with OnboardIQ.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Schedule Demo
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">OnboardIQ</h3>
              <p className="text-gray-400">
                AI-powered customer onboarding platform that reduces churn and increases satisfaction.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Features</li>
                <li>Pricing</li>
                <li>API Documentation</li>
                <li>Integrations</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About</li>
                <li>Blog</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Community</li>
                <li>Status</li>
                <li>Security</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 OnboardIQ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
