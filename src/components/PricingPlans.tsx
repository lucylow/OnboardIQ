import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Crown, Shield, Users, BarChart3, Globe, Mail, Phone } from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  isPopular?: boolean;
  isEnterprise?: boolean;
  limits: {
    users: number;
    sessions: number;
    storage: string;
    support: string;
  };
}

const PricingPlans: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans: PricingPlan[] = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for small teams getting started with onboarding automation',
      price: billingCycle === 'monthly' ? 29 : 290,
      billingCycle,
      features: [
        'Up to 10 team members',
        '50 onboarding sessions/month',
        'Basic document templates',
        'Email support',
        'Standard analytics',
        'Basic integrations'
      ],
      limits: {
        users: 10,
        sessions: 50,
        storage: '5GB',
        support: 'Email'
      }
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Ideal for growing companies with advanced onboarding needs',
      price: billingCycle === 'monthly' ? 99 : 990,
      billingCycle,
      isPopular: true,
      features: [
        'Up to 50 team members',
        '200 onboarding sessions/month',
        'Advanced document templates',
        'Priority email & chat support',
        'Advanced analytics & reporting',
        'Custom integrations',
        'E-signature workflows',
        'Video recording & storage'
      ],
      limits: {
        users: 50,
        sessions: 200,
        storage: '25GB',
        support: 'Priority'
      }
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Complete solution for large organizations with complex workflows',
      price: billingCycle === 'monthly' ? 299 : 2990,
      billingCycle,
      isEnterprise: true,
      features: [
        'Unlimited team members',
        'Unlimited onboarding sessions',
        'Custom document templates',
        '24/7 phone & chat support',
        'Advanced analytics & AI insights',
        'Custom integrations & API access',
        'Advanced e-signature workflows',
        'Video recording & advanced storage',
        'Custom branding & white-labeling',
        'Dedicated account manager',
        'SLA guarantees',
        'Advanced security & compliance'
      ],
      limits: {
        users: -1, // Unlimited
        sessions: -1, // Unlimited
        storage: 'Unlimited',
        support: '24/7'
      }
    }
  ];

  const handlePlanSelect = (plan: PricingPlan) => {
    // Handle plan selection - could open contact form, redirect to signup, etc.
    console.log('Selected plan:', plan);
    if (plan.isEnterprise) {
      window.open('mailto:sales@onboardiq.com?subject=Enterprise Plan Inquiry', '_blank');
    } else {
      // Redirect to signup with plan pre-selected
      window.location.href = `/signup?plan=${plan.id}`;
    }
  };

  return (
    <div className="py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Choose the perfect plan for your onboarding needs. All plans include our core features.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Yearly
              <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-200">
                Save 20%
              </Badge>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative ${
                plan.isPopular 
                  ? 'border-2 border-blue-500 shadow-xl scale-105' 
                  : 'border border-gray-200'
              } hover:shadow-lg transition-all duration-300`}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-4 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              {plan.isEnterprise && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-600 text-white px-4 py-1">
                    <Crown className="h-3 w-3 mr-1" />
                    Enterprise
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </CardTitle>
                <p className="text-gray-600 text-sm">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Price */}
                <div className="text-center">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-500 ml-2">
                      /{billingCycle === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <p className="text-sm text-green-600 mt-1">
                      Save ${(plan.price * 12) - (plan.price * 10)} annually
                    </p>
                  )}
                </div>

                {/* Limits */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Team Members:</span>
                    <span className="font-medium">
                      {plan.limits.users === -1 ? 'Unlimited' : plan.limits.users}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Sessions/Month:</span>
                    <span className="font-medium">
                      {plan.limits.sessions === -1 ? 'Unlimited' : plan.limits.sessions}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Storage:</span>
                    <span className="font-medium">{plan.limits.storage}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Support:</span>
                    <span className="font-medium">{plan.limits.support}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">What's included:</h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <Button 
                  onClick={() => handlePlanSelect(plan)}
                  className={`w-full ${
                    plan.isPopular 
                      ? 'bg-blue-600 hover:bg-blue-700' 
                      : plan.isEnterprise
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  {plan.isEnterprise ? (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Sales
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Get Started
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              All Plans Include
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-center space-x-2">
                <Shield className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-600">Enterprise Security</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Users className="h-5 w-5 text-blue-500" />
                <span className="text-sm text-gray-600">Team Collaboration</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                <span className="text-sm text-gray-600">Analytics Dashboard</span>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            <p>Need a custom plan? <a href="mailto:sales@onboardiq.com" className="text-blue-600 hover:underline">Contact our sales team</a></p>
            <p>All plans include a 14-day free trial. No credit card required.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
