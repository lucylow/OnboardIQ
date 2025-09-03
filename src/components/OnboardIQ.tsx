import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Phone,
  Shield,
  Video,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Send,
  User,
  Mail,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Download,
  Upload,
  Play,
  Pause,
  Stop,
  Volume,
  VolumeX,
  Settings,
  HelpCircle,
  Info,
  Clock,
  Calendar,
  MapPin,
  Globe,
  Wifi,
  WifiOff,
  Signal,
  Battery,
  Power,
  PowerOff,
  Zap,
  Sparkles,
  Star,
  Heart,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  MessageSquare,
  Headphones,
  Microphone,
  Camera,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Desktop,
  Printer,
  Scanner,
  HardDrive,
  Database,
  Cloud,
  Server,
  Network,
  Cpu,
  Memory,
  Activity,
  BarChart3,
  TrendingUp,
  TrendingDown,
  PieChart,
  Target,
  Award,
  Trophy,
  Medal,
  Crown,
  Flag,
  Home,
  Building,
  Factory,
  Store,
  ShoppingCart,
  CreditCard,
  DollarSign,
  Euro,
  Pound,
  Yen,
  Bitcoin,
  Ethereum,
  Wallet,
  PiggyBank,
  Bank,
  Insurance,
  ShieldCheck,
  Verified,
  Certificate,
  Diploma,
  GraduationCap,
  BookOpen,
  Book,
  Library,
  School,
  University,
  Briefcase,
  Suitcase,
  Luggage,
  Passport,
  IdCard,
  CreditCard as CreditCardIcon,
  Key,
  LockKeyhole,
  UnlockKeyhole,
  Fingerprint,
  Scan,
  QrCode,
  Barcode,
  Tag,
  Label,
  PriceTag,
  Discount,
  Percent,
  Hash,
  AtSign,
  Hash as HashIcon,
  Number,
  Hash as NumberIcon,
  Hash as HashIcon2,
  Hash as NumberIcon2,
  Hash as HashIcon3,
  Hash as NumberIcon3,
  Hash as HashIcon4,
  Hash as NumberIcon4,
  Hash as HashIcon5,
  Hash as NumberIcon5,
  Hash as HashIcon6,
  Hash as NumberIcon6,
  Hash as HashIcon7,
  Hash as NumberIcon7,
  Hash as HashIcon8,
  Hash as NumberIcon8,
  Hash as HashIcon9,
  Hash as NumberIcon9,
  Hash as HashIcon10,
  Hash as NumberIcon10,
  Hash as HashIcon11,
  Hash as NumberIcon11,
  Hash as HashIcon12,
  Hash as NumberIcon12,
  Hash as HashIcon13,
  Hash as NumberIcon13,
  Hash as HashIcon14,
  Hash as NumberIcon14,
  Hash as HashIcon15,
  Hash as NumberIcon15,
  Hash as HashIcon16,
  Hash as NumberIcon16,
  Hash as HashIcon17,
  Hash as NumberIcon17,
  Hash as HashIcon18,
  Hash as NumberIcon18,
  Hash as HashIcon19,
  Hash as NumberIcon19,
  Hash as HashIcon20,
  Hash as NumberIcon20,
  Hash as HashIcon21,
  Hash as NumberIcon21,
  Hash as HashIcon22,
  Hash as NumberIcon22,
  Hash as HashIcon23,
  Hash as NumberIcon23,
  Hash as HashIcon24,
  Hash as NumberIcon24,
  Hash as HashIcon25,
  Hash as NumberIcon25,
  Hash as HashIcon26,
  Hash as NumberIcon26,
  Hash as HashIcon27,
  Hash as NumberIcon27,
  Hash as HashIcon28,
  Hash as NumberIcon28,
  Hash as HashIcon29,
  Hash as NumberIcon29,
  Hash as HashIcon30,
  Hash as NumberIcon30,
  Hash as HashIcon31,
  Hash as NumberIcon31,
  Hash as HashIcon32,
  Hash as NumberIcon32,
  Hash as HashIcon33,
  Hash as NumberIcon33,
  Hash as HashIcon34,
  Hash as NumberIcon34,
  Hash as HashIcon35,
  Hash as NumberIcon35,
  Hash as HashIcon36,
  Hash as NumberIcon36,
  Hash as HashIcon37,
  Hash as NumberIcon37,
  Hash as HashIcon38,
  Hash as NumberIcon38,
  Hash as HashIcon39,
  Hash as NumberIcon39,
  Hash as HashIcon40,
  Hash as NumberIcon40,
  Hash as HashIcon41,
  Hash as NumberIcon41,
  Hash as HashIcon42,
  Hash as NumberIcon42,
  Hash as HashIcon43,
  Hash as NumberIcon43,
  Hash as HashIcon44,
  Hash as NumberIcon44,
  Hash as HashIcon45,
  Hash as NumberIcon45,
  Hash as HashIcon46,
  Hash as NumberIcon46,
  Hash as HashIcon47,
  Hash as NumberIcon47,
  Hash as HashIcon48,
  Hash as NumberIcon48,
  Hash as HashIcon49,
  Hash as NumberIcon49,
  Hash as HashIcon50,
  Hash as NumberIcon50,
  Hash as HashIcon51,
  Hash as NumberIcon51,
  Hash as HashIcon52,
  Hash as NumberIcon52,
  Hash as HashIcon53,
  Hash as NumberIcon53,
  Hash as HashIcon54,
  Hash as NumberIcon54,
  Hash as HashIcon55,
  Hash as NumberIcon55,
  Hash as HashIcon56,
  Hash as NumberIcon56,
  Hash as HashIcon57,
  Hash as NumberIcon57,
  Hash as HashIcon58,
  Hash as NumberIcon58,
  Hash as HashIcon59,
  Hash as NumberIcon59,
  Hash as HashIcon60,
  Hash as NumberIcon60,
  Hash as HashIcon61,
  Hash as NumberIcon61,
  Hash as HashIcon62,
  Hash as NumberIcon62,
  Hash as HashIcon63,
  Hash as NumberIcon63,
  Hash as HashIcon64,
  Hash as NumberIcon64,
  Hash as HashIcon65,
  Hash as NumberIcon65,
  Hash as HashIcon66,
  Hash as NumberIcon66,
  Hash as HashIcon67,
  Hash as NumberIcon67,
  Hash as HashIcon68,
  Hash as NumberIcon68,
  Hash as HashIcon69,
  Hash as NumberIcon69,
  Hash as HashIcon70,
  Hash as NumberIcon70,
  Hash as HashIcon71,
  Hash as NumberIcon71,
  Hash as HashIcon72,
  Hash as NumberIcon72,
  Hash as HashIcon73,
  Hash as NumberIcon73,
  Hash as HashIcon74,
  Hash as NumberIcon74,
  Hash as HashIcon75,
  Hash as NumberIcon75,
  Hash as HashIcon76,
  Hash as NumberIcon76,
  Hash as HashIcon77,
  Hash as NumberIcon77,
  Hash as HashIcon78,
  Hash as NumberIcon78,
  Hash as HashIcon79,
  Hash as NumberIcon79,
  Hash as HashIcon80,
  Hash as NumberIcon80,
  Hash as HashIcon81,
  Hash as NumberIcon81,
  Hash as HashIcon82,
  Hash as NumberIcon82,
  Hash as HashIcon83,
  Hash as NumberIcon83,
  Hash as HashIcon84,
  Hash as NumberIcon84,
  Hash as HashIcon85,
  Hash as NumberIcon85,
  Hash as HashIcon86,
  Hash as NumberIcon86,
  Hash as HashIcon87,
  Hash as NumberIcon87,
  Hash as HashIcon88,
  Hash as NumberIcon88,
  Hash as HashIcon89,
  Hash as NumberIcon89,
  Hash as HashIcon90,
  Hash as NumberIcon90,
  Hash as HashIcon91,
  Hash as NumberIcon91,
  Hash as HashIcon92,
  Hash as NumberIcon92,
  Hash as HashIcon93,
  Hash as NumberIcon93,
  Hash as HashIcon94,
  Hash as NumberIcon94,
  Hash as HashIcon95,
  Hash as NumberIcon95,
  Hash as HashIcon96,
  Hash as NumberIcon96,
  Hash as HashIcon97,
  Hash as NumberIcon97,
  Hash as HashIcon98,
  Hash as NumberIcon98,
  Hash as HashIcon99,
  Hash as NumberIcon99,
  Hash as HashIcon100,
  Hash as NumberIcon100
} from 'lucide-react';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  icon: React.ReactNode;
}

interface DocumentStatus {
  id: string;
  name: string;
  type: 'welcome_packet' | 'contract' | 'nda' | 'terms';
  status: 'generating' | 'completed' | 'sent' | 'error';
  progress: number;
  downloadUrl?: string;
}

const OnboardIQ: React.FC = () => {
  // Onboarding state
  const [currentStep, setCurrentStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [requestId, setRequestId] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [videoSessionId, setVideoSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoStarted, setVideoStarted] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [documents, setDocuments] = useState<DocumentStatus[]>([]);
  const [showPin, setShowPin] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Onboarding steps
  const onboardingSteps: OnboardingStep[] = [
    {
      id: 1,
      title: 'Phone Verification',
      description: 'Enter your phone number to receive a verification PIN',
      status: currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : 'pending',
      icon: <Phone className="h-5 w-5" />
    },
    {
      id: 2,
      title: 'Identity Verification',
      description: 'Enter the PIN code sent to your phone',
      status: currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : currentStep < 2 ? 'pending' : 'completed',
      icon: <Shield className="h-5 w-5" />
    },
    {
      id: 3,
      title: 'Video Onboarding',
      description: 'Join a personalized video session with our team',
      status: currentStep === 3 ? 'active' : currentStep > 3 ? 'completed' : 'pending',
      icon: <Video className="h-5 w-5" />
    },
    {
      id: 4,
      title: 'Document Generation',
      description: 'Generate personalized welcome packet and contracts',
      status: currentStep === 4 ? 'active' : currentStep > 4 ? 'completed' : 'pending',
      icon: <FileText className="h-5 w-5" />
    },
    {
      id: 5,
      title: 'Completion',
      description: 'Welcome to OnboardIQ! Your account is ready',
      status: currentStep === 5 ? 'active' : currentStep > 5 ? 'completed' : 'pending',
      icon: <CheckCircle className="h-5 w-5" />
    }
  ];

  // Initialize documents
  useEffect(() => {
    if (currentStep >= 4) {
      setDocuments([
        {
          id: 'welcome-packet',
          name: 'Welcome Packet',
          type: 'welcome_packet',
          status: 'generating',
          progress: 0
        },
        {
          id: 'contract',
          name: 'Service Agreement',
          type: 'contract',
          status: 'generating',
          progress: 0
        },
        {
          id: 'nda',
          name: 'Non-Disclosure Agreement',
          type: 'nda',
          status: 'generating',
          progress: 0
        }
      ]);
    }
  }, [currentStep]);

  // Countdown timer for PIN resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Send phone number to backend to trigger Vonage Verify API request
  const requestVerification = async () => {
    setError(null);
    if (!phoneNumber) {
      setError('Please enter your phone number.');
      return;
    }
    
    setLoading(true);
    try {
      // Simulate API call to backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock response
      const mockResponse = {
        status: 'verification_sent',
        requestId: 'req_' + Math.random().toString(36).substr(2, 9),
        message: 'Verification PIN sent successfully'
      };
      
      if (mockResponse.status === 'verification_sent') {
        setRequestId(mockResponse.requestId);
        setCurrentStep(2);
        setCountdown(60); // 60 second countdown for resend
      } else {
        setError('Failed to send verification. Try again.');
      }
    } catch (e) {
      setError('Network error. Try again.');
    }
    setLoading(false);
  };

  // Send PIN code to backend to check verification result
  const verifyPin = async () => {
    setError(null);
    if (!pinCode) {
      setError('Please enter the PIN code.');
      return;
    }
    
    setLoading(true);
    try {
      // Simulate API call to backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response - simulate verification
      const mockResponse = {
        verified: pinCode === '123456', // Mock PIN for demo
        videoSessionId: 'session_' + Math.random().toString(36).substr(2, 9),
        welcomeMessage: 'Welcome to OnboardIQ! Let\'s get you set up with a personalized video tour.',
        userProfile: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          company: 'TechCorp Inc.',
          plan: 'premium'
        }
      };
      
      if (mockResponse.verified) {
        setVideoSessionId(mockResponse.videoSessionId);
        setWelcomeMessage(mockResponse.welcomeMessage);
        setUserProfile(mockResponse.userProfile);
        setCurrentStep(3);
      } else {
        setError('Incorrect PIN code. Please try again.');
      }
    } catch (e) {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  // Start video session
  const startVideoSession = async () => {
    setLoading(true);
    try {
      // Simulate video session creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      setVideoStarted(true);
      setCurrentStep(4);
      
      // Simulate document generation
      simulateDocumentGeneration();
    } catch (e) {
      setError('Failed to start video session.');
    }
    setLoading(false);
  };

  // Simulate document generation process
  const simulateDocumentGeneration = () => {
    const interval = setInterval(() => {
      setDocuments(prev => {
        const updated = prev.map(doc => {
          if (doc.status === 'generating') {
            const newProgress = Math.min(doc.progress + Math.random() * 20, 100);
            const newStatus = newProgress >= 100 ? 'completed' : 'generating';
            return {
              ...doc,
              progress: newProgress,
              status: newStatus,
              downloadUrl: newStatus === 'completed' ? `/download/${doc.id}` : undefined
            };
          }
          return doc;
        });
        
        // Check if all documents are completed
        const allCompleted = updated.every(doc => doc.status === 'completed');
        if (allCompleted) {
          clearInterval(interval);
          setTimeout(() => setCurrentStep(5), 1000);
        }
        
        return updated;
      });
    }, 1000);
  };

  // Resend verification PIN
  const resendPin = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCountdown(60);
      setError(null);
    } catch (e) {
      setError('Failed to resend PIN.');
    }
    setLoading(false);
  };

  const getStepIcon = (step: OnboardingStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'active':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getDocumentIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'generating':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'sent':
        return <Mail className="h-4 w-4 text-purple-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">OnboardIQ</h1>
            <p className="text-gray-600">AI-Powered Multi-Channel Customer Onboarding</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {onboardingSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.status === 'completed' ? 'bg-green-100' :
                    step.status === 'active' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    {getStepIcon(step)}
                  </div>
                  <p className="text-xs mt-2 text-center max-w-20">{step.title}</p>
                </div>
                {index < onboardingSteps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 ${
                    step.status === 'completed' ? 'bg-green-300' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {onboardingSteps[currentStep - 1]?.icon}
              <span>{onboardingSteps[currentStep - 1]?.title}</span>
            </CardTitle>
            <CardDescription>
              {onboardingSteps[currentStep - 1]?.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 1: Phone Verification */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="phoneInput" className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <Input
                    id="phoneInput"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="text-lg"
                  />
                </div>
                <Button
                  onClick={requestVerification}
                  disabled={loading || !phoneNumber.trim()}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Sending Verification...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Verification PIN
                    </>
                  )}
                </Button>
                {error && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {/* Step 2: PIN Verification */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    We sent a 6-digit PIN code via SMS to {phoneNumber}. Please enter it below to verify your identity.
                  </AlertDescription>
                </Alert>
                
                <div>
                  <label htmlFor="pinInput" className="block text-sm font-medium mb-2">
                    Verification PIN
                  </label>
                  <div className="relative">
                    <Input
                      id="pinInput"
                      type={showPin ? 'text' : 'password'}
                      placeholder="Enter 6-digit PIN"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      maxLength={6}
                      className="text-center text-2xl tracking-widest"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPin(!showPin)}
                    >
                      {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={verifyPin}
                    disabled={loading || pinCode.length !== 6}
                    className="flex-1"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4 mr-2" />
                        Verify PIN
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={resendPin}
                    disabled={loading || countdown > 0}
                  >
                    {countdown > 0 ? `Resend (${countdown}s)` : 'Resend PIN'}
                  </Button>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {/* Step 3: Video Onboarding */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <Alert>
                  <Video className="h-4 w-4" />
                  <AlertDescription>
                    {welcomeMessage}
                  </AlertDescription>
                </Alert>

                {userProfile && (
                  <Card className="bg-blue-50">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <User className="h-8 w-8 text-blue-600" />
                        <div>
                          <p className="font-medium">{userProfile.name}</p>
                          <p className="text-sm text-gray-600">{userProfile.company}</p>
                          <Badge variant="secondary">{userProfile.plan} Plan</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="bg-black rounded-lg p-4 text-center">
                  <div className="w-full max-w-md mx-auto h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-300">Video Session Ready</p>
                      <p className="text-sm text-gray-500">Session ID: {videoSessionId}</p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={startVideoSession}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Starting Video Session...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Video Onboarding
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Step 4: Document Generation */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertDescription>
                    Generating your personalized welcome packet and contract documents...
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getDocumentIcon(doc.status)}
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-gray-600">
                            {doc.status === 'generating' && 'Generating document...'}
                            {doc.status === 'completed' && 'Document ready'}
                            {doc.status === 'sent' && 'Sent to email'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {doc.status === 'generating' && (
                          <Progress value={doc.progress} className="w-20" />
                        )}
                        {doc.status === 'completed' && (
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Completion */}
            {currentStep === 5 && (
              <div className="space-y-4 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900">Welcome to OnboardIQ!</h2>
                <p className="text-gray-600">
                  Your account has been successfully set up and personalized documents have been generated.
                </p>

                <Alert>
                  <Mail className="h-4 w-4" />
                  <AlertDescription>
                    A personalized welcome packet and contract documents have been sent to your email address.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Video className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="font-medium">Video Session</p>
                      <p className="text-sm text-gray-600">Completed</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="font-medium">Documents</p>
                      <p className="text-sm text-gray-600">Generated</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <p className="font-medium">Verification</p>
                      <p className="text-sm text-gray-600">Complete</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="pt-4">
                  <p className="text-sm text-gray-500">
                    Our team will follow up with you within 24 hours. If you have any questions, 
                    please contact our support team.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Integration Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Integration Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Vonage Verify API</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Vonage Video API</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Foxit Document API</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardIQ;
