export interface SanityImage {
	_type: 'image';
	asset: { _ref: string; _type: 'reference' };
}


export interface ProductType {
	_id: string;
	displayName: string;
	description: string;
	isAddon: boolean;
	allowTopBottomMix: boolean;
	availableSizes: ('twin' | 'full' | 'queen' | 'king')[];
	exclusiveGroup?: string;
	restrictToProductTypes?: { _id: string }[];
}

export interface CollectionProduct {
	productType: ProductType; // expanded reference
	basePrice: number;
	twinUpcharge: number;
	fullUpcharge: number;
	queenUpcharge: number;
	kingUpcharge: number;
}

export function getSizeUpcharge(product: CollectionProduct, size: string): number {
	const map: Record<string, number> = {
		twin: product.twinUpcharge ?? 0,
		full: product.fullUpcharge ?? 0,
		queen: product.queenUpcharge ?? 0,
		king: product.kingUpcharge ?? 0
	};
	return map[size] ?? 0;
}

export interface Collection {
	_id: string;
	name: string;
	slug: { current: string };
	description: string;
	images: SanityImage[];
	featured: boolean;
	productPrices: CollectionProduct[];
}

export interface Finish {
	_id: string;
	name: string;
	slug: { current: string };
	description: string;
	image: SanityImage;
	priceModifier: number;
}

export interface SiteSettings {
	announcementBanner?: string;
	globalSalePercent: number;
	globalSaleLabel?: string;
}
