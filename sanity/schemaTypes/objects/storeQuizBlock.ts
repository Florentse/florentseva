import {defineType, defineField} from 'sanity'

export const storeQuizBlock = defineType({
  name: 'storeQuizBlock',
  title: 'Store Quiz Block',
  type: 'object',
  fields: [
    defineField({name: 'heading', title: 'Heading', type: 'localeString'}),
    defineField({name: 'intro', title: 'Intro text', type: 'localeText'}),
    defineField({
      name: 'questions',
      title: 'Questions',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'quizQuestion',
          fields: [
            defineField({name: 'question', title: 'Question', type: 'localeString'}),
            defineField({
              name: 'options',
              title: 'Options',
              type: 'array',
              of: [{type: 'localeString'}],
            }),
          ],
          preview: {select: {title: 'question.en'}},
        },
      ],
    }),
    defineField({
      name: 'tiers',
      title: 'Recommended Builds (by score)',
      description:
        'Order from smallest to largest. Each answer\'s "score" is its position in its question\'s option list (1st option = 0, 2nd = 1, ...) — the total across all questions is matched against "Max Score" here. Leave "Max Score" empty on the last tier to use it as the catch-all for anything higher.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'quizTier',
          fields: [
            defineField({name: 'title', title: 'Tier Title', type: 'localeString'}),
            defineField({name: 'tagline', title: 'Tagline', type: 'localeString'}),
            defineField({name: 'price', title: 'Starting Price ($)', type: 'number'}),
            defineField({
              name: 'maxScore',
              title: 'Max Score',
              description: 'Leave empty for the top / unlimited tier.',
              type: 'number',
            }),
            defineField({
              name: 'timeline',
              title: 'Estimated Timeline',
              description: 'e.g. "~4-5 weeks" or "Scoped per project"',
              type: 'localeString',
            }),
          ],
          preview: {
            select: {title: 'title.en', subtitle: 'maxScore'},
          },
        },
      ],
    }),
  ],
  preview: {select: {title: 'heading.en'}},
})