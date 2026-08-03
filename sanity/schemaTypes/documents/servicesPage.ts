import {defineType, defineField} from 'sanity'

export const servicesPage = defineType({
  name: 'servicesPage',
  title: 'Services Page',
  type: 'document',
  fields: [
    defineField({
      name: 'intro',
      title: 'Intro Text',
      type: 'localeText',
      description: 'Paragraph shown at the top of the /services page.',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Services Page'}
    },
  },
})