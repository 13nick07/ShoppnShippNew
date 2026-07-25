'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      number: '01',
      title: 'Sign Up & Get Your Addresses',
      description: 'Create a free account and instantly receive virtual addresses in India. Now lets begin the Shopping.',
      details: [
        'Instant address activation',
        'Unique suite number for identification',
        'Multiple warehouse options available',
      ],
    },
    {
      number: '02',
      title: 'Shop from Any Store',
      description: 'Use your virtual addresses to shop from any Indian online store. Shop as if you were a local!',
      details: [
        'Works with all major retailers',
        'No restrictions on store selection',
        'Use local payment methods',
      ],
    },
    {
      number: '03',
      title: 'We Receive Your Packages',
      description: 'Your packages arrive at our secure warehouses. We notify you immediately and provide photos if requested.',
      details: [
        'Email notifications on arrival',
        'Secure warehouse storage',
        'Package photos available',
      ],
    },
    {
      number: '04',
      title: 'Consolidate & Save',
      description: 'Combine multiple packages into one shipment to save on international shipping costs.',
      details: [
        'Reduce shipping costs by up to 80%',
        'Free repackaging service',
        'Remove unwanted materials',
      ],
    },
    {
      number: '05',
      title: 'Ship Worldwide',
      description: 'Choose your preferred carrier and destination. We handle customs paperwork and deliver to your doorstep.',
      details: [
        'Multiple carrier options (DHL, FedEx, UPS, Aramex)',
        'Real-time tracking',
        'Customs clearance assistance',
      ],
    },
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">How The Parcelo Works</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Start shipping globally in 5 simple steps
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-12">
        {steps.map((step, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="bg-muted/30">
              <div className="flex items-start gap-6">
                <div className="text-6xl font-bold text-primary/20">
                  {step.number}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">{step.title}</CardTitle>
                  <CardDescription className="text-base">{step.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3">
                {step.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
