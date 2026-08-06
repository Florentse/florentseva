// app/[locale]/privacy-policy/page.tsx

import { cache } from "react";
import type { Metadata } from "next";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { client } from "@/sanity/lib/client";
import { SITE_URL } from "@/lib/siteUrl";
import styles from "./page.module.css";

const PRIVACY_POLICY_QUERY = `*[_id == "privacyPolicy"][0]{
  title,
  body
}`;

const getPrivacyPolicyData = cache(async () => client.fetch(PRIVACY_POLICY_QUERY));

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
  const privacyPolicy = await getPrivacyPolicyData();

  const title =
    privacyPolicy?.title?.[locale] ??
    (locale === "ru" ? "Политика конфиденциальности" : "Privacy Policy");
  const description =
    locale === "ru"
      ? "Политика конфиденциальности florentseva — как собираются, используются и защищаются ваши данные при использовании сайта."
      : "florentseva's privacy policy — how your data is collected, used, and protected when using this site.";

  const url = locale === "ru" ? `${SITE_URL}/ru/privacy-policy` : `${SITE_URL}/privacy-policy`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: `${SITE_URL}/privacy-policy`,
        ru: `${SITE_URL}/ru/privacy-policy`,
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

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const privacyPolicy = await getPrivacyPolicyData();

  return (
    <div className="page-wrapper">
      <header>{/* Header */}</header>

      <main>
        <section
          id="privacy-policy-hero"
          className={`${styles.hero} pt-huge`}
        >
          <h1>
            {privacyPolicy?.title?.[locale] ??
              (locale === "ru"
                ? "Политика конфиденциальности"
                : "Privacy Policy")}
          </h1>
        </section>

        <section id="privacy-policy-body" className="pt-small">
          <div className={`${styles.body} max-width-large`}>
            <PortableText
              value={privacyPolicy?.body?.[locale] ?? []}
              components={portableTextComponents}
            />
          </div>
        </section>
      </main>

      <footer>{/* Footer */}</footer>
    </div>
  );
}
