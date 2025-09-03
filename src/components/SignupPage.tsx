import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowRight, 
  CheckCircle, 
  Shield, 
  Smartphone, 
  Mail, 
  Building, 
  Eye, 
  EyeOff,
  Loader2,
  AlertCircle,
  Lock,
  Zap
} from 'lucide-react';

const SignupPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form data
  const [formData, setFormData] = useState({
    email: '',
    phoneNumber: '',
    companyName: '',
    password: '',
    planTier: 'premium'
  });
  
  const [verificationData, setVerificationData] = useState({
    requestId: '',
    verificationCode: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.email || !formData.phoneNumber || !formData.companyName || !formData.password) {
      setError('Please fill in all required fields');
      return false;
    }
    
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    
    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          companyName: formData.companyName,
          planTier: formData.planTier
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setVerificationData(prev => ({ ...prev, requestId: data.requestId }));
        setSuccess('Verification code sent to your phone!');
        setStep(2);
      } else {
        setError(data.error || 'Signup failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async () => {
    if (!verificationData.verificationCode) {
      setError('Please enter the verification code');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3000/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId: verificationData.requestId,
          code: verificationData.verificationCode,
          userId: 'user_id' // This would be stored from the signup response
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Phone number verified successfully!');
        setStep(3);
      } else {
        setError(data.error || 'Verification failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getProgressValue = () => {
    switch (step) {
      case 1: return 33;
      case 2: return 66;
      case 3: return 100;
      default: return 0;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Create Your Account';
      case 2: return 'Verify Your Phone';
      case 3: return 'Welcome to OnboardIQ!';
      default: return '';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1: return 'Enter your details to get started with OnboardIQ';
      case 2: return 'We\'ve sent a verification code to your phone number';
      case 3: return 'Your account is ready! Let\'s get you onboarded.';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">{step}/3</span>
          </div>
          <Progress value={getProgressValue()} className="h-2" />
        </div>

        {/* Main Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white mb-4">
              {step === 1 && <Shield className="h-8 w-8" />}
              {step === 2 && <Smartphone className="h-8 w-8" />}
              {step === 3 && <CheckCircle className="h-8 w-8" />}
            </div>
            <CardTitle className="text-2xl font-bold">{getStepTitle()}</CardTitle>
            <CardDescription className="text-gray-600">
              {getStepDescription()}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Signup Form */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="company"
                      type="text"
                      placeholder="Your company name"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Must be at least 8 characters long
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Plan Selection</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {['free', 'premium', 'enterprise'].map((plan) => (
                      <button
                        key={plan}
                        type="button"
                        onClick={() => handleInputChange('planTier', plan)}
                        className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                          formData.planTier === plan
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="capitalize">{plan}</div>
                        {plan === 'premium' && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            Popular
                          </Badge>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={handleSignup} 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By creating an account, you agree to our{' '}
                  <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                </p>
              </div>
            )}

            {/* Step 2: Verification */}
            {step === 2 && (
              <div className="space-y-4">
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    We've sent a 6-digit verification code to {formData.phoneNumber}
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="code">Verification Code</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={verificationData.verificationCode}
                    onChange={(e) => setVerificationData(prev => ({ ...prev, verificationCode: e.target.value }))}
                    maxLength={6}
                    className="text-center text-2xl font-mono tracking-widest"
                  />
                </div>

                <Button 
                  onClick={handleVerification} 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify Code'
                  )}
                </Button>

                <div className="text-center">
                  <button 
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-700"
                    onClick={() => setStep(1)}
                  >
                    ← Back to signup
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
              <div className="space-y-6 text-center">
                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Welcome to OnboardIQ!
                  </h3>
                  <p className="text-gray-600">
                    Your account has been created successfully. Let's get you started with your personalized onboarding experience.
                  </p>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={() => window.location.href = '/onboarding'}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Start Onboarding
                    <Zap className="ml-2 h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.href = '/admin'}
                    className="w-full"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Success Display */}
            {success && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Security Badge */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
            <Shield className="h-4 w-4" />
            <span>256-bit SSL encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
