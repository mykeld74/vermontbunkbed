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

<a href="/admin" class="admin-back-link">← All Orders</a>

<div class="order-header">
	<h1>Order Detail</h1>
	<span class="order-id">{data.order.id}</span>
</div>

<div class="order-grid">
	<div class="order-main">
		<section class="admin-card admin-card-spaced">
			<h2>Items</h2>
			{#each data.order.lineItems ?? [] as item}
				<div class="line-item">
					<div class="line-item-top">
						<span>{item.name ?? 'Item'}</span>
						<span>{fmtMoney(item.amountTotal * 100)}</span>
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
				<p class="admin-muted">No line item detail available for this order.</p>
			{/each}
			<div class="order-total">
				<span>Total</span>
				<strong>{fmtMoney(data.order.amountTotal)}</strong>
			</div>
		</section>

		{#if data.order.shippingAddress}
			<section class="admin-card admin-card-spaced">
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
		<section class="admin-card admin-card-spaced">
			<h2>Customer</h2>
			<div class="detail-row">
				<span>Name</span><strong>{data.order.customerName ?? '—'}</strong>
			</div>
			<div class="detail-row">
				<span>Email</span><strong>{data.order.customerEmail ?? '—'}</strong>
			</div>
			<div class="detail-row">
				<span>Order Date</span><strong>{fmtDate(data.order.createdAt)}</strong>
			</div>
			<div class="detail-row"><span>Payment</span><strong>{data.order.stripeStatus}</strong></div>
		</section>

		<section class="admin-card admin-card-spaced">
			<h2>Fulfillment</h2>
			<form
				class="admin-form admin-form--compact"
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
					<select class="admin-field" name="status" bind:value={status}>
						<option value="new">New</option>
						<option value="processing">Processing</option>
						<option value="shipped">Shipped</option>
						<option value="delivered">Delivered</option>
						<option value="cancelled">Cancelled</option>
					</select>
				</label>
				<label>
					Tracking Number
					<input
						class="admin-field"
						type="text"
						name="trackingNumber"
						bind:value={trackingNumber}
						placeholder="Optional"
					/>
				</label>
				{#if form?.message}
					<p class="admin-message admin-message--error">{form.message}</p>
				{/if}
				<button class="admin-btn admin-btn--block" type="submit" disabled={saving}>
					{saving ? 'Saving…' : 'Save Changes'}
				</button>
			</form>
		</section>
	</div>
</div>
