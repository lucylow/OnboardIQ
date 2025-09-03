import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { authService } from '../services/authService';

export const AuthTest: React.FC = () => {
  const [authState, setAuthState] = useState(authService.getAuthState());
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAuthState(authService.getAuthState());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const runTests = async () => {
    const results: string[] = [];
    
    // Test 1: Check current state
    results.push(`Current auth state: ${authState.isAuthenticated ? 'Authenticated' : 'Not authenticated'}`);
    
    // Test 2: Try to login with test credentials
    try {
      const loginResult = await authService.login({
        email: 'test@example.com',
        password: 'password123'
      });
      results.push(`Login test: ${loginResult.success ? 'SUCCESS' : 'FAILED'} - ${loginResult.error || 'No error'}`);
    } catch (error) {
      results.push(`Login test: ERROR - ${error}`);
    }
    
    // Test 3: Check state after login
    const newState = authService.getAuthState();
    results.push(`State after login: ${newState.isAuthenticated ? 'Authenticated' : 'Not authenticated'}`);
    
    // Test 4: Try to logout
    authService.logout();
    const logoutState = authService.getAuthState();
    results.push(`State after logout: ${logoutState.isAuthenticated ? 'Still authenticated' : 'Logged out'}`);
    
    setTestResults(results);
  };

  const quickLogin = async () => {
    try {
      const result = await authService.login({
        email: 'demo@onboardiq.com',
        password: 'demo123'
      });
      if (result.success) {
        setTestResults(['Quick login successful!']);
      } else {
        setTestResults([`Quick login failed: ${result.error}`]);
      }
    } catch (error) {
      setTestResults([`Quick login error: ${error}`]);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Test Panel</CardTitle>
          <CardDescription>
            Test the authentication system and debug any issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current State */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Current Authentication State</p>
              <p className="text-sm text-gray-600">
                {authState.isAuthenticated ? 'User is logged in' : 'User is not logged in'}
              </p>
            </div>
            <Badge variant={authState.isAuthenticated ? 'default' : 'secondary'}>
              {authState.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
            </Badge>
          </div>

          {/* User Info */}
          {authState.user && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="font-medium">User Information</p>
              <p className="text-sm text-gray-600">
                Name: {authState.user.firstName} {authState.user.lastName}
              </p>
              <p className="text-sm text-gray-600">
                Email: {authState.user.email}
              </p>
              <p className="text-sm text-gray-600">
                Plan: {authState.user.planTier}
              </p>
            </div>
          )}

          {/* Test Buttons */}
          <div className="flex gap-2">
            <Button onClick={runTests} variant="outline">
              Run Full Tests
            </Button>
            <Button onClick={quickLogin} variant="outline">
              Quick Login Test
            </Button>
            <Button onClick={() => authService.logout()} variant="outline">
              Logout
            </Button>
          </div>

          {/* Test Results */}
          {testResults.length > 0 && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium mb-2">Test Results:</p>
              <div className="space-y-1">
                {testResults.map((result, index) => (
                  <p key={index} className="text-sm text-gray-700">
                    {result}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Debug Info */}
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="font-medium mb-2">Debug Information:</p>
            <p className="text-sm text-gray-700">
              Local Storage User: {localStorage.getItem('onboardiq_user') ? 'Present' : 'Not found'}
            </p>
            <p className="text-sm text-gray-700">
              Auth Service State: {JSON.stringify(authService.getAuthState(), null, 2)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthTest;
