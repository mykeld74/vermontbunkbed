<script lang="ts">
	import type { PageData } from './$types';
	import type { CollectionProduct, Finish } from '$lib/sanity/types';
	import { getSizeUpcharge } from '$lib/sanity/types';
	import { cart } from '$lib/cart.svelte';
	import { goto } from '$app/navigation';
	import { urlFor } from '$lib/sanity/client';


	let { data }: { data: PageData } = $props();

	const mainProducts = $derived(
		data.collection.productPrices.filter((p) => !p.productType.isAddon)
	);

	let selectedProduct = $state<CollectionProduct | null>(data.selectedProduct ?? null);
	let topSize = $state('twin');
	let bottomSize = $state('twin');
	let selectedFinishId = $state<string>('');
	let selectedAddonIds = $state<string[]>([]);

	const availableAddons = $derived.by(() => {
		const allAddons = data.addons;
		const product = selectedProduct;
		return allAddons.filter((addon) => {
			const restrictions = addon.productType.restrictToProductTypes;
			if (!restrictions || restrictions.length === 0) return true;
			if (!product) return false;
			return restrictions.some((r) => r._id === product.productType._id);
		});
	});

	const selectedFinish = $derived(data.finishes.find((f) => f._id === selectedFinishId));

	// Top size options depend on bottom: twin→[twin], full→[twin,full], queen→all
	const allowedTopSizes = $derived.by(() => {
		if (!selectedProduct?.productType.allowTopBottomMix) return selectedProduct?.productType.availableSizes ?? [];
		const all = selectedProduct.productType.availableSizes ?? [];
		if (bottomSize === 'twin') return all.filter((s) => s === 'twin');
		if (bottomSize === 'full') return all.filter((s) => s === 'twin' || s === 'full');
		return all; // queen → any
	});

	// Reset top size if it's no longer allowed after a bottom change
	$effect(() => {
		if (!allowedTopSizes.includes(topSize)) {
			topSize = allowedTopSizes[0] ?? 'twin';
		}
	});

	const finishGroups = $derived.by(() => {
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

	const salePercent = $derived(data.settings?.globalSalePercent ?? 0);

	const basePrice = $derived(() => {
		if (!selectedProduct) return 0;
		const topUpcharge = getSizeUpcharge(selectedProduct, topSize);
		const bottomUpcharge = selectedProduct.productType.allowTopBottomMix
			? getSizeUpcharge(selectedProduct, bottomSize)
			: 0;
		const finishModifier = selectedFinish?.effectivePriceModifier ?? 0;
		const addonTotal = selectedAddonIds.reduce((sum, id) => {
			const addon = availableAddons.find((a) => a.productType._id === id);
			return sum + (addon?.basePrice ?? 0);
		}, 0);
		return selectedProduct.basePrice + topUpcharge + bottomUpcharge + finishModifier + addonTotal;
	});

	// Display price reflects active sale for UI only; cart always stores base price
	const totalPrice = $derived(
		salePercent > 0 ? basePrice() * (1 - salePercent / 100) : basePrice()
	);

	function toggleAddon(id: string) {
		if (selectedAddonIds.includes(id)) {
			selectedAddonIds = selectedAddonIds.filter((a) => a !== id);
			return;
		}
		const addon = availableAddons.find((a) => a.productType._id === id);
		const group = addon?.productType.exclusiveGroup;
		if (group) {
			// deselect any other addon in the same exclusive group
			const groupIds = availableAddons
				.filter((a) => a.productType.exclusiveGroup === group)
				.map((a) => a.productType._id);
			selectedAddonIds = [...selectedAddonIds.filter((a) => !groupIds.includes(a)), id];
		} else {
			selectedAddonIds = [...selectedAddonIds, id];
		}
	}

	function addToCart() {
		if (!selectedProduct || !selectedFinish) return;
		const addonNames = selectedAddonIds.map(
			(id) => availableAddons.find((a) => a.productType._id === id)?.productType.displayName ?? ''
		);
		cart.add({
			id: crypto.randomUUID(),
			collectionSlug: data.collection.slug.current,
			collectionName: data.collection.name,
			productTypeId: selectedProduct.productType._id,
			productTypeName: selectedProduct.productType.displayName,
			topSize,
			bottomSize: selectedProduct.productType.allowTopBottomMix ? bottomSize : undefined,
			finishId: selectedFinishId,
			finishName: selectedFinish.name,
			addonIds: selectedAddonIds,
			addonNames,
			unitPrice: basePrice(),
			quantity: 1
		});
		goto('/cart');
	}

	let step = $derived(selectedProduct ? (selectedProduct.productType.availableSizes?.length > 0 ? 2 : 1) : 1);
</script>

<svelte:head>
	<title>Configure — {data.collection.name} — Vermont Bunk Beds</title>
</svelte:head>

<div class="page-bar">
	<div class="container page-bar-inner">
		<a href="/collections/{data.collection.slug.current}" class="back-link">← {data.collection.name}</a>
		<span class="page-bar-title">Configure Your Bed</span>
	</div>
</div>

<div class="configure-layout container">
	<!-- Steps -->
	<div class="steps-column">

		<!-- Step 1: Bed Type -->
		<div class="step" class:completed={selectedProduct !== null}>
			<div class="step-header">
				<span class="step-num">1</span>
				<h2>Choose Bed Type</h2>
			</div>
			<div class="product-grid">
				{#each mainProducts as product (product.productType._id)}
					<button
						class="product-btn"
						class:selected={selectedProduct?.productType._id === product.productType._id}
						onclick={() => {
							selectedProduct = product;
							topSize = product.productType.availableSizes?.[0] ?? 'twin';
							bottomSize = product.productType.availableSizes?.[0] ?? 'twin';
							selectedAddonIds = [];
						}}
					>
						<div class="product-btn-top">
							<span class="product-name">{product.productType.displayName}</span>
							<span class="product-price">From ${product.basePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
						</div>
						<p class="product-desc">{product.productType.description}</p>
					</button>
				{/each}
			</div>
		</div>

		{#if selectedProduct}
			<!-- Step 2: Size -->
			{#if selectedProduct.productType.availableSizes?.length > 0}
				<div class="step">
					<div class="step-header">
						<span class="step-num">2</span>
						<h2>Choose Size</h2>
					</div>

					{#if selectedProduct.productType.allowTopBottomMix}
						<div class="size-mix-grid">
							<!-- Bottom Bunk first -->
							<div class="size-group">
								<p class="size-group-label">Bottom Bunk</p>
								<div class="size-options">
									{#each selectedProduct.productType.availableSizes as size (size)}
										{@const upcharge = getSizeUpcharge(selectedProduct, size)}
										<button
											class="size-btn"
											class:selected={bottomSize === size}
											onclick={() => (bottomSize = size)}
										>
											<span>{size.charAt(0).toUpperCase() + size.slice(1)}</span>
											{#if upcharge > 0}<small>+${upcharge}</small>{/if}
										</button>
									{/each}
								</div>
							</div>
							<!-- Top Bunk — options constrained by bottom selection -->
							<div class="size-group">
								<p class="size-group-label">
								Top Bunk
								<span class="size-tooltip-wrap">
									<span class="size-tooltip-icon">?</span>
									<span class="size-tooltip-text">Top bunk must be equal to or smaller than the bottom bunk.</span>
								</span>
							</p>
								<div class="size-options">
									{#each selectedProduct.productType.availableSizes as size (size)}
										{@const upcharge = getSizeUpcharge(selectedProduct, size)}
										{@const allowed = allowedTopSizes.includes(size)}
										<button
											class="size-btn"
											class:selected={topSize === size}
											class:unavailable={!allowed}
											disabled={!allowed}
											onclick={() => (topSize = size)}
										>
											<span>{size.charAt(0).toUpperCase() + size.slice(1)}</span>
											{#if upcharge > 0}<small>+${upcharge}</small>{/if}
										</button>
									{/each}
								</div>
							</div>
						</div>
					{:else}
						<div class="size-options">
							{#each selectedProduct.productType.availableSizes as size (size)}
								{@const upcharge = getSizeUpcharge(selectedProduct, size)}
								<button
									class="size-btn"
									class:selected={topSize === size}
									onclick={() => (topSize = size)}
								>
									<span>{size.charAt(0).toUpperCase() + size.slice(1)}</span>
									{#if upcharge > 0}<small>+${upcharge}</small>{/if}
								</button>
							{/each}
						</div>
					{/if}
				</div>
			{/if}

			<!-- Step 3: Add-ons -->
			{#if availableAddons.length > 0}
				<div class="step">
					<div class="step-header">
						<span class="step-num">{selectedProduct.productType.availableSizes?.length > 0 ? '3' : '2'}</span>
						<h2>Add-Ons <span class="optional">Optional</span></h2>
					</div>
					<div class="addon-grid">
						{#each availableAddons as addon (addon.productType._id)}
							<button
								class="addon-btn"
								class:selected={selectedAddonIds.includes(addon.productType._id)}
								onclick={() => toggleAddon(addon.productType._id)}
							>
								<div class="addon-check">
									{#if selectedAddonIds.includes(addon.productType._id)}✓{/if}
								</div>
								<div class="addon-info">
									<span class="addon-name">{addon.productType.displayName}</span>
									<span class="addon-price">+${addon.basePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
								</div>
							</button>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Step 4: Finish -->
			<div class="step">
				<div class="step-header">
					<span class="step-num">
						{#if selectedProduct.productType.availableSizes?.length > 0}
							{availableAddons.length > 0 ? '4' : '3'}
						{:else}
							{availableAddons.length > 0 ? '3' : '2'}
						{/if}
					</span>
					<h2>Choose Finish</h2>
				</div>
				{#each finishGroups as [category, finishes]}
					<div class="finish-category">
						<p class="finish-category-label">{category}</p>
						<div class="finish-grid">
							{#each finishes as finish (finish._id)}
								<button
									class="finish-btn"
									class:selected={selectedFinishId === finish._id}
									onclick={() => (selectedFinishId = finish._id)}
									title={finish.name}
								>
									{#if finish.image}
										<img src={urlFor(finish.image).width(120).height(120).fit('crop').url()} alt={finish.name} />
									{:else}
										<div class="finish-swatch"></div>
									{/if}
									<span class="finish-name">{finish.name}</span>
									{#if finish.effectivePriceModifier > 0}
										<span class="finish-upcharge">+${finish.effectivePriceModifier}</span>
									{/if}
								</button>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Summary sidebar -->
	<aside class="summary-sidebar">
		<div class="summary-card">
			<h3>Your Configuration</h3>
			{#if selectedProduct}
				<div class="summary-lines">
					<div class="summary-line">
						<span>{data.collection.name}</span>
					</div>
					<div class="summary-line">
						<span>{selectedProduct.productType.displayName}</span>
						<span>${selectedProduct.basePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
					</div>
					{#if selectedProduct.productType.availableSizes?.length > 0}
						<div class="summary-line summary-sub">
							<span>
								{selectedProduct.productType.allowTopBottomMix
									? `${bottomSize.charAt(0).toUpperCase() + bottomSize.slice(1)} bottom / ${topSize.charAt(0).toUpperCase() + topSize.slice(1)} top`
									: `${topSize.charAt(0).toUpperCase() + topSize.slice(1)}`}
							</span>
							{#if getSizeUpcharge(selectedProduct, topSize) + getSizeUpcharge(selectedProduct, bottomSize) > 0}
								<span>+${getSizeUpcharge(selectedProduct, topSize) + getSizeUpcharge(selectedProduct, bottomSize)}</span>
							{/if}
						</div>
					{/if}
					{#if selectedFinish}
						<div class="summary-line summary-sub">
							<span>Finish: {selectedFinish.name}</span>
							{#if selectedFinish.effectivePriceModifier > 0}
								<span>+${selectedFinish.effectivePriceModifier}</span>
							{/if}
						</div>
					{:else}
						<div class="summary-line summary-sub summary-required">
							<span>Finish: <em>required</em></span>
						</div>
					{/if}
					{#each selectedAddonIds as addonId}
						{@const addon = availableAddons.find((a) => a.productType._id === addonId)}
						{#if addon}
							<div class="summary-line summary-sub">
								<span>{addon.productType.displayName}</span>
								<span>+${addon.basePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
							</div>
						{/if}
					{/each}
				</div>

				<div class="summary-total">
					<span>Total</span>
					<div class="summary-total-price">
						{#if salePercent > 0}
							<s class="original-price">${basePrice().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</s>
						{/if}
						<strong>${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
					</div>
				</div>

				<button
					type="button"
					class="btn btn-primary add-btn"
					onclick={addToCart}
					disabled={!selectedFinishId || !selectedProduct}
				>
					{!selectedFinishId ? 'Select a Finish to Continue' : 'Add to Cart'}
				</button>

				<p class="summary-note">Shipping calculated at checkout. Built to order — allow 1–3 weeks.</p>
			{:else}
				<p class="summary-empty">Select a bed type to get started.</p>
			{/if}
		</div>
	</aside>
</div>

<style>
	.page-bar {
		background: var(--color-warm-white);
		border-bottom: 1px solid var(--color-tan-light);
		padding: 16px 0;
	}

	.page-bar-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.back-link {
		font-size: 0.8rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-bark);
		font-weight: 600;
		transition: color 0.2s;
	}
	.back-link:hover { color: var(--color-bark-light); }

	.page-bar-title {
		font-family: var(--font-heading);
		font-size: 1rem;
		color: var(--color-charcoal);
	}

	/* Layout */
	.configure-layout {
		display: grid;
		grid-template-columns: 1fr 340px;
		gap: 48px;
		align-items: start;
		padding-top: 48px;
		padding-bottom: 80px;
	}

	/* Steps */
	.step {
		background: var(--color-warm-white);
		border: 1px solid var(--color-tan-light);
		border-radius: var(--radius-md);
		padding: 32px;
		margin-bottom: 24px;
	}

	.step-header {
		display: flex;
		align-items: center;
		gap: 14px;
		margin-bottom: 24px;
	}

	.step-num {
		width: 32px;
		height: 32px;
		background: var(--color-bark);
		color: #fff;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.85rem;
		font-weight: 700;
		flex-shrink: 0;
	}

	.step-header h2 {
		font-size: 1.2rem;
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.optional {
		font-size: 0.7rem;
		font-family: var(--font-body);
		background: var(--color-tan-light);
		color: var(--color-muted);
		padding: 2px 8px;
		border-radius: 20px;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	/* Product buttons */
	.product-grid { display: flex; flex-direction: column; gap: 12px; }

	.product-btn {
		width: 100%;
		text-align: left;
		padding: 20px 24px;
		background: var(--color-cream);
		border: 2px solid var(--color-tan-light);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: border-color 0.2s, background 0.2s;
	}

	.product-btn:hover { border-color: var(--color-tan); }
	.product-btn.selected {
		border-color: var(--color-bark);
		background: #fdf5ee;
	}

	.product-btn-top {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: 6px;
	}

	.product-name { font-weight: 700; color: var(--color-charcoal); font-size: 1rem; }
	.product-price { font-weight: 600; color: var(--color-bark); font-size: 0.9rem; }
	.product-desc { color: var(--color-muted); font-size: 0.85rem; line-height: 1.6; }

	/* Size buttons */
	.size-options { display: flex; flex-wrap: wrap; gap: 10px; }

	.size-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 12px 20px;
		border: 2px solid var(--color-tan-light);
		border-radius: var(--radius-sm);
		background: var(--color-cream);
		cursor: pointer;
		min-width: 80px;
		transition: border-color 0.2s, background 0.2s;
	}

	.size-btn:hover:not(:disabled) { border-color: var(--color-tan); }
	.size-btn.selected { border-color: var(--color-bark); background: #fdf5ee; }
	.size-btn.unavailable { opacity: 0.35; cursor: not-allowed; }
	.size-btn span { font-weight: 600; color: var(--color-charcoal); font-size: 0.95rem; }
	.size-btn small { color: var(--color-bark); font-size: 0.75rem; margin-top: 2px; }

	.size-mix-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
	.size-group-label { font-size: 0.8rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-muted); margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
	.size-tooltip-wrap { position: relative; display: inline-flex; align-items: center; }
	.size-tooltip-icon { display: inline-flex; align-items: center; justify-content: center; width: 15px; height: 15px; border-radius: 50%; background: var(--color-muted); color: #fff; font-size: 0.65rem; font-weight: 700; cursor: default; line-height: 1; text-transform: none; letter-spacing: 0; }
	.size-tooltip-text { display: none; position: absolute; bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%); background: var(--color-charcoal); color: #fff; font-size: 0.72rem; font-weight: 400; letter-spacing: 0; text-transform: none; white-space: nowrap; padding: 5px 9px; border-radius: 4px; pointer-events: none; z-index: 10; }
	.size-tooltip-text::after { content: ''; position: absolute; top: 100%; left: 50%; transform: translateX(-50%); border: 5px solid transparent; border-top-color: var(--color-charcoal); }
	.size-tooltip-wrap:hover .size-tooltip-text { display: block; }

	/* Add-on buttons */
	.addon-grid { display: flex; flex-direction: column; gap: 10px; }

	.addon-btn {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 14px 18px;
		background: var(--color-cream);
		border: 2px solid var(--color-tan-light);
		border-radius: var(--radius-sm);
		cursor: pointer;
		text-align: left;
		transition: border-color 0.2s, background 0.2s;
	}

	.addon-btn:hover { border-color: var(--color-tan); }
	.addon-btn.selected { border-color: var(--color-bark); background: #fdf5ee; }

	.addon-check {
		width: 22px;
		height: 22px;
		border: 2px solid var(--color-tan);
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.75rem;
		color: var(--color-bark);
		flex-shrink: 0;
		background: #fff;
		transition: background 0.2s, border-color 0.2s;
	}

	.addon-btn.selected .addon-check {
		background: var(--color-bark);
		border-color: var(--color-bark);
		color: #fff;
	}

	.addon-info { display: flex; flex-direction: column; gap: 2px; }
	.addon-name { font-weight: 600; color: var(--color-charcoal); font-size: 0.95rem; }
	.addon-price { color: var(--color-bark); font-size: 0.85rem; }

	/* Finish categories */
	.finish-category { margin-bottom: 20px; }

	.finish-category-label {
		font-size: 0.7rem;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-muted);
		margin-bottom: 10px;
		padding-bottom: 6px;
		border-bottom: 1px solid var(--color-tan-light);
	}

	/* Finish grid */
	.finish-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
		gap: 10px;
	}

	.finish-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		padding: 8px 4px;
		border: 2px solid var(--color-tan-light);
		border-radius: var(--radius-sm);
		background: var(--color-cream);
		cursor: pointer;
		transition: border-color 0.2s;
	}

	.finish-btn:hover { border-color: var(--color-tan); }
	.finish-btn.selected { border-color: var(--color-bark); outline: 2px solid var(--color-bark); outline-offset: 1px; }

	.finish-btn img {
		width: 64px;
		height: 64px;
		border-radius: 4px;
		object-fit: cover;
	}

	.finish-swatch {
		width: 64px;
		height: 64px;
		border-radius: 4px;
		background: var(--color-tan-light);
	}

	.finish-name {
		font-size: 0.7rem;
		text-align: center;
		color: var(--color-charcoal);
		line-height: 1.3;
		max-width: 80px;
	}

	.finish-upcharge { font-size: 0.65rem; color: var(--color-bark); font-weight: 600; }

	/* Summary sidebar */
	.summary-sidebar { position: sticky; top: 90px; }

	.summary-card {
		background: var(--color-warm-white);
		border: 1px solid var(--color-tan-light);
		border-radius: var(--radius-md);
		padding: 28px;
	}

	.summary-card h3 {
		font-size: 1.1rem;
		margin-bottom: 20px;
		padding-bottom: 16px;
		border-bottom: 1px solid var(--color-tan-light);
	}

	.summary-lines { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }

	.summary-line {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		font-size: 0.9rem;
		color: var(--color-charcoal);
		font-weight: 500;
	}

	.summary-sub { color: var(--color-muted); font-weight: 400; font-size: 0.85rem; padding-left: 12px; }
	.summary-required em { color: #c0392b; font-style: normal; }

	.summary-total {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		padding: 16px 0;
		border-top: 1px solid var(--color-tan-light);
		border-bottom: 1px solid var(--color-tan-light);
		margin-bottom: 20px;
	}

	.summary-total span { font-size: 0.85rem; color: var(--color-muted); text-transform: uppercase; letter-spacing: 0.05em; }
	.summary-total strong { font-family: var(--font-heading); font-size: 1.6rem; color: var(--color-charcoal); }
	.summary-total-price { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
	.original-price { font-size: 1rem; color: var(--color-muted); text-decoration: line-through; }

	.add-btn { width: 100%; text-align: center; padding: 16px; }
	.add-btn:disabled { opacity: 0.5; cursor: not-allowed; }

	.summary-note {
		margin-top: 12px;
		font-size: 0.75rem;
		color: var(--color-muted);
		text-align: center;
		line-height: 1.6;
	}

	.summary-empty { color: var(--color-muted); font-size: 0.9rem; text-align: center; padding: 16px 0; }

	@media (max-width: 1024px) {
		.configure-layout { grid-template-columns: 1fr; }
		.summary-sidebar { position: static; order: -1; }
	}

	@media (max-width: 600px) {
		.size-mix-grid { grid-template-columns: 1fr; }
		.step { padding: 24px 16px; }
	}
</style>
