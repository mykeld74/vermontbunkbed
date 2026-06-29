import { getCollections } from '$lib/sanity/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const collections = await getCollections();
	return { collections };
};
