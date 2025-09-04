import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Database, 
  Zap, 
  Save, 
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Key,
  Globe,
  Smartphone,
  Mail,
  Lock,
  Unlock,
  Monitor,
  Palette,
  Languages,
  Clock,
  Calendar,
  FileText,
  Cloud,
  Network,
  Code,
  Activity,
  Users,
  Building,
  CreditCard,
  Download,
  Upload,
  Trash2,
  Plus,
  Edit,
  Copy,
  ExternalLink,
  Phone,
  Brain
} from 'lucide-react';

interface UserSettings {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    company: string;
    role: string;
    timezone: string;
    language: string;
    avatar?: string;
  };
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
      security: boolean;
      updates: boolean;
      marketing: boolean;
    };
    privacy: {
      dataSharing: boolean;
      analytics: boolean;
      personalizedContent: boolean;
    };
  };
  integrations: {
    vonage: {
      enabled: boolean;
      apiKey: string;
      apiSecret: string;
      phoneNumber: string;
    };
    foxit: {
      enabled: boolean;
      apiKey: string;
      endpoint: string;
    };
    mulesoft: {
      enabled: boolean;
      clientId: string;
      clientSecret: string;
      environment: string;
    };
  };
  security: {
    twoFactorEnabled: boolean;
    sessionTimeout: number;
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSymbols: boolean;
    };
  };
  system: {
    autoBackup: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    dataRetention: number;
    performanceMode: 'balanced' | 'performance' | 'battery';
  };
}

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>({
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      company: 'Acme Corporation',
      role: 'Administrator',
      timezone: 'America/New_York',
      language: 'en-US'
    },
    preferences: {
      theme: 'auto',
      notifications: {
        email: true,
        sms: false,
        push: true,
        security: true,
        updates: true,
        marketing: false
      },
      privacy: {
        dataSharing: true,
        analytics: true,
        personalizedContent: true
      }
    },
    integrations: {
      vonage: {
        enabled: true,
        apiKey: '••••••••••••••••',
        apiSecret: '••••••••••••••••',
        phoneNumber: '+1 (555) 123-4567'
      },
      foxit: {
        enabled: true,
        apiKey: '••••••••••••••••',
        endpoint: 'https://api.foxit.com/v1'
      },
      mulesoft: {
        enabled: false,
        clientId: '',
        clientSecret: '',
        environment: 'sandbox'
      }
    },
    security: {
      twoFactorEnabled: true,
      sessionTimeout: 30,
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSymbols: true
      }
    },
    system: {
      autoBackup: true,
      backupFrequency: 'weekly',
      dataRetention: 90,
      performanceMode: 'balanced'
    }
  });

  const [loading, setLoading] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      // Simulate API call to load settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In a real app, you would fetch from API
      // const response = await fetch('/api/settings');
      // const data = await response.json();
      // setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Error",
        description: "Failed to load settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setLoading(true);
      // Simulate API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (field: keyof UserSettings['profile'], value: string) => {
    setSettings(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value
      }
    }));
  };

  const handlePreferenceChange = (category: keyof UserSettings['preferences'], field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [category]: typeof prev.preferences[category] === 'object' && prev.preferences[category] !== null
          ? {
              ...(prev.preferences[category] as object),
              [field]: value
            }
          : value
      }
    }));
  };

  const handleIntegrationChange = (integration: keyof UserSettings['integrations'], field: string, value: any) => {
    setSettings(prev => {
      const updatedIntegrations = { ...prev.integrations };
      const currentIntegration = updatedIntegrations[integration] as any;
      updatedIntegrations[integration] = { ...currentIntegration, [field]: value };
      
      return {
        ...prev,
        integrations: updatedIntegrations
      };
    });
  };

  const getIntegrationStatus = (integration: keyof UserSettings['integrations']) => {
    const config = settings.integrations[integration];
    if (!config.enabled) return { status: 'disabled', color: 'bg-gray-100 text-gray-600', icon: <AlertTriangle className="w-4 h-4" /> };
    
    // Check if the integration has an apiKey property
    if ('apiKey' in config && config.apiKey && config.apiKey !== '••••••••••••••••') {
      return { status: 'connected', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" /> };
    }
    
    // Check if the integration has a clientId property (MuleSoft)
    if ('clientId' in config && config.clientId) {
      return { status: 'connected', color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" /> };
    }
    
    return { status: 'incomplete', color: 'bg-yellow-100 text-yellow-800', icon: <AlertTriangle className="w-4 h-4" /> };
  };

  const testIntegration = async (integration: keyof UserSettings['integrations']) => {
    try {
      setLoading(true);
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Integration Test Successful",
        description: `${integration} integration is working properly.`,
      });
    } catch (error) {
      toast({
        title: "Integration Test Failed",
        description: `Unable to connect to ${integration}. Please check your credentials.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Text copied to clipboard",
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
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account preferences, integrations, and security settings
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadSettings}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={saveSettings} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="ai">AI Settings</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Update your personal information and account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={settings.profile.firstName}
                    onChange={(e) => handleProfileChange('firstName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={settings.profile.lastName}
                    onChange={(e) => handleProfileChange('lastName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={settings.profile.company}
                    onChange={(e) => handleProfileChange('company', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={settings.profile.role}
                    onChange={(e) => handleProfileChange('role', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={settings.profile.timezone} onValueChange={(value) => handleProfileChange('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="Europe/London">London</SelectItem>
                      <SelectItem value="Europe/Paris">Paris</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={settings.profile.language} onValueChange={(value) => handleProfileChange('language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="en-GB">English (UK)</SelectItem>
                      <SelectItem value="es-ES">Spanish</SelectItem>
                      <SelectItem value="fr-FR">French</SelectItem>
                      <SelectItem value="de-DE">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Settings */}
        <TabsContent value="preferences" className="space-y-6">
          {/* Theme & Display */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Appearance & Display
              </CardTitle>
              <CardDescription>
                Customize your interface appearance and display preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select value={settings.preferences.theme} onValueChange={(value: 'light' | 'dark' | 'auto') => handlePreferenceChange('theme', 'theme', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">Auto (System)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how and when you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-gray-600">Receive updates via email</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={settings.preferences.notifications.email}
                    onCheckedChange={(checked) => handlePreferenceChange('notifications', 'email', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <p className="text-sm text-gray-600">Receive updates via SMS</p>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={settings.preferences.notifications.sms}
                    onCheckedChange={(checked) => handlePreferenceChange('notifications', 'sms', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-gray-600">Receive browser push notifications</p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={settings.preferences.notifications.push}
                    onCheckedChange={(checked) => handlePreferenceChange('notifications', 'push', checked)}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="security-notifications">Security Alerts</Label>
                    <p className="text-sm text-gray-600">Important security-related notifications</p>
                  </div>
                  <Switch
                    id="security-notifications"
                    checked={settings.preferences.notifications.security}
                    onCheckedChange={(checked) => handlePreferenceChange('notifications', 'security', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="updates-notifications">System Updates</Label>
                    <p className="text-sm text-gray-600">Notifications about system updates</p>
                  </div>
                  <Switch
                    id="updates-notifications"
                    checked={settings.preferences.notifications.updates}
                    onCheckedChange={(checked) => handlePreferenceChange('notifications', 'updates', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketing-notifications">Marketing Communications</Label>
                    <p className="text-sm text-gray-600">Product updates and promotional content</p>
                  </div>
                  <Switch
                    id="marketing-notifications"
                    checked={settings.preferences.notifications.marketing}
                    onCheckedChange={(checked) => handlePreferenceChange('notifications', 'marketing', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy Settings
              </CardTitle>
              <CardDescription>
                Control how your data is used and shared
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="data-sharing">Data Sharing</Label>
                    <p className="text-sm text-gray-600">Allow sharing of anonymized usage data</p>
                  </div>
                  <Switch
                    id="data-sharing"
                    checked={settings.preferences.privacy.dataSharing}
                    onCheckedChange={(checked) => handlePreferenceChange('privacy', 'dataSharing', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="analytics">Analytics</Label>
                    <p className="text-sm text-gray-600">Help improve the product with usage analytics</p>
                  </div>
                  <Switch
                    id="analytics"
                    checked={settings.preferences.privacy.analytics}
                    onCheckedChange={(checked) => handlePreferenceChange('privacy', 'analytics', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="personalized-content">Personalized Content</Label>
                    <p className="text-sm text-gray-600">Receive personalized recommendations</p>
                  </div>
                  <Switch
                    id="personalized-content"
                    checked={settings.preferences.privacy.personalizedContent}
                    onCheckedChange={(checked) => handlePreferenceChange('privacy', 'personalizedContent', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Settings */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Third-Party Integrations
              </CardTitle>
              <CardDescription>
                Manage your connected services and API integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Vonage Integration */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Phone className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Vonage Communication</h3>
                      <p className="text-sm text-gray-600">SMS, Voice, and Video communication</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getIntegrationStatus('vonage').color}>
                      {getIntegrationStatus('vonage').icon}
                      {getIntegrationStatus('vonage').status}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testIntegration('vonage')}
                      disabled={loading}
                    >
                      Test
                    </Button>
                    <Switch
                      checked={settings.integrations.vonage.enabled}
                      onCheckedChange={(checked) => handleIntegrationChange('vonage', 'enabled', checked)}
                    />
                  </div>
                </div>
                
                {settings.integrations.vonage.enabled && (
                  <div className="ml-10 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="vonage-api-key">API Key</Label>
                        <div className="relative">
                          <Input
                            id="vonage-api-key"
                            type={showSecrets ? "text" : "password"}
                            value={settings.integrations.vonage.apiKey}
                            onChange={(e) => handleIntegrationChange('vonage', 'apiKey', e.target.value)}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowSecrets(!showSecrets)}
                          >
                            {showSecrets ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vonage-api-secret">API Secret</Label>
                        <div className="relative">
                          <Input
                            id="vonage-api-secret"
                            type={showSecrets ? "text" : "password"}
                            value={settings.integrations.vonage.apiSecret}
                            onChange={(e) => handleIntegrationChange('vonage', 'apiSecret', e.target.value)}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowSecrets(!showSecrets)}
                          >
                            {showSecrets ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vonage-phone">Phone Number</Label>
                      <Input
                        id="vonage-phone"
                        value={settings.integrations.vonage.phoneNumber}
                        onChange={(e) => handleIntegrationChange('vonage', 'phoneNumber', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Foxit Integration */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FileText className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Foxit PDF</h3>
                      <p className="text-sm text-gray-600">Document generation and processing</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getIntegrationStatus('foxit').color}>
                      {getIntegrationStatus('foxit').icon}
                      {getIntegrationStatus('foxit').status}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testIntegration('foxit')}
                      disabled={loading}
                    >
                      Test
                    </Button>
                    <Switch
                      checked={settings.integrations.foxit.enabled}
                      onCheckedChange={(checked) => handleIntegrationChange('foxit', 'enabled', checked)}
                    />
                  </div>
                </div>
                
                {settings.integrations.foxit.enabled && (
                  <div className="ml-10 space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="foxit-api-key">API Key</Label>
                      <div className="relative">
                        <Input
                          id="foxit-api-key"
                          type={showSecrets ? "text" : "password"}
                          value={settings.integrations.foxit.apiKey}
                          onChange={(e) => handleIntegrationChange('foxit', 'apiKey', e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowSecrets(!showSecrets)}
                        >
                          {showSecrets ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="foxit-endpoint">API Endpoint</Label>
                      <Input
                        id="foxit-endpoint"
                        value={settings.integrations.foxit.endpoint}
                        onChange={(e) => handleIntegrationChange('foxit', 'endpoint', e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* MuleSoft Integration */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Network className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">MuleSoft Anypoint</h3>
                      <p className="text-sm text-gray-600">API management and integration platform</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getIntegrationStatus('mulesoft').color}>
                      {getIntegrationStatus('mulesoft').icon}
                      {getIntegrationStatus('mulesoft').status}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testIntegration('mulesoft')}
                      disabled={loading}
                    >
                      Test
                    </Button>
                    <Switch
                      checked={settings.integrations.mulesoft.enabled}
                      onCheckedChange={(checked) => handleIntegrationChange('mulesoft', 'enabled', checked)}
                    />
                  </div>
                </div>
                
                {settings.integrations.mulesoft.enabled && (
                  <div className="ml-10 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="mulesoft-client-id">Client ID</Label>
                        <Input
                          id="mulesoft-client-id"
                          value={settings.integrations.mulesoft.clientId}
                          onChange={(e) => handleIntegrationChange('mulesoft', 'clientId', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mulesoft-client-secret">Client Secret</Label>
                        <div className="relative">
                          <Input
                            id="mulesoft-client-secret"
                            type={showSecrets ? "text" : "password"}
                            value={settings.integrations.mulesoft.clientSecret}
                            onChange={(e) => handleIntegrationChange('mulesoft', 'clientSecret', e.target.value)}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowSecrets(!showSecrets)}
                          >
                            {showSecrets ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mulesoft-environment">Environment</Label>
                      <Select value={settings.integrations.mulesoft.environment} onValueChange={(value) => handleIntegrationChange('mulesoft', 'environment', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sandbox">Sandbox</SelectItem>
                          <SelectItem value="development">Development</SelectItem>
                          <SelectItem value="staging">Staging</SelectItem>
                          <SelectItem value="production">Production</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Settings */}
        <TabsContent value="ai" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Configuration
              </CardTitle>
              <CardDescription>
                Configure AI-powered features and personalization settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* AI Personalization */}
              <div className="space-y-4">
                <h3 className="font-semibold">AI Personalization</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="ai-recommendations">AI Recommendations</Label>
                      <p className="text-sm text-gray-600">Enable AI-powered content recommendations</p>
                    </div>
                    <Switch
                      id="ai-recommendations"
                      checked={settings.preferences.privacy.personalizedContent}
                      onCheckedChange={(checked) => handlePreferenceChange('privacy', 'personalizedContent', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="behavior-tracking">Behavior Tracking</Label>
                      <p className="text-sm text-gray-600">Track user behavior for AI improvements</p>
                    </div>
                    <Switch
                      id="behavior-tracking"
                      checked={settings.preferences.privacy.analytics}
                      onCheckedChange={(checked) => handlePreferenceChange('privacy', 'analytics', checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Learning Preferences */}
              <div className="space-y-4">
                <h3 className="font-semibold">Learning Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="learning-style">Preferred Learning Style</Label>
                    <Select defaultValue="visual">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="visual">Visual</SelectItem>
                        <SelectItem value="auditory">Auditory</SelectItem>
                        <SelectItem value="kinesthetic">Hands-on</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="learning-pace">Learning Pace</Label>
                    <Select defaultValue="moderate">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="slow">Slow & Detailed</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="fast">Fast & Concise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* AI Model Settings */}
              <div className="space-y-4">
                <h3 className="font-semibold">AI Model Configuration</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="ai-model">AI Model Version</Label>
                    <Select defaultValue="latest">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="latest">Latest (GPT-4)</SelectItem>
                        <SelectItem value="stable">Stable (GPT-3.5)</SelectItem>
                        <SelectItem value="experimental">Experimental</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ai-temperature">AI Creativity Level</Label>
                    <Select defaultValue="balanced">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="focused">Focused & Precise</SelectItem>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="creative">Creative & Varied</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your account security and authentication preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Two-Factor Authentication */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    checked={settings.security.twoFactorEnabled}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      security: { ...prev.security, twoFactorEnabled: checked }
                    }))}
                  />
                </div>
                {settings.security.twoFactorEnabled && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Two-factor authentication is enabled. You'll need to enter a code from your authenticator app when signing in.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <Separator />

              {/* Session Management */}
              <div className="space-y-4">
                <h3 className="font-semibold">Session Management</h3>
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Select value={settings.security.sessionTimeout.toString()} onValueChange={(value) => setSettings(prev => ({
                    ...prev,
                    security: { ...prev.security, sessionTimeout: parseInt(value) }
                  }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="480">8 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Password Policy */}
              <div className="space-y-4">
                <h3 className="font-semibold">Password Policy</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="min-length">Minimum Length</Label>
                    <Select value={settings.security.passwordPolicy.minLength.toString()} onValueChange={(value) => setSettings(prev => ({
                      ...prev,
                      security: {
                        ...prev.security,
                        passwordPolicy: {
                          ...prev.security.passwordPolicy,
                          minLength: parseInt(value)
                        }
                      }
                    }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="6">6 characters</SelectItem>
                        <SelectItem value="8">8 characters</SelectItem>
                        <SelectItem value="10">10 characters</SelectItem>
                        <SelectItem value="12">12 characters</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="require-uppercase">Require Uppercase Letters</Label>
                      <Switch
                        id="require-uppercase"
                        checked={settings.security.passwordPolicy.requireUppercase}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          security: {
                            ...prev.security,
                            passwordPolicy: {
                              ...prev.security.passwordPolicy,
                              requireUppercase: checked
                            }
                          }
                        }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="require-lowercase">Require Lowercase Letters</Label>
                      <Switch
                        id="require-lowercase"
                        checked={settings.security.passwordPolicy.requireLowercase}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          security: {
                            ...prev.security,
                            passwordPolicy: {
                              ...prev.security.passwordPolicy,
                              requireLowercase: checked
                            }
                          }
                        }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="require-numbers">Require Numbers</Label>
                      <Switch
                        id="require-numbers"
                        checked={settings.security.passwordPolicy.requireNumbers}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          security: {
                            ...prev.security,
                            passwordPolicy: {
                              ...prev.security.passwordPolicy,
                              requireNumbers: checked
                            }
                          }
                        }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="require-symbols">Require Special Characters</Label>
                      <Switch
                        id="require-symbols"
                        checked={settings.security.passwordPolicy.requireSymbols}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          security: {
                            ...prev.security,
                            passwordPolicy: {
                              ...prev.security.passwordPolicy,
                              requireSymbols: checked
                            }
                          }
                        }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                System Configuration
              </CardTitle>
              <CardDescription>
                Configure system-level settings and performance options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Backup Settings */}
              <div className="space-y-4">
                <h3 className="font-semibold">Backup & Recovery</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-backup">Automatic Backup</Label>
                      <p className="text-sm text-gray-600">Automatically backup your data</p>
                    </div>
                    <Switch
                      id="auto-backup"
                      checked={settings.system.autoBackup}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        system: { ...prev.system, autoBackup: checked }
                      }))}
                    />
                  </div>
                  {settings.system.autoBackup && (
                    <div className="space-y-2">
                      <Label htmlFor="backup-frequency">Backup Frequency</Label>
                      <Select value={settings.system.backupFrequency} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setSettings(prev => ({
                        ...prev,
                        system: { ...prev.system, backupFrequency: value }
                      }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Data Retention */}
              <div className="space-y-4">
                <h3 className="font-semibold">Data Retention</h3>
                <div className="space-y-2">
                  <Label htmlFor="data-retention">Data Retention Period (days)</Label>
                  <Select value={settings.system.dataRetention.toString()} onValueChange={(value) => setSettings(prev => ({
                    ...prev,
                    system: { ...prev.system, dataRetention: parseInt(value) }
                  }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                      <SelectItem value="730">2 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Performance Settings */}
              <div className="space-y-4">
                <h3 className="font-semibold">Performance</h3>
                <div className="space-y-2">
                  <Label htmlFor="performance-mode">Performance Mode</Label>
                  <Select value={settings.system.performanceMode} onValueChange={(value: 'balanced' | 'performance' | 'battery') => setSettings(prev => ({
                    ...prev,
                    system: { ...prev.system, performanceMode: value }
                  }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="performance">High Performance</SelectItem>
                      <SelectItem value="battery">Battery Saver</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
