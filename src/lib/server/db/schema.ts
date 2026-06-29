import { pgTable, serial, integer, text, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const task = pgTable('task', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	priority: integer('priority').notNull().default(1)
});

export const orders = pgTable('orders', {
	id: text('id').primaryKey(), // Stripe checkout session ID
	createdAt: timestamp('created_at').defaultNow(),
	customerEmail: text('customer_email'),
	amountTotal: integer('amount_total'), // cents
	lineItems: jsonb('line_items'), // cart items snapshot
	stripeStatus: text('stripe_status')
});

// export * from './auth.schema'; // uncomment after running pnpm auth:schema
