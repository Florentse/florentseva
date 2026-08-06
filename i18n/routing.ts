import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'ru'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
  // Reads the NEXT_LOCALE cookie (see proxy.ts, which seeds it on a
  // visitor's first request) and remembers it — a manual switch via the
  // language button persists across visits too, same mechanism.
  localeDetection: true,
})