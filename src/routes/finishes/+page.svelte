<script lang="ts">
	import type { PageData } from './$types';
	import type { Finish } from '$lib/sanity/types';
	import { urlFor } from '$lib/sanity/client';
	import coatingsImg from '$lib/assets/coatings.jpg';

	// Natura (milk paint) individual swatches
	import naturaReverentGray from '$lib/assets/natura/reverent-gray.png';
	import naturaMillstone from '$lib/assets/natura/millstone.png';
	import naturaDarkChocolate from '$lib/assets/natura/dark-chocolate.png';
	import naturaSeagullGray from '$lib/assets/natura/seagull-gray.png';
	import naturaLampBlack from '$lib/assets/natura/lamp-black.png';
	import naturaPersianBlue from '$lib/assets/natura/persian-blue.png';
	import naturaGulfStreamBlue from '$lib/assets/natura/gulf-stream-blue.png';
	import naturaKeyWestBlue from '$lib/assets/natura/key-west-blue.png';
	import naturaCoastalBlue from '$lib/assets/natura/coastal-blue.png';
	import naturaTwilight from '$lib/assets/natura/twilight.png';
	import naturaBalletPink from '$lib/assets/natura/ballet-pink.png';
	import naturaCoralCrush from '$lib/assets/natura/coral-crush.png';
	import naturaEmerald from '$lib/assets/natura/emerald.png';
	import naturaWestminsterGreen from '$lib/assets/natura/westminster-green.png';
	import naturaHarvestYellow from '$lib/assets/natura/harvest-yellow.png';
	import naturaSunglow from '$lib/assets/natura/sunglow.png';
	import naturaSnowWhite from '$lib/assets/natura/snow-white.png';
	import naturaAlabaster from '$lib/assets/natura/alabaster.png';
	import naturaAntiqueWhite from '$lib/assets/natura/antique-white.png';
	import naturaLinen from '$lib/assets/natura/linen.png';
	import naturaEmpireGray from '$lib/assets/natura/empire-gray.png';
	import naturaPerfectGray from '$lib/assets/natura/perfect-gray.png';
	import naturaDriftwood from '$lib/assets/natura/driftwood.png';
	import naturaQueenstownGray from '$lib/assets/natura/queenstown-gray.png';
	import naturaHalcyonBlue from '$lib/assets/natura/halcyon-blue.png';
	import naturaBlueMoon from '$lib/assets/natura/blue-moon.png';
	import naturaKleinBlue from '$lib/assets/natura/klein-blue.png';
	import naturaChinaBlue from '$lib/assets/natura/china-blue.png';
	import naturaHolidayRed from '$lib/assets/natura/holiday-red.png';
	import naturaTuscanRed from '$lib/assets/natura/tuscan-red.png';
	import naturaPatina from '$lib/assets/natura/patina-green.png';
	import naturaBasil from '$lib/assets/natura/basil.png';
	import naturaPersimmon from '$lib/assets/natura/persimmon.png';

	interface NaturaSwatch { name: string; img: string }

	const NATURA_SWATCHES: NaturaSwatch[] = [
		{ name: 'Snow White', img: naturaSnowWhite },
		{ name: 'Alabaster', img: naturaAlabaster },
		{ name: 'Antique White', img: naturaAntiqueWhite },
		{ name: 'Linen', img: naturaLinen },
		{ name: 'Reverent Gray', img: naturaReverentGray },
		{ name: 'Millstone', img: naturaMillstone },
		{ name: 'Empire Gray', img: naturaEmpireGray },
		{ name: 'Perfect Gray', img: naturaPerfectGray },
		{ name: 'Seagull Gray', img: naturaSeagullGray },
		{ name: 'Driftwood', img: naturaDriftwood },
		{ name: 'Queenstown Gray', img: naturaQueenstownGray },
		{ name: 'Dark Chocolate', img: naturaDarkChocolate },
		{ name: 'Lamp Black', img: naturaLampBlack },
		{ name: 'Coastal Blue', img: naturaCoastalBlue },
		{ name: 'Twilight', img: naturaTwilight },
		{ name: 'China Blue', img: naturaChinaBlue },
		{ name: 'Klein Blue', img: naturaKleinBlue },
		{ name: 'Blue Moon', img: naturaBlueMoon },
		{ name: 'Halcyon Blue', img: naturaHalcyonBlue },
		{ name: 'Persian Blue', img: naturaPersianBlue },
		{ name: 'Gulf Stream Blue', img: naturaGulfStreamBlue },
		{ name: 'Key West Blue', img: naturaKeyWestBlue },
		{ name: 'Patina Green', img: naturaPatina },
		{ name: 'Basil', img: naturaBasil },
		{ name: 'Emerald', img: naturaEmerald },
		{ name: 'Westminster Green', img: naturaWestminsterGreen },
		{ name: 'Ballet Pink', img: naturaBalletPink },
		{ name: 'Coral Crush', img: naturaCoralCrush },
		{ name: 'Holiday Red', img: naturaHolidayRed },
		{ name: 'Tuscan Red', img: naturaTuscanRed },
		{ name: 'Harvest Yellow', img: naturaHarvestYellow },
		{ name: 'Sunglow', img: naturaSunglow },
		{ name: 'Persimmon', img: naturaPersimmon },
	];

	// Individual stain swatches cropped from chart images
	import whitewashMaple from '$lib/assets/stains/whitewash-maple.jpg';
	import naturalMaple from '$lib/assets/stains/natural-maple.jpg';
	import antiqueOakMaple from '$lib/assets/stains/antique-oak-maple.jpg';
	import graystoneMaple from '$lib/assets/stains/graystone-maple.jpg';
	import hickoryMaple from '$lib/assets/stains/hickory-maple.jpg';
	import antiqueBrownMaple from '$lib/assets/stains/antique-brown-maple.jpg';
	import brownMahoganyMaple from '$lib/assets/stains/brown-mahogany-maple.jpg';
	import provincialMaple from '$lib/assets/stains/provincial-maple.jpg';
	import onyxMaple from '$lib/assets/stains/onyx-maple.jpg';
	import blackMaple from '$lib/assets/stains/black-maple.jpg';
	import walnutMaple from '$lib/assets/stains/walnut-maple.jpg';
	import pecanMaple from '$lib/assets/stains/pecan-maple.jpg';
	import blackCherryMaple from '$lib/assets/stains/black-cherry-maple.jpg';
	import sedonaMaple from '$lib/assets/stains/sedona-maple.jpg';
	import cabernetMaple from '$lib/assets/stains/cabernet-maple.jpg';
	import tobaccoMaple from '$lib/assets/stains/tobacco-maple.jpg';
	import espressoMaple from '$lib/assets/stains/espresso-maple.jpg';
	import graphiteMaple from '$lib/assets/stains/graphite-maple.jpg';

	interface StainSwatch { name: string; wood: string; img: string }

	const WATER_STAINS: StainSwatch[] = [
		{ name: 'White Wash', wood: 'Maple', img: whitewashMaple },
		{ name: 'Natural', wood: 'Maple', img: naturalMaple },
		{ name: 'Antique Oak', wood: 'Maple', img: antiqueOakMaple },
		{ name: 'Graystone', wood: 'Maple', img: graystoneMaple },
		{ name: 'Hickory', wood: 'Maple', img: hickoryMaple },
		{ name: 'Antique Brown', wood: 'Maple', img: antiqueBrownMaple },
		{ name: 'Brown Mahogany', wood: 'Maple', img: brownMahoganyMaple },
		{ name: 'Provincial', wood: 'Maple', img: provincialMaple },
		{ name: 'Onyx', wood: 'Maple', img: onyxMaple },
		{ name: 'Black', wood: 'Maple', img: blackMaple },
		{ name: 'Walnut', wood: 'Maple', img: walnutMaple },
		{ name: 'Pecan', wood: 'Maple', img: pecanMaple },
		{ name: 'Black Cherry', wood: 'Maple', img: blackCherryMaple },
		{ name: 'Sedona', wood: 'Maple', img: sedonaMaple },
		{ name: 'Cabernet', wood: 'Maple', img: cabernetMaple },
		{ name: 'Tobacco', wood: 'Maple', img: tobaccoMaple },
		{ name: 'Espresso', wood: 'Maple', img: espressoMaple },
		{ name: 'Graphite', wood: 'Maple', img: graphiteMaple },
	];

	const stainWoodFilter = $state<'Maple' | 'Oak' | 'All'>('All');

	const filteredStains = $derived(
		stainWoodFilter === 'All' ? WATER_STAINS : WATER_STAINS.filter(s => s.wood === stainWoodFilter)
	);

	let { data }: { data: PageData } = $props();

	const groups = $derived.by(() => {
		const map = new Map<string, Finish[]>();
		for (const finish of data.finishes) {
			const cat = finish.category?.name ?? 'Other';
			if (!map.has(cat)) map.set(cat, []);
			map.get(cat)!.push(finish);
		}
		return [...map.entries()].sort(([a], [b]) => {
			if (a === 'Other') return 1;
			if (b === 'Other') return -1;
			return 0;
		});
	});

	let selected = $state<Finish | null>(null);
</script>

<svelte:head>
	<title>Finish Options — Vermont Bunk Beds</title>
</svelte:head>

<!-- Hero -->
<div class="page-header">
	<img src={coatingsImg} alt="Vermont Natural Coatings PolyWhey finish" class="header-bg" />
	<div class="header-overlay"></div>
	<div class="container header-content">
		<p class="eyebrow">Customize Your Bed</p>
		<h1>Finish Options</h1>
		<p class="subhead">All finishes are No-VOC and safe for your family. Applied by hand in our Vermont workshop.</p>
	</div>
</div>

<div class="finish-page">

	<!-- Section 1: Vermont Natural Coatings -->
	<section class="finish-section section-natural">
		<div class="container section-inner">
			<div class="section-text">
				<p class="eyebrow-dark">Section 1</p>
				<h2>Vermont Natural Coatings</h2>
				<div class="divider"></div>
				<p>We use <strong>PolyWhey®</strong> — a naturally derived, No-VOC &amp; Non-Toxic wood finish made right here in Vermont. It's a water-based polyurethane that brings out the natural beauty of the wood while providing a durable, food-safe protective coat.</p>
				<p>PolyWhey is our default finish and is included in the base price. It's the perfect choice if you love the look and warmth of natural hardwood grain.</p>
				{#each groups as [cat, finishes]}
					{#if cat === 'Vermont Natural Coatings'}
						<div class="natural-swatches">
							{#each finishes as finish (finish._id)}
								<button
									class="finish-card"
									class:active={selected?._id === finish._id}
									onclick={() => selected = selected?._id === finish._id ? null : finish}
								>
									<div class="swatch-wrap">
										{#if finish.image}
											<img src={urlFor(finish.image).width(200).height(200).fit('crop').url()} alt={finish.name} />
										{:else}
											<div class="swatch-placeholder">{finish.name.charAt(0)}</div>
										{/if}
									</div>
									<div class="finish-info">
										<span class="finish-name">{finish.name}</span>
										<span class="finish-included">Included</span>
									</div>
								</button>
							{/each}
						</div>
					{/if}
				{/each}
			</div>
			<div class="section-image">
				<img src={coatingsImg} alt="Vermont Natural Coatings — approved by the cows" />
				<p class="img-caption">PolyWhey® — Vermont-made, cow-approved.</p>
			</div>
		</div>
	</section>

	<!-- Section 2: Benjamin Moore Zero-VOC -->
	<section class="finish-section section-paint">
		<div class="container">
			<p class="eyebrow-dark">Section 2</p>
			<h2>Benjamin Moore Zero-VOC Paint Colors</h2>
			<div class="divider"></div>
			<p class="section-desc">All of our painted finishes use <strong>Benjamin Moore Aura</strong> — the highest quality Zero-VOC interior paint available. Choose from our hand-selected palette of 22 colors, or request any Benjamin Moore color. All are safe for your family and durable enough for years of use.</p>

			{#each groups as [cat, finishes]}
				{#if cat === 'Benjamin Moore Zero-VOC Paint'}
					<div class="finish-grid">
						{#each finishes as finish (finish._id)}
							<button
								class="finish-card"
								class:active={selected?._id === finish._id}
								onclick={() => selected = selected?._id === finish._id ? null : finish}
							>
								<div class="swatch-wrap">
									{#if finish.image}
										<img src={urlFor(finish.image).width(200).height(200).fit('crop').url()} alt={finish.name} />
									{:else}
										<div class="swatch-placeholder">{finish.name.charAt(0)}</div>
									{/if}
								</div>
								<div class="finish-info">
									<span class="finish-name">{finish.name}</span>
									{#if finish.effectivePriceModifier > 0}
										<span class="finish-price">+${finish.effectivePriceModifier}</span>
									{:else}
										<span class="finish-included">Included</span>
									{/if}
								</div>
							</button>
						{/each}
					</div>
				{/if}
			{/each}
		</div>
	</section>

	<!-- Section 3: Water Stains -->
	<section class="finish-section section-stain">
		<div class="container">
			<p class="eyebrow-dark">Section 3</p>
			<h2>Water Stains</h2>
			<div class="divider"></div>
			<p class="section-desc">Water-based stains from <strong>General Finishes</strong> let the natural wood grain show through while adding rich, lasting color. Non-toxic and durable — shown here on maple and oak.</p>

			<div class="stain-grid">
				{#each filteredStains as stain}
					<div class="stain-card">
						<div class="swatch-wrap">
							<img src={stain.img} alt="{stain.name} on {stain.wood}" />
						</div>
						<div class="finish-info">
							<span class="finish-name">{stain.name}</span>
							<span class="stain-wood">on {stain.wood}</span>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Section 4: Benjamin Moore Natura -->
	<section class="finish-section section-natura">
		<div class="container">
			<p class="eyebrow-dark">Section 4</p>
			<h2>Benjamin Moore Natura</h2>
			<div class="divider"></div>
			<p class="section-desc">Benjamin Moore <strong>Natura®</strong> is their asthma &amp; allergy friendly paint line — Zero-VOC, washable, and available in thousands of colors. If you have a specific color in mind that isn't in our standard palette, Natura is likely the path.</p>

			<div class="natura-grid">
				{#each NATURA_SWATCHES as swatch}
					<div class="natura-card">
						<div class="swatch-wrap">
							<img src={swatch.img} alt={swatch.name} />
						</div>
						<div class="finish-info">
							<span class="finish-name">{swatch.name}</span>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

</div>

<!-- Detail panel -->
{#if selected}
	<div class="detail-panel" role="region" aria-label="Finish detail">
		<div class="container detail-inner">
			{#if selected.image}
				<img class="detail-img" src={urlFor(selected.image).width(400).height(400).fit('crop').url()} alt={selected.name} />
			{:else}
				<div class="detail-img detail-img-placeholder">{selected.name.charAt(0)}</div>
			{/if}
			<div class="detail-text">
				<h3>{selected.name}</h3>
				{#if selected.description}<p>{selected.description}</p>{/if}
				<p class="detail-price">
					{#if selected.effectivePriceModifier > 0}Upcharge: <strong>+${selected.effectivePriceModifier}</strong>
					{:else}<strong>Included</strong> — no upcharge{/if}
				</p>
				<a href="/collections" class="btn btn-primary">Configure Your Bed</a>
			</div>
			<button class="close-btn" onclick={() => (selected = null)} aria-label="Close">✕</button>
		</div>
	</div>
{/if}

<!-- CTA -->
<section class="cta-section">
	<div class="container cta-inner">
		<h2>Ready to Order?</h2>
		<p>Choose your finish when you configure your bed. Not sure which to pick? We're happy to send samples.</p>
		<div class="cta-actions">
			<a href="/collections" class="btn btn-primary">Browse Collections</a>
			<a href="/contact" class="btn btn-outline-light">Request Samples</a>
		</div>
	</div>
</section>

<style>
	/* Hero */
	.page-header {
		position: relative;
		min-height: 380px;
		display: flex;
		align-items: center;
		overflow: hidden;
		background: var(--color-charcoal);
		text-align: center;
	}
	.header-bg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center 40%;
	}
	.header-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(to bottom, rgba(44,36,32,0.6), rgba(44,36,32,0.75));
	}
	.header-content {
		position: relative;
		z-index: 1;
		width: 100%;
		padding: 64px 24px;
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
	.subhead { color: rgba(255,255,255,0.75); font-size: 1.05rem; max-width: 520px; margin: 0 auto; }

	/* Sections */
	.finish-section {
		padding: 80px 0;
		border-bottom: 1px solid var(--color-tan-light);
	}

	.section-natural { background: var(--color-warm-white); }
	.section-paint { background: var(--color-cream); }
	.section-stain { background: var(--color-warm-white); }
	.section-natura { background: var(--color-cream); }

	.eyebrow-dark {
		font-size: 0.7rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--color-muted);
		font-weight: 600;
		margin-bottom: 8px;
	}

	.finish-section h2 { margin-bottom: 8px; }
	.finish-section .divider { margin: 12px 0 20px; }

	.section-desc {
		color: var(--color-muted);
		font-size: 0.95rem;
		max-width: 680px;
		line-height: 1.75;
		margin-bottom: 32px;
	}

	/* Two-col layout for natural + natura sections */
	.section-inner {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 64px;
		align-items: start;
	}

	.section-text p {
		color: var(--color-muted);
		font-size: 0.95rem;
		line-height: 1.75;
		margin-bottom: 16px;
	}

	.section-image img {
		width: 100%;
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-md);
		display: block;
	}

	.natura-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
		gap: 14px;
		margin-top: 24px;
	}

	.natura-card {
		display: flex;
		flex-direction: column;
		border-radius: var(--radius-sm);
		overflow: hidden;
		box-shadow: var(--shadow-sm);
		background: var(--color-warm-white);
	}

	.natura-card .swatch-wrap {
		aspect-ratio: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 8px;
	}

	.natura-card .swatch-wrap img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		display: block;
	}

	.natura-card .finish-info {
		padding: 8px 10px 10px;
	}

	.img-caption {
		font-size: 0.75rem;
		color: var(--color-muted);
		text-align: center;
		margin-top: 8px;
		letter-spacing: 0.05em;
	}

	/* Stain grid */
	.stain-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
		gap: 14px;
		margin-top: 8px;
	}

	.stain-card {
		display: flex;
		flex-direction: column;
		border-radius: var(--radius-sm);
		overflow: hidden;
		box-shadow: var(--shadow-sm);
		background: var(--color-warm-white);
	}

	.stain-card .swatch-wrap {
		aspect-ratio: 1;
		overflow: hidden;
	}

	.stain-card .swatch-wrap img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.stain-card .finish-info {
		padding: 10px 10px 12px;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.stain-wood {
		font-size: 0.7rem;
		color: var(--color-muted);
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	/* Finish grid */
	.finish-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
		gap: 14px;
	}

	.natural-swatches {
		display: flex;
		flex-wrap: wrap;
		gap: 14px;
		margin-top: 24px;
	}

	.natural-swatches .finish-card { width: 120px; }

	.finish-card {
		display: flex;
		flex-direction: column;
		background: #fff;
		border: 2px solid var(--color-tan-light);
		border-radius: var(--radius-md);
		overflow: hidden;
		cursor: pointer;
		transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
		text-align: left;
	}

	.finish-card:hover {
		border-color: var(--color-tan);
		box-shadow: var(--shadow-sm);
		transform: translateY(-2px);
	}

	.finish-card.active {
		border-color: var(--color-bark);
		box-shadow: var(--shadow-md);
		transform: translateY(-2px);
	}

	.swatch-wrap {
		aspect-ratio: 1;
		overflow: hidden;
		background: var(--color-tan-light);
	}

	.swatch-wrap img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.swatch-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-heading);
		font-size: 2rem;
		color: var(--color-muted);
		background: linear-gradient(135deg, var(--color-tan-light), var(--color-cream));
	}

	.finish-info {
		padding: 8px 10px;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.finish-name { font-size: 0.75rem; font-weight: 600; color: var(--color-charcoal); line-height: 1.3; }
	.finish-price { font-size: 0.7rem; color: var(--color-bark); font-weight: 600; }
	.finish-included { font-size: 0.7rem; color: var(--color-forest); font-weight: 600; }

	/* Detail panel */
	.detail-panel {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: var(--color-warm-white);
		border-top: 2px solid var(--color-tan-light);
		box-shadow: 0 -8px 32px rgba(44,36,32,0.14);
		z-index: 50;
		padding: 32px 0;
		animation: slide-up 0.2s ease;
	}

	@keyframes slide-up {
		from { transform: translateY(100%); opacity: 0; }
		to { transform: translateY(0); opacity: 1; }
	}

	.detail-inner {
		display: flex;
		align-items: center;
		gap: 32px;
		position: relative;
	}

	.detail-img {
		width: 120px;
		height: 120px;
		object-fit: cover;
		border-radius: var(--radius-md);
		flex-shrink: 0;
	}

	.detail-img-placeholder {
		width: 120px;
		height: 120px;
		border-radius: var(--radius-md);
		background: linear-gradient(135deg, var(--color-tan-light), var(--color-cream));
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-heading);
		font-size: 2.5rem;
		color: var(--color-muted);
		flex-shrink: 0;
	}

	.detail-text { flex: 1; }
	.detail-text h3 { font-size: 1.2rem; margin-bottom: 6px; }
	.detail-text p { font-size: 0.9rem; color: var(--color-muted); margin-bottom: 6px; line-height: 1.6; }
	.detail-price { font-size: 0.95rem !important; color: var(--color-charcoal) !important; }

	.close-btn {
		position: absolute;
		top: 0;
		right: 0;
		width: 36px;
		height: 36px;
		background: none;
		border: none;
		font-size: 1rem;
		color: var(--color-muted);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-sm);
		transition: background 0.2s, color 0.2s;
	}
	.close-btn:hover { background: var(--color-tan-light); color: var(--color-charcoal); }

	/* CTA */
	.cta-section {
		background: var(--color-bark);
		padding: 80px 0;
	}

	.cta-inner { text-align: center; }
	.cta-inner h2 { color: #fff; margin-bottom: 12px; }
	.cta-inner p { color: rgba(255,255,255,0.75); margin-bottom: 32px; max-width: 480px; margin-left: auto; margin-right: auto; }
	.cta-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }

	.btn-outline-light {
		display: inline-block;
		padding: 12px 28px;
		border: 2px solid rgba(255,255,255,0.6);
		color: #fff;
		border-radius: var(--radius-sm);
		font-size: 0.875rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		transition: background 0.2s, border-color 0.2s;
	}
	.btn-outline-light:hover { background: rgba(255,255,255,0.12); border-color: #fff; }

	@media (max-width: 900px) {
		.section-inner { grid-template-columns: 1fr; gap: 40px; }

	}

	@media (max-width: 600px) {
		.finish-grid { grid-template-columns: repeat(auto-fill, minmax(90px, 1fr)); gap: 10px; }
		.detail-inner { flex-wrap: wrap; }
		.detail-img, .detail-img-placeholder { width: 80px; height: 80px; }
	}
</style>
