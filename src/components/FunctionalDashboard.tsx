import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { 
  User, 
  MessageSquare, 
  Shield, 
  FileText, 
  TrendingUp, 
  Bot,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

// Import API services
import { authAPI, onboardingAPI, aiAPI, documentsAPI, apiUtils } from '@/services/api';

interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  planTier: string;
  companySize: string;
  industry: string;
  role: string;
}

interface OnboardingStatus {
  status: string;
  progress: number;
  currentStep: string;
  nextStep: string;
  estimatedCompletion: string;
}

interface AIInsights {
  userSegment: string;
  successProbability: number;
  churnRisk: string;
  recommendations: string[];
}

const FunctionalDashboard: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [onboardingStatus, setOnboardingStatus] = useState<OnboardingStatus | null>(null);
  const [aiInsights, setAiInsights] = useState<AIInsights | null>(null);
  const [backendHealth, setBackendHealth] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Form states
  const [signupForm, setSignupForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    companyName: '',
    planTier: 'premium',
    companySize: '11-50',
    industry: 'Technology',
    role: 'Manager'
  });

  const [messageForm, setMessageForm] = useState({
    message: '',
    channels: ['email', 'sms']
  });

  // Check backend health on component mount
  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      setIsLoading(true);
      const health = await apiUtils.checkBackendHealth();
      setBackendHealth(health);
      toast({
        title: "Backend Connected",
        description: "Successfully connected to OnboardIQ backend",
      });
    } catch (error) {
      console.error('Backend health check failed:', error);
      toast({
        title: "Backend Error",
        description: "Unable to connect to backend. Please check if the server is running.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    try {
      setIsLoading(true);
      const response = await authAPI.signup(signupForm);
      
      if (response.token) {
        localStorage.setItem('onboardiq_token', response.token);
        setUserData(signupForm);
        
        // Get AI insights after signup
        const insights = await aiAPI.classifyUser(signupForm);
        setAiInsights(insights);
        
        toast({
          title: "Signup Successful",
          description: `Welcome ${signupForm.firstName}! AI has analyzed your profile.`,
        });
      }
    } catch (error: any) {
      const errorInfo = apiUtils.handleError(error);
      toast({
        title: "Signup Failed",
        description: errorInfo.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startOnboarding = async () => {
    try {
      setIsLoading(true);
      const response = await onboardingAPI.startWorkflow();
      
      setOnboardingStatus({
        status: 'in_progress',
        progress: 0,
        currentStep: 'Welcome',
        nextStep: 'Profile Setup',
        estimatedCompletion: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      });
      
      toast({
        title: "Onboarding Started",
        description: "AI-powered onboarding workflow initiated",
      });
    } catch (error: any) {
      const errorInfo = apiUtils.handleError(error);
      toast({
        title: "Onboarding Failed",
        description: errorInfo.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendMultiChannelMessage = async () => {
    try {
      setIsLoading(true);
      const response = await onboardingAPI.initiateCommunication({
        channels: messageForm.channels,
        message: messageForm.message,
        options: { priority: 'high' }
      });
      
      toast({
        title: "Message Sent",
        description: `Message sent via ${messageForm.channels.join(', ')}`,
      });
      
      setMessageForm({ message: '', channels: ['email', 'sms'] });
    } catch (error: any) {
      const errorInfo = apiUtils.handleError(error);
      toast({
        title: "Message Failed",
        description: errorInfo.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateDocument = async () => {
    try {
      setIsLoading(true);
      const response = await documentsAPI.generatePersonalized({
        documentType: 'welcome_packet',
        userData: userData,
        personalizationData: {
          companyName: userData?.companyName,
          industry: userData?.industry
        }
      });
      
      toast({
        title: "Document Generated",
        description: "AI-powered personalized document created successfully",
      });
    } catch (error: any) {
      const errorInfo = apiUtils.handleError(error);
      toast({
        title: "Document Generation Failed",
        description: errorInfo.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const assessSecurity = async () => {
    try {
      setIsLoading(true);
      const response = await aiAPI.assessSecurity({
        userData: userData,
        behaviorData: {
          loginTime: new Date().toISOString(),
          ipAddress: '192.168.1.1',
          userAgent: navigator.userAgent
        }
      });
      
      toast({
        title: "Security Assessment Complete",
        description: `Risk Level: ${response.riskAssessment.riskLevel}`,
      });
    } catch (error: any) {
      const errorInfo = apiUtils.handleError(error);
      toast({
        title: "Security Assessment Failed",
        description: errorInfo.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">OnboardIQ Dashboard</h1>
          <p className="text-gray-600">AI-Powered Multi-Channel Customer Onboarding</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={backendHealth ? "default" : "destructive"}>
            {backendHealth ? "Backend Connected" : "Backend Disconnected"}
          </Badge>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={checkBackendHealth}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="signup">User Signup</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="ai">AI Features</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">User Profile</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userData ? "Active" : "Not Set"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {userData ? `${userData.firstName} ${userData.lastName}` : "No user data"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Onboarding Status</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {onboardingStatus ? `${onboardingStatus.progress}%` : "Not Started"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {onboardingStatus ? onboardingStatus.currentStep : "Ready to start"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Segment</CardTitle>
                <Bot className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {aiInsights ? aiInsights.userSegment : "Pending"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {aiInsights ? `${(aiInsights.successProbability * 100).toFixed(1)}% success rate` : "AI analysis needed"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Security Status</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {aiInsights ? aiInsights.churnRisk : "Not Assessed"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Risk assessment pending
                </p>
              </CardContent>
            </Card>
          </div>

          {onboardingStatus && (
            <Card>
              <CardHeader>
                <CardTitle>Onboarding Progress</CardTitle>
                <CardDescription>AI-powered workflow progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{onboardingStatus.progress}%</span>
                  </div>
                  <Progress value={onboardingStatus.progress} className="w-full" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Current Step:</span> {onboardingStatus.currentStep}
                  </div>
                  <div>
                    <span className="font-medium">Next Step:</span> {onboardingStatus.nextStep}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {aiInsights && (
            <Card>
              <CardHeader>
                <CardTitle>AI Insights & Recommendations</CardTitle>
                <CardDescription>Personalized recommendations based on AI analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>User Segment</Label>
                    <div className="text-lg font-semibold">{aiInsights.userSegment}</div>
                  </div>
                  <div>
                    <Label>Success Probability</Label>
                    <div className="text-lg font-semibold">{(aiInsights.successProbability * 100).toFixed(1)}%</div>
                  </div>
                  <div>
                    <Label>Churn Risk</Label>
                    <div className="text-lg font-semibold">{aiInsights.churnRisk}</div>
                  </div>
                </div>
                <div>
                  <Label>Recommendations</Label>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    {aiInsights.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm">{rec}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="signup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Registration with AI Profiling</CardTitle>
              <CardDescription>Create a new user account with AI-powered segmentation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={signupForm.firstName}
                    onChange={(e) => setSignupForm({...signupForm, firstName: e.target.value})}
                    placeholder="Enter your first name"
                    className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={signupForm.lastName}
                    onChange={(e) => setSignupForm({...signupForm, lastName: e.target.value})}
                    placeholder="Enter your last name"
                    className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                  placeholder="Enter your email address"
                  className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={signupForm.phoneNumber}
                  onChange={(e) => setSignupForm({...signupForm, phoneNumber: e.target.value})}
                  placeholder="Enter your phone number (+1234567890)"
                  className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={signupForm.companyName}
                  onChange={(e) => setSignupForm({...signupForm, companyName: e.target.value})}
                  placeholder="Enter your company name"
                  className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="planTier">Plan Tier</Label>
                  <select
                    id="planTier"
                    value={signupForm.planTier}
                    onChange={(e) => setSignupForm({...signupForm, planTier: e.target.value})}
                    className="w-full p-2 border rounded"
                  >
                    <option value="free">Free</option>
                    <option value="premium">Premium</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companySize">Company Size</Label>
                  <select
                    id="companySize"
                    value={signupForm.companySize}
                    onChange={(e) => setSignupForm({...signupForm, companySize: e.target.value})}
                    className="w-full p-2 border rounded"
                  >
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-200">51-200</option>
                    <option value="201+">201+</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <select
                    id="industry"
                    value={signupForm.industry}
                    onChange={(e) => setSignupForm({...signupForm, industry: e.target.value})}
                    className="w-full p-2 border rounded"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Finance">Finance</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Retail">Retail</option>
                  </select>
                </div>
              </div>

              <Button 
                onClick={handleSignup} 
                disabled={isLoading || !signupForm.email || !signupForm.firstName}
                className="w-full"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Create Account with AI Profiling
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="onboarding" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Onboarding Workflow</CardTitle>
              <CardDescription>Start and manage the intelligent onboarding process</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-4">
                <Button 
                  onClick={startOnboarding} 
                  disabled={isLoading || !userData}
                  className="flex-1"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Start Onboarding Workflow
                </Button>
                <Button 
                  onClick={generateDocument} 
                  disabled={isLoading || !userData}
                  variant="outline"
                >
                  Generate Welcome Document
                </Button>
                <Button 
                  onClick={assessSecurity} 
                  disabled={isLoading || !userData}
                  variant="outline"
                >
                  Security Assessment
                </Button>
              </div>

              {!userData && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please complete user signup first to start the onboarding workflow.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communication" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Multi-Channel Communication</CardTitle>
              <CardDescription>Send messages across multiple channels using AI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Message</Label>
                <textarea
                  value={messageForm.message}
                  onChange={(e) => setMessageForm({...messageForm, message: e.target.value})}
                  placeholder="Enter your message here..."
                  className="w-full p-3 border rounded-md min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Channels</Label>
                <div className="flex space-x-4">
                  {['email', 'sms', 'whatsapp', 'voice'].map((channel) => (
                    <label key={channel} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={messageForm.channels.includes(channel)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setMessageForm({
                              ...messageForm,
                              channels: [...messageForm.channels, channel]
                            });
                          } else {
                            setMessageForm({
                              ...messageForm,
                              channels: messageForm.channels.filter(c => c !== channel)
                            });
                          }
                        }}
                        className="rounded"
                      />
                      <span className="capitalize">{channel}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button 
                onClick={sendMultiChannelMessage} 
                disabled={isLoading || !messageForm.message || messageForm.channels.length === 0}
                className="w-full"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Send Multi-Channel Message
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>AI Engine Status</CardTitle>
                <CardDescription>Check the health of all AI engines</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={async () => {
                    try {
                      const health = await aiAPI.getHealth();
                      toast({
                        title: "AI Health Check",
                        description: `Status: ${health.status}`,
                      });
                    } catch (error: any) {
                      toast({
                        title: "AI Health Check Failed",
                        description: error.message,
                        variant: "destructive",
                      });
                    }
                  }}
                  className="w-full"
                >
                  Check AI Health
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>View AI model performance</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={async () => {
                    try {
                      const performance = await aiAPI.getPerformance();
                      toast({
                        title: "Performance Metrics",
                        description: `Average Accuracy: ${(performance.averageAccuracy * 100).toFixed(1)}%`,
                      });
                    } catch (error: any) {
                      toast({
                        title: "Performance Check Failed",
                        description: error.message,
                        variant: "destructive",
                      });
                    }
                  }}
                  className="w-full"
                >
                  View Performance
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FunctionalDashboard;
