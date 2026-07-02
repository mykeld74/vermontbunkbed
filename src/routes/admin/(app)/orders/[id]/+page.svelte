<script lang="ts">
	import { enhance } from '$app/forms';
	import type { OrderLineItem } from '$lib/server/db/schema';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let status = $state(data.order.status);
	let trackingNumber = $state(data.order.trackingNumber ?? '');
	let saving = $state(false);

	function fmtDate(d: string | Date | null) {
		if (!d) return '—';
		return new Date(d).toLocaleString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: '2-digit'
		});
	}

	function fmtMoney(cents: number | null) {
		return ((cents ?? 0) / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
	}

	function fmtSize(item: OrderLineItem) {
		if (item.bottomSize) return `${item.bottomSize} bottom / ${item.topSize} top`;
		return item.topSize || null;
	}
</script>

<svelte:head>
	<title>Order {data.order.id} — Admin</title>
</svelte:head>

<a href="/admin" class="back-link">← All Orders</a>

<div class="order-header">
	<h1>Order Detail</h1>
	<span class="order-id">{data.order.id}</span>
</div>

<div class="order-grid">
	<div class="order-main">
		<section class="card">
			<h2>Items</h2>
			{#each data.order.lineItems ?? [] as item}
				<div class="line-item">
					<div class="line-item-top">
						<span class="item-name">{item.name ?? 'Item'}</span>
						<span class="item-amount">{fmtMoney(item.amountTotal * 100)}</span>
					</div>
					{#if fmtSize(item)}
						<div class="item-detail">Size: {fmtSize(item)}</div>
					{/if}
					{#if item.finishName}
						<div class="item-detail">Finish: {item.finishName}</div>
					{/if}
					{#if item.addonNames.length}
						<div class="item-detail">Add-ons: {item.addonNames.join(', ')}</div>
					{/if}
					<div class="item-qty">Qty: {item.quantity}</div>
				</div>
			{:else}
				<p class="muted">No line item detail available for this order.</p>
			{/each}
			<div class="order-total">
				<span>Total</span>
				<strong>{fmtMoney(data.order.amountTotal)}</strong>
			</div>
		</section>

		{#if data.order.shippingAddress}
			<section class="card">
				<h2>Shipping Address</h2>
				<p class="address">
					{data.order.customerName ?? ''}<br />
					{data.order.shippingAddress.line1}<br />
					{#if data.order.shippingAddress.line2}{data.order.shippingAddress.line2}<br />{/if}
					{data.order.shippingAddress.city ?? ''}, {data.order.shippingAddress.state ?? ''}
					{data.order.shippingAddress.postal_code ?? ''}<br />
					{data.order.shippingAddress.country}
				</p>
			</section>
		{/if}
	</div>

	<div class="order-side">
		<section class="card">
			<h2>Customer</h2>
			<div class="detail-row"><span>Name</span><strong>{data.order.customerName ?? '—'}</strong></div>
			<div class="detail-row"><span>Email</span><strong>{data.order.customerEmail ?? '—'}</strong></div>
			<div class="detail-row"><span>Order Date</span><strong>{fmtDate(data.order.createdAt)}</strong></div>
			<div class="detail-row"><span>Payment</span><strong>{data.order.stripeStatus}</strong></div>
		</section>

		<section class="card">
			<h2>Fulfillment</h2>
			<form
				method="post"
				action="?/updateStatus"
				use:enhance={() => {
					saving = true;
					return async ({ update }) => {
						saving = false;
						await update();
					};
				}}
			>
				<label>
					Status
					<select name="status" bind:value={status}>
						<option value="new">New</option>
						<option value="processing">Processing</option>
						<option value="shipped">Shipped</option>
						<option value="delivered">Delivered</option>
						<option value="cancelled">Cancelled</option>
					</select>
				</label>
				<label>
					Tracking Number
					<input type="text" name="trackingNumber" bind:value={trackingNumber} placeholder="Optional" />
				</label>
				{#if form?.message}
					<p class="error">{form.message}</p>
				{/if}
				<button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save Changes'}</button>
			</form>
		</section>
	</div>
</div>

<style>
	.back-link {
		display: inline-block;
		margin-bottom: 16px;
		color: #5c3d1e;
		font-weight: 600;
		font-size: 0.9rem;
		text-decoration: none;
	}
	.back-link:hover {
		text-decoration: underline;
	}
	.order-header {
		display: flex;
		align-items: baseline;
		gap: 12px;
		margin-bottom: 24px;
	}
	.order-header h1 {
		font-size: 1.5rem;
	}
	.order-id {
		font-size: 0.8rem;
		color: #7a7168;
		font-family: monospace;
	}
	.order-grid {
		display: grid;
		grid-template-columns: 1.6fr 1fr;
		gap: 24px;
	}
	.card {
		background: #fff;
		border-radius: 10px;
		padding: 24px;
		margin-bottom: 20px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
	}
	.card h2 {
		font-size: 1rem;
		margin-bottom: 16px;
	}
	.line-item {
		padding: 14px 0;
		border-bottom: 1px solid #f0ede8;
	}
	.line-item:last-of-type {
		border-bottom: none;
	}
	.line-item-top {
		display: flex;
		justify-content: space-between;
		font-weight: 600;
		color: #3d342c;
	}
	.item-detail {
		font-size: 0.85rem;
		color: #5c3d1e;
		margin-top: 4px;
	}
	.item-qty {
		font-size: 0.8rem;
		color: #7a7168;
		margin-top: 4px;
	}
	.order-total {
		display: flex;
		justify-content: space-between;
		padding-top: 14px;
		margin-top: 6px;
		border-top: 2px solid #eee;
		font-size: 1.05rem;
	}
	.muted {
		color: #7a7168;
		font-size: 0.9rem;
	}
	.address {
		font-size: 0.9rem;
		line-height: 1.6;
		color: #3d342c;
	}
	.detail-row {
		display: flex;
		justify-content: space-between;
		padding: 8px 0;
		border-bottom: 1px solid #f0ede8;
		font-size: 0.88rem;
	}
	.detail-row:last-child {
		border-bottom: none;
	}
	.detail-row span {
		color: #7a7168;
	}
	form {
		display: flex;
		flex-direction: column;
		gap: 14px;
	}
	label {
		display: flex;
		flex-direction: column;
		gap: 6px;
		font-size: 0.85rem;
		font-weight: 600;
		color: #3d342c;
	}
	select,
	input {
		padding: 9px 12px;
		border: 1px solid #d8d2c8;
		border-radius: 6px;
		font-size: 0.9rem;
		font-weight: 400;
	}
	button {
		background: #5c3d1e;
		color: #fff;
		border: none;
		border-radius: 6px;
		padding: 11px;
		font-weight: 600;
		cursor: pointer;
	}
	button:hover {
		background: #7a5230;
	}
	button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
	.error {
		color: #b3261e;
		font-size: 0.85rem;
		margin: 0;
	}
	@media (max-width: 800px) {
		.order-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
