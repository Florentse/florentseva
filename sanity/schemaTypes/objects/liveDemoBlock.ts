import {defineType, defineField} from 'sanity'

export const liveDemoBlock = defineType({
  name: 'liveDemoBlock',
  title: 'Live Demo Block',
  type: 'object',
  fields: [
    defineField({name: 'heading', title: 'Heading', type: 'localeString'}),
    defineField({name: 'description', title: 'Description', type: 'localeText'}),
    defineField({
      name: 'demoComponent',
      title: 'Demo Component',
      description: 'Which frontend demo component to render here — picked from a fixed set the dev maintains.',
      type: 'string',
      options: {
        list: [
          {title: 'Prize Wheel Popup', value: 'prizeWheel'},
          {title: 'Mortgage Calculator', value: 'mortgageCalculator'},
          {title: 'Multi-Step Quiz', value: 'multiStepQuiz'},
        ],
      },
    }),
  ],
  preview: {select: {title: 'heading.en'}},
})