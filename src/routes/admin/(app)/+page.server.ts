import { db } from '$lib/server/db';
import { orders } from '$lib/server/db/schema';
import { desc, eq } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const allOrders = await db
		.select({
			id: orders.id,
			createdAt: orders.createdAt,
			customerEmail: orders.customerEmail,
			customerName: orders.customerName,
			amountTotal: orders.amountTotal,
			status: orders.status,
			stripeStatus: orders.stripeStatus
		})
		.from(orders)
		.orderBy(desc(orders.createdAt));

	return { orders: allOrders };
};

export const actions: Actions = {
	updateStatus: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();
		const status = formData.get('status')?.toString() ?? '';

		const allowed = ['new', 'processing', 'shipped', 'delivered', 'cancelled'];
		if (!id || !allowed.includes(status)) {
			return fail(400, { message: 'Invalid request.' });
		}

		await db.update(orders).set({ status, updatedAt: new Date() }).where(eq(orders.id, id));

		return { success: true };
	}
};
