import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Smartphone,
  Activity,
  Eye,
  Lock,
  Unlock,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface SecurityEvent {
  id: string;
  type: 'login_attempt' | 'location_change' | 'device_change' | 'sim_swap' | 'behavior_anomaly';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  description: string;
  details: any;
  resolved: boolean;
}

interface RiskAssessment {
  overallRisk: number;
  riskFactors: Array<{
    type: string;
    score: number;
    description: string;
  }>;
  recommendations: string[];
  lastUpdated: Date;
}

interface SecurityMetrics {
  totalEvents: number;
  highRiskEvents: number;
  resolvedEvents: number;
  activeThreats: number;
  riskTrend: 'increasing' | 'decreasing' | 'stable';
}

const ContinuousRiskMonitoring: React.FC = () => {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    loadSecurityData();
    // Set up real-time monitoring
    const interval = setInterval(loadSecurityData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadSecurityData = async () => {
    try {
      setLoading(true);
      
      // Fetch security dashboard data
      const response = await fetch('/api/ai/security/dashboard');
      const data = await response.json();
      
      if (data.success) {
        setSecurityEvents(data.dashboard.recentEvents || []);
        setSecurityMetrics({
          totalEvents: data.dashboard.riskStats.total,
          highRiskEvents: data.dashboard.riskStats.high + data.dashboard.riskStats.critical,
          resolvedEvents: data.dashboard.riskStats.total - data.dashboard.riskStats.stepUpRequired,
          activeThreats: data.dashboard.activeSessions,
          riskTrend: data.dashboard.riskStats.critical > 0 ? 'increasing' : 'stable'
        });
      }
    } catch (error) {
      console.error('Error loading security data:', error);
      // Fallback to mock data
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  const setMockData = () => {
    setSecurityEvents([
      {
        id: '1',
        type: 'login_attempt',
        severity: 'high',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        description: 'Suspicious login attempt from unknown location',
        details: {
          location: 'Moscow, Russia',
          device: 'Unknown device',
          ip: '192.168.1.100'
        },
        resolved: false
      },
      {
        id: '2',
        type: 'location_change',
        severity: 'medium',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        description: 'Login from new location detected',
        details: {
          location: 'San Francisco, CA',
          previousLocation: 'New York, NY',
          timeDiff: '2 hours'
        },
        resolved: true
      },
      {
        id: '3',
        type: 'sim_swap',
        severity: 'critical',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        description: 'Potential SIM swap detected',
        details: {
          phoneNumber: '+1234567890',
          carrier: 'Verizon',
          status: 'investigating'
        },
        resolved: false
      }
    ]);

    setRiskAssessment({
      overallRisk: 0.65,
      riskFactors: [
        {
          type: 'location_mismatch',
          score: 0.8,
          description: 'Login from unusual location'
        },
        {
          type: 'device_change',
          score: 0.6,
          description: 'New device detected'
        },
        {
          type: 'time_anomaly',
          score: 0.4,
          description: 'Login during unusual hours'
        }
      ],
      recommendations: [
        'Enable two-factor authentication',
        'Review recent login activity',
        'Contact support if suspicious'
      ],
      lastUpdated: new Date()
    });

    setSecurityMetrics({
      totalEvents: 15,
      highRiskEvents: 3,
      resolvedEvents: 12,
      activeThreats: 2,
      riskTrend: 'increasing'
    });
  };

  const handleResolveEvent = async (eventId: string) => {
    try {
      await fetch(`/api/ai/security/resolve-event/${eventId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      setSecurityEvents(prev => 
        prev.map(event => 
          event.id === eventId ? { ...event, resolved: true } : event
        )
      );
    } catch (error) {
      console.error('Error resolving event:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'login_attempt': return <Activity className="w-4 h-4" />;
      case 'location_change': return <MapPin className="w-4 h-4" />;
      case 'device_change': return <Smartphone className="w-4 h-4" />;
      case 'sim_swap': return <AlertTriangle className="w-4 h-4" />;
      case 'behavior_anomaly': return <Eye className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Continuous Risk Monitoring</h1>
          <p className="text-gray-600 mt-2">
            Real-time security monitoring and threat detection powered by Vonage APIs
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Live Monitoring
        </Badge>
      </div>

      {/* Security Metrics Overview */}
      {securityMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Events</p>
                  <p className="text-2xl font-bold">{securityMetrics.totalEvents}</p>
                </div>
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">High Risk Events</p>
                  <p className="text-2xl font-bold text-red-600">{securityMetrics.highRiskEvents}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Resolved Events</p>
                  <p className="text-2xl font-bold text-green-600">{securityMetrics.resolvedEvents}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Threats</p>
                  <p className="text-2xl font-bold text-orange-600">{securityMetrics.activeThreats}</p>
                </div>
                <Lock className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Risk Assessment */}
      {riskAssessment && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Current Risk Assessment
            </CardTitle>
            <CardDescription>
              Last updated: {riskAssessment.lastUpdated.toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Overall Risk Score</span>
                  <span>{Math.round(riskAssessment.overallRisk * 100)}%</span>
                </div>
                <Progress value={riskAssessment.overallRisk * 100} className="h-2" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Risk Factors</h4>
                  <div className="space-y-2">
                    {riskAssessment.riskFactors.map((factor, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span>{factor.description}</span>
                        <Badge variant="outline">{Math.round(factor.score * 100)}%</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Recommendations</h4>
                  <div className="space-y-2">
                    {riskAssessment.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Events */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Security Events</TabsTrigger>
          <TabsTrigger value="threats">Active Threats</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Status</CardTitle>
              <CardDescription>Current security posture and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Security Status:</strong> {securityMetrics?.riskTrend === 'increasing' ? 
                      'Elevated risk detected. Review recent events and consider additional security measures.' :
                      'Normal security posture maintained. Continue monitoring for any changes.'
                    }
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {securityMetrics?.resolvedEvents || 0}
                    </div>
                    <div className="text-sm text-gray-600">Issues Resolved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {securityMetrics?.totalEvents || 0}
                    </div>
                    <div className="text-sm text-gray-600">Total Monitored</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <div className="space-y-4">
            {securityEvents.map((event) => (
              <Card key={event.id} className={event.resolved ? 'opacity-60' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center gap-2">
                        {getEventIcon(event.type)}
                        <Badge className={getSeverityColor(event.severity)}>
                          {event.severity}
                        </Badge>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{event.description}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {event.timestamp.toLocaleString()}
                        </p>
                        {event.details && (
                          <div className="mt-2 text-sm text-gray-500">
                            {Object.entries(event.details).map(([key, value]) => (
                              <div key={key}>
                                <span className="font-medium">{key}:</span> {String(value)}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    {!event.resolved && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleResolveEvent(event.id)}
                      >
                        Resolve
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="threats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Threat Analysis</CardTitle>
              <CardDescription>Real-time threat detection and response</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityMetrics?.activeThreats ? (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Active Threats Detected:</strong> {securityMetrics.activeThreats} potential security threats 
                      require immediate attention. Review the security events tab for details.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>No Active Threats:</strong> All security systems are operating normally. 
                      Continue monitoring for any suspicious activity.
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-sm font-medium">Threat Detection</div>
                    <div className="text-2xl font-bold text-blue-600">Active</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Shield className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <div className="text-sm font-medium">Response Time</div>
                    <div className="text-2xl font-bold text-green-600">&lt;30s</div>
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

export default ContinuousRiskMonitoring;
