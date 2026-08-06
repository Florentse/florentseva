// Used to build canonical/Open Graph URLs and share links. Safe to read on
// the client too (NEXT_PUBLIC_-prefixed), with the production domain as a
// sane default when no env var is set.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://florentseva.com'
