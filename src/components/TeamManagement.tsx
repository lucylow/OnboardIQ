import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Loader2, CheckCircle, XCircle, Users, UserPlus, Settings, Mail, Crown, Shield, Eye } from 'lucide-react';
import { teamManagementService, Team, TeamMember, TeamInvitation } from '../services/teamManagementService';

interface TeamManagementProps {
  userId: string;
  onTeamCreated?: (team: Team) => void;
  onMemberInvited?: (invitation: TeamInvitation) => void;
  onMemberJoined?: (member: TeamMember) => void;
}

export const TeamManagement: React.FC<TeamManagementProps> = ({
  userId,
  onTeamCreated,
  onMemberInvited,
  onMemberJoined
}) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Create team form state
  const [teamName, setTeamName] = useState('');
  const [teamPlan, setTeamPlan] = useState<'free' | 'premium' | 'enterprise'>('free');
  
  // Invite member form state
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member' | 'viewer'>('member');
  const [inviteMessage, setInviteMessage] = useState('');

  // Load user teams and invitations on component mount
  useEffect(() => {
    loadUserTeams();
    loadUserInvitations();
  }, [userId]);

  const loadUserTeams = async () => {
    try {
      const userTeams = teamManagementService.getTeamsByMember(userId);
      const ownedTeams = teamManagementService.getTeamsByOwner(userId);
      const allTeams = [...userTeams, ...ownedTeams.filter(team => 
        !userTeams.some(userTeam => userTeam.id === team.id)
      )];
      setTeams(allTeams);
    } catch (err) {
      setError('Failed to load teams');
    }
  };

  const loadUserInvitations = async () => {
    try {
      const userInvitations = teamManagementService.getInvitationsByStatus('pending');
      setInvitations(userInvitations);
    } catch (err) {
      setError('Failed to load invitations');
    }
  };

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      setError('Please enter a team name');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const team = await teamManagementService.createTeam(teamName, userId, teamPlan);
      setTeams(prev => [team, ...prev]);
      setSuccess('Team created successfully!');
      onTeamCreated?.(team);
      
      // Reset form
      setTeamName('');
      setTeamPlan('free');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create team');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInviteMember = async (teamId: string) => {
    if (!inviteEmail.trim()) {
      setError('Please enter an email address');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const invitation = await teamManagementService.inviteMember(
        teamId,
        inviteEmail,
        inviteRole,
        userId,
        inviteMessage
      );
      
      setSuccess('Invitation sent successfully!');
      onMemberInvited?.(invitation);
      
      // Reset form
      setInviteEmail('');
      setInviteRole('member');
      setInviteMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invitation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptInvitation = async (invitationId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const member = await teamManagementService.acceptInvitation(invitationId, userId);
      setSuccess('Invitation accepted! You are now a team member.');
      onMemberJoined?.(member);
      
      // Reload teams and invitations
      loadUserTeams();
      loadUserInvitations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to accept invitation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeclineInvitation = async (invitationId: string) => {
    try {
      await teamManagementService.declineInvitation(invitationId);
      setSuccess('Invitation declined');
      loadUserInvitations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to decline invitation');
    }
  };

  const handleRemoveMember = async (teamId: string, memberId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await teamManagementService.removeMember(teamId, memberId, userId);
      setSuccess('Member removed from team');
      loadUserTeams();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove member');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeRole = async (teamId: string, memberId: string, newRole: TeamMember['role']) => {
    setIsLoading(true);
    setError(null);

    try {
      await teamManagementService.changeMemberRole(teamId, memberId, newRole, userId);
      setSuccess('Member role updated');
      loadUserTeams();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change role');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role: TeamMember['role']) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-4 w-4 text-yellow-600" />;
      case 'admin':
        return <Shield className="h-4 w-4 text-blue-600" />;
      case 'member':
        return <Users className="h-4 w-4 text-green-600" />;
      case 'viewer':
        return <Eye className="h-4 w-4 text-gray-600" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getRoleBadge = (role: TeamMember['role']) => {
    switch (role) {
      case 'owner':
        return <Badge variant="default" className="bg-yellow-500">Owner</Badge>;
      case 'admin':
        return <Badge variant="default" className="bg-blue-500">Admin</Badge>;
      case 'member':
        return <Badge variant="default" className="bg-green-500">Member</Badge>;
      case 'viewer':
        return <Badge variant="secondary">Viewer</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getPlanBadge = (plan: Team['plan']) => {
    switch (plan) {
      case 'free':
        return <Badge variant="outline">Free</Badge>;
      case 'premium':
        return <Badge variant="default" className="bg-purple-500">Premium</Badge>;
      case 'enterprise':
        return <Badge variant="default" className="bg-gray-800">Enterprise</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Create New Team */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Create New Team
          </CardTitle>
          <CardDescription>
            Create a new team to collaborate with others
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="teamName" className="text-sm font-medium">
              Team Name
            </label>
            <Input
              id="teamName"
              placeholder="Enter team name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Plan</label>
            <Select value={teamPlan} onValueChange={(value: any) => setTeamPlan(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free (5 members)</SelectItem>
                <SelectItem value="premium">Premium (25 members)</SelectItem>
                <SelectItem value="enterprise">Enterprise (100 members)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleCreateTeam}
            disabled={!teamName.trim() || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Create Team'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Your Teams */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Your Teams
          </CardTitle>
          <CardDescription>
            Manage your teams and team members
          </CardDescription>
        </CardHeader>
        <CardContent>
          {teams.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              You haven't joined any teams yet
            </p>
          ) : (
            <div className="space-y-4">
              {teams.map((team) => (
                <div key={team.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium">{team.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        {getPlanBadge(team.plan)}
                        <span className="text-sm text-muted-foreground">
                          {team.members.length} members
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedTeam(selectedTeam?.id === team.id ? null : team)}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Team Members */}
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Members</h5>
                    {team.members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-2 bg-muted rounded">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {member.userId.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{member.userId}</span>
                          {getRoleIcon(member.role)}
                        </div>
                        <div className="flex items-center gap-2">
                          {getRoleBadge(member.role)}
                          {team.owner === userId && member.role !== 'owner' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRemoveMember(team.id, member.userId)}
                              disabled={isLoading}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Invite Member Form */}
                  {selectedTeam?.id === team.id && (
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <h5 className="text-sm font-medium mb-3">Invite New Member</h5>
                      <div className="space-y-3">
                        <Input
                          placeholder="Email address"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                        />
                        <Select value={inviteRole} onValueChange={(value: any) => setInviteRole(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                        <Textarea
                          placeholder="Optional message"
                          value={inviteMessage}
                          onChange={(e) => setInviteMessage(e.target.value)}
                          rows={2}
                        />
                        <Button
                          onClick={() => handleInviteMember(team.id)}
                          disabled={!inviteEmail.trim() || isLoading}
                          size="sm"
                        >
                          <UserPlus className="h-4 w-4 mr-1" />
                          Send Invitation
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      {invitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Pending Invitations
            </CardTitle>
            <CardDescription>
              Respond to team invitations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invitations.map((invitation) => (
                <div key={invitation.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{invitation.email}</div>
                    <div className="text-sm text-muted-foreground">
                      {invitation.message || 'No message'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Invited {invitation.invitedAt.toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {getRoleBadge(invitation.role)}
                    <Button
                      size="sm"
                      onClick={() => handleAcceptInvitation(invitation.id)}
                      disabled={isLoading}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeclineInvitation(invitation.id)}
                      disabled={isLoading}
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              ))}
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

export default TeamManagement;
