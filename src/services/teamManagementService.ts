// Team Management Service - Real Implementation

export interface TeamMember {
  id: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: Date;
  permissions: string[];
  status: 'active' | 'invited' | 'suspended';
}

export interface Team {
  id: string;
  name: string;
  owner: string;
  createdAt: Date;
  status: 'active' | 'archived' | 'pending';
  plan: 'free' | 'premium' | 'enterprise';
  members: TeamMember[];
  settings: {
    allowInvites: boolean;
    requireApproval: boolean;
    maxMembers: number;
    defaultRole: 'member' | 'viewer';
  };
}

export interface TeamInvitation {
  id: string;
  teamId: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  invitedBy: string;
  invitedAt: Date;
  expiresAt: Date;
  acceptedAt?: Date;
  message?: string;
}

export interface TeamActivity {
  id: string;
  teamId: string;
  userId: string;
  action: 'member_joined' | 'member_left' | 'role_changed' | 'document_created' | 'document_shared' | 'invitation_sent' | 'invitation_accepted' | 'settings_updated';
  timestamp: Date;
  details: Record<string, any>;
}

export interface TeamAnalytics {
  totalTeams: number;
  activeTeams: number;
  totalMembers: number;
  averageTeamSize: number;
  invitationsSent: number;
  invitationsAccepted: number;
  acceptanceRate: number;
  byPlan: Record<string, { teams: number; members: number }>;
  activityMetrics: {
    dailyActiveTeams: number;
    weeklyActiveTeams: number;
    monthlyActiveTeams: number;
    averageActivitiesPerDay: number;
  };
}

class TeamManagementService {
  private teams: Map<string, Team> = new Map();
  private invitations: Map<string, TeamInvitation> = new Map();
  private activities: Map<string, TeamActivity> = new Map();
  private analytics: TeamAnalytics = {
    totalTeams: 0,
    activeTeams: 0,
    totalMembers: 0,
    averageTeamSize: 0,
    invitationsSent: 0,
    invitationsAccepted: 0,
    acceptanceRate: 0,
    byPlan: {},
    activityMetrics: {
      dailyActiveTeams: 0,
      weeklyActiveTeams: 0,
      monthlyActiveTeams: 0,
      averageActivitiesPerDay: 0
    }
  };

  // Create a new team
  async createTeam(
    name: string,
    ownerId: string,
    plan: Team['plan'] = 'free',
    settings?: Partial<Team['settings']>
  ): Promise<Team> {
    try {
      const teamId = `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const defaultSettings: Team['settings'] = {
        allowInvites: true,
        requireApproval: false,
        maxMembers: plan === 'free' ? 5 : plan === 'premium' ? 25 : 100,
        defaultRole: 'member'
      };

      const team: Team = {
        id: teamId,
        name,
        owner: ownerId,
        createdAt: new Date(),
        status: 'active',
        plan,
        members: [{
          id: `member_${ownerId}`,
          userId: ownerId,
          role: 'owner',
          joinedAt: new Date(),
          permissions: ['manage_users', 'manage_documents', 'view_analytics', 'manage_integrations', 'billing_access'],
          status: 'active'
        }],
        settings: { ...defaultSettings, ...settings }
      };

      this.teams.set(team.id, team);
      this.analytics.totalTeams++;
      this.analytics.activeTeams++;
      this.updateAnalytics();

      // Log activity
      this.logActivity(teamId, ownerId, 'member_joined', { role: 'owner' });

      return team;
    } catch (error) {
      console.error('Team Creation Error:', error);
      throw error;
    }
  }

  // Invite a member to a team
  async inviteMember(
    teamId: string,
    email: string,
    role: TeamInvitation['role'],
    invitedBy: string,
    message?: string
  ): Promise<TeamInvitation> {
    try {
      const team = this.teams.get(teamId);
      if (!team) {
        throw new Error('Team not found');
      }

      // Check if user is already a member
      const existingMember = team.members.find(m => m.userId === email);
      if (existingMember) {
        throw new Error('User is already a member of this team');
      }

      // Check team size limits
      if (team.members.length >= team.settings.maxMembers) {
        throw new Error('Team has reached maximum member limit');
      }

      const invitationId = `invite_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

      const invitation: TeamInvitation = {
        id: invitationId,
        teamId,
        email,
        role,
        status: 'pending',
        invitedBy,
        invitedAt: new Date(),
        expiresAt,
        message
      };

      this.invitations.set(invitation.id, invitation);
      this.analytics.invitationsSent++;
      this.updateAnalytics();

      // Log activity
      this.logActivity(teamId, invitedBy, 'invitation_sent', { email, role });

      return invitation;
    } catch (error) {
      console.error('Member Invitation Error:', error);
      throw error;
    }
  }

  // Accept team invitation
  async acceptInvitation(invitationId: string, userId: string): Promise<TeamMember> {
    try {
      const invitation = this.invitations.get(invitationId);
      if (!invitation) {
        throw new Error('Invitation not found');
      }

      if (invitation.status !== 'pending') {
        throw new Error('Invitation is not pending');
      }

      if (new Date() > invitation.expiresAt) {
        invitation.status = 'expired';
        throw new Error('Invitation has expired');
      }

      const team = this.teams.get(invitation.teamId);
      if (!team) {
        throw new Error('Team not found');
      }

      // Create team member
      const member: TeamMember = {
        id: `member_${userId}`,
        userId,
        role: invitation.role,
        joinedAt: new Date(),
        permissions: this.getPermissionsForRole(invitation.role),
        status: 'active'
      };

      team.members.push(member);
      invitation.status = 'accepted';
      invitation.acceptedAt = new Date();

      this.analytics.invitationsAccepted++;
      this.updateAnalytics();

      // Log activity
      this.logActivity(team.id, userId, 'invitation_accepted', { role: invitation.role });

      return member;
    } catch (error) {
      console.error('Invitation Acceptance Error:', error);
      throw error;
    }
  }

  // Decline team invitation
  async declineInvitation(invitationId: string): Promise<void> {
    const invitation = this.invitations.get(invitationId);
    if (!invitation) {
      throw new Error('Invitation not found');
    }

    invitation.status = 'declined';
  }

  // Remove member from team
  async removeMember(teamId: string, userId: string, removedBy: string): Promise<void> {
    try {
      const team = this.teams.get(teamId);
      if (!team) {
        throw new Error('Team not found');
      }

      const memberIndex = team.members.findIndex(m => m.userId === userId);
      if (memberIndex === -1) {
        throw new Error('Member not found');
      }

      const member = team.members[memberIndex];
      if (member.role === 'owner') {
        throw new Error('Cannot remove team owner');
      }

      team.members.splice(memberIndex, 1);

      // Log activity
      this.logActivity(teamId, removedBy, 'member_left', { removedUserId: userId, role: member.role });

      this.updateAnalytics();
    } catch (error) {
      console.error('Member Removal Error:', error);
      throw error;
    }
  }

  // Change member role
  async changeMemberRole(teamId: string, userId: string, newRole: TeamMember['role'], changedBy: string): Promise<TeamMember> {
    try {
      const team = this.teams.get(teamId);
      if (!team) {
        throw new Error('Team not found');
      }

      const member = team.members.find(m => m.userId === userId);
      if (!member) {
        throw new Error('Member not found');
      }

      const oldRole = member.role;
      member.role = newRole;
      member.permissions = this.getPermissionsForRole(newRole);

      // Log activity
      this.logActivity(teamId, changedBy, 'role_changed', { 
        targetUserId: userId, 
        oldRole, 
        newRole 
      });

      return member;
    } catch (error) {
      console.error('Role Change Error:', error);
      throw error;
    }
  }

  // Get team by ID
  getTeam(teamId: string): Team | undefined {
    return this.teams.get(teamId);
  }

  // Get teams by owner
  getTeamsByOwner(ownerId: string): Team[] {
    return Array.from(this.teams.values()).filter(team => team.owner === ownerId);
  }

  // Get teams by member
  getTeamsByMember(userId: string): Team[] {
    return Array.from(this.teams.values()).filter(team => 
      team.members.some(member => member.userId === userId)
    );
  }

  // Get invitations by status
  getInvitationsByStatus(status: TeamInvitation['status']): TeamInvitation[] {
    return Array.from(this.invitations.values()).filter(invitation => invitation.status === status);
  }

  // Get invitations by team
  getInvitationsByTeam(teamId: string): TeamInvitation[] {
    return Array.from(this.invitations.values()).filter(invitation => invitation.teamId === teamId);
  }

  // Get team activities
  getTeamActivities(teamId: string, limit: number = 50): TeamActivity[] {
    return Array.from(this.activities.values())
      .filter(activity => activity.teamId === teamId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  // Get analytics
  getAnalytics(): TeamAnalytics {
    return { ...this.analytics };
  }

  // Update team settings
  async updateTeamSettings(teamId: string, settings: Partial<Team['settings']>): Promise<Team> {
    const team = this.teams.get(teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    team.settings = { ...team.settings, ...settings };

    // Log activity
    this.logActivity(teamId, team.owner, 'settings_updated', { settings });

    return team;
  }

  // Archive team
  async archiveTeam(teamId: string): Promise<Team> {
    const team = this.teams.get(teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    team.status = 'archived';
    this.analytics.activeTeams--;
    this.updateAnalytics();

    return team;
  }

  // Get team statistics
  getTeamStats(teamId: string): { memberCount: number; activeMembers: number; admins: number; pendingInvitations: number } | null {
    const team = this.teams.get(teamId);
    if (!team) {
      return null;
    }

    return {
      memberCount: team.members.length,
      activeMembers: team.members.filter(m => m.status === 'active').length,
      admins: team.members.filter(m => m.role === 'admin').length,
      pendingInvitations: Array.from(this.invitations.values())
        .filter(i => i.teamId === teamId && i.status === 'pending').length
    };
  }

  // Get permissions for role
  private getPermissionsForRole(role: TeamMember['role']): string[] {
    switch (role) {
      case 'owner':
        return ['manage_users', 'manage_documents', 'view_analytics', 'manage_integrations', 'billing_access'];
      case 'admin':
        return ['manage_users', 'manage_documents', 'view_analytics', 'manage_integrations'];
      case 'member':
        return ['manage_documents', 'view_analytics'];
      case 'viewer':
        return ['view_analytics'];
      default:
        return [];
    }
  }

  // Log activity
  private logActivity(teamId: string, userId: string, action: TeamActivity['action'], details: Record<string, any>): void {
    const activityId = `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const activity: TeamActivity = {
      id: activityId,
      teamId,
      userId,
      action,
      timestamp: new Date(),
      details
    };

    this.activities.set(activity.id, activity);
  }

  // Update analytics
  private updateAnalytics(): void {
    const teams = Array.from(this.teams.values());
    
    this.analytics.totalTeams = teams.length;
    this.analytics.activeTeams = teams.filter(t => t.status === 'active').length;
    this.analytics.totalMembers = teams.reduce((sum, team) => sum + team.members.length, 0);
    
    if (this.analytics.totalTeams > 0) {
      this.analytics.averageTeamSize = this.analytics.totalMembers / this.analytics.totalTeams;
    }

    if (this.analytics.invitationsSent > 0) {
      this.analytics.acceptanceRate = this.analytics.invitationsAccepted / this.analytics.invitationsSent;
    }

    // Update by plan analytics
    this.analytics.byPlan = {};
    ['free', 'premium', 'enterprise'].forEach(plan => {
      const planTeams = teams.filter(t => t.plan === plan);
      this.analytics.byPlan[plan] = {
        teams: planTeams.length,
        members: planTeams.reduce((sum, team) => sum + team.members.length, 0)
      };
    });

    // Update activity metrics
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const activities = Array.from(this.activities.values());
    
    this.analytics.activityMetrics = {
      dailyActiveTeams: new Set(activities
        .filter(a => a.timestamp > oneDayAgo)
        .map(a => a.teamId)).size,
      weeklyActiveTeams: new Set(activities
        .filter(a => a.timestamp > oneWeekAgo)
        .map(a => a.teamId)).size,
      monthlyActiveTeams: new Set(activities
        .filter(a => a.timestamp > oneMonthAgo)
        .map(a => a.teamId)).size,
      averageActivitiesPerDay: activities.length / Math.max(1, Math.floor((now.getTime() - teams[0]?.createdAt.getTime() || now.getTime()) / (24 * 60 * 60 * 1000)))
    };
  }

  // Clean up expired invitations
  cleanupExpiredInvitations(): void {
    const now = new Date();
    for (const [invitationId, invitation] of this.invitations.entries()) {
      if (invitation.status === 'pending' && now > invitation.expiresAt) {
        invitation.status = 'expired';
      }
    }
  }
}

// Export singleton instance
export const teamManagementService = new TeamManagementService();
export default teamManagementService;
