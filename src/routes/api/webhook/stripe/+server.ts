import Stripe from 'stripe';
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import { db } from '$lib/server/db';
import { orders } from '$lib/server/db/schema';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const stripe = new Stripe(STRIPE_SECRET_KEY);

function lineItemProduct(item: Stripe.LineItem) {
	const product = item.price?.product;
	if (!product || typeof product === 'string' || ('deleted' in product && product.deleted)) {
		return null;
	}
	return product as Stripe.Product;
}

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
		const sessionSummary = event.data.object as Stripe.Checkout.Session;

		// Re-fetch with expansions — the webhook payload alone doesn't include
		// per-item product metadata (size, finish, add-ons).
		const session = await stripe.checkout.sessions.retrieve(sessionSummary.id, {
			expand: ['line_items', 'line_items.data.price.product']
		});

		const lineItems = (session.line_items?.data ?? []).map((item) => {
			const product = lineItemProduct(item);
			const meta = product?.metadata ?? {};
			return {
				name: product?.name ?? null,
				description: item.description,
				quantity: item.quantity ?? 0,
				amountTotal: item.amount_total ? item.amount_total / 100 : 0,
				collectionSlug: meta.collectionSlug ?? '',
				productTypeId: meta.productTypeId ?? '',
				topSize: meta.topSize ?? '',
				bottomSize: meta.bottomSize ?? '',
				finishId: meta.finishId ?? '',
				finishName: meta.finishName ?? '',
				addonIds: meta.addonIds ? meta.addonIds.split(',').filter(Boolean) : [],
				addonNames: meta.addonNames ? meta.addonNames.split(', ').filter(Boolean) : []
			};
		});

		const shipping = session.collected_information?.shipping_details;

		// onConflictDoNothing: Stripe retries webhook delivery on failure, and this
		// event may already have been recorded — never overwrite an admin's status edit.
		await db
			.insert(orders)
			.values({
				id: session.id,
				customerEmail: session.customer_details?.email ?? null,
				customerName: session.customer_details?.name ?? shipping?.name ?? null,
				amountTotal: session.amount_total ?? 0,
				lineItems,
				shippingAddress: shipping?.address ?? null,
				stripeStatus: session.payment_status,
				status: 'new'
			})
			.onConflictDoNothing();
	}

	return json({ received: true });
};
