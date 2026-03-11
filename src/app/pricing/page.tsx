'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

const PLANS = [
  {
    name: 'Free',
    price: 0,
    interval: '',
    description: 'Get started with basic chart analysis',
    features: [
      '1 quick reading per day',
      'Basic Four Pillars chart',
      'Element balance overview',
      'Special stars display',
    ],
    notIncluded: [
      'Full personality reading',
      'Career & wealth analysis',
      'Compatibility check',
      'PDF export',
    ],
    cta: 'Get Started',
    href: '/reading',
    popular: false,
  },
  {
    name: 'Basic',
    price: 9.99,
    interval: '/month',
    description: 'For regular Saju enthusiasts',
    features: [
      '3 full readings per month',
      '1 compatibility reading',
      '1 annual forecast',
      'Chart export (PNG)',
      'All chart analysis features',
      'Priority support',
    ],
    notIncluded: [
      'Unlimited readings',
      'Baby name generator',
      'Lucky date calculator',
    ],
    cta: 'Subscribe',
    href: '#',
    popular: false,
    priceId: 'basic',
  },
  {
    name: 'Premium',
    price: 24.99,
    interval: '/month',
    description: 'Unlimited access to all features',
    features: [
      'Unlimited readings',
      'Unlimited compatibility checks',
      'PDF export',
      'Baby name generator',
      'Lucky date calculator',
      'Daily energy insights',
      'Monthly forecasts',
      'Priority support',
    ],
    notIncluded: [],
    cta: 'Subscribe',
    href: '#',
    popular: true,
    priceId: 'premium',
  },
];

const CREDIT_PACKS = [
  { credits: 5, price: 4.99 },
  { credits: 15, price: 9.99 },
  { credits: 50, price: 24.99 },
];

const FAQ = [
  {
    q: 'What is Saju (Four Pillars of Destiny)?',
    a: 'Saju is the Korean tradition of reading destiny through the Four Pillars derived from your birth year, month, day, and hour. Each pillar consists of a Heavenly Stem and Earthly Branch based on the sexagenary cycle.',
  },
  {
    q: 'How accurate are AI-generated readings?',
    a: 'Our AI is trained on traditional Saju principles and generates readings based on your actual chart calculations. The chart calculation is mathematically precise. The interpretive readings provide meaningful insights based on established Saju knowledge.',
  },
  {
    q: 'How is Saju different from Western astrology?',
    a: 'Western astrology uses planetary positions and zodiac signs. Saju uses the Chinese sexagenary cycle, Five Elements (Wood, Fire, Earth, Metal, Water), and Yin-Yang theory. Saju focuses on destiny patterns rather than daily horoscopes.',
  },
  {
    q: 'What if I do not know my birth time?',
    a: 'You can still get a reading based on three pillars (Year, Month, Day). The Hour Pillar will be omitted. While a complete reading requires all four pillars, three-pillar readings still provide valuable insights.',
  },
  {
    q: 'Can I cancel my subscription?',
    a: 'Yes, you can cancel anytime from your dashboard. Your subscription remains active until the end of the billing period. Unused credits do not expire.',
  },
  {
    q: 'What languages are supported?',
    a: 'We support English, Korean, and Vietnamese. Your readings will be generated in your preferred language. Chart labels show Korean Hanja characters alongside translations.',
  },
];

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const handleSubscribe = async (planName: string) => {
    setLoading(planName);
    // In production, this would check auth and create a Stripe checkout session.
    // For now, redirect to login if not authenticated.
    window.location.href = '/auth/login';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3">Simple, Transparent Pricing</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Start free, upgrade when you need more. All plans include accurate chart calculations.
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${plan.popular ? 'border-primary shadow-lg shadow-primary/10' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                </div>
              )}
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <span className="text-4xl font-bold">
                    {plan.price === 0 ? 'Free' : `$${plan.price}`}
                  </span>
                  {plan.interval && (
                    <span className="text-muted-foreground">{plan.interval}</span>
                  )}
                </div>

                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                  {plan.notIncluded.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground line-through">
                      <span className="h-4 w-4 mt-0.5 flex-shrink-0 text-center">-</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {plan.price === 0 ? (
                  <Link href={plan.href}>
                    <Button variant="outline" className="w-full">{plan.cta}</Button>
                  </Link>
                ) : (
                  <Button
                    className="w-full"
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => handleSubscribe(plan.name)}
                    disabled={loading === plan.name}
                  >
                    {loading === plan.name ? 'Redirecting...' : plan.cta}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Credit packs */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-6">Credit Packs</h2>
          <p className="text-center text-muted-foreground mb-8">
            Pay as you go. Credits never expire.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {CREDIT_PACKS.map((pack) => (
              <Card key={pack.credits} className="text-center">
                <CardContent className="pt-6 space-y-3">
                  <div className="text-3xl font-bold">{pack.credits}</div>
                  <p className="text-sm text-muted-foreground">credits</p>
                  <div className="text-xl font-semibold">${pack.price}</div>
                  <p className="text-xs text-muted-foreground">
                    ${(pack.price / pack.credits).toFixed(2)} per credit
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Buy
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((item, idx) => (
              <div key={idx} className="border rounded-lg">
                <button
                  type="button"
                  className="w-full text-left px-4 py-3 font-medium text-sm hover:bg-muted/50 transition-colors"
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                >
                  {item.q}
                </button>
                {expandedFaq === idx && (
                  <div className="px-4 pb-4 text-sm text-muted-foreground">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
