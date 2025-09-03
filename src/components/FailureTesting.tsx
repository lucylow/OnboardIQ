import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Loader2, AlertTriangle, XCircle, Bug, TestTube, RefreshCw } from 'lucide-react';
import mockFailureData, { failureUtils } from '../services/mockFailureData';

interface FailureData {
  id: string;
  error?: string;
  type?: string;
  message: string;
  userId?: string;
  timestamp?: string;
  severity?: string;
  category?: string;
  retryCount?: number;
  maxRetries?: number;
  retryable?: boolean;
  attempts?: number;
  ipAddress?: string;
}

interface FailureTestingProps {
  onFailureTriggered?: (category: string, failure: FailureData) => void;
}

export const FailureTesting: React.FC<FailureTestingProps> = ({
  onFailureTriggered
}) => {
  const [activeTab, setActiveTab] = useState('sms');
  const [isLoading, setIsLoading] = useState(false);
  const [currentFailure, setCurrentFailure] = useState<FailureData | null>(null);
  const [failureHistory, setFailureHistory] = useState<FailureData[]>([]);

  const categories = [
    { id: 'sms', name: 'SMS Verification', icon: '📱' },
    { id: 'video', name: 'Video Onboarding', icon: '🎥' },
    { id: 'document', name: 'Document Generation', icon: '📄' },
    { id: 'team', name: 'Team Management', icon: '👥' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'analytics', name: 'Analytics', icon: '📊' },
    { id: 'documentation', name: 'Documentation', icon: '📚' }
  ];

  const triggerRandomFailure = async (category: string) => {
    setIsLoading(true);
    setCurrentFailure(null);

    // Simulate network delay
    await failureUtils.simulateNetworkDelay(1000, 3000);

    const failure = failureUtils.getRandomFailure(category);
    if (failure) {
      setCurrentFailure(failure);
      setFailureHistory(prev => [failure, ...prev.slice(0, 9)]); // Keep last 10
      onFailureTriggered?.(category, failure);
    }

    setIsLoading(false);
  };

  const triggerSpecificFailure = async (category: string, failureType: string) => {
    setIsLoading(true);
    setCurrentFailure(null);

    await failureUtils.simulateNetworkDelay(500, 2000);

    const categoryData = mockFailureData[category as keyof typeof mockFailureData];
    if (categoryData && categoryData[failureType as keyof typeof categoryData]) {
      const failures = categoryData[failureType as keyof typeof categoryData] as FailureData[];
      if (Array.isArray(failures) && failures.length > 0) {
        const failure = failures[Math.floor(Math.random() * failures.length)];
        setCurrentFailure(failure);
        setFailureHistory(prev => [failure, ...prev.slice(0, 9)]);
        onFailureTriggered?.(category, failure);
      }
    }

    setIsLoading(false);
  };

  const getFailureTypeName = (failure: FailureData) => {
    if (failure.error) return failure.error;
    if (failure.type) return failure.type;
    if (failure.id) return failure.id.split('_')[1] || 'Unknown';
    return 'Unknown';
  };

  const getFailureSeverity = (failure: FailureData) => {
    const error = failure.error || failure.type || '';
    if (error.includes('TIMEOUT') || error.includes('NETWORK')) return 'outline';
    if (error.includes('AUTH') || error.includes('PERMISSION')) return 'destructive';
    if (error.includes('VALIDATION') || error.includes('MISSING')) return 'secondary';
    return 'default';
  };

  const renderFailureCard = (failure: FailureData) => (
    <Card key={failure.id} className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            {getFailureTypeName(failure)}
          </CardTitle>
          <Badge variant={getFailureSeverity(failure)} className="text-xs">
            {failure.timestamp ? new Date(failure.timestamp).toLocaleTimeString() : 'Now'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-2">{failure.message}</p>
        <div className="text-xs space-y-1">
          {failure.userId && <div>User: {failure.userId}</div>}
          {failure.retryCount !== undefined && (
            <div>Retries: {failure.retryCount}/{failure.maxRetries || 3}</div>
          )}
          {failure.retryable !== undefined && (
            <div>Retryable: {failure.retryable ? 'Yes' : 'No'}</div>
          )}
          {failure.attempts && <div>Attempts: {failure.attempts}</div>}
          {failure.ipAddress && <div>IP: {failure.ipAddress}</div>}
        </div>
      </CardContent>
    </Card>
  );

  const renderCategoryContent = (category: string) => {
    const categoryData = mockFailureData[category as keyof typeof mockFailureData];
    if (!categoryData) return null;

    const failureTypes = Object.keys(categoryData);

    return (
      <div className="space-y-4">
        {/* Random Failure Trigger */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5" />
              Trigger Random Failure
            </CardTitle>
            <CardDescription>
              Simulate a random failure scenario for {categories.find(c => c.id === category)?.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => triggerRandomFailure(category)}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Bug className="h-4 w-4 mr-2" />
              )}
              Trigger Random Failure
            </Button>
          </CardContent>
        </Card>

        {/* Specific Failure Types */}
        <Card>
          <CardHeader>
            <CardTitle>Specific Failure Types</CardTitle>
            <CardDescription>
              Trigger specific types of failures for testing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {failureTypes.map((failureType) => (
                <Button
                  key={failureType}
                  variant="outline"
                  size="sm"
                  onClick={() => triggerSpecificFailure(category, failureType)}
                  disabled={isLoading}
                  className="justify-start"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  {failureType.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Failure Display */}
        {currentFailure && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-800">
                <XCircle className="h-5 w-5" />
                Current Failure
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderFailureCard(currentFailure)}
            </CardContent>
          </Card>
        )}

        {/* Failure History */}
        {failureHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Recent Failures ({failureHistory.length})
              </CardTitle>
              <CardDescription>
                History of triggered failures for testing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {failureHistory.map((failure, index) => (
                  <div key={`${failure.id}-${index}`} className="border rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{getFailureTypeName(failure)}</span>
                      <Badge variant={getFailureSeverity(failure)} className="text-xs">
                        {failure.timestamp ? new Date(failure.timestamp).toLocaleTimeString() : 'Now'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{failure.message}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Bug className="h-8 w-8 text-red-600" />
          <h1 className="text-3xl font-bold">Failure Testing</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Test error scenarios and failure handling for all product features
        </p>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-1">
              <span>{category.icon}</span>
              <span className="hidden md:inline">{category.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>{category.icon}</span>
                  {category.name} Failure Testing
                </CardTitle>
                <CardDescription>
                  Test various failure scenarios for {category.name.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderCategoryContent(category.id)}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Failure Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Failure Statistics</CardTitle>
          <CardDescription>
            Overview of triggered failures by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => {
              const categoryFailures = failureHistory.filter(f => 
                f.id?.includes(category.id) || f.userId?.includes(category.id)
              );
              return (
                <div key={category.id} className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {categoryFailures.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {category.name} Failures
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Testing Instructions:</strong> Use this component to simulate various failure scenarios 
          and test your application's error handling. Each category contains different types of failures 
          that can occur in real-world scenarios. Monitor how your application responds and handles these errors.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default FailureTesting;
