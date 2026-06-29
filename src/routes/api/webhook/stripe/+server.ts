import Stripe from 'stripe';
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import { db } from '$lib/server/db';
import { orders } from '$lib/server/db/schema';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const stripe = new Stripe(STRIPE_SECRET_KEY);

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.text();
	const sig = request.headers.get('stripe-signature');

	if (!sig) error(400, 'Missing stripe-signature header');

	let event: Stripe.Event;
	try {
		event = stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET);
	} catch {
		error(400, 'Invalid webhook signature');
	}

	if (event.type === 'checkout.session.completed') {
		const session = event.data.object as Stripe.Checkout.Session;
		await db.insert(orders).values({
			id: session.id,
			customerEmail: session.customer_details?.email ?? null,
			amountTotal: session.amount_total ?? 0,
			lineItems: session.metadata ?? {},
			stripeStatus: session.payment_status
		});
	}

	return json({ received: true });
};
