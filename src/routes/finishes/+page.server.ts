import { getAllFinishes } from '$lib/sanity/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const finishes = await getAllFinishes();
	return { finishes };
};
