import Stripe from 'stripe';
import { STRIPE_SECRET_KEY, SANITY_WRITE_TOKEN } from '$env/static/private';
import { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET } from '$env/static/public';
import { json, error } from '@sveltejs/kit';
import { createClient } from '@sanity/client';
import { priceCartItems } from '$lib/server/pricing';
import { getSiteSettings } from '$lib/sanity/queries';
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
	const { items, discountCode, discountId } = (await request.json()) as {
		items: CartItem[];
		discountCode?: string;
		discountId?: string;
	};

	if (!items?.length) error(400, 'Cart is empty');

	// Recompute prices server-side — never trust client-supplied unitPrice.
	let pricedItems;
	try {
		pricedItems = await priceCartItems(items);
	} catch {
		error(400, 'One or more items are invalid.');
	}

	const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = pricedItems.map((item) => {
		const description = [
			item.bottomSize ? `Size: ${item.bottomSize} bottom / ${item.topSize} top` : `Size: ${item.topSize}`,
			`Finish: ${item.finishName}`,
			...(item.addonNames.length ? [`Add-ons: ${item.addonNames.join(', ')}`] : [])
		].join(' | ');

		return {
			quantity: item.quantity,
			price_data: {
				currency: 'usd',
				unit_amount: Math.round(item.serverUnitPrice * 100),
				product_data: {
					name: `${item.collectionName} ${item.productTypeName}`,
					description,
					metadata: {
						collectionSlug: item.collectionSlug,
						productTypeId: item.productTypeId,
						topSize: item.topSize,
						bottomSize: item.bottomSize ?? '',
						finishId: item.finishId,
						finishName: item.finishName,
						addonIds: item.addonIds.join(','),
						addonNames: item.addonNames.join(', ')
					}
				}
			}
		};
	});

	// Determine the discount to apply (code or sale — never both), always
	// validated server-side. The client cannot influence the amount.
	let discounts: Stripe.Checkout.SessionCreateParams['discounts'];

	if (discountCode && discountId) {
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
			const type = discount.discountType === 'amount' ? 'amount' : 'percent';
			const coupon = await stripe.coupons.create({
				...(type === 'amount'
					? { amount_off: Math.round((discount.amountOff ?? 0) * 100), currency: 'usd' }
					: { percent_off: discount.percentOff ?? 0 }),
				duration: 'once',
				name: discountCode.toUpperCase()
			});
			discounts = [{ coupon: coupon.id }];

			await writeClient
				.patch(discountId)
				.setIfMissing({ usedCount: 0 })
				.inc({ usedCount: 1 })
				.commit();
		}
	} else {
		// No code — apply the global sale from Sanity if one is active.
		const settings = await getSiteSettings();
		const salePercent = settings?.globalSalePercent ?? 0;
		if (salePercent > 0) {
			const coupon = await getOrCreateSaleCoupon(salePercent);
			discounts = [{ coupon: coupon.id }];
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

/**
 * Reuses a single stable coupon per sale percentage instead of creating a new
 * one on every checkout. Coupon IDs are deterministic (`sale-<percent>`).
 */
async function getOrCreateSaleCoupon(percent: number): Promise<Stripe.Coupon> {
	const id = `sale-${percent}`;
	try {
		return await stripe.coupons.retrieve(id);
	} catch {
		return await stripe.coupons.create({
			id,
			percent_off: percent,
			duration: 'once',
			name: `Sale ${percent}% Off`
		});
	}
}
