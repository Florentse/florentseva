import {defineType, defineField} from 'sanity'

export const productLinkBlock = defineType({
  name: 'productLinkBlock',
  title: 'Product Link Block',
  type: 'object',
  fields: [
    defineField({name: 'heading', title: 'Section Heading', type: 'localeString'}),
    defineField({
      name: 'product',
      title: 'Product',
      type: 'reference',
      to: [{type: 'product'}],
    }),
    defineField({
      name: 'description',
      title: 'Custom description (optional override)',
      type: 'localeText',
    }),
  ],
  preview: {
    select: {title: 'heading.en'},
  },
})