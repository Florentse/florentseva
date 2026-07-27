import {defineType, defineField} from 'sanity'

export const client = defineType({
  name: 'client',
  title: 'Client',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Company Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {hotspot: true},
    }),
  ],

  preview: {
    select: {
      title: 'name',
      media: 'logo',
    },
    prepare({title, media}) {
      return {
        title,
        media,
      }
    },
  },
})