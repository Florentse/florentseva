// app/[locale]/contact/page.tsx

import { cache } from "react";
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { SITE_URL } from "@/lib/siteUrl";
import { nbspDeep } from "@/lib/nbsp";
import { type FormField } from "@/components/ContactFormField";
import ServiceContactForm from "@/components/ServiceContactForm";
import styles from "./page.module.css";

const CONTACT_PAGE_QUERY = `*[_id == "contact"][0]{
  title,
  intro,
  contactMethods,
  formHeading,
  formDescription,
  formFields,
  privacyLabel,
  submitLabel
}`;

type ContactMethod = {
  label?: Record<string, string>;
  value?: Record<string, string>;
  description?: Record<string, string>;
  ctaLabel?: Record<string, string>;
  url?: string;
};

const getContactData = cache(async () => nbspDeep(await client.fetch(CONTACT_PAGE_QUERY)));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const contact = await getContactData();

  const title = locale === "ru" ? "Контакты" : "Contact";
  const description =
    contact?.intro?.[locale] ??
    (locale === "ru"
      ? "Свяжитесь со мной, чтобы обсудить разработку или дизайн сайта на Webflow или Next.js."
      : "Get in touch to discuss your Webflow or Next.js website development or design project.");
  const keywords = [
    locale === "ru" ? "контакты" : "contact",
    locale === "ru" ? "связаться" : "get in touch",
    locale === "ru" ? "заказать сайт" : "hire web developer",
    "Webflow",
    "Next.js",
  ];

  const url = locale === "ru" ? `${SITE_URL}/ru/contact` : `${SITE_URL}/contact`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
      languages: {
        en: `${SITE_URL}/contact`,
        ru: `${SITE_URL}/ru/contact`,
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

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const contact = await getContactData();

  const contactMethods: ContactMethod[] = contact?.contactMethods ?? [];
  const formFields: FormField[] = contact?.formFields ?? [];

  const baseUrl = locale === "ru" ? `${SITE_URL}/ru` : SITE_URL;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: locale === "ru" ? "Контакты" : "Contact",
    url: `${baseUrl}/contact`,
    inLanguage: locale === "ru" ? "ru" : "en",
    about: { "@type": "Person", name: "Tatiana Florentseva" },
  };

  return (
    <div className="page-wrapper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header>{/* Header */}</header>

      <main>
        <section id="contact-hero" className={`${styles.hero} pt-large pb-small`}>
          <div className={styles.heroGrid}>
            <h1>{contact?.title?.[locale]}</h1>
            <div className="max-width-small">
              <p>{contact?.intro?.[locale]}</p>
            </div>
          </div>
        </section>

        <section id="contact-methods" className={`${styles.methodsSection} pt-small`}>
          <div className={styles.methodsGrid}>
            {contactMethods.map((method, index) => (
              <div key={index} className={`${styles.methodCard} flex-col gap-small inner-padding-regular`}>
                <span className="text-size-small text-color-tertiary text-transform-uppercase">
                  {method.label?.[locale]}
                </span>
                <p className="font-weight-bold">{method.value?.[locale]}</p>
                <p className="text-color-secondary">{method.description?.[locale]}</p>
                <a href={method.url} className="link-icon" data-icon="chevron_forward">
                  {method.ctaLabel?.[locale]}
                </a>
              </div>
            ))}
          </div>
        </section>

        <section id="contact-form" className={`${styles.formSection} pt-small`}>
          <div className={styles.formGrid}>
            <div className="flex-col gap-small">
              <h2 className="text-size-large">{contact?.formHeading?.[locale]}</h2>
              <div className="max-width-small">
                <p>{contact?.formDescription?.[locale]}</p>
              </div>
            </div>

            <ServiceContactForm
              locale={locale}
              formId="contact-page"
              fields={formFields}
              formClassName={styles.form}
              fieldClassName={styles.field}
              fieldFullClassName={styles.fieldFull}
              formFooterClassName={styles.formFooter}
              checkboxLabelClassName={styles.checkboxLabel}
              privacyLabel={contact?.privacyLabel}
              submitLabel={contact?.submitLabel}
            />
          </div>
        </section>
      </main>

      <footer>{/* Footer */}</footer>
    </div>
  );
}
