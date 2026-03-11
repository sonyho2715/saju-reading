import Stripe from 'stripe';

let _stripe: Stripe | null = null;

/**
 * Lazy-initialized Stripe client. Prevents build-time crashes
 * when STRIPE_SECRET_KEY is not in the build environment.
 */
export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
    _stripe = new Stripe(key, {
      apiVersion: '2025-01-27.acacia' as Stripe.LatestApiVersion,
    });
  }
  return _stripe;
}

/**
 * Proxy that lazily delegates to getStripe().
 * Use `stripe.xyz` as a convenience; the client is created on first access.
 */
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return Reflect.get(getStripe(), prop);
  },
});

export interface PlanInfo {
  name: string;
  price: number;
  currency: string;
  interval: string;
  stripePriceId: string;
  features: string[];
}

export function getPlans(): Record<'basic' | 'premium', PlanInfo> {
  return {
    basic: {
      name: 'Basic',
      price: 9.99,
      currency: 'usd',
      interval: 'month',
      stripePriceId: process.env.STRIPE_BASIC_PRICE_ID ?? '',
      features: [
        '3 full readings/month',
        '1 compatibility reading',
        '1 annual forecast',
        'Chart export',
      ],
    },
    premium: {
      name: 'Premium',
      price: 24.99,
      currency: 'usd',
      interval: 'month',
      stripePriceId: process.env.STRIPE_PREMIUM_PRICE_ID ?? '',
      features: [
        'Unlimited readings',
        'Unlimited compatibility',
        'PDF export',
        'Baby name generator',
        'Lucky date calculator',
        'Daily energy',
      ],
    },
  };
}

export const PLANS = getPlans;

export interface CreditPack {
  credits: number;
  price: number;
  stripePriceId: string;
}

export function getCreditPacks(): CreditPack[] {
  return [
    { credits: 5, price: 4.99, stripePriceId: process.env.STRIPE_CREDITS_5_PRICE_ID ?? '' },
    { credits: 15, price: 9.99, stripePriceId: process.env.STRIPE_CREDITS_15_PRICE_ID ?? '' },
    { credits: 50, price: 24.99, stripePriceId: process.env.STRIPE_CREDITS_50_PRICE_ID ?? '' },
  ];
}

export const CREDIT_PACKS = getCreditPacks;
