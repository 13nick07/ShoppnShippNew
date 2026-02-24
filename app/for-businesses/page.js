'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Building, Users, TrendingUp, Globe, ArrowRight } from 'lucide-react';

export default function ForBusinessesPage() {
  const benefits = [
    {
      icon: Globe,
      title: 'Global Expansion',
      description: 'Expand your business internationally without physical presence',
    },
    {
      icon: TrendingUp,
      title: 'Reduce Costs',
      description: 'Save up to 70% on international shipping and logistics',
    },
    {
      icon: Users,
      title: 'Dedicated Support',
      description: '24/7 account manager and priority customer service',
    },
    {
      icon: Building,
      title: 'API Integration',
      description: 'Connect directly to our platform with enterprise API access',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">Shoppnshipp for Businesses</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Enterprise solutions for companies shipping globally
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <Card key={index}>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{benefit.description}</CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="bg-primary text-primary-foreground rounded-2xl p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Scale Your Business?</h2>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Contact our enterprise team to discuss custom solutions for your business
        </p>
        <Link href="/register">
          <Button size="lg" variant="secondary">
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
