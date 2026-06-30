<script lang="ts">
	import type { PageData } from './$types';
	import { urlFor } from '$lib/sanity/client';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Collections — Vermont Bunk Beds</title>
	<meta name="description" content="Browse our handcrafted solid wood bunk bed collections. Built to order in Vermont with custom sizes and finishes." />
</svelte:head>

<div class="page-header">
	<div class="container">
		<p class="eyebrow">Handcrafted in Vermont</p>
		<h1>Our Collections</h1>
		<p class="subhead">Three distinct lines, one uncompromising standard of quality.</p>
	</div>
</div>

<section class="section">
	<div class="container">
		<div class="collections-grid">
			{#each data.collections as collection (collection._id)}
				<a href="/collections/{collection.slug.current}" class="collection-card">
					<div class="card-image">
						{#if collection.images?.[0]}
							<img
								src={urlFor(collection.images[0]).width(900).height(640).fit('crop').url()}
								alt={collection.name}
								loading="lazy"
							/>
						{/if}
					</div>
					<div class="card-body">
						<h2>{collection.name}</h2>
						{#if collection.description}
							<p>{collection.description}</p>
						{/if}
						<span class="card-cta">Shop This Collection →</span>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<style>
	.page-header {
		background: var(--color-charcoal);
		color: #fff;
		padding: 72px 0 56px;
		text-align: center;
	}

	.eyebrow {
		font-size: 0.8rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--color-tan);
		font-weight: 600;
		margin-bottom: 12px;
	}

	.page-header h1 { color: #fff; margin-bottom: 16px; }

	.subhead {
		color: rgba(255,255,255,0.65);
		font-size: 1.1rem;
		max-width: 480px;
		margin: 0 auto;
	}

	.collections-grid {
		display: flex;
		flex-direction: column;
		gap: 48px;
	}

	.collection-card {
		display: grid;
		grid-template-columns: 1fr 1fr;
		background: var(--color-warm-white);
		border-radius: var(--radius-lg);
		overflow: hidden;
		box-shadow: var(--shadow-md);
		transition: box-shadow 0.25s ease;
	}

	.collection-card:hover { box-shadow: var(--shadow-lg); }

	.collection-card:nth-child(even) { direction: rtl; }
	.collection-card:nth-child(even) > * { direction: ltr; }

	.card-image {
		aspect-ratio: unset;
		min-height: 360px;
		background: var(--color-tan-light);
		overflow: hidden;
	}

	.card-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.card-body {
		padding: 56px 48px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 16px;
	}

	.card-body h2 {
		font-size: clamp(1.6rem, 2.5vw, 2.25rem);
	}

	.card-body p {
		color: var(--color-muted);
		font-size: 1rem;
		line-height: 1.75;
		flex: 1;
	}

	.card-cta {
		display: inline-block;
		margin-top: 8px;
		padding: 14px 28px;
		background: var(--color-bark);
		color: #fff;
		border-radius: var(--radius-sm);
		font-size: 0.875rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		transition: background 0.2s;
		align-self: flex-start;
	}

	.card-cta:hover { background: var(--color-bark-light); }

	@media (max-width: 768px) {
		.collection-card,
		.collection-card:nth-child(even) { grid-template-columns: 1fr; direction: ltr; }
		.card-image { min-height: 260px; }
		.card-body { padding: 32px 24px; }
	}
</style>
