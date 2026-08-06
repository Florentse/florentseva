// sanity/lib/schemaTypes/documents/contactPerson.ts

import {defineType, defineField} from 'sanity'

export const contactPerson = defineType({
  name: 'contactPerson',
  title: 'Contact Person',
  type: 'document',
  fields: [
    defineField({name: 'email', title: 'Email', type: 'string', validation: r => r.required()}),
    defineField({name: 'name', title: 'Name', type: 'string'}),
    defineField({name: 'telegram', title: 'Telegram', type: 'string'}),
    defineField({name: 'company', title: 'Company', type: 'string'}),
    defineField({name: 'firstSeenAt', title: 'First Seen', type: 'datetime'}),
  ],
  preview: {select: {title: 'name', subtitle: 'email'}},
})