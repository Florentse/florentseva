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
    defineField({
      name: 'tiers',
      title: 'Pricing Tiers (by page count)',
      description:
        'Order from smallest to largest. The result shows the first tier whose "Max Pages" covers the selected page count — leave "Max Pages" empty on the last tier to use it as the catch-all for anything larger.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'sitemapTier',
          fields: [
            defineField({name: 'title', title: 'Tier Title', type: 'localeString'}),
            defineField({name: 'price', title: 'Starting Price ($)', type: 'number'}),
            defineField({
              name: 'maxPages',
              title: 'Max Pages',
              description: 'Leave empty for the top / unlimited tier.',
              type: 'number',
            }),
            defineField({
              name: 'timeline',
              title: 'Estimated Timeline',
              description: 'e.g. "~3 weeks" or "Scoped per project"',
              type: 'localeString',
            }),
          ],
          preview: {
            select: {title: 'title.en', subtitle: 'maxPages'},
          },
        },
      ],
    }),
  ],
  preview: {select: {title: 'heading.en'}},
})