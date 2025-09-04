import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { 
  BarChart3, 
  Users, 
  FileText, 
  Video, 
  Smartphone, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle,
  Zap,
  Shield,
  Settings,
  Bell,
  Brain,
  Activity,
  Target,
  Clock,
  Star,
  Eye,
  MessageSquare,
  Globe,
  Sparkles,
  ArrowRight,
  Play,
  BookOpen,
  Lock,
  Unlock,
  Calendar,
  Filter,
  Search
} from 'lucide-react';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import BackendHealthCheck from './BackendHealthCheck';

export const Dashboard: React.FC = () => {
  const [authState, setAuthState] = useState(authService.getAuthState());
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    if (!authState.isAuthenticated) {
      navigate('/signup');
      return;
    }

    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);

    // Update auth state
    const interval = setInterval(() => {
      setAuthState(authService.getAuthState());
    }, 1000);

    return () => clearInterval(interval);
  }, [authState.isAuthenticated, navigate]);

  const stats = [
    {
      title: 'Total Users',
      value: '1,234',
      change: '+12%',
      icon: <Users className="h-5 w-5" />,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-gradient-to-br from-blue-100 to-cyan-100',
      trend: 'up'
    },
    {
      title: 'Documents Generated',
      value: '456',
      change: '+8%',
      icon: <FileText className="h-5 w-5" />,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-gradient-to-br from-green-100 to-emerald-100',
      trend: 'up'
    },
    {
      title: 'Video Sessions',
      value: '89',
      change: '+15%',
      icon: <Video className="h-5 w-5" />,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-gradient-to-br from-purple-100 to-pink-100',
      trend: 'up'
    },
    {
      title: 'SMS Verifications',
      value: '2,567',
      change: '+5%',
      icon: <Smartphone className="h-5 w-5" />,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-gradient-to-br from-orange-100 to-red-100',
      trend: 'up'
    }
  ];

  const quickActions = [
    {
      title: 'Adaptive Onboarding',
      description: 'AI-powered recommendations',
      icon: <Brain className="h-6 w-6" />,
      color: 'from-purple-500 to-pink-500',
      href: '/adaptive-onboarding',
      badge: 'New'
    },
    {
      title: 'Risk Monitoring',
      description: 'Security threat detection',
      icon: <Activity className="h-6 w-6" />,
      color: 'from-red-500 to-orange-500',
      href: '/risk-monitoring'
    },
    {
      title: 'Document Generation',
      description: 'Create contracts & forms',
      icon: <FileText className="h-6 w-6" />,
      color: 'from-blue-500 to-cyan-500',
      href: '/documents'
    },
    {
      title: 'Video Onboarding',
      description: 'Interactive sessions',
      icon: <Video className="h-6 w-6" />,
      color: 'from-green-500 to-emerald-500',
      href: '/video-onboarding'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'Document Generated',
      description: 'Contract agreement for John Doe',
      time: '2 minutes ago',
      status: 'success',
      icon: <FileText className="h-4 w-4" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: 2,
      type: 'Video Session',
      description: 'Onboarding call with Sarah Smith',
      time: '15 minutes ago',
      status: 'success',
      icon: <Video className="h-4 w-4" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      id: 3,
      type: 'SMS Verification',
      description: 'Phone verification for Mike Johnson',
      time: '1 hour ago',
      status: 'success',
      icon: <Smartphone className="h-4 w-4" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 4,
      type: 'User Registration',
      description: 'New user account created',
      time: '2 hours ago',
      status: 'success',
      icon: <Users className="h-4 w-4" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      id: 5,
      type: 'Security Alert',
      description: 'Suspicious login attempt detected',
      time: '3 hours ago',
      status: 'warning',
      icon: <AlertCircle className="h-4 w-4" />,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ];

  const performanceMetrics = [
    {
      label: 'Onboarding Completion',
      value: 87,
      target: 90,
      color: 'bg-gradient-to-r from-green-500 to-emerald-500'
    },
    {
      label: 'User Satisfaction',
      value: 92,
      target: 95,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500'
    },
    {
      label: 'Security Score',
      value: 99,
      target: 100,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500'
    },
    {
      label: 'Response Time',
      value: 78,
      target: 80,
      color: 'bg-gradient-to-r from-orange-500 to-red-500'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading your dashboard...</h2>
          <p className="text-gray-500">Preparing your personalized experience</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {authState.user?.firstName || 'User'}! Here's what's happening today.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <BackendHealthCheck />
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search dashboard..."
                  className="w-64 pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button size="sm" onClick={() => navigate('/settings')}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card 
              key={stat.title}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                    <div className={`text-white bg-gradient-to-br ${stat.color}`}>
                      {stat.icon}
                    </div>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs font-medium ${
                      stat.trend === 'up' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                    }`}
                  >
                    {stat.change}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.title}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
            <Button variant="ghost" size="sm">
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Card 
                key={action.title}
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-md"
                onClick={() => navigate(action.href)}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                      {action.icon}
                    </div>
                    {action.badge && (
                      <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                        {action.badge}
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{action.description}</p>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Activities
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Metrics */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Performance Metrics
                  </CardTitle>
                  <CardDescription>
                    Track key performance indicators
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {performanceMetrics.map((metric) => (
                    <div key={metric.label} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-700">{metric.label}</span>
                        <span className="text-gray-600">{metric.value}% / {metric.target}%</span>
                      </div>
                      <div className="relative">
                        <Progress 
                          value={metric.value} 
                          className="h-2"
                        />
                        <div className={`absolute inset-0 rounded-full ${metric.color} opacity-20`}></div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activities
                  </CardTitle>
                  <CardDescription>
                    Latest system activities and events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className={`w-8 h-8 rounded-lg ${activity.bgColor} flex items-center justify-center flex-shrink-0`}>
                          <div className={activity.color}>
                            {activity.icon}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${
                            activity.status === 'success' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {activity.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Analytics
                </CardTitle>
                <CardDescription>
                  Detailed performance metrics and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Performance Analytics</h3>
                  <p className="text-gray-600">Detailed performance charts and analytics coming soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Activity Log
                </CardTitle>
                <CardDescription>
                  Complete activity history and audit trail
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                      <div className={`w-10 h-10 rounded-lg ${activity.bgColor} flex items-center justify-center flex-shrink-0`}>
                        <div className={activity.color}>
                          {activity.icon}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          activity.status === 'success' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Overview
                </CardTitle>
                <CardDescription>
                  Security status and threat monitoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Security Dashboard</h3>
                  <p className="text-gray-600">Security monitoring and threat detection features coming soon.</p>
                  <Button 
                    className="mt-4"
                    onClick={() => navigate('/risk-monitoring')}
                  >
                    View Security Monitoring
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
