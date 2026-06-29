import { getCollections, getSiteSettings } from '$lib/sanity/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [collections, settings] = await Promise.all([getCollections(), getSiteSettings()]);
	return { collections, settings };
};
