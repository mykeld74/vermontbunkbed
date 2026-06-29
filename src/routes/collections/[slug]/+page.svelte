<script lang="ts">
	import type { PageData } from './$types';
	import { urlFor } from '$lib/sanity/client';

	let { data }: { data: PageData } = $props();

	const mainProducts = $derived(
		data.collection.productPrices.filter((p) => !p.productType.isAddon)
	);
	const addons = $derived(
		data.collection.productPrices.filter((p) => p.productType.isAddon)
	);
</script>

<svelte:head>
	<title>{data.collection.name} — Vermont Bunk Beds</title>
</svelte:head>

<!-- Hero -->
<div class="collection-hero">
	{#if data.collection.images?.[0]}
		<img
			src={urlFor(data.collection.images[0]).width(1400).height(560).fit('crop').url()}
			alt={data.collection.name}
			class="hero-img"
		/>
	{/if}
	<div class="hero-overlay"></div>
	<div class="hero-content container">
		<a href="/collections" class="back-link">← All Collections</a>
		<h1>{data.collection.name}</h1>
		{#if data.collection.description}
			<p class="hero-sub">{data.collection.description}</p>
		{/if}
	</div>
</div>

<!-- Products -->
<section class="section">
	<div class="container">
		<div class="section-title">
			<h2>Choose Your Bed</h2>
			<div class="divider"></div>
		</div>

		<div class="product-grid">
			{#each mainProducts as product (product.productType._id)}
				<a
					href="/collections/{data.collection.slug.current}/configure?product={product.productType._id}"
					class="product-card"
				>
					<div class="product-badge">From ${product.basePrice.toLocaleString()}</div>
					<div class="product-body">
						<h3>{product.productType.displayName}</h3>
						<p>{product.productType.description}</p>
					</div>
					<div class="product-footer">
						<span class="configure-btn">Configure & Order →</span>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- Add-ons -->
{#if addons.length > 0}
	<section class="section-sm addon-section">
		<div class="container">
			<h2 class="addon-heading">Available Add-Ons</h2>
			<p class="addon-sub">Selected during bed configuration.</p>
			<div class="addon-grid">
				{#each addons as addon (addon.productType._id)}
					<div class="addon-card">
						<div class="addon-price">${addon.basePrice.toLocaleString()}</div>
						<h3>{addon.productType.displayName}</h3>
						<p>{addon.productType.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>
{/if}

<style>
	/* Hero */
	.collection-hero {
		position: relative;
		height: 480px;
		display: flex;
		align-items: flex-end;
		overflow: hidden;
		background: var(--color-charcoal);
	}

	.hero-img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.hero-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(to top, rgba(44,36,32,0.85) 0%, rgba(44,36,32,0.2) 60%);
	}

	.hero-content {
		position: relative;
		z-index: 1;
		padding-bottom: 48px;
		color: #fff;
	}

	.back-link {
		display: inline-block;
		font-size: 0.8rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-tan);
		margin-bottom: 16px;
		transition: color 0.2s;
	}
	.back-link:hover { color: #fff; }

	.hero-content h1 { color: #fff; margin-bottom: 12px; }

	.hero-sub {
		color: rgba(255,255,255,0.75);
		font-size: 1.1rem;
		max-width: 520px;
	}

	/* Product grid */
	.product-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 28px;
	}

	.product-card {
		background: var(--color-warm-white);
		border: 1px solid var(--color-tan-light);
		border-radius: var(--radius-md);
		padding: 32px;
		display: flex;
		flex-direction: column;
		gap: 16px;
		position: relative;
		transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
	}

	.product-card:hover {
		box-shadow: var(--shadow-md);
		transform: translateY(-2px);
		border-color: var(--color-tan);
	}

	.product-badge {
		display: inline-block;
		align-self: flex-start;
		background: var(--color-bark);
		color: #fff;
		padding: 4px 12px;
		border-radius: 20px;
		font-size: 0.8rem;
		font-weight: 600;
	}

	.product-body { flex: 1; }
	.product-body h3 { margin-bottom: 10px; color: var(--color-charcoal); }
	.product-body p { color: var(--color-muted); font-size: 0.9rem; line-height: 1.7; }

	.configure-btn {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--color-bark);
		letter-spacing: 0.03em;
	}

	/* Add-ons */
	.addon-section {
		background: var(--color-charcoal);
		color: rgba(255,255,255,0.85);
	}

	.addon-heading { color: #fff; margin-bottom: 8px; }
	.addon-sub { color: rgba(255,255,255,0.5); margin-bottom: 32px; font-size: 0.9rem; }

	.addon-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 24px;
	}

	.addon-card {
		background: rgba(255,255,255,0.06);
		border: 1px solid rgba(255,255,255,0.1);
		border-radius: var(--radius-md);
		padding: 28px;
	}

	.addon-price {
		font-size: 1.4rem;
		font-family: var(--font-heading);
		color: var(--color-tan);
		margin-bottom: 8px;
	}

	.addon-card h3 { color: #fff; margin-bottom: 8px; font-size: 1rem; }
	.addon-card p { color: rgba(255,255,255,0.55); font-size: 0.875rem; line-height: 1.6; }

	@media (max-width: 900px) {
		.product-grid { grid-template-columns: repeat(2, 1fr); }
		.collection-hero { height: 380px; }
	}

	@media (max-width: 600px) {
		.product-grid { grid-template-columns: 1fr; }
		.collection-hero { height: 320px; }
	}
</style>
