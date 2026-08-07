import {defineType, defineField} from 'sanity'

export const cookiesPolicy = defineType({
  name: 'cookiesPolicy',
  title: 'Cookies Policy',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localeString',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'localePortableText',
    }),
  ],
  preview: {
    select: {
      title: 'title.en',
    },
    prepare({title}) {
      return {title: title || 'Cookies Policy'}
    },
  },
})
