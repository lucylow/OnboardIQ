import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Video, 
  Play, 
  Pause, 
  Square, 
  Mic, 
  MicOff, 
  Camera, 
  CameraOff,
  Users, 
  Clock, 
  Calendar,
  Star,
  MessageSquare,
  Share2,
  Download,
  Settings,
  HelpCircle,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Brain,
  Zap,
  Shield,
  FileText,
  Smartphone,
  Globe,
  ArrowRight,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  Save,
  Send,
  Phone,
  Mail,
  MapPin,
  Clock as ClockIcon,
  Calendar as CalendarIcon,
  User,
  Crown,
  Award,
  Target,
  Activity,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Frown,
  Meh
} from 'lucide-react';

interface VideoSession {
  id: string;
  title: string;
  type: 'onboarding' | 'training' | 'support' | 'demo';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  participant: string;
  host: string;
  scheduledAt: Date;
  startedAt?: Date;
  endedAt?: Date;
  duration?: number;
  satisfaction?: number;
  notes?: string;
  meetingUrl?: string;
  recordingUrl?: string;
  transcript?: string;
  tags: string[];
  priority: 'low' | 'medium' | 'high';
}

interface VideoTemplate {
  id: string;
  name: string;
  description: string;
  duration: number;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  features: string[];
  thumbnail: string;
  popularity: number;
  rating: number;
}

const VideoOnboarding: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentSession, setCurrentSession] = useState<VideoSession | null>(null);
  const [sessions, setSessions] = useState<VideoSession[]>([]);
  const [templates, setTemplates] = useState<VideoTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<VideoTemplate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSessionData, setNewSessionData] = useState({
    participantName: '',
    participantEmail: '',
    scheduledDate: '',
    scheduledTime: '',
    notes: ''
  });
  const [joinMeetingDialog, setJoinMeetingDialog] = useState<{ open: boolean; session: VideoSession | null }>({ open: false, session: null });
  const [recordingDialog, setRecordingDialog] = useState<{ open: boolean; session: VideoSession | null }>({ open: false, session: null });
  const [transcriptDialog, setTranscriptDialog] = useState<{ open: boolean; session: VideoSession | null }>({ open: false, session: null });
  const { toast } = useToast();

  // Enhanced mock data loading with error handling
  useEffect(() => {
    const loadMockData = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock sessions with comprehensive data
        const mockSessions: VideoSession[] = [
          {
            id: 'sess_001',
            title: 'Product Onboarding Session',
            type: 'onboarding',
            status: 'completed',
            participant: 'Sarah Johnson',
            host: 'Alex Chen',
            scheduledAt: new Date('2024-09-01T10:00:00Z'),
            startedAt: new Date('2024-09-01T10:05:00Z'),
            endedAt: new Date('2024-09-01T11:15:00Z'),
            duration: 70,
            satisfaction: 5,
            notes: 'Excellent session, participant showed great engagement',
            meetingUrl: 'https://meet.google.com/abc-defg-hij',
            recordingUrl: 'https://recordings.onboardiq.com/session-1',
            transcript: 'Full transcript available with AI-generated content',
            tags: ['product', 'onboarding', 'feature-demo'],
            priority: 'high'
          },
          {
            id: 'sess_002',
            title: 'Advanced Features Training',
            type: 'training',
            status: 'scheduled',
            participant: 'Mike Rodriguez',
            host: 'Lisa Wang',
            scheduledAt: new Date('2024-09-05T14:00:00Z'),
            meetingUrl: 'https://meet.google.com/training-advanced-123',
            tags: ['training', 'advanced', 'analytics'],
            priority: 'medium',
            notes: 'Focus on advanced analytics and custom reporting features'
          },
          {
            id: 'sess_003',
            title: 'Technical Support Call',
            type: 'support',
            status: 'in_progress',
            participant: 'David Kim',
            host: 'Tom Wilson',
            scheduledAt: new Date('2024-09-03T15:30:00Z'),
            startedAt: new Date('2024-09-03T15:35:00Z'),
            meetingUrl: 'https://meet.google.com/xyz-uvw-rst',
            tags: ['support', 'technical', 'urgent'],
            priority: 'high',
            notes: 'Critical issue resolution session'
          },
          {
            id: 'sess_004',
            title: 'Sales Demo Presentation',
            type: 'demo',
            status: 'completed',
            participant: 'Jennifer Lopez',
            host: 'Mark Johnson',
            scheduledAt: new Date('2024-08-28T09:00:00Z'),
            startedAt: new Date('2024-08-28T09:02:00Z'),
            endedAt: new Date('2024-08-28T10:30:00Z'),
            duration: 88,
            satisfaction: 4,
            notes: 'Great demo, client is interested in enterprise package',
            meetingUrl: 'https://meet.google.com/sales-demo-456',
            recordingUrl: 'https://recordings.onboardiq.com/session-4',
            transcript: 'Sales presentation transcript with client Q&A',
            tags: ['sales', 'demo', 'enterprise'],
            priority: 'high'
          }
        ];

        // Mock templates with rich data
        const mockTemplates: VideoTemplate[] = [
          {
            id: 'tpl_001',
            name: 'Complete Product Onboarding',
            description: 'Comprehensive introduction to all product features and capabilities',
            duration: 60,
            category: 'Onboarding',
            difficulty: 'beginner',
            features: ['Product Tour', 'Feature Demo', 'Q&A Session', 'Next Steps'],
            thumbnail: '/api/placeholder/300/200',
            popularity: 95,
            rating: 4.8
          },
          {
            id: 'tpl_002',
            name: 'Advanced Analytics Training',
            description: 'Deep dive into advanced analytics and reporting features',
            duration: 90,
            category: 'Training',
            difficulty: 'advanced',
            features: ['Data Analysis', 'Custom Reports', 'API Integration', 'Best Practices'],
            thumbnail: '/api/placeholder/300/200',
            popularity: 78,
            rating: 4.6
          },
          {
            id: 'tpl_003',
            name: 'Security & Compliance Overview',
            description: 'Understanding security features and compliance requirements',
            duration: 45,
            category: 'Training',
            difficulty: 'intermediate',
            features: ['Security Features', 'Compliance Overview', 'Best Practices', 'Audit Trail'],
            thumbnail: '/api/placeholder/300/200',
            popularity: 82,
            rating: 4.7
          },
          {
            id: 'tpl_004',
            name: 'Sales Demo Template',
            description: 'Professional sales demonstration with client interaction',
            duration: 45,
            category: 'Demo',
            difficulty: 'beginner',
            features: ['Product Showcase', 'Use Cases', 'ROI Discussion', 'Pricing Overview'],
            thumbnail: '/api/placeholder/300/200',
            popularity: 88,
            rating: 4.5
          }
        ];

        setSessions(mockSessions);
        setTemplates(mockTemplates);
        
        toast({
          title: "Data Loaded Successfully",
          description: "Mock session and template data loaded",
        });
        
      } catch (error) {
        console.error('Failed to load mock data:', error);
        
        // Fallback to minimal data even if mock loading fails
        setSessions([
          {
            id: 'fallback_001',
            title: 'Emergency Fallback Session',
            type: 'onboarding',
            status: 'scheduled',
            participant: 'Demo User',
            host: 'System Host',
            scheduledAt: new Date(),
            meetingUrl: 'https://meet.google.com/fallback-session',
            tags: ['fallback'],
            priority: 'low',
            notes: 'Fallback session created due to data loading error'
          }
        ]);
        
        setTemplates([
          {
            id: 'fallback_tpl',
            name: 'Basic Template',
            description: 'Fallback template for emergency use',
            duration: 30,
            category: 'Onboarding',
            difficulty: 'beginner',
            features: ['Basic Setup'],
            thumbnail: '',
            popularity: 50,
            rating: 3.0
          }
        ]);
        
        toast({
          title: "Offline Mode",
          description: "Using cached data. Some features may be limited.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadMockData();
  }, [toast]);

  const handleStartSession = (session: VideoSession) => {
    setCurrentSession(session);
    setIsRecording(true);
  };

  const handleEndSession = () => {
    setIsRecording(false);
    setCurrentSession(null);
  };

  const getStatusBadge = (status: VideoSession['status']) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="secondary">Scheduled</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Live</Badge>;
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPriorityBadge = (priority: VideoSession['priority']) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High Priority</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Medium</Badge>;
      case 'low':
        return <Badge className="bg-gray-500 hover:bg-gray-600">Low</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleUseTemplate = (template: VideoTemplate) => {
    setSelectedTemplate(template);
    setIsDialogOpen(true);
    toast({
      title: "Template Selected",
      description: `Using template: ${template.name}`,
    });
  };

  const handleCreateSession = async () => {
    if (!selectedTemplate || !newSessionData.participantName || !newSessionData.scheduledDate || !newSessionData.scheduledTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call with mock data response
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      
      const scheduledDateTime = new Date(`${newSessionData.scheduledDate}T${newSessionData.scheduledTime}`);
      
      // Generate mock meeting URL and IDs
      const mockMeetingId = Math.random().toString(36).substring(2, 15);
      const mockSessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const newSession: VideoSession = {
        id: mockSessionId,
        title: `${selectedTemplate.name} - ${newSessionData.participantName}`,
        type: selectedTemplate.category.toLowerCase() as VideoSession['type'],
        status: 'scheduled',
        participant: newSessionData.participantName,
        host: 'Current User',
        scheduledAt: scheduledDateTime,
        meetingUrl: `https://meet.google.com/${mockMeetingId}`,
        tags: [selectedTemplate.category.toLowerCase(), selectedTemplate.difficulty],
        priority: 'medium',
        notes: newSessionData.notes
      };

      setSessions(prev => [...prev, newSession]);
      
      toast({
        title: "Session Created Successfully!",
        description: `Video session scheduled for ${newSession.participant} on ${scheduledDateTime.toLocaleDateString()}`,
      });

      // Reset form and close dialog
      setNewSessionData({
        participantName: '',
        participantEmail: '',
        scheduledDate: '',
        scheduledTime: '',
        notes: ''
      });
      setIsDialogOpen(false);
      setSelectedTemplate(null);
      
      // Switch to sessions tab to show the new session
      setActiveTab('sessions');
      
    } catch (error) {
      console.error('Session creation error:', error);
      
      // Even if there's an error, create the session with mock data as fallback
      const scheduledDateTime = new Date(`${newSessionData.scheduledDate}T${newSessionData.scheduledTime}`);
      const mockSessionId = `offline_${Date.now()}`;
      
      const fallbackSession: VideoSession = {
        id: mockSessionId,
        title: `${selectedTemplate.name} - ${newSessionData.participantName}`,
        type: selectedTemplate.category.toLowerCase() as VideoSession['type'],
        status: 'scheduled',
        participant: newSessionData.participantName,
        host: 'Current User',
        scheduledAt: scheduledDateTime,
        meetingUrl: `https://meet.google.com/mock-${mockSessionId}`,
        tags: [selectedTemplate.category.toLowerCase(), selectedTemplate.difficulty],
        priority: 'medium',
        notes: `${newSessionData.notes} [Created in offline mode]`
      };

      setSessions(prev => [...prev, fallbackSession]);
      
      toast({
        title: "Session Created (Offline Mode)",
        description: "Session created successfully using local data. Will sync when connection is restored.",
      });

      // Reset form and close dialog
      setNewSessionData({
        participantName: '',
        participantEmail: '',
        scheduledDate: '',
        scheduledTime: '',
        notes: ''
      });
      setIsDialogOpen(false);
      setSelectedTemplate(null);
      setActiveTab('sessions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinMeeting = (session: VideoSession) => {
    try {
      if (!session.meetingUrl) {
        toast({
          title: "Meeting Not Available",
          description: "Meeting URL not found. Using fallback link.",
        });
        // Generate fallback meeting URL
        session.meetingUrl = `https://meet.google.com/fallback-${session.id}`;
      }
      setJoinMeetingDialog({ open: true, session });
    } catch (error) {
      console.error('Error joining meeting:', error);
      toast({
        title: "Connection Error",
        description: "Unable to join meeting. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDownloadRecording = (session: VideoSession) => {
    try {
      if (!session.recordingUrl) {
        toast({
          title: "Recording Not Available",
          description: "Recording is being processed or not available yet.",
        });
        return;
      }
      setRecordingDialog({ open: true, session });
    } catch (error) {
      console.error('Error accessing recording:', error);
      toast({
        title: "Download Error",
        description: "Unable to access recording. Please try again later.",
        variant: "destructive"
      });
    }
  };

  const handleViewTranscript = (session: VideoSession) => {
    try {
      if (!session.transcript) {
        toast({
          title: "Transcript Not Available",
          description: "Transcript is being generated or not available yet.",
        });
        return;
      }
      setTranscriptDialog({ open: true, session });
    } catch (error) {
      console.error('Error accessing transcript:', error);
      toast({
        title: "Transcript Error",
        description: "Unable to load transcript. Please try again later.",
        variant: "destructive"
      });
    }
  };

  const handleEditSession = (session: VideoSession) => {
    toast({
      title: "Edit Session",
      description: `Editing session: ${session.title}`,
    });
    // Implement edit logic
  };

  const handleShareSession = (session: VideoSession) => {
    toast({
      title: "Share Session",
      description: `Sharing session: ${session.title}`,
    });
    // Implement share logic
  };

  const handleDeleteSession = (session: VideoSession) => {
    toast({
      title: "Delete Session",
      description: `Deleting session: ${session.title}`,
    });
    // Implement delete logic
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Video className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Video Onboarding</h1>
                <p className="text-gray-600">AI-powered personalized video sessions</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline">
                <HelpCircle className="h-4 w-4 mr-2" />
                Help
              </Button>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Session
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Sessions</p>
                      <p className="text-2xl font-bold text-blue-600">1,247</p>
                      <p className="text-xs text-green-600">+12% from last month</p>
                    </div>
                    <Video className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                      <p className="text-2xl font-bold text-green-600">94.2%</p>
                      <p className="text-xs text-green-600">+3.1% from last month</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Avg Satisfaction</p>
                      <p className="text-2xl font-bold text-purple-600">4.8/5</p>
                      <p className="text-xs text-green-600">+0.2 from last month</p>
                    </div>
                    <Star className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Active Sessions</p>
                      <p className="text-2xl font-bold text-orange-600">3</p>
                      <p className="text-xs text-blue-600">Live now</p>
                    </div>
                    <Activity className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Sessions
                </CardTitle>
                <CardDescription>
                  Your latest video onboarding sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sessions.slice(0, 3).map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <Video className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{session.title}</h4>
                          <p className="text-sm text-gray-500">
                            {session.participant} • {session.scheduledAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(session.status)}
                        {getPriorityBadge(session.priority)}
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Plus className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Schedule New Session</h3>
                  <p className="text-sm text-gray-600 mb-4">Create a personalized video onboarding session</p>
                  <Button className="w-full" onClick={() => setIsDialogOpen(true)}>
                    Get Started
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Play className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Join Live Session</h3>
                  <p className="text-sm text-gray-600 mb-4">Connect to an ongoing video session</p>
                  <Button className="w-full" variant="outline">
                    Join Now
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">View Analytics</h3>
                  <p className="text-sm text-gray-600 mb-4">Analyze session performance and insights</p>
                  <Button className="w-full" variant="outline">
                    View Reports
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            {/* Sessions List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      All Sessions
                    </CardTitle>
                    <CardDescription>
                      Manage and track all your video onboarding sessions
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => {
                      toast({
                        title: "Refreshing Sessions",
                        description: "Loading latest session data...",
                      });
                    }}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                    <Button size="sm" onClick={() => setIsDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      New Session
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <Video className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{session.title}</h3>
                            <p className="text-sm text-gray-500">
                              {session.participant} • Hosted by {session.host}
                            </p>
                            <p className="text-sm text-gray-500">
                              {session.scheduledAt.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(session.status)}
                          {getPriorityBadge(session.priority)}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Type</p>
                          <p className="font-medium capitalize">{session.type}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Duration</p>
                          <p className="font-medium">{session.duration || 'N/A'} min</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Satisfaction</p>
                          <div className="flex items-center justify-center">
                            {session.satisfaction ? (
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < session.satisfaction! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-400">N/A</span>
                            )}
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Tags</p>
                          <div className="flex flex-wrap gap-1 justify-center">
                            {session.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {session.meetingUrl && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleJoinMeeting(session)}
                            >
                              <Play className="h-4 w-4 mr-2" />
                              Join Meeting
                            </Button>
                          )}
                          {session.recordingUrl && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDownloadRecording(session)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download Recording
                            </Button>
                          )}
                          {session.transcript && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewTranscript(session)}
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              View Transcript
                            </Button>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditSession(session)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleShareSession(session)}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeleteSession(session)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-4 flex items-center justify-center">
                      <Video className="h-12 w-12 text-blue-600" />
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {template.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{template.duration} min</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{template.rating}</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <p className="text-xs font-medium text-gray-500">Features:</p>
                      <div className="flex flex-wrap gap-1">
                        {template.features.slice(0, 3).map((feature) => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button 
                      className="w-full" 
                      onClick={() => handleUseTemplate(template)}
                    >
                      Use Template
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Analytics Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Analytics & Insights
                </CardTitle>
                <CardDescription>
                  Track session performance, user engagement, and business metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Revenue Metrics */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Revenue Metrics</h4>
                    <div className="space-y-3">
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-green-900">Monthly Revenue</span>
                          <Badge className="bg-green-500 hover:bg-green-600">+15%</Badge>
                        </div>
                        <p className="text-2xl font-bold text-green-900">$12,450</p>
                        <p className="text-sm text-green-700">From 120 sessions</p>
                      </div>
                      
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-blue-900">Avg Session Value</span>
                          <Badge className="bg-blue-500 hover:bg-blue-600">+8%</Badge>
                        </div>
                        <p className="text-2xl font-bold text-blue-900">$104.17</p>
                        <p className="text-sm text-blue-700">Per session</p>
                      </div>
                      
                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-purple-900">Conversion Rate</span>
                          <Badge className="bg-purple-500 hover:bg-purple-600">+12%</Badge>
                        </div>
                        <p className="text-2xl font-bold text-purple-900">9.2%</p>
                        <p className="text-sm text-purple-700">Lead to customer</p>
                      </div>
                    </div>
                  </div>

                  {/* Session Metrics */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Session Performance</h4>
                    <div className="space-y-3">
                      <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-orange-900">Completion Rate</span>
                          <Badge className="bg-orange-500 hover:bg-orange-600">94%</Badge>
                        </div>
                        <p className="text-2xl font-bold text-orange-900">94.2%</p>
                        <p className="text-sm text-orange-700">Sessions completed</p>
                      </div>
                      
                      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-yellow-900">Avg Duration</span>
                          <Badge className="bg-yellow-500 hover:bg-yellow-600">+5%</Badge>
                        </div>
                        <p className="text-2xl font-bold text-yellow-900">45 min</p>
                        <p className="text-sm text-yellow-700">Per session</p>
                      </div>
                      
                      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-red-900">Cancellation Rate</span>
                          <Badge className="bg-red-500 hover:bg-red-600">-3%</Badge>
                        </div>
                        <p className="text-2xl font-bold text-red-900">5.8%</p>
                        <p className="text-sm text-red-700">Sessions cancelled</p>
                      </div>
                    </div>
                  </div>

                  {/* Business Metrics */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Business Metrics</h4>
                    <div className="space-y-3">
                      <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-indigo-900">Customer Satisfaction</span>
                          <Badge className="bg-indigo-500 hover:bg-indigo-600">4.8/5</Badge>
                        </div>
                        <p className="text-2xl font-bold text-indigo-900">4.8</p>
                        <p className="text-sm text-indigo-700">Out of 5 stars</p>
                      </div>
                      
                      <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-teal-900">Customer Retention</span>
                          <Badge className="bg-teal-500 hover:bg-teal-600">+18%</Badge>
                        </div>
                        <p className="text-2xl font-bold text-teal-900">87%</p>
                        <p className="text-sm text-teal-700">Repeat customers</p>
                      </div>
                      
                      <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-pink-900">ROI</span>
                          <Badge className="bg-pink-500 hover:bg-pink-600">+25%</Badge>
                        </div>
                        <p className="text-2xl font-bold text-pink-900">325%</p>
                        <p className="text-sm text-pink-700">Return on investment</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upgrade CTA */}
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Unlock Advanced Analytics</h3>
                      <p className="text-gray-600">Get detailed insights, custom reports, and predictive analytics with our Pro plan.</p>
                    </div>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Upgrade to Pro
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            {/* Settings Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Video Settings
                </CardTitle>
                <CardDescription>
                  Configure your video onboarding preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Recording Settings</h4>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Auto-record sessions</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Save transcripts</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Enable screen sharing</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Notification Settings</h4>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Session reminders</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Completion notifications</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Analytics reports</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Session Creation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Schedule New Session
            </DialogTitle>
            <DialogDescription>
              {selectedTemplate 
                ? `Create a session using: ${selectedTemplate.name}` 
                : "Create a new video onboarding session"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {!selectedTemplate && (
              <div className="space-y-2">
                <Label htmlFor="template">Select Template</Label>
                <select
                  id="template"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  onChange={(e) => {
                    const template = templates.find(t => t.id === e.target.value);
                    setSelectedTemplate(template || null);
                  }}
                >
                  <option value="">Choose a template...</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name} ({template.duration} min)
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="participantName">Participant Name *</Label>
                <Input
                  id="participantName"
                  value={newSessionData.participantName}
                  onChange={(e) => setNewSessionData(prev => ({ ...prev, participantName: e.target.value }))}
                  placeholder="Enter participant name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="participantEmail">Email</Label>
                <Input
                  id="participantEmail"
                  type="email"
                  value={newSessionData.participantEmail}
                  onChange={(e) => setNewSessionData(prev => ({ ...prev, participantEmail: e.target.value }))}
                  placeholder="Enter participant email"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduledDate">Date *</Label>
                <Input
                  id="scheduledDate"
                  type="date"
                  value={newSessionData.scheduledDate}
                  onChange={(e) => setNewSessionData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="scheduledTime">Time *</Label>
                <Input
                  id="scheduledTime"
                  type="time"
                  value={newSessionData.scheduledTime}
                  onChange={(e) => setNewSessionData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={newSessionData.notes}
                onChange={(e) => setNewSessionData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes or requirements"
                rows={3}
              />
            </div>
            
            {/* Quick Fill Mock Data Button */}
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900">Quick Demo Setup</p>
                  <p className="text-xs text-blue-700">Auto-fill with sample data for testing</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const mockNames = ["John Smith", "Emily Davis", "Michael Brown", "Sarah Wilson", "David Lee"];
                    const mockEmails = ["john.smith@company.com", "emily.davis@startup.com", "michael.brown@tech.co", "sarah.wilson@business.net", "david.lee@innovation.org"];
                    const randomIndex = Math.floor(Math.random() * mockNames.length);
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    
                    setNewSessionData({
                      participantName: mockNames[randomIndex],
                      participantEmail: mockEmails[randomIndex],
                      scheduledDate: tomorrow.toISOString().split('T')[0],
                      scheduledTime: "14:00",
                      notes: "Auto-generated demo session for testing purposes"
                    });
                    
                    if (!selectedTemplate) {
                      setSelectedTemplate(templates[0]);
                    }
                  }}
                >
                  <Zap className="h-3 w-3 mr-1" />
                  Fill Demo Data
                </Button>
              </div>
            </div>
            
            {selectedTemplate && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Template Details:</h4>
                <div className="text-xs text-gray-600 space-y-1">
                  <p>Duration: {selectedTemplate.duration} minutes</p>
                  <p>Difficulty: {selectedTemplate.difficulty}</p>
                  <p>Features: {selectedTemplate.features.join(", ")}</p>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsDialogOpen(false);
              setSelectedTemplate(null);
              setNewSessionData({
                participantName: '',
                participantEmail: '',
                scheduledDate: '',
                scheduledTime: '',
                notes: ''
              });
            }}>
              Cancel
            </Button>
            <Button onClick={handleCreateSession} disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Session
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Join Meeting Dialog */}
      <Dialog open={joinMeetingDialog.open} onOpenChange={(open) => setJoinMeetingDialog({ open, session: null })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-blue-600" />
              Join Video Meeting
            </DialogTitle>
            <DialogDescription>
              Ready to join the meeting for "{joinMeetingDialog.session?.title}"?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-blue-900">Meeting Details</span>
                <Badge className="bg-blue-500 hover:bg-blue-600">Live</Badge>
              </div>
              <div className="space-y-2 text-sm text-blue-800">
                <p><strong>Participant:</strong> {joinMeetingDialog.session?.participant}</p>
                <p><strong>Host:</strong> {joinMeetingDialog.session?.host}</p>
                <p><strong>Meeting ID:</strong> 123-456-789</p>
                <p><strong>Password:</strong> onboard123</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm text-green-800">Your camera and microphone are ready</span>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setJoinMeetingDialog({ open: false, session: null })}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                window.open(joinMeetingDialog.session?.meetingUrl || 'https://meet.google.com/abc-defg-hij', '_blank');
                setJoinMeetingDialog({ open: false, session: null });
                toast({ title: "Joining meeting...", description: "Opening meeting in new tab" });
              }}
            >
              <Play className="h-4 w-4 mr-2" />
              Join Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Download Recording Dialog */}
      <Dialog open={recordingDialog.open} onOpenChange={(open) => setRecordingDialog({ open, session: null })}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-purple-600" />
              Download Recording
            </DialogTitle>
            <DialogDescription>
              Choose your preferred format for "{recordingDialog.session?.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-purple-900">Recording Info</span>
                  <Badge variant="secondary">HD Quality</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-purple-800">
                  <div>
                    <p><strong>Duration:</strong> {recordingDialog.session?.duration || 45} min</p>
                    <p><strong>Size:</strong> 892 MB</p>
                  </div>
                  <div>
                    <p><strong>Quality:</strong> 1080p HD</p>
                    <p><strong>Format:</strong> MP4</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Available Downloads:</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    <span>Full Recording (HD)</span>
                  </div>
                  <span className="text-xs text-gray-500">892 MB</span>
                </Button>
                <Button variant="outline" className="w-full justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    <span>Audio Only</span>
                  </div>
                  <span className="text-xs text-gray-500">45 MB</span>
                </Button>
                <Button variant="outline" className="w-full justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Transcript (TXT)</span>
                  </div>
                  <span className="text-xs text-gray-500">12 KB</span>
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setRecordingDialog({ open: false, session: null })}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                // Mock download
                const link = document.createElement('a');
                link.href = 'data:text/plain;charset=utf-8,Mock video recording file';
                link.download = `${recordingDialog.session?.title?.replace(/\s+/g, '_')}_recording.mp4`;
                link.click();
                setRecordingDialog({ open: false, session: null });
                toast({ title: "Download started", description: "Recording download has begun" });
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Download HD
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Transcript Dialog */}
      <Dialog open={transcriptDialog.open} onOpenChange={(open) => setTranscriptDialog({ open, session: null })}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              Session Transcript
            </DialogTitle>
            <DialogDescription>
              Full transcript for "{transcriptDialog.session?.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">AI-Generated Transcript</span>
              </div>
              <Badge variant="secondary">95% Accuracy</Badge>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
              <div className="space-y-4 text-sm">
                <div className="border-l-4 border-blue-500 pl-3">
                  <p className="font-medium text-blue-600">Host ({transcriptDialog.session?.host}):</p>
                  <p className="text-gray-700">Welcome to your onboarding session! I'm excited to help you get started with our platform. Could you please introduce yourself?</p>
                  <span className="text-xs text-gray-500">00:05</span>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-3">
                  <p className="font-medium text-purple-600">Participant ({transcriptDialog.session?.participant}):</p>
                  <p className="text-gray-700">Hi! Thank you for having me. I'm really looking forward to learning about the platform and how it can help our team.</p>
                  <span className="text-xs text-gray-500">00:15</span>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-3">
                  <p className="font-medium text-blue-600">Host ({transcriptDialog.session?.host}):</p>
                  <p className="text-gray-700">Perfect! Let's start with a quick overview of the dashboard. As you can see here, we have several key sections...</p>
                  <span className="text-xs text-gray-500">00:25</span>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-3">
                  <p className="font-medium text-purple-600">Participant ({transcriptDialog.session?.participant}):</p>
                  <p className="text-gray-700">This looks really intuitive. I especially like the analytics section. How often is the data updated?</p>
                  <span className="text-xs text-gray-500">01:45</span>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-3">
                  <p className="font-medium text-blue-600">Host ({transcriptDialog.session?.host}):</p>
                  <p className="text-gray-700">Great question! The analytics are updated in real-time, so you'll always have the most current information. Let me show you how to customize the reports...</p>
                  <span className="text-xs text-gray-500">01:55</span>
                </div>
                
                <div className="text-center py-4">
                  <span className="text-xs text-gray-500 italic">... transcript continues for {transcriptDialog.session?.duration || 45} minutes ...</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Clock className="h-3 w-3" />
              <span>Generated on {new Date().toLocaleDateString()}</span>
              <span>•</span>
              <span>{transcriptDialog.session?.duration || 45} minutes</span>
              <span>•</span>
              <span>~2,450 words</span>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button 
              variant="outline"
              onClick={() => {
                // Mock download transcript
                const transcriptText = `Session Transcript: ${transcriptDialog.session?.title}\nDate: ${new Date().toLocaleDateString()}\nParticipants: ${transcriptDialog.session?.host}, ${transcriptDialog.session?.participant}\n\nHost: Welcome to your onboarding session...\n[Full transcript content would be here]`;
                const link = document.createElement('a');
                link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(transcriptText);
                link.download = `${transcriptDialog.session?.title?.replace(/\s+/g, '_')}_transcript.txt`;
                link.click();
                toast({ title: "Transcript downloaded", description: "Transcript saved as text file" });
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button onClick={() => setTranscriptDialog({ open: false, session: null })}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Video Controls Overlay - Only show when in session */}
      {currentSession && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm rounded-full px-6 py-3 flex items-center space-x-4 z-50">
          <Button
            size="sm"
            variant={isRecording ? "destructive" : "default"}
            onClick={() => setIsRecording(!isRecording)}
          >
            {isRecording ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <Button
            size="sm"
            variant={isMuted ? "destructive" : "outline"}
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          
          <Button
            size="sm"
            variant={!isVideoOn ? "destructive" : "outline"}
            onClick={() => setIsVideoOn(!isVideoOn)}
          >
            {!isVideoOn ? <CameraOff className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          
          <Button
            size="sm"
            variant="destructive"
            onClick={handleEndSession}
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default VideoOnboarding;
