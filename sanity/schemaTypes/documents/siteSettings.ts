import {defineType, defineField} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    {name: 'general', title: 'General'},
    {name: 'header', title: 'Header'},
    {name: 'footer', title: 'Footer'},
    {name: 'cookies', title: 'Cookies'},
    {name: 'analytics', title: 'Analytics'},
  ],
  fields: [
    defineField({
      name: 'faviconLight',
      title: 'Favicon — for light browser theme',
      description:
        'Shown when the visitor\'s browser/OS is in light mode — use a DARK icon so it stays visible against the light tab bar. Square, ideally 512×512px.',
      type: 'image',
      group: 'general',
    }),
    defineField({
      name: 'faviconDark',
      title: 'Favicon — for dark browser theme',
      description:
        'Shown when the visitor\'s browser/OS is in dark mode — use a LIGHT icon so it stays visible against the dark tab bar. Square, ideally 512×512px.',
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

    defineField({
      name: 'cookieConsent',
      title: 'Cookie Consent',
      type: 'object',
      group: 'cookies',
      fields: [
        // — Banner —
        defineField({name: 'bannerTitle', title: 'Banner Title', type: 'localeString'}),
        defineField({name: 'bannerText', title: 'Banner Text', type: 'localeText'}),
        defineField({name: 'acceptAllLabel', title: 'Accept All — Button', type: 'localeString'}),
        defineField({name: 'rejectAllLabel', title: 'Reject All — Button', type: 'localeString'}),
        defineField({name: 'customizeLabel', title: 'Customize — Button', type: 'localeString'}),
        // — Settings modal —
        defineField({name: 'modalTitle', title: 'Modal Title', type: 'localeString'}),
        defineField({name: 'modalText', title: 'Modal Text', type: 'localeText'}),
        defineField({name: 'savePreferencesLabel', title: 'Save Preferences — Button', type: 'localeString'}),
        // — Categories (the checkboxes) —
        defineField({
          name: 'categories',
          title: 'Cookie Categories',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'cookieCategory',
              fields: [
                defineField({
                  name: 'key',
                  title: 'Key',
                  description: 'Machine name, e.g. necessary, analytics',
                  type: 'string',
                }),
                defineField({name: 'title', title: 'Title', type: 'localeString'}),
                defineField({name: 'description', title: 'Description', type: 'localeText'}),
                defineField({
                  name: 'required',
                  title: 'Always active (cannot be disabled)',
                  type: 'boolean',
                  initialValue: false,
                }),
              ],
              preview: {
                select: {title: 'title.en', subtitle: 'key'},
              },
            },
          ],
        }),
      ],
    }),

    defineField({
      name: 'googleAnalyticsId',
      title: 'Google Analytics — Measurement ID',
      description: 'GA4 Measurement ID, e.g. G-XXXXXXXXXX. Loads only after the visitor accepts Analytics cookies.',
      type: 'string',
      group: 'analytics',
    }),
    defineField({
      name: 'clarityId',
      title: 'Microsoft Clarity — Project ID',
      description: 'Project ID from Microsoft Clarity. Loads only after the visitor accepts Analytics cookies.',
      type: 'string',
      group: 'analytics',
    }),
    defineField({
      name: 'yandexMetricaId',
      title: 'Yandex Metrica — Counter ID',
      description: 'Numeric counter ID from Yandex Metrica. Loads only after the visitor accepts Analytics cookies.',
      type: 'string',
      group: 'analytics',
    }),
  ],
})