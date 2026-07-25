import {defineType, defineField} from 'sanity'

export const faqItem = defineType({
  name: 'faqItem',
  title: 'FAQ Item',
  type: 'object',
  fields: [
    defineField({name: 'question', title: 'Question', type: 'localeString'}),
    defineField({name: 'answer', title: 'Answer', type: 'localeText'}),
  ],
  preview: {
    select: {title: 'question.en'},
  },
})