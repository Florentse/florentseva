import {defineType, defineField} from 'sanity'

export const home = defineType({
  name: 'home',
  title: 'Home',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero'},
    {name: 'works', title: 'Works Section'},
    {name: 'clients', title: 'Clients Section'},
    {name: 'services', title: 'Services Section'},
    {name: 'products', title: 'Products Section'},
    {name: 'blog', title: 'Blog Section'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Hero Title (h1)',
      type: 'localeString',
      group: 'hero',
    }),

    defineField({name: 'worksHeading', title: 'Heading', type: 'localeString', group: 'works'}),
    defineField({name: 'worksText', title: 'Text', type: 'localeText', group: 'works'}),
    defineField({name: 'worksLinkLabel', title: 'Link Label', type: 'localeString', group: 'works'}),
    defineField({
      name: 'selectedWorks',
      title: 'Selected Works',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'work'}]}],
      validation: (Rule) => Rule.max(3),
      group: 'works',
    }),

    defineField({name: 'clientsHeading', title: 'Heading', type: 'localeString', group: 'clients'}),
    defineField({
      name: 'selectedClients',
      title: 'Selected Clients',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'client'}]}],
      validation: (Rule) => Rule.max(6),
      group: 'clients',
    }),

    defineField({name: 'servicesHeading', title: 'Heading', type: 'localeString', group: 'services'}),
    defineField({name: 'servicesLinkLabel', title: 'Link Label', type: 'localeString', group: 'services'}),
    defineField({
      name: 'selectedServices',
      title: 'Selected Services',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'service'}]}],
      group: 'services',
    }),

    defineField({name: 'productsHeading', title: 'Heading', type: 'localeString', group: 'products'}),
    defineField({name: 'productsLinkLabel', title: 'Link Label', type: 'localeString', group: 'products'}),
    defineField({
      name: 'selectedProducts',
      title: 'Selected Products',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'product'}]}],
      group: 'products',
    }),

    defineField({name: 'blogHeading', title: 'Heading', type: 'localeString', group: 'blog'}),
    defineField({name: 'blogLinkLabel', title: 'Link Label', type: 'localeString', group: 'blog'}),
    defineField({
      name: 'selectedArticles',
      title: 'Selected Articles',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'article'}]}],
      group: 'blog',
    }),

    defineField({
      name: 'seo',
      title: 'SEO & Open Graph',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'heroTitle.en',
    },
    prepare({title}) {
      return {title: title || 'Home'}
    },
  },
})