import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, CheckCircle, XCircle, Clock, Phone } from 'lucide-react';
import { smsVerificationService, SMSVerificationSession } from '../services/smsVerificationService';

interface SMSVerificationProps {
  userId: string;
  onVerificationComplete?: (session: SMSVerificationSession) => void;
  onVerificationFailed?: (error: string) => void;
}

export const SMSVerification: React.FC<SMSVerificationProps> = ({
  userId,
  onVerificationComplete,
  onVerificationFailed
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [session, setSession] = useState<SMSVerificationSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  // Countdown timer for verification code expiration
  useEffect(() => {
    if (session && session.status === 'sent') {
      const interval = setInterval(() => {
        const now = new Date();
        const expiresAt = new Date(session.expiresAt);
        const remaining = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000));
        
        setTimeRemaining(remaining);
        
        if (remaining === 0) {
          // Code expired
          setError('Verification code has expired. Please request a new one.');
          setSession(prev => prev ? { ...prev, status: 'expired' } : null);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [session]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSendCode = async () => {
    if (!phoneNumber) {
      setError('Please enter a phone number');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const newSession = await smsVerificationService.sendVerificationCode(userId, phoneNumber);
      setSession(newSession);
      setSuccess('Verification code sent successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send verification code');
      onVerificationFailed?.(err instanceof Error ? err.message : 'Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || !session) {
      setError('Please enter the verification code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await smsVerificationService.verifyCode(session.id, verificationCode);
      
      if (result.success && result.session) {
        setSession(result.session);
        setSuccess('Phone number verified successfully!');
        onVerificationComplete?.(result.session);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
      onVerificationFailed?.(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!session) return;

    setIsLoading(true);
    setError(null);

    try {
      const newSession = await smsVerificationService.resendVerificationCode(session.id);
      setSession(newSession);
      setSuccess('New verification code sent!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend code');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: SMSVerificationSession['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'sent':
        return <Badge variant="default">Sent</Badge>;
      case 'delivered':
        return <Badge variant="default">Delivered</Badge>;
      case 'verified':
        return <Badge variant="default" className="bg-green-500">Verified</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            SMS Verification
          </CardTitle>
          <CardDescription>
            Verify your phone number to complete your onboarding process
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Phone Number Input */}
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone Number
            </label>
            <div className="flex gap-2">
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={session?.status === 'verified' || isLoading}
              />
              <Button
                onClick={handleSendCode}
                disabled={!phoneNumber || session?.status === 'verified' || isLoading}
                className="min-w-[120px]"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Send Code'
                )}
              </Button>
            </div>
          </div>

          {/* Verification Code Input */}
          {session && session.status !== 'verified' && (
            <div className="space-y-2">
              <label htmlFor="code" className="text-sm font-medium">
                Verification Code
              </label>
              <div className="flex gap-2">
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  disabled={isLoading}
                />
                <Button
                  onClick={handleVerifyCode}
                  disabled={!verificationCode || isLoading}
                  className="min-w-[120px]"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Verify'
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Status and Timer */}
          {session && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Status:</span>
                {getStatusBadge(session.status)}
              </div>
              {session.status === 'sent' && timeRemaining > 0 && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Expires in {formatTime(timeRemaining)}
                </div>
              )}
            </div>
          )}

          {/* Error Messages */}
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success Messages */}
          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          {/* Resend Code Button */}
          {session && session.status !== 'verified' && session.status !== 'expired' && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={handleResendCode}
                disabled={isLoading}
                className="text-sm"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Resend Code'
                )}
              </Button>
            </div>
          )}

          {/* Session Details */}
          {session && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Session Details</h4>
              <div className="text-sm space-y-1 text-muted-foreground">
                <div>Request ID: {session.requestId}</div>
                <div>Phone: {session.phoneNumber}</div>
                <div>Created: {session.createdAt.toLocaleString()}</div>
                {session.verifiedAt && (
                  <div>Verified: {session.verifiedAt.toLocaleString()}</div>
                )}
                <div>Attempts: {session.attempts}/{session.maxAttempts}</div>
                {session.carrier && <div>Carrier: {session.carrier}</div>}
                {session.cost && <div>Cost: ${session.cost.toFixed(2)}</div>}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SMSVerification;
