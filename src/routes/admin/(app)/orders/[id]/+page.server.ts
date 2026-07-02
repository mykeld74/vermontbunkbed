import { db } from '$lib/server/db';
import { orders } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const [order] = await db.select().from(orders).where(eq(orders.id, params.id));
	if (!order) error(404, 'Order not found');
	return { order };
};

export const actions: Actions = {
	updateStatus: async ({ request, params }) => {
		const formData = await request.formData();
		const status = formData.get('status')?.toString() ?? 'new';
		const trackingNumber = formData.get('trackingNumber')?.toString() || null;

		const allowed = ['new', 'processing', 'shipped', 'delivered', 'cancelled'];
		if (!allowed.includes(status)) {
			return fail(400, { message: 'Invalid status.' });
		}

		await db
			.update(orders)
			.set({ status, trackingNumber, updatedAt: new Date() })
			.where(eq(orders.id, params.id));

		return redirect(303, `/admin/orders/${params.id}`);
	}
};
