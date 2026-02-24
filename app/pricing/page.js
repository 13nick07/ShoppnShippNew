'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: 0,
      period: 'forever',
      features: [
        '1 virtual address',
        '30 days free storage',
        'Standard support',
        'Email notifications',
      ],
    },
    {
      name: 'Basic',
      price: 9.99,
      period: 'month',
      popular: false,
      features: [
        '3 virtual addresses',
        '60 days free storage',
        'Priority support',
        '1 free consolidation/month',
        'Package photos',
      ],
    },
    {
      name: 'Pro',
      price: 29.99,
      period: 'month',
      popular: true,
      features: [
        '7 virtual addresses',
        '90 days free storage',
        '24/7 support',
        'Unlimited consolidations',
        'Package photos',
        'Repackaging service',
        'Priority processing',
      ],
    },
    {
      name: 'Business',
      price: 99.99,
      period: 'month',
      popular: false,
      features: [
        'Unlimited addresses',
        '180 days free storage',
        'Dedicated support',
        'Unlimited consolidations',
        'API access',
        'Bulk shipping discounts',
        'Custom integrations',
        'Account manager',
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that works best for you. No hidden fees, cancel anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {plans.map((plan, index) => (
          <Card key={index} className={plan.popular ? 'border-primary shadow-lg scale-105' : ''}>
            <CardHeader>
              {plan.popular && (
                <Badge className="w-fit mb-2">Most Popular</Badge>
              )}
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>
                <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                <span className="text-muted-foreground">/{plan.period}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h3 className="text-2xl font-bold mb-4">All Plans Include</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="flex items-center gap-2 justify-center">
            <CheckCircle className="h-5 w-5 text-primary" />
            <span>Package tracking</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <CheckCircle className="h-5 w-5 text-primary" />
            <span>Global shipping</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <CheckCircle className="h-5 w-5 text-primary" />
            <span>Secure storage</span>
          </div>
        </div>
      </div>
    </div>
  );
}
