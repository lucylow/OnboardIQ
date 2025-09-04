import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, Quote, TrendingUp, Users, Clock, Award } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  companyLogo: string;
  avatar: string;
  content: string;
  rating: number;
  metrics: {
    improvement: string;
    timeSaved: string;
    satisfaction: string;
  };
  industry: string;
  featured?: boolean;
}

const Testimonials: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'Head of People Operations',
      company: 'TechFlow Solutions',
      companyLogo: '/api/placeholder/100/40',
      avatar: '/api/placeholder/60/60',
      content: 'OnboardIQ transformed our onboarding process completely. What used to take weeks now happens in days, and our new hires are more engaged than ever. The automated document generation and e-signature workflows save us hours every week.',
      rating: 5,
      metrics: {
        improvement: '85% faster onboarding',
        timeSaved: '12 hours per hire',
        satisfaction: '98% satisfaction rate'
      },
      industry: 'Technology',
      featured: true
    },
    {
      id: '2',
      name: 'Michael Chen',
      role: 'HR Director',
      company: 'Global Retail Corp',
      companyLogo: '/api/placeholder/100/40',
      avatar: '/api/placeholder/60/60',
      content: 'The video onboarding feature is a game-changer. Our remote teams feel more connected, and the AI-powered insights help us continuously improve our process. ROI was achieved within the first quarter.',
      rating: 5,
      metrics: {
        improvement: '70% reduction in time-to-productivity',
        timeSaved: '8 hours per hire',
        satisfaction: '95% satisfaction rate'
      },
      industry: 'Retail'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      role: 'VP of Operations',
      company: 'StartupScale Inc',
      companyLogo: '/api/placeholder/100/40',
      avatar: '/api/placeholder/60/60',
      content: 'As a fast-growing startup, we needed a solution that could scale with us. OnboardIQ\'s flexibility and automation capabilities have been crucial to our success. The analytics help us make data-driven decisions.',
      rating: 5,
      metrics: {
        improvement: '90% faster document processing',
        timeSaved: '15 hours per hire',
        satisfaction: '97% satisfaction rate'
      },
      industry: 'Startup'
    },
    {
      id: '4',
      name: 'David Kim',
      role: 'Chief People Officer',
      company: 'Enterprise Solutions Ltd',
      companyLogo: '/api/placeholder/100/40',
      avatar: '/api/placeholder/60/60',
      content: 'The enterprise features and compliance capabilities are exactly what we needed. Our legal team loves the automated contract generation, and our new hires appreciate the personalized experience.',
      rating: 5,
      metrics: {
        improvement: '75% faster compliance completion',
        timeSaved: '10 hours per hire',
        satisfaction: '96% satisfaction rate'
      },
      industry: 'Enterprise'
    },
    {
      id: '5',
      name: 'Lisa Wang',
      role: 'Talent Acquisition Manager',
      company: 'Innovation Labs',
      companyLogo: '/api/placeholder/100/40',
      avatar: '/api/placeholder/60/60',
      content: 'The integration with our existing HR systems was seamless. The Foxit document automation saves us countless hours, and the e-signature workflows ensure nothing falls through the cracks.',
      rating: 5,
      metrics: {
        improvement: '80% faster document completion',
        timeSaved: '6 hours per hire',
        satisfaction: '99% satisfaction rate'
      },
      industry: 'Research'
    },
    {
      id: '6',
      name: 'Robert Taylor',
      role: 'Operations Manager',
      company: 'Manufacturing Plus',
      companyLogo: '/api/placeholder/100/40',
      avatar: '/api/placeholder/60/60',
      content: 'Even in a traditional manufacturing environment, OnboardIQ has revolutionized how we bring new team members onboard. The video training modules are particularly effective for our hands-on roles.',
      rating: 5,
      metrics: {
        improvement: '65% faster training completion',
        timeSaved: '9 hours per hire',
        satisfaction: '94% satisfaction rate'
      },
      industry: 'Manufacturing'
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Trusted by Leading Companies
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            See how organizations are transforming their onboarding with OnboardIQ
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">50,000+</div>
              <div className="text-gray-600">Employees Onboarded</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">85%</div>
              <div className="text-gray-600">Time Saved</div>
            </div>
          </div>
        </div>

        {/* Featured Testimonial */}
        <div className="mb-12">
          {testimonials.filter(t => t.featured).map((testimonial) => (
            <Card key={testimonial.id} className="relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <Badge className="bg-blue-100 text-blue-800">
                  <Award className="h-3 w-3 mr-1" />
                  Featured Story
                </Badge>
              </div>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <div className="flex items-start mb-4">
                      <Quote className="h-8 w-8 text-blue-200 mr-3 mt-1" />
                      <p className="text-lg text-gray-700 italic">
                        "{testimonial.content}"
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={testimonial.avatar} />
                        <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                        <div className="text-sm text-gray-500">{testimonial.company}</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-1">
                      {renderStars(testimonial.rating)}
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-600">{testimonial.metrics.improvement}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-gray-600">{testimonial.metrics.timeSaved}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-purple-500" />
                        <span className="text-sm text-gray-600">{testimonial.metrics.satisfaction}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.filter(t => !t.featured).map((testimonial) => (
            <Card key={testimonial.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-start mb-4">
                  <Quote className="h-6 w-6 text-blue-200 mr-2 mt-1" />
                  <p className="text-sm text-gray-700 italic">
                    "{testimonial.content}"
                  </p>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={testimonial.avatar} />
                      <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{testimonial.name}</div>
                      <div className="text-xs text-gray-600">{testimonial.role}</div>
                      <div className="text-xs text-gray-500">{testimonial.company}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-gray-600">{testimonial.metrics.improvement}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-3 w-3 text-blue-500" />
                    <span className="text-xs text-gray-600">{testimonial.metrics.timeSaved}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Transform Your Onboarding?
            </h3>
            <p className="text-gray-600 mb-6">
              Join hundreds of companies already using OnboardIQ to streamline their onboarding process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Start Free Trial
              </button>
              <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
