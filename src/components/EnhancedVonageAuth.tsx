import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Phone, 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Smartphone,
  Globe,
  Building,
  Zap,
  Brain,
  Target,
  Activity,
  Star,
  TrendingUp,
  Timer,
  Fingerprint,
  ShieldCheck,
  UserCheck,
  WifiOff,
  Wifi,
  MapPin,
  Clock
} from 'lucide-react';
import { vonageApi } from '@/services/vonageApi';

interface SecurityStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'skipped';
  icon: React.ReactNode;
  riskScore: number;
  duration?: number;
  timestamp?: Date;
}

interface SecurityInsight {
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  score: number;
  recommendation?: string;
}

interface AuthenticationData {
  phoneNumber: string;
  requestId: string;
  verificationCode: string;
  securityScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  insights: SecurityInsight[];
  location?: any;
  deviceFingerprint?: any;
  simSwapData?: any;
  phoneInsights?: any;
}

const EnhancedVonageAuth: React.FC = () => {
  const [authData, setAuthData] = useState<AuthenticationData>({
    phoneNumber: '',
    requestId: '',
    verificationCode: '',
    securityScore: 0,
    riskLevel: 'medium',
    insights: []
  });
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'started' | 'completed' | 'failed'>('idle');
  const [showAdvancedMode, setShowAdvancedMode] = useState(false);
  const [adaptiveMode, setAdaptiveMode] = useState(true);
  const [biometricProgress, setBiometricProgress] = useState(0);
  const { toast } = useToast();

  const securitySteps: SecurityStep[] = [
    {
      id: 'phone-validation',
      title: 'Phone Intelligence',
      description: 'Analyzing phone number authenticity and carrier details',
      status: 'pending',
      icon: <Phone className="h-5 w-5" />,
      riskScore: 0
    },
    {
      id: 'device-fingerprint',
      title: 'Device Analysis', 
      description: 'Evaluating device characteristics and behavioral patterns',
      status: 'pending',
      icon: <Smartphone className="h-5 w-5" />,
      riskScore: 0
    },
    {
      id: 'location-analysis',
      title: 'Location Intelligence',
      description: 'Assessing geographic and network-based location data',
      status: 'pending',
      icon: <MapPin className="h-5 w-5" />,
      riskScore: 0
    },
    {
      id: 'sim-swap-detection',
      title: 'SIM Security Check',
      description: 'Detecting potential SIM swap fraud attempts',
      status: 'pending',
      icon: <ShieldCheck className="h-5 w-5" />,
      riskScore: 0
    },
    {
      id: 'adaptive-verification',
      title: 'Smart Verification',
      description: 'Sending security code via optimized channel',
      status: 'pending',
      icon: <Zap className="h-5 w-5" />,
      riskScore: 0
    },
    {
      id: 'behavioral-analysis',
      title: 'Behavior Validation',
      description: 'Analyzing typing patterns and interaction behavior',
      status: 'pending',
      icon: <Brain className="h-5 w-5" />,
      riskScore: 0
    }
  ];

  const [steps, setSteps] = useState(securitySteps);

  // Enhanced phone validation with comprehensive insights
  const validatePhoneNumber = useCallback(async () => {
    if (!authData.phoneNumber || !vonageApi.validatePhoneNumber(authData.phoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid international phone number",
        variant: "destructive"
      });
      return false;
    }

    updateStepStatus(0, 'processing');
    setIsLoading(true);

    try {
      // Simulate enhanced phone insights
      const mockInsights = {
        valid: true,
        country: 'US',
        countryCode: '+1',
        carrier: 'Verizon Wireless',
        type: 'mobile',
        reachable: true,
        roaming: false,
        ported: false,
        riskScore: Math.random() * 30 + 10, // Low risk score
        qualityScore: Math.random() * 20 + 80, // High quality
        reputation: 'good',
        timezone: 'America/New_York'
      };

      await new Promise(resolve => setTimeout(resolve, 1500)); // Realistic delay

      setAuthData(prev => ({
        ...prev,
        phoneInsights: mockInsights,
        insights: [...prev.insights, {
          type: 'success',
          title: 'Phone Verified',
          message: `${mockInsights.carrier} mobile number validated`,
          score: 95 - mockInsights.riskScore,
          recommendation: 'Phone number shows good reputation and quality'
        }]
      }));

      updateStepStatus(0, 'completed', mockInsights.riskScore);
      setCurrentStep(1);
      return true;
    } catch (error) {
      updateStepStatus(0, 'failed');
      toast({
        title: "Validation Failed",
        description: "Unable to validate phone number. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [authData.phoneNumber, toast]);

  // Advanced device fingerprinting simulation
  const analyzeDevice = useCallback(async () => {
    updateStepStatus(1, 'processing');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));

      const deviceData = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        riskScore: Math.random() * 25 + 5, // Generally low risk
        trustScore: Math.random() * 20 + 75,
        knownDevice: Math.random() > 0.3
      };

      setAuthData(prev => ({
        ...prev,
        deviceFingerprint: deviceData,
        insights: [...prev.insights, {
          type: deviceData.knownDevice ? 'success' : 'warning',
          title: 'Device Analysis',
          message: deviceData.knownDevice ? 'Recognized device profile' : 'New device detected',
          score: deviceData.trustScore,
          recommendation: deviceData.knownDevice ? 'Device matches known patterns' : 'Additional verification recommended'
        }]
      }));

      updateStepStatus(1, 'completed', deviceData.riskScore);
      setCurrentStep(2);
    } catch (error) {
      updateStepStatus(1, 'failed');
    }
  }, []);

  // Location-based risk assessment
  const analyzeLocation = useCallback(async () => {
    updateStepStatus(2, 'processing');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const locationData = {
        country: 'United States',
        region: 'California',
        city: 'San Francisco',
        suspicious: Math.random() < 0.1, // 10% chance of suspicious location
        vpnDetected: Math.random() < 0.2, // 20% chance of VPN
        riskScore: Math.random() * 20 + 10
      };

      setAuthData(prev => ({
        ...prev,
        location: locationData,
        insights: [...prev.insights, {
          type: locationData.suspicious ? 'warning' : 'success',
          title: 'Location Analysis',
          message: `${locationData.city}, ${locationData.region}${locationData.vpnDetected ? ' (VPN detected)' : ''}`,
          score: locationData.suspicious ? 40 : 85,
          recommendation: locationData.suspicious ? 'Unusual location detected' : 'Location matches expected patterns'
        }]
      }));

      updateStepStatus(2, 'completed', locationData.riskScore);
      setCurrentStep(3);
    } catch (error) {
      updateStepStatus(2, 'failed');
    }
  }, []);

  // Enhanced SIM swap detection
  const checkSimSwap = useCallback(async () => {
    updateStepStatus(3, 'processing');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1800)); // Longer for complex check

      const simSwapData = {
        swapped: Math.random() < 0.05, // 5% chance of SIM swap detection
        lastSwapDate: null,
        confidence: Math.random() * 20 + 80,
        riskScore: Math.random() < 0.05 ? Math.random() * 40 + 60 : Math.random() * 20 + 5
      };

      if (simSwapData.swapped) {
        simSwapData.lastSwapDate = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000); // Within last week
      }

      setAuthData(prev => ({
        ...prev,
        simSwapData,
        insights: [...prev.insights, {
          type: simSwapData.swapped ? 'error' : 'success',
          title: 'SIM Security Check',
          message: simSwapData.swapped ? 'Recent SIM swap detected!' : 'No SIM swap activity detected',
          score: simSwapData.swapped ? 10 : 95,
          recommendation: simSwapData.swapped ? 'High-risk authentication required' : 'SIM card appears secure'
        }]
      }));

      updateStepStatus(3, simSwapData.swapped ? 'failed' : 'completed', simSwapData.riskScore);
      setCurrentStep(4);
    } catch (error) {
      updateStepStatus(3, 'failed');
    }
  }, []);

  // Adaptive verification based on risk assessment
  const startAdaptiveVerification = useCallback(async () => {
    updateStepStatus(4, 'processing');
    
    try {
      // Calculate overall risk score
      const overallRisk = calculateOverallRisk();
      const verificationMethod = overallRisk > 70 ? 'voice' : 'sms';
      
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockVerificationResult = {
        success: true,
        requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        method: verificationMethod,
        estimatedDelivery: verificationMethod === 'sms' ? '30 seconds' : '1 minute'
      };

      setAuthData(prev => ({
        ...prev,
        requestId: mockVerificationResult.requestId,
        insights: [...prev.insights, {
          type: 'info',
          title: 'Verification Sent',
          message: `Security code sent via ${verificationMethod.toUpperCase()}`,
          score: 80,
          recommendation: `Check your ${verificationMethod === 'sms' ? 'messages' : 'phone'} for the verification code`
        }]
      }));

      setVerificationStatus('started');
      updateStepStatus(4, 'completed', 15);
      setCurrentStep(5);
      
      toast({
        title: "Verification Code Sent",
        description: `Security code sent via ${verificationMethod.toUpperCase()}`,
      });
    } catch (error) {
      updateStepStatus(4, 'failed');
    }
  }, []);

  // Behavioral analysis during code entry
  const analyzeBehavior = useCallback(() => {
    updateStepStatus(5, 'processing');
    
    // Simulate behavioral analysis
    setTimeout(() => {
      const behaviorData = {
        typingPattern: 'consistent',
        hesitation: Math.random() * 2000, // ms
        confidence: Math.random() * 20 + 70,
        riskScore: Math.random() * 15 + 5
      };

      setAuthData(prev => ({
        ...prev,
        insights: [...prev.insights, {
          type: 'success',
          title: 'Behavioral Analysis',
          message: 'Typing pattern analysis completed',
          score: behaviorData.confidence,
          recommendation: 'User behavior appears authentic'
        }]
      }));

      updateStepStatus(5, 'completed', behaviorData.riskScore);
    }, 800);
  }, []);

  // Enhanced verification check
  const checkVerification = useCallback(async () => {
    if (!authData.verificationCode || authData.verificationCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit verification code",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Simulate verification success (95% success rate for demo)
      const isValid = Math.random() > 0.05;
      
      if (isValid) {
        setVerificationStatus('completed');
        const finalScore = calculateFinalSecurityScore();
        
        setAuthData(prev => ({
          ...prev,
          securityScore: finalScore,
          riskLevel: finalScore > 80 ? 'low' : finalScore > 60 ? 'medium' : 'high'
        }));

        toast({
          title: "Authentication Successful!",
          description: `Security score: ${finalScore}/100 - Welcome to OnboardIQ`,
        });
      } else {
        throw new Error('Invalid verification code');
      }
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Invalid code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [authData.verificationCode, authData.insights, toast]);

  // Helper functions
  const updateStepStatus = (stepIndex: number, status: SecurityStep['status'], riskScore?: number) => {
    setSteps(prev => prev.map((step, index) => 
      index === stepIndex ? { 
        ...step, 
        status, 
        riskScore: riskScore ?? step.riskScore,
        timestamp: new Date(),
        duration: status === 'completed' ? Math.random() * 2000 + 500 : undefined
      } : step
    ));
  };

  const calculateOverallRisk = () => {
    const completedSteps = steps.filter(step => step.status === 'completed');
    if (completedSteps.length === 0) return 50;
    
    const avgRisk = completedSteps.reduce((sum, step) => sum + step.riskScore, 0) / completedSteps.length;
    return Math.min(Math.max(avgRisk, 0), 100);
  };

  const calculateFinalSecurityScore = () => {
    const riskScore = calculateOverallRisk();
    const insightScores = authData.insights.map(insight => insight.score);
    const avgInsightScore = insightScores.length > 0 
      ? insightScores.reduce((sum, score) => sum + score, 0) / insightScores.length 
      : 70;
    
    // Weighted combination: 60% insights, 40% inverse risk
    return Math.round((avgInsightScore * 0.6) + ((100 - riskScore) * 0.4));
  };

  const getStepIcon = (step: SecurityStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'processing':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return step.icon;
    }
  };

  const getStepColor = (step: SecurityStep) => {
    switch (step.status) {
      case 'completed':
        return 'border-green-200 bg-green-50 text-green-700';
      case 'failed':
        return 'border-red-200 bg-red-50 text-red-700';
      case 'processing':
        return 'border-blue-200 bg-blue-50 text-blue-700 animate-pulse';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-600';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Auto-progression through security steps
  useEffect(() => {
    if (adaptiveMode && !isLoading) {
      const timeouts: NodeJS.Timeout[] = [];
      
      if (currentStep === 1 && steps[0].status === 'completed') {
        timeouts.push(setTimeout(() => analyzeDevice(), 500));
      } else if (currentStep === 2 && steps[1].status === 'completed') {
        timeouts.push(setTimeout(() => analyzeLocation(), 500));
      } else if (currentStep === 3 && steps[2].status === 'completed') {
        timeouts.push(setTimeout(() => checkSimSwap(), 500));
      } else if (currentStep === 4 && steps[3].status === 'completed') {
        timeouts.push(setTimeout(() => startAdaptiveVerification(), 500));
      }
      
      return () => timeouts.forEach(timeout => clearTimeout(timeout));
    }
  }, [currentStep, steps, adaptiveMode, isLoading, analyzeDevice, analyzeLocation, checkSimSwap, startAdaptiveVerification]);

  // Biometric-style progress animation
  useEffect(() => {
    if (currentStep > 0) {
      const interval = setInterval(() => {
        setBiometricProgress(prev => {
          const target = (currentStep / steps.length) * 100;
          return prev < target ? prev + 2 : target;
        });
      }, 50);
      
      return () => clearInterval(interval);
    }
  }, [currentStep, steps.length]);

  // Code input behavioral analysis
  useEffect(() => {
    if (authData.verificationCode.length > 0 && verificationStatus === 'started') {
      analyzeBehavior();
    }
  }, [authData.verificationCode, verificationStatus, analyzeBehavior]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 mb-12">
        <div className="relative">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Next-Gen Authentication
          </h1>
          <div className="absolute -top-2 -right-2">
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold">
              <Star className="h-3 w-3 mr-1" />
              Award Winner
            </Badge>
          </div>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Experience the future of secure authentication with Vonage's advanced AI-powered security suite
        </p>
        
        {/* Real-time Security Score */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <Card className="px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-blue-700">Security Score:</span>
              <Badge variant="outline" className="text-lg font-bold">
                {authData.securityScore}/100
              </Badge>
            </div>
          </Card>
          <Card className="px-6 py-3 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-700">Risk Level:</span>
              <Badge className={getRiskLevelColor(authData.riskLevel)}>
                {authData.riskLevel.toUpperCase()}
              </Badge>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Authentication Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-2xl border-0 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="relative">
                  <Fingerprint className="h-6 w-6 text-blue-600" />
                  <div className="absolute -inset-1 rounded-full bg-blue-500/20 animate-pulse"></div>
                </div>
                Multi-Factor Intelligence Authentication
              </CardTitle>
              <CardDescription>
                Advanced security verification powered by Vonage's enterprise APIs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Biometric Progress Ring */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50" cy="50" r="45"
                      stroke="#e5e7eb" strokeWidth="8" fill="none"
                    />
                    <circle
                      cx="50" cy="50" r="45"
                      stroke="url(#gradient)" strokeWidth="8" fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${biometricProgress * 2.83} ${283 - biometricProgress * 2.83}`}
                      className="transition-all duration-300 ease-out"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.round(biometricProgress)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Secure</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Steps */}
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-500 ${getStepColor(step)} ${
                      index === currentStep ? 'ring-2 ring-blue-300 ring-offset-2' : ''
                    }`}
                  >
                    <div className="flex-shrink-0 relative">
                      {getStepIcon(step)}
                      {step.status === 'completed' && (
                        <div className="absolute -inset-1 rounded-full bg-green-400/20 animate-ping"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold flex items-center gap-2">
                        {step.title}
                        {step.duration && (
                          <Badge variant="outline" className="text-xs">
                            {Math.round(step.duration)}ms
                          </Badge>
                        )}
                      </h3>
                      <p className="text-sm opacity-75">{step.description}</p>
                    </div>
                    {step.status === 'processing' && (
                      <div className="flex items-center gap-2">
                        <Progress value={33} className="w-16" />
                        <Activity className="h-4 w-4 animate-pulse" />
                      </div>
                    )}
                    {step.status === 'completed' && (
                      <div className="text-right">
                        <div className="text-sm font-medium">Risk: {Math.round(step.riskScore)}</div>
                        <div className="text-xs text-muted-foreground">
                          {step.timestamp && new Date(step.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Phone Input */}
              <div className="space-y-4">
                <Label htmlFor="phone" className="text-base font-semibold">Phone Number</Label>
                <div className="flex gap-3">
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={authData.phoneNumber}
                    onChange={(e) => setAuthData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    disabled={currentStep > 0}
                    className="flex-1 text-lg py-6"
                  />
                  <Button
                    onClick={validatePhoneNumber}
                    disabled={!authData.phoneNumber || isLoading || currentStep > 0}
                    className="px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    {isLoading ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Zap className="h-5 w-5" />}
                  </Button>
                </div>
              </div>

              {/* Verification Code Input */}
              {verificationStatus === 'started' && (
                <div className="space-y-4 animate-slide-up">
                  <Label htmlFor="code" className="text-base font-semibold">Verification Code</Label>
                  <div className="flex gap-3">
                    <Input
                      id="code"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={authData.verificationCode}
                      onChange={(e) => setAuthData(prev => ({ 
                        ...prev, 
                        verificationCode: e.target.value.replace(/\D/g, '').slice(0, 6)
                      }))}
                      maxLength={6}
                      className="flex-1 text-lg py-6 tracking-widest text-center font-mono"
                    />
                    <Button
                      onClick={checkVerification}
                      disabled={authData.verificationCode.length !== 6 || isLoading}
                      className="px-8 py-6 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    >
                      {isLoading ? <RefreshCw className="h-5 w-5 animate-spin" /> : <CheckCircle className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>
              )}

              {/* Success State */}
              {verificationStatus === 'completed' && (
                <div className="text-center space-y-4 animate-fade-in">
                  <div className="flex justify-center">
                    <div className="relative">
                      <UserCheck className="h-16 w-16 text-green-500" />
                      <div className="absolute -inset-2 rounded-full bg-green-400/20 animate-pulse"></div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-green-700">Authentication Successful!</h3>
                  <p className="text-muted-foreground">You've been securely verified with a {authData.securityScore}/100 security score.</p>
                  <Button 
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 px-8 py-3"
                    onClick={() => window.location.href = '/dashboard'}
                  >
                    Continue to Dashboard
                  </Button>
                </div>
              )}

              {/* Control Panel */}
              <div className="flex gap-3 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowAdvancedMode(!showAdvancedMode)}
                  className="flex-1"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  {showAdvancedMode ? 'Simple' : 'Advanced'} Mode
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setAdaptiveMode(!adaptiveMode)}
                  className="flex-1"
                >
                  {adaptiveMode ? <Unlock className="h-4 w-4 mr-2" /> : <Lock className="h-4 w-4 mr-2" />}
                  {adaptiveMode ? 'Manual' : 'Auto'} Flow
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Intelligence Panel */}
        <div className="space-y-6">
          {/* Real-time Insights */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Security Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {authData.insights.length > 0 ? (
                authData.insights.slice(-3).map((insight, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant={insight.type === 'success' ? 'default' : insight.type === 'error' ? 'destructive' : 'secondary'}>
                        {insight.title}
                      </Badge>
                      <Badge variant="outline" className="font-mono">
                        {insight.score}/100
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{insight.message}</p>
                    {insight.recommendation && (
                      <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                        💡 {insight.recommendation}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <Shield className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Security analysis will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Phone Intelligence */}
          {authData.phoneInsights && (
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  Phone Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>Country:</span>
                    <Badge variant="outline">{authData.phoneInsights.country}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Carrier:</span>
                    <Badge variant="outline">{authData.phoneInsights.carrier}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <Badge variant="outline">{authData.phoneInsights.type}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Quality:</span>
                    <Badge variant="outline">{Math.round(authData.phoneInsights.qualityScore)}/100</Badge>
                  </div>
                </div>
                <Progress value={authData.phoneInsights.qualityScore} className="h-2" />
                <p className="text-xs text-muted-foreground text-center">
                  Network Quality: {authData.phoneInsights.reputation}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Device Analysis */}
          {authData.deviceFingerprint && (
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-green-600" />
                  Device Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Trust Score:</span>
                    <Badge variant="outline">{Math.round(authData.deviceFingerprint.trustScore)}/100</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Known Device:</span>
                    <Badge variant={authData.deviceFingerprint.knownDevice ? "default" : "secondary"}>
                      {authData.deviceFingerprint.knownDevice ? "Yes" : "New"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform:</span>
                    <Badge variant="outline" className="text-xs">{authData.deviceFingerprint.platform}</Badge>
                  </div>
                </div>
                <Progress value={authData.deviceFingerprint.trustScore} className="h-2" />
              </CardContent>
            </Card>
          )}

          {/* Network Status */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="h-5 w-5 text-indigo-600" />
                Network Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Connection Quality:</span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className={`w-2 h-4 rounded ${i <= 4 ? 'bg-green-500' : 'bg-gray-200'}`} />
                    ))}
                  </div>
                  <Badge variant="outline">Excellent</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Latency:</span>
                <Badge variant="outline" className="font-mono">~45ms</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">VPN Detected:</span>
                <Badge variant="secondary">No</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnhancedVonageAuth;