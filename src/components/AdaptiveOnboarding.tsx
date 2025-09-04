import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
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
  Zap
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
}

const AdaptiveOnboarding: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [userBehavior, setUserBehavior] = useState<UserBehavior | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('recommendations');
  const { toast } = useToast();

  useEffect(() => {
    loadUserBehaviorAndRecommendations();
  }, []);

  const loadUserBehaviorAndRecommendations = async () => {
    try {
      setLoading(true);
      
      // Use the new AI service
      const behaviorAnalysis = await aiService.analyzeUserBehavior(
        [
          { type: 'page_view', timestamp: new Date(), duration: 120 },
          { type: 'button_click', timestamp: new Date(), duration: 5 },
          { type: 'form_submit', timestamp: new Date(), duration: 30 }
        ],
        {
          'dashboard': 15,
          'analytics': 8,
          'documents': 12,
          'security': 5
        }
      );
      
      const recommendations = await aiService.generateRecommendations(
        {
          companyName: 'Demo Company',
          role: 'Manager',
          industry: 'Technology',
          teamSize: '10-50'
        },
        behaviorAnalysis
      );
      
      setUserBehavior({
        featureVisits: {
          'dashboard': 15,
          'analytics': 8,
          'documents': 12,
          'security': 5
        },
        timeSpent: {
          'dashboard': 45,
          'analytics': 20,
          'documents': 30,
          'security': 15
        },
        interactions: [
          { type: 'page_view', timestamp: new Date(), duration: 120 },
          { type: 'button_click', timestamp: new Date(), duration: 5 },
          { type: 'form_submit', timestamp: new Date(), duration: 30 }
        ],
        preferences: {
          learningStyle: behaviorAnalysis.learningStyle === 'mixed' ? 'visual' : behaviorAnalysis.learningStyle,
          pace: behaviorAnalysis.pace,
          complexity: behaviorAnalysis.complexity
        }
      });
      
      setRecommendations(recommendations.map(rec => ({
        ...rec,
        type: rec.type as 'video' | 'document' | 'interaction' | 'learning'
      })));
    } catch (error) {
      console.error('Error loading adaptive data:', error);
      // Fallback to mock data
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  const setMockData = () => {
    setUserBehavior({
      featureVisits: {
        'dashboard': 15,
        'analytics': 8,
        'documents': 12,
        'security': 5
      },
      timeSpent: {
        'dashboard': 45,
        'analytics': 20,
        'documents': 30,
        'security': 15
      },
      interactions: [
        { type: 'page_view', timestamp: new Date(), duration: 120 },
        { type: 'button_click', timestamp: new Date(), duration: 5 },
        { type: 'form_submit', timestamp: new Date(), duration: 30 }
      ],
      preferences: {
        learningStyle: 'visual',
        pace: 'moderate',
        complexity: 'intermediate'
      }
    });

    setRecommendations([
      {
        id: '1',
        type: 'video',
        title: 'Advanced Analytics Dashboard Walkthrough',
        description: 'Based on your frequent visits to analytics, learn how to leverage advanced reporting features.',
        priority: 'high',
        estimatedTime: 8,
        confidence: 0.92,
        actionUrl: '/video/analytics-advanced',
        completed: false
      },
      {
        id: '2',
        type: 'document',
        title: 'Security Best Practices Guide',
        description: 'Complete your security setup with our comprehensive best practices guide.',
        priority: 'medium',
        estimatedTime: 15,
        confidence: 0.78,
        actionUrl: '/documents/security-guide',
        completed: false
      },
      {
        id: '3',
        type: 'interaction',
        title: 'Document Workflow Optimization',
        description: 'Streamline your document processes based on your usage patterns.',
        priority: 'high',
        estimatedTime: 12,
        confidence: 0.85,
        actionUrl: '/onboarding/document-workflow',
        completed: false
      },
      {
        id: '4',
        type: 'learning',
        title: 'AI-Powered Insights Deep Dive',
        description: 'Master the AI features that can transform your onboarding experience.',
        priority: 'medium',
        estimatedTime: 20,
        confidence: 0.73,
        actionUrl: '/learning/ai-insights',
        completed: false
      }
    ]);
  };

  const handleRecommendationAction = async (recommendation: Recommendation) => {
    try {
      // Show loading toast
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
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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
          <h1 className="text-3xl font-bold text-gray-900">Adaptive Onboarding</h1>
          <p className="text-gray-600 mt-2">
            AI-powered recommendations tailored to your behavior and preferences
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-2">
          <Brain className="w-4 h-4" />
          AI-Powered
        </Badge>
      </div>

      {/* User Behavior Insights */}
      {userBehavior && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Your Behavior Insights
            </CardTitle>
            <CardDescription>
              AI analysis of your interaction patterns and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Object.values(userBehavior.featureVisits).reduce((a, b) => a + b, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Feature Visits</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {userBehavior.preferences.learningStyle}
                </div>
                <div className="text-sm text-gray-600">Learning Style</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {userBehavior.preferences.pace}
                </div>
                <div className="text-sm text-gray-600">Preferred Pace</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid gap-4">
            {recommendations.map((recommendation) => (
              <Card key={recommendation.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(recommendation.type)}
                          <h3 className="font-semibold text-lg">{recommendation.title}</h3>
                        </div>
                        <Badge className={getPriorityColor(recommendation.priority)}>
                          {recommendation.priority}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{recommendation.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {recommendation.estimatedTime} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          {Math.round(recommendation.confidence * 100)}% confidence
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button 
                        onClick={() => handleRecommendationAction(recommendation)}
                        className="flex items-center gap-2"
                      >
                        <Zap className="w-4 h-4" />
                        Start
                      </Button>
                      {recommendation.completed && (
                        <Badge variant="outline" className="text-green-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Onboarding Progress</CardTitle>
              <CardDescription>Track your completion across different areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Progress</span>
                    <span>65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium mb-1">Security Setup</div>
                    <Progress value={80} className="h-2" />
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Document Workflow</div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Analytics Mastery</div>
                    <Progress value={70} className="h-2" />
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">AI Features</div>
                    <Progress value={30} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Insights</CardTitle>
              <CardDescription>Personalized recommendations based on your behavior</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Brain className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Learning Pattern Detected:</strong> You prefer visual content and moderate-paced learning. 
                    We've prioritized video tutorials and interactive guides in your recommendations.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <TrendingUp className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Engagement Opportunity:</strong> You've shown high interest in analytics features. 
                    Consider exploring advanced reporting capabilities to maximize your ROI.
                  </AlertDescription>
                </Alert>
                <Alert>
                  <Target className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Optimization Suggestion:</strong> Your document workflow could be streamlined by 40% 
                    using our AI-powered automation features.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdaptiveOnboarding;
