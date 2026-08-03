// app/[locale]/services/[slug]/page.tsx

import { notFound } from "next/navigation";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import ServiceCard from "@/components/ServiceCard";
import WorkCard from "@/components/WorkCard";
import ContactFormField, {
  type FormField,
} from "@/components/ContactFormField";
import ScrollToButton from "@/components/ScrollToButton";
import ServiceTocNav from "@/components/ServiceTocNav";
import StickyAside from "@/components/StickyAside";
import styles from "./page.module.css";

const SERVICE_PAGE_QUERY = `*[_type == "service" && slug.current == $slug][0]{
  title,
  shortDescription,
  opportunity,
  solutions,
  stages,
  outcomes,
  pricing,
  caseStudies[]->{ title, slug, cardImage },
  faq,
  relatedServices[]->{
    title,
    slug,
    shortDescription,
    pricing
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

type ContactForm = {
  heading?: Record<string, string>;
  subheading?: Record<string, string>;
  fields?: FormField[];
  privacyLabel?: Record<string, string>;
  submitLabel?: Record<string, string>;
};

function getMinPrice(pricing?: { price?: number }[]) {
  const prices =
    pricing
      ?.map((tier) => tier.price)
      .filter((price): price is number => Boolean(price)) ?? [];
  return prices.length ? Math.min(...prices) : undefined;
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const service = await client.fetch(SERVICE_PAGE_QUERY, { slug });

  if (!service) {
    notFound();
  }

  const opportunity: HeadingParagraphItem[] = service.opportunity ?? [];
  const solutions: HeadingParagraphItem[] = service.solutions ?? [];
  const stages: HeadingParagraphItem[] = service.stages ?? [];
  const pricing: PricingTier[] = service.pricing ?? [];
  const caseStudies: CaseStudy[] = service.caseStudies ?? [];
  const faq: FaqEntry[] = service.faq ?? [];
  const relatedServices: RelatedService[] = service.relatedServices ?? [];
  const contactForm: ContactForm | undefined = service.contactForm;
  const formFields: FormField[] = contactForm?.fields ?? [];

  const navItems = [
    {
      id: "opportunity",
      label: { en: "The opportunity", ru: "Возможности" },
      show: opportunity.length > 0,
    },
    {
      id: "solutions",
      label: { en: "Solutions & Capabilities", ru: "Решения и возможности" },
      show: solutions.length > 0,
    },
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
      id: "case-studies",
      label: { en: "Case studies", ru: "Кейсы" },
      show: caseStudies.length > 0,
    },
    { id: "faq", label: { en: "FAQ", ru: "Вопросы" }, show: faq.length > 0 },
  ].filter((item) => item.show);

  return (
    <div className="page-wrapper">
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
            / {locale === "ru" ? "Услуги" : "Services"}
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
              <form className={styles.form}>
                {formFields.map((field) => (
                  <ContactFormField
                    key={field.fieldId}
                    field={field}
                    locale={locale}
                    fieldClassName={styles.field}
                    fieldFullClassName={styles.fieldFull}
                  />
                ))}

                <div className={styles.formFooter}>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" name="privacyAccepted" required />
                    <span>{contactForm.privacyLabel?.[locale]}</span>
                  </label>

                  <button type="submit" className="button-filled">
                    {contactForm.submitLabel?.[locale]}
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}
      </main>

      <footer>{/* Footer */}</footer>
    </div>
  );
}
