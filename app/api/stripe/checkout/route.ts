import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { stripe } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  if (!process.env.STRIPE_SECRET_KEY) {
    return Response.json({ error: 'Missing STRIPE_SECRET_KEY' }, { status: 400 });
  }

  const { priceId } = (await request.json()) as { priceId: string };

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${request.nextUrl.origin}/builder?upgraded=true`,
    cancel_url: `${request.nextUrl.origin}/#pricing`,
    metadata: { userId }
  });

  return Response.json({ url: session.url });
}
