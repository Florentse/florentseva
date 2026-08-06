// sanity/lib/schemaTypes/documents/formRequests.ts

import {defineType, defineField} from 'sanity'

export const formRequest = defineType({
  name: 'formRequest',
  title: 'Form Request',
  type: 'document',
  fields: [
    defineField({
      name: 'contact',
      title: 'Contact',
      type: 'reference',
      to: [{type: 'contactPerson'}],
      validation: (r) => r.required(),
      readOnly: true,
    }),
    defineField({
      name: 'service',
      title: 'Service',
      type: 'reference',
      to: [{type: 'service'}],
      readOnly: true,
    }),
    defineField({name: 'formId', title: 'Form ID', type: 'string', readOnly: true}),
    defineField({
      name: 'answers',
      title: 'Answers',
      type: 'array',
      readOnly: true,
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'fieldId', title: 'Field ID', type: 'string', readOnly: true}),
            defineField({name: 'label', title: 'Label', type: 'string', readOnly: true}),
            defineField({name: 'value', title: 'Value', type: 'text', readOnly: true}),
          ],
        },
      ],
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {list: ['new', 'contacted', 'won', 'lost']},
      initialValue: 'new',
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      readOnly: true,
    }),
  ],
  preview: {
    select: {title: 'formId', subtitle: 'submittedAt'},
  },
})