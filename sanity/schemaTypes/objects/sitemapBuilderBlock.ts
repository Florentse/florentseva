import {defineType, defineField} from 'sanity'

export const sitemapBuilderBlock = defineType({
  name: 'sitemapBuilderBlock',
  title: 'Sitemap Builder Block',
  type: 'object',
  fields: [
    defineField({name: 'heading', title: 'Heading', type: 'localeString'}),
    defineField({name: 'intro', title: 'Intro text', type: 'localeText'}),
    defineField({
      name: 'pages',
      title: 'Page Options',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'sitemapPageItem',
          fields: [
            defineField({name: 'name', title: 'Page Name', type: 'localeString'}),
            defineField({name: 'description', title: 'Description', type: 'localeText'}),
            defineField({
              name: 'alwaysIncluded',
              title: 'Always Included',
              description: 'e.g. Home page — checked and locked by default in the builder UI.',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {select: {title: 'name.en'}},
        },
      ],
    }),
  ],
  preview: {select: {title: 'heading.en'}},
})