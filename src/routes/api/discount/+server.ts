import { json, error } from '@sveltejs/kit';
import { sanityClient } from '$lib/sanity/client';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { code } = (await request.json()) as { code: string };
	if (!code?.trim()) error(400, 'No code provided');

	const normalized = code.trim().toUpperCase();

	const discount = await sanityClient.fetch(
		`*[_type == "discount" && code == $code && active == true][0] {
			_id, code, label, percentOff, expiresAt, maxUses, usedCount
		}`,
		{ code: normalized }
	);

	if (!discount) {
		return json({ valid: false, message: 'Invalid or inactive discount code.' });
	}

	// Check expiration
	if (discount.expiresAt && new Date(discount.expiresAt) < new Date()) {
		return json({ valid: false, message: 'This discount code has expired.' });
	}

	// Check usage cap
	if (discount.maxUses != null && (discount.usedCount ?? 0) >= discount.maxUses) {
		return json({ valid: false, message: 'This discount code has reached its usage limit.' });
	}

	return json({
		valid: true,
		discountId: discount._id,
		code: discount.code,
		label: discount.label,
		percentOff: discount.percentOff
	});
};
