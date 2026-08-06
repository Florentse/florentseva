const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export async function verifyTurnstileToken(
  token: string,
  remoteip?: string,
): Promise<boolean> {
  const body = new URLSearchParams({
    secret: process.env.TURNSTILE_SECRET_KEY ?? '',
    response: token,
  })
  if (remoteip) body.set('remoteip', remoteip)

  try {
    const response = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })
    const data = await response.json()
    return data.success === true
  } catch {
    return false
  }
}
