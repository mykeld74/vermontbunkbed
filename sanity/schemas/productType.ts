import { defineField, defineType } from 'sanity';

export const productType = defineType({
	name: 'productType',
	title: 'Product Type',
	type: 'document',
	fields: [
		defineField({
			name: 'displayName',
			title: 'Name',
			type: 'string',
			validation: (r) => r.required()
		}),
		defineField({
			name: 'description',
			title: 'Description',
			type: 'text',
			validation: (r) => r.required()
		}),
		defineField({
			name: 'isAddon',
			title: 'Is Add-On',
			description: 'Enable for items added to a bed (drawers, ladder, trundle) rather than standalone beds',
			type: 'boolean',
			initialValue: false
		}),
		defineField({
			name: 'allowTopBottomMix',
			title: 'Allow Different Top/Bottom Sizes',
			description: 'Enable for bunk beds — lets customers pick different sizes for top and bottom',
			type: 'boolean',
			initialValue: false
		}),
		defineField({
			name: 'availableSizes',
			title: 'Available Sizes',
			description: 'Leave empty for products with no size option (e.g. drawers, ladder)',
			type: 'array',
			of: [
				{
					type: 'string',
					options: {
						list: [
							{ title: 'Twin', value: 'twin' },
							{ title: 'Full', value: 'full' },
							{ title: 'Queen', value: 'queen' },
							{ title: 'King', value: 'king' }
						]
					}
				}
			]
		})
	],
	preview: {
		select: { title: 'displayName', subtitle: 'isAddon' },
		prepare({ title, subtitle }) {
			return { title, subtitle: subtitle ? 'Add-on' : 'Bed' };
		}
	}
});
