import {defineType, defineField} from 'sanity'

export const checklistBlock = defineType({
  name: 'checklistBlock',
  title: 'Checklist Block',
  type: 'object',
  fields: [
    defineField({name: 'heading', title: 'Heading', type: 'localeString'}),
    defineField({name: 'intro', title: 'Intro text', type: 'localeText'}),
    defineField({
      name: 'items',
      title: 'Checklist Items',
      type: 'array',
      of: [{type: 'localeString'}],
    }),
    defineField({
      name: 'lowScoreHeading',
      title: 'Heading shown if not all checked',
      type: 'localeString',
    }),
    defineField({
      name: 'lowScoreText',
      title: 'Text shown if not all checked',
      type: 'localeText',
    }),
    defineField({
      name: 'highScoreHeading',
      title: 'Heading shown if all checked',
      type: 'localeString',
    }),
    defineField({
      name: 'highScoreText',
      title: 'Text shown if all checked',
      type: 'localeText',
    }),
  ],
  preview: {
    select: {title: 'heading.en'},
  },
})