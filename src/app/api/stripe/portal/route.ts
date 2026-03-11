import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { stripe } from '@/lib/stripe';
import { createServerClient } from '@/lib/supabase';

const inputSchema = z.object({
  userId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = inputSchema.parse(body);

    const supabase = createServerClient();
    const { data: user } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', input.userId)
      .single();

    if (!user?.stripe_customer_id) {
      return NextResponse.json(
        { success: false, error: 'No billing account found. Subscribe first.' },
        { status: 404 }
      );
    }

    const origin = req.headers.get('origin') ?? 'http://localhost:3000';

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${origin}/dashboard`,
    });

    return NextResponse.json({ success: true, url: session.url });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    console.error('[stripe/portal] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create portal session' },
      { status: 500 }
    );
  }
}
