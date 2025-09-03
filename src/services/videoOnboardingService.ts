// Video Onboarding Service - Real Implementation
import { vonageApi } from './vonageApi';

export interface VideoSession {
  id: string;
  userId: string;
  sessionId: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  scheduledAt: Date;
  startedAt?: Date;
  endedAt?: Date;
  duration?: number;
  host: string;
  participant: string;
  meetingUrl: string;
  recordingUrl?: string;
  notes?: string;
  satisfaction?: number;
  topics: string[];
  type: 'welcome' | 'training' | 'support' | 'sales' | 'custom';
}

export interface VideoTemplate {
  id: string;
  name: string;
  duration: number;
  agenda: string[];
  materials: string[];
  type: string;
}

export interface VideoAnalytics {
  totalScheduled: number;
  completed: number;
  cancelled: number;
  noShow: number;
  completionRate: number;
  averageDuration: number;
  averageSatisfaction: number;
  byType: Record<string, { scheduled: number; completed: number; satisfaction: number }>;
}

class VideoOnboardingService {
  private sessions: Map<string, VideoSession> = new Map();
  private analytics: VideoAnalytics = {
    totalScheduled: 0,
    completed: 0,
    cancelled: 0,
    noShow: 0,
    completionRate: 0,
    averageDuration: 0,
    averageSatisfaction: 0,
    byType: {}
  };

  private templates: VideoTemplate[] = [
    {
      id: 'welcome_call',
      name: 'Welcome Call',
      duration: 30,
      agenda: [
        'Introduction and welcome',
        'Platform overview',
        'Next steps',
        'Q&A session'
      ],
      materials: ['welcome_presentation', 'getting_started_guide'],
      type: 'welcome'
    },
    {
      id: 'training_session',
      name: 'Training Session',
      duration: 45,
      agenda: [
        'Feature deep dive',
        'Hands-on demonstration',
        'Best practices',
        'Customization options'
      ],
      materials: ['training_materials', 'demo_environment'],
      type: 'training'
    },
    {
      id: 'support_call',
      name: 'Support Call',
      duration: 20,
      agenda: [
        'Issue identification',
        'Solution demonstration',
        'Follow-up plan'
      ],
      materials: ['support_documentation'],
      type: 'support'
    }
  ];

  // Schedule a video session
  async scheduleSession(
    userId: string,
    participantName: string,
    scheduledAt: Date,
    templateId: string = 'welcome_call',
    hostName?: string
  ): Promise<VideoSession> {
    try {
      const template = this.templates.find(t => t.id === templateId);
      if (!template) {
        throw new Error(`Template ${templateId} not found`);
      }

      const sessionId = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create Vonage video session
      const vonageResponse = await vonageApi.createVideoSession({
        session_type: 'p2p',
        user_id: userId
      });
      
      if (!vonageResponse || !vonageResponse.sessionId) {
        throw new Error('Failed to create video session');
      }

      const session: VideoSession = {
        id: sessionId,
        userId,
        sessionId: vonageResponse.sessionId,
        status: 'scheduled',
        scheduledAt,
        host: hostName || 'OnboardIQ Host',
        participant: participantName,
        meetingUrl: `https://meet.vonage.com/${vonageResponse.sessionId}`,
        topics: template.agenda,
        type: template.type as any
      };

      this.sessions.set(session.id, session);
      this.analytics.totalScheduled++;
      this.updateAnalytics();

      return session;
    } catch (error) {
      console.error('Video Session Scheduling Error:', error);
      throw error;
    }
  }

  // Start a video session
  async startSession(sessionId: string): Promise<VideoSession> {
    const session = this.sessions.get(sessionId);
    
    if (!session) {
      throw new Error('Session not found');
    }

    if (session.status !== 'scheduled') {
      throw new Error('Session cannot be started');
    }

    session.status = 'in_progress';
    session.startedAt = new Date();

    return session;
  }

  // End a video session
  async endSession(sessionId: string, duration?: number, satisfaction?: number, notes?: string): Promise<VideoSession> {
    const session = this.sessions.get(sessionId);
    
    if (!session) {
      throw new Error('Session not found');
    }

    if (session.status !== 'in_progress') {
      throw new Error('Session is not in progress');
    }

    session.status = 'completed';
    session.endedAt = new Date();
    session.duration = duration || this.calculateDuration(session.startedAt!, session.endedAt);
    session.satisfaction = satisfaction;
    session.notes = notes;

    // Update analytics
    this.analytics.completed++;
    this.updateAnalytics();

    return session;
  }

  // Cancel a video session
  async cancelSession(sessionId: string, reason?: string): Promise<VideoSession> {
    const session = this.sessions.get(sessionId);
    
    if (!session) {
      throw new Error('Session not found');
    }

    if (session.status === 'completed') {
      throw new Error('Session already completed');
    }

    session.status = 'cancelled';
    session.notes = reason ? `${session.notes || ''}\nCancelled: ${reason}` : session.notes;

    this.analytics.cancelled++;
    this.updateAnalytics();

    return session;
  }

  // Mark session as no-show
  async markNoShow(sessionId: string): Promise<VideoSession> {
    const session = this.sessions.get(sessionId);
    
    if (!session) {
      throw new Error('Session not found');
    }

    if (session.status !== 'scheduled') {
      throw new Error('Session is not scheduled');
    }

    session.status = 'no_show';
    session.notes = `${session.notes || ''}\nNo-show`;

    this.analytics.noShow++;
    this.updateAnalytics();

    return session;
  }

  // Get session by ID
  getSession(sessionId: string): VideoSession | undefined {
    return this.sessions.get(sessionId);
  }

  // Get sessions by user ID
  getSessionsByUserId(userId: string): VideoSession[] {
    return Array.from(this.sessions.values()).filter(session => session.userId === userId);
  }

  // Get sessions by status
  getSessionsByStatus(status: VideoSession['status']): VideoSession[] {
    return Array.from(this.sessions.values()).filter(session => session.status === status);
  }

  // Get sessions by type
  getSessionsByType(type: VideoSession['type']): VideoSession[] {
    return Array.from(this.sessions.values()).filter(session => session.type === type);
  }

  // Get templates by type
  getTemplatesByType(type: string): VideoTemplate[] {
    return this.templates.filter(template => template.type === type);
  }

  // Get all templates
  getAllTemplates(): VideoTemplate[] {
    return this.templates;
  }

  // Get analytics
  getAnalytics(): VideoAnalytics {
    return { ...this.analytics };
  }

  // Update analytics
  private updateAnalytics(): void {
    const sessions = Array.from(this.sessions.values());
    
    if (this.analytics.totalScheduled > 0) {
      this.analytics.completionRate = this.analytics.completed / this.analytics.totalScheduled;
    }

    const completedSessions = sessions.filter(s => s.status === 'completed' && s.duration);
    if (completedSessions.length > 0) {
      this.analytics.averageDuration = completedSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / completedSessions.length;
    }

    const ratedSessions = sessions.filter(s => s.status === 'completed' && s.satisfaction);
    if (ratedSessions.length > 0) {
      this.analytics.averageSatisfaction = ratedSessions.reduce((sum, s) => sum + (s.satisfaction || 0), 0) / ratedSessions.length;
    }

    // Update by type analytics
    this.analytics.byType = {};
    this.templates.forEach(template => {
      const typeSessions = this.getSessionsByType(template.type as any);
      this.analytics.byType[template.type] = {
        scheduled: typeSessions.length,
        completed: typeSessions.filter(s => s.status === 'completed').length,
        satisfaction: typeSessions.filter(s => s.status === 'completed' && s.satisfaction)
          .reduce((sum, s) => sum + (s.satisfaction || 0), 0) / 
          Math.max(typeSessions.filter(s => s.status === 'completed' && s.satisfaction).length, 1)
      };
    });
  }

  // Calculate duration between two dates
  private calculateDuration(startTime: Date, endTime: Date): number {
    return Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60)); // Duration in minutes
  }

  // Get upcoming sessions
  getUpcomingSessions(limit: number = 10): VideoSession[] {
    const now = new Date();
    return Array.from(this.sessions.values())
      .filter(session => session.status === 'scheduled' && session.scheduledAt > now)
      .sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime())
      .slice(0, limit);
  }

  // Get session statistics
  getSessionStats(): { total: number; scheduled: number; inProgress: number; completed: number; cancelled: number; noShow: number } {
    const sessions = Array.from(this.sessions.values());
    return {
      total: sessions.length,
      scheduled: sessions.filter(s => s.status === 'scheduled').length,
      inProgress: sessions.filter(s => s.status === 'in_progress').length,
      completed: sessions.filter(s => s.status === 'completed').length,
      cancelled: sessions.filter(s => s.status === 'cancelled').length,
      noShow: sessions.filter(s => s.status === 'no_show').length
    };
  }

  // Send session reminder
  async sendSessionReminder(sessionId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);
    
    if (!session || session.status !== 'scheduled') {
      return false;
    }

    // Send reminder via email/SMS
    try {
      // This would integrate with your notification service
      console.log(`Sending reminder for session ${sessionId} to ${session.participant}`);
      return true;
    } catch (error) {
      console.error('Failed to send session reminder:', error);
      return false;
    }
  }

  // Generate meeting link
  generateMeetingLink(sessionId: string): string {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }
    return session.meetingUrl;
  }

  // Get session materials
  getSessionMaterials(sessionId: string): string[] {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return [];
    }

    const template = this.templates.find(t => t.id === session.type);
    return template?.materials || [];
  }
}

// Export singleton instance
export const videoOnboardingService = new VideoOnboardingService();
export default videoOnboardingService;
