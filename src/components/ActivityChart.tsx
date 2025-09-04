import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Activity, 
  Users, 
  FileText, 
  Video, 
  Smartphone, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Clock,
  BarChart3,
  LineChart,
  PieChart,
  Filter,
  RefreshCw
} from "lucide-react";

interface ActivityData {
  time: string;
  users: number;
  documents: number;
  videos: number;
  sms: number;
  total: number;
}

interface ActivityMetric {
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: string;
}

const ActivityChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [chartType, setChartType] = useState('line');
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setIsLoading(true);
    
    // Generate mock activity data
    const generateData = () => {
      const data: ActivityData[] = [];
      const now = new Date();
      
      for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        data.push({
          time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          users: Math.floor(Math.random() * 50) + 20,
          documents: Math.floor(Math.random() * 30) + 10,
          videos: Math.floor(Math.random() * 15) + 5,
          sms: Math.floor(Math.random() * 100) + 50,
          total: 0
        });
      }
      
      // Calculate totals
      data.forEach(item => {
        item.total = item.users + item.documents + item.videos + item.sms;
      });
      
      return data;
    };

    setTimeout(() => {
      setActivityData(generateData());
      setIsLoading(false);
    }, 1000);
  }, [timeRange]);

  const activityMetrics: ActivityMetric[] = [
    {
      name: 'Active Users',
      value: activityData.reduce((sum, item) => sum + item.users, 0),
      change: 12.5,
      trend: 'up',
      icon: <Users className="h-4 w-4" />,
      color: 'text-blue-600'
    },
    {
      name: 'Documents Generated',
      value: activityData.reduce((sum, item) => sum + item.documents, 0),
      change: 8.3,
      trend: 'up',
      icon: <FileText className="h-4 w-4" />,
      color: 'text-green-600'
    },
    {
      name: 'Video Sessions',
      value: activityData.reduce((sum, item) => sum + item.videos, 0),
      change: 15.7,
      trend: 'up',
      icon: <Video className="h-4 w-4" />,
      color: 'text-purple-600'
    },
    {
      name: 'SMS Verifications',
      value: activityData.reduce((sum, item) => sum + item.sms, 0),
      change: -2.1,
      trend: 'down',
      icon: <Smartphone className="h-4 w-4" />,
      color: 'text-orange-600'
    }
  ];

  const maxValue = Math.max(...activityData.map(item => item.total));

  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-gray-400 mx-auto mb-2 animate-spin" />
            <p className="text-gray-600">Loading activity data...</p>
          </div>
        </div>
      );
    }

    if (chartType === 'line') {
      return (
        <div className="h-64 relative">
          <svg className="w-full h-full" viewBox="0 0 800 200">
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1="0"
                y1={40 + i * 40}
                x2="800"
                y2={40 + i * 40}
                stroke="#f3f4f6"
                strokeWidth="1"
              />
            ))}
            
            {/* Activity line */}
            <polyline
              fill="none"
              stroke="#3b82f6"
              strokeWidth="3"
              points={activityData.map((item, index) => 
                `${(index / (activityData.length - 1)) * 800},${200 - (item.total / maxValue) * 160}`
              ).join(' ')}
            />
            
            {/* Data points */}
            {activityData.map((item, index) => (
              <circle
                key={index}
                cx={(index / (activityData.length - 1)) * 800}
                cy={200 - (item.total / maxValue) * 160}
                r="4"
                fill="#3b82f6"
                className="hover:r-6 transition-all"
              />
            ))}
          </svg>
          
          {/* Time labels */}
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            {activityData.filter((_, i) => i % 6 === 0).map((item, index) => (
              <span key={index}>{item.time}</span>
            ))}
          </div>
        </div>
      );
    }

    if (chartType === 'bar') {
      return (
        <div className="h-64 flex items-end justify-between space-x-1">
          {activityData.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-gradient-to-t from-blue-500 to-blue-600 rounded-t"
                style={{ height: `${(item.total / maxValue) * 200}px` }}
              />
              <span className="text-xs text-gray-500 mt-1">
                {index % 6 === 0 ? item.time : ''}
              </span>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Chart type not implemented</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Activity Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {activityMetrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg bg-gray-100 ${metric.color}`}>
                    {metric.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                    <p className="text-2xl font-bold">{metric.value.toLocaleString()}</p>
                  </div>
                </div>
                <div className={`flex items-center space-x-1 text-sm ${
                  metric.trend === 'up' ? 'text-green-600' : 
                  metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {metric.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : metric.trend === 'down' ? (
                    <TrendingDown className="h-4 w-4" />
                  ) : (
                    <Activity className="h-4 w-4" />
                  )}
                  <span>{Math.abs(metric.change).toFixed(1)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Activity Timeline
              </CardTitle>
              <CardDescription>Real-time activity monitoring</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="24h">24 Hours</SelectItem>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Line</SelectItem>
                  <SelectItem value="bar">Bar</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => setIsLoading(false), 500);
                }}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderChart()}
          
          {/* Activity Summary */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Peak Activity</p>
              <p className="text-xl font-bold text-blue-600">
                {Math.max(...activityData.map(item => item.total)).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">activities</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Average Activity</p>
              <p className="text-xl font-bold text-green-600">
                {Math.round(activityData.reduce((sum, item) => sum + item.total, 0) / activityData.length).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">per hour</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Activity</p>
              <p className="text-xl font-bold text-purple-600">
                {activityData.reduce((sum, item) => sum + item.total, 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">in {timeRange}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Activity Feed
          </CardTitle>
          <CardDescription>Live activity stream</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activityData.slice(-5).reverse().map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">
                      {item.total} activities recorded
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.users} users, {item.documents} documents, {item.videos} videos, {item.sms} SMS
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{item.time}</p>
                  <Badge variant="secondary" className="text-xs">
                    {item.total > 100 ? 'High' : item.total > 50 ? 'Medium' : 'Low'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityChart;
