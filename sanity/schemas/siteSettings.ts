import { defineField, defineType } from 'sanity';

export const siteSettings = defineType({
	name: 'siteSettings',
	title: 'Site Settings',
	type: 'document',
	// Singleton — only one document of this type
	__experimental_actions: ['update', 'publish'],
	fields: [
		defineField({
			name: 'announcementBanner',
			title: 'Announcement Banner',
			description: 'Shown at the top of the site. Leave blank to hide.',
			type: 'string'
		}),
		defineField({
			name: 'globalSalePercent',
			title: 'Sale Discount (%)',
			description: 'Set to 0 for no sale. Set to 10 for 10% off everything.',
			type: 'number',
			initialValue: 0,
			validation: (r) => r.min(0).max(100)
		}),
		defineField({
			name: 'globalSaleLabel',
			title: 'Sale Label',
			description: 'e.g. "Summer Sale" — shown on the banner and product pages',
			type: 'string'
		})
	],
	preview: {
		select: { title: 'announcementBanner' },
		prepare() {
			return { title: 'Site Settings' };
		}
	}
});
