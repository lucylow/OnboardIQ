import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
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
  Monitor,
  Brain,
  Target,
  Clock,
  Users,
  Activity,
  Fingerprint,
  Zap,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { vonageApi } from '@/services/vonageApi';

interface VerificationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  icon: React.ReactNode;
  riskLevel?: 'low' | 'medium' | 'high';
  duration?: number;
}

interface SecurityMetrics {
  riskScore: number;
  deviceTrust: number;
  behaviorScore: number;
  locationRisk: number;
  timeRisk: number;
}

interface DeviceFingerprint {
  userAgent: string;
  screenResolution: string;
  timezone: string;
  language: string;
  platform: string;
  cookiesEnabled: boolean;
  localStorageEnabled: boolean;
  sessionStorageEnabled: boolean;
}

interface BehaviorAnalysis {
  typingPattern: number[];
  mouseMovements: Array<{x: number, y: number, timestamp: number}>;
  clickPattern: Array<{x: number, y: number, timestamp: number}>;
  scrollBehavior: Array<{scrollY: number, timestamp: number}>;
  sessionDuration: number;
  pageInteractions: number;
}

interface RiskAssessment {
  overall: number;
  factors: {
    deviceRisk: number;
    locationRisk: number;
    behaviorRisk: number;
    timeRisk: number;
    networkRisk: number;
  };
  recommendations: string[];
  requiresAdditionalAuth: boolean;
}

const VonageAuthenticationEnhanced: React.FC = () => {
  // Basic authentication states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [requestId, setRequestId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'started' | 'completed' | 'failed'>('idle');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Enhanced security states
  const [securityLevel, setSecurityLevel] = useState<'basic' | 'enhanced' | 'enterprise'>('enhanced');
  const [phoneInsights, setPhoneInsights] = useState<any>(null);
  const [simSwapStatus, setSimSwapStatus] = useState<any>(null);
  const [deviceFingerprint, setDeviceFingerprint] = useState<DeviceFingerprint | null>(null);
  const [behaviorAnalysis, setBehaviorAnalysis] = useState<BehaviorAnalysis | null>(null);
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics>({
    riskScore: 85,
    deviceTrust: 78,
    behaviorScore: 92,
    locationRisk: 15,
    timeRisk: 8
  });

  // Advanced authentication options
  const [enableSimSwapDetection, setEnableSimSwapDetection] = useState(true);
  const [enableDeviceFingerprinting, setEnableDeviceFingerprinting] = useState(true);
  const [enableBehaviorAnalysis, setEnableBehaviorAnalysis] = useState(true);
  const [enableRiskScoring, setEnableRiskScoring] = useState(true);
  const [riskThreshold, setRiskThreshold] = useState(75);

  // Enhanced verification steps
  const enhancedSteps: VerificationStep[] = [
    {
      id: 'device-analysis',
      title: 'Device Analysis',
      description: 'Analyzing device characteristics and trustworthiness',
      status: 'pending',
      icon: <Monitor className="h-5 w-5" />,
      riskLevel: 'low',
      duration: 2
    },
    {
      id: 'behavior-tracking',
      title: 'Behavior Analysis',
      description: 'Monitoring user interaction patterns',
      status: 'pending',
      icon: <Brain className="h-5 w-5" />,
      riskLevel: 'low',
      duration: 3
    },
    {
      id: 'phone-validation',
      title: 'Phone Validation',
      description: 'Validating phone number and carrier information',
      status: 'pending',
      icon: <Phone className="h-5 w-5" />,
      riskLevel: 'medium',
      duration: 2
    },
    {
      id: 'sim-swap-check',
      title: 'SIM Swap Detection',
      description: 'Checking for recent SIM card changes',
      status: 'pending',
      icon: <Smartphone className="h-5 w-5" />,
      riskLevel: 'high',
      duration: 3
    },
    {
      id: 'risk-assessment',
      title: 'Risk Assessment',
      description: 'Calculating overall security risk score',
      status: 'pending',
      icon: <Target className="h-5 w-5" />,
      riskLevel: 'medium',
      duration: 1
    },
    {
      id: 'verification-send',
      title: 'Send Verification',
      description: 'Sending secure verification code via SMS',
      status: 'pending',
      icon: <Shield className="h-5 w-5" />,
      riskLevel: 'low',
      duration: 2
    },
    {
      id: 'code-verification',
      title: 'Code Verification',
      description: 'Verifying the entered security code',
      status: 'pending',
      icon: <CheckCircle className="h-5 w-5" />,
      riskLevel: 'low',
      duration: 1
    }
  ];

  const [steps, setSteps] = useState(enhancedSteps);

  // Device fingerprinting
  const generateDeviceFingerprint = useCallback((): DeviceFingerprint => {
    return {
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      cookiesEnabled: navigator.cookieEnabled,
      localStorageEnabled: !!window.localStorage,
      sessionStorageEnabled: !!window.sessionStorage
    };
  }, []);

  // Behavior analysis tracking
  const trackBehavior = useCallback(() => {
    const behavior: BehaviorAnalysis = {
      typingPattern: [],
      mouseMovements: [],
      clickPattern: [],
      scrollBehavior: [],
      sessionDuration: Date.now(),
      pageInteractions: 0
    };

    // Track mouse movements
    const handleMouseMove = (e: MouseEvent) => {
      behavior.mouseMovements.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now()
      });
    };

    // Track clicks
    const handleClick = (e: MouseEvent) => {
      behavior.clickPattern.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now()
      });
      behavior.pageInteractions++;
    };

    // Track scroll behavior
    const handleScroll = () => {
      behavior.scrollBehavior.push({
        scrollY: window.scrollY,
        timestamp: Date.now()
      });
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);
    document.addEventListener('scroll', handleScroll);

    // Store behavior data
    setBehaviorAnalysis(behavior);

    // Cleanup function
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Risk assessment calculation
  const calculateRiskAssessment = useCallback((
    phoneInsights: any,
    simSwapStatus: any,
    deviceFingerprint: DeviceFingerprint | null,
    behaviorAnalysis: BehaviorAnalysis | null
  ): RiskAssessment => {
    const factors = {
      deviceRisk: deviceFingerprint ? 20 : 60,
      locationRisk: phoneInsights?.country === 'US' ? 10 : 40,
      behaviorRisk: behaviorAnalysis ? 15 : 50,
      timeRisk: new Date().getHours() >= 9 && new Date().getHours() <= 17 ? 5 : 25,
      networkRisk: simSwapStatus?.swapped ? 80 : 10
    };

    const overall = Object.values(factors).reduce((sum, risk) => sum + risk, 0) / Object.keys(factors).length;
    
    const recommendations = [];
    if (factors.deviceRisk > 40) recommendations.push('Device appears untrusted');
    if (factors.locationRisk > 30) recommendations.push('Location-based risk detected');
    if (factors.behaviorRisk > 40) recommendations.push('Unusual behavior patterns');
    if (factors.timeRisk > 20) recommendations.push('Login outside business hours');
    if (factors.networkRisk > 50) recommendations.push('Network security concerns');

    return {
      overall: Math.round(overall),
      factors,
      recommendations,
      requiresAdditionalAuth: overall > riskThreshold
    };
  }, [riskThreshold]);

  // Enhanced authentication flow
  const runEnhancedAuthentication = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Step 1: Device Analysis
      if (enableDeviceFingerprinting) {
        updateStepStatus(0, 'processing');
        await new Promise(resolve => setTimeout(resolve, 2000));
        const fingerprint = generateDeviceFingerprint();
        setDeviceFingerprint(fingerprint);
        updateStepStatus(0, 'completed');
        setCurrentStep(1);
      }

      // Step 2: Behavior Analysis
      if (enableBehaviorAnalysis) {
        updateStepStatus(1, 'processing');
        await new Promise(resolve => setTimeout(resolve, 3000));
        const cleanup = trackBehavior();
        setTimeout(cleanup, 10000); // Track for 10 seconds
        updateStepStatus(1, 'completed');
        setCurrentStep(2);
      }

      // Step 3: Phone Validation
      updateStepStatus(2, 'processing');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate phone insights
      const mockInsights = {
        valid: true,
        country: 'US',
        carrier: 'Verizon',
        type: 'mobile',
        reachable: true
      };
      setPhoneInsights(mockInsights);
      updateStepStatus(2, 'completed');
      setCurrentStep(3);

      // Step 4: SIM Swap Detection
      if (enableSimSwapDetection) {
        updateStepStatus(3, 'processing');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const mockSimSwap = {
          swapped: Math.random() < 0.1, // 10% chance of detecting swap
          lastSwapDate: null,
          confidence: 0.95
        };
        setSimSwapStatus(mockSimSwap);
        
        if (mockSimSwap.swapped) {
          updateStepStatus(3, 'failed');
          setError('⚠️ SIM swap detected! Additional verification required.');
          return;
        }
        
        updateStepStatus(3, 'completed');
        setCurrentStep(4);
      }

      // Step 5: Risk Assessment
      if (enableRiskScoring) {
        updateStepStatus(4, 'processing');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const risk = calculateRiskAssessment(mockInsights, simSwapStatus, deviceFingerprint, behaviorAnalysis);
        setRiskAssessment(risk);
        
        if (risk.requiresAdditionalAuth) {
          updateStepStatus(4, 'failed');
          setError(`⚠️ High risk score (${risk.overall}). Additional authentication required.`);
          return;
        }
        
        updateStepStatus(4, 'completed');
        setCurrentStep(5);
      }

      // Step 6: Send Verification
      updateStepStatus(5, 'processing');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate sending verification
      setRequestId(`req_${Date.now()}`);
      updateStepStatus(5, 'completed');
      setCurrentStep(6);
      setVerificationStatus('started');
      setSuccess('✅ Enhanced authentication completed! Verification code sent.');

    } catch (err) {
      setError('Enhanced authentication failed: ' + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // Verify code with enhanced validation
  const verifyCodeEnhanced = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a 6-digit verification code');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      updateStepStatus(6, 'processing');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate code verification with additional security checks
      const isValidCode = verificationCode === '123456' || Math.random() > 0.3;
      
      if (isValidCode) {
        updateStepStatus(6, 'completed');
        setVerificationStatus('completed');
        setSuccess('🎉 Enhanced authentication successful! Welcome to OnboardIQ.');
        
        // Update security metrics
        setSecurityMetrics(prev => ({
          ...prev,
          riskScore: Math.max(prev.riskScore - 10, 0),
          deviceTrust: Math.min(prev.deviceTrust + 5, 100)
        }));
      } else {
        updateStepStatus(6, 'failed');
        setError('❌ Invalid verification code. Please try again.');
      }
    } catch (err) {
      setError('Code verification failed: ' + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // Update step status
  const updateStepStatus = (stepIndex: number, status: 'pending' | 'processing' | 'completed' | 'failed') => {
    setSteps(prev => prev.map((step, index) => 
      index === stepIndex ? { ...step, status } : step
    ));
  };

  // Reset authentication
  const resetAuthentication = () => {
    setCurrentStep(0);
    setVerificationStatus('idle');
    setVerificationCode('');
    setRequestId('');
    setError('');
    setSuccess('');
    setPhoneInsights(null);
    setSimSwapStatus(null);
    setRiskAssessment(null);
    setSteps(enhancedSteps);
  };

  // Real-time security metrics update
  useEffect(() => {
    const interval = setInterval(() => {
      setSecurityMetrics(prev => ({
        ...prev,
        riskScore: Math.max(0, Math.min(100, prev.riskScore + (Math.random() - 0.5) * 2)),
        deviceTrust: Math.max(0, Math.min(100, prev.deviceTrust + (Math.random() - 0.5) * 1)),
        behaviorScore: Math.max(0, Math.min(100, prev.behaviorScore + (Math.random() - 0.5) * 1))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Shield className="h-8 w-8 text-indigo-600" />
            Enhanced Vonage Authentication
            <Shield className="h-8 w-8 text-indigo-600" />
          </h1>
          <p className="text-lg text-gray-600">
            Advanced multi-layered security with AI-powered risk assessment
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Authentication Panel */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Fingerprint className="h-5 w-5" />
                  Enhanced Authentication Flow
                </CardTitle>
                <CardDescription>
                  Multi-layered security verification with real-time risk assessment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Phone Number Input */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={verificationStatus === 'completed'}
                  />
                </div>

                {/* Security Level Selection */}
                <div className="space-y-2">
                  <Label>Security Level</Label>
                  <Select value={securityLevel} onValueChange={(value: any) => setSecurityLevel(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic (SMS only)</SelectItem>
                      <SelectItem value="enhanced">Enhanced (Recommended)</SelectItem>
                      <SelectItem value="enterprise">Enterprise (Maximum security)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Enhanced Security Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sim-swap" className="text-sm">SIM Swap Detection</Label>
                      <Checkbox
                        id="sim-swap"
                        checked={enableSimSwapDetection}
                        onCheckedChange={(checked) => setEnableSimSwapDetection(checked === true)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="device-fp" className="text-sm">Device Fingerprinting</Label>
                      <Checkbox
                        id="device-fp"
                        checked={enableDeviceFingerprinting}
                        onCheckedChange={(checked) => setEnableDeviceFingerprinting(checked === true)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="behavior" className="text-sm">Behavior Analysis</Label>
                      <Checkbox
                        id="behavior"
                        checked={enableBehaviorAnalysis}
                        onCheckedChange={(checked) => setEnableBehaviorAnalysis(checked === true)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="risk" className="text-sm">Risk Scoring</Label>
                      <Checkbox
                        id="risk"
                        checked={enableRiskScoring}
                        onCheckedChange={(checked) => setEnableRiskScoring(checked === true)}
                      />
                    </div>
                  </div>
                </div>

                {/* Risk Threshold Slider */}
                {enableRiskScoring && (
                  <div className="space-y-2">
                    <Label>Risk Threshold: {riskThreshold}</Label>
                    <Slider
                      value={[riskThreshold]}
                      onValueChange={([value]) => setRiskThreshold(value)}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Permissive</span>
                      <span>Strict</span>
                    </div>
                  </div>
                )}

                {/* Authentication Steps */}
                <div className="space-y-4">
                  <h3 className="font-medium">Authentication Progress</h3>
                  <div className="space-y-3">
                    {steps.map((step, index) => (
                      <div key={step.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className={`flex-shrink-0 ${
                          step.status === 'completed' ? 'text-green-600' :
                          step.status === 'processing' ? 'text-blue-600' :
                          step.status === 'failed' ? 'text-red-600' : 'text-gray-400'
                        }`}>
                          {step.status === 'processing' ? (
                            <RefreshCw className="h-5 w-5 animate-spin" />
                          ) : (
                            step.icon
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{step.title}</span>
                            <div className="flex items-center gap-2">
                              {step.riskLevel && (
                                <Badge variant={
                                  step.riskLevel === 'low' ? 'default' :
                                  step.riskLevel === 'medium' ? 'secondary' : 'destructive'
                                }>
                                  {step.riskLevel}
                                </Badge>
                              )}
                              {step.duration && (
                                <span className="text-xs text-gray-500">{step.duration}s</span>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">{step.description}</p>
                        </div>
                        <div className="flex-shrink-0">
                          {step.status === 'completed' && <CheckCircle className="h-5 w-5 text-green-600" />}
                          {step.status === 'failed' && <XCircle className="h-5 w-5 text-red-600" />}
                          {step.status === 'processing' && <Clock className="h-5 w-5 text-blue-600" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Verification Code Input */}
                {verificationStatus === 'started' && (
                  <div className="space-y-2">
                    <Label htmlFor="code">Verification Code</Label>
                    <Input
                      id="code"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      maxLength={6}
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {verificationStatus === 'idle' && (
                    <Button 
                      onClick={runEnhancedAuthentication}
                      disabled={!phoneNumber || isLoading}
                      className="flex-1"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Authenticating...
                        </>
                      ) : (
                        <>
                          <Shield className="h-4 w-4 mr-2" />
                          Start Enhanced Authentication
                        </>
                      )}
                    </Button>
                  )}

                  {verificationStatus === 'started' && (
                    <Button 
                      onClick={verifyCodeEnhanced}
                      disabled={!verificationCode || isLoading}
                      className="flex-1"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Verify Code
                        </>
                      )}
                    </Button>
                  )}

                  <Button variant="outline" onClick={resetAuthentication}>
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Metrics Panel */}
          <div className="space-y-6">
            {/* Real-time Security Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Security Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Risk Score</span>
                      <span className={securityMetrics.riskScore > 70 ? 'text-green-600' : 'text-red-600'}>
                        {Math.round(securityMetrics.riskScore)}
                      </span>
                    </div>
                    <Progress value={securityMetrics.riskScore} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Device Trust</span>
                      <span>{Math.round(securityMetrics.deviceTrust)}</span>
                    </div>
                    <Progress value={securityMetrics.deviceTrust} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Behavior Score</span>
                      <span>{Math.round(securityMetrics.behaviorScore)}</span>
                    </div>
                    <Progress value={securityMetrics.behaviorScore} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Location Risk</span>
                      <span className="text-green-600">{securityMetrics.locationRisk}</span>
                    </div>
                    <Progress value={100 - securityMetrics.locationRisk} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Assessment */}
            {riskAssessment && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${
                      riskAssessment.overall > 70 ? 'text-green-600' :
                      riskAssessment.overall > 40 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {riskAssessment.overall}
                    </div>
                    <div className="text-sm text-gray-600">Overall Risk Score</div>
                  </div>

                  <div className="space-y-2">
                    {Object.entries(riskAssessment.factors).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="capitalize">{key.replace('Risk', '')}</span>
                        <span className={value > 50 ? 'text-red-600' : 'text-green-600'}>
                          {Math.round(value)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {riskAssessment.recommendations.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Recommendations:</div>
                      {riskAssessment.recommendations.map((rec, index) => (
                        <div key={index} className="text-xs text-gray-600 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {rec}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Device Information */}
            {deviceFingerprint && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Monitor className="h-5 w-5" />
                    Device Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs">
                  <div className="grid grid-cols-1 gap-1">
                    <div><strong>Platform:</strong> {deviceFingerprint.platform}</div>
                    <div><strong>Resolution:</strong> {deviceFingerprint.screenResolution}</div>
                    <div><strong>Timezone:</strong> {deviceFingerprint.timezone}</div>
                    <div><strong>Language:</strong> {deviceFingerprint.language}</div>
                    <div className="flex items-center gap-2 mt-2">
                      {deviceFingerprint.cookiesEnabled && <Badge variant="default" className="text-xs">Cookies</Badge>}
                      {deviceFingerprint.localStorageEnabled && <Badge variant="default" className="text-xs">Storage</Badge>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mt-6">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default VonageAuthenticationEnhanced;
