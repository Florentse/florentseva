import {defineType, defineField} from 'sanity'

export const article = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title.en'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description (SEO)',
      description: 'Short summary for search engines and social previews — not shown on the blog listing cards.',
      type: 'localeText',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'blogCategory'}],
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      description: 'Article body broken into H2 sections. Section headings are also used to build the in-page navigation (aside).',
      type: 'array',
      of: [{type: 'articleSection'}],
    }),
  ],
  preview: {
    select: {
      title: 'title.en',
      subtitle: 'publishedAt',
      media: 'coverImage',
    },
    prepare({title, subtitle, media}) {
      return {
        title,
        subtitle: subtitle ? new Date(subtitle).toLocaleDateString() : 'No date',
        media,
      }
    },
  },
})