import { randomUUID } from 'node:crypto'
import { writeClient } from '@/sanity/lib/writeClient'
import type { FormAnswer } from './formAnswers'

export async function findOrCreateContactPerson({
  email,
  name,
  telegram,
  company,
}: {
  email: string
  name?: string
  telegram?: string
  company?: string
}): Promise<string> {
  const normalizedEmail = email.trim().toLowerCase()

  const existing = await writeClient.fetch<{ _id: string } | null>(
    `*[_type == "contactPerson" && lower(email) == $email][0]{ _id }`,
    { email: normalizedEmail },
  )

  if (existing) {
    const patch: Record<string, string> = {}
    if (name) patch.name = name
    if (telegram) patch.telegram = telegram
    if (company) patch.company = company

    if (Object.keys(patch).length > 0) {
      await writeClient.patch(existing._id).set(patch).commit()
    }

    return existing._id
  }

  const created = await writeClient.create({
    _type: 'contactPerson',
    email: normalizedEmail,
    name,
    telegram,
    company,
    firstSeenAt: new Date().toISOString(),
  })

  return created._id
}

export async function createFormRequest({
  contactId,
  serviceSlug,
  formId,
  answers,
}: {
  contactId: string
  serviceSlug?: string
  formId: string
  answers: FormAnswer[]
}) {
  let serviceRef: { _type: 'reference'; _ref: string } | undefined

  if (serviceSlug) {
    const service = await writeClient.fetch<{ _id: string } | null>(
      `*[_type == "service" && slug.current == $slug][0]{ _id }`,
      { slug: serviceSlug },
    )
    if (service) {
      serviceRef = { _type: 'reference', _ref: service._id }
    }
  }

  return writeClient.create({
    _type: 'formRequest',
    contact: { _type: 'reference', _ref: contactId },
    service: serviceRef,
    formId,
    answers: answers.map((answer) => ({
      _key: randomUUID(),
      _type: 'object',
      fieldId: answer.fieldId,
      label: answer.label,
      value:
        typeof answer.value === 'boolean'
          ? answer.value
            ? 'true'
            : 'false'
          : answer.value,
    })),
    status: 'new',
    submittedAt: new Date().toISOString(),
  })
}
