import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  LineChart,
  Activity,
  Users,
  Target,
  Clock,
  Star,
  Zap,
  Sparkles,
  Rocket,
  Lightbulb,
  Award,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  Eye,
  EyeOff,
  Filter,
  Calendar,
  BarChart,
  Target as TargetIcon
} from 'lucide-react';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
  }[];
}

interface MetricCard {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const DynamicCharts: React.FC = () => {
  const [activeChart, setActiveChart] = useState('users');
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [chartData, setChartData] = useState<ChartData>({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Users',
      data: [65, 78, 90, 85, 95, 110],
      backgroundColor: ['rgba(59, 130, 246, 0.2)'],
      borderColor: ['rgba(59, 130, 246, 1)']
    }]
  });

  const [realTimeMetrics, setRealTimeMetrics] = useState({
    activeUsers: 1247,
    conversionRate: 78.5,
    avgSessionTime: 12.3,
    bounceRate: 23.1
  });

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setRealTimeMetrics(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10) - 5,
        conversionRate: Math.max(70, Math.min(85, prev.conversionRate + (Math.random() - 0.5) * 2)),
        avgSessionTime: Math.max(10, Math.min(15, prev.avgSessionTime + (Math.random() - 0.5) * 0.5)),
        bounceRate: Math.max(20, Math.min(30, prev.bounceRate + (Math.random() - 0.5) * 1))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const metricCards: MetricCard[] = [
    {
      title: 'Active Users',
      value: realTimeMetrics.activeUsers.toLocaleString(),
      change: '+12.5%',
      trend: 'up',
      icon: <Users className="h-5 w-5" />,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-gradient-to-br from-blue-100 to-cyan-100'
    },
    {
      title: 'Conversion Rate',
      value: `${realTimeMetrics.conversionRate.toFixed(1)}%`,
      change: '+5.2%',
      trend: 'up',
      icon: <Target className="h-5 w-5" />,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-gradient-to-br from-green-100 to-emerald-100'
    },
    {
      title: 'Avg Session Time',
      value: `${realTimeMetrics.avgSessionTime.toFixed(1)}m`,
      change: '-2.1%',
      trend: 'down',
      icon: <Clock className="h-5 w-5" />,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-gradient-to-br from-orange-100 to-red-100'
    },
    {
      title: 'Bounce Rate',
      value: `${realTimeMetrics.bounceRate.toFixed(1)}%`,
      change: '-8.3%',
      trend: 'up',
      icon: <Activity className="h-5 w-5" />,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-gradient-to-br from-purple-100 to-pink-100'
    }
  ];

  const chartTypes = [
    { id: 'users', name: 'User Growth', icon: <Users className="w-4 h-4" /> },
    { id: 'conversion', name: 'Conversion', icon: <Target className="w-4 h-4" /> },
    { id: 'engagement', name: 'Engagement', icon: <Activity className="w-4 h-4" /> },
    { id: 'revenue', name: 'Revenue', icon: <TrendingUp className="w-4 h-4" /> }
  ];

  const generateChartData = (type: string): ChartData => {
    const baseData = {
      users: [65, 78, 90, 85, 95, 110],
      conversion: [45, 52, 58, 62, 68, 72],
      engagement: [78, 82, 85, 88, 91, 94],
      revenue: [12000, 14500, 16800, 18200, 19500, 21000]
    };

    const colors = {
      users: ['rgba(59, 130, 246, 0.2)', 'rgba(59, 130, 246, 1)'],
      conversion: ['rgba(34, 197, 94, 0.2)', 'rgba(34, 197, 94, 1)'],
      engagement: ['rgba(168, 85, 247, 0.2)', 'rgba(168, 85, 247, 1)'],
      revenue: ['rgba(245, 158, 11, 0.2)', 'rgba(245, 158, 11, 1)']
    };

    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: type.charAt(0).toUpperCase() + type.slice(1),
        data: baseData[type as keyof typeof baseData] || baseData.users,
        backgroundColor: [colors[type as keyof typeof colors]?.[0] || colors.users[0]],
        borderColor: [colors[type as keyof typeof colors]?.[1] || colors.users[1]]
      }]
    };
  };

  const handleChartChange = (type: string) => {
    setIsLoading(true);
    setActiveChart(type);
    setChartData(generateChartData(type));
    
    setTimeout(() => setIsLoading(false), 500);
  };

  const renderBarChart = () => (
    <div className="h-64 flex items-end justify-between gap-2 px-4">
      {chartData.datasets[0].data.map((value, index) => (
        <motion.div
          key={index}
          initial={{ height: 0 }}
          animate={{ height: `${(value / Math.max(...chartData.datasets[0].data)) * 100}%` }}
          transition={{ duration: 0.8, delay: index * 0.1 }}
          className="relative flex-1 bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-lg min-h-[20px]"
          style={{ maxHeight: '200px' }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600"
          >
            {value}
          </motion.div>
        </motion.div>
      ))}
    </div>
  );

  const renderLineChart = () => (
    <div className="h-64 relative">
      <svg className="w-full h-full" viewBox="0 0 400 200">
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          d="M 50 150 L 100 120 L 150 100 L 200 110 L 250 80 L 300 60"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
        {chartData.datasets[0].data.map((value, index) => (
          <motion.circle
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            cx={50 + index * 50}
            cy={200 - (value / Math.max(...chartData.datasets[0].data)) * 140}
            r="4"
            fill="#3B82F6"
          />
        ))}
      </svg>
    </div>
  );

  const renderPieChart = () => (
    <div className="h-64 flex items-center justify-center">
      <div className="relative w-32 h-32">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="w-full h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
        />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1 }}
          className="absolute inset-4 bg-white rounded-full flex items-center justify-center"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {chartData.datasets[0].data.reduce((a, b) => a + b, 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6 p-6"
    >
      {/* Header */}
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
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </motion.div>
            Dynamic Analytics
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 mt-2"
          >
            Real-time data visualization and performance metrics
          </motion.p>
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          <Badge variant="secondary" className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-200">
            <Sparkles className="w-4 h-4" />
            Live Data
          </Badge>
        </motion.div>
      </motion.div>

      {/* Metric Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <AnimatePresence>
          {metricCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
              }}
              onHoverStart={() => setShowDetails(card.title)}
              onHoverEnd={() => setShowDetails(null)}
            >
              <Card className="transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className={`p-3 rounded-lg ${card.bgColor}`}
                    >
                      {card.icon}
                    </motion.div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2 * index }}
                      className={`flex items-center gap-1 text-sm font-medium ${
                        card.trend === 'up' ? 'text-green-600' : card.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}
                    >
                      {card.trend === 'up' ? <ChevronUp className="w-4 h-4" /> : 
                       card.trend === 'down' ? <ChevronDown className="w-4 h-4" /> : null}
                      {card.change}
                    </motion.div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
                    <motion.div 
                      className="text-2xl font-bold text-gray-900"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 * index, type: "spring" }}
                    >
                      {card.value}
                    </motion.div>
                  </div>
                  
                  {/* Animated Details */}
                  <AnimatePresence>
                    {showDetails === card.title && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 pt-4 border-t border-gray-100"
                      >
                        <div className="text-xs text-gray-500">
                          <div className="flex justify-between mb-1">
                            <span>Previous Period:</span>
                            <span>{typeof card.value === 'number' ? (card.value * 0.9).toFixed(1) : card.value}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Growth:</span>
                            <span className={card.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                              {card.change}
                            </span>
                          </div>
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

      {/* Chart Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Interactive Charts
            </CardTitle>
            <CardDescription>Select different chart types and data views</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Chart Type Selector */}
              <div className="flex flex-wrap gap-2">
                {chartTypes.map((type) => (
                  <motion.div
                    key={type.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant={activeChart === type.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleChartChange(type.id)}
                      className="flex items-center gap-2"
                    >
                      {type.icon}
                      {type.name}
                    </Button>
                  </motion.div>
                ))}
              </div>

              {/* Chart Display */}
              <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4">
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full flex items-center justify-center"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key={activeChart}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="h-full"
                    >
                      {activeChart === 'users' && renderBarChart()}
                      {activeChart === 'conversion' && renderLineChart()}
                      {activeChart === 'engagement' && renderPieChart()}
                      {activeChart === 'revenue' && renderBarChart()}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Chart Labels */}
              <div className="flex justify-between text-sm text-gray-600">
                {chartData.labels.map((label, index) => (
                  <motion.span
                    key={label}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    {label}
                  </motion.span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Performance Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Performance Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: 'User Growth', target: 1000, current: 1247, color: 'from-green-500 to-green-600' },
              { name: 'Conversion Rate', target: 75, current: 78.5, color: 'from-blue-500 to-blue-600' },
              { name: 'Engagement', target: 90, current: 92.3, color: 'from-purple-500 to-purple-600' }
            ].map((goal, index) => (
              <motion.div
                key={goal.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="space-y-2"
              >
                <div className="flex justify-between text-sm">
                  <span>{goal.name}</span>
                  <span className="font-medium">{goal.current}/{goal.target}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (goal.current / goal.target) * 100)}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    className={`h-full bg-gradient-to-r ${goal.color}`}
                  />
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Real-time Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: 'Active Sessions', value: 45, icon: <Users className="w-4 h-4" /> },
                { label: 'API Calls/min', value: 234, icon: <Zap className="w-4 h-4" /> },
                { label: 'Data Processed', value: '2.1GB', icon: <BarChart3 className="w-4 h-4" /> }
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-blue-600"
                    >
                      {item.icon}
                    </motion.div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{item.value}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default DynamicCharts;


