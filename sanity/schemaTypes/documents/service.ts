import {defineType, defineField} from 'sanity'

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  groups: [
    {name: 'main', title: 'Main'},
    {name: 'content', title: 'Content'},
    {name: 'pricing', title: 'Pricing'},
    {name: 'cases', title: 'Case Studies'},
    {name: 'faq', title: 'FAQ'},
    {name: 'related', title: 'Related'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
      group: 'main',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title.en'},
      validation: (Rule) => Rule.required(),
      group: 'main',
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'localeText',
      group: 'main',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt (for listing card)',
      type: 'localeText',
      group: 'main',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'serviceCategory'}],
      group: 'main',
    }),

    defineField({
      name: 'opportunity',
      title: 'The Opportunity',
      type: 'array',
      of: [{type: 'headingParagraphItem'}],
      group: 'content',
    }),
    defineField({
      name: 'solutions',
      title: 'Solutions & Capabilities',
      type: 'array',
      of: [{type: 'headingParagraphItem'}],
      group: 'content',
    }),
    defineField({
      name: 'stages',
      title: 'Stages of Work',
      description: 'Ordered list',
      type: 'array',
      of: [{type: 'headingParagraphItem'}],
      group: 'content',
    }),
    defineField({
      name: 'outcomes',
      title: 'Outcomes',
      type: 'localeText',
      group: 'content',
    }),

    defineField({
      name: 'pricing',
      title: 'Pricing Tiers',
      description: 'Up to 3 tiers — structure TBD, coming back to this later',
      type: 'array',
      of: [{type: 'object', name: 'pricingTier', fields: [{name: 'title', type: 'string'}]}],
      validation: (Rule) => Rule.max(3),
      group: 'pricing',
    }),

    defineField({
      name: 'caseStudies',
      title: 'Case Studies',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'work'}]}],
      group: 'cases',
    }),

    defineField({
      name: 'faq',
      title: 'FAQ',
      type: 'array',
      of: [{type: 'faqItem'}],
      group: 'faq',
    }),

    defineField({
      name: 'relatedServices',
      title: 'Related Services',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'service'}]}],
      group: 'related',
    }),
  ],
  preview: {
    select: {
      title: 'title.en',
      subtitle: 'slug.current',
    },
  },
})