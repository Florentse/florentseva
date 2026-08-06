export async function sendTelegramNotification({
  formId,
  text,
}: {
  formId: string
  text: string
}) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: `Новая заявка: ${formId}\n\n${text}`,
      }),
    },
  )

  if (!response.ok) {
    throw new Error(`Telegram request failed: ${response.status} ${await response.text()}`)
  }
}
