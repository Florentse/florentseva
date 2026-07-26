import {defineType, defineField} from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO & Open Graph',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'SEO Title', type: 'localeString'}),
    defineField({name: 'description', title: 'SEO Description', type: 'localeText'}),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      description: 'Recommended size: 1200×630px',
      type: 'image',
      options: {hotspot: true},
    }),
  ],
  preview: {
    select: {
      title: 'title.en',
      media: 'ogImage',
    },
  },
})