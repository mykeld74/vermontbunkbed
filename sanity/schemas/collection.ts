import { defineField, defineType } from 'sanity';

export const collection = defineType({
	name: 'collection',
	title: 'Collection',
	type: 'document',
	fields: [
		defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
		defineField({
			name: 'slug',
			title: 'Slug',
			options: { source: 'name' },
			type: 'slug',
			validation: (r) => r.required()
		}),
		defineField({ name: 'description', title: 'Description', type: 'text' }),
		defineField({
			name: 'images',
			title: 'Images',
			type: 'array',
			of: [{ type: 'image', options: { hotspot: true } }]
		}),
		defineField({
			name: 'featured',
			title: 'Featured on Homepage',
			type: 'boolean',
			initialValue: false
		}),
		defineField({
			name: 'productPrices',
			title: 'Product Prices',
			description: 'Set the price for each product type offered in this collection',
			type: 'array',
			of: [
				{
					type: 'object',
					options: { collapsible: true, collapsed: false },
					fields: [
						defineField({
							name: 'productType',
							title: 'Product Type',
							type: 'reference',
							to: [{ type: 'productType' }],
							validation: (r) => r.required()
						}),
						defineField({
							name: 'basePrice',
							title: 'Base Price (USD)',
							type: 'number',
							validation: (r) => r.required().min(0)
						}),
						defineField({
							name: 'twinUpcharge',
							title: 'Twin Upcharge (USD)',
							description: 'Extra cost for twin size. Leave 0 for no upcharge.',
							type: 'number',
							initialValue: 0
						}),
						defineField({
							name: 'fullUpcharge',
							title: 'Full Upcharge (USD)',
							description: 'Extra cost for full size. Leave 0 for no upcharge.',
							type: 'number',
							initialValue: 0
						}),
						defineField({
							name: 'queenUpcharge',
							title: 'Queen Upcharge (USD)',
							description: 'Extra cost for queen size. Leave 0 for no upcharge.',
							type: 'number',
							initialValue: 0
						}),
						defineField({
							name: 'kingUpcharge',
							title: 'King Upcharge (USD)',
							description: 'Extra cost for king size. Leave 0 for no upcharge.',
							type: 'number',
							initialValue: 0
						})
					],
					preview: {
						select: {
							title: 'productType.displayName',
							subtitle: 'basePrice'
						},
						prepare({ title, subtitle }) {
							return {
								title: title ?? 'Product',
								subtitle: subtitle ? `From $${subtitle}` : ''
							};
						}
					}
				}
			]
		})
	]
});
