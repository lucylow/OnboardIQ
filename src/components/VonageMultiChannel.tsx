import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  MessageSquare, 
  Phone, 
  Video, 
  Send, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw,
  Users,
  Clock,
  DollarSign,
  BarChart3,
  Settings,
  Zap,
  Mail,
  Smartphone,
  Monitor,
  Headphones,
  MessageCircle
} from 'lucide-react';
import { 
  vonageApiService, 
  VonageSMSRequest,
  VonageVoiceRequest,
  VonageVideoSessionRequest,
  VonageVideoTokenRequest,
  VonageWhatsAppRequest,
  VonageMultiChannelRequest
} from '@/services/vonageApiService';

interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  category: 'welcome' | 'support' | 'reminder' | 'promotion';
  channels: string[];
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferredChannel: string;
  lastContact: string;
  status: 'active' | 'inactive' | 'pending';
}

const VonageMultiChannel: React.FC = () => {
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['sms']);
  const [recipient, setRecipient] = useState({ phone: '', email: '' });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('compose');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [videoSession, setVideoSession] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  const messageTemplates: MessageTemplate[] = [
    {
      id: 'welcome',
      name: 'Welcome Message',
      content: 'Welcome to OnboardIQ! We\'re excited to have you on board. Your account is now active and ready to use.',
      category: 'welcome',
      channels: ['sms', 'email', 'whatsapp']
    },
    {
      id: 'support',
      name: 'Support Response',
      content: 'Thank you for contacting OnboardIQ support. We\'ve received your request and will get back to you within 24 hours.',
      category: 'support',
      channels: ['sms', 'email', 'whatsapp']
    },
    {
      id: 'reminder',
      name: 'Account Reminder',
      content: 'Don\'t forget to complete your profile setup to unlock all OnboardIQ features. Visit your dashboard to get started.',
      category: 'reminder',
      channels: ['sms', 'email']
    },
    {
      id: 'promotion',
      name: 'Special Offer',
      content: 'Exclusive offer for OnboardIQ users! Get 20% off your next subscription upgrade. Use code WELCOME20.',
      category: 'promotion',
      channels: ['sms', 'email', 'whatsapp']
    }
  ];

  const customers: Customer[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1234567890',
      preferredChannel: 'sms',
      lastContact: '2024-01-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone: '+1987654321',
      preferredChannel: 'whatsapp',
      lastContact: '2024-01-14',
      status: 'active'
    },
    {
      id: '3',
      name: 'Mike Wilson',
      email: 'mike.wilson@example.com',
      phone: '+1555123456',
      preferredChannel: 'email',
      lastContact: '2024-01-13',
      status: 'pending'
    }
  ];

  const channels = [
    { id: 'sms', name: 'SMS', icon: <MessageSquare className="h-4 w-4" />, color: 'text-blue-600' },
    { id: 'whatsapp', name: 'WhatsApp', icon: <MessageCircle className="h-4 w-4" />, color: 'text-green-600' },
    { id: 'voice', name: 'Voice Call', icon: <Phone className="h-4 w-4" />, color: 'text-purple-600' },
    { id: 'video', name: 'Video Call', icon: <Video className="h-4 w-4" />, color: 'text-red-600' },
    { id: 'email', name: 'Email', icon: <Mail className="h-4 w-4" />, color: 'text-gray-600' }
  ];

  // Load analytics on component mount
  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await vonageApiService.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  // Handle channel selection
  const toggleChannel = (channelId: string) => {
    setSelectedChannels(prev => 
      prev.includes(channelId) 
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId]
    );
  };

  // Send multi-channel message
  const sendMultiChannelMessage = async () => {
    if (!recipient.phone && !recipient.email) {
      setError('Please provide either a phone number or email address');
      return;
    }

    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    if (selectedChannels.length === 0) {
      setError('Please select at least one channel');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      const request: VonageMultiChannelRequest = {
        recipient,
        channels: selectedChannels,
        message,
        options: {
          from: 'OnboardIQ',
          priority: 'normal',
          retryAttempts: 3
        }
      };

      const result = await vonageApiService.sendMultiChannelMessage(request);
      setResults(result);
      
      if (result.success) {
        setSuccess(`Message sent successfully! ${result.successful} channels delivered.`);
      } else {
        setError(`Failed to send message. ${result.failed} channels failed.`);
      }
    } catch (error) {
      setError(`Failed to send message: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Send individual channel message
  const sendChannelMessage = async (channel: string) => {
    try {
      setIsLoading(true);
      setError('');

      let result;
      const baseRequest = {
        to: channel === 'email' ? recipient.email : recipient.phone,
        from: 'OnboardIQ',
        text: message
      };

      switch (channel) {
        case 'sms':
          result = await vonageApiService.sendSMS(baseRequest as VonageSMSRequest);
          break;
        case 'whatsapp':
          result = await vonageApiService.sendWhatsApp(baseRequest as VonageWhatsAppRequest);
          break;
        case 'voice':
          result = await vonageApiService.makeVoiceCall(baseRequest as VonageVoiceRequest);
          break;
        case 'email':
          // Email would be handled by a separate email service
          result = { success: true, messageId: `email_${Date.now()}` };
          break;
        default:
          throw new Error(`Unsupported channel: ${channel}`);
      }

      setSuccess(`${channel.toUpperCase()} message sent successfully!`);
      return result;
    } catch (error) {
      setError(`Failed to send ${channel} message: ${(error as Error).message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Create video session
  const createVideoSession = async () => {
    try {
      setIsLoading(true);
      setError('');

      const request: VonageVideoSessionRequest = {
        mediaMode: 'routed',
        archiveMode: 'manual',
        location: 'auto',
        options: {
          p2p: false,
          recording: true
        }
      };

      const session = await vonageApiService.createVideoSession(request);
      setVideoSession(session);

      // Generate token for the session
      const tokenRequest: VonageVideoTokenRequest = {
        sessionId: session.sessionId,
        role: 'publisher',
        data: 'customer-support',
        expireTime: Math.floor(Date.now() / 1000) + 3600 // 1 hour
      };

      const token = await vonageApiService.generateVideoToken(tokenRequest);
      
      setSuccess(`Video session created! Session ID: ${session.sessionId}`);
      return { session, token };
    } catch (error) {
      setError(`Failed to create video session: ${(error as Error).message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Apply template
  const applyTemplate = (templateId: string) => {
    const template = messageTemplates.find(t => t.id === templateId);
    if (template) {
      setMessage(template.content);
      setSelectedChannels(template.channels);
      setSelectedTemplate(templateId);
    }
  };

  // Send to selected customers
  const sendToSelectedCustomers = async () => {
    if (selectedCustomers.length === 0) {
      setError('Please select at least one customer');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      const results = [];
      for (const customerId of selectedCustomers) {
        const customer = customers.find(c => c.id === customerId);
        if (customer) {
          try {
            const request: VonageMultiChannelRequest = {
              recipient: {
                phone: customer.phone,
                email: customer.email
              },
              channels: [customer.preferredChannel],
              message,
              options: {
                from: 'OnboardIQ',
                priority: 'normal'
              }
            };

            const result = await vonageApiService.sendMultiChannelMessage(request);
            results.push({ customer, result });
          } catch (error) {
            results.push({ customer, error: (error as Error).message });
          }
        }
      }

      const successful = results.filter(r => !r.error).length;
      const failed = results.filter(r => r.error).length;

      if (failed === 0) {
        setSuccess(`Messages sent successfully to ${successful} customers!`);
      } else {
        setError(`Sent to ${successful} customers, ${failed} failed.`);
      }

      setResults({ results, successful, failed });
    } catch (error) {
      setError(`Failed to send messages: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Multi-Channel Communication</h1>
        <p className="text-gray-600">
          Connect with customers across multiple channels for seamless support
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Message Composition */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Compose Message
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Recipient Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={recipient.phone}
                        onChange={(e) => setRecipient(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="customer@example.com"
                        value={recipient.email}
                        onChange={(e) => setRecipient(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Enter your message here..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                    />
                  </div>

                  {/* Channel Selection */}
                  <div className="space-y-2">
                    <Label>Select Channels</Label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {channels.map((channel) => (
                        <div
                          key={channel.id}
                          className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedChannels.includes(channel.id)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => toggleChannel(channel.id)}
                        >
                          <Checkbox
                            checked={selectedChannels.includes(channel.id)}
                            onChange={() => toggleChannel(channel.id)}
                          />
                          <div className={`${channel.color}`}>
                            {channel.icon}
                          </div>
                          <span className="text-sm font-medium">{channel.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={sendMultiChannelMessage}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? (
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Send className="h-4 w-4 mr-2" />
                      )}
                      Send Multi-Channel
                    </Button>
                    <Button
                      onClick={createVideoSession}
                      disabled={isLoading}
                      variant="outline"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Create Video Session
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Results */}
              {results && (
                <Card>
                  <CardHeader>
                    <CardTitle>Message Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Total Channels:</span>
                        <Badge variant="outline">{results.channels.length}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Successful:</span>
                        <Badge variant="default">{results.successful}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Failed:</span>
                        <Badge variant="destructive">{results.failed}</Badge>
                      </div>
                      {Object.entries(results.results).map(([channel, result]: [string, any]) => (
                        <div key={channel} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="capitalize">{channel}:</span>
                          <Badge variant={result.success ? "default" : "destructive"}>
                            {result.success ? 'Sent' : 'Failed'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => sendChannelMessage('sms')}
                    disabled={!recipient.phone || isLoading}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send SMS
                  </Button>
                  <Button
                    onClick={() => sendChannelMessage('whatsapp')}
                    disabled={!recipient.phone || isLoading}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Send WhatsApp
                  </Button>
                  <Button
                    onClick={() => sendChannelMessage('voice')}
                    disabled={!recipient.phone || isLoading}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Make Voice Call
                  </Button>
                  <Button
                    onClick={() => sendChannelMessage('email')}
                    disabled={!recipient.email || isLoading}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                </CardContent>
              </Card>

              {/* Video Session */}
              {videoSession && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="h-5 w-5" />
                      Video Session
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span>Session ID:</span>
                        <span className="font-mono text-xs">{videoSession.sessionId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <Badge variant="default">Active</Badge>
                      </div>
                    </div>
                    <Button className="w-full" variant="outline">
                      Join Session
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Customer Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customers.map((customer) => (
                  <div
                    key={customer.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedCustomers.includes(customer.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedCustomers(prev => [...prev, customer.id]);
                          } else {
                            setSelectedCustomers(prev => prev.filter(id => id !== customer.id));
                          }
                        }}
                      />
                      <div>
                        <h3 className="font-semibold">{customer.name}</h3>
                        <p className="text-sm text-gray-600">{customer.email}</p>
                        <p className="text-sm text-gray-600">{customer.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{customer.preferredChannel}</Badge>
                      <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                        {customer.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedCustomers.length > 0 && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span>{selectedCustomers.length} customer(s) selected</span>
                    <Button onClick={sendToSelectedCustomers} disabled={isLoading}>
                      Send Message
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {messageTemplates.map((template) => (
              <Card key={template.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    {template.name}
                  </CardTitle>
                  <CardDescription>
                    Category: {template.category}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{template.content}</p>
                  <div className="flex flex-wrap gap-1">
                    {template.channels.map((channel) => (
                      <Badge key={channel} variant="outline" className="text-xs">
                        {channel}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    onClick={() => applyTemplate(template.id)}
                    variant="outline"
                    className="w-full"
                  >
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {analytics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalMessages}</div>
                  <p className="text-xs text-muted-foreground">
                    +{analytics.successfulMessages} successful
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalCalls}</div>
                  <p className="text-xs text-muted-foreground">
                    +{analytics.successfulCalls} successful
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Verifications</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.totalVerifications}</div>
                  <p className="text-xs text-muted-foreground">
                    +{analytics.successfulVerifications} successful
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Response Time</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics.averageResponseTime}</div>
                  <p className="text-xs text-muted-foreground">
                    Average response time
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Status Messages */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default VonageMultiChannel;
