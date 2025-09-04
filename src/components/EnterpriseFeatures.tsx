import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Shield, 
  Lock, 
  Users, 
  Settings, 
  BarChart3, 
  Globe,
  Database,
  Zap,
  CheckCircle,
  AlertTriangle,
  Clock,
  Activity,
  Building,
  Key,
  Eye,
  FileText,
  ShieldCheck,
  Network,
  Server,
  Cloud,
  Cpu,
  HardDrive,
  Wifi,
  Monitor,
  Smartphone,
  Tablet
} from "lucide-react";

interface ComplianceFeature {
  name: string;
  status: 'enabled' | 'disabled' | 'pending';
  description: string;
  category: string;
  lastAudit: string;
  nextAudit: string;
  complianceLevel: 'basic' | 'intermediate' | 'advanced';
}

interface SecurityMetric {
  name: string;
  value: number;
  target: number;
  status: 'good' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

interface Integration {
  name: string;
  status: 'active' | 'inactive' | 'error';
  type: 'api' | 'webhook' | 'sso' | 'database';
  lastSync: string;
  syncFrequency: string;
  errorCount: number;
  successRate: number;
}

const EnterpriseFeatures: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<ComplianceFeature | null>(null);
  const [filterCategory, setFilterCategory] = useState('all');

  const complianceFeatures: ComplianceFeature[] = [
    {
      name: "SOC 2 Type II Compliance",
      status: 'enabled',
      description: "Service Organization Control 2 Type II certification for security, availability, and confidentiality",
      category: "Security",
      lastAudit: "2024-01-15",
      nextAudit: "2024-07-15",
      complianceLevel: 'advanced'
    },
    {
      name: "GDPR Compliance",
      status: 'enabled',
      description: "General Data Protection Regulation compliance for EU data protection",
      category: "Privacy",
      lastAudit: "2024-02-01",
      nextAudit: "2024-08-01",
      complianceLevel: 'advanced'
    },
    {
      name: "HIPAA Compliance",
      status: 'enabled',
      description: "Health Insurance Portability and Accountability Act compliance for healthcare data",
      category: "Healthcare",
      lastAudit: "2024-03-01",
      nextAudit: "2024-09-01",
      complianceLevel: 'advanced'
    },
    {
      name: "ISO 27001",
      status: 'pending',
      description: "Information Security Management System certification",
      category: "Security",
      lastAudit: "N/A",
      nextAudit: "2024-06-01",
      complianceLevel: 'intermediate'
    },
    {
      name: "PCI DSS",
      status: 'enabled',
      description: "Payment Card Industry Data Security Standard compliance",
      category: "Payment",
      lastAudit: "2024-01-30",
      nextAudit: "2024-07-30",
      complianceLevel: 'advanced'
    },
    {
      name: "FedRAMP",
      status: 'disabled',
      description: "Federal Risk and Authorization Management Program for government contracts",
      category: "Government",
      lastAudit: "N/A",
      nextAudit: "TBD",
      complianceLevel: 'basic'
    }
  ];

  const securityMetrics: SecurityMetric[] = [
    {
      name: "Security Score",
      value: 92,
      target: 90,
      status: 'good',
      trend: 'up'
    },
    {
      name: "Vulnerability Scan",
      value: 98,
      target: 95,
      status: 'good',
      trend: 'stable'
    },
    {
      name: "Penetration Test",
      value: 85,
      target: 90,
      status: 'warning',
      trend: 'up'
    },
    {
      name: "Access Control",
      value: 95,
      target: 90,
      status: 'good',
      trend: 'stable'
    },
    {
      name: "Data Encryption",
      value: 100,
      target: 100,
      status: 'good',
      trend: 'stable'
    },
    {
      name: "Backup Recovery",
      value: 88,
      target: 95,
      status: 'warning',
      trend: 'down'
    }
  ];

  const integrations: Integration[] = [
    {
      name: "Active Directory",
      status: 'active',
      type: 'sso',
      lastSync: "2024-04-16 14:30",
      syncFrequency: "Real-time",
      errorCount: 0,
      successRate: 100
    },
    {
      name: "Salesforce CRM",
      status: 'active',
      type: 'api',
      lastSync: "2024-04-16 13:45",
      syncFrequency: "Every 15 minutes",
      errorCount: 2,
      successRate: 98.5
    },
    {
      name: "Slack Notifications",
      status: 'active',
      type: 'webhook',
      lastSync: "2024-04-16 14:15",
      syncFrequency: "Real-time",
      errorCount: 0,
      successRate: 100
    },
    {
      name: "MySQL Database",
      status: 'active',
      type: 'database',
      lastSync: "2024-04-16 14:00",
      syncFrequency: "Every 5 minutes",
      errorCount: 1,
      successRate: 99.8
    },
    {
      name: "AWS S3 Storage",
      status: 'error',
      type: 'api',
      lastSync: "2024-04-16 12:30",
      syncFrequency: "Every hour",
      errorCount: 15,
      successRate: 85.2
    },
    {
      name: "Google Workspace",
      status: 'inactive',
      type: 'sso',
      lastSync: "2024-04-15 18:00",
      syncFrequency: "Daily",
      errorCount: 0,
      successRate: 100
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enabled': return 'bg-green-100 text-green-800';
      case 'disabled': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSecurityStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getComplianceLevelColor = (level: string) => {
    switch (level) {
      case 'advanced': return 'bg-purple-100 text-purple-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'basic': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredFeatures = filterCategory === 'all' 
    ? complianceFeatures 
    : complianceFeatures.filter(feature => feature.category === filterCategory);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enterprise Features</h1>
          <p className="text-gray-600 mt-2">Advanced security, compliance, and enterprise-grade capabilities</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {securityMetrics.map((metric) => (
          <Card key={metric.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              <div className={`p-2 rounded-full ${
                metric.status === 'good' ? 'bg-green-100' : 
                metric.status === 'warning' ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                <Shield className={`h-4 w-4 ${
                  metric.status === 'good' ? 'text-green-600' : 
                  metric.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                }`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getSecurityStatusColor(metric.status)}`}>
                {metric.value}%
              </div>
              <p className="text-xs text-muted-foreground">
                Target: {metric.target}%
              </p>
              <Progress value={metric.value} className="mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="compliance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
        </TabsList>

        <TabsContent value="compliance" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Label>Filter by Category:</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="Privacy">Privacy</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Payment">Payment</SelectItem>
                  <SelectItem value="Government">Government</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-gray-600">
              {filteredFeatures.length} compliance features
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Compliance Management</CardTitle>
              <CardDescription>Monitor and manage compliance certifications and audits</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Compliance Standard</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Last Audit</TableHead>
                    <TableHead>Next Audit</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFeatures.map((feature) => (
                    <TableRow key={feature.name}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{feature.name}</div>
                          <div className="text-sm text-gray-500">{feature.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{feature.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(feature.status)}>
                          {feature.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getComplianceLevelColor(feature.complianceLevel)}>
                          {feature.complianceLevel}
                        </Badge>
                      </TableCell>
                      <TableCell>{feature.lastAudit}</TableCell>
                      <TableCell>{feature.nextAudit}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedFeature(feature)}
                            >
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Compliance Details - {feature.name}</DialogTitle>
                              <DialogDescription>
                                Comprehensive view of compliance status and requirements
                              </DialogDescription>
                            </DialogHeader>
                            {selectedFeature && (
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Status</Label>
                                    <Badge className={getStatusColor(selectedFeature.status)}>
                                      {selectedFeature.status}
                                    </Badge>
                                  </div>
                                  <div>
                                    <Label>Category</Label>
                                    <p className="font-medium">{selectedFeature.category}</p>
                                  </div>
                                  <div>
                                    <Label>Compliance Level</Label>
                                    <Badge className={getComplianceLevelColor(selectedFeature.complianceLevel)}>
                                      {selectedFeature.complianceLevel}
                                    </Badge>
                                  </div>
                                  <div>
                                    <Label>Last Audit</Label>
                                    <p className="font-medium">{selectedFeature.lastAudit}</p>
                                  </div>
                                </div>
                                
                                <div className="space-y-4">
                                  <h4 className="font-semibold">Description</h4>
                                  <p className="text-sm text-gray-600">{selectedFeature.description}</p>
                                </div>

                                <div className="space-y-4">
                                  <h4 className="font-semibold">Requirements</h4>
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                      <span className="text-sm">Data encryption at rest and in transit</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                      <span className="text-sm">Access controls and authentication</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                      <span className="text-sm">Audit logging and monitoring</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                      <span className="text-sm">Incident response procedures</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex space-x-2">
                                  <Button className="flex-1">
                                    <FileText className="h-4 w-4 mr-2" />
                                    Generate Report
                                  </Button>
                                  <Button variant="outline" className="flex-1">
                                    <Settings className="h-4 w-4 mr-2" />
                                    Configure
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

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Security Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Overall Security Score</span>
                    <span className="font-bold text-green-600">92/100</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Vulnerabilities</span>
                    <span className="font-medium">2 (Low Risk)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Security Incidents</span>
                    <span className="font-medium text-green-600">0 (Last 30 days)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Data Breaches</span>
                    <span className="font-medium text-green-600">0 (Last 12 months)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Lock className="h-4 w-4 text-green-600" />
                      <span>Two-Factor Authentication</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Eye className="h-4 w-4 text-green-600" />
                      <span>Audit Logging</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Key className="h-4 w-4 text-green-600" />
                      <span>SSO Integration</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="h-4 w-4 text-green-600" />
                      <span>Data Encryption</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Network className="h-4 w-4 text-green-600" />
                      <span>Network Security</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Security Monitoring</CardTitle>
              <CardDescription>Real-time security monitoring and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-500">
                Security monitoring dashboard with real-time alerts and threat detection
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Integrations</CardTitle>
              <CardDescription>Monitor and manage third-party integrations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Integration</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Sync</TableHead>
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {integrations.map((integration) => (
                    <TableRow key={integration.name}>
                      <TableCell className="font-medium">{integration.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="uppercase">
                          {integration.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(integration.status)}>
                          {integration.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{integration.lastSync}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{integration.successRate}%</span>
                          <Progress value={integration.successRate} className="w-16" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="infrastructure" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Server className="h-5 w-5 mr-2" />
                  Server Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">99.9%</div>
                <p className="text-sm text-gray-600 mt-2">Uptime (Last 30 days)</p>
                <Progress value={99.9} className="mt-4" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Database
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">2.3TB</div>
                <p className="text-sm text-gray-600 mt-2">Storage Used</p>
                <Progress value={78} className="mt-4" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Cpu className="h-5 w-5 mr-2" />
                  CPU Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">67%</div>
                <p className="text-sm text-gray-600 mt-2">Average Load</p>
                <Progress value={67} className="mt-4" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wifi className="h-5 w-5 mr-2" />
                  Network
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">1.2GB/s</div>
                <p className="text-sm text-gray-600 mt-2">Bandwidth Used</p>
                <Progress value={45} className="mt-4" />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Deployment Regions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4" />
                      <span>North America (US East)</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4" />
                      <span>Europe (EU West)</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4" />
                      <span>Asia Pacific (AP Southeast)</span>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Backup & Recovery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Last Backup</span>
                    <span className="font-medium">2024-04-16 02:00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Backup Size</span>
                    <span className="font-medium">2.1TB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Recovery Time Objective</span>
                    <span className="font-medium">4 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Recovery Point Objective</span>
                    <span className="font-medium">1 hour</span>
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

export default EnterpriseFeatures;
