import {defineType, defineField} from 'sanity'

export const localePortableText = defineType({
  name: 'localePortableText',
  title: 'Localized Portable Text',
  type: 'object',
  fields: [
    defineField({
      name: 'en',
      title: 'English',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'ru',
      title: 'Russian',
      type: 'array',
      of: [{type: 'block'}],
    }),
  ],
})