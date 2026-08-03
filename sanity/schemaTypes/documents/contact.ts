//sanity/schemaTypes/documents/contact.ts

import {defineType, defineField} from 'sanity'

export const contact = defineType({
  name: 'contact',
  title: 'Contact',
  type: 'document',
  groups: [
    {name: 'hero', title: 'Hero'},
    {name: 'methods', title: 'Contact Methods'},
    {name: 'form', title: 'Form'},
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
      title: 'Intro text',
      type: 'localeText',
      group: 'hero',
    }),

    defineField({
      name: 'contactMethods',
      title: 'Contact Methods',
      description: 'The cards shown under the hero (e.g. Telegram, Email, Calendly).',
      type: 'array',
      group: 'methods',
      of: [
        {
          type: 'object',
          name: 'contactMethod',
          fields: [
            defineField({name: 'label', title: 'Label (e.g. "Telegram")', type: 'localeString'}),
            defineField({name: 'value', title: 'Value (e.g. "@handle")', type: 'localeString'}),
            defineField({name: 'description', title: 'Description', type: 'localeText'}),
            defineField({name: 'ctaLabel', title: 'CTA Label', type: 'localeString'}),
            defineField({name: 'url', title: 'URL', type: 'string'}),
          ],
          preview: {
            select: {title: 'label.en', subtitle: 'value.en'},
          },
        },
      ],
    }),

    defineField({
      name: 'formHeading',
      title: 'Form Heading',
      type: 'localeString',
      group: 'form',
    }),
    defineField({
      name: 'formDescription',
      title: 'Form Description',
      type: 'localeText',
      group: 'form',
    }),
    defineField({
      name: 'formFields',
      title: 'Form Fields',
      type: 'array',
      of: [{type: 'formField'}],
      group: 'form',
    }),
    defineField({
      name: 'privacyLabel',
      title: 'Privacy Consent Label',
      type: 'localeString',
      group: 'form',
    }),
    defineField({
      name: 'submitLabel',
      title: 'Submit Button Label',
      type: 'localeString',
      group: 'form',
    }),
  ],
  preview: {
    select: {
      title: 'title.en',
    },
    prepare({title}) {
      return {title: title || 'Contact'}
    },
  },
})
