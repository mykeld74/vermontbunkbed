import { getCollection, getFinishesForCollection } from '$lib/sanity/queries';
import { getSizeUpcharge } from '$lib/sanity/types';
import type { CartItem } from '$lib/cart.svelte';

export interface PricedItem extends CartItem {
	serverUnitPrice: number;
}

/**
 * Recomputes the authoritative unit price for every cart item directly from
 * Sanity. The client-supplied `unitPrice` is NEVER trusted — it is only used
 * for display. Prices returned here are what should be charged.
 *
 * Throws if an item references a product/finish/addon that cannot be validated.
 */
export async function priceCartItems(items: CartItem[]): Promise<PricedItem[]> {
	const uniqueSlugs = [...new Set(items.map((i) => i.collectionSlug))];

	const collectionEntries = await Promise.all(
		uniqueSlugs.map(async (slug) => {
			const collection = await getCollection(slug);
			if (!collection) return [slug, null] as const;
			const finishes = await getFinishesForCollection(collection._id);
			return [slug, { collection, finishes }] as const;
		})
	);

	const bySlug = new Map(collectionEntries);

	return items.map((item) => {
		const entry = bySlug.get(item.collectionSlug);
		if (!entry) {
			throw new Error(`Unknown collection: ${item.collectionSlug}`);
		}

		const { collection, finishes } = entry;

		const product = collection.productPrices.find(
			(p) => p.productType._id === item.productTypeId && !p.productType.isAddon
		);
		if (!product) {
			throw new Error(`Unknown product ${item.productTypeId} in ${item.collectionSlug}`);
		}

		const topUpcharge = getSizeUpcharge(product, item.topSize);
		const bottomUpcharge = product.productType.allowTopBottomMix
			? getSizeUpcharge(product, item.bottomSize ?? item.topSize)
			: 0;

		const finish = finishes.find((f) => f._id === item.finishId);
		if (!finish) {
			throw new Error(`Unknown finish ${item.finishId} in ${item.collectionSlug}`);
		}
		const finishModifier = finish.effectivePriceModifier ?? 0;

		const addonTotal = (item.addonIds ?? []).reduce((sum, addonId) => {
			const addon = collection.productPrices.find(
				(p) => p.productType._id === addonId && p.productType.isAddon
			);
			if (!addon) {
				throw new Error(`Unknown add-on ${addonId} in ${item.collectionSlug}`);
			}
			return sum + (addon.basePrice ?? 0);
		}, 0);

		const serverUnitPrice =
			product.basePrice + topUpcharge + bottomUpcharge + finishModifier + addonTotal;

		if (!(serverUnitPrice > 0)) {
			throw new Error(`Computed non-positive price for ${item.productTypeId}`);
		}

		return { ...item, serverUnitPrice };
	});
}
