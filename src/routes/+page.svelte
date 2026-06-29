<script lang="ts">
	import type { PageData } from './$types';
	import { urlFor } from '$lib/sanity/client';
	import heroBg from '$lib/assets/Homepagebunkbed.jpg';
	import craftImg from '$lib/assets/jaypeakcover.jpg';
	import kidsImg from '$lib/assets/Home-page-crop.jpg';
	import horsesImg from '$lib/assets/farmhorses.jpg';
	import sugarhouseImg from '$lib/assets/sugarhouse.jpg';

	let { data }: { data: PageData } = $props();
</script>

<!-- Announcement banner -->
{#if data.settings?.announcementBanner}
	<div class="banner">
		<div class="container">
			{#if data.settings.globalSaleLabel}<strong>{data.settings.globalSaleLabel}:</strong>{/if}
			{data.settings.announcementBanner}
		</div>
	</div>
{/if}

<!-- Hero -->
<section class="hero">
	<div class="hero-content container">
		<p class="hero-eyebrow">Handcrafted in Starksboro, Vermont</p>
		<h1>Built to Last.<br />Built for Family.</h1>
		<p class="hero-sub">
			Solid wood bunk beds made on our small family farm — crafted with care, designed to grow with
			your family for generations.
		</p>
		<div class="hero-actions">
			<a href="/collections" class="btn btn-primary">Shop Collections</a>
			<a href="/about" class="btn btn-ghost">Our Story</a>
		</div>
	</div>
	<div class="hero-overlay" style="background-image: url({heroBg})"></div>
</section>

<!-- Trust bar -->
<section class="trust-bar">
	<div class="container trust-grid">
		{#each [{ icon: '🌲', title: 'All Natural Materials', desc: 'Solid hardwood, no particle board or MDF' }, { icon: '🔨', title: 'Built to Order', desc: 'Every bed is made to your specifications' }, { icon: '🛡️', title: 'Ultimate Safety', desc: 'Engineered for safety, built to exceed standards' }, { icon: '🏡', title: 'Family Owned', desc: 'Made on our Vermont farm since 2006' }] as item}
			<div class="trust-item">
				<span class="trust-icon">{item.icon}</span>
				<h3>{item.title}</h3>
				<p>{item.desc}</p>
			</div>
		{/each}
	</div>
</section>

<!-- Collections -->
<section class="section collections-section">
	<div class="container">
		<div class="section-title">
			<h2>Our Collections</h2>
			<div class="divider"></div>
			<p>
				Three distinct lines of handcrafted bunk beds — each built with the same uncompromising
				quality.
			</p>
		</div>

		<div class="collections-grid">
			{#each data.collections as collection (collection._id)}
				<a href="/collections/{collection.slug.current}" class="collection-card">
					{#if collection.images?.[0]}
						<div class="card-image">
							<img
								src={urlFor(collection.images[0]).width(800).height(600).fit('crop').url()}
								alt={collection.name}
								loading="lazy"
							/>
						</div>
					{:else}
						<div class="card-image card-image-placeholder"></div>
					{/if}
					<div class="card-body">
						<h3>{collection.name}</h3>
						{#if collection.description}
							<p>{collection.description}</p>
						{/if}
						<span class="card-cta">View Collection →</span>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- Craft section -->
<section class="craft-section">
	<div class="container craft-inner">
		<div class="craft-text">
			<p class="eyebrow">The Vermont Difference</p>
			<h2>Made the Old-Fashioned Way</h2>
			<div class="divider" style="margin: 16px 0 24px;"></div>
			<p>
				Every bed that leaves our farm is cut, shaped, sanded, and finished by hand. We use only
				solid hardwoods — no shortcuts, no particle board, no compromises.
			</p>
			<p>
				Our mortise and tenon joinery has been used by craftsmen for centuries because it works.
				Your grandchildren will still be sleeping in these beds.
			</p>
			<a href="/about" class="btn btn-outline" style="margin-top: 32px;">Meet the Family</a>
		</div>
		<div class="craft-image">
			<img src={craftImg} alt="Handcrafted natural wood bunk bed" />
		</div>
	</div>
</section>

<!-- Lifestyle / kids section -->
<section class="lifestyle-section">
	<div class="lifestyle-grid">
		<div class="lifestyle-img-wrap">
			<img src={kidsImg} alt="Children enjoying their Vermont bunk beds" />
		</div>
		<div class="lifestyle-text">
			<p class="eyebrow">Made for Families</p>
			<h2>Where Memories Are Made</h2>
			<div class="divider" style="margin: 16px 0 24px;"></div>
			<p>
				Kids don't just sleep in these beds — they play in them, read in them, tell secrets from the
				top bunk. We build them strong enough to handle all of it.
			</p>
			<p>
				Every joint is glued and pegged. Every board is solid hardwood. No wobbling, no squeaking,
				no calling it quits after a few years.
			</p>
		</div>
	</div>
</section>

<!-- Finishes teaser -->
<section class="section finishes-section">
	<div class="container">
		<div class="section-title">
			<h2>Every Finish, Your Choice</h2>
			<div class="divider"></div>
			<p>
				Choose from natural coatings, 22 hand-selected Benjamin Moore paint colors, or water stains
				— all No-VOC and safe for your family.
			</p>
		</div>
		<div class="finishes-cta">
			<a href="/finishes" class="btn btn-outline">Browse Finish Options</a>
		</div>
	</div>
</section>

<style>
	/* Banner */
	.banner {
		background: var(--color-forest);
		color: #fff;
		text-align: center;
		padding: 10px 24px;
		font-size: 0.9rem;
	}

	/* Hero */
	.hero {
		position: relative;
		min-height: 88vh;
		display: flex;
		align-items: center;
		background: linear-gradient(135deg, #2c2420 0%, #3d2e1e 50%, #3d5a3e 100%);
		overflow: hidden;
	}

	.hero-overlay {
		position: absolute;
		inset: 0;
		background-size: cover;
		background-position: center 30%;
		opacity: 0.45;
	}

	.hero-content {
		position: relative;
		z-index: 1;
		color: #fff;
		padding-top: 80px;
		padding-bottom: 80px;
		max-width: 680px;
	}

	.hero-eyebrow,
	.eyebrow {
		font-size: 0.85rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--color-tan);
		margin-bottom: 16px;
		font-weight: 600;
	}

	.hero h1 {
		color: #fff;
		margin-bottom: 24px;
	}

	.hero-sub {
		font-size: 1.15rem;
		color: rgba(255, 255, 255, 0.8);
		max-width: 520px;
		margin-bottom: 40px;
		line-height: 1.7;
	}

	.hero-actions {
		display: flex;
		gap: 16px;
		flex-wrap: wrap;
	}

	/* Trust bar */
	.trust-bar {
		background: var(--color-warm-white);
		border-bottom: 1px solid var(--color-tan-light);
		padding: 40px 0;
	}

	.trust-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 32px;
	}

	.trust-item {
		text-align: center;
	}

	.trust-icon {
		font-size: 2rem;
		display: block;
		margin-bottom: 12px;
	}

	.trust-item h3 {
		font-size: 0.95rem;
		margin-bottom: 6px;
		color: var(--color-charcoal);
	}

	.trust-item p {
		font-size: 0.85rem;
		color: var(--color-muted);
		line-height: 1.5;
	}

	/* Collections */
	.collections-section {
		background: var(--color-cream);
	}

	.collections-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 32px;
	}

	.collection-card {
		background: var(--color-warm-white);
		border-radius: var(--radius-md);
		overflow: hidden;
		box-shadow: var(--shadow-sm);
		transition:
			transform 0.25s ease,
			box-shadow 0.25s ease;
		display: flex;
		flex-direction: column;
	}

	.collection-card:hover {
		transform: translateY(-4px);
		box-shadow: var(--shadow-lg);
	}

	.card-image {
		aspect-ratio: 4/3;
		overflow: hidden;
		background: var(--color-tan-light);
	}

	.card-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.card-image-placeholder {
		background: linear-gradient(135deg, var(--color-tan-light), var(--color-cream));
	}

	.card-body {
		padding: 28px;
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.card-body h3 {
		color: var(--color-charcoal);
	}

	.card-body p {
		color: var(--color-muted);
		font-size: 0.9rem;
		flex: 1;
		line-height: 1.6;
	}

	.card-cta {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-bark);
		letter-spacing: 0.03em;
		margin-top: 8px;
	}

	/* Craft section */
	.craft-section {
		background: var(--color-charcoal);
		color: rgba(255, 255, 255, 0.85);
		padding: var(--spacing-section) 0;
	}

	.craft-inner {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 80px;
		align-items: center;
	}

	.craft-text .eyebrow {
		color: var(--color-tan);
	}
	.craft-text h2 {
		color: #fff;
		margin-bottom: 8px;
	}
	.craft-text .divider {
		background: var(--color-tan);
		margin: 0;
	}

	.craft-text p {
		line-height: 1.8;
		margin-bottom: 16px;
		color: rgba(255, 255, 255, 0.75);
	}

	.craft-image {
		border-radius: var(--radius-md);
		overflow: hidden;
		aspect-ratio: 4/3;
		background: rgba(255, 255, 255, 0.05);
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.craft-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.craft-image-fallback {
		font-size: 5rem;
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* Lifestyle */
	.lifestyle-section {
		background: var(--color-cream);
		overflow: hidden;
	}

	.lifestyle-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: auto auto;
	}

	.lifestyle-img-wrap {
		overflow: hidden;
		aspect-ratio: 4/3;
	}

	.lifestyle-img-wrap img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.lifestyle-img-tall {
		aspect-ratio: unset;
	}

	.lifestyle-text {
		padding: 64px 56px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		background: var(--color-warm-white);
	}

	.lifestyle-text h2 {
		margin-bottom: 8px;
	}

	.lifestyle-text p {
		color: var(--color-muted);
		line-height: 1.8;
		margin-bottom: 16px;
		font-size: 1rem;
	}

	/* Finishes */
	.finishes-section {
		background: var(--color-warm-white);
	}
	.finishes-cta {
		text-align: center;
		margin-top: 8px;
	}

	/* Responsive */
	@media (max-width: 1024px) {
		.collections-grid {
			grid-template-columns: repeat(2, 1fr);
		}
		.trust-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 768px) {
		.collections-grid {
			grid-template-columns: 1fr;
		}
		.trust-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 24px;
		}
		.craft-inner {
			grid-template-columns: 1fr;
			gap: 40px;
		}
		.hero-content {
			padding-top: 60px;
			padding-bottom: 60px;
		}
		.lifestyle-grid {
			grid-template-columns: 1fr;
		}
		.lifestyle-text {
			padding: 40px 24px;
		}
		.lifestyle-img-tall {
			aspect-ratio: 4/3;
		}
	}

	@media (max-width: 480px) {
		.trust-grid {
			grid-template-columns: 1fr;
		}
		.hero-actions {
			flex-direction: column;
		}
		.hero-actions .btn {
			text-align: center;
		}
	}
</style>
