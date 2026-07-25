import {defineType, defineField} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    {name: 'header', title: 'Header'},
    {name: 'footer', title: 'Footer'},
  ],
  fields: [
    defineField({
      name: 'logoText',
      title: 'Logo Text',
      type: 'string',
      group: 'header',
    }),
    defineField({
      name: 'navItems',
      title: 'Navigation Items',
      description: 'Include the CTA as the last item in this list',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'navItem',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'localeString'}),
            defineField({name: 'url', title: 'URL', type: 'string'}),
          ],
          preview: {
            select: {title: 'label.en', subtitle: 'url'},
          },
        },
      ],
      group: 'header',
    }),

    defineField({
      name: 'footerText',
      title: 'Footer Text',
      type: 'localeText',
      group: 'footer',
    }),
    defineField({
      name: 'footerEmail',
      title: 'Contact Email',
      type: 'string',
      group: 'footer',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'socialLink',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'string'}),
            defineField({name: 'url', title: 'URL', type: 'url'}),
          ],
        },
      ],
      group: 'footer',
    }),
    defineField({
      name: 'footerNavItems',
      title: 'Footer Navigation Items',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'footerNavItem',
          fields: [
            defineField({name: 'label', title: 'Label', type: 'localeString'}),
            defineField({name: 'url', title: 'URL', type: 'string'}),
          ],
          preview: {
            select: {title: 'label.en', subtitle: 'url'},
          },
        },
      ],
      group: 'footer',
    }),
    defineField({
      name: 'copyrightText',
      title: 'Copyright Text',
      type: 'localeString',
      group: 'footer',
    }),
  ],
})