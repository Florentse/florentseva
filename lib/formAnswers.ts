export type FormAnswer = {
  fieldId: string
  label: string
  value: string | boolean
}

// These show first (and in this order) in notifications, since they're what you need to reply to a lead.
const CONTACT_FIELD_ORDER = ['name', 'email', 'telegram', 'company']

function formatValue(value: string | boolean): string {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  return value.trim() || '—'
}

export function getAnswerValue(answers: FormAnswer[], fieldId: string): string {
  const found = answers.find((answer) => answer.fieldId === fieldId)
  return typeof found?.value === 'string' ? found.value.trim() : ''
}

export function formatAnswersText(answers: FormAnswer[]): string {
  const contactAnswers = CONTACT_FIELD_ORDER.map((fieldId) =>
    answers.find((answer) => answer.fieldId === fieldId),
  ).filter((answer): answer is FormAnswer => Boolean(answer))

  const otherAnswers = answers.filter(
    (answer) => !CONTACT_FIELD_ORDER.includes(answer.fieldId),
  )

  return [...contactAnswers, ...otherAnswers]
    .map((answer) => `${answer.label}: ${formatValue(answer.value)}`)
    .join('\n')
}
