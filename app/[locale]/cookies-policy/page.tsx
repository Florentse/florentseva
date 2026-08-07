// app/[locale]/cookies-policy/page.tsx

import { cache } from "react";
import type { Metadata } from "next";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { client } from "@/sanity/lib/client";
import { SITE_URL } from "@/lib/siteUrl";
import { nbspDeep } from "@/lib/nbsp";
import styles from "./page.module.css";

const COOKIES_POLICY_QUERY = `*[_id == "cookiesPolicy"][0]{
  title,
  body
}`;

const getCookiesPolicyData = cache(async () => nbspDeep(await client.fetch(COOKIES_POLICY_QUERY)));

const portableTextComponents: PortableTextComponents = {
  marks: {
    link: ({ children, value }) => {
      const isExternal = value?.href?.startsWith("http");
      return (
        <a
          href={value?.href}
          target={isExternal ? "_blank" : undefined}
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    },
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const cookiesPolicy = await getCookiesPolicyData();

  const title =
    cookiesPolicy?.title?.[locale] ??
    (locale === "ru" ? "Политика использования Cookie" : "Cookies Policy");
  const description =
    locale === "ru"
      ? "Политика использования cookie florentseva — какие cookie используются на сайте, для чего и как ими управлять."
      : "florentseva's cookies policy — which cookies this site uses, why, and how to manage them.";

  const url = locale === "ru" ? `${SITE_URL}/ru/cookies-policy` : `${SITE_URL}/cookies-policy`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: `${SITE_URL}/cookies-policy`,
        ru: `${SITE_URL}/ru/cookies-policy`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "florentseva",
      type: "website",
      locale: locale === "ru" ? "ru_RU" : "en_US",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function CookiesPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const cookiesPolicy = await getCookiesPolicyData();

  return (
    <div className="page-wrapper">
      <header>{/* Header */}</header>

      <main>
        <section
          id="cookies-policy-hero"
          className={`${styles.hero} pt-huge`}
        >
          <h1>
            {cookiesPolicy?.title?.[locale] ??
              (locale === "ru"
                ? "Политика использования Cookie"
                : "Cookies Policy")}
          </h1>
        </section>

        <section id="cookies-policy-body" className="pt-small">
          <div className={`${styles.body} max-width-large`}>
            <PortableText
              value={cookiesPolicy?.body?.[locale] ?? []}
              components={portableTextComponents}
            />
          </div>
        </section>
      </main>

      <footer>{/* Footer */}</footer>
    </div>
  );
}
