import { getSiteSettings } from '$lib/sanity/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const settings = await getSiteSettings();
	return { salePercent: settings?.globalSalePercent ?? 0 };
};
