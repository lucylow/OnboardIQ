import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Loader2, CheckCircle, XCircle, Video, CalendarIcon, Clock, Users, Star } from 'lucide-react';
import { format } from 'date-fns';
import { videoOnboardingService, VideoSession, VideoTemplate } from '../services/videoOnboardingService';

interface VideoOnboardingProps {
  userId: string;
  onSessionScheduled?: (session: VideoSession) => void;
  onSessionStarted?: (session: VideoSession) => void;
  onSessionCompleted?: (session: VideoSession) => void;
}

export const VideoOnboarding: React.FC<VideoOnboardingProps> = ({
  userId,
  onSessionScheduled,
  onSessionStarted,
  onSessionCompleted
}) => {
  const [templates, setTemplates] = useState<VideoTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [participantName, setParticipantName] = useState('');
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [hostName, setHostName] = useState('');
  const [sessions, setSessions] = useState<VideoSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<VideoSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [satisfaction, setSatisfaction] = useState<number>(0);
  const [notes, setNotes] = useState('');

  // Load templates and user sessions on component mount
  useEffect(() => {
    loadTemplates();
    loadUserSessions();
  }, [userId]);

  const loadTemplates = async () => {
    try {
      const allTemplates = videoOnboardingService.getAllTemplates();
      setTemplates(allTemplates);
      if (allTemplates.length > 0) {
        setSelectedTemplate(allTemplates[0].id);
      }
    } catch (err) {
      setError('Failed to load templates');
    }
  };

  const loadUserSessions = async () => {
    try {
      const userSessions = videoOnboardingService.getSessionsByUserId(userId);
      setSessions(userSessions);
    } catch (err) {
      setError('Failed to load sessions');
    }
  };

  const handleScheduleSession = async () => {
    if (!selectedTemplate || !participantName || !scheduledDate) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const session = await videoOnboardingService.scheduleSession(
        userId,
        participantName,
        scheduledDate,
        selectedTemplate,
        hostName
      );
      
      setSessions(prev => [session, ...prev]);
      setSuccess('Video session scheduled successfully!');
      onSessionScheduled?.(session);
      
      // Reset form
      setParticipantName('');
      setScheduledDate(undefined);
      setHostName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to schedule session');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartSession = async (sessionId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const session = await videoOnboardingService.startSession(sessionId);
      setSessions(prev => prev.map(s => s.id === sessionId ? session : s));
      setSelectedSession(session);
      setSuccess('Session started!');
      onSessionStarted?.(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start session');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndSession = async (sessionId: string) => {
    if (!selectedSession) return;

    setIsLoading(true);
    setError(null);

    try {
      const session = await videoOnboardingService.endSession(
        sessionId,
        undefined, // duration will be calculated automatically
        satisfaction,
        notes
      );
      
      setSessions(prev => prev.map(s => s.id === sessionId ? session : s));
      setSelectedSession(session);
      setSuccess('Session completed!');
      onSessionCompleted?.(session);
      
      // Reset form
      setSatisfaction(0);
      setNotes('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to end session');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSession = async (sessionId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const session = await videoOnboardingService.cancelSession(sessionId, 'Cancelled by user');
      setSessions(prev => prev.map(s => s.id === sessionId ? session : s));
      setSuccess('Session cancelled');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel session');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: VideoSession['status']) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="default">Scheduled</Badge>;
      case 'in_progress':
        return <Badge variant="default" className="bg-blue-500">In Progress</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'no_show':
        return <Badge variant="destructive">No Show</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getTemplate = (templateId: string) => {
    return templates.find(t => t.id === templateId);
  };

  return (
    <div className="space-y-6">
      {/* Schedule New Session */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Schedule Video Session
          </CardTitle>
          <CardDescription>
            Schedule a personalized video onboarding session
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Template Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Session Type</label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="Select session type" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name} ({template.duration} min)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Participant Name */}
          <div className="space-y-2">
            <label htmlFor="participant" className="text-sm font-medium">
              Participant Name
            </label>
            <Input
              id="participant"
              placeholder="Enter participant name"
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
            />
          </div>

          {/* Host Name */}
          <div className="space-y-2">
            <label htmlFor="host" className="text-sm font-medium">
              Host Name (Optional)
            </label>
            <Input
              id="host"
              placeholder="Enter host name"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
            />
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Scheduled Date & Time</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {scheduledDate ? format(scheduledDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={scheduledDate}
                  onSelect={setScheduledDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Template Details */}
          {selectedTemplate && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Session Details</h4>
              {(() => {
                const template = getTemplate(selectedTemplate);
                if (!template) return null;
                
                return (
                  <div className="text-sm space-y-2">
                    <div><strong>Duration:</strong> {template.duration} minutes</div>
                    <div><strong>Agenda:</strong></div>
                    <ul className="list-disc list-inside ml-2">
                      {template.agenda.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                    <div><strong>Materials:</strong> {template.materials.join(', ')}</div>
                  </div>
                );
              })()}
            </div>
          )}

          <Button
            onClick={handleScheduleSession}
            disabled={!selectedTemplate || !participantName || !scheduledDate || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Schedule Session'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* User Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Your Sessions
          </CardTitle>
          <CardDescription>
            Manage your scheduled and completed video sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No sessions scheduled yet
            </p>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div key={session.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{getTemplate(session.type)?.name || 'Default Session'}</h4>
                    {getStatusBadge(session.status)}
                  </div>
                  
                  <div className="text-sm text-muted-foreground space-y-1 mb-3">
                    <div>Participant: {session.participant}</div>
                    <div>Host: {session.host}</div>
                    <div>Scheduled: {session.scheduledAt.toLocaleString()}</div>
                    {session.startedAt && (
                      <div>Started: {session.startedAt.toLocaleString()}</div>
                    )}
                    {session.endedAt && (
                      <div>Ended: {session.endedAt.toLocaleString()}</div>
                    )}
                    {session.duration && (
                      <div>Duration: {session.duration} minutes</div>
                    )}
                    {session.satisfaction && (
                      <div className="flex items-center gap-1">
                        Satisfaction: 
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < session.satisfaction! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {session.status === 'scheduled' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleStartSession(session.id)}
                          disabled={isLoading}
                        >
                          Start Session
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancelSession(session.id)}
                          disabled={isLoading}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                    
                    {session.status === 'in_progress' && (
                      <Button
                        size="sm"
                        onClick={() => setSelectedSession(session)}
                      >
                        End Session
                      </Button>
                    )}
                    
                    {session.meetingUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(session.meetingUrl, '_blank')}
                      >
                        Join Meeting
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* End Session Modal */}
      {selectedSession && selectedSession.status === 'in_progress' && (
        <Card>
          <CardHeader>
            <CardTitle>End Session</CardTitle>
            <CardDescription>
              Complete the session and provide feedback
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Satisfaction Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setSatisfaction(rating)}
                    className="p-1"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        rating <= satisfaction ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Session Notes</label>
              <Textarea
                placeholder="Add notes about the session..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => handleEndSession(selectedSession.id)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Complete Session'
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedSession(null)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Messages */}
      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Messages */}
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default VideoOnboarding;
