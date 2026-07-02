import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';
import type { PageServerLoad } from './$types';

const stripe = new Stripe(STRIPE_SECRET_KEY);

export const load: PageServerLoad = async ({ url }) => {
	const sessionId = url.searchParams.get('session_id');
	if (!sessionId) return { order: null };

	const session = await stripe.checkout.sessions.retrieve(sessionId, {
		expand: ['line_items']
	});

	const lineItems = (session.line_items?.data ?? []).map((item) => ({
		id: item.id,
		description: item.description,
		quantity: item.quantity ?? 0,
		amountTotal: item.amount_total ? item.amount_total / 100 : 0
	}));

	return {
		order: {
			id: session.id,
			email: session.customer_details?.email,
			total: session.amount_total ? session.amount_total / 100 : 0,
			lineItems
		}
	};
};
