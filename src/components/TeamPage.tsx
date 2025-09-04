import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  UserPlus, 
  Settings, 
  Shield, 
  Crown, 
  UserCheck,
  UserX,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Activity,
  TrendingUp,
  MessageSquare,
  FileText,
  Video,
  CheckCircle,
  AlertTriangle,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Filter,
  Download,
  Upload,
  RefreshCw,
  Plus,
  Star,
  Award,
  Target,
  BarChart3,
  PieChart,
  Users2,
  UserCog,
  Key,
  Lock,
  Unlock,
  Bell,
  Zap,
  Brain,
  Sparkles
} from 'lucide-react';

interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'manager' | 'member' | 'viewer';
  department: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  lastActive: string;
  permissions: string[];
  performance: {
    onboardingCompleted: number;
    documentsProcessed: number;
    sessionsAttended: number;
    rating: number;
  };
}

interface TeamStats {
  totalMembers: number;
  activeMembers: number;
  pendingInvites: number;
  departments: number;
  avgPerformance: number;
  recentActivity: number;
}

const TeamPage: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [stats, setStats] = useState<TeamStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState('members');
  const { toast } = useToast();

  useEffect(() => {
    loadTeamData();
  }, []);

  const loadTeamData = async () => {
    try {
      setLoading(true);
      
      // Simulate API calls
      const membersResponse = await fetch('/api/team/members');
      const statsResponse = await fetch('/api/team/stats');
      
      const members = await membersResponse.json();
      const teamStats = await statsResponse.json();
      
      setTeamMembers(members);
      setStats(teamStats);
    } catch (error) {
      console.error('Error loading team data:', error);
      // Fallback to mock data
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  const setMockData = () => {
    setTeamMembers([
      {
        id: '1',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@company.com',
        role: 'admin',
        department: 'Engineering',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        status: 'active',
        joinDate: '2023-01-15',
        lastActive: '2024-01-20',
        permissions: ['manage_team', 'view_analytics', 'edit_documents', 'invite_users'],
        performance: {
          onboardingCompleted: 45,
          documentsProcessed: 120,
          sessionsAttended: 15,
          rating: 4.8
        }
      },
      {
        id: '2',
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'michael.chen@company.com',
        role: 'manager',
        department: 'Product',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        status: 'active',
        joinDate: '2023-03-20',
        lastActive: '2024-01-19',
        permissions: ['view_analytics', 'edit_documents', 'invite_users'],
        performance: {
          onboardingCompleted: 32,
          documentsProcessed: 89,
          sessionsAttended: 12,
          rating: 4.6
        }
      },
      {
        id: '3',
        firstName: 'Emily',
        lastName: 'Rodriguez',
        email: 'emily.rodriguez@company.com',
        role: 'member',
        department: 'Marketing',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        status: 'active',
        joinDate: '2023-06-10',
        lastActive: '2024-01-18',
        permissions: ['view_analytics', 'edit_documents'],
        performance: {
          onboardingCompleted: 28,
          documentsProcessed: 67,
          sessionsAttended: 8,
          rating: 4.4
        }
      },
      {
        id: '4',
        firstName: 'David',
        lastName: 'Thompson',
        email: 'david.thompson@company.com',
        role: 'viewer',
        department: 'Sales',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        status: 'pending',
        joinDate: '2024-01-15',
        lastActive: '2024-01-15',
        permissions: ['view_analytics'],
        performance: {
          onboardingCompleted: 0,
          documentsProcessed: 0,
          sessionsAttended: 0,
          rating: 0
        }
      },
      {
        id: '5',
        firstName: 'Lisa',
        lastName: 'Wang',
        email: 'lisa.wang@company.com',
        role: 'member',
        department: 'Customer Success',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        status: 'active',
        joinDate: '2023-08-05',
        lastActive: '2024-01-17',
        permissions: ['view_analytics', 'edit_documents'],
        performance: {
          onboardingCompleted: 19,
          documentsProcessed: 45,
          sessionsAttended: 6,
          rating: 4.2
        }
      }
    ]);

    setStats({
      totalMembers: 5,
      activeMembers: 4,
      pendingInvites: 1,
      departments: 5,
      avgPerformance: 4.4,
      recentActivity: 12
    });
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || member.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || member.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="w-4 h-4" />;
      case 'manager': return <Shield className="w-4 h-4" />;
      case 'member': return <UserCheck className="w-4 h-4" />;
      case 'viewer': return <Eye className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'member': return 'bg-green-100 text-green-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleInviteMember = () => {
    toast({
      title: "Invite sent!",
      description: "Team member invitation has been sent successfully.",
    });
    setShowInviteModal(false);
  };

  const handleUpdateRole = (memberId: string, newRole: string) => {
    setTeamMembers(prev => prev.map(member => 
      member.id === memberId ? { ...member, role: newRole as any } : member
    ));
    toast({
      title: "Role updated!",
      description: "Team member role has been updated successfully.",
    });
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
          <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
          <p className="text-gray-600 mt-2">
            Manage your team members, roles, and permissions
          </p>
        </div>
        <Button 
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Invite Member
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Members</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalMembers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Members</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeMembers}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Invites</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingInvites}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Performance</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.avgPerformance}/5</p>
                </div>
                <Star className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="search">Search Members</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="search"
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Members List */}
          <div className="grid gap-4">
            {filteredMembers.map((member) => (
              <Card key={member.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          {member.firstName[0]}{member.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">
                            {member.firstName} {member.lastName}
                          </h3>
                          <Badge className={getStatusColor(member.status)}>
                            {member.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600">{member.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getRoleColor(member.role)}>
                            {getRoleIcon(member.role)}
                            {member.role}
                          </Badge>
                          <span className="text-sm text-gray-500">• {member.department}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Performance</div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="font-medium">{member.performance.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateRole(member.id, 'manager')}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Team Performance
                </CardTitle>
                <CardDescription>Overall team metrics and KPIs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Onboarding Completion</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Document Processing</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Session Attendance</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Rating</span>
                    <span className="font-medium">4.4/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Role Distribution
                </CardTitle>
                <CardDescription>Team members by role</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">Admins</span>
                    </div>
                    <span className="font-medium">1</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Managers</span>
                    </div>
                    <span className="font-medium">1</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Members</span>
                    </div>
                    <span className="font-medium">2</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                      <span className="text-sm">Viewers</span>
                    </div>
                    <span className="font-medium">1</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Team Settings
              </CardTitle>
              <CardDescription>Configure team permissions and policies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Permission Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Allow member invitations</p>
                        <p className="text-sm text-gray-600">Members can invite new team members</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Document editing permissions</p>
                        <p className="text-sm text-gray-600">Control who can edit documents</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Analytics access</p>
                        <p className="text-sm text-gray-600">Manage analytics visibility</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Security Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Two-factor authentication</p>
                        <p className="text-sm text-gray-600">Require 2FA for all team members</p>
                      </div>
                      <Button variant="outline" size="sm">Enable</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Session timeout</p>
                        <p className="text-sm text-gray-600">Auto-logout after inactivity</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Invite Team Member</CardTitle>
              <CardDescription>Send an invitation to join your team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" placeholder="colleague@company.com" />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Input id="department" placeholder="e.g., Engineering" />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleInviteMember} className="flex-1">
                  Send Invite
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TeamPage;
