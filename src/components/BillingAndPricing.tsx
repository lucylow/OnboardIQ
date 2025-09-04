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
import { Check, CreditCard, DollarSign, Download, FileText, Users, Zap, Shield, Globe, BarChart3, Settings, AlertCircle } from "lucide-react";

interface PricingTier {
  name: string;
  price: number;
  period: string;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
}

interface BillingItem {
  id: string;
  description: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
  category: string;
}

const BillingAndPricing: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [billingCycle, setBillingCycle] = useState('monthly');

  const pricingTiers: PricingTier[] = [
    {
      name: "Starter",
      price: 29,
      period: "month",
      icon: <Users className="h-6 w-6" />,
      features: [
        "Up to 100 users",
        "Basic onboarding flows",
        "Email support",
        "Standard integrations",
        "5GB storage"
      ]
    },
    {
      name: "Professional",
      price: 99,
      period: "month",
      popular: true,
      icon: <Zap className="h-6 w-6" />,
      features: [
        "Up to 1,000 users",
        "Advanced onboarding flows",
        "Priority support",
        "Custom integrations",
        "25GB storage",
        "Analytics dashboard",
        "API access"
      ]
    },
    {
      name: "Enterprise",
      price: 299,
      period: "month",
      icon: <Shield className="h-6 w-6" />,
      features: [
        "Unlimited users",
        "Custom onboarding flows",
        "24/7 support",
        "White-label solution",
        "Unlimited storage",
        "Advanced analytics",
        "Custom API",
        "SLA guarantee",
        "Dedicated account manager"
      ]
    }
  ];

  const billingHistory: BillingItem[] = [
    {
      id: "INV-001",
      description: "Professional Plan - March 2024",
      amount: 99.00,
      date: "2024-03-01",
      status: "paid",
      category: "Subscription"
    },
    {
      id: "INV-002",
      description: "Additional User Licenses",
      amount: 150.00,
      date: "2024-03-15",
      status: "paid",
      category: "Add-on"
    },
    {
      id: "INV-003",
      description: "Professional Plan - April 2024",
      amount: 99.00,
      date: "2024-04-01",
      status: "pending",
      category: "Subscription"
    },
    {
      id: "INV-004",
      description: "Custom Integration Setup",
      amount: 500.00,
      date: "2024-04-10",
      status: "pending",
      category: "Services"
    }
  ];

  const usageMetrics = {
    users: { current: 847, limit: 1000, percentage: 84.7 },
    storage: { current: 18.5, limit: 25, percentage: 74 },
    apiCalls: { current: 125000, limit: 100000, percentage: 125 },
    integrations: { current: 12, limit: 15, percentage: 80 }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing & Pricing</h1>
          <p className="text-gray-600 mt-2">Manage your subscription, billing, and usage</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Invoice
          </Button>
          <Button size="sm">
            <CreditCard className="h-4 w-4 mr-2" />
            Update Payment
          </Button>
        </div>
      </div>

      <Tabs defaultValue="pricing" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pricing">Pricing Plans</TabsTrigger>
          <TabsTrigger value="billing">Billing History</TabsTrigger>
          <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
          <TabsTrigger value="settings">Billing Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="pricing" className="space-y-6">
          <div className="flex items-center justify-center space-x-4 mb-8">
            <Label htmlFor="billing-cycle">Billing Cycle:</Label>
            <Select value={billingCycle} onValueChange={setBillingCycle}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly (Save 20%)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingTiers.map((tier) => (
              <Card key={tier.name} className={`relative ${tier.popular ? 'ring-2 ring-blue-500' : ''}`}>
                {tier.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                      {tier.icon}
                    </div>
                  </div>
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <CardDescription>
                    <span className="text-3xl font-bold text-gray-900">
                      ${billingCycle === 'yearly' ? tier.price * 12 * 0.8 : tier.price}
                    </span>
                    /{billingCycle === 'yearly' ? 'year' : tier.period}
                    {billingCycle === 'yearly' && (
                      <span className="text-sm text-green-600 ml-2">Save 20%</span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={tier.popular ? "default" : "outline"}
                    onClick={() => setSelectedPlan(tier.name.toLowerCase())}
                  >
                    {selectedPlan === tier.name.toLowerCase() ? 'Current Plan' : 'Choose Plan'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Billing History
              </CardTitle>
              <CardDescription>View and manage your invoices and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billingHistory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>${item.amount.toFixed(2)}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            item.status === 'paid' ? 'default' : 
                            item.status === 'pending' ? 'secondary' : 'destructive'
                          }
                        >
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{usageMetrics.users.current.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  of {usageMetrics.users.limit.toLocaleString()} limit
                </p>
                <Progress value={usageMetrics.users.percentage} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{usageMetrics.storage.current} GB</div>
                <p className="text-xs text-muted-foreground">
                  of {usageMetrics.storage.limit} GB limit
                </p>
                <Progress value={usageMetrics.storage.percentage} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">API Calls</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{usageMetrics.apiCalls.current.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  of {usageMetrics.apiCalls.limit.toLocaleString()} limit
                </p>
                <Progress 
                  value={Math.min(usageMetrics.apiCalls.percentage, 100)} 
                  className="mt-2"
                />
                {usageMetrics.apiCalls.percentage > 100 && (
                  <p className="text-xs text-red-600 mt-1">Over limit</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Integrations</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{usageMetrics.integrations.current}</div>
                <p className="text-xs text-muted-foreground">
                  of {usageMetrics.integrations.limit} limit
                </p>
                <Progress value={usageMetrics.integrations.percentage} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Usage Alerts</CardTitle>
              <CardDescription>Configure alerts for usage thresholds</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Users (80% threshold)</Label>
                  <p className="text-sm text-gray-600">Get notified when you reach 80% of your user limit</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Storage (90% threshold)</Label>
                  <p className="text-sm text-gray-600">Get notified when you reach 90% of your storage limit</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>API Calls (95% threshold)</Label>
                  <p className="text-sm text-gray-600">Get notified when you reach 95% of your API call limit</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Manage your payment information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4 p-4 border rounded-lg">
                  <CreditCard className="h-6 w-6" />
                  <div>
                    <p className="font-medium">•••• •••• •••• 4242</p>
                    <p className="text-sm text-gray-600">Expires 12/25</p>
                  </div>
                  <Button variant="outline" size="sm" className="ml-auto">
                    Update
                  </Button>
                </div>
                <Button variant="outline" className="w-full">
                  Add Payment Method
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billing Address</CardTitle>
                <CardDescription>Update your billing information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input id="company" defaultValue="Acme Corporation" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" defaultValue="123 Business St, Suite 100" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" defaultValue="San Francisco" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input id="zip" defaultValue="94105" />
                  </div>
                </div>
                <Button className="w-full">Update Address</Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Billing Preferences</CardTitle>
              <CardDescription>Configure your billing settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Invoices</Label>
                  <p className="text-sm text-gray-600">Receive invoices via email</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-renewal</Label>
                  <p className="text-sm text-gray-600">Automatically renew your subscription</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Usage Alerts</Label>
                  <p className="text-sm text-gray-600">Get notified about usage thresholds</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BillingAndPricing;
