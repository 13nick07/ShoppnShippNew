'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Globe,
  Package,
  Truck,
  Shield,
  DollarSign,
  CheckCircle,
  ArrowRight,
  Clock,
} from 'lucide-react';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  const features = [
    {
      icon: Globe,
      title: 'Indian Address',
      description: 'Get a virtual address in India to receive your packages safely and conveniently.'
    },
    {
      icon: Package,
      title: 'Package Consolidation',
      description: 'Merge multiple packages into one shipment to save on shipping costs.'
    },
    {
      icon: Truck,
      title: 'Worldwide Shipping',
      description: 'Ship from India to anywhere in the world with DHL, FedEx, UPS, and Aramex.'
    },
    {
      icon: Shield,
      title: 'Secure Storage',
      description: 'Free storage for up to 30 days with package protection and insurance.'
    },
    {
      icon: DollarSign,
      title: 'Transparent Pricing',
      description: 'No hidden fees. Calculate shipping costs before you commit.'
    },
    {
      icon: Clock,
      title: 'Fast Delivery',
      description: 'Express shipping options available with 3-7 day delivery worldwide.'
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Get Virtual Address',
      description: 'Sign up and receive virtual addresses in India instantly.'
    },
    {
      number: '02',
      title: 'Shop Anywhere',
      description: 'Use your virtual address to shop from any Indian store.'
    },
    {
      number: '03',
      title: 'Consolidate',
      description: 'We receive your packages and can consolidate them into one shipment.'
    },
    {
      number: '04',
      title: 'Ship Worldwide',
      description: 'Choose your carrier and destination. We handle the rest.'
    },
  ];

  return (
    <div className="flex flex-col">

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center">

        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 z-0"
          style={{
            backgroundImage: "url('/images/logistics.png')",
          }}
        >
          {/* Multi-layer overlay for better text contrast */}
          {/* Base dark layer */}
          <div className="absolute inset-0 bg-black/55" />

          {/* Strong left-to-right cinematic gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />

          {/* Bottom fade to ensure lower text is readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="container relative z-10 mx-auto px-4 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <Badge className="mb-6 bg-white/15 border border-white/30 text-white backdrop-blur-sm hover:bg-white/25 px-4 py-1.5">
              🌍 Global Shipping Platform
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white drop-shadow-lg">
              Shop from{' '}
              {/*
                KEY FIX: Use a bright amber/orange accent instead of the dark primary color.
                - text-amber-400 is vivid on dark backgrounds
                - drop-shadow gives a subtle glow for extra legibility
                - italic adds visual distinction to emphasize the words
              */}
              <span
                className="italic text-amber-400"
                style={{ textShadow: '0 0 30px rgba(251,191,36,0.5), 0 2px 8px rgba(0,0,0,0.8)' }}
              >
                INDIA
              </span>
              .
              <br />
              Ship to{' '}
              <span
                className="italic text-amber-400"
                style={{ textShadow: '0 0 30px rgba(251,191,36,0.5), 0 2px 8px rgba(0,0,0,0.8)' }}
              >
                ANY
              </span>{' '}
              country.
            </h1>

            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed drop-shadow-md">
              Get a virtual address in India, consolidate your packages,
              and ship internationally with the world's leading carriers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="text-lg px-8 shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-shadow"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <Link href="/how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 bg-white/10 border-white/40 text-white hover:bg-white hover:text-black backdrop-blur-sm transition-all"
                >
                  How It Works
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-6 mt-10 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-amber-400" />
                No setup fees
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-amber-400" />
                Free storage
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-amber-400" />
                7+ countries
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Why Choose Shoppnshipp?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The only platform you need for global shopping and shipping
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div key={index} variants={fadeIn}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start shipping globally in 4 simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-6xl font-bold text-primary/10 mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
                {index < steps.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute top-12 -right-8 h-6 w-6 text-muted-foreground" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-primary text-primary-foreground rounded-2xl p-12 md:p-16 text-center"
          >
            <h2 className="text-4xl font-bold mb-4">
              Ready to Start Shipping Globally?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of customers who trust Shoppnshipp for their international shipping needs.
            </p>
            <Link href="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
