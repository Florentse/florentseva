// components/Header.tsx
import { client } from "@/sanity/lib/client";
import HeaderClient from "./HeaderClient";

const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  logoText,
  navItems[]{ label, url }
}`;

export default async function Header({ locale }: { locale: string }) {
  const settings = await client.fetch(SITE_SETTINGS_QUERY);

  return (
    <HeaderClient
      logoText={settings?.logoText}
      navItems={settings?.navItems ?? []}
      locale={locale}
    />
  );
}