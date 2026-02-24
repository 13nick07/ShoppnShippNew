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
  MapPin,
  DollarSign,
  CheckCircle,
  ArrowRight,
  Box,
  Boxes,
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
      title: 'Global Addresses',
      description: 'Get virtual addresses in 7+ countries including USA, UK, UAE, and more.'
    },
    {
      icon: Package,
      title: 'Package Consolidation',
      description: 'Merge multiple packages into one shipment to save on shipping costs.'
    },
    {
      icon: Truck,
      title: 'Worldwide Shipping',
      description: 'Ship from anywhere to anywhere with DHL, FedEx, UPS, and Aramex.'
    },
    {
      icon: Shield,
      title: 'Secure Storage',
      description: 'Free storage for up to 90 days with package protection and insurance.'
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
      description: 'Sign up and receive virtual addresses in multiple countries instantly.'
    },
    {
      number: '02',
      title: 'Shop Anywhere',
      description: 'Use your virtual address to shop from any international store.'
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

  const countries = [
    { name: 'United States', flag: '🇺🇸', code: 'USA' },
    { name: 'United Kingdom', flag: '🇬🇧', code: 'UK' },
    { name: 'India', flag: '🇮🇳', code: 'IND' },
    { name: 'UAE', flag: '🇦🇪', code: 'UAE' },
    { name: 'China', flag: '🇨🇳', code: 'CHN' },
    { name: 'Germany', flag: '🇩🇪', code: 'GER' },
    { name: 'Japan', flag: '🇯🇵', code: 'JPN' },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1583857671904-a716bf4ee5d8?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aW50ZXJuYXRpb25hbCUyMHNoaXBwaW5nfGVufDB8fDB8fHww)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/80" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <Badge className="mb-4" variant="secondary">
              🌍 Global Shipping Platform
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Shop from <span className="text-primary">ANY</span> country.
              <br />
              Ship to <span className="text-primary">EVERY</span> country.
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              Get virtual addresses worldwide, consolidate your packages, and ship internationally with the world's leading carriers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button size="lg" className="text-lg px-8">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  How It Works
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                No setup fees
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Free storage
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
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
            <h2 className="text-4xl font-bold mb-4">Why Choose Shoppnshipp?</h2>
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

      {/* Countries Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Ship From & To 7+ Countries</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get virtual addresses in multiple countries and ship anywhere in the world
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {countries.map((country, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="text-5xl mb-3">{country.flag}</div>
                    <p className="font-semibold text-sm">{country.code}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/countries">
              <Button variant="outline" size="lg">
                View All Countries
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
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
            <h2 className="text-4xl font-bold mb-4">Ready to Start Shipping Globally?</h2>
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
