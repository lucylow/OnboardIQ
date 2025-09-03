import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye, 
  EyeOff,
  RefreshCw,
  Activity,
  Lock,
  Unlock,
  Users,
  Globe,
  Smartphone,
  Monitor,
  Zap,
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart3
} from 'lucide-react';

interface SecurityEvent {
  id: string;
  type: 'login_attempt' | 'verification_failure' | 'suspicious_activity' | 'fraud_detected' | 'system_alert';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  timestamp: string;
  location: string;
  ipAddress: string;
  userAgent: string;
  status: 'pending' | 'investigating' | 'resolved' | 'false_positive';
  riskScore: number;
}

interface SecurityMetrics {
  totalThreats: number;
  threatsBlocked: number;
  activeAlerts: number;
  securityScore: number;
  lastIncident: string;
  uptime: number;
  verificationSuccess: number;
  fraudAttempts: number;
  recentEvents: SecurityEvent[];
  threatTrends: Array<{
    date: string;
    threats: number;
    blocked: number;
  }>;
  riskDistribution: Array<{
    level: string;
    count: number;
    percentage: number;
  }>;
}

const SecurityMonitoring: React.FC = () => {
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
  const [isLive, setIsLive] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null);

  // Mock security data generation
  useEffect(() => {
    const generateSecurityData = (): SecurityMetrics => ({
      totalThreats: 156 + Math.floor(Math.random() * 20),
      threatsBlocked: 152 + Math.floor(Math.random() * 15),
      activeAlerts: 3 + Math.floor(Math.random() * 3),
      securityScore: 94 + Math.floor(Math.random() * 5),
      lastIncident: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      uptime: 99.98 + Math.random() * 0.02,
      verificationSuccess: 98.5 + Math.random() * 1,
      fraudAttempts: 12 + Math.floor(Math.random() * 8),
      recentEvents: [
        {
          id: `event-${Date.now()}`,
          type: 'suspicious_activity',
          severity: 'high',
          description: 'Multiple failed login attempts from unknown IP',
          timestamp: new Date().toISOString(),
          location: 'New York, US',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          status: 'investigating',
          riskScore: 85
        },
        {
          id: `event-${Date.now() + 1}`,
          type: 'verification_failure',
          severity: 'medium',
          description: 'Phone verification failed for premium user',
          timestamp: new Date().toISOString(),
          location: 'London, UK',
          ipAddress: '203.0.113.45',
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0)',
          status: 'pending',
          riskScore: 45
        },
        {
          id: `event-${Date.now() + 2}`,
          type: 'fraud_detected',
          severity: 'critical',
          description: 'SIM swap attempt detected',
          timestamp: new Date().toISOString(),
          location: 'Toronto, CA',
          ipAddress: '198.51.100.123',
          userAgent: 'Mozilla/5.0 (Android 12)',
          status: 'investigating',
          riskScore: 95
        }
      ],
      threatTrends: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
        threats: Math.floor(Math.random() * 20) + 10,
        blocked: Math.floor(Math.random() * 18) + 8
      })).reverse(),
      riskDistribution: [
        { level: 'Critical', count: 2, percentage: 1.3 },
        { level: 'High', count: 8, percentage: 5.1 },
        { level: 'Medium', count: 23, percentage: 14.7 },
        { level: 'Low', count: 123, percentage: 78.9 }
      ]
    });

    setMetrics(generateSecurityData());

    if (isLive) {
      const interval = setInterval(() => {
        setMetrics(generateSecurityData());
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [isLive]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'investigating': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'false_positive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'login_attempt': return <Users className="h-4 w-4" />;
      case 'verification_failure': return <XCircle className="h-4 w-4" />;
      case 'suspicious_activity': return <AlertTriangle className="h-4 w-4" />;
      case 'fraud_detected': return <Shield className="h-4 w-4" />;
      case 'system_alert': return <Monitor className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  if (!metrics) return <div>Loading security data...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Security Monitoring</h1>
          <p className="text-muted-foreground">Real-time threat detection and security analytics</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant={isLive ? "default" : "outline"}
            onClick={() => setIsLive(!isLive)}
            className="flex items-center space-x-2"
          >
            {isLive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            <span>{isLive ? 'Live Monitoring' : 'Paused'}</span>
          </Button>
          <Button
            variant="outline"
            onClick={() => setMetrics({ ...metrics })}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Security Score Alert */}
      <Alert className={metrics.securityScore < 90 ? "border-orange-200 bg-orange-50" : "border-green-200 bg-green-50"}>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Security Score: {metrics.securityScore}/100</strong>
          {metrics.securityScore >= 90 ? 
            " - Excellent security posture maintained" : 
            " - Security improvements recommended"
          }
        </AlertDescription>
      </Alert>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Threats Blocked</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.threatsBlocked}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 text-green-500" /> {((metrics.threatsBlocked / metrics.totalThreats) * 100).toFixed(1)}% success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeAlerts}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.activeAlerts > 0 ? 
                <span className="text-orange-600">Requires attention</span> : 
                <span className="text-green-600">All clear</span>
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.uptime.toFixed(3)}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 text-green-500" /> Excellent reliability
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verification Success</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.verificationSuccess.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 text-green-500" /> High success rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Security Analysis */}
      <Tabs defaultValue="events" className="space-y-4">
        <TabsList>
          <TabsTrigger value="events">Recent Events</TabsTrigger>
          <TabsTrigger value="trends">Threat Trends</TabsTrigger>
          <TabsTrigger value="distribution">Risk Distribution</TabsTrigger>
          <TabsTrigger value="details">Event Details</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Security Events</CardTitle>
              <CardDescription>Latest security incidents and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {metrics.recentEvents.map((event) => (
                  <div 
                    key={event.id} 
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className={`w-2 h-2 rounded-full ${getSeverityColor(event.severity).split(' ')[0]}`} />
                    <div className="flex items-center space-x-2">
                      {getEventIcon(event.type)}
                      <span className="text-sm font-medium">{event.description}</span>
                    </div>
                    <Badge className={`ml-auto ${getSeverityColor(event.severity)}`}>
                      {event.severity.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className={getStatusColor(event.status)}>
                      {event.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>7-Day Threat Trends</CardTitle>
              <CardDescription>Daily threat detection and blocking statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.threatTrends.map((trend, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-20 text-sm font-medium">{trend.date}</div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">Threats:</span>
                        <Progress value={(trend.threats / 30) * 100} className="w-20" />
                        <span className="text-xs">{trend.threats}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">Blocked:</span>
                        <Progress value={(trend.blocked / 30) * 100} className="w-20" />
                        <span className="text-xs">{trend.blocked}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Level Distribution</CardTitle>
              <CardDescription>Breakdown of security events by risk level</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.riskDistribution.map((risk) => (
                  <div key={risk.level} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full ${
                        risk.level === 'Critical' ? 'bg-red-500' :
                        risk.level === 'High' ? 'bg-orange-500' :
                        risk.level === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <span className="font-medium">{risk.level}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={risk.percentage} className="w-24" />
                      <span className="text-sm text-muted-foreground">
                        {risk.count} ({risk.percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {selectedEvent ? (
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
                <CardDescription>Detailed information about the selected security event</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Event Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="font-medium">{selectedEvent.type.replace('_', ' ').toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Severity:</span>
                        <Badge className={getSeverityColor(selectedEvent.severity)}>
                          {selectedEvent.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <Badge variant="outline" className={getStatusColor(selectedEvent.status)}>
                          {selectedEvent.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Risk Score:</span>
                        <span className="font-medium">{selectedEvent.riskScore}/100</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Location & Network</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Location:</span>
                        <span className="font-medium">{selectedEvent.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>IP Address:</span>
                        <span className="font-medium font-mono">{selectedEvent.ipAddress}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Timestamp:</span>
                        <span className="font-medium">{new Date(selectedEvent.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">User Agent</h4>
                  <p className="text-sm font-mono text-muted-foreground">{selectedEvent.userAgent}</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Investigate</Button>
                  <Button variant="outline" size="sm">Mark as Resolved</Button>
                  <Button variant="outline" size="sm">Add to Watchlist</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Select an event from the Recent Events tab to view details</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityMonitoring;
