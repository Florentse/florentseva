import {defineType, defineField} from 'sanity'

export const headingParagraphItem = defineType({
  name: 'headingParagraphItem',
  title: 'Heading + Paragraph Item',
  type: 'object',
  fields: [
    defineField({name: 'heading', title: 'Heading (h3)', type: 'localeString'}),
    defineField({name: 'description', title: 'Description', type: 'localeText'}),
  ],
  preview: {
    select: {title: 'heading.en'},
  },
})