import React, { useState, useEffect } from 'react';
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
  Building
} from 'lucide-react';
import { vonageApi } from '@/services/vonageApi';

interface VerificationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  icon: React.ReactNode;
}

const VonageAuthentication: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [requestId, setRequestId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'started' | 'completed' | 'failed'>('idle');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [phoneInsights, setPhoneInsights] = useState<any>(null);
  const [simSwapStatus, setSimSwapStatus] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [securityLevel, setSecurityLevel] = useState<'basic' | 'enhanced' | 'enterprise'>('enhanced');

  const verificationSteps: VerificationStep[] = [
    {
      id: 'phone-validation',
      title: 'Phone Number Validation',
      description: 'Validating phone number format and carrier information',
      status: 'pending',
      icon: <Phone className="h-5 w-5" />
    },
    {
      id: 'sim-swap-check',
      title: 'SIM Swap Detection',
      description: 'Checking for recent SIM card changes',
      status: 'pending',
      icon: <Smartphone className="h-5 w-5" />
    },
    {
      id: 'verification-send',
      title: 'Send Verification Code',
      description: 'Sending secure verification code via SMS',
      status: 'pending',
      icon: <Shield className="h-5 w-5" />
    },
    {
      id: 'code-verification',
      title: 'Code Verification',
      description: 'Verifying the entered security code',
      status: 'pending',
      icon: <CheckCircle className="h-5 w-5" />
    }
  ];

  const [steps, setSteps] = useState(verificationSteps);

  // Enhanced phone number validation
  const validatePhoneNumber = async () => {
    if (!phoneNumber) {
      setError('Please enter a phone number');
      return false;
    }

    try {
      setIsLoading(true);
      setError('');
      
      const result = await vonageApi.getNumberInsights(phoneNumber, 'standard');
      setPhoneInsights(result);

      if (!result.valid) {
        setError('Invalid phone number format');
        return false;
      }

      // Update step status
      updateStepStatus(0, 'completed');
      setCurrentStep(1);
      return true;
    } catch (error) {
      setError(`Phone validation failed: ${(error as Error).message}`);
      updateStepStatus(0, 'failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // SIM Swap detection
  const checkSimSwap = async () => {
    try {
      setIsLoading(true);
      setError('');

      const simSwapRequest = {
        phone_number: phoneNumber,
        max_age: 24
      };

      const result = await vonageApi.checkSimSwap(simSwapRequest);
      setSimSwapStatus(result);

      if (result.isSimSwapped) {
        setError('⚠️ SIM swap detected! This may indicate a security risk.');
        updateStepStatus(1, 'failed');
        return false;
      }

      updateStepStatus(1, 'completed');
      setCurrentStep(2);
      return true;
    } catch (error) {
      setError(`SIM swap check failed: ${(error as Error).message}`);
      updateStepStatus(1, 'failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Start verification process
  const startVerification = async () => {
    try {
      setIsLoading(true);
      setError('');

      const verifyRequest = {
        phone_number: phoneNumber,
        brand: 'OnboardIQ',
        code_length: 6
      };

      const result = await vonageApi.startVerification(verifyRequest);
      
      if (result.requestId) {
        setRequestId(result.requestId);
        setVerificationStatus('started');
        updateStepStatus(2, 'completed');
        setCurrentStep(3);
        setSuccess('Verification code sent! Check your phone.');
      } else {
        throw new Error(result.message || 'Failed to start verification');
      }
    } catch (error) {
      setError(`Verification failed: ${(error as Error).message}`);
      updateStepStatus(2, 'failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Check verification code
  const checkVerification = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a 6-digit verification code');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const checkRequest = {
        request_id: requestId,
        code: verificationCode
      };

      const result = await vonageApi.checkVerification(checkRequest);
      
      if (result.verified) {
        setVerificationStatus('completed');
        updateStepStatus(3, 'completed');
        setSuccess('✅ Authentication successful! Welcome to OnboardIQ.');
      } else {
        throw new Error(result.message || 'Invalid verification code');
      }
    } catch (error) {
      setError(`Verification failed: ${(error as Error).message}`);
      updateStepStatus(3, 'failed');
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

  // Reset verification process
  const resetVerification = () => {
    setVerificationCode('');
    setRequestId('');
    setVerificationStatus('idle');
    setCurrentStep(0);
    setError('');
    setSuccess('');
    setPhoneInsights(null);
    setSimSwapStatus(null);
    setSteps(verificationSteps);
  };

  // Auto-advance through steps
  useEffect(() => {
    if (currentStep === 0 && phoneNumber && !isLoading) {
      validatePhoneNumber();
    } else if (currentStep === 1 && phoneInsights && !isLoading) {
      checkSimSwap();
    } else if (currentStep === 2 && !isLoading) {
      startVerification();
    }
  }, [currentStep, phoneNumber, phoneInsights]);

  const getStepIcon = (step: VerificationStep) => {
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

  const getStepColor = (step: VerificationStep) => {
    switch (step.status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'processing':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Enhanced Authentication</h1>
        <p className="text-gray-600">
          Secure your account with Vonage's advanced authentication features
        </p>
      </div>

      <Tabs defaultValue="authentication" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="authentication">Authentication</TabsTrigger>
          <TabsTrigger value="security">Security Analysis</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="authentication" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Multi-Factor Authentication
              </CardTitle>
              <CardDescription>
                Complete the verification process to secure your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Progress Steps */}
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all duration-300 ${getStepColor(step)}`}
                  >
                    <div className="flex-shrink-0">
                      {getStepIcon(step)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{step.title}</h3>
                      <p className="text-sm opacity-75">{step.description}</p>
                    </div>
                    {step.status === 'processing' && (
                      <Progress value={33} className="w-24" />
                    )}
                  </div>
                ))}
              </div>

              {/* Phone Number Input */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex gap-2">
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={currentStep > 0}
                    className="flex-1"
                  />
                  <Button
                    onClick={validatePhoneNumber}
                    disabled={!phoneNumber || isLoading}
                    className="w-24"
                  >
                    {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Validate'}
                  </Button>
                </div>
              </div>

              {/* Verification Code Input */}
              {verificationStatus === 'started' && (
                <div className="space-y-2">
                  <Label htmlFor="code">Verification Code</Label>
                  <div className="flex gap-2">
                    <Input
                      id="code"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      maxLength={6}
                      className="flex-1"
                    />
                    <Button
                      onClick={checkVerification}
                      disabled={!verificationCode || isLoading}
                      className="w-24"
                    >
                      {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Verify'}
                    </Button>
                  </div>
                </div>
              )}

              {/* Status Messages */}
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={resetVerification}
                  variant="outline"
                  className="flex-1"
                >
                  Reset
                </Button>
                <Button
                  onClick={() => window.location.href = '/dashboard'}
                  disabled={verificationStatus !== 'completed'}
                  className="flex-1"
                >
                  Continue to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phone Insights */}
            {phoneInsights && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Phone Number Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Country:</span>
                    <Badge variant="outline">{phoneInsights.country}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Carrier:</span>
                    <Badge variant="outline">{phoneInsights.carrier}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <Badge variant="outline">{phoneInsights.type}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Valid:</span>
                    <Badge variant={phoneInsights.valid ? "default" : "destructive"}>
                      {phoneInsights.valid ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Reachable:</span>
                    <Badge variant={phoneInsights.reachable ? "default" : "destructive"}>
                      {phoneInsights.reachable ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* SIM Swap Status */}
            {simSwapStatus && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    SIM Swap Detection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge variant={simSwapStatus.swapped ? "destructive" : "default"}>
                      {simSwapStatus.swapped ? 'Swapped' : 'No Swap Detected'}
                    </Badge>
                  </div>
                  {simSwapStatus.swappedAt && (
                    <div className="flex justify-between">
                      <span>Swapped At:</span>
                      <span className="text-sm text-gray-600">
                        {new Date(simSwapStatus.swappedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Request ID:</span>
                    <span className="text-xs text-gray-500 font-mono">
                      {simSwapStatus.requestId}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="security-level">Security Level</Label>
                <Select value={securityLevel} onValueChange={(value: any) => setSecurityLevel(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic (SMS only)</SelectItem>
                    <SelectItem value="enhanced">Enhanced (SMS + SIM Swap)</SelectItem>
                    <SelectItem value="enterprise">Enterprise (Full verification)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Backup Password</Label>
                <div className="flex gap-2">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter backup password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Security Features</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Two-Factor Authentication</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>SIM Swap Detection</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Phone Validation</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VonageAuthentication;
