import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { stripe, getPlans, getCreditPacks } from '@/lib/stripe';
import { db } from '@/lib/prisma';

const inputSchema = z.object({
  priceId: z.string().min(1, 'priceId is required'),
  type: z.enum(['subscription', 'credits']),
  userId: z.string().min(1, 'userId is required'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = inputSchema.parse(body);

    // Get or create Stripe customer
    const user = await db.user.findUnique({
      where: { id: input.userId },
      select: { id: true, email: true, stripeCustomerId: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id },
      });
      customerId = customer.id;

      await db.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    // Validate priceId matches our plans or credit packs
    const plans = getPlans();
    const creditPacks = getCreditPacks();
    const isSubscription = input.type === 'subscription';
    if (isSubscription) {
      const validPriceIds = [plans.basic.stripePriceId, plans.premium.stripePriceId];
      if (!validPriceIds.includes(input.priceId)) {
        return NextResponse.json(
          { success: false, error: 'Invalid price ID for subscription' },
          { status: 400 }
        );
      }
    } else {
      const validPriceIds = creditPacks.map((p) => p.stripePriceId);
      if (!validPriceIds.includes(input.priceId)) {
        return NextResponse.json(
          { success: false, error: 'Invalid price ID for credits' },
          { status: 400 }
        );
      }
    }

    const origin = req.headers.get('origin') ?? 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: isSubscription ? 'subscription' : 'payment',
      line_items: [
        {
          price: input.priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/dashboard?checkout=success`,
      cancel_url: `${origin}/pricing?checkout=cancelled`,
      metadata: {
        userId: input.userId,
        type: input.type,
      },
    });

    return NextResponse.json({ success: true, url: session.url });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    console.error('[stripe/checkout] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
