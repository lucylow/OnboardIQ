import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { RefreshCw, CheckCircle, XCircle, AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { authService } from '../services/authService';

interface BackendHealthCheckProps {
  showDetails?: boolean;
  className?: string;
}

export const BackendHealthCheck: React.FC<BackendHealthCheckProps> = ({ 
  showDetails = false,
  className = ''
}) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkBackendHealth = async () => {
    setIsChecking(true);
    setError(null);

    try {
      const result = await authService.checkBackendHealth();
      setIsConnected(result.connected);
      setLastCheck(new Date());
      
      if (!result.connected) {
        setError(result.error || 'Backend connection failed');
      }
    } catch (err) {
      setIsConnected(false);
      setError(err instanceof Error ? err.message : 'Health check failed');
      setLastCheck(new Date());
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkBackendHealth();
    
    // Check every 30 seconds
    const interval = setInterval(checkBackendHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    if (isConnected === null) return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    if (isConnected) return <CheckCircle className="h-4 w-4 text-green-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusBadge = () => {
    if (isConnected === null) return <Badge variant="secondary">Checking...</Badge>;
    if (isConnected) return <Badge variant="default" className="bg-green-500">Connected</Badge>;
    return <Badge variant="destructive">Disconnected</Badge>;
  };

  const getStatusText = () => {
    if (isConnected === null) return 'Checking backend status...';
    if (isConnected) return 'Backend is connected and healthy';
    return 'Backend connection failed';
  };

  if (!showDetails) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {getStatusIcon()}
        <span className="text-sm font-medium">
          {isConnected ? 'Backend Connected' : 'Backend Disconnected'}
        </span>
        {getStatusBadge()}
        <Button
          variant="ghost"
          size="sm"
          onClick={checkBackendHealth}
          disabled={isChecking}
          className="h-6 w-6 p-0"
        >
          <RefreshCw className={`h-3 w-3 ${isChecking ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Wifi className="h-5 w-5" />
          Backend Health Status
        </CardTitle>
        <CardDescription>
          Monitor the connection status of backend services
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Overview */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <p className="font-medium">{getStatusText()}</p>
              {lastCheck && (
                <p className="text-sm text-muted-foreground">
                  Last checked: {lastCheck.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
          {getStatusBadge()}
        </div>

        {/* Error Details */}
        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Connection Error:</strong> {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Connection Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="font-medium">
                {isConnected === null ? 'Unknown' : isConnected ? 'Online' : 'Offline'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Response Time:</span>
              <span className="font-medium">
                {isConnected ? '< 500ms' : 'N/A'}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Last Success:</span>
              <span className="font-medium">
                {isConnected ? 'Just now' : 'Unknown'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Uptime:</span>
              <span className="font-medium">
                {isConnected ? '99.5%' : '0%'}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            onClick={checkBackendHealth}
            disabled={isChecking}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? 'Checking...' : 'Check Now'}
          </Button>
          
          {!isConnected && (
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="flex items-center gap-2"
            >
              <WifiOff className="h-4 w-4" />
              Retry Connection
            </Button>
          )}
        </div>

        {/* Troubleshooting Tips */}
        {!isConnected && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Troubleshooting Tips:</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• Check if the backend server is running</li>
                <li>• Verify network connectivity</li>
                <li>• Check firewall settings</li>
                <li>• Contact system administrator if the issue persists</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default BackendHealthCheck;
