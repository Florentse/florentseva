import type { Metadata } from "next";
import { Tektur } from "next/font/google";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import "./globals.css";

// Self-hosted by Next.js at build time — exposed as --font-tektur, used only
// for the logo (see --font-family-logo in styles/variables/typography.css).
const tektur = Tektur({
  subsets: ["latin"],
  variable: "--font-tektur",
});

const FAVICON_QUERY = `*[_type == "siteSettings"][0]{ faviconLight, faviconDark, appleTouchIcon }`;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await client.fetch(FAVICON_QUERY);

  const icons: Metadata["icons"] = {};
  const iconList: { url: string; media?: string }[] = [];

  if (settings?.faviconLight) {
    iconList.push({
      url: urlFor(settings.faviconLight).width(512).height(512).url(),
      media: "(prefers-color-scheme: light)",
    });
  }
  if (settings?.faviconDark) {
    iconList.push({
      url: urlFor(settings.faviconDark).width(512).height(512).url(),
      media: "(prefers-color-scheme: dark)",
    });
  }
  if (iconList.length > 0) icons.icon = iconList;
  if (settings?.appleTouchIcon) {
    icons.apple = urlFor(settings.appleTouchIcon).width(180).height(180).url();
  }

  return {
    title: "Tatiana Florentseva — Web Developer & Designer",
    description: "Freelance web developer and designer",
    icons,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={tektur.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}