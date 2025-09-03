import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Phone, Video, FileText, Users, CheckCircle, Zap } from 'lucide-react';
import SMSVerification from './SMSVerification';
import VideoOnboarding from './VideoOnboarding';
import DocumentGeneration from './DocumentGeneration';
import TeamManagement from './TeamManagement';

interface ProductFeaturesProps {
  userId: string;
}

export const ProductFeatures: React.FC<ProductFeaturesProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('sms');

  const features = [
    {
      id: 'sms',
      title: 'SMS Verification',
      description: 'Secure phone number verification with real-time SMS delivery',
      icon: Phone,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      benefits: [
        'Real-time SMS delivery',
        '6-digit verification codes',
        '10-minute expiration',
        'Multiple retry attempts',
        'Carrier detection',
        'Cost tracking'
      ]
    },
    {
      id: 'video',
      title: 'Video Onboarding',
      description: 'Personalized video sessions for seamless customer onboarding',
      icon: Video,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      benefits: [
        'Scheduled video sessions',
        'Multiple session types',
        'Meeting URL generation',
        'Session recording',
        'Satisfaction tracking',
        'Host management'
      ]
    },
    {
      id: 'documents',
      title: 'Document Generation',
      description: 'AI-powered document creation with personalization',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      benefits: [
        'Multiple document templates',
        'Variable substitution',
        'Industry-specific content',
        'Company branding',
        'Quality assessment',
        'Download tracking'
      ]
    },
    {
      id: 'teams',
      title: 'Team Management',
      description: 'Collaborative team management with role-based permissions',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      benefits: [
        'Team creation & management',
        'Role-based permissions',
        'Member invitations',
        'Activity tracking',
        'Plan-based limits',
        'Real-time collaboration'
      ]
    }
  ];

  const renderFeatureContent = (featureId: string) => {
    switch (featureId) {
      case 'sms':
        return (
          <SMSVerification
            userId={userId}
            onVerificationComplete={(session) => {
              console.log('SMS verification completed:', session);
            }}
            onVerificationFailed={(error) => {
              console.error('SMS verification failed:', error);
            }}
          />
        );
      case 'video':
        return (
          <VideoOnboarding
            userId={userId}
            onSessionScheduled={(session) => {
              console.log('Video session scheduled:', session);
            }}
            onSessionStarted={(session) => {
              console.log('Video session started:', session);
            }}
            onSessionCompleted={(session) => {
              console.log('Video session completed:', session);
            }}
          />
        );
      case 'documents':
        return (
          <DocumentGeneration
            userId={userId}
            onDocumentGenerated={(document) => {
              console.log('Document generated:', document);
            }}
            onDocumentFailed={(error) => {
              console.error('Document generation failed:', error);
            }}
          />
        );
      case 'teams':
        return (
          <TeamManagement
            userId={userId}
            onTeamCreated={(team) => {
              console.log('Team created:', team);
            }}
            onMemberInvited={(invitation) => {
              console.log('Member invited:', invitation);
            }}
            onMemberJoined={(member) => {
              console.log('Member joined:', member);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Zap className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Product Features</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Experience the power of AI-driven customer onboarding with our comprehensive suite of features
        </p>
      </div>

      {/* Feature Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature) => (
          <Card
            key={feature.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              activeTab === feature.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setActiveTab(feature.id)}
          >
            <CardHeader className="text-center">
              <div className={`mx-auto w-12 h-12 rounded-full ${feature.bgColor} flex items-center justify-center mb-2`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
              <CardDescription className="text-sm">
                {feature.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {feature.benefits.slice(0, 3).map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{benefit}</span>
                  </div>
                ))}
                {feature.benefits.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{feature.benefits.length - 3} more
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Feature Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {features.map((feature) => (
            <TabsTrigger key={feature.id} value={feature.id} className="flex items-center gap-2">
              <feature.icon className="h-4 w-4" />
              {feature.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {features.map((feature) => (
          <TabsContent key={feature.id} value={feature.id} className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  <CardTitle>{feature.title}</CardTitle>
                </div>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {renderFeatureContent(feature.id)}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Feature Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Why Choose OnboardIQ?
          </CardTitle>
          <CardDescription>
            Discover the advantages of our comprehensive onboarding solution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-600">AI-Powered</h4>
              <p className="text-sm text-muted-foreground">
                Leverage artificial intelligence for personalized experiences and intelligent automation
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-green-600">Multi-Channel</h4>
              <p className="text-sm text-muted-foreground">
                Reach customers through SMS, video, documents, and team collaboration seamlessly
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-purple-600">Secure</h4>
              <p className="text-sm text-muted-foreground">
                Enterprise-grade security with verification, encryption, and compliance features
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-orange-600">Scalable</h4>
              <p className="text-sm text-muted-foreground">
                Handle growing customer bases with automated workflows and team management
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-red-600">Analytics</h4>
              <p className="text-sm text-muted-foreground">
                Track performance, engagement, and success metrics across all features
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-indigo-600">Integration</h4>
              <p className="text-sm text-muted-foreground">
                Seamless integration with Vonage, Foxit, and other enterprise tools
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductFeatures;
