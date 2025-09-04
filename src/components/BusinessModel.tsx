import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Target, 
  TrendingUp, 
  Users, 
  Building, 
  Shield, 
  Zap, 
  BarChart3, 
  Globe,
  Award,
  Star,
  ArrowRight,
  Check,
  DollarSign,
  PieChart,
  Lightbulb,
  Rocket
} from 'lucide-react';

const BusinessModel: React.FC = () => {
  const targetMarkets = [
    {
      icon: Building,
      title: 'Mid-Size SaaS Companies',
      description: 'Companies with 100-1000 employees seeking to reduce churn and improve user activation.',
      painPoints: ['High churn rates', 'Manual onboarding processes', 'Security compliance needs'],
      solution: 'Automated multi-channel onboarding with built-in security compliance'
    },
    {
      icon: Shield,
      title: 'FinTech & HealthTech',
      description: 'Regulated industries requiring secure, compliant user verification and onboarding.',
      painPoints: ['Strict compliance requirements', 'Complex verification processes', 'Audit trail needs'],
      solution: 'End-to-end compliance with blockchain audit trails and advanced security'
    },
    {
      icon: Users,
      title: 'Customer Success Teams',
      description: 'Teams focused on improving customer lifetime value and reducing churn.',
      painPoints: ['Poor user engagement', 'Inconsistent onboarding', 'Limited personalization'],
      solution: 'AI-powered personalized experiences across multiple channels'
    },
    {
      icon: Rocket,
      title: 'Fast-Growing Platforms',
      description: 'Scaling companies needing efficient, automated user onboarding processes.',
      painPoints: ['Manual scaling challenges', 'Inconsistent user experience', 'Resource constraints'],
      solution: 'Scalable automation with intelligent workflow orchestration'
    }
  ];

  const competitiveAdvantages = [
    {
      title: 'Integrated Security + Multi-Channel',
      description: 'Only solution combining enterprise-grade security with personalized multi-channel engagement',
      icon: Shield
    },
    {
      title: 'AI-Powered Automation',
      description: 'Intelligent workflows that adapt to user behavior and business processes',
      icon: Zap
    },
    {
      title: 'Comprehensive Compliance',
      description: 'Built-in compliance for GDPR, SOC2, HIPAA, and industry-specific regulations',
      icon: Award
    },
    {
      title: 'Real-Time Analytics',
      description: 'Advanced insights and predictive analytics for continuous optimization',
      icon: BarChart3
    }
  ];

  const marketStats = [
    { metric: '$15.6B', label: 'Global Onboarding Market Size', growth: '+12.3% YoY' },
    { metric: '67%', label: 'Companies Planning Onboarding Investment', growth: '+8.2% YoY' },
    { metric: '89%', label: 'Users Prefer Multi-Channel Onboarding', growth: '+15.1% YoY' },
    { metric: '$2.3M', label: 'Average Cost of Poor Onboarding', growth: '+5.7% YoY' }
  ];

  const goToMarketStrategy = [
    {
      phase: 'Phase 1: Product-Led Growth',
      description: 'Self-service trials and freemium model to drive organic adoption',
      tactics: ['Free trial with core features', 'Content marketing and thought leadership', 'Community building'],
      timeline: 'Months 1-6'
    },
    {
      phase: 'Phase 2: Outbound Sales',
      description: 'Targeted enterprise sales focusing on regulated sectors',
      tactics: ['Direct sales to FinTech/HealthTech', 'Partnership with compliance consultants', 'Industry events and conferences'],
      timeline: 'Months 6-12'
    },
    {
      phase: 'Phase 3: Strategic Partnerships',
      description: 'Channel partnerships and integration ecosystem',
      tactics: ['CRM platform integrations', 'Consulting firm partnerships', 'Technology alliance programs'],
      timeline: 'Months 12-18'
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
              Market Opportunity
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Proven Business Model for
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Scalable Growth</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              OnboardIQ addresses a $15.6B market opportunity with a differentiated SaaS model 
              targeting high-value customer segments in regulated industries.
            </p>
          </div>

          {/* Market Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {marketStats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.metric}</div>
                  <div className="text-gray-600 text-sm mb-2">{stat.label}</div>
                  <Badge variant="secondary" className="text-green-600 bg-green-100">
                    {stat.growth}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Target Markets */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Target Market Segments
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We focus on high-value customer segments with acute onboarding challenges 
              and strong willingness to pay for solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {targetMarkets.map((market, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <market.icon className="h-8 w-8 text-blue-600" />
                    <CardTitle className="text-xl">{market.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{market.description}</p>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Pain Points:</h4>
                    <ul className="space-y-1">
                      {market.painPoints.map((point, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Our Solution:</h4>
                    <p className="text-sm text-blue-600 font-medium">{market.solution}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Competitive Analysis */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Competitive Advantages
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our unique combination of features creates defensible competitive moats 
              and positions us for market leadership.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {competitiveAdvantages.map((advantage, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <advantage.icon className="h-12 w-12 text-blue-600 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{advantage.title}</h3>
                      <p className="text-gray-600">{advantage.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Competitive Matrix */}
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Competitive Landscape Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">Feature</th>
                        <th className="text-center py-3 px-4 font-semibold">OnboardIQ</th>
                        <th className="text-center py-3 px-4 font-semibold">Competitor A</th>
                        <th className="text-center py-3 px-4 font-semibold">Competitor B</th>
                        <th className="text-center py-3 px-4 font-semibold">Competitor C</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-medium">Multi-Channel Onboarding</td>
                        <td className="text-center py-3 px-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                        <td className="text-center py-3 px-4 text-gray-400">Limited</td>
                        <td className="text-center py-3 px-4 text-gray-400">No</td>
                        <td className="text-center py-3 px-4 text-gray-400">Basic</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-medium">AI-Powered Automation</td>
                        <td className="text-center py-3 px-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                        <td className="text-center py-3 px-4 text-gray-400">Basic</td>
                        <td className="text-center py-3 px-4 text-gray-400">No</td>
                        <td className="text-center py-3 px-4 text-gray-400">Limited</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-medium">Enterprise Security</td>
                        <td className="text-center py-3 px-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                        <td className="text-center py-3 px-4 text-gray-400">Standard</td>
                        <td className="text-center py-3 px-4 text-gray-400">Basic</td>
                        <td className="text-center py-3 px-4 text-gray-400">Standard</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4 font-medium">Compliance Automation</td>
                        <td className="text-center py-3 px-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                        <td className="text-center py-3 px-4 text-gray-400">Manual</td>
                        <td className="text-center py-3 px-4 text-gray-400">No</td>
                        <td className="text-center py-3 px-4 text-gray-400">Limited</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium">Real-Time Analytics</td>
                        <td className="text-center py-3 px-4"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                        <td className="text-center py-3 px-4 text-gray-400">Basic</td>
                        <td className="text-center py-3 px-4 text-gray-400">No</td>
                        <td className="text-center py-3 px-4 text-gray-400">Standard</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Go-to-Market Strategy */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Go-to-Market Strategy
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A phased approach combining product-led growth with strategic enterprise sales 
              to capture market share efficiently.
            </p>
          </div>

          <div className="space-y-8">
            {goToMarketStrategy.map((phase, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <CardTitle className="text-xl">{phase.phase}</CardTitle>
                        <p className="text-gray-600">{phase.description}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-blue-600">
                      {phase.timeline}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <h4 className="font-semibold text-gray-900 mb-3">Key Tactics:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {phase.tactics.map((tactic, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-gray-600">{tactic}</span>
                      </div>
                    ))}
                  </div>
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
            Ready to Invest in the Future of Onboarding?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join us in transforming how companies onboard and engage their customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Schedule Investor Call
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
              Download Pitch Deck
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BusinessModel;
