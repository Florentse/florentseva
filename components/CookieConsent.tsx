import { client } from "@/sanity/lib/client";
import { nbspDeep } from "@/lib/nbsp";
import CookieConsentClient from "./CookieConsentClient";

const COOKIE_CONSENT_QUERY = `*[_type == "siteSettings"][0].cookieConsent`;

export default async function CookieConsent({ locale }: { locale: string }) {
  const data = nbspDeep(await client.fetch(COOKIE_CONSENT_QUERY));

  if (!data) return null;

  return <CookieConsentClient locale={locale} data={data} />;
}
