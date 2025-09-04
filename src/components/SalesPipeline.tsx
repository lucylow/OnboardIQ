import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calendar, 
  Target, 
  BarChart3,
  Phone,
  Mail,
  Building,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Plus,
  Filter,
  Search,
  ArrowRight,
  ArrowLeft,
  Star,
  Activity
} from "lucide-react";

interface Deal {
  id: string;
  name: string;
  company: string;
  value: number;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  probability: number;
  expectedCloseDate: string;
  owner: string;
  lastActivity: string;
  source: string;
  industry: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  notes: string;
  nextAction: string;
  priority: 'high' | 'medium' | 'low';
}

interface SalesMetric {
  name: string;
  value: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  percentage: number;
  period: string;
}

const SalesPipeline: React.FC = () => {
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [filterStage, setFilterStage] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const deals: Deal[] = [
    {
      id: "DEAL-001",
      name: "Enterprise Onboarding Solution",
      company: "TechFlow Solutions",
      value: 125000,
      stage: 'negotiation',
      probability: 75,
      expectedCloseDate: "2024-05-15",
      owner: "Sarah Johnson",
      lastActivity: "2024-04-16",
      source: "Referral",
      industry: "SaaS",
      contactName: "Mike Chen",
      contactEmail: "mike@techflow.com",
      contactPhone: "+1 (555) 123-4567",
      notes: "Client is interested in custom onboarding flows and enterprise features. Budget approved, finalizing contract terms.",
      nextAction: "Send final proposal",
      priority: 'high'
    },
    {
      id: "DEAL-002",
      name: "Retail Chain Integration",
      company: "Global Retail Corp",
      value: 85000,
      stage: 'proposal',
      probability: 60,
      expectedCloseDate: "2024-06-01",
      owner: "David Rodriguez",
      lastActivity: "2024-04-14",
      source: "Cold Outreach",
      industry: "Retail",
      contactName: "Lisa Wang",
      contactEmail: "lisa@globalretail.com",
      contactPhone: "+1 (555) 234-5678",
      notes: "Proposal sent, waiting for feedback. Client has concerns about implementation timeline.",
      nextAction: "Follow up on proposal",
      priority: 'medium'
    },
    {
      id: "DEAL-003",
      name: "Startup Growth Package",
      company: "Innovate Labs",
      value: 45000,
      stage: 'closed-won',
      probability: 100,
      expectedCloseDate: "2024-04-10",
      owner: "Emily Chen",
      lastActivity: "2024-04-10",
      source: "Website",
      industry: "Technology",
      contactName: "Alex Thompson",
      contactEmail: "alex@innovatelabs.com",
      contactPhone: "+1 (555) 345-6789",
      notes: "Deal closed successfully. Client signed annual contract with premium features.",
      nextAction: "Begin onboarding process",
      priority: 'high'
    },
    {
      id: "DEAL-004",
      name: "Healthcare Compliance Solution",
      company: "MedTech Systems",
      value: 200000,
      stage: 'qualification',
      probability: 40,
      expectedCloseDate: "2024-07-01",
      owner: "Sarah Johnson",
      lastActivity: "2024-04-12",
      source: "Trade Show",
      industry: "Healthcare",
      contactName: "Dr. Sarah Miller",
      contactEmail: "sarah@medtech.com",
      contactPhone: "+1 (555) 456-7890",
      notes: "Initial discovery call completed. Client has specific compliance requirements.",
      nextAction: "Schedule demo",
      priority: 'medium'
    },
    {
      id: "DEAL-005",
      name: "Financial Services Platform",
      company: "FinServ Solutions",
      value: 300000,
      stage: 'prospecting',
      probability: 20,
      expectedCloseDate: "2024-08-01",
      owner: "David Rodriguez",
      lastActivity: "2024-04-08",
      source: "LinkedIn",
      industry: "Financial Services",
      contactName: "James Wilson",
      contactEmail: "james@finserv.com",
      contactPhone: "+1 (555) 567-8901",
      notes: "Initial contact made. Need to understand their specific requirements.",
      nextAction: "Send introductory materials",
      priority: 'low'
    }
  ];

  const salesMetrics: SalesMetric[] = [
    {
      name: "Total Pipeline Value",
      value: 755000,
      target: 1000000,
      trend: 'up',
      percentage: 75.5,
      period: "Q2 2024"
    },
    {
      name: "Closed Won Revenue",
      value: 45000,
      target: 250000,
      trend: 'up',
      percentage: 18,
      period: "Q2 2024"
    },
    {
      name: "Win Rate",
      value: 68,
      target: 65,
      trend: 'up',
      percentage: 105,
      period: "YTD"
    },
    {
      name: "Average Deal Size",
      value: 151000,
      target: 125000,
      trend: 'up',
      percentage: 121,
      period: "YTD"
    },
    {
      name: "Sales Cycle Length",
      value: 45,
      target: 60,
      trend: 'up',
      percentage: 75,
      period: "days"
    },
    {
      name: "Lead Conversion Rate",
      value: 12,
      target: 10,
      trend: 'up',
      percentage: 120,
      period: "%"
    }
  ];

  const stageData = {
    prospecting: { count: 1, value: 300000, color: 'bg-gray-500' },
    qualification: { count: 1, value: 200000, color: 'bg-blue-500' },
    proposal: { count: 1, value: 85000, color: 'bg-yellow-500' },
    negotiation: { count: 1, value: 125000, color: 'bg-orange-500' },
    'closed-won': { count: 1, value: 45000, color: 'bg-green-500' },
    'closed-lost': { count: 0, value: 0, color: 'bg-red-500' }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'prospecting': return 'bg-gray-100 text-gray-800';
      case 'qualification': return 'bg-blue-100 text-blue-800';
      case 'proposal': return 'bg-yellow-100 text-yellow-800';
      case 'negotiation': return 'bg-orange-100 text-orange-800';
      case 'closed-won': return 'bg-green-100 text-green-800';
      case 'closed-lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const filteredDeals = deals.filter(deal => {
    const matchesStage = filterStage === 'all' || deal.stage === filterStage;
    const matchesSearch = deal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.contactName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const totalPipelineValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const weightedPipelineValue = deals.reduce((sum, deal) => sum + (deal.value * deal.probability / 100), 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Pipeline</h1>
          <p className="text-gray-600 mt-2">Track deals, forecast revenue, and manage sales performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Deal
          </Button>
        </div>
      </div>

      {/* Sales Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {salesMetrics.map((metric) => (
          <Card key={metric.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              <TrendingUp className={`h-4 w-4 ${
                metric.trend === 'up' ? 'text-green-600' : 
                metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metric.name.includes('Rate') || metric.name.includes('Length') || metric.name.includes('Conversion') 
                  ? `${metric.value}${metric.period}` 
                  : `$${metric.value.toLocaleString()}`
                }
              </div>
              <p className="text-xs text-muted-foreground">
                Target: {metric.target.toLocaleString()} ({metric.percentage}% of target)
              </p>
              <Progress value={Math.min(metric.percentage, 100)} className="mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pipeline Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Total Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">${totalPipelineValue.toLocaleString()}</div>
            <p className="text-sm text-gray-600 mt-2">Across all stages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Weighted Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">${Math.round(weightedPipelineValue).toLocaleString()}</div>
            <p className="text-sm text-gray-600 mt-2">Probability-weighted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Active Deals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{deals.length}</div>
            <p className="text-sm text-gray-600 mt-2">In pipeline</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pipeline" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pipeline">Pipeline View</TabsTrigger>
          <TabsTrigger value="deals">Deal List</TabsTrigger>
          <TabsTrigger value="forecast">Forecasting</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {Object.entries(stageData).map(([stage, data]) => (
              <Card key={stage} className="min-h-[400px]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium capitalize">{stage.replace('-', ' ')}</CardTitle>
                  <CardDescription>
                    {data.count} deals • ${data.value.toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {deals.filter(deal => deal.stage === stage).map((deal) => (
                    <div key={deal.id} className="p-3 border rounded-lg bg-gray-50">
                      <div className="font-medium text-sm">{deal.name}</div>
                      <div className="text-xs text-gray-600">{deal.company}</div>
                      <div className="text-sm font-bold text-green-600">${deal.value.toLocaleString()}</div>
                      <div className="flex items-center justify-between mt-2">
                        <Badge className={getPriorityColor(deal.priority)}>
                          {deal.priority}
                        </Badge>
                        <span className="text-xs text-gray-500">{deal.probability}%</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="deals" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search deals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={filterStage} onValueChange={setFilterStage}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  <SelectItem value="prospecting">Prospecting</SelectItem>
                  <SelectItem value="qualification">Qualification</SelectItem>
                  <SelectItem value="proposal">Proposal</SelectItem>
                  <SelectItem value="negotiation">Negotiation</SelectItem>
                  <SelectItem value="closed-won">Closed Won</SelectItem>
                  <SelectItem value="closed-lost">Closed Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-gray-600">
              {filteredDeals.length} deals found
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Deal Management</CardTitle>
              <CardDescription>Track and manage your sales opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Deal</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Probability</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Close Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDeals.map((deal) => (
                    <TableRow key={deal.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{deal.name}</div>
                          <div className="text-sm text-gray-500">{deal.contactName}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{deal.company}</div>
                          <div className="text-sm text-gray-500">{deal.industry}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-bold text-green-600">${deal.value.toLocaleString()}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStageColor(deal.stage)}>
                          {deal.stage.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{deal.probability}%</span>
                          <Progress value={deal.probability} className="w-16" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${deal.owner}`} />
                            <AvatarFallback className="text-xs">{deal.owner.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{deal.owner}</span>
                        </div>
                      </TableCell>
                      <TableCell>{deal.expectedCloseDate}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedDeal(deal)}
                            >
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Deal Details - {deal.name}</DialogTitle>
                              <DialogDescription>
                                Comprehensive view of deal information and next steps
                              </DialogDescription>
                            </DialogHeader>
                            {selectedDeal && (
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Company</Label>
                                    <p className="font-medium">{selectedDeal.company}</p>
                                  </div>
                                  <div>
                                    <Label>Industry</Label>
                                    <p className="font-medium">{selectedDeal.industry}</p>
                                  </div>
                                  <div>
                                    <Label>Deal Value</Label>
                                    <p className="font-medium text-green-600">${selectedDeal.value.toLocaleString()}</p>
                                  </div>
                                  <div>
                                    <Label>Probability</Label>
                                    <p className="font-medium">{selectedDeal.probability}%</p>
                                  </div>
                                </div>
                                
                                <div className="space-y-4">
                                  <h4 className="font-semibold">Contact Information</h4>
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <Users className="h-4 w-4" />
                                      <span>{selectedDeal.contactName}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Mail className="h-4 w-4" />
                                      <span>{selectedDeal.contactEmail}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Phone className="h-4 w-4" />
                                      <span>{selectedDeal.contactPhone}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <h4 className="font-semibold">Deal Information</h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Stage</Label>
                                      <Badge className={getStageColor(selectedDeal.stage)}>
                                        {selectedDeal.stage.replace('-', ' ')}
                                      </Badge>
                                    </div>
                                    <div>
                                      <Label>Priority</Label>
                                      <Badge className={getPriorityColor(selectedDeal.priority)}>
                                        {selectedDeal.priority}
                                      </Badge>
                                    </div>
                                    <div>
                                      <Label>Expected Close Date</Label>
                                      <p className="font-medium">{selectedDeal.expectedCloseDate}</p>
                                    </div>
                                    <div>
                                      <Label>Source</Label>
                                      <p className="font-medium">{selectedDeal.source}</p>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <h4 className="font-semibold">Notes</h4>
                                  <p className="text-sm text-gray-600">{selectedDeal.notes}</p>
                                </div>

                                <div className="space-y-4">
                                  <h4 className="font-semibold">Next Action</h4>
                                  <p className="text-sm text-gray-600">{selectedDeal.nextAction}</p>
                                </div>

                                <div className="flex space-x-2">
                                  <Button className="flex-1">
                                    <Mail className="h-4 w-4 mr-2" />
                                    Send Email
                                  </Button>
                                  <Button variant="outline" className="flex-1">
                                    <Phone className="h-4 w-4 mr-2" />
                                    Schedule Call
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecast" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Forecast</CardTitle>
                <CardDescription>Projected revenue by month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>May 2024</span>
                    <span className="font-medium">$125,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>June 2024</span>
                    <span className="font-medium">$85,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>July 2024</span>
                    <span className="font-medium">$200,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>August 2024</span>
                    <span className="font-medium">$300,000</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pipeline Coverage</CardTitle>
                <CardDescription>Pipeline value vs target</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Current Pipeline</span>
                    <span className="font-medium">$755,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Q2 Target</span>
                    <span className="font-medium">$1,000,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Coverage Ratio</span>
                    <span className="font-medium text-green-600">75.5%</span>
                  </div>
                  <Progress value={75.5} className="mt-4" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" />
                        <AvatarFallback className="text-xs">SJ</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">Sarah Johnson</span>
                    </div>
                    <span className="font-medium">$325,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=David" />
                        <AvatarFallback className="text-xs">DR</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">David Rodriguez</span>
                    </div>
                    <span className="font-medium">$285,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Emily" />
                        <AvatarFallback className="text-xs">EC</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">Emily Chen</span>
                    </div>
                    <span className="font-medium">$145,000</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Conversion Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Prospecting → Qualification</span>
                    <span className="font-medium">25%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Qualification → Proposal</span>
                    <span className="font-medium">40%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Proposal → Negotiation</span>
                    <span className="font-medium">60%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Negotiation → Closed Won</span>
                    <span className="font-medium">75%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales Velocity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Average Deal Size</span>
                    <span className="font-medium">$151,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Win Rate</span>
                    <span className="font-medium">68%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Sales Cycle</span>
                    <span className="font-medium">45 days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Velocity</span>
                    <span className="font-medium text-green-600">$2,280/day</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SalesPipeline;
