//app/[locale]/services/page.tsx

import { cache } from "react";
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { SITE_URL } from "@/lib/siteUrl";
import ServicesPageClient from "@/components/ServicesPageClient";

const SERVICES_PAGE_QUERY = `{
  "page": *[_type == "servicesPage"][0]{ intro },
  "categories": *[_type == "serviceCategory"] | order(sortOrder asc) {
    _id,
    title,
    services[]->{ title, slug, shortDescription, pricing }
  }
}`;

type PricingTier = { price?: number };

type ServiceDoc = {
  title?: Record<string, string>;
  slug: { current: string };
  shortDescription?: Record<string, string>;
  pricing?: PricingTier[];
};

type CategoryDoc = {
  _id: string;
  title?: Record<string, string>;
  services?: ServiceDoc[];
};

const getServicesData = cache(
  async (): Promise<{ page: { intro?: Record<string, string> } | null; categories: CategoryDoc[] }> =>
    client.fetch(SERVICES_PAGE_QUERY),
);

function getMinPrice(pricing?: PricingTier[]): number | undefined {
  const prices = pricing?.map((tier) => tier.price).filter((price): price is number => Boolean(price)) ?? [];
  return prices.length ? Math.min(...prices) : undefined;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { categories } = await getServicesData();

  const categoryNames = (categories ?? [])
    .map((category) => category.title?.[locale])
    .filter((title): title is string => Boolean(title));
  const serviceNames = (categories ?? [])
    .flatMap((category) => category.services ?? [])
    .map((service) => service.title?.[locale])
    .filter((title): title is string => Boolean(title));

  const title = locale === "ru" ? "Услуги" : "Services";

  const description =
    locale === "ru"
      ? `Услуги веб-дизайна и разработки: ${categoryNames.join(", ") || "сайты и веб-приложения"}. Дизайн, вёрстка, Webflow и Next.js разработка, интеграции и техническая SEO — с ценами и сроками.`
      : `Web design and development services: ${categoryNames.join(", ") || "websites and web apps"}. Design, build, Webflow and Next.js development, integrations, and technical SEO — with pricing and timelines.`;

  const keywords = [
    ...categoryNames,
    ...serviceNames,
    locale === "ru" ? "услуги веб-разработки" : "web development services",
    locale === "ru" ? "веб-дизайн" : "web design",
    "Webflow",
    "Next.js",
    locale === "ru" ? "цены на разработку сайта" : "website development pricing",
  ];

  const url = locale === "ru" ? `${SITE_URL}/ru/services` : `${SITE_URL}/services`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
      languages: {
        en: `${SITE_URL}/services`,
        ru: `${SITE_URL}/ru/services`,
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

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { page, categories } = await getServicesData();

  const baseUrl = locale === "ru" ? `${SITE_URL}/ru` : SITE_URL;
  const allServices = (categories ?? []).flatMap((category) => category.services ?? []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: locale === "ru" ? "Услуги" : "Services",
    url: `${baseUrl}/services`,
    inLanguage: locale === "ru" ? "ru" : "en",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: allServices.map((service, index) => {
        const minPrice = getMinPrice(service.pricing);
        return {
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Service",
            name: service.title?.[locale],
            description: service.shortDescription?.[locale],
            url: `${baseUrl}/services/${service.slug.current}`,
            provider: {
              "@type": "Person",
              name: "Tatiana Florentseva",
            },
            ...(minPrice !== undefined
              ? {
                  offers: {
                    "@type": "Offer",
                    price: minPrice,
                    priceCurrency: "USD",
                  },
                }
              : {}),
          },
        };
      }),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ServicesPageClient intro={page?.intro} categories={categories} locale={locale} />
    </>
  );
}
