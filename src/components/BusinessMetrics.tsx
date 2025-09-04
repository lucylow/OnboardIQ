import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Target, 
  BarChart3,
  Activity,
  Calendar,
  Clock,
  Star,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Zap,
  Shield,
  Globe,
  Building,
  PieChart,
  LineChart,
  BarChart
} from "lucide-react";

interface Metric {
  name: string;
  value: number;
  previousValue: number;
  change: number;
  changeType: 'percentage' | 'absolute';
  trend: 'up' | 'down' | 'stable';
  format: 'currency' | 'number' | 'percentage' | 'decimal';
  target?: number;
  status: 'good' | 'warning' | 'critical';
  description: string;
}

interface BusinessMetric {
  category: string;
  metrics: Metric[];
}

const BusinessMetrics: React.FC = () => {
  const [currentPeriod, setCurrentPeriod] = useState('month');
  const [metrics, setMetrics] = useState<BusinessMetric[]>([]);

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setMetrics([
        {
          category: 'Revenue Metrics',
          metrics: [
            {
              name: 'Monthly Recurring Revenue (MRR)',
              value: 125000,
              previousValue: 118000,
              change: 5.9,
              changeType: 'percentage',
              trend: 'up',
              format: 'currency',
              target: 150000,
              status: 'good',
              description: 'Total monthly recurring revenue from all subscriptions'
            },
            {
              name: 'Annual Recurring Revenue (ARR)',
              value: 1500000,
              previousValue: 1416000,
              change: 5.9,
              changeType: 'percentage',
              trend: 'up',
              format: 'currency',
              target: 1800000,
              status: 'good',
              description: 'Annualized recurring revenue'
            },
            {
              name: 'Average Revenue Per User (ARPU)',
              value: 534,
              previousValue: 512,
              change: 4.3,
              changeType: 'percentage',
              trend: 'up',
              format: 'currency',
              status: 'good',
              description: 'Average monthly revenue per customer'
            },
            {
              name: 'Customer Lifetime Value (CLV)',
              value: 6420,
              previousValue: 6144,
              change: 4.5,
              changeType: 'percentage',
              trend: 'up',
              format: 'currency',
              status: 'good',
              description: 'Total revenue expected from a customer'
            }
          ]
        },
        {
          category: 'Customer Metrics',
          metrics: [
            {
              name: 'Total Customers',
              value: 234,
              previousValue: 216,
              change: 8.3,
              changeType: 'percentage',
              trend: 'up',
              format: 'number',
              target: 300,
              status: 'good',
              description: 'Total number of active customers'
            },
            {
              name: 'Customer Churn Rate',
              value: 2.3,
              previousValue: 2.8,
              change: -17.9,
              changeType: 'percentage',
              trend: 'down',
              format: 'percentage',
              target: 2.0,
              status: 'good',
              description: 'Percentage of customers who cancel per month'
            },
            {
              name: 'Net Revenue Retention',
              value: 112,
              previousValue: 108,
              change: 3.7,
              changeType: 'percentage',
              trend: 'up',
              format: 'percentage',
              target: 110,
              status: 'good',
              description: 'Revenue retention including expansion'
            },
            {
              name: 'Customer Health Score',
              value: 78,
              previousValue: 75,
              change: 4.0,
              changeType: 'percentage',
              trend: 'up',
              format: 'percentage',
              target: 80,
              status: 'warning',
              description: 'Average customer health score'
            }
          ]
        },
        {
          category: 'Sales Metrics',
          metrics: [
            {
              name: 'Sales Pipeline Value',
              value: 755000,
              previousValue: 680000,
              change: 11.0,
              changeType: 'percentage',
              trend: 'up',
              format: 'currency',
              target: 1000000,
              status: 'good',
              description: 'Total value of deals in pipeline'
            },
            {
              name: 'Win Rate',
              value: 68,
              previousValue: 65,
              change: 4.6,
              changeType: 'percentage',
              trend: 'up',
              format: 'percentage',
              target: 70,
              status: 'good',
              description: 'Percentage of deals won'
            },
            {
              name: 'Average Deal Size',
              value: 151000,
              previousValue: 142000,
              change: 6.3,
              changeType: 'percentage',
              trend: 'up',
              format: 'currency',
              target: 150000,
              status: 'good',
              description: 'Average value of closed deals'
            },
            {
              name: 'Sales Cycle Length',
              value: 45,
              previousValue: 52,
              change: -13.5,
              changeType: 'percentage',
              trend: 'down',
              format: 'number',
              target: 45,
              status: 'good',
              description: 'Average days to close a deal'
            }
          ]
        },
        {
          category: 'Operational Metrics',
          metrics: [
            {
              name: 'System Uptime',
              value: 99.9,
              previousValue: 99.8,
              change: 0.1,
              changeType: 'percentage',
              trend: 'up',
              format: 'percentage',
              target: 99.9,
              status: 'good',
              description: 'System availability percentage'
            },
            {
              name: 'Support Response Time',
              value: 2.3,
              previousValue: 3.1,
              change: -25.8,
              changeType: 'percentage',
              trend: 'down',
              format: 'decimal',
              target: 4.0,
              status: 'good',
              description: 'Average response time in hours'
            },
            {
              name: 'Feature Adoption Rate',
              value: 72,
              previousValue: 68,
              change: 5.9,
              changeType: 'percentage',
              trend: 'up',
              format: 'percentage',
              target: 75,
              status: 'warning',
              description: 'Percentage of customers using key features'
            },
            {
              name: 'Customer Satisfaction',
              value: 4.8,
              previousValue: 4.6,
              change: 4.3,
              changeType: 'percentage',
              trend: 'up',
              format: 'decimal',
              target: 4.5,
              status: 'good',
              description: 'Average customer satisfaction score'
            }
          ]
        }
      ]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatValue = (metric: Metric) => {
    switch (metric.format) {
      case 'currency':
        return `$${metric.value.toLocaleString()}`;
      case 'percentage':
        return `${metric.value}%`;
      case 'decimal':
        return metric.value.toFixed(1);
      default:
        return metric.value.toLocaleString();
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getChangeColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Business Metrics</h2>
          <p className="text-gray-600 mt-1">Key performance indicators and business health</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">Real-time</Badge>
          <Badge variant="secondary">Updated every minute</Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.flatMap(category => category.metrics).slice(0, 8).map((metric, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                    {getTrendIcon(metric.trend)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                      {formatValue(metric)}
                    </div>
                    <div className={`flex items-center space-x-1 text-sm ${getChangeColor(metric.trend)}`}>
                      {metric.trend === 'up' ? (
                        <ArrowUpRight className="h-3 w-3" />
                      ) : metric.trend === 'down' ? (
                        <ArrowDownRight className="h-3 w-3" />
                      ) : (
                        <Minus className="h-3 w-3" />
                      )}
                      <span>{Math.abs(metric.change).toFixed(1)}%</span>
                    </div>
                  </div>
                  {metric.target && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Target: {metric.format === 'currency' ? `$${metric.target.toLocaleString()}` : metric.target}</span>
                        <span>{Math.round((metric.value / metric.target) * 100)}%</span>
                      </div>
                      <Progress value={(metric.value / metric.target) * 100} className="h-2" />
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-2">{metric.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {metrics.find(cat => cat.category === 'Revenue Metrics')?.metrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    {metric.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-bold text-green-600">{formatValue(metric)}</span>
                      <div className={`flex items-center space-x-1 ${getChangeColor(metric.trend)}`}>
                        {getTrendIcon(metric.trend)}
                        <span className="text-sm">{Math.abs(metric.change).toFixed(1)}%</span>
                      </div>
                    </div>
                    {metric.target && (
                      <div>
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                          <span>Target: {metric.format === 'currency' ? `$${metric.target.toLocaleString()}` : metric.target}</span>
                          <span>{Math.round((metric.value / metric.target) * 100)}%</span>
                        </div>
                        <Progress value={(metric.value / metric.target) * 100} />
                      </div>
                    )}
                    <p className="text-sm text-gray-600">{metric.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {metrics.find(cat => cat.category === 'Customer Metrics')?.metrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    {metric.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`text-3xl font-bold ${getStatusColor(metric.status)}`}>
                        {formatValue(metric)}
                      </span>
                      <div className={`flex items-center space-x-1 ${getChangeColor(metric.trend)}`}>
                        {getTrendIcon(metric.trend)}
                        <span className="text-sm">{Math.abs(metric.change).toFixed(1)}%</span>
                      </div>
                    </div>
                    {metric.target && (
                      <div>
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                          <span>Target: {metric.target}</span>
                          <span>{Math.round((metric.value / metric.target) * 100)}%</span>
                        </div>
                        <Progress value={(metric.value / metric.target) * 100} />
                      </div>
                    )}
                    <p className="text-sm text-gray-600">{metric.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="operations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {metrics.find(cat => cat.category === 'Operational Metrics')?.metrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    {metric.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`text-3xl font-bold ${getStatusColor(metric.status)}`}>
                        {formatValue(metric)}
                      </span>
                      <div className={`flex items-center space-x-1 ${getChangeColor(metric.trend)}`}>
                        {getTrendIcon(metric.trend)}
                        <span className="text-sm">{Math.abs(metric.change).toFixed(1)}%</span>
                      </div>
                    </div>
                    {metric.target && (
                      <div>
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                          <span>Target: {metric.target}</span>
                          <span>{Math.round((metric.value / metric.target) * 100)}%</span>
                        </div>
                        <Progress value={(metric.value / metric.target) * 100} />
                      </div>
                    )}
                    <p className="text-sm text-gray-600">{metric.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessMetrics;
