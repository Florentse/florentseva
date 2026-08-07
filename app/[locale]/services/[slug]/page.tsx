// app/[locale]/services/[slug]/page.tsx

import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { SITE_URL } from "@/lib/siteUrl";
import { nbspDeep } from "@/lib/nbsp";
import ServiceCard from "@/components/ServiceCard";
import WorkCard from "@/components/WorkCard";
import ArticleCard from "@/components/ArticleCard";
import ProductCard from "@/components/ProductCard";
import { type FormField } from "@/components/ContactFormField";
import ServiceContactForm from "@/components/ServiceContactForm";
import ChecklistBlock, {
  type ChecklistBlockData,
} from "@/components/ChecklistBlock";
import LiveDemoBlock, {
  type LiveDemoBlockData,
} from "@/components/LiveDemoBlock";
import PageAnatomyBlock, {
  type PageAnatomyBlockData,
} from "@/components/PageAnatomyBlock";
import SitemapBuilderBlock, {
  type SitemapBuilderBlockData,
} from "@/components/SitemapBuilderBlock";
import ScopeBuilderBlock, {
  type ScopeBuilderBlockData,
} from "@/components/ScopeBuilderBlock";
import StoreQuizBlock, {
  type StoreQuizBlockData,
} from "@/components/StoreQuizBlock";
import ScrollToButton from "@/components/ScrollToButton";
import ServiceTocNav from "@/components/ServiceTocNav";
import StickyAside from "@/components/StickyAside";
import ViewTracker from "@/components/ViewTracker";
import styles from "./page.module.css";

const SERVICE_PAGE_QUERY = `*[_type == "service" && slug.current == $slug][0]{
  title,
  shortDescription,
  opportunity,
  customSections,
  solutions,
  stages,
  outcomes,
  pricing,
  readyMadeProducts[]->{ title, slug, url, description, coverImage, category->{ title } },
  caseStudies[]->{ title, slug, cardImage },
  faq,
  relatedServices[]->{
    title,
    slug,
    shortDescription,
    pricing
  },
  relatedArticles[]->{
    title,
    slug,
    coverImage,
    publishedAt,
    category->{ title, slug }
  },
  contactForm
}`;

type HeadingParagraphItem = {
  heading?: Record<string, string>;
  description?: Record<string, string>;
};

type PricingTier = {
  title?: string;
  price?: number;
  description?: Record<string, string>;
  features?: Record<string, string>[];
  deliveryLabel?: Record<string, string>;
  highlighted?: boolean;
};

type CaseStudy = {
  title: string;
  slug: { current: string };
  cardImage?: any;
};

type ReadyMadeProduct = {
  title?: Record<string, string>;
  slug: { current: string };
  url?: string;
  description?: Record<string, string>;
  coverImage?: unknown;
  category?: { title?: Record<string, string> };
};

type FaqEntry = {
  question?: Record<string, string>;
  answer?: Record<string, string>;
};

type RelatedService = {
  title?: Record<string, string>;
  slug: { current: string };
  shortDescription?: Record<string, string>;
  pricing?: { price?: number }[];
};

type Article = {
  title?: Record<string, string>;
  slug: { current: string };
  coverImage?: unknown;
  publishedAt?: string;
  category?: { title?: Record<string, string> };
};

type ConnectionsGridBlockData = {
  _key?: string;
  heading?: Record<string, string>;
  intro?: Record<string, string>;
  items?: HeadingParagraphItem[];
};

type CustomSection = { _key?: string; _type?: string } & Record<string, unknown>;

type ContactForm = {
  formId?: string;
  heading?: Record<string, string>;
  subheading?: Record<string, string>;
  fields?: FormField[];
};

function getMinPrice(pricing?: { price?: number }[]) {
  const prices =
    pricing
      ?.map((tier) => tier.price)
      .filter((price): price is number => Boolean(price)) ?? [];
  return prices.length ? Math.min(...prices) : undefined;
}

const getService = cache(async (slug: string) => nbspDeep(await client.fetch(SERVICE_PAGE_QUERY, { slug })));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = await getService(slug);
  if (!service) return {};

  const name = service.title?.[locale];
  const title = `${locale === "ru" ? "Услуги" : "Services"} | ${name}`;
  const description = service.shortDescription?.[locale];

  const keywords = [
    name,
    locale === "ru" ? "услуга веб-разработки" : "web development service",
    "Webflow",
    "Next.js",
    locale === "ru" ? "заказать сайт" : "hire a web developer",
  ].filter(Boolean);

  const url = locale === "ru" ? `${SITE_URL}/ru/services/${slug}` : `${SITE_URL}/services/${slug}`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
      languages: {
        en: `${SITE_URL}/services/${slug}`,
        ru: `${SITE_URL}/ru/services/${slug}`,
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

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const service = await getService(slug);

  if (!service) {
    notFound();
  }

  const opportunity: HeadingParagraphItem[] = service.opportunity ?? [];
  const customSections: CustomSection[] = service.customSections ?? [];
  const checklistBlocks = customSections.filter(
    (section) => section._type === "checklistBlock",
  ) as unknown as ChecklistBlockData[];
  const connectionsGridBlocks = customSections.filter(
    (section) => section._type === "connectionsGridBlock",
  ) as unknown as ConnectionsGridBlockData[];
  const liveDemoBlocks = customSections.filter(
    (section) => section._type === "liveDemoBlock",
  ) as unknown as LiveDemoBlockData[];
  const pageAnatomyBlocks = customSections.filter(
    (section) => section._type === "pageAnatomyBlock",
  ) as unknown as PageAnatomyBlockData[];
  const sitemapBuilderBlocks = customSections.filter(
    (section) => section._type === "sitemapBuilderBlock",
  ) as unknown as SitemapBuilderBlockData[];
  const scopeBuilderBlocks = customSections.filter(
    (section) => section._type === "scopeBuilderBlock",
  ) as unknown as ScopeBuilderBlockData[];
  const storeQuizBlocks = customSections.filter(
    (section) => section._type === "storeQuizBlock",
  ) as unknown as StoreQuizBlockData[];
  const solutions: HeadingParagraphItem[] = service.solutions ?? [];
  const stages: HeadingParagraphItem[] = service.stages ?? [];
  const pricing: PricingTier[] = service.pricing ?? [];
  const readyMadeProducts: ReadyMadeProduct[] = service.readyMadeProducts ?? [];
  const caseStudies: CaseStudy[] = service.caseStudies ?? [];
  const faq: FaqEntry[] = service.faq ?? [];
  const relatedServices: RelatedService[] = service.relatedServices ?? [];
  const relatedArticles: Article[] = service.relatedArticles ?? [];
  const contactForm: ContactForm | undefined = service.contactForm;
  const formFields: FormField[] = (contactForm?.fields ?? []).filter(
    (field) => field.fieldId !== "privacy_accepted",
  );

  const navItems = [
    {
      id: "opportunity",
      label: { en: "The opportunity", ru: "Возможности" },
      show: opportunity.length > 0,
    },
    ...checklistBlocks.map((block, index) => ({
      id: `checklist-${index}`,
      label: {
        en: block.heading?.en ?? "Check your file",
        ru: block.heading?.ru ?? "Проверьте свой файл",
      },
      show: true,
    })),
    {
      id: "solutions",
      label: { en: "Solutions & Capabilities", ru: "Решения и возможности" },
      show: solutions.length > 0,
    },
    ...connectionsGridBlocks.map((block, index) => ({
      id: `connections-${index}`,
      label: {
        en: block.heading?.en ?? "What can be connected",
        ru: block.heading?.ru ?? "Что можно подключить",
      },
      show: true,
    })),
    ...liveDemoBlocks.map((block, index) => ({
      id: `live-demo-${index}`,
      label: { en: "Try it yourself", ru: "Попробуйте сами" },
      show: true,
    })),
    ...pageAnatomyBlocks.map((block, index) => ({
      id: `page-anatomy-${index}`,
      label: {
        en: block.heading?.en ?? "Anatomy of a page",
        ru: block.heading?.ru ?? "Анатомия страницы",
      },
      show: true,
    })),
    ...sitemapBuilderBlocks.map((block, index) => ({
      id: `sitemap-builder-${index}`,
      label: {
        en: block.heading?.en ?? "Build your sitemap",
        ru: block.heading?.ru ?? "Соберите структуру сайта",
      },
      show: true,
    })),
    ...scopeBuilderBlocks.map((block, index) => ({
      id: `scope-builder-${index}`,
      label: {
        en: block.heading?.en ?? "Scope your MVP",
        ru: block.heading?.ru ?? "Определите объём MVP",
      },
      show: true,
    })),
    ...storeQuizBlocks.map((block, index) => ({
      id: `store-quiz-${index}`,
      label: {
        en: block.heading?.en ?? "Pick what your store needs",
        ru: block.heading?.ru ?? "Выберите, что нужно вашему магазину",
      },
      show: true,
    })),
    {
      id: "stages",
      label: { en: "Stages of work", ru: "Этапы работы" },
      show: stages.length > 0,
    },
    {
      id: "outcomes",
      label: { en: "Outcomes", ru: "Результат" },
      show: Boolean(service.outcomes?.[locale]),
    },
    {
      id: "pricing",
      label: { en: "Pricing", ru: "Стоимость" },
      show: pricing.length > 0,
    },
    {
      id: "ready-made-products",
      label: { en: "Ready-made Products", ru: "Готовые продукты" },
      show: readyMadeProducts.length > 0,
    },
    {
      id: "case-studies",
      label: { en: "Case studies", ru: "Кейсы" },
      show: caseStudies.length > 0,
    },
    { id: "faq", label: { en: "FAQ", ru: "Вопросы" }, show: faq.length > 0 },
    {
      id: "you-may-also-like",
      label: { en: "You may also like", ru: "Вам также может понравиться" },
      show: relatedArticles.length > 0,
    },
  ].filter((item) => item.show);

  const baseUrl = locale === "ru" ? `${SITE_URL}/ru` : SITE_URL;
  const minPrice = getMinPrice(pricing);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title?.[locale],
    description: service.shortDescription?.[locale],
    url: `${baseUrl}/services/${slug}`,
    inLanguage: locale === "ru" ? "ru" : "en",
    provider: {
      "@type": "Person",
      name: "Tatiana Florentseva",
    },
    ...(minPrice !== undefined
      ? { offers: { "@type": "Offer", price: minPrice, priceCurrency: "USD" } }
      : {}),
  };

  return (
    <div className="page-wrapper">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ViewTracker type="service" slug={slug} />
      <header>{/* Header */}</header>

      <main>
        <section
          id="service-hero"
          data-theme="alt"
          className={styles.heroSection}
        >
          <Link
            href={`/${locale}/services`}
            className="text-size-base text-color-tertiary"
          >
            / {locale === "ru" ? "Все услуги" : "All services"}
          </Link>

          <div className={styles.heroContent}>
            <h1>{service.title?.[locale]}</h1>
            <div className={styles.heroDescription}>
              <p>{service.shortDescription?.[locale]}</p>
              <ScrollToButton targetId="order-form" className="button-filled">
                {locale === "ru" ? "Заказать услугу" : "Order service"}
              </ScrollToButton>
            </div>
          </div>
        </section>

        <section id="service-body" className="pt-small">
          <div className={styles.layout}>
            <StickyAside className={styles.aside} triggerId="service-body">
              <div className="text-size-large text-color-secondary">
                {locale === "ru" ? "Обзор услуги" : "Service Overview"}
              </div>

              <div className={styles.asideContent}>
                <ServiceTocNav
                  items={navItems.map((item) => ({
                    id: item.id,
                    label: item.label[locale as "en" | "ru"] ?? item.label.en,
                  }))}
                />
              </div>

              <ScrollToButton targetId="order-form" className="button-filled">
                {locale === "ru" ? "Заказать услугу" : "Order service"}
              </ScrollToButton>
            </StickyAside>

            <div className={styles.content}>
              {opportunity.length > 0 && (
                <div id="opportunity" className={styles.contentSection}>
                  <h2>{locale === "ru" ? "Возможности" : "The Opportunity"}</h2>
                  <div className={styles.itemList}>
                    {opportunity.map((item, index) => (
                      <div key={index} className={styles.item}>
                        <h3 className="text-size-base font-weight-bold">
                          {item.heading?.[locale]}
                        </h3>
                        <p className="text-color-secondary">
                          {item.description?.[locale]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {checklistBlocks.map((block, index) => (
                <ChecklistBlock
                  key={block._key ?? index}
                  id={`checklist-${index}`}
                  block={block}
                  locale={locale}
                  className={styles.contentSection}
                />
              ))}

              {solutions.length > 0 && (
                <div id="solutions" className={styles.contentSection}>
                  <h2>
                    {locale === "ru"
                      ? "Решения и возможности"
                      : "Solutions & Capabilities"}
                  </h2>
                  <div className={styles.itemList}>
                    {solutions.map((item, index) => (
                      <div key={index} className={styles.item}>
                        <h3 className="text-size-base font-weight-bold">
                          {item.heading?.[locale]}
                        </h3>
                        <p className="text-color-secondary">
                          {item.description?.[locale]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {connectionsGridBlocks.map((block, index) => (
                <div
                  key={block._key ?? index}
                  id={`connections-${index}`}
                  className={styles.contentSection}
                >
                  {block.heading?.[locale] && <h2>{block.heading[locale]}</h2>}
                  {block.intro?.[locale] && (
                    <p className="text-color-secondary">
                      {block.intro[locale]}
                    </p>
                  )}
                  <div className={styles.connectionsGrid}>
                    {(block.items ?? []).map((item, itemIndex) => (
                      <div key={itemIndex} className={styles.item}>
                        <h3 className="text-size-base font-weight-bold">
                          {item.heading?.[locale]}
                        </h3>
                        <p className="text-color-secondary">
                          {item.description?.[locale]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {liveDemoBlocks.map((block, index) => (
                <LiveDemoBlock
                  key={block._key ?? index}
                  id={`live-demo-${index}`}
                  block={block}
                  locale={locale}
                  className={styles.contentSection}
                />
              ))}

              {pageAnatomyBlocks.map((block, index) => (
                <PageAnatomyBlock
                  key={block._key ?? index}
                  id={`page-anatomy-${index}`}
                  block={block}
                  locale={locale}
                  className={styles.contentSection}
                />
              ))}

              {sitemapBuilderBlocks.map((block, index) => (
                <SitemapBuilderBlock
                  key={block._key ?? index}
                  id={`sitemap-builder-${index}`}
                  block={block}
                  locale={locale}
                  className={styles.contentSection}
                />
              ))}

              {scopeBuilderBlocks.map((block, index) => (
                <ScopeBuilderBlock
                  key={block._key ?? index}
                  id={`scope-builder-${index}`}
                  block={block}
                  locale={locale}
                  className={styles.contentSection}
                />
              ))}

              {storeQuizBlocks.map((block, index) => (
                <StoreQuizBlock
                  key={block._key ?? index}
                  id={`store-quiz-${index}`}
                  block={block}
                  locale={locale}
                  className={styles.contentSection}
                />
              ))}

              {stages.length > 0 && (
                <div id="stages" className={styles.contentSection}>
                  <h2>{locale === "ru" ? "Этапы работы" : "Stages of Work"}</h2>
                  <div className={styles.stageItemList}>
                    {stages.map((item, index) => (
                      <div key={index} className={styles.stageItem}>
                        <span
                          className={`${styles.stageNumber} text-color-tertiary`}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <div className={styles.item}>
                          <h3 className="text-size-base font-weight-bold">
                            {item.heading?.[locale]}
                          </h3>
                          <p className="text-color-secondary">
                            {item.description?.[locale]}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {service.outcomes?.[locale] && (
                <div id="outcomes" className={styles.contentSection}>
                  <h2>{locale === "ru" ? "Результат" : "Outcomes"}</h2>
                  <p className="text-color-secondary">
                    {service.outcomes[locale]}
                  </p>
                </div>
              )}

              {pricing.length > 0 && (
                <div id="pricing" className={styles.contentSection}>
                  <h2>{locale === "ru" ? "Стоимость" : "Pricing"}</h2>
                  <div className={styles.pricingGrid}>
                    {pricing.map((tier, index) => (
                      <div
                        key={index}
                        data-theme={tier.highlighted ? "alt" : undefined}
                        className={styles.pricingCard}
                      >
                        <div className={styles.pricingCardBody}>
                          <div className={styles.pricingCardBodyTop}>
                            <p className="text-size-small text-color-secondary text-transform-uppercase">
                              {tier.title}
                            </p>
                            {tier.price !== undefined && (
                              <p className="title-style-h3">
                                {locale === "ru" ? "от" : "from"} ${tier.price}
                              </p>
                            )}
                            {tier.description?.[locale] && (
                              <p className="text-color-secondary">
                                {tier.description[locale]}
                              </p>
                            )}
                          </div>

                          {tier.features && tier.features.length > 0 && (
                            <ul className={styles.featuresList}>
                              {tier.features.map((feature, featureIndex) => (
                                <li
                                  key={featureIndex}
                                  className={styles.featureItem}
                                >
                                  {feature[locale]}
                                </li>
                              ))}
                            </ul>
                          )}

                          <div className={styles.pricingCardBodyBtn}>
                            <ScrollToButton
                              targetId="order-form"
                              className="button-filled"
                            >
                              {locale === "ru" ? "Заказать" : "Order"}{" "}
                              {tier.title}
                            </ScrollToButton>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {readyMadeProducts.length > 0 && (
                <div id="ready-made-products" className={styles.contentSection}>
                  <h2>
                    {locale === "ru" ? "Готовые продукты" : "Ready-made Products"}
                  </h2>
                  <div className={styles.readyMadeProductsGrid}>
                    {readyMadeProducts.map((product) => (
                      <ProductCard
                        key={product.slug.current}
                        title={product.title?.[locale] ?? ""}
                        description={product.description?.[locale]}
                        category={product.category?.title?.[locale]}
                        coverImage={product.coverImage}
                        slug={product.slug.current}
                        url={product.url}
                      />
                    ))}
                  </div>
                </div>
              )}

              {caseStudies.length > 0 && (
                <div id="case-studies" className={styles.contentSection}>
                  <h2>{locale === "ru" ? "Кейсы" : "Case Studies"}</h2>
                  <div className={styles.caseStudiesGrid}>
                    {caseStudies.map((work) => (
                      <WorkCard
                        key={work.slug.current}
                        title={work.title}
                        slug={work.slug.current}
                        cardImage={work.cardImage}
                        service={service.title?.[locale]}
                      />
                    ))}
                  </div>
                </div>
              )}

              {faq.length > 0 && (
                <div id="faq" className={styles.contentSection}>
                  <h2>FAQ</h2>
                  <div className={styles.faqList}>
                    {faq.map((entry, index) => (
                      <details key={index} className={styles.faqItem}>
                        <summary className={styles.faqSummary}>
                          <span className=" text-size-large font-weight-medium">
                            {entry.question?.[locale]}
                          </span>
                          <span
                            className={`material-symbols-outlined ${styles.faqIconClosed}`}
                          >
                            add
                          </span>
                          <span
                            className={`material-symbols-outlined ${styles.faqIconOpen}`}
                          >
                            remove
                          </span>
                        </summary>
                        <p className="text-color-secondary">
                          {entry.answer?.[locale]}
                        </p>
                      </details>
                    ))}
                  </div>
                </div>
              )}

              {relatedArticles.length > 0 && (
                <div
                  id="you-may-also-like"
                  className={`${styles.contentSection} ${styles.youMayAlsoLike}`}
                >
                  <div className="section-top-wrap">
                    <h2 className="text-size-large">
                      {locale === "ru"
                        ? "Вам может быть интересно"
                        : "You may also like"}
                    </h2>
                    <Link href={`/${locale}/blog`} className="link-icon">
                      {locale === "ru" ? "Все статьи" : "All articles"}
                    </Link>
                  </div>

                  <div className={styles.articlesList}>
                    {relatedArticles.map((article) => (
                      <ArticleCard
                        key={article.slug.current}
                        title={article.title?.[locale]}
                        slug={article.slug.current}
                        coverImage={article.coverImage}
                        categoryTitle={article.category?.title?.[locale]}
                        publishedAt={article.publishedAt}
                        locale={locale}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {relatedServices.length > 0 && (
          <section id="related-services" className="pt-small">
            <div className={styles.relatedHeader}>
              <h2 className="text-size-large">
                {locale === "ru" ? "Похожие услуги" : "Related Services"}
              </h2>
              <Link href={`/${locale}/services`} className="link-icon">
                {locale === "ru" ? "Все услуги" : "All services"}
              </Link>
            </div>

            <div className={styles.relatedList}>
              {relatedServices.map((related, index) => (
                <ServiceCard
                  key={related.slug.current}
                  number={index + 1}
                  title={related.title?.[locale] ?? ""}
                  description={related.shortDescription?.[locale]}
                  minPrice={getMinPrice(related.pricing)}
                  slug={related.slug.current}
                />
              ))}
            </div>
          </section>
        )}

        {contactForm && (
          <section
            id="order-form"
            data-theme="alt"
            className={`${styles.orderFormSection} pt-small pb-small`}
          >
            <div className={styles.sectionFormGrid}>
              <div className={styles.sectionFormText}>
                <h2 className="text-size-large">
                  {contactForm.heading?.[locale]}
                </h2>
                {contactForm.subheading?.[locale] && (
                  <p className="text-color-secondary">
                    {contactForm.subheading[locale]}
                  </p>
                )}
              </div>
              <ServiceContactForm
                locale={locale}
                formId={contactForm.formId ?? slug}
                serviceSlug={slug}
                fields={formFields}
                formClassName={styles.form}
                fieldClassName={styles.field}
                fieldFullClassName={styles.fieldFull}
                formFooterClassName={styles.formFooter}
                checkboxLabelClassName={styles.checkboxLabel}
              />
            </div>
          </section>
        )}
      </main>

      <footer>{/* Footer */}</footer>
    </div>
  );
}
