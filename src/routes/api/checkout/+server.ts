import Stripe from 'stripe';
import { STRIPE_SECRET_KEY, SANITY_WRITE_TOKEN } from '$env/static/private';
import { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET } from '$env/static/public';
import { json, error } from '@sveltejs/kit';
import { createClient } from '@sanity/client';
import type { CartItem } from '$lib/cart.svelte';
import type { RequestHandler } from './$types';

const stripe = new Stripe(STRIPE_SECRET_KEY);

const writeClient = createClient({
	projectId: PUBLIC_SANITY_PROJECT_ID,
	dataset: PUBLIC_SANITY_DATASET,
	apiVersion: '2024-01-01',
	token: SANITY_WRITE_TOKEN,
	useCdn: false
});

export const POST: RequestHandler = async ({ request, url }) => {
	const { items, discountCode, discountId, discountType, discountPercent, discountAmountOff, salePercent } = (await request.json()) as {
		items: CartItem[];
		discountCode?: string;
		discountId?: string;
		discountType?: 'percent' | 'amount';
		discountPercent?: number;
		discountAmountOff?: number;
		salePercent?: number;
	};

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

	// Create a Stripe coupon for whichever discount applies (code or sale — never both)
	let discounts: Stripe.Checkout.SessionCreateParams['discounts'];

	if (salePercent && salePercent > 0 && !discountCode) {
		// Global sale wins — apply it as a Stripe coupon
		const coupon = await stripe.coupons.create({
			percent_off: salePercent,
			duration: 'once',
			name: `Sale ${salePercent}% Off`
		});
		discounts = [{ coupon: coupon.id }];
	} else if (discountCode && discountId) {
		// Re-validate the code server-side before applying
		const discount = await writeClient.fetch(
			`*[_type == "discount" && _id == $id && code == $code && active == true][0] {
				_id, discountType, percentOff, amountOff, expiresAt, maxUses, usedCount
			}`,
			{ id: discountId, code: discountCode.toUpperCase() }
		);

		if (
			discount &&
			(!discount.expiresAt || new Date(discount.expiresAt) >= new Date()) &&
			(discount.maxUses == null || (discount.usedCount ?? 0) < discount.maxUses)
		) {
			const type = discount.discountType ?? discountType ?? 'percent';
			const coupon = await stripe.coupons.create({
				...(type === 'amount'
					? { amount_off: Math.round((discount.amountOff ?? discountAmountOff ?? 0) * 100), currency: 'usd' }
					: { percent_off: discount.percentOff ?? discountPercent }),
				duration: 'once',
				name: discountCode.toUpperCase()
			});
			discounts = [{ coupon: coupon.id }];

			// Increment usedCount in Sanity
			await writeClient
				.patch(discountId)
				.setIfMissing({ usedCount: 0 })
				.inc({ usedCount: 1 })
				.commit();
		}
	}

	const session = await stripe.checkout.sessions.create({
		mode: 'payment',
		line_items: lineItems,
		...(discounts ? { discounts } : {}),
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
