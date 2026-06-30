import { getCollection, getFinishesForCollection, getSiteSettings } from '$lib/sanity/queries';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
	const productId = url.searchParams.get('product');
	const [collection, settings] = await Promise.all([
		getCollection(params.slug),
		getSiteSettings()
	]);
	if (!collection) error(404, 'Collection not found');

	const finishes = await getFinishesForCollection(collection._id);
	const addons = collection.productPrices.filter((p) => p.productType.isAddon);
	const selectedProduct = productId
		? (collection.productPrices.find((p) => p.productType._id === productId) ?? null)
		: null;

	return { collection, finishes, addons, selectedProduct, settings };
};
