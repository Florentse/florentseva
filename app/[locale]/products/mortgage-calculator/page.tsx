// app/[locale]/products/mortgage-calculator/page.tsx

import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { SITE_URL } from "@/lib/siteUrl";
import ScrollToButton from "@/components/ScrollToButton";
import ServiceContactForm from "@/components/ServiceContactForm";
import { type FormField } from "@/components/ContactFormField";
import MortgageCalculator from "./MortgageCalculator";
import styles from "./page.module.css";

const PRODUCT_SLUG = "mortgage-calculator";
const BASE_PRICE = 99;

const PRODUCT_QUERY = `*[_type == "product" && slug.current == $slug][0]{ coverImage, price }`;
const getProductDoc = cache(async () => client.fetch(PRODUCT_QUERY, { slug: PRODUCT_SLUG }));

const CONTACT_FIELDS: FormField[] = [
  {
    fieldId: "name",
    fieldType: "text",
    label: { en: "Name", ru: "Имя" },
    placeholder: { en: "John Doe", ru: "Иван Иванов" },
    width: "full",
    required: true,
  },
  {
    fieldId: "email",
    fieldType: "email",
    label: { en: "Email", ru: "Email" },
    placeholder: { en: "example@mail.com", ru: "example@mail.com" },
    width: "full",
    required: true,
  },
  {
    fieldId: "company",
    fieldType: "text",
    label: { en: "Company", ru: "Компания" },
    placeholder: { en: "Your company", ru: "Название компании" },
    width: "full",
  },
  {
    fieldId: "telegram",
    fieldType: "text",
    label: { en: "Telegram", ru: "Telegram" },
    placeholder: { en: "@username", ru: "@username" },
    width: "full",
  },
  {
    fieldId: "purchaseType",
    fieldType: "select",
    label: { en: "What do you need?", ru: "Что вам нужно?" },
    options: [
      { en: "Just buy the product", ru: "Просто купить продукт" },
      {
        en: "Order the service with installation",
        ru: "Заказать услугу с установкой",
      },
    ],
    width: "full",
    required: true,
  },
  {
    fieldId: "platform",
    fieldType: "select",
    label: { en: "Which version do you need?", ru: "Какая версия вам нужна?" },
    options: [
      { en: "Next.js", ru: "Next.js" },
      { en: "Webflow", ru: "Webflow" },
      { en: "React", ru: "React" },
      { en: "Other", ru: "Другое" },
    ],
    width: "full",
    required: true,
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const product = await getProductDoc();

  const name = locale === "ru" ? "Калькулятор ипотеки" : "Mortgage Calculator";
  const title = `${locale === "ru" ? "Продукты" : "Products"} | ${name}`;
  const description =
    locale === "ru"
      ? "Интерактивный калькулятор ипотечного платежа для сайтов недвижимости и финансовых компаний — готовые версии для Next.js, Webflow и React от $99."
      : "An interactive mortgage payment calculator for real estate and finance websites — ready-made versions for Next.js, Webflow, and React from $99.";
  const keywords = [
    name,
    locale === "ru" ? "калькулятор ипотеки" : "mortgage calculator",
    locale === "ru" ? "виджет для сайта" : "website widget",
    "Webflow",
    "Next.js",
    "React",
  ];

  const url =
    locale === "ru" ? `${SITE_URL}/ru/products/${PRODUCT_SLUG}` : `${SITE_URL}/products/${PRODUCT_SLUG}`;
  const imageUrl = product?.coverImage
    ? urlFor(product.coverImage).width(1200).height(630).url()
    : undefined;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
      languages: {
        en: `${SITE_URL}/products/${PRODUCT_SLUG}`,
        ru: `${SITE_URL}/ru/products/${PRODUCT_SLUG}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "florentseva",
      type: "website",
      locale: locale === "ru" ? "ru_RU" : "en_US",
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function MortgageCalculatorProductPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const product = await getProductDoc();

  const name = locale === "ru" ? "Калькулятор ипотеки" : "Mortgage Calculator";
  const baseUrl = locale === "ru" ? `${SITE_URL}/ru` : SITE_URL;
  const pageUrl = `${baseUrl}/products/${PRODUCT_SLUG}`;
  const price = product?.price ?? BASE_PRICE;
  const imageUrl = product?.coverImage
    ? urlFor(product.coverImage).width(1200).height(630).url()
    : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description:
      locale === "ru"
        ? "Интерактивный калькулятор ипотечного платежа для сайтов недвижимости и финансовых компаний."
        : "An interactive mortgage payment calculator for real estate and finance websites.",
    url: pageUrl,
    image: imageUrl,
    brand: { "@type": "Brand", name: "florentseva" },
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: pageUrl,
    },
  };

  return (
    <div className="page-wrapper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header>{/* Header */}</header>

      <main>
        <section id="product-hero" className={styles.heroSection}>
          <Link
            href={`/${locale}/products`}
            className="text-size-base text-color-tertiary"
          >
            / {locale === "ru" ? "Все  продукты" : "All products"}
          </Link>
          <div className={styles.heroContent}>
            <h1>
              {locale === "ru" ? "Калькулятор ипотеки" : "Mortgage Calculator"}
            </h1>

            <p className="text-color-secondary pt-small">
              {locale === "ru"
                ? "Интерактивный калькулятор ипотечного платежа для сайтов недвижимости и финансовых компаний. Посетитель вводит стоимость дома, первоначальный взнос, ставку и срок — и сразу видит ежемесячный платёж."
                : "An interactive mortgage payment calculator for real estate and finance websites. Visitors enter the home price, down payment, interest rate and term, and instantly see their monthly payment."}
            </p>
          </div>
          <MortgageCalculator locale={locale} />
        </section>


        <section id="pricing" className="pt-small">
          <h2>{locale === "ru" ? "Стоимость" : "Pricing"}</h2>
          <div className={styles.pricingGrid}>
            <div className={styles.pricingCard}>
              <p className="text-size-small text-color-secondary text-transform-uppercase">
                {locale === "ru" ? "Готовый продукт" : "Ready-made product"}
              </p>
              <p className="title-style-h3">$99</p>
              <p className="text-color-secondary">
                {locale === "ru"
                  ? "Готовые варианты калькулятора для Next.js, Webflow и React — интегрируйте на свой сайт самостоятельно."
                  : "Ready-made versions of the calculator for Next.js, Webflow, and React — integrate it into your site yourself."}
              </p>
              <ScrollToButton targetId="order-form" className="button-filled">
                {locale === "ru" ? "Купить продукт" : "Buy product"}
              </ScrollToButton>
            </div>

            <div className={styles.pricingCard} data-theme="alt">
              <p className="text-size-small text-color-secondary text-transform-uppercase">
                {locale === "ru"
                  ? "Custom Interactive Features"
                  : "Custom Interactive Features"}
              </p>
              <p className="title-style-h3">$200</p>
              <p className="text-color-secondary">
                {locale === "ru"
                  ? "Визуальная кастомизация калькулятора под стиль вашего сайта и установка на сайт. Стоимость продукта уже включена в эту цену."
                  : "Visual customization of the calculator to match your site's style, plus installation on your site. The product cost is already included in this price."}
              </p>
              <ScrollToButton targetId="order-form" className="button-filled">
                {locale === "ru" ? "Заказать услугу" : "Order service"}
              </ScrollToButton>
            </div>
          </div>
        </section>

        <section
          id="order-form"
          data-theme="alt"
          className={`${styles.orderFormSection} pt-small pb-small`}
        >
          <div className={styles.sectionFormText}>
            <h2 className="text-size-large">
              {locale === "ru" ? "Оставьте заявку" : "Get in touch"}
            </h2>
            <p className="text-color-secondary">
              {locale === "ru"
                ? "Укажите, какая версия вам нужна, и мы свяжемся с вами для уточнения деталей."
                : "Tell us which version you need, and we'll get back to you with the details."}
            </p>
          </div>

          <ServiceContactForm
            locale={locale}
            formId="product-mortgage-calculator"
            fields={CONTACT_FIELDS}
            formClassName={styles.form}
            fieldClassName={styles.field}
            fieldFullClassName={styles.fieldFull}
            formFooterClassName={styles.formFooter}
            checkboxLabelClassName={styles.checkboxLabel}
          />
        </section>
      </main>

      <footer>{/* Footer */}</footer>
    </div>
  );
}
