<script lang="ts">
	import { cart } from '$lib/cart.svelte';

	let loading = $state(false);
	let errorMsg = $state('');

	async function checkout() {
		loading = true;
		errorMsg = '';
		try {
			const res = await fetch('/api/checkout', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ items: cart.items })
			});
			if (!res.ok) throw new Error('Checkout failed');
			const { url } = await res.json();
			window.location.href = url;
		} catch {
			errorMsg = 'Something went wrong. Please try again.';
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Cart — Vermont Bunk Beds</title>
</svelte:head>

<div class="page-header">
	<div class="container">
		<h1>Your Cart</h1>
	</div>
</div>

<div class="cart-layout container">
	{#if cart.items.length === 0}
		<div class="empty-state">
			<div class="empty-icon">🛒</div>
			<h2>Your cart is empty</h2>
			<p>Browse our collections to find the perfect bunk bed.</p>
			<a href="/collections" class="btn btn-primary">Shop Collections</a>
		</div>
	{:else}
		<div class="cart-items">
			{#each cart.items as item (item.id)}
				<div class="cart-item">
					<div class="item-info">
						<p class="item-collection">{item.collectionName}</p>
						<h3 class="item-name">{item.productTypeName}</h3>
						<div class="item-details">
							<span>
								Size: {item.topSize.charAt(0).toUpperCase() + item.topSize.slice(1)}{#if item.bottomSize && item.bottomSize !== item.topSize} top / {item.bottomSize.charAt(0).toUpperCase() + item.bottomSize.slice(1)} bottom{/if}
							</span>
							<span>Finish: {item.finishName}</span>
							{#if item.addonNames.length > 0}
								<span>Add-ons: {item.addonNames.join(', ')}</span>
							{/if}
						</div>
					</div>
					<div class="item-actions">
						<span class="item-price">${item.unitPrice.toLocaleString()}</span>
						<button class="remove-btn" onclick={() => cart.remove(item.id)} aria-label="Remove item">
							✕ Remove
						</button>
					</div>
				</div>
			{/each}
		</div>

		<aside class="cart-summary">
			<div class="summary-card">
				<h3>Order Summary</h3>

				<div class="summary-lines">
					{#each cart.items as item (item.id)}
						<div class="summary-line">
							<span>{item.productTypeName}</span>
							<span>${item.unitPrice.toLocaleString()}</span>
						</div>
					{/each}
				</div>

				<div class="summary-total">
					<span>Subtotal</span>
					<strong>${cart.total.toLocaleString()}</strong>
				</div>

				<p class="shipping-note">Shipping & tax calculated at checkout.</p>

				{#if errorMsg}
					<p class="error-msg">{errorMsg}</p>
				{/if}

				<button class="btn btn-primary checkout-btn" onclick={checkout} disabled={loading}>
					{loading ? 'Redirecting…' : 'Proceed to Checkout'}
				</button>

				<a href="/collections" class="continue-link">← Continue Shopping</a>
			</div>

			<div class="trust-note">
				<p>🔒 Secure checkout via Stripe</p>
				<p>Built to order — allow 1–3 weeks</p>
				<p>Questions? <a href="/contact">Contact us</a></p>
			</div>
		</aside>
	{/if}
</div>

<style>
	.page-header {
		background: var(--color-charcoal);
		color: #fff;
		padding: 56px 0 40px;
	}
	.page-header h1 { color: #fff; }

	.cart-layout {
		display: grid;
		grid-template-columns: 1fr 360px;
		gap: 48px;
		align-items: start;
		padding-top: 48px;
		padding-bottom: 80px;
	}

	.empty-state {
		grid-column: 1 / -1;
		text-align: center;
		padding: 80px 40px;
	}
	.empty-icon { font-size: 4rem; margin-bottom: 24px; }
	.empty-state h2 { margin-bottom: 12px; }
	.empty-state p { color: var(--color-muted); margin-bottom: 32px; }

	/* Items */
	.cart-item {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 24px;
		background: var(--color-warm-white);
		border: 1px solid var(--color-tan-light);
		border-radius: var(--radius-md);
		padding: 28px;
		margin-bottom: 12px;
	}

	.item-collection {
		font-size: 0.75rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-muted);
		margin-bottom: 4px;
	}

	.item-name { font-size: 1.1rem; color: var(--color-charcoal); margin-bottom: 10px; }

	.item-details { display: flex; flex-direction: column; gap: 4px; }
	.item-details span { font-size: 0.875rem; color: var(--color-muted); }

	.item-actions { display: flex; flex-direction: column; align-items: flex-end; gap: 16px; flex-shrink: 0; }

	.item-price { font-family: var(--font-heading); font-size: 1.4rem; color: var(--color-charcoal); font-weight: bold; }

	.remove-btn {
		background: none;
		border: none;
		font-size: 0.8rem;
		color: var(--color-muted);
		cursor: pointer;
		transition: color 0.2s;
	}
	.remove-btn:hover { color: #c0392b; }

	/* Summary */
	.cart-summary { position: sticky; top: 90px; }

	.summary-card {
		background: var(--color-warm-white);
		border: 1px solid var(--color-tan-light);
		border-radius: var(--radius-md);
		padding: 28px;
		margin-bottom: 16px;
	}

	.summary-card h3 { font-size: 1.1rem; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--color-tan-light); }

	.summary-lines { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }

	.summary-line { display: flex; justify-content: space-between; font-size: 0.875rem; color: var(--color-body); }

	.summary-total {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		padding: 16px 0;
		border-top: 1px solid var(--color-tan-light);
		border-bottom: 1px solid var(--color-tan-light);
		margin-bottom: 16px;
	}
	.summary-total span { font-size: 0.85rem; color: var(--color-muted); text-transform: uppercase; letter-spacing: 0.05em; }
	.summary-total strong { font-family: var(--font-heading); font-size: 1.6rem; color: var(--color-charcoal); }

	.shipping-note { font-size: 0.8rem; color: var(--color-muted); margin-bottom: 20px; text-align: center; }

	.error-msg {
		font-size: 0.875rem;
		color: #c0392b;
		background: #fef0ee;
		border: 1px solid #fbd5cf;
		border-radius: var(--radius-sm);
		padding: 10px 14px;
		margin-bottom: 14px;
	}

	.checkout-btn { width: 100%; text-align: center; padding: 16px; margin-bottom: 14px; }
	.checkout-btn:disabled { opacity: 0.6; cursor: not-allowed; }

	.continue-link { display: block; text-align: center; font-size: 0.85rem; color: var(--color-bark); transition: color 0.2s; }
	.continue-link:hover { color: var(--color-bark-light); }

	.trust-note {
		background: var(--color-cream);
		border-radius: var(--radius-md);
		padding: 20px;
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.trust-note p { font-size: 0.85rem; color: var(--color-muted); }
	.trust-note a { color: var(--color-bark); }

	@media (max-width: 900px) {
		.cart-layout { grid-template-columns: 1fr; }
		.cart-summary { position: static; }
	}
</style>
