// app/[locale]/products/page.tsx

import { cache } from "react";
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { SITE_URL } from "@/lib/siteUrl";
import { nbspDeep } from "@/lib/nbsp";
import ProductsPageClient from "@/components/ProductsPageClient";

const PRODUCTS_PAGE_QUERY = `{
  "products": *[_type == "product"] | order(sortOrder desc) {
    title,
    slug,
    url,
    description,
    coverImage,
    price,
    category->{ title, slug }
  },
  "categories": *[_type == "productCategory"] | order(sortOrder asc) {
    title,
    slug,
    sortOrder
  }
}`;

type ProductDoc = {
  title?: Record<string, string>;
  slug: { current: string };
  url?: string;
  description?: Record<string, string>;
  coverImage?: unknown;
  price?: number;
  category?: { title?: Record<string, string>; slug?: { current: string } };
};

type CategoryDoc = {
  title?: Record<string, string>;
  slug: { current: string };
  sortOrder?: number;
};

const getProductsData = cache(
  async (): Promise<{ products: ProductDoc[]; categories: CategoryDoc[] }> =>
    nbspDeep(await client.fetch(PRODUCTS_PAGE_QUERY)),
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { products, categories } = await getProductsData();

  const categoryNames = (categories ?? [])
    .map((category) => category.title?.[locale])
    .filter((title): title is string => Boolean(title));
  const productNames = (products ?? [])
    .map((product) => product.title?.[locale])
    .filter((title): title is string => Boolean(title));

  const title = locale === "ru" ? "Продукты" : "Products";

  const description =
    locale === "ru"
      ? `Готовые продукты и шаблоны: ${productNames.join(", ") || "виджеты и шаблоны"}. Интерактивные виджеты, Webflow-шаблоны и инструменты для сайтов — купите готовое или закажите кастомизацию под ваш бренд.`
      : `Ready-made products and templates: ${productNames.join(", ") || "widgets and templates"}. Interactive widgets, Webflow templates, and site tools — buy them ready-made or get them customized to your brand.`;

  const keywords = [
    ...productNames,
    ...categoryNames,
    locale === "ru" ? "готовые продукты" : "ready-made products",
    locale === "ru" ? "шаблоны Webflow" : "Webflow templates",
    "Next.js",
    locale === "ru" ? "купить шаблон сайта" : "buy website template",
  ];

  const url = locale === "ru" ? `${SITE_URL}/ru/products` : `${SITE_URL}/products`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
      languages: {
        en: `${SITE_URL}/products`,
        ru: `${SITE_URL}/ru/products`,
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

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { products, categories } = await getProductsData();

  const baseUrl = locale === "ru" ? `${SITE_URL}/ru` : SITE_URL;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: locale === "ru" ? "Продукты" : "Products",
    url: `${baseUrl}/products`,
    inLanguage: locale === "ru" ? "ru" : "en",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.map((product, index) => {
        const productUrl = product.url || `${baseUrl}/products/${product.slug.current}`;
        return {
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Product",
            name: product.title?.[locale],
            description: product.description?.[locale],
            url: productUrl,
            image: product.coverImage ? urlFor(product.coverImage).width(1200).height(630).url() : undefined,
            brand: { "@type": "Brand", name: "florentseva" },
            ...(product.price !== undefined
              ? {
                  offers: {
                    "@type": "Offer",
                    price: product.price,
                    priceCurrency: "USD",
                    availability: "https://schema.org/InStock",
                    url: productUrl,
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
      <ProductsPageClient products={products} categories={categories} locale={locale} />
    </>
  );
}
