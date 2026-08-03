import {defineType, defineField} from 'sanity'

const richTextWithHoverPhoto = {
  type: 'block',
  styles: [{title: 'Normal', value: 'normal'}],
  lists: [],
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
      {
        name: 'hoverPhoto',
        type: 'object',
        title: 'Hover Photo',
        description: 'Marks this text so the page photo (see "Photo" field below) pops up on hover.',
        fields: [
          defineField({
            name: 'isHoverPhoto',
            title: 'Hover Photo',
            type: 'boolean',
            initialValue: true,
            hidden: true,
          }),
        ],
      },
    ],
  },
}

export const about = defineType({
  name: 'about',
  title: 'About',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero'},
    {name: 'stats', title: 'Stats'},
    {name: 'inShort', title: 'In Short'},
    {name: 'awards', title: 'Awards'},
    {name: 'testimonials', title: 'Testimonials'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localeString',
      group: 'hero',
    }),
    defineField({
      name: 'intro',
      title: 'Intro Text',
      type: 'localeText',
      group: 'hero',
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      description: 'Shown as a hover preview over text marked with the "Hover Photo" annotation in the "In Short" items.',
      type: 'image',
      options: {hotspot: true},
      group: 'hero',
    }),

    defineField({
      name: 'stats',
      title: 'Stats',
      description: 'e.g. "5+ / years in design & development"',
      type: 'array',
      group: 'stats',
      of: [
        {
          type: 'object',
          name: 'statItem',
          fields: [
            defineField({name: 'value', title: 'Value (e.g. "5+", "100+", "50%")', type: 'string'}),
            defineField({name: 'label', title: 'Label', type: 'localeString'}),
          ],
          preview: {
            select: {title: 'value', subtitle: 'label.en'},
          },
        },
      ],
    }),

    defineField({
      name: 'inShortItems',
      title: 'In Short Items',
      description: 'e.g. "Background", "How I work", "When a project is bigger than one person"',
      type: 'array',
      group: 'inShort',
      of: [
        {
          type: 'object',
          name: 'aboutSectionItem',
          fields: [
            defineField({name: 'heading', title: 'Heading', type: 'localeString'}),
            defineField({
              name: 'body',
              title: 'Body',
              type: 'object',
              fields: [
                defineField({name: 'en', title: 'English', type: 'array', of: [richTextWithHoverPhoto]}),
                defineField({name: 'ru', title: 'Russian', type: 'array', of: [richTextWithHoverPhoto]}),
              ],
            }),
          ],
          preview: {
            select: {title: 'heading.en'},
          },
        },
      ],
    }),

    defineField({
      name: 'awards',
      title: 'Awards',
      description: 'Single-language content — fields here are not localized.',
      type: 'array',
      group: 'awards',
      of: [
        {
          type: 'object',
          name: 'awardItem',
          fields: [
            defineField({name: 'year', title: 'Year', type: 'string'}),
            defineField({name: 'title', title: 'Title (e.g. "Honorable Mention")', type: 'string'}),
            defineField({name: 'projectName', title: 'Project Name', type: 'string'}),
            defineField({name: 'platform', title: 'Platform (e.g. "Awwwards")', type: 'string'}),
            defineField({name: 'image', title: 'Image', type: 'image', options: {hotspot: true}}),
            defineField({name: 'url', title: 'URL', type: 'url'}),
          ],
          preview: {
            select: {title: 'title', subtitle: 'projectName', media: 'image'},
          },
        },
      ],
    }),

    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      description: 'Attribute via Client/Work references, or leave them empty and just write the name/role/note.',
      type: 'array',
      group: 'testimonials',
      of: [
        {
          type: 'object',
          name: 'testimonialItem',
          fields: [
            defineField({
              name: 'quote',
              title: 'Quote',
              type: 'localeText',
              validation: (Rule) => Rule.required(),
            }),
            defineField({name: 'authorName', title: 'Author Name', type: 'string'}),
            defineField({name: 'authorRole', title: 'Author Role (e.g. "Developer")', type: 'localeString'}),
            defineField({
              name: 'client',
              title: 'Client',
              description: 'Used to show the company name.',
              type: 'reference',
              to: [{type: 'client'}],
            }),
            defineField({
              name: 'work',
              title: 'Work',
              description: 'Used to show the project name.',
              type: 'reference',
              to: [{type: 'work'}],
            }),
            defineField({
              name: 'note',
              title: 'Note',
              description: 'Free-text alternative/addition to Client and Work, e.g. "worked together on a product team".',
              type: 'localeString',
            }),
          ],
          preview: {
            select: {title: 'authorName', subtitle: 'quote.en'},
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title.en',
    },
    prepare({title}) {
      return {title: title || 'About'}
    },
  },
})
