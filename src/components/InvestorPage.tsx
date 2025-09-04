import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Building, 
  Award,
  Star,
  ArrowRight,
  Check,
  Calendar,
  Target,
  BarChart3,
  Globe,
  Shield,
  Zap,
  Rocket,
  Handshake,
  Briefcase,
  Lightbulb
} from 'lucide-react';

const InvestorPage: React.FC = () => {
  const fundingRounds = [
    {
      round: 'Seed Round',
      amount: '$2.5M',
      date: 'Q1 2024',
      investors: ['Tech Ventures Capital', 'Innovation Fund', 'Angel Investors'],
      use: 'Product development and team expansion',
      status: 'Completed'
    },
    {
      round: 'Series A',
      amount: '$8.5M',
      date: 'Q3 2024',
      investors: ['Growth Capital Partners', 'Enterprise Ventures', 'Strategic Angels'],
      use: 'Market expansion and enterprise sales',
      status: 'In Progress'
    },
    {
      round: 'Series B',
      amount: '$25M',
      date: 'Q2 2025',
      investors: ['TBD'],
      use: 'International expansion and AI development',
      status: 'Planned'
    }
  ];

  const milestones = [
    {
      date: 'January 2024',
      title: 'Company Founded',
      description: 'OnboardIQ established with founding team',
      icon: Lightbulb,
      category: 'Foundation'
    },
    {
      date: 'March 2024',
      title: 'MVP Launch',
      description: 'First version of platform launched with core features',
      icon: Rocket,
      category: 'Product'
    },
    {
      date: 'May 2024',
      title: 'Seed Funding',
      description: 'Successfully raised $2.5M in seed funding',
      icon: DollarSign,
      category: 'Funding'
    },
    {
      date: 'July 2024',
      title: 'First 100 Customers',
      description: 'Reached 100 paying customers milestone',
      icon: Users,
      category: 'Growth'
    },
    {
      date: 'September 2024',
      title: 'Enterprise Partnerships',
      description: 'Strategic partnerships with major enterprise customers',
      icon: Handshake,
      category: 'Partnerships'
    },
    {
      date: 'December 2024',
      title: 'Series A Target',
      description: 'Targeting $8.5M Series A funding round',
      icon: Target,
      category: 'Funding'
    }
  ];

  const strategicPartners = [
    {
      name: 'Vonage',
      logo: '/api/placeholder/120/60',
      description: 'Multi-channel communication APIs',
      partnership: 'Technology Integration',
      benefits: ['SMS/MMS APIs', 'Voice APIs', 'Video APIs', 'Verify APIs']
    },
    {
      name: 'Foxit',
      logo: '/api/placeholder/120/60',
      description: 'Document processing and e-signature',
      partnership: 'Technology Integration',
      benefits: ['PDF Generation', 'Document Automation', 'E-Signature', 'Compliance']
    },
    {
      name: 'MuleSoft',
      logo: '/api/placeholder/120/60',
      description: 'AI orchestration and workflow automation',
      partnership: 'Technology Integration',
      benefits: ['AI Orchestration', 'Workflow Automation', 'API Management', 'Integration']
    },
    {
      name: 'Salesforce',
      logo: '/api/placeholder/120/60',
      description: 'CRM integration and customer success',
      partnership: 'Channel Partnership',
      benefits: ['CRM Integration', 'Lead Management', 'Customer Success', 'Analytics']
    }
  ];

  const financialMetrics = [
    { metric: '$2.5M', label: 'Total Funding Raised', growth: '+150% YoY' },
    { metric: '150+', label: 'Active Customers', growth: '+300% YoY' },
    { metric: '$850K', label: 'Annual Recurring Revenue', growth: '+400% YoY' },
    { metric: '85%', label: 'Customer Retention Rate', growth: '+15% YoY' }
  ];

  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Co-Founder',
      bio: 'Former VP of Product at Stripe, 15+ years in fintech',
      avatar: '/api/placeholder/80/80',
      linkedin: '#'
    },
    {
      name: 'Michael Chen',
      role: 'CTO & Co-Founder',
      bio: 'Ex-Google engineer, AI/ML specialist with 12+ years experience',
      avatar: '/api/placeholder/80/80',
      linkedin: '#'
    },
    {
      name: 'Emily Rodriguez',
      role: 'VP of Sales',
      bio: 'Former Director of Enterprise Sales at HubSpot',
      avatar: '/api/placeholder/80/80',
      linkedin: '#'
    },
    {
      name: 'David Kim',
      role: 'VP of Engineering',
      bio: 'Led engineering teams at Airbnb and Uber',
      avatar: '/api/placeholder/80/80',
      linkedin: '#'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-blue-100 text-blue-800 mb-4">
              <TrendingUp className="h-3 w-3 mr-1" />
              Investor Relations
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Building the Future of
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Customer Onboarding</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              OnboardIQ is revolutionizing customer onboarding with AI-powered automation, 
              enterprise security, and multi-channel engagement. Join us in transforming 
              how companies onboard and retain customers.
            </p>
          </div>

          {/* Financial Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {financialMetrics.map((metric, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-gray-900 mb-2">{metric.metric}</div>
                  <div className="text-gray-600 text-sm mb-2">{metric.label}</div>
                  <Badge variant="secondary" className="text-green-600 bg-green-100">
                    {metric.growth}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Funding Rounds */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Funding History & Strategy
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our funding strategy supports rapid growth and market expansion 
              while maintaining strong unit economics and customer focus.
            </p>
          </div>

          <div className="space-y-8">
            {fundingRounds.map((round, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                        <DollarSign className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{round.round}</CardTitle>
                        <p className="text-gray-600">{round.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-gray-900">{round.amount}</div>
                      <Badge 
                        variant={round.status === 'Completed' ? 'default' : 
                               round.status === 'In Progress' ? 'secondary' : 'outline'}
                        className="mt-2"
                      >
                        {round.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Lead Investors:</h4>
                      <ul className="space-y-1">
                        {round.investors.map((investor, idx) => (
                          <li key={idx} className="text-sm text-gray-600">• {investor}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Use of Funds:</h4>
                      <p className="text-sm text-gray-600">{round.use}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Growth Milestones */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Growth Milestones
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Key achievements and milestones demonstrating our rapid growth 
              and market traction.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-blue-200"></div>
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative flex items-start space-x-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <milestone.icon className="h-8 w-8 text-white" />
                  </div>
                  <Card className="flex-1 hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-xl">{milestone.title}</CardTitle>
                          <p className="text-gray-600">{milestone.date}</p>
                        </div>
                        <Badge variant="outline" className="text-blue-600">
                          {milestone.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{milestone.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Partnerships */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Strategic Partnerships
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Strategic technology partnerships that enhance our platform capabilities 
              and accelerate market penetration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {strategicPartners.map((partner, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-10 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-gray-500 text-sm font-semibold">{partner.name}</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{partner.name}</CardTitle>
                      <p className="text-gray-600 text-sm">{partner.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Partnership Type:</h4>
                      <Badge variant="outline" className="text-blue-600">
                        {partner.partnership}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Key Benefits:</h4>
                      <ul className="space-y-1">
                        {partner.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-600">
                            <Check className="h-3 w-3 text-green-600 mr-2" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Leadership Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experienced leadership team with deep expertise in fintech, 
              AI/ML, and enterprise software.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-gray-500 text-lg font-semibold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 text-sm mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm mb-3">{member.bio}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Briefcase className="h-3 w-3 mr-1" />
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Join Our Journey
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Interested in investing or partnering with OnboardIQ? 
            Let's discuss how we can work together to transform customer onboarding.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Schedule Investor Call
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
              Download Investor Deck
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InvestorPage;
