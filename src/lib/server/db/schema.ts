import { pgTable, serial, integer, text, timestamp, jsonb, index } from 'drizzle-orm/pg-core';

export const task = pgTable('task', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	priority: integer('priority').notNull().default(1)
});

export interface OrderLineItem {
	name: string | null;
	description: string | null;
	quantity: number;
	amountTotal: number;
	collectionSlug: string;
	productTypeId: string;
	topSize: string;
	bottomSize: string;
	finishId: string;
	finishName: string;
	addonIds: string[];
	addonNames: string[];
}

export interface OrderShippingAddress {
	city?: string | null;
	country: string | null;
	line1: string | null;
	line2?: string | null;
	postal_code?: string | null;
	state?: string | null;
}

export const orders = pgTable(
	'orders',
	{
		id: text('id').primaryKey(), // Stripe checkout session ID
		createdAt: timestamp('created_at').defaultNow(),
		updatedAt: timestamp('updated_at').defaultNow(),
		customerEmail: text('customer_email'),
		customerName: text('customer_name'),
		amountTotal: integer('amount_total'), // cents
		lineItems: jsonb('line_items').$type<OrderLineItem[]>(), // structured cart snapshot: product, size, finish, add-ons
		shippingAddress: jsonb('shipping_address').$type<OrderShippingAddress>(),
		stripeStatus: text('stripe_status'), // Stripe payment_status
		status: text('status').notNull().default('new'), // new | processing | shipped | delivered | cancelled
		trackingNumber: text('tracking_number')
	},
	(table) => [index('orders_created_at_idx').on(table.createdAt.desc())]
);

export * from './auth.schema';
