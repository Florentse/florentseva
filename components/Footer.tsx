import { client } from "@/sanity/lib/client";
import { nbspDeep } from "@/lib/nbsp";
import FooterClient from "./FooterClient";

const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  logoText,
  footerNavItems[]{ label, url }
}`;

export default async function Footer({ locale }: { locale: string }) {
  const settings = nbspDeep(await client.fetch(SITE_SETTINGS_QUERY));

  return (
    <FooterClient
      logoText={settings?.logoText}
      footerNavItems={settings?.footerNavItems ?? []}
      locale={locale}
    />
  );
}
