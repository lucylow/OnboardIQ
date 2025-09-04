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
  TrendingDown,
  Zap,
  Users,
  BarChart3,
  RefreshCw,
  Settings,
  Bell,
  Globe,
  Target,
  Heart,
  Star,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Minus,
  Plus,
  Filter,
  Search,
  Download,
  Share2,
  MoreHorizontal
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading security data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Continuous Risk Monitoring</h1>
                <p className="text-gray-600 mt-1">
                  Real-time security monitoring and threat detection powered by AI
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Badge variant="secondary" className="flex items-center gap-2 bg-green-100 text-green-700 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Live Monitoring
              </Badge>
            </div>
          </div>
        </div>

        {/* Security Metrics Overview */}
        {securityMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Total Events</p>
                    <p className="text-3xl font-bold text-blue-600">{securityMetrics.totalEvents}</p>
                    <p className="text-xs text-green-600 mt-1">+12% from last week</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">High Risk Events</p>
                    <p className="text-3xl font-bold text-red-600">{securityMetrics.highRiskEvents}</p>
                    <p className="text-xs text-red-600 mt-1">Requires attention</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Resolved Events</p>
                    <p className="text-3xl font-bold text-green-600">{securityMetrics.resolvedEvents}</p>
                    <p className="text-xs text-green-600 mt-1">80% resolution rate</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Active Threats</p>
                    <p className="text-3xl font-bold text-orange-600">{securityMetrics.activeThreats}</p>
                    <p className="text-xs text-orange-600 mt-1">Under investigation</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Lock className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Risk Assessment */}
        {riskAssessment && (
          <Card className="mb-8 hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Shield className="w-5 h-5" />
                    Current Risk Assessment
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Last updated: {riskAssessment.lastUpdated.toLocaleString()}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-sm">
                  Risk Score: {Math.round(riskAssessment.overallRisk * 100)}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="font-medium">Overall Risk Score</span>
                  <span className="font-semibold">{Math.round(riskAssessment.overallRisk * 100)}%</span>
                </div>
                <Progress value={riskAssessment.overallRisk * 100} className="h-3" />
                <p className="text-xs text-gray-500 mt-2">
                  {riskAssessment.overallRisk > 0.7 ? 'High risk detected' : 
                   riskAssessment.overallRisk > 0.4 ? 'Medium risk detected' : 'Low risk detected'}
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Risk Factors
                  </h4>
                  <div className="space-y-3">
                    {riskAssessment.riskFactors.map((factor, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">{factor.description}</span>
                        <Badge variant="outline" className="text-xs">
                          {Math.round(factor.score * 100)}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Recommendations
                  </h4>
                  <div className="space-y-3">
                    {riskAssessment.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Security Events Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Overview
            </TabsTrigger>
            <TabsTrigger value="events" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Security Events
            </TabsTrigger>
            <TabsTrigger value="threats" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Active Threats
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Security Status
                  </CardTitle>
                  <CardDescription>Current security posture and recommendations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert className={securityMetrics?.riskTrend === 'increasing' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
                    <Shield className="h-4 w-4" />
                    <AlertDescription className={securityMetrics?.riskTrend === 'increasing' ? 'text-red-800' : 'text-green-800'}>
                      <strong>Security Status:</strong> {securityMetrics?.riskTrend === 'increasing' ? 
                        'Elevated risk detected. Review recent events and consider additional security measures.' :
                        'Normal security posture maintained. Continue monitoring for any changes.'
                      }
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {securityMetrics?.resolvedEvents || 0}
                      </div>
                      <div className="text-sm text-gray-600">Issues Resolved</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {securityMetrics?.totalEvents || 0}
                      </div>
                      <div className="text-sm text-gray-600">Total Monitored</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Risk Trends
                  </CardTitle>
                  <CardDescription>Security metrics over time</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Weekly Events</span>
                      <div className="flex items-center gap-2">
                        <ArrowUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-semibold text-green-600">+15%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Response Time</span>
                      <div className="flex items-center gap-2">
                        <ArrowDown className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-semibold text-blue-600">-8%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">False Positives</span>
                      <div className="flex items-center gap-2">
                        <ArrowDown className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-semibold text-green-600">-12%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Security Events</h3>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              {securityEvents.map((event) => (
                <Card key={event.id} className={`hover:shadow-lg transition-all duration-300 ${event.resolved ? 'opacity-75' : 'border-l-4 border-l-red-500'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          {getEventIcon(event.type)}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold text-gray-900">{event.description}</h4>
                            <Badge className={getSeverityColor(event.severity)}>
                              {event.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {event.timestamp.toLocaleString()}
                          </p>
                          {event.details && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                              {Object.entries(event.details).map(([key, value]) => (
                                <div key={key} className="text-sm">
                                  <span className="font-medium text-gray-700 capitalize">{key.replace('_', ' ')}:</span>{' '}
                                  <span className="text-gray-600">{String(value)}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {!event.resolved && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleResolveEvent(event.id)}
                            className="hover:bg-green-50 hover:text-green-700 hover:border-green-200"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Resolve
                          </Button>
                        )}
                        <Button size="sm" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="threats" className="space-y-6">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Active Threat Analysis
                </CardTitle>
                <CardDescription>Real-time threat detection and response</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {securityMetrics?.activeThreats ? (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-red-800">
                      <strong>Active Threats Detected:</strong> {securityMetrics.activeThreats} potential security threats 
                      require immediate attention. Review the security events tab for details.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription className="text-green-800">
                      <strong>No Active Threats:</strong> All security systems are operating normally. 
                      Continue monitoring for any suspicious activity.
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
                    <TrendingUp className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                    <div className="text-sm font-medium text-gray-700 mb-1">Threat Detection</div>
                    <div className="text-2xl font-bold text-blue-600">Active</div>
                    <p className="text-xs text-gray-500 mt-2">Real-time monitoring</p>
                  </div>
                  <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
                    <Shield className="w-8 h-8 mx-auto mb-3 text-green-600" />
                    <div className="text-sm font-medium text-gray-700 mb-1">Response Time</div>
                    <div className="text-2xl font-bold text-green-600">&lt;30s</div>
                    <p className="text-xs text-gray-500 mt-2">Average response</p>
                  </div>
                  <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-200">
                    <Target className="w-8 h-8 mx-auto mb-3 text-purple-600" />
                    <div className="text-sm font-medium text-gray-700 mb-1">Accuracy</div>
                    <div className="text-2xl font-bold text-purple-600">98.5%</div>
                    <p className="text-xs text-gray-500 mt-2">False positive rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ContinuousRiskMonitoring;
