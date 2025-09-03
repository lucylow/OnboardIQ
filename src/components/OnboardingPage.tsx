import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  Clock, 
  Users, 
  Settings, 
  FileText, 
  Video, 
  Smartphone, 
  Mail,
  ArrowRight,
  ArrowLeft,
  Play,
  Download,
  Share2,
  Star,
  Zap,
  Shield,
  BarChart3
} from 'lucide-react';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'pending' | 'active' | 'completed';
  duration?: string;
  action?: string;
}

const OnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const onboardingSteps: OnboardingStep[] = [
    {
      id: 1,
      title: "Welcome & Setup",
      description: "Get familiar with your personalized onboarding experience",
      icon: <Star className="h-6 w-6" />,
      status: 'active',
      duration: '2-3 minutes'
    },
    {
      id: 2,
      title: "Phone Verification",
      description: "Secure your account with multi-factor authentication",
      icon: <Smartphone className="h-6 w-6" />,
      status: 'pending',
      duration: '1-2 minutes'
    },
    {
      id: 3,
      title: "Video Introduction",
      description: "Watch a personalized tour of your dashboard",
      icon: <Video className="h-6 w-6" />,
      status: 'pending',
      duration: '3-5 minutes'
    },
    {
      id: 4,
      title: "Document Setup",
      description: "Generate your welcome package and contracts",
      icon: <FileText className="h-6 w-6" />,
      status: 'pending',
      duration: '2-3 minutes'
    },
    {
      id: 5,
      title: "Team Configuration",
      description: "Invite team members and set permissions",
      icon: <Users className="h-6 w-6" />,
      status: 'pending',
      duration: '5-10 minutes'
    },
    {
      id: 6,
      title: "Analytics Setup",
      description: "Configure your dashboard and reporting preferences",
      icon: <BarChart3 className="h-6 w-6" />,
      status: 'pending',
      duration: '3-5 minutes'
    }
  ];

  const getCurrentStep = () => onboardingSteps.find(step => step.id === currentStep);
  const getProgressPercentage = () => (completedSteps.length / onboardingSteps.length) * 100;

  const handleStepComplete = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setCompletedSteps(prev => [...prev, currentStep]);
    
    if (currentStep < onboardingSteps.length) {
      setCurrentStep(currentStep + 1);
    }
    
    setLoading(false);
  };

  const handleStepSkip = () => {
    if (currentStep < onboardingSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const getStepContent = () => {
    const step = getCurrentStep();
    if (!step) return null;

    switch (step.id) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white mb-4">
                <Star className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to OnboardIQ!</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                We're excited to help you get started. This guided tour will walk you through everything you need to know.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="text-center p-4">
                <Shield className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-semibold">Secure Setup</h3>
                <p className="text-sm text-gray-600">Multi-factor authentication</p>
              </Card>
              <Card className="text-center p-4">
                <Zap className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <h3 className="font-semibold">AI-Powered</h3>
                <p className="text-sm text-gray-600">Personalized experience</p>
              </Card>
              <Card className="text-center p-4">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <h3 className="font-semibold">Analytics Ready</h3>
                <p className="text-sm text-gray-600">Track your success</p>
              </Card>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white mb-4">
                <Smartphone className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Secure Your Account</h2>
              <p className="text-gray-600">
                We'll send a verification code to your phone number to ensure your account is secure.
              </p>
            </div>
            
            <Alert className="border-blue-200 bg-blue-50">
              <Shield className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                This step helps protect your account with industry-standard security measures.
              </AlertDescription>
            </Alert>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">What happens next?</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Receive SMS verification code
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Enter code to verify phone
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Account security activated
                </li>
              </ul>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white mb-4">
                <Video className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Personalized Video Tour</h2>
              <p className="text-gray-600">
                Watch a custom video introduction to your dashboard and key features.
              </p>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-8 text-center">
              <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center text-white">
                  <Play className="h-16 w-16 mx-auto mb-4 text-purple-400" />
                  <h3 className="text-xl font-bold mb-2">Your Custom Tour</h3>
                  <p className="text-gray-400">Duration: 3-5 minutes</p>
                </div>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Play className="mr-2 h-4 w-4" />
                Start Video Tour
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-2">What you'll learn:</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Dashboard navigation</li>
                  <li>• Key features overview</li>
                  <li>• Best practices</li>
                  <li>• Pro tips and tricks</li>
                </ul>
              </Card>
              <Card className="p-4">
                <h3 className="font-semibold mb-2">Video features:</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Interactive elements</li>
                  <li>• Pause and resume</li>
                  <li>• Transcript available</li>
                  <li>• Mobile friendly</li>
                </ul>
              </Card>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white mb-4">
                <FileText className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Generate Your Documents</h2>
              <p className="text-gray-600">
                Create your welcome package, contracts, and other essential documents.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
                <FileText className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <h3 className="font-semibold mb-2">Welcome Package</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Personalized welcome letter, feature guide, and getting started checklist
                </p>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Generate
                </Button>
              </Card>
              
              <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
                <FileText className="h-12 w-12 mx-auto mb-4 text-green-600" />
                <h3 className="font-semibold mb-2">Service Agreement</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Custom contract with your company details and service terms
                </p>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Generate
                </Button>
              </Card>
            </div>
            
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                All documents are automatically customized with your company information and preferences.
              </AlertDescription>
            </Alert>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white mb-4">
                <Users className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Invite Your Team</h2>
              <p className="text-gray-600">
                Add team members and set up permissions for collaborative work.
              </p>
            </div>
            
            <div className="space-y-4">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Team Members</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                        JD
                      </div>
                      <div>
                        <div className="font-medium">John Doe</div>
                        <div className="text-sm text-gray-600">john@company.com</div>
                      </div>
                    </div>
                    <Badge variant="secondary">Owner</Badge>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <Users className="mr-2 h-4 w-4" />
                    Invite Team Member
                  </Button>
                </div>
              </Card>
              
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Permission Levels</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Owner</span>
                    <span className="text-gray-600">Full access</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Admin</span>
                    <span className="text-gray-600">Manage users & settings</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Member</span>
                    <span className="text-gray-600">View & edit data</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Viewer</span>
                    <span className="text-gray-600">Read-only access</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white mb-4">
                <BarChart3 className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Setup</h2>
              <p className="text-gray-600">
                Configure your dashboard and reporting preferences to track success.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Dashboard Widgets</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Conversion Funnel</span>
                    <Badge variant="secondary">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">User Activity</span>
                    <Badge variant="secondary">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Channel Performance</span>
                    <Badge variant="secondary">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">At-Risk Users</span>
                    <Badge variant="outline">Disabled</Badge>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Reporting Schedule</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Weekly Summary</span>
                    <Badge variant="secondary">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Monthly Report</span>
                    <Badge variant="secondary">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Real-time Alerts</span>
                    <Badge variant="outline">Disabled</Badge>
                  </div>
                </div>
              </Card>
            </div>
            
            <Alert className="border-blue-200 bg-blue-50">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                You can customize these settings anytime from your dashboard.
              </AlertDescription>
            </Alert>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Onboarding Journey</h1>
          <p className="text-gray-600">
            Let's get you set up with OnboardIQ in just a few steps
          </p>
        </div>

        {/* Progress Overview */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progress: {completedSteps.length} of {onboardingSteps.length} completed
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(getProgressPercentage())}%
            </span>
          </div>
          <Progress value={getProgressPercentage()} className="h-3" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Steps Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Your Journey</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {onboardingSteps.map((step) => (
                    <div
                      key={step.id}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                        step.id === currentStep
                          ? 'bg-blue-50 border border-blue-200'
                          : step.status === 'completed'
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                      }`}
                      onClick={() => step.status !== 'pending' && setCurrentStep(step.id)}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        step.status === 'completed'
                          ? 'bg-green-500 text-white'
                          : step.id === currentStep
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}>
                        {step.status === 'completed' ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <span className="text-sm font-medium">{step.id}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{step.title}</div>
                        <div className="text-xs text-gray-500">{step.duration}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="min-h-[600px]">
              <CardContent className="p-8">
                {getStepContent()}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              <div className="flex gap-2">
                {currentStep < onboardingSteps.length && (
                  <Button variant="outline" onClick={handleStepSkip}>
                    Skip Step
                  </Button>
                )}
                
                <Button
                  onClick={handleStepComplete}
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {loading ? (
                    'Processing...'
                  ) : currentStep === onboardingSteps.length ? (
                    'Complete Setup'
                  ) : (
                    <>
                      Next Step
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
