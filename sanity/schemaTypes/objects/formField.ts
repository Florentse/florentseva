import {defineType, defineField} from 'sanity'

export const formField = defineType({
  name: 'formField',
  title: 'Form Field',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fieldId',
      title: 'Field ID',
      description: 'Stable machine name for this field, used in automations (e.g. "budget_range").',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fieldType',
      title: 'Field Type',
      type: 'string',
      options: {
        list: [
          {title: 'Text', value: 'text'},
          {title: 'Email', value: 'email'},
          {title: 'Phone', value: 'tel'},
          {title: 'Textarea', value: 'textarea'},
          {title: 'Select (single choice)', value: 'select'},
          {title: 'URL', value: 'url'},
          {title: 'Number', value: 'number'},
          {title: 'File upload', value: 'file'},
          {title: 'Checkbox', value: 'checkbox'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'placeholder',
      title: 'Placeholder',
      type: 'localeString',
    }),
    defineField({
      name: 'options',
      title: 'Options (for Select fields)',
      type: 'array',
      of: [{type: 'localeString'}],
      hidden: ({parent}) => parent?.fieldType !== 'select',
    }),
    defineField({
      name: 'width',
      title: 'Width',
      description: 'Full row (1 per row) or half row (2 fields side by side).',
      type: 'string',
      options: {
        list: [
          {title: 'Full row', value: 'full'},
          {title: 'Half row', value: 'half'},
        ],
        layout: 'radio',
      },
      initialValue: 'full',
    }),
    defineField({
      name: 'required',
      title: 'Required',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {title: 'label.en', subtitle: 'fieldType'},
  },
})