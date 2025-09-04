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
  Users, 
  TrendingUp, 
  MessageSquare, 
  Calendar, 
  Star, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Target, 
  BarChart3,
  Phone,
  Mail,
  MapPin,
  Building,
  DollarSign,
  Activity,
  Shield,
  Zap
} from "lucide-react";

interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  healthScore: number;
  status: 'active' | 'at-risk' | 'churned' | 'prospect';
  lastActivity: string;
  mrr: number;
  plan: string;
  teamSize: number;
  location: string;
  industry: string;
  successManager: string;
  nextReview: string;
  engagementScore: number;
  featureUsage: number;
  supportTickets: number;
  onboardingProgress: number;
}

interface SuccessMetric {
  name: string;
  value: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  percentage: number;
}

const CustomerSuccess: React.FC = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const customers: Customer[] = [
    {
      id: "CUST-001",
      name: "Sarah Johnson",
      company: "TechFlow Solutions",
      email: "sarah@techflow.com",
      phone: "+1 (555) 123-4567",
      healthScore: 85,
      status: 'active',
      lastActivity: "2024-04-15",
      mrr: 299,
      plan: "Enterprise",
      teamSize: 150,
      location: "San Francisco, CA",
      industry: "SaaS",
      successManager: "Mike Chen",
      nextReview: "2024-05-01",
      engagementScore: 92,
      featureUsage: 78,
      supportTickets: 2,
      onboardingProgress: 100
    },
    {
      id: "CUST-002",
      name: "David Rodriguez",
      company: "Global Retail Corp",
      email: "david@globalretail.com",
      phone: "+1 (555) 234-5678",
      healthScore: 45,
      status: 'at-risk',
      lastActivity: "2024-04-10",
      mrr: 99,
      plan: "Professional",
      teamSize: 45,
      location: "New York, NY",
      industry: "Retail",
      successManager: "Lisa Wang",
      nextReview: "2024-04-25",
      engagementScore: 35,
      featureUsage: 25,
      supportTickets: 8,
      onboardingProgress: 60
    },
    {
      id: "CUST-003",
      name: "Emily Chen",
      company: "Innovate Labs",
      email: "emily@innovatelabs.com",
      phone: "+1 (555) 345-6789",
      healthScore: 95,
      status: 'active',
      lastActivity: "2024-04-16",
      mrr: 599,
      plan: "Enterprise",
      teamSize: 300,
      location: "Austin, TX",
      industry: "Technology",
      successManager: "Mike Chen",
      nextReview: "2024-05-15",
      engagementScore: 98,
      featureUsage: 95,
      supportTickets: 1,
      onboardingProgress: 100
    },
    {
      id: "CUST-004",
      name: "Robert Kim",
      company: "StartupXYZ",
      email: "robert@startupxyz.com",
      phone: "+1 (555) 456-7890",
      healthScore: 20,
      status: 'churned',
      lastActivity: "2024-03-20",
      mrr: 0,
      plan: "Starter",
      teamSize: 12,
      location: "Seattle, WA",
      industry: "Startup",
      successManager: "Lisa Wang",
      nextReview: "N/A",
      engagementScore: 15,
      featureUsage: 10,
      supportTickets: 15,
      onboardingProgress: 30
    }
  ];

  const successMetrics: SuccessMetric[] = [
    {
      name: "Customer Health Score",
      value: 78,
      target: 85,
      trend: 'up',
      percentage: 92
    },
    {
      name: "Net Revenue Retention",
      value: 112,
      target: 110,
      trend: 'up',
      percentage: 102
    },
    {
      name: "Customer Satisfaction",
      value: 4.8,
      target: 4.5,
      trend: 'up',
      percentage: 107
    },
    {
      name: "Time to Value",
      value: 14,
      target: 21,
      trend: 'up',
      percentage: 67
    },
    {
      name: "Feature Adoption",
      value: 72,
      target: 75,
      trend: 'stable',
      percentage: 96
    },
    {
      name: "Support Response Time",
      value: 2.3,
      target: 4,
      trend: 'up',
      percentage: 58
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'at-risk': return 'bg-yellow-100 text-yellow-800';
      case 'churned': return 'bg-red-100 text-red-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredCustomers = filterStatus === 'all' 
    ? customers 
    : customers.filter(customer => customer.status === filterStatus);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customer Success</h1>
          <p className="text-gray-600 mt-2">Monitor customer health and drive success outcomes</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Review
          </Button>
          <Button size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Contact Customer
          </Button>
        </div>
      </div>

      {/* Success Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {successMetrics.map((metric) => (
          <Card key={metric.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              <TrendingUp className={`h-4 w-4 ${
                metric.trend === 'up' ? 'text-green-600' : 
                metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                Target: {metric.target} ({metric.percentage}% of target)
              </p>
              <Progress value={Math.min(metric.percentage, 100)} className="mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="customers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="customers">Customer Health</TabsTrigger>
          <TabsTrigger value="reviews">Success Reviews</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Label>Filter by Status:</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="at-risk">At Risk</SelectItem>
                  <SelectItem value="churned">Churned</SelectItem>
                  <SelectItem value="prospect">Prospects</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-gray-600">
              {filteredCustomers.length} customers found
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Customer Health Overview</CardTitle>
              <CardDescription>Monitor customer health scores and engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Health Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>MRR</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>Success Manager</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${customer.name}`} />
                            <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-gray-500">{customer.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{customer.company}</div>
                          <div className="text-sm text-gray-500">{customer.industry}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className={`font-bold ${getHealthScoreColor(customer.healthScore)}`}>
                            {customer.healthScore}%
                          </span>
                          <Progress value={customer.healthScore} className="w-16" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(customer.status)}>
                          {customer.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">${customer.mrr}</div>
                        <div className="text-sm text-gray-500">{customer.plan}</div>
                      </TableCell>
                      <TableCell>{customer.lastActivity}</TableCell>
                      <TableCell>{customer.successManager}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedCustomer(customer)}
                            >
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Customer Details - {customer.name}</DialogTitle>
                              <DialogDescription>
                                Comprehensive view of customer health and engagement
                              </DialogDescription>
                            </DialogHeader>
                            {selectedCustomer && (
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Company</Label>
                                    <p className="font-medium">{selectedCustomer.company}</p>
                                  </div>
                                  <div>
                                    <Label>Industry</Label>
                                    <p className="font-medium">{selectedCustomer.industry}</p>
                                  </div>
                                  <div>
                                    <Label>Team Size</Label>
                                    <p className="font-medium">{selectedCustomer.teamSize} employees</p>
                                  </div>
                                  <div>
                                    <Label>Location</Label>
                                    <p className="font-medium">{selectedCustomer.location}</p>
                                  </div>
                                </div>
                                
                                <div className="space-y-4">
                                  <h4 className="font-semibold">Health Metrics</h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label>Health Score</Label>
                                      <div className="flex items-center space-x-2">
                                        <span className={`font-bold text-lg ${getHealthScoreColor(selectedCustomer.healthScore)}`}>
                                          {selectedCustomer.healthScore}%
                                        </span>
                                        <Progress value={selectedCustomer.healthScore} className="flex-1" />
                                      </div>
                                    </div>
                                    <div>
                                      <Label>Engagement Score</Label>
                                      <div className="flex items-center space-x-2">
                                        <span className="font-bold text-lg">{selectedCustomer.engagementScore}%</span>
                                        <Progress value={selectedCustomer.engagementScore} className="flex-1" />
                                      </div>
                                    </div>
                                    <div>
                                      <Label>Feature Usage</Label>
                                      <div className="flex items-center space-x-2">
                                        <span className="font-bold text-lg">{selectedCustomer.featureUsage}%</span>
                                        <Progress value={selectedCustomer.featureUsage} className="flex-1" />
                                      </div>
                                    </div>
                                    <div>
                                      <Label>Onboarding Progress</Label>
                                      <div className="flex items-center space-x-2">
                                        <span className="font-bold text-lg">{selectedCustomer.onboardingProgress}%</span>
                                        <Progress value={selectedCustomer.onboardingProgress} className="flex-1" />
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-4">
                                  <h4 className="font-semibold">Contact Information</h4>
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <Mail className="h-4 w-4" />
                                      <span>{selectedCustomer.email}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Phone className="h-4 w-4" />
                                      <span>{selectedCustomer.phone}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex space-x-2">
                                  <Button className="flex-1">
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Send Message
                                  </Button>
                                  <Button variant="outline" className="flex-1">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Schedule Review
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

        <TabsContent value="reviews" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Success Reviews</CardTitle>
              <CardDescription>Track scheduled and completed customer success reviews</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customers.filter(c => c.status !== 'churned').map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${customer.name}`} />
                        <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.company}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Next Review</div>
                      <div className="font-medium">{customer.nextReview}</div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule
                      </Button>
                      <Button size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Engagement Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">78%</div>
                <p className="text-sm text-gray-600 mt-2">Average across all customers</p>
                <Progress value={78} className="mt-4" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Feature Adoption
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">72%</div>
                <p className="text-sm text-gray-600 mt-2">Average feature usage</p>
                <Progress value={72} className="mt-4" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Customer Satisfaction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">4.8/5</div>
                <p className="text-sm text-gray-600 mt-2">Average rating</p>
                <div className="flex items-center mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`h-4 w-4 ${star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Engagement Trends</CardTitle>
              <CardDescription>Track customer engagement over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-500">
                Chart showing engagement trends over time
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Health Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Healthy (80%+)</span>
                    <span className="font-medium text-green-600">65%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>At Risk (60-79%)</span>
                    <span className="font-medium text-yellow-600">25%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Critical (<60%)</span>
                    <span className="font-medium text-red-600">10%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Customer Segment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Enterprise</span>
                    <span className="font-medium">$45,200</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Professional</span>
                    <span className="font-medium">$23,800</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Starter</span>
                    <span className="font-medium">$8,400</span>
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

export default CustomerSuccess;
