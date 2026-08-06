const RESEND_URL = 'https://api.resend.com/emails'
const NOTIFICATION_TO = 'contact@florentseva.com'
const NOTIFICATION_FROM = 'Florentseva Forms <forms@florentseva.com>'
const PRIZE_WHEEL_FROM = 'Florentseva <forms@florentseva.com>'

export async function sendNotificationEmail({
  formId,
  text,
}: {
  formId: string
  text: string
}) {
  const response = await fetch(RESEND_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: NOTIFICATION_FROM,
      to: NOTIFICATION_TO,
      subject: `Новая заявка: ${formId}`,
      text,
    }),
  })

  if (!response.ok) {
    throw new Error(`Resend request failed: ${response.status} ${await response.text()}`)
  }
}

// Sent to the site visitor themselves after they claim a prize wheel result.
// The copy says outright that it's a test/demo, not a real store offer — this
// goes to a real inbox the visitor typed in, so it must not read as a
// genuine discount they can redeem.
export async function sendPrizeWinEmail({
  to,
  name,
  locale,
  prizeLabel,
}: {
  to: string
  name?: string
  locale: string
  prizeLabel: string
}) {
  const isRu = locale === 'ru'
  const trimmedName = name?.trim()
  const greeting = isRu
    ? trimmedName
      ? `Здравствуйте, ${trimmedName}!`
      : 'Здравствуйте!'
    : trimmedName
      ? `Hello, ${trimmedName}!`
      : 'Hello!'

  const subject = isRu ? `Ваш приз: ${prizeLabel}` : `Your prize: ${prizeLabel}`
  const text = isRu
    ? `${greeting}\n\nЭто письмо пришло вам после заполнения формы на сайте florentseva.com при тестировании виджета «Колесо удачи». Ваш приз: ${prizeLabel}.\n\nЭто демонстрационное письмо — реальный приз здесь не начисляется.\n\nЕсли вас интересует разработка похожего кастомного функционала для вашего сайта, пожалуйста, свяжитесь с нами напрямую по email contact@florentseva.com или в Telegram @florentsevat, чтобы обсудить детали.`
    : `${greeting}\n\nThis email was sent to you after filling out the form while testing the "Prize Wheel" widget on florentseva.com. Your prize: ${prizeLabel}.\n\nThis is a demo email — no real prize is issued here.\n\nIf you're interested in building custom functionality like this for your own site, please reach out to us directly at contact@florentseva.com or on Telegram at @florentsevat to discuss the details.`

  const response = await fetch(RESEND_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: PRIZE_WHEEL_FROM,
      to,
      subject,
      text,
    }),
  })

  if (!response.ok) {
    throw new Error(`Resend request failed: ${response.status} ${await response.text()}`)
  }
}
