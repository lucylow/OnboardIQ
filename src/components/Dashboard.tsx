import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { motion, AnimatePresence } from 'framer-motion';
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
  Search,
  Rocket,
  Award,
  Lightbulb,
  TrendingDown,
  Timer,
  PieChart,
  LineChart,
  BarChart,
  Target as TargetIcon,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  Plus,
  Minus,
  EyeOff
} from 'lucide-react';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import BackendHealthCheck from './BackendHealthCheck';

export const Dashboard: React.FC = () => {
  const [authState, setAuthState] = useState(authService.getAuthState());
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [realTimeData, setRealTimeData] = useState({
    activeUsers: 0,
    recentActivity: 0,
    systemHealth: 100
  });
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

    // Simulate real-time data updates
    const realTimeInterval = setInterval(() => {
      setRealTimeData(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3) - 1,
        recentActivity: prev.recentActivity + Math.floor(Math.random() * 5),
        systemHealth: Math.max(95, Math.min(100, prev.systemHealth + Math.floor(Math.random() * 6) - 3))
      }));
    }, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(realTimeInterval);
    };
  }, [authState.isAuthenticated, navigate]);

  const stats = [
    {
      id: 'users',
      title: 'Total Users',
      value: '1,234',
      change: '+12%',
      icon: <Users className="h-5 w-5" />,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-gradient-to-br from-blue-100 to-cyan-100',
      trend: 'up',
      details: {
        newUsers: 45,
        activeUsers: 890,
        churnedUsers: 12,
        conversionRate: '78%'
      }
    },
    {
      id: 'documents',
      title: 'Documents Generated',
      value: '456',
      change: '+8%',
      icon: <FileText className="h-5 w-5" />,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-gradient-to-br from-green-100 to-emerald-100',
      trend: 'up',
      details: {
        templates: 15,
        customDocs: 341,
        signedDocs: 234,
        pendingReview: 67
      }
    },
    {
      id: 'videos',
      title: 'Video Sessions',
      value: '89',
      change: '+15%',
      icon: <Video className="h-5 w-5" />,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-gradient-to-br from-purple-100 to-pink-100',
      trend: 'up',
      details: {
        scheduled: 23,
        completed: 66,
        cancelled: 8,
        avgDuration: '32min'
      }
    },
    {
      id: 'sms',
      title: 'SMS Verifications',
      value: '2,567',
      change: '+5%',
      icon: <Smartphone className="h-5 w-5" />,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-gradient-to-br from-orange-100 to-red-100',
      trend: 'up',
      details: {
        sent: 2567,
        delivered: 2489,
        verified: 2341,
        failed: 78
      }
    }
  ];

  const recentActivities = [
    {
      id: 1,
      user: 'John Doe',
      action: 'completed onboarding',
      time: '2 minutes ago',
      icon: <CheckCircle className="h-4 w-4 text-green-600" />,
      type: 'success'
    },
    {
      id: 2,
      user: 'Sarah Wilson',
      action: 'generated document',
      time: '5 minutes ago',
      icon: <FileText className="h-4 w-4 text-blue-600" />,
      type: 'info'
    },
    {
      id: 3,
      user: 'Mike Johnson',
      action: 'scheduled video call',
      time: '8 minutes ago',
      icon: <Video className="h-4 w-4 text-purple-600" />,
      type: 'info'
    },
    {
      id: 4,
      user: 'Lisa Chen',
      action: 'verified phone number',
      time: '12 minutes ago',
      icon: <Smartphone className="h-4 w-4 text-orange-600" />,
      type: 'success'
    }
  ];

  const quickActions = [
    {
      title: 'Generate Document',
      description: 'Create a new document',
      icon: <FileText className="h-6 w-6" />,
      color: 'from-blue-500 to-blue-600',
      action: () => navigate('/foxit-workflow')
    },
    {
      title: 'Schedule Call',
      description: 'Book a video session',
      icon: <Video className="h-6 w-6" />,
      color: 'from-purple-500 to-purple-600',
      action: () => navigate('/video-onboarding')
    },
    {
      title: 'View Analytics',
      description: 'Check performance metrics',
      icon: <BarChart3 className="h-6 w-6" />,
      color: 'from-green-500 to-green-600',
      action: () => navigate('/analytics')
    },
    {
      title: 'Team Settings',
      description: 'Manage team members',
      icon: <Users className="h-6 w-6" />,
      color: 'from-orange-500 to-orange-600',
      action: () => navigate('/team')
    }
  ];

  if (isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-screen"
      >
        <div className="text-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6"
          />
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-2xl font-bold text-gray-900 mb-2"
          >
            Loading Dashboard...
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-gray-600"
          >
            Preparing your personalized experience
          </motion.p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6 p-6"
    >
      {/* Enhanced Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between"
      >
        <div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-gray-900 flex items-center gap-3"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="w-8 h-8 text-blue-600" />
            </motion.div>
            Welcome back, {authState.user?.firstName || 'User'}!
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 mt-2"
          >
            Here's what's happening with your OnboardIQ platform
          </motion.p>
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="flex items-center gap-3"
        >
          <Badge variant="secondary" className="flex items-center gap-2 bg-green-100 text-green-700 border-green-200">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-green-500 rounded-full"
            />
            System Healthy
          </Badge>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </motion.div>
      </motion.div>

      {/* Enhanced Stats Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <AnimatePresence>
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
              }}
              onHoverStart={() => setHoveredStat(stat.id)}
              onHoverEnd={() => setHoveredStat(null)}
            >
              <Card className={`transition-all duration-300 cursor-pointer ${
                hoveredStat === stat.id ? 'ring-2 ring-blue-200' : ''
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className={`p-3 rounded-lg ${stat.bgColor}`}
                    >
                      {stat.icon}
                    </motion.div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 * index }}
                      className={`flex items-center gap-1 text-sm font-medium ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {stat.trend === 'up' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      {stat.change}
                    </motion.div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
                    <motion.div 
                      className="text-2xl font-bold text-gray-900"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 * index, type: "spring" }}
                    >
                      {stat.value}
                    </motion.div>
                  </div>
                  
                  {/* Enhanced Details on Hover */}
                  <AnimatePresence>
                    {hoveredStat === stat.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pt-4 border-t border-gray-100"
                      >
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {Object.entries(stat.details).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                              <span className="font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Enhanced Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Activity className="w-4 h-4 mr-2" />
              Activity
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="actions" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Rocket className="w-4 h-4 mr-2" />
              Quick Actions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="lg:col-span-2"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>Latest user actions and system events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <AnimatePresence>
                        {recentActivities.map((activity, index) => (
                          <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index }}
                            whileHover={{ x: 5 }}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <motion.div
                              whileHover={{ scale: 1.2 }}
                              transition={{ type: "spring" }}
                            >
                              {activity.icon}
                            </motion.div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">
                                <span className="text-gray-900">{activity.user}</span>
                                <span className="text-gray-600"> {activity.action}</span>
                              </p>
                              <p className="text-xs text-gray-500">{activity.time}</p>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* System Health */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      System Health
                    </CardTitle>
                    <CardDescription>Real-time system status</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Overall Health</span>
                        <span className="text-sm font-bold text-green-600">{realTimeData.systemHealth}%</span>
                      </div>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${realTimeData.systemHealth}%` }}
                        transition={{ duration: 1, delay: 1.0 }}
                        className="h-2 bg-gray-200 rounded-full overflow-hidden"
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 1, delay: 1.2 }}
                          className="h-full bg-gradient-to-r from-green-500 to-green-600"
                        />
                      </motion.div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Active Users</span>
                        <span className="font-medium">{realTimeData.activeUsers}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Recent Activity</span>
                        <span className="font-medium">{realTimeData.recentActivity}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Activity Timeline
                  </CardTitle>
                  <CardDescription>Detailed activity breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Activity Chart Placeholder */}
                    <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Activity chart will be displayed here</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Performance Analytics
                  </CardTitle>
                  <CardDescription>Key performance indicators and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Conversion Rate */}
                    <div className="space-y-3">
                      <h3 className="font-semibold">Conversion Rate</h3>
                      <div className="text-3xl font-bold text-green-600">78.5%</div>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "78.5%" }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-3 bg-gray-200 rounded-full overflow-hidden"
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 1, delay: 0.7 }}
                          className="h-full bg-gradient-to-r from-green-500 to-green-600"
                        />
                      </motion.div>
                    </div>
                    
                    {/* User Engagement */}
                    <div className="space-y-3">
                      <h3 className="font-semibold">User Engagement</h3>
                      <div className="text-3xl font-bold text-blue-600">92.3%</div>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "92.3%" }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="h-3 bg-gray-200 rounded-full overflow-hidden"
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 1, delay: 0.8 }}
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                        />
                      </motion.div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="actions" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Rocket className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <AnimatePresence>
                      {quickActions.map((action, index) => (
                        <motion.div
                          key={action.title}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 * index }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            onClick={action.action}
                            className={`w-full h-24 flex flex-col items-center justify-center gap-2 bg-gradient-to-r ${action.color} hover:shadow-lg transition-all duration-200`}
                          >
                            <motion.div
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                            >
                              {action.icon}
                            </motion.div>
                            <div className="text-center">
                              <div className="font-semibold">{action.title}</div>
                              <div className="text-xs opacity-90">{action.description}</div>
                            </div>
                          </Button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
