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
  ],
  preview: {select: {title: 'heading.en'}},
})