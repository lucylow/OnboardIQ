import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  BarChart3,
  Smartphone,
  Video,
  FileText,
  Mail,
  Settings,
  Download,
  Filter,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Calendar,
  Target,
  Zap
} from 'lucide-react';

interface DashboardMetric {
  label: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: React.ReactNode;
  color: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  company: string;
  plan: string;
  status: 'active' | 'pending' | 'suspended';
  lastActive: string;
  onboardingProgress: number;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');

  // Mock data - in real app, this would come from API
  const metrics: DashboardMetric[] = [
    {
      label: 'Total Users',
      value: '2,847',
      change: 12.5,
      changeType: 'increase',
      icon: <Users className="h-4 w-4" />,
      color: 'text-blue-600'
    },
    {
      label: 'Conversion Rate',
      value: '94.2%',
      change: 8.3,
      changeType: 'increase',
      icon: <TrendingUp className="h-4 w-4" />,
      color: 'text-green-600'
    },
    {
      label: 'Avg Onboarding Time',
      value: '2.3 days',
      change: -15.2,
      changeType: 'decrease',
      icon: <Clock className="h-4 w-4" />,
      color: 'text-purple-600'
    },
    {
      label: 'Monthly Revenue',
      value: '$124,500',
      change: 23.1,
      changeType: 'increase',
      icon: <DollarSign className="h-4 w-4" />,
      color: 'text-orange-600'
    }
  ];

  const recentUsers: UserData[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@company.com',
      company: 'TechCorp Inc.',
      plan: 'Premium',
      status: 'active',
      lastActive: '2 hours ago',
      onboardingProgress: 85
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@startup.com',
      company: 'StartupXYZ',
      plan: 'Enterprise',
      status: 'pending',
      lastActive: '1 day ago',
      onboardingProgress: 45
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@enterprise.com',
      company: 'Enterprise Solutions',
      plan: 'Enterprise',
      status: 'active',
      lastActive: '3 hours ago',
      onboardingProgress: 92
    }
  ];

  const channelStats = [
    { channel: 'SMS', total: 1247, success: 98.2, icon: <Smartphone className="h-4 w-4" /> },
    { channel: 'Video', total: 892, success: 94.5, icon: <Video className="h-4 w-4" /> },
    { channel: 'Email', total: 2156, success: 96.8, icon: <Mail className="h-4 w-4" /> },
    { channel: 'Documents', total: 743, success: 99.1, icon: <FileText className="h-4 w-4" /> }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'Premium':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800">Premium</Badge>;
      case 'Enterprise':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Enterprise</Badge>;
      default:
        return <Badge variant="outline">Free</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Monitor your OnboardIQ platform performance and user activity
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Time Range:</span>
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1d">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setLoading(true)}
            disabled={loading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
                    <div className="flex items-center mt-2">
                      {metric.changeType === 'increase' ? (
                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${
                        metric.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.change}%
                      </span>
                      <span className="text-sm text-gray-500 ml-1">vs last period</span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center ${metric.color}`}>
                    {metric.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Channel Performance */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Channel Performance
                  </CardTitle>
                  <CardDescription>
                    Success rates across different communication channels
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {channelStats.map((stat, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
                            {stat.icon}
                          </div>
                          <div>
                            <p className="font-medium">{stat.channel}</p>
                            <p className="text-sm text-gray-500">{stat.total} total</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">{stat.success}%</p>
                          <Progress value={stat.success} className="w-20 h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="mr-2 h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Latest user actions and system events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { action: 'New user signed up', time: '2 minutes ago', type: 'success' },
                      { action: 'Document generated', time: '5 minutes ago', type: 'info' },
                      { action: 'Video session completed', time: '12 minutes ago', type: 'success' },
                      { action: 'Payment processed', time: '1 hour ago', type: 'success' },
                      { action: 'Support ticket created', time: '2 hours ago', type: 'warning' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'success' ? 'bg-green-500' :
                          activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            {/* Users Table */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                      Manage your platform users and their onboarding progress
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Company</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Plan</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Progress</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Last Active</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((user) => (
                        <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-sm text-gray-900">{user.company}</p>
                          </td>
                          <td className="py-3 px-4">
                            {getPlanBadge(user.plan)}
                          </td>
                          <td className="py-3 px-4">
                            {getStatusBadge(user.status)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <Progress value={user.onboardingProgress} className="w-16 h-2" />
                              <span className="text-sm text-gray-600">{user.onboardingProgress}%</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-sm text-gray-500">{user.lastActive}</p>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Conversion Funnel */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Conversion Funnel</CardTitle>
                  <CardDescription>
                    Track user progression through onboarding steps
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { step: 'Sign Up', users: 2847, conversion: 100 },
                      { step: 'Phone Verification', users: 2689, conversion: 94.5 },
                      { step: 'Video Tour', users: 2156, conversion: 75.7 },
                      { step: 'Document Setup', users: 1892, conversion: 66.5 },
                      { step: 'Team Invitation', users: 1247, conversion: 43.8 },
                      { step: 'First Value', users: 892, conversion: 31.3 }
                    ].map((funnel, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{funnel.step}</span>
                          <span className="text-sm text-gray-500">{funnel.users} users</span>
                        </div>
                        <Progress value={funnel.conversion} className="h-2" />
                        <p className="text-xs text-gray-500">{funnel.conversion}% conversion rate</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>
                    Key performance indicators and trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Average Session Duration</p>
                        <p className="text-2xl font-bold text-gray-900">12m 34s</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-green-600">+8.2%</p>
                        <p className="text-xs text-gray-500">vs last week</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
                        <p className="text-2xl font-bold text-gray-900">23.4%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-red-600">-2.1%</p>
                        <p className="text-xs text-gray-500">vs last week</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Support Tickets</p>
                        <p className="text-2xl font-bold text-gray-900">47</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-green-600">-12.5%</p>
                        <p className="text-xs text-gray-500">vs last week</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>
                  Configure your OnboardIQ platform settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">General Settings</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Auto-verification</span>
                          <Button variant="outline" size="sm">Enabled</Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Email notifications</span>
                          <Button variant="outline" size="sm">Enabled</Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">SMS notifications</span>
                          <Button variant="outline" size="sm">Enabled</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Security Settings</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">2FA requirement</span>
                          <Button variant="outline" size="sm">Required</Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Session timeout</span>
                          <Button variant="outline" size="sm">24 hours</Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">IP restrictions</span>
                          <Button variant="outline" size="sm">Disabled</Button>
                        </div>
                      </div>
                    </div>
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

export default AdminDashboard;
