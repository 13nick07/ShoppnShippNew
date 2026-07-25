'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  Clock3,
  Globe2,
  MapPin,
  Plane,
  ShieldCheck,
  Sparkles,
  Truck,
} from 'lucide-react';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45 },
};

const features = [
  {
    icon: MapPin,
    title: 'An address that opens India',
    description: 'Get your personal Indian delivery address in minutes, ready for the stores you already love.',
  },
  {
    icon: Boxes,
    title: 'Smarter parcels, lower costs',
    description: 'Keep packages safe, combine them when it helps, and pay for one efficient international shipment.',
  },
  {
    icon: Plane,
    title: 'The world, within reach',
    description: 'Choose a delivery option that suits your destination and follow your order from warehouse to doorstep.',
  },
];

const steps = [
  ['01', 'Create your Parcelo', 'Sign up free and receive your dedicated Indian address.'],
  ['02', 'Shop your favourites', 'Use the address at Indian stores and send every order to us.'],
  ['03', 'Make it your shipment', 'Choose consolidation, storage, and shipping options from one place.'],
  ['04', 'Receive it anywhere', 'Track delivery to your doorstep with trusted carrier options.'],
];

export default function Home() {
  return (
    <div className="overflow-hidden">
      <section className="relative isolate overflow-hidden bg-slate-950 text-white">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center opacity-45"
          style={{ backgroundImage: "url('/images/Logistics.png')" }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-900/65" />
        <div className="absolute -right-20 top-20 -z-10 h-72 w-72 rounded-full bg-amber-400/15 blur-3xl" />

        <div className="container mx-auto grid min-h-[calc(100vh-4rem)] items-center gap-12 px-4 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:py-24">
          <motion.div initial="initial" animate="animate" variants={fadeIn} className="max-w-3xl">
            <Badge className="mb-6 border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-amber-100 hover:bg-amber-300/10">
              <Sparkles className="mr-2 h-3.5 w-3.5" /> The Parcelo · India to the world
            </Badge>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">Your global shopping partner</p>
            <h1 className="text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              Shop India. <span className="text-amber-300">Ship anywhere.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-200 md:text-xl">
              The Parcelo gives you a trusted Indian address, simple parcel management, and a clear path from checkout to your door.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="w-full bg-amber-300 px-7 text-base font-semibold text-slate-950 hover:bg-amber-200 sm:w-auto">
                  Get your Indian address <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="outline" className="w-full border-white/30 bg-white/5 px-7 text-base text-white hover:bg-white hover:text-slate-950 sm:w-auto">
                  See how The Parcelo works
                </Button>
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-200">
              {['Free address setup', '30 days of free storage', 'Clear shipment choices'].map((item) => (
                <span key={item} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-amber-300" />{item}</span>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15, duration: 0.5 }} className="hidden lg:block">
            <div className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-white/15 pb-5">
                <div><p className="text-sm text-slate-300">Your delivery journey</p><p className="text-lg font-semibold">Powered by The Parcelo</p></div>
                <Globe2 className="h-9 w-9 text-amber-300" />
              </div>
              <div className="space-y-5 py-6">
                {[
                  [MapPin, 'Your Indian address', 'Ready for checkout'],
                  [Boxes, 'Packages received', 'Managed in one dashboard'],
                  [Truck, 'Shipment on its way', 'Tracked to your destination'],
                ].map(([Icon, title, description]) => (
                  <div key={title} className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-300/15"><Icon className="h-5 w-5 text-amber-300" /></div>
                    <div><p className="font-medium">{title}</p><p className="text-sm text-slate-300">{description}</p></div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl bg-amber-300 px-4 py-3 text-sm font-semibold text-slate-950">One address. One dashboard. A world of possibilities.</div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-b bg-white py-7">
        <div className="container mx-auto flex flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 text-sm font-medium text-slate-600">
          <span className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> Secure package handling</span>
          <span className="flex items-center gap-2"><Clock3 className="h-5 w-5 text-primary" /> Flexible storage and consolidation</span>
          <span className="flex items-center gap-2"><Globe2 className="h-5 w-5 text-primary" /> International delivery options</span>
        </div>
      </section>

      <section className="bg-slate-50 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <motion.div initial="initial" whileInView="animate" viewport={{ once: true }} variants={fadeIn} className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Designed around you</p>
            <h2 className="text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">Everything you need from <span className="text-primary">The Parcelo</span></h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">Less uncertainty, fewer moving parts, and a more pleasant way to shop beyond borders.</p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div key={feature.title} initial="initial" whileInView="animate" viewport={{ once: true }} transition={{ delay: index * 0.08 }} variants={fadeIn} className="rounded-2xl border bg-white p-7 shadow-sm transition-shadow hover:shadow-lg">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10"><Icon className="h-6 w-6 text-primary" /></div>
                  <h3 className="text-xl font-semibold text-slate-950">{feature.title}</h3>
                  <p className="mt-3 leading-7 text-muted-foreground">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Simple by design</p>
              <h2 className="text-4xl font-bold tracking-tight md:text-5xl">From Indian checkout to your doorstep.</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">The Parcelo keeps every step clear, so you always know what happens next.</p>
              <Link href="/how-it-works" className="mt-7 inline-block"><Button variant="outline">Explore the process <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {steps.map(([number, title, description]) => (
                <div key={number} className="rounded-2xl border p-6">
                  <span className="text-sm font-bold tracking-widest text-primary">{number}</span>
                  <h3 className="mt-5 text-xl font-semibold">{title}</h3>
                  <p className="mt-2 leading-7 text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="rounded-3xl bg-slate-950 px-6 py-14 text-center text-white md:px-14 md:py-20">
            <Badge className="border border-amber-300/30 bg-amber-300/10 text-amber-100 hover:bg-amber-300/10">Your next parcel starts here</Badge>
            <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">Make <span className="text-amber-300">The Parcelo</span> your address in India.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">Create your free account and start shopping with a simpler international delivery experience.</p>
            <Link href="/register" className="mt-8 inline-block"><Button size="lg" className="bg-amber-300 px-8 text-base font-semibold text-slate-950 hover:bg-amber-200">Create your free account <ArrowRight className="ml-2 h-5 w-5" /></Button></Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
