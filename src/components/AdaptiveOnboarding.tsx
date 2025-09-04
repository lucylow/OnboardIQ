import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { aiService } from '@/services/aiService';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Play, 
  BookOpen, 
  MessageSquare,
  CheckCircle,
  Clock,
  Star,
  Zap,
  Sparkles,
  Rocket,
  Lightbulb,
  Award,
  Users,
  BarChart3,
  Activity,
  Shield,
  Globe,
  ArrowRight,
  ChevronRight,
  Sparkle,
  Target as TargetIcon,
  Timer,
  TrendingDown,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react';

interface Recommendation {
  id: string;
  type: 'video' | 'document' | 'interaction' | 'learning';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: number;
  confidence: number;
  actionUrl?: string;
  completed: boolean;
  category: string;
  impact: 'high' | 'medium' | 'low';
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

interface AIAgent {
  id: string;
  name: string;
  type: 'intake' | 'personalization' | 'execution' | 'monitoring';
  status: 'active' | 'inactive' | 'training';
  accuracy: number;
  decisions: number;
  trainedDate: string;
  performance: {
    last24h: number;
    last7d: number;
    last30d: number;
    improvement: number;
  };
  capabilities: string[];
  currentTask?: string;
  confidence: number;
}

interface UserBehavior {
  featureVisits: Record<string, number>;
  timeSpent: Record<string, number>;
  interactions: Array<{
    type: string;
    timestamp: Date;
    duration: number;
  }>;
  preferences: {
    learningStyle: 'visual' | 'auditory' | 'kinesthetic';
    pace: 'fast' | 'moderate' | 'slow';
    complexity: 'basic' | 'intermediate' | 'advanced';
  };
  engagement: {
    dailyActive: number;
    weeklyActive: number;
    monthlyActive: number;
    streak: number;
  };
}

const AdaptiveOnboarding: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [userBehavior, setUserBehavior] = useState<UserBehavior | null>(null);
  const [aiAgents, setAiAgents] = useState<AIAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('recommendations');
  const [hoveredRecommendation, setHoveredRecommendation] = useState<string | null>(null);
  const [showConfidence, setShowConfidence] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadUserBehaviorAndRecommendations();
  }, []);

  const loadUserBehaviorAndRecommendations = async () => {
    try {
      setLoading(true);
      
      // Load AI agents data
      const agents = await aiService.getAgents();
      setAiAgents(agents);
      
      // Load user behavior and recommendations
      const behavior = await aiService.analyzeUserBehavior([], {});
      const recs = await aiService.generateRecommendations({}, behavior);
      
      // Transform AI recommendations to match our interface
      const transformedRecs = recs.map((rec: any) => ({
        ...rec,
        category: rec.category || 'General',
        impact: (rec.impact || 'medium') as 'high' | 'medium' | 'low',
        difficulty: (rec.difficulty || 'medium') as 'easy' | 'medium' | 'hard',
        tags: rec.tags || [],
        type: rec.type as 'video' | 'document' | 'interaction' | 'learning'
      }));
      
      setUserBehavior({
        featureVisits: {
          'dashboard': 15,
          'analytics': 8,
          'documents': 12,
          'security': 5,
          'onboarding': 20,
          'team': 3
        },
        timeSpent: {
          'dashboard': 45,
          'analytics': 20,
          'documents': 30,
          'security': 15,
          'onboarding': 60,
          'team': 10
        },
        interactions: [
          { type: 'page_view', timestamp: new Date(), duration: 120 },
          { type: 'button_click', timestamp: new Date(), duration: 5 },
          { type: 'form_submit', timestamp: new Date(), duration: 30 },
          { type: 'document_view', timestamp: new Date(), duration: 45 },
          { type: 'video_watch', timestamp: new Date(), duration: 180 }
        ],
        preferences: {
          learningStyle: behavior.learningStyle as 'visual' | 'auditory' | 'kinesthetic',
          pace: behavior.pace,
          complexity: behavior.complexity
        },
        engagement: {
          dailyActive: 5,
          weeklyActive: 4,
          monthlyActive: 3,
          streak: 7
        }
      });
      
      setRecommendations(transformedRecs);
    } catch (error) {
      console.error('Error loading adaptive data:', error);
      // Fallback to enhanced mock data
      setEnhancedMockData();
    } finally {
      setLoading(false);
    }
  };

  const setEnhancedMockData = () => {
    setUserBehavior({
      featureVisits: {
        'dashboard': 15,
        'analytics': 8,
        'documents': 12,
        'security': 5,
        'onboarding': 20,
        'team': 3
      },
      timeSpent: {
        'dashboard': 45,
        'analytics': 20,
        'documents': 30,
        'security': 15,
        'onboarding': 60,
        'team': 10
      },
      interactions: [
        { type: 'page_view', timestamp: new Date(), duration: 120 },
        { type: 'button_click', timestamp: new Date(), duration: 5 },
        { type: 'form_submit', timestamp: new Date(), duration: 30 },
        { type: 'document_view', timestamp: new Date(), duration: 45 },
        { type: 'video_watch', timestamp: new Date(), duration: 180 }
      ],
      preferences: {
        learningStyle: 'visual',
        pace: 'moderate',
        complexity: 'intermediate'
      },
      engagement: {
        dailyActive: 5,
        weeklyActive: 4,
        monthlyActive: 3,
        streak: 7
      }
    });

    setAiAgents([
      {
        id: 'intake-agent',
        name: 'Intake Agent',
        type: 'intake',
        status: 'active',
        accuracy: 98.5,
        decisions: 1247,
        trainedDate: '1/15/2024',
        performance: {
          last24h: 45,
          last7d: 312,
          last30d: 1247,
          improvement: 2.3
        },
        capabilities: ['Document Processing', 'Data Extraction', 'Form Recognition', 'Quality Validation'],
        currentTask: 'Processing onboarding documents',
        confidence: 0.985
      },
      {
        id: 'personalization-agent',
        name: 'Personalization Agent',
        type: 'personalization',
        status: 'active',
        accuracy: 96.2,
        decisions: 892,
        trainedDate: '1/14/2024',
        performance: {
          last24h: 32,
          last7d: 224,
          last30d: 892,
          improvement: 1.8
        },
        capabilities: ['User Profiling', 'Content Adaptation', 'Learning Path Optimization', 'Preference Learning'],
        currentTask: 'Optimizing user experience',
        confidence: 0.962
      },
      {
        id: 'execution-agent',
        name: 'Execution Agent',
        type: 'execution',
        status: 'active',
        accuracy: 99.1,
        decisions: 567,
        trainedDate: '1/13/2024',
        performance: {
          last24h: 18,
          last7d: 142,
          last30d: 567,
          improvement: 3.1
        },
        capabilities: ['Workflow Automation', 'Task Execution', 'Process Orchestration', 'Error Handling'],
        currentTask: 'Executing onboarding workflows',
        confidence: 0.991
      },
      {
        id: 'monitoring-agent',
        name: 'Monitoring Agent',
        type: 'monitoring',
        status: 'active',
        accuracy: 97.8,
        decisions: 2341,
        trainedDate: '1/16/2024',
        performance: {
          last24h: 78,
          last7d: 586,
          last30d: 2341,
          improvement: 1.5
        },
        capabilities: ['Performance Tracking', 'Anomaly Detection', 'Alert Management', 'Analytics Reporting'],
        currentTask: 'Monitoring system performance',
        confidence: 0.978
      }
    ]);

    setRecommendations([
      {
        id: '1',
        type: 'video',
        title: 'Advanced Analytics Dashboard Walkthrough',
        description: 'Based on your frequent visits to analytics, learn how to leverage advanced reporting features for better insights.',
        priority: 'high',
        estimatedTime: 8,
        confidence: 0.92,
        actionUrl: '/video/analytics-advanced',
        completed: false,
        category: 'Analytics',
        impact: 'high',
        difficulty: 'medium',
        tags: ['analytics', 'dashboard', 'reporting']
      },
      {
        id: '2',
        type: 'document',
        title: 'Security Best Practices Guide',
        description: 'Complete your security setup with our comprehensive best practices guide tailored to your industry.',
        priority: 'medium',
        estimatedTime: 15,
        confidence: 0.78,
        actionUrl: '/documents/security-guide',
        completed: false,
        category: 'Security',
        impact: 'high',
        difficulty: 'easy',
        tags: ['security', 'compliance', 'best-practices']
      },
      {
        id: '3',
        type: 'interaction',
        title: 'Document Workflow Optimization',
        description: 'Streamline your document processes based on your usage patterns and team collaboration needs.',
        priority: 'high',
        estimatedTime: 12,
        confidence: 0.85,
        actionUrl: '/onboarding/document-workflow',
        completed: false,
        category: 'Workflow',
        impact: 'medium',
        difficulty: 'medium',
        tags: ['workflow', 'automation', 'collaboration']
      },
      {
        id: '4',
        type: 'learning',
        title: 'AI-Powered Insights Deep Dive',
        description: 'Master the AI features that can transform your onboarding experience and boost user engagement.',
        priority: 'medium',
        estimatedTime: 20,
        confidence: 0.73,
        actionUrl: '/learning/ai-insights',
        completed: false,
        category: 'AI',
        impact: 'high',
        difficulty: 'hard',
        tags: ['ai', 'insights', 'personalization']
      },
      {
        id: '5',
        type: 'video',
        title: 'Team Collaboration Features',
        description: 'Discover how to effectively manage team permissions and collaboration workflows.',
        priority: 'low',
        estimatedTime: 10,
        confidence: 0.68,
        actionUrl: '/video/team-collaboration',
        completed: false,
        category: 'Team',
        impact: 'medium',
        difficulty: 'easy',
        tags: ['team', 'collaboration', 'permissions']
      }
    ]);
  };

  const handleRecommendationAction = async (recommendation: Recommendation) => {
    try {
      // Show loading toast with animation
      toast({
        title: "Starting recommendation...",
        description: `Preparing ${recommendation.title} for you.`,
      });

      // Track the action for AI learning
      await fetch('/api/ai/track-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recommendationId: recommendation.id,
          action: 'started',
          timestamp: new Date()
        })
      });

      // Map recommendation types to existing routes
      const routeMap: Record<string, string> = {
        'video': '/onboarding',
        'document': '/foxit-workflow',
        'interaction': '/onboarding',
        'learning': '/analytics'
      };

      // Get the appropriate route based on recommendation type
      const targetRoute = routeMap[recommendation.type] || '/dashboard';
      
      // Show success toast
      toast({
        title: "Recommendation started!",
        description: `Redirecting you to ${recommendation.title}.`,
      });
      
      // Navigate to the appropriate route after a short delay
      setTimeout(() => {
        window.location.href = targetRoute;
      }, 1000);
      
    } catch (error) {
      console.error('Error tracking action:', error);
      
      // Show error toast
      toast({
        title: "Something went wrong",
        description: "Unable to start the recommendation. Please try again.",
        variant: "destructive",
      });
      
      // Fallback navigation
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="w-4 h-4" />;
      case 'document': return <BookOpen className="w-4 h-4" />;
      case 'interaction': return <MessageSquare className="w-4 h-4" />;
      case 'learning': return <Brain className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Analytics': return <BarChart3 className="w-4 h-4" />;
      case 'Security': return <Shield className="w-4 h-4" />;
      case 'Workflow': return <Activity className="w-4 h-4" />;
      case 'AI': return <Brain className="w-4 h-4" />;
      case 'Team': return <Users className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getAgentIcon = (type: string) => {
    switch (type) {
      case 'intake': return <BookOpen className="w-5 h-5" />;
      case 'personalization': return <Target className="w-5 h-5" />;
      case 'execution': return <Play className="w-5 h-5" />;
      case 'monitoring': return <Activity className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  const getAgentColor = (type: string) => {
    switch (type) {
      case 'intake': return 'from-blue-500 to-blue-600';
      case 'personalization': return 'from-purple-500 to-purple-600';
      case 'execution': return 'from-green-500 to-green-600';
      case 'monitoring': return 'from-orange-500 to-orange-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'training': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleAgentAction = async (agent: AIAgent, action: string) => {
    try {
      toast({
        title: `${action} ${agent.name}`,
        description: `Processing ${action.toLowerCase()} request...`,
      });

      let result;
      if (action === 'View Performance') {
        result = await aiService.getAgentPerformance(agent.id, '7d');
      } else if (action === 'Retrain') {
        result = await aiService.retrainAgent(agent.id);
      } else {
        result = await aiService.performAgentAction(agent.id, action);
      }

      toast({
        title: "Success!",
        description: `${agent.name} ${action} completed successfully.`,
      });

      // Refresh agent data if needed
      if (action === 'Retrain') {
        const updatedAgent = await aiService.getAgentById(agent.id);
        setAiAgents(prev => prev.map(a => a.id === agent.id ? updatedAgent : a));
      }
    } catch (error) {
      console.error('Error performing agent action:', error);
      toast({
        title: "Error",
        description: `Failed to ${action.toLowerCase()} ${agent.name}.`,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-[400px]"
      >
        <div className="text-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
          />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600"
          >
            Loading AI recommendations...
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
      className="space-y-6"
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
              <Brain className="w-8 h-8 text-blue-600" />
            </motion.div>
            Adaptive Onboarding
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 mt-2"
          >
            AI-powered recommendations tailored to your behavior and preferences
          </motion.p>
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          <Badge variant="secondary" className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-200">
            <Sparkles className="w-4 h-4" />
            AI-Powered
          </Badge>
        </motion.div>
      </motion.div>

      {/* Enhanced User Behavior Insights */}
      {userBehavior && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="flex items-center gap-2">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </motion.div>
                Your Behavior Insights
              </CardTitle>
              <CardDescription>
                AI analysis of your interaction patterns and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div 
                    className="text-3xl font-bold text-blue-600 mb-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7, type: "spring" }}
                  >
                    {Object.values(userBehavior.featureVisits).reduce((a, b) => a + b, 0)}
                  </motion.div>
                  <div className="text-sm text-gray-600">Total Feature Visits</div>
                </motion.div>
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div 
                    className="text-3xl font-bold text-green-600 mb-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, type: "spring" }}
                  >
                    {userBehavior.engagement.streak}
                  </motion.div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                </motion.div>
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div 
                    className="text-3xl font-bold text-purple-600 mb-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.9, type: "spring" }}
                  >
                    {userBehavior.preferences.learningStyle}
                  </motion.div>
                  <div className="text-sm text-gray-600">Learning Style</div>
                </motion.div>
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div 
                    className="text-3xl font-bold text-orange-600 mb-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.0, type: "spring" }}
                  >
                    {userBehavior.preferences.pace}
                  </motion.div>
                  <div className="text-sm text-gray-600">Preferred Pace</div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Enhanced Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
                  <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1">
          <TabsTrigger value="recommendations" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            Recommendations
          </TabsTrigger>
          <TabsTrigger value="agents" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Brain className="w-4 h-4 mr-2" />
            AI Agents
          </TabsTrigger>
          <TabsTrigger value="progress" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <TargetIcon className="w-4 h-4 mr-2" />
            Progress
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Lightbulb className="w-4 h-4 mr-2" />
            AI Insights
          </TabsTrigger>
        </TabsList>

          <TabsContent value="recommendations" className="space-y-4">
            <motion.div 
              className="grid gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <AnimatePresence>
                {recommendations.map((recommendation, index) => (
                  <motion.div
                    key={recommendation.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                    }}
                    onHoverStart={() => setHoveredRecommendation(recommendation.id)}
                    onHoverEnd={() => setHoveredRecommendation(null)}
                  >
                    <Card className={`transition-all duration-300 ${
                      hoveredRecommendation === recommendation.id ? 'ring-2 ring-blue-200' : ''
                    }`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                                className="p-2 bg-blue-100 rounded-lg"
                              >
                                {getTypeIcon(recommendation.type)}
                              </motion.div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg">{recommendation.title}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge className={getPriorityColor(recommendation.priority)}>
                                    {recommendation.priority}
                                  </Badge>
                                  <Badge variant="outline" className="flex items-center gap-1">
                                    {getCategoryIcon(recommendation.category)}
                                    {recommendation.category}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-600 mb-4">{recommendation.description}</p>
                            
                            {/* Enhanced metrics */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Clock className="w-4 h-4" />
                                {recommendation.estimatedTime} min
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Target className="w-4 h-4" />
                                {Math.round(recommendation.confidence * 100)}% confidence
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <span className={`font-medium ${getImpactColor(recommendation.impact)}`}>
                                  {recommendation.impact} impact
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Timer className="w-4 h-4" />
                                {recommendation.difficulty}
                              </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {recommendation.tags.map((tag, tagIndex) => (
                                <motion.span
                                  key={tag}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.1 * tagIndex }}
                                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                                >
                                  {tag}
                                </motion.span>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-col gap-3">
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button 
                                onClick={() => handleRecommendationAction(recommendation)}
                                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                              >
                                <Rocket className="w-4 h-4" />
                                Start
                                <ChevronRight className="w-4 h-4" />
                              </Button>
                            </motion.div>
                            {recommendation.completed && (
                              <Badge variant="outline" className="text-green-600 border-green-200">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Completed
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </TabsContent>

          <TabsContent value="agents" className="space-y-4">
            <motion.div 
              className="grid gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {aiAgents.map((agent, index) => (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.02 }}
                    className="relative"
                  >
                    <Card className="overflow-hidden border-2 hover:border-blue-300 transition-all duration-300">
                      <CardHeader className={`bg-gradient-to-r ${getAgentColor(agent.type)} text-white`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <motion.div
                              animate={{ rotate: [0, 10, -10, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              {getAgentIcon(agent.type)}
                            </motion.div>
                            <div>
                              <CardTitle className="text-white">{agent.name}</CardTitle>
                              <CardDescription className="text-blue-100">
                                {agent.currentTask}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge className={getStatusColor(agent.status)}>
                            {agent.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {/* Performance Metrics */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-gray-900">{agent.accuracy}%</div>
                              <div className="text-sm text-gray-600">Accuracy</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-gray-900">{agent.decisions.toLocaleString()}</div>
                              <div className="text-sm text-gray-600">Decisions</div>
                            </div>
                          </div>

                          {/* Performance Chart */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Performance Trend</span>
                              <span className="text-green-600">+{agent.performance.improvement}%</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-xs">
                              <div className="text-center">
                                <div className="font-semibold">{agent.performance.last24h}</div>
                                <div className="text-gray-500">24h</div>
                              </div>
                              <div className="text-center">
                                <div className="font-semibold">{agent.performance.last7d}</div>
                                <div className="text-gray-500">7d</div>
                              </div>
                              <div className="text-center">
                                <div className="font-semibold">{agent.performance.last30d}</div>
                                <div className="text-gray-500">30d</div>
                              </div>
                            </div>
                          </div>

                          {/* Capabilities */}
                          <div>
                            <h4 className="font-semibold text-sm mb-2">Capabilities</h4>
                            <div className="flex flex-wrap gap-1">
                              {agent.capabilities.map((capability, capIndex) => (
                                <motion.span
                                  key={capability}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.1 * capIndex }}
                                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                >
                                  {capability}
                                </motion.span>
                              ))}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              onClick={() => handleAgentAction(agent, 'View Performance')}
                              variant="outline"
                              className="flex-1"
                            >
                              <BarChart3 className="w-4 h-4 mr-1" />
                              View Performance
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleAgentAction(agent, 'Retrain')}
                              variant="outline"
                              className="flex-1"
                            >
                              <RefreshCw className="w-4 h-4 mr-1" />
                              Retrain
                            </Button>
                          </div>

                          {/* Training Info */}
                          <div className="text-xs text-gray-500 text-center pt-2 border-t">
                            Trained: {agent.trainedDate} • Confidence: {Math.round(agent.confidence * 100)}%
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Agent Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      AI Agents Overview
                    </CardTitle>
                    <CardDescription>
                      System-wide performance and coordination metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">
                          {aiAgents.filter(a => a.status === 'active').length}
                        </div>
                        <div className="text-sm text-gray-600">Active Agents</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">
                          {Math.round(aiAgents.reduce((acc, agent) => acc + agent.accuracy, 0) / aiAgents.length * 10) / 10}%
                        </div>
                        <div className="text-sm text-gray-600">Avg Accuracy</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600">
                          {aiAgents.reduce((acc, agent) => acc + agent.decisions, 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Total Decisions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-600">
                          {Math.round(aiAgents.reduce((acc, agent) => acc + agent.performance.improvement, 0) / aiAgents.length * 10) / 10}%
                        </div>
                        <div className="text-sm text-gray-600">Avg Improvement</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TargetIcon className="w-5 h-5" />
                    Onboarding Progress
                  </CardTitle>
                  <CardDescription>Track your completion across different areas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Overall Progress</span>
                        <span>65%</span>
                      </div>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "65%" }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-3 bg-gray-200 rounded-full overflow-hidden"
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 1, delay: 0.7 }}
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        />
                      </motion.div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { name: 'Security Setup', progress: 80, color: 'from-green-500 to-green-600' },
                        { name: 'Document Workflow', progress: 45, color: 'from-yellow-500 to-orange-500' },
                        { name: 'Analytics Mastery', progress: 70, color: 'from-blue-500 to-blue-600' },
                        { name: 'AI Features', progress: 30, color: 'from-purple-500 to-purple-600' }
                      ].map((item, index) => (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                        >
                          <div className="text-sm font-medium mb-1">{item.name}</div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${item.progress}%` }}
                              transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                              className={`h-full bg-gradient-to-r ${item.color}`}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    AI-Generated Insights
                  </CardTitle>
                  <CardDescription>Personalized recommendations based on your behavior</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Alert className="border-blue-200 bg-blue-50">
                        <Brain className="h-4 w-4 text-blue-600" />
                        <AlertDescription>
                          <strong>Learning Pattern Detected:</strong> You prefer visual content and moderate-paced learning. 
                          We've prioritized video tutorials and interactive guides in your recommendations.
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Alert className="border-green-200 bg-green-50">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <AlertDescription>
                          <strong>Engagement Opportunity:</strong> You've shown high interest in analytics features. 
                          Consider exploring advanced reporting capabilities to maximize your ROI.
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Alert className="border-purple-200 bg-purple-50">
                        <Target className="h-4 w-4 text-purple-600" />
                        <AlertDescription>
                          <strong>Optimization Suggestion:</strong> Your document workflow could be streamlined by 40% 
                          using our AI-powered automation features.
                        </AlertDescription>
                      </Alert>
                    </motion.div>
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

export default AdaptiveOnboarding;
