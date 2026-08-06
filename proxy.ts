import type { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

// Countries/regions where Russian is a common second language, in addition
// to actual Russian speakers — visitors whose browser reports any of these
// get the Russian version by default. Everyone else gets English.
const RU_SPHERE_LANGUAGES = ['ru', 'be', 'kk', 'uk', 'et', 'pl', 'lt']
const LOCALE_COOKIE_NAME = 'NEXT_LOCALE'

const intlMiddleware = createMiddleware(routing)

function detectLocale(request: NextRequest): 'en' | 'ru' {
  const acceptLanguage = request.headers.get('accept-language') ?? ''
  const preferredLanguages = acceptLanguage
    .split(',')
    .map((entry) => entry.split(';')[0]?.trim().toLowerCase().split('-')[0])

  const isRuSphere = preferredLanguages.some((lang) => lang && RU_SPHERE_LANGUAGES.includes(lang))
  return isRuSphere ? 'ru' : 'en'
}

export default function proxy(request: NextRequest) {
  // Only decide once — if the visitor already has a locale (from a previous
  // auto-detection or from manually switching), next-intl reads that cookie
  // itself and this whole block is skipped.
  const alreadyDecided = request.cookies.has(LOCALE_COOKIE_NAME)
  const detectedLocale = alreadyDecided ? null : detectLocale(request)

  if (detectedLocale) {
    // Seed it on the request too, so next-intl's own resolution for *this*
    // request agrees with the cookie we're about to send back.
    request.cookies.set(LOCALE_COOKIE_NAME, detectedLocale)
  }

  const response = intlMiddleware(request)

  if (detectedLocale) {
    // Setting request.cookies above only affects what next-intl sees for
    // this request — it doesn't send anything to the browser, so the
    // decision has to be persisted here explicitly.
    response.cookies.set(LOCALE_COOKIE_NAME, detectedLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    })
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|studio|.*\\..*).*)'],
}
