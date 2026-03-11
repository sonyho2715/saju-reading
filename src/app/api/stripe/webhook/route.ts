import { NextRequest, NextResponse } from 'next/server';
import { stripe, getCreditPacks } from '@/lib/stripe';
import { createServerClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('[stripe/webhook] STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[stripe/webhook] Verification failed:', message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createServerClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const type = session.metadata?.type;

        if (!userId) {
          console.error('[stripe/webhook] No userId in session metadata');
          break;
        }

        if (type === 'credits') {
          // Find which credit pack was purchased by matching the price
          const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
          const priceId = lineItems.data[0]?.price?.id;
          const pack = getCreditPacks().find((p) => p.stripePriceId === priceId);
          const credits = pack?.credits ?? 5;

          await supabase.from('credits').insert({
            user_id: userId,
            amount: credits,
            transaction_type: 'purchase',
            description: `Purchased ${credits} credits`,
            stripe_payment_id: session.payment_intent as string ?? session.id,
          });
        } else if (type === 'subscription') {
          // Determine which plan
          const subscriptionId = session.subscription as string;
          if (subscriptionId) {
            const subscription = await stripe.subscriptions.retrieve(subscriptionId);
            const priceId = subscription.items.data[0]?.price?.id;

            let tier = 'basic';
            if (priceId === process.env.STRIPE_PREMIUM_PRICE_ID) {
              tier = 'premium';
            }

            await supabase
              .from('users')
              .update({ subscription_tier: tier })
              .eq('id', userId);
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;

        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (user) {
          const priceId = subscription.items.data[0]?.price?.id;
          let tier = 'free';
          if (priceId === process.env.STRIPE_BASIC_PRICE_ID) tier = 'basic';
          if (priceId === process.env.STRIPE_PREMIUM_PRICE_ID) tier = 'premium';

          if (subscription.status === 'active') {
            await supabase
              .from('users')
              .update({ subscription_tier: tier })
              .eq('id', user.id);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;

        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (user) {
          await supabase
            .from('users')
            .update({ subscription_tier: 'free' })
            .eq('id', user.id);
        }
        break;
      }

      default:
        // Unhandled event type
        break;
    }
  } catch (err) {
    console.error(`[stripe/webhook] Error handling ${event.type}:`, err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
