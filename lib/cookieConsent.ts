// Reads/writes the visitor's cookie consent choice. A future analytics/GTM
// loader can call hasConsentFor("analytics" | "marketing") before injecting
// any script, and listen for CONSENT_CHANGE_EVENT to react live when the
// visitor updates their preferences without a page reload.
const STORAGE_KEY = "cookieConsent";
export const CONSENT_CHANGE_EVENT = "cookie-consent-change";
// Dispatched by any trigger (e.g. a footer link) that wants to reopen the
// settings modal, without needing a direct reference to the component that owns it.
export const OPEN_CONSENT_SETTINGS_EVENT = "cookie-consent-open-settings";

export type ConsentState = Record<string, boolean>;

// Cached by raw string so repeated calls return the same object reference
// when nothing changed — required for useSyncExternalStore to avoid
// re-rendering (or looping) on every render.
let cachedRaw: string | null = null;
let cachedParsed: ConsentState | null = null;

export function getStoredConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedParsed;

  cachedRaw = raw;
  try {
    cachedParsed = raw ? (JSON.parse(raw) as ConsentState) : null;
  } catch {
    cachedParsed = null;
  }
  return cachedParsed;
}

export function getStoredConsentServerSnapshot(): ConsentState | null {
  return null;
}

export function saveConsent(consent: ConsentState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: consent }));
}

export function hasConsentFor(categoryKey: string): boolean {
  return getStoredConsent()?.[categoryKey] === true;
}
