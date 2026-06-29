<script lang="ts">
	import type { PageData } from './$types';
	import { cart } from '$lib/cart.svelte';
	import { onMount } from 'svelte';

	let { data }: { data: PageData } = $props();

	onMount(() => {
		if (data.order) cart.clear();
	});
</script>

<svelte:head>
	<title>Order Confirmed — Vermont Bunk Beds</title>
</svelte:head>

<div class="success-page">
	<div class="container success-container">
		{#if data.order}
			<div class="success-icon">✓</div>
			<h1>Order Confirmed!</h1>
			<p class="lead">Thank you! Your order has been received and payment confirmed.</p>

			<div class="order-details">
				<div class="detail-row">
					<span>Email</span>
					<strong>{data.order.email}</strong>
				</div>
				<div class="detail-row">
					<span>Order Total</span>
					<strong>${(data.order.total / 100).toLocaleString()}</strong>
				</div>
			</div>

			<div class="next-steps">
				<h2>What Happens Next</h2>
				<ol>
					<li>We'll review your order and reach out within 1–2 business days to confirm all the details.</li>
					<li>Your bed will be handcrafted to order — allow approximately 1–3 weeks for production.</li>
					<li>We'll coordinate delivery once your bed is ready to ship.</li>
				</ol>
			</div>

			<p class="contact-note">
				Questions? Reach us at <a href="/contact">our contact page</a> or reply to your order confirmation email.
			</p>
		{:else}
			<div class="success-icon">✓</div>
			<h1>Thank You!</h1>
			<p class="lead">Your order has been received. We'll be in touch soon to confirm the details.</p>
		{/if}

		<a href="/collections" class="btn btn-outline" style="margin-top: 32px;">Continue Shopping</a>
	</div>
</div>

<style>
	.success-page {
		background: var(--color-cream);
		min-height: 80vh;
		padding: var(--spacing-section) 0;
		display: flex;
		align-items: center;
	}

	.success-container {
		max-width: 600px;
		text-align: center;
	}

	.success-icon {
		width: 72px;
		height: 72px;
		background: var(--color-forest);
		color: #fff;
		border-radius: 50%;
		font-size: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto 32px;
		font-weight: bold;
	}

	h1 { margin-bottom: 16px; }

	.lead {
		font-size: 1.1rem;
		color: var(--color-muted);
		margin-bottom: 40px;
		line-height: 1.7;
	}

	.order-details {
		background: var(--color-warm-white);
		border: 1px solid var(--color-tan-light);
		border-radius: var(--radius-md);
		padding: 24px 32px;
		margin-bottom: 40px;
		text-align: left;
	}

	.detail-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		padding: 10px 0;
		border-bottom: 1px solid var(--color-tan-light);
		font-size: 0.95rem;
	}

	.detail-row:last-child { border-bottom: none; }
	.detail-row span { color: var(--color-muted); }
	.detail-row strong { color: var(--color-charcoal); }

	.next-steps {
		background: var(--color-warm-white);
		border: 1px solid var(--color-tan-light);
		border-radius: var(--radius-md);
		padding: 32px;
		margin-bottom: 32px;
		text-align: left;
	}

	.next-steps h2 { font-size: 1.1rem; margin-bottom: 16px; }

	.next-steps ol {
		padding-left: 20px;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.next-steps li {
		color: var(--color-body);
		font-size: 0.95rem;
		line-height: 1.6;
	}

	.contact-note {
		font-size: 0.9rem;
		color: var(--color-muted);
	}

	.contact-note a { color: var(--color-bark); }
</style>
