import { defineField, defineType } from 'sanity';

export const finish = defineType({
	name: 'finish',
	title: 'Finish',
	type: 'document',
	fields: [
		defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
		defineField({
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			options: { source: 'name' },
			validation: (r) => r.required()
		}),
		defineField({ name: 'description', title: 'Description', type: 'text' }),
		defineField({ name: 'image', title: 'Sample Image', type: 'image', options: { hotspot: true } }),
		defineField({
			name: 'priceModifier',
			title: 'Price Upcharge (USD)',
			description: 'Additional cost for this finish. Set to 0 for no upcharge.',
			type: 'number',
			initialValue: 0,
			validation: (r) => r.min(0)
		}),
		defineField({
			name: 'collections',
			title: 'Available In Collections',
			type: 'array',
			of: [{ type: 'reference', to: [{ type: 'collection' }] }]
		})
	]
});
