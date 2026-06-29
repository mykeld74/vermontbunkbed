import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '$env/static/private';
import { json, error } from '@sveltejs/kit';
import type { CartItem } from '$lib/cart.svelte';
import type { RequestHandler } from './$types';

const stripe = new Stripe(STRIPE_SECRET_KEY);

export const POST: RequestHandler = async ({ request, url }) => {
	const { items } = (await request.json()) as { items: CartItem[] };

	if (!items?.length) error(400, 'Cart is empty');

	const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => {
		const description = [
			`Size: ${item.topSize}${item.bottomSize ? ` / ${item.bottomSize} (bottom)` : ''}`,
			`Finish: ${item.finishName}`,
			...(item.addonNames.length ? [`Add-ons: ${item.addonNames.join(', ')}`] : [])
		].join(' | ');

		return {
			quantity: item.quantity,
			price_data: {
				currency: 'usd',
				unit_amount: Math.round(item.unitPrice * 100),
				product_data: {
					name: `${item.collectionName} ${item.productTypeName}`,
					description,
					metadata: {
						collectionSlug: item.collectionSlug,
						productTypeId: item.productTypeId,
						topSize: item.topSize,
						bottomSize: item.bottomSize ?? '',
						finishId: item.finishId,
						addonIds: item.addonIds.join(',')
					}
				}
			}
		};
	});

	const session = await stripe.checkout.sessions.create({
		mode: 'payment',
		line_items: lineItems,
		shipping_address_collection: { allowed_countries: ['US', 'CA'] },
		shipping_options: [
			{
				shipping_rate_data: {
					type: 'fixed_amount',
					fixed_amount: { amount: 75000, currency: 'usd' },
					display_name: 'Delivery',
					delivery_estimate: {
						minimum: { unit: 'week', value: 1 },
						maximum: { unit: 'week', value: 3 }
					}
				}
			},
			{
				shipping_rate_data: {
					type: 'fixed_amount',
					fixed_amount: { amount: 0, currency: 'usd' },
					display_name: 'Local Pickup — Starksboro, VT',
					delivery_estimate: {
						minimum: { unit: 'week', value: 1 },
						maximum: { unit: 'week', value: 3 }
					}
				}
			}
		],
		success_url: `${url.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${url.origin}/cart`
	});

	return json({ url: session.url });
};
