import {defineType, defineField} from 'sanity'

export const scopeBuilderBlock = defineType({
  name: 'scopeBuilderBlock',
  title: 'Scope Builder Block',
  type: 'object',
  fields: [
    defineField({name: 'heading', title: 'Heading', type: 'localeString'}),
    defineField({name: 'intro', title: 'Intro text', type: 'localeText'}),
    defineField({
      name: 'items',
      title: 'Feature Options',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'scopeItem',
          fields: [
            defineField({name: 'name', title: 'Feature Name', type: 'localeString'}),
            defineField({name: 'description', title: 'Description', type: 'localeText'}),
            defineField({
              name: 'alwaysIncluded',
              title: 'Always Included',
              description: 'On — checked and locked by default in the builder UI.',
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
      title: 'Pricing Tiers (by feature count)',
      description:
        'Order from smallest to largest. The result shows the first tier whose "Max Features" covers the selected count — leave "Max Features" empty on the last tier to use it as the catch-all for anything larger.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'scopeTier',
          fields: [
            defineField({name: 'title', title: 'Tier Title', type: 'localeString'}),
            defineField({name: 'price', title: 'Starting Price ($)', type: 'number'}),
            defineField({
              name: 'maxFeatures',
              title: 'Max Features',
              description: 'Leave empty for the top / unlimited tier.',
              type: 'number',
            }),
            defineField({
              name: 'timeline',
              title: 'Estimated Timeline',
              description: 'e.g. "~2-3 weeks" or "Scoped per project"',
              type: 'localeString',
            }),
          ],
          preview: {
            select: {title: 'title.en', subtitle: 'maxFeatures'},
          },
        },
      ],
    }),
  ],
  preview: {select: {title: 'heading.en'}},
})