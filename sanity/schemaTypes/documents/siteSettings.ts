import {defineType, defineField} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    {name: 'general', title: 'General'},
    {name: 'header', title: 'Header'},
    {name: 'footer', title: 'Footer'},
  ],
  fields: [
    defineField({
      name: 'favicon',
      title: 'Favicon',
      description: 'Square image, ideally 512×512px (used to generate all favicon sizes)',
      type: 'image',
      group: 'general',
    }),
    defineField({
      name: 'appleTouchIcon',
      title: 'Apple Touch Icon (web clip)',
      description: '180×180px, no transparency — shown when saved to home screen on iOS',
      type: 'image',
      group: 'general',
    }),
    defineField({
      name: 'defaultSeo',
      title: 'Default SEO & Open Graph',
      description: 'Fallback used when a page has no SEO fields filled in',
      type: 'seo',
      group: 'general',
    }),

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