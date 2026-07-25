import {defineType, defineField} from 'sanity'

export const work = defineType({
  name: 'work',
  title: 'Work',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero'},
    {name: 'meta', title: 'Meta'},
    {name: 'overview', title: 'Overview'},
    {name: 'scope', title: 'Scope of Work'},
    {name: 'card', title: 'Card'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'hero',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (Rule) => Rule.required(),
      group: 'hero',
    }),
    defineField({
      name: 'heroDescription',
      title: 'Hero Description',
      type: 'localeText',
      group: 'hero',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {hotspot: true},
      group: 'hero',
    }),

    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'service'}]}],
      group: 'meta',
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'reference',
      to: [{type: 'client'}],
      group: 'meta',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      group: 'meta',
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      group: 'meta',
    }),
    defineField({
      name: 'stack',
      title: 'Stack',
      type: 'array',
      of: [{type: 'string'}],
      group: 'meta',
    }),
    defineField({
      name: 'liveUrl',
      title: 'Live URL',
      type: 'url',
      group: 'meta',
    }),

    defineField({
      name: 'overviewBody',
      title: 'Overview',
      type: 'localePortableText',
      group: 'overview',
    }),
    defineField({
      name: 'kinescopeVideoUrl',
      title: 'Kinescope Video URL',
      description: 'Leave empty if no video for this case',
      type: 'url',
      group: 'overview',
    }),

    defineField({
      name: 'scopeOfWork',
      title: 'Scope of Work',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'scopeItem',
          fields: [
            defineField({name: 'heading', title: 'Heading (h3)', type: 'localeString'}),
            defineField({name: 'description', title: 'Description', type: 'localeText'}),
          ],
          preview: {
            select: {title: 'heading.en'},
          },
        },
      ],
      group: 'scope',
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
      group: 'scope',
    }),

defineField({
      name: 'cardImage',
      title: 'Card Image (small card)',
      description: 'Used for regular small cards — Home, Related Works',
      type: 'image',
      options: {hotspot: true},
      group: 'card',
    }),
    defineField({
      name: 'cardImages',
      title: 'Card Images (slider card)',
      description: 'Up to 4 images used for the slider card on the Works listing page',
      type: 'array',
      of: [{type: 'image', options: {hotspot: true}}],
      validation: (Rule) => Rule.max(4),
      group: 'card',
    }),
    defineField({
      name: 'cardDescription',
      title: 'Card Description (slider card)',
      type: 'localeText',
      group: 'card',
    }),

    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first',
      group: 'card',
    }),
    defineField({
      name: 'showOnHome',
      title: 'Show on Home page',
      type: 'boolean',
      initialValue: false,
      group: 'card',
    }),
  ],
  orderings: [
    {
      title: 'Sort Order',
      name: 'sortOrderAsc',
      by: [{field: 'sortOrder', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'heroImage',
    },
  },
})