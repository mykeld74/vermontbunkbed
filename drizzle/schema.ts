import { pgTable, text, timestamp, integer, jsonb, serial } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const orders = pgTable("orders", {
	id: text().primaryKey().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	customerEmail: text("customer_email"),
	amountTotal: integer("amount_total"),
	lineItems: jsonb("line_items"),
	stripeStatus: text("stripe_status"),
});

export const task = pgTable("task", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	priority: integer().default(1).notNull(),
});
