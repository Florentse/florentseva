// pageAnatomyBlock.ts

import {defineType, defineField} from 'sanity'

export const pageAnatomyBlock = defineType({
  name: 'pageAnatomyBlock',
  title: 'Page Anatomy Block',
  type: 'object',
  fields: [
    defineField({name: 'heading', title: 'Heading', type: 'localeString'}),
    defineField({name: 'intro', title: 'Intro text', type: 'localeText'}),
    defineField({
      name: 'items',
      title: 'Page Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'pageAnatomyItem',
          fields: [
            defineField({name: 'name', title: 'Section Name', type: 'localeString'}),
            defineField({name: 'description', title: 'Description', type: 'localeText'}),
            defineField({
              name: 'includedInBase',
              title: 'Included in Base Package',
              description: 'On — solid section. Off — dashed, extends the page for bigger launches.',
              type: 'boolean',
              initialValue: true,
            }),
          ],
          preview: {
            select: {title: 'name.en', subtitle: 'includedInBase'},
          },
        },
      ],
    }),
  ],
  preview: {select: {title: 'heading.en'}},
})