import { getCollection, getFinishesForCollection } from '$lib/sanity/queries';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const collection = await getCollection(params.slug);
	if (!collection) error(404, 'Collection not found');

	const finishes = await getFinishesForCollection(collection._id);
	return { collection, finishes };
};
