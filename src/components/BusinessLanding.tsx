import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  ArrowRight, 
  Check, 
  Star, 
  Shield, 
  Zap, 
  Users, 
  BarChart3, 
  Globe,
  Mail,
  Phone,
  MessageSquare,
  Play,
  Download,
  BookOpen,
  Award,
  TrendingUp,
  Lock,
  Eye,
  Heart,
  Target
} from 'lucide-react';

const BusinessLanding: React.FC = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState('');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('Sending...');
    setTimeout(() => {
      setFormStatus('Thank you! We\'ll be in touch soon.');
      setContactForm({ name: '', email: '', company: '', message: '' });
    }, 1500);
  };

  const features = [
    {
      icon: Shield,
      title: 'Secure 2FA Verification',
      description: 'Multi-factor authentication via Vonage Verify ensures your users are who they say they are.'
    },
    {
      icon: Users,
      title: 'Multi-Channel Engagement',
      description: 'Reach users across SMS, email, video, and in-app experiences for maximum engagement.'
    },
    {
      icon: Zap,
      title: 'AI-Powered Workflows',
      description: 'Intelligent automation that adapts to your business processes and user behavior.'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Deep insights into onboarding performance with actionable recommendations.'
    },
    {
      icon: Globe,
      title: 'Global Compliance',
      description: 'Built-in compliance for GDPR, SOC2, and industry-specific regulations.'
    },
    {
      icon: Lock,
      title: 'Enterprise Security',
      description: 'Bank-level security with end-to-end encryption and audit trails.'
    }
  ];

  const integrations = [
    { name: 'Vonage', logo: '/api/placeholder/80/40', description: 'SMS, Voice & Video' },
    { name: 'Foxit', logo: '/api/placeholder/80/40', description: 'Document Automation' },
    { name: 'MuleSoft', logo: '/api/placeholder/80/40', description: 'AI Orchestration' },
    { name: 'Slack', logo: '/api/placeholder/80/40', description: 'Team Collaboration' },
    { name: 'Salesforce', logo: '/api/placeholder/80/40', description: 'CRM Integration' },
    { name: 'Workday', logo: '/api/placeholder/80/40', description: 'HR Management' }
  ];

  const stats = [
    { number: '500+', label: 'Companies Trust Us' },
    { number: '50,000+', label: 'Users Onboarded' },
    { number: '98%', label: 'Satisfaction Rate' },
    { number: '85%', label: 'Time Saved' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <Badge className="bg-blue-100 text-blue-800 mb-3 sm:mb-4 text-xs sm:text-sm">
              <Award className="h-3 w-3 mr-1" />
              Trusted by 500+ Companies
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Transform Your
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Customer Onboarding</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-6 sm:mb-8 px-2">
              OnboardIQ accelerates user activation with secure 2FA verification, personalized multi-channel engagement, 
              and automated document workflows powered by AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 h-12 sm:h-14 text-sm sm:text-base">
                Start Free Trial
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="h-12 sm:h-14 text-sm sm:text-base">
                <Play className="h-4 w-4 mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mb-8 sm:mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{stat.number}</div>
                <div className="text-sm sm:text-base text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Why Choose OnboardIQ?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-2">
              Reduce churn with clear, secure onboarding flows. Boost compliance and trust with blockchain-backed audit trails. 
              Scale effortlessly with AI-powered workflow orchestration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-4 sm:p-6">
                  <feature.icon className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600 mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              How OnboardIQ Works
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Three simple steps to transform your onboarding process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-white font-bold text-lg sm:text-xl">1</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Connect & Configure</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Integrate with your existing systems and configure your onboarding workflows in minutes.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-white font-bold text-lg sm:text-xl">2</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Automate & Engage</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Our AI automatically engages users across multiple channels with personalized experiences.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <span className="text-white font-bold text-lg sm:text-xl">3</span>
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Scale & Optimize</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Scale effortlessly while our analytics help you continuously optimize your process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Seamless Integrations
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Works with the tools you already use
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8">
            {integrations.map((integration, index) => (
              <Card key={index} className="text-center hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-3 sm:p-4">
                  <div className="w-12 h-10 sm:w-16 sm:h-12 bg-gray-100 rounded mx-auto mb-2 flex items-center justify-center">
                    <span className="text-gray-500 text-xs">{integration.name}</span>
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1">{integration.name}</h3>
                  <p className="text-xs text-gray-600">{integration.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
            Ready to Transform Your Onboarding?
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8 px-2">
            Join hundreds of companies already using OnboardIQ to streamline their onboarding process.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button size="lg" variant="secondary" className="h-12 sm:h-14 text-sm sm:text-base">
              Start Free Trial
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600 h-12 sm:h-14 text-sm sm:text-base">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                Get in Touch
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                Ready to learn more about how OnboardIQ can transform your onboarding process? 
                Our team is here to help.
              </p>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-600">hello@onboardiq.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-600">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                  <span className="text-sm sm:text-base text-gray-600">Live chat available 24/7</span>
                </div>
              </div>
            </div>

            <div>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm sm:text-base">Name</Label>
                  <Input
                    id="name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    required
                    className="h-10 sm:h-11"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    required
                    className="h-10 sm:h-11"
                  />
                </div>
                <div>
                  <Label htmlFor="company" className="text-sm sm:text-base">Company</Label>
                  <Input
                    id="company"
                    value={contactForm.company}
                    onChange={(e) => setContactForm({...contactForm, company: e.target.value})}
                    className="h-10 sm:h-11"
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="text-sm sm:text-base">Message</Label>
                  <Textarea
                    id="message"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    rows={4}
                    required
                    className="resize-none"
                  />
                </div>
                <Button type="submit" className="w-full h-10 sm:h-11 text-sm sm:text-base">
                  Send Message
                </Button>
                {formStatus && (
                  <p className="text-sm text-green-600">{formStatus}</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">OnboardIQ</h3>
              <p className="text-gray-400 text-xs sm:text-sm">
                Transforming customer onboarding with AI-powered automation and multi-channel engagement.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Product</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Integrations</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Company</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Support</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-gray-400">
            <p>&copy; 2024 OnboardIQ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BusinessLanding;
