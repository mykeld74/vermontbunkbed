import { sanityClient } from './client';
import type { Collection, Finish, SiteSettings } from './types';

const collectionFields = `
  _id, name, slug, description, images, featured,
  productPrices[] {
    basePrice,
    twinUpcharge, fullUpcharge, queenUpcharge, kingUpcharge,
    productType-> { _id, displayName, description, isAddon, allowTopBottomMix, availableSizes, exclusiveGroup, restrictToProductTypes[]-> { _id } }
  }
`;

export async function getCollections(): Promise<Collection[]> {
	return sanityClient.fetch(`*[_type == "collection"] | order(name asc) { ${collectionFields} }`);
}

export async function getCollection(slug: string): Promise<Collection | null> {
	return sanityClient.fetch(
		`*[_type == "collection" && slug.current == $slug][0] { ${collectionFields} }`,
		{ slug }
	);
}

const finishFields = `
	_id, name, slug, description, image,
	category-> { _id, name, defaultPriceModifier },
	priceModifier,
	"effectivePriceModifier": coalesce(priceModifier, category->defaultPriceModifier, 0)
`;

export async function getFinishesForCollection(collectionId: string): Promise<Finish[]> {
	const specific: Finish[] = await sanityClient.fetch(
		`*[_type == "finish" && references($collectionId)] | order(category->name asc, name asc) { ${finishFields} }`,
		{ collectionId }
	);
	if (specific.length > 0) return specific;
	return sanityClient.fetch(`*[_type == "finish"] | order(category->name asc, name asc) { ${finishFields} }`);
}

export async function getAllFinishes(): Promise<Finish[]> {
	return sanityClient.fetch(`*[_type == "finish"] | order(category->name asc, name asc) { ${finishFields} }`);
}

export async function getSiteSettings(): Promise<SiteSettings> {
	const activeSale = await sanityClient.fetch(
		`*[_type == "sale" && active == true] | order(_updatedAt desc) [0] { discountPercent, title }`
	);
	return {
		globalSalePercent: activeSale?.discountPercent ?? 0,
		globalSaleLabel: activeSale?.title ?? '',
		announcementBanner: activeSale?.title ?? '',
	};
}
