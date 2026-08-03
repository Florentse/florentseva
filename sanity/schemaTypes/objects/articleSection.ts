import {defineType, defineField} from 'sanity'

const sectionRichText = {
  type: 'block',
  styles: [
    {title: 'Normal', value: 'normal'},
    {title: 'H3', value: 'h3'},
  ],
  lists: [
    {title: 'Bullet', value: 'bullet'},
    {title: 'Numbered', value: 'number'},
  ],
  marks: {
    decorators: [
      {title: 'Bold', value: 'strong'},
      {title: 'Italic', value: 'em'},
    ],
    annotations: [
      {
        name: 'link',
        type: 'object',
        title: 'Link',
        fields: [
          defineField({
            name: 'href',
            title: 'URL',
            type: 'url',
            validation: (Rule) =>
              Rule.uri({scheme: ['http', 'https', 'mailto'], allowRelative: true}),
          }),
        ],
      },
    ],
  },
}

export const articleSection = defineType({
  name: 'articleSection',
  title: 'Section',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading (H2)',
      description: 'Also used as the label in the in-page navigation (aside).',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'object',
      fields: [
        defineField({
          name: 'en',
          title: 'English',
          type: 'array',
          of: [sectionRichText, {type: 'image', options: {hotspot: true}}],
        }),
        defineField({
          name: 'ru',
          title: 'Russian',
          type: 'array',
          of: [sectionRichText, {type: 'image', options: {hotspot: true}}],
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'heading.en'},
  },

  
})

export const connectionsGridBlock = defineType({
  name: 'connectionsGridBlock',
  title: 'Connections Grid Block',
  type: 'object',
  fields: [
    defineField({name: 'heading', title: 'Heading', type: 'localeString'}),
    defineField({name: 'intro', title: 'Intro text', type: 'localeText'}),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [{type: 'headingParagraphItem'}],
    }),
  ],
  preview: {select: {title: 'heading.en'}},
})