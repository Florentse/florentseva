import { cache } from "react";
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { SITE_URL } from "@/lib/siteUrl";
import { nbspDeep } from "@/lib/nbsp";
import styles from "./page.module.css";
import WorkCard from "@/components/WorkCard";
import workCardStyles from "@/components/WorkCard.module.css";
import ServiceCard from "@/components/ServiceCard";
import ProductCard from "@/components/ProductCard";
import ArticleCard from "@/components/ArticleCard";
import HomeSearch from "@/components/HomeSearch";

const HOME_QUERY = `{
  "home": *[_type == "home"][0]{
    heroTitle,
    worksHeading,
    worksText,
    worksLinkLabel,
    selectedWorks[]->{ title, slug, cardImage, services[0]->{ title } },
    clientsHeading,
    selectedClients[]->{ name, logo },
    servicesHeading,
    servicesLinkLabel,
    selectedServices[]->{ title, slug, shortDescription, pricing },
    productsHeading,
    productsLinkLabel,
    selectedProducts[]->{ title, slug, url, description, coverImage, category->{ title } },
    blogHeading,
    blogLinkLabel,
    seo
  },
  "latestArticles": *[_type == "article"] | order(publishedAt desc)[0...4]{
    title,
    slug,
    coverImage,
    publishedAt,
    category->{ title, slug }
  },
  "searchWorks": *[_type == "work"]{ title, slug, cardDescription },
  "searchServices": *[_type == "service"]{ title, slug, shortDescription },
  "searchProducts": *[_type == "product"]{ title, slug, url, description, searchKeywords },
  "searchArticles": *[_type == "article"]{ title, slug, metaDescription },
  "siteSettings": *[_type == "siteSettings"][0]{ defaultSeo }
}`;

const getHomeData = cache(async () => nbspDeep(await client.fetch(HOME_QUERY)));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { home, siteSettings } = await getHomeData();

  const seo = home?.seo ?? {};
  const fallback = siteSettings?.defaultSeo ?? {};

  const title = seo.title?.[locale] || fallback.title?.[locale];
  const description = seo.description?.[locale] || fallback.description?.[locale];
  const ogImageSource = seo.ogImage ?? fallback.ogImage;
  const imageUrl = ogImageSource ? urlFor(ogImageSource).width(1200).height(630).url() : undefined;
  const url = locale === "ru" ? `${SITE_URL}/ru` : SITE_URL;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: SITE_URL,
        ru: `${SITE_URL}/ru`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Florentseva",
      locale: locale === "ru" ? "ru_RU" : "en_US",
      type: "website",
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const {
    home: data,
    latestArticles,
    searchWorks,
    searchServices,
    searchProducts,
    searchArticles,
  } = await getHomeData();

  return (
    <div className="page-wrapper">
      <header>{/* Header */}</header>

      <main>
        <section className={`${styles.hero} pt-small`} id="hero">
          <div
            className={`${styles.heroSearchWarpper} ${locale === "ru" ? styles.heroSearchWarpperRu : ""}`}
          >
            <HomeSearch
              locale={locale}
              works={searchWorks ?? []}
              services={searchServices ?? []}
              products={searchProducts ?? []}
              articles={searchArticles ?? []}
            />
          </div>
          <div className={styles.heroHeadingWarpper}>
            <h1>{data.heroTitle?.[locale]}</h1>
          </div>
        </section>

        {/* Works */}
        <section className="pt-small" data-theme="alt" id="works">
          <div className="grid-2 gap-regular">
            <h2 className="text-size-large">{data.worksHeading?.[locale]}</h2>
            <div className="flex-col gap-regular max-width-medium">
              <p>{data.worksText?.[locale]}</p>
              <a href="/works" className="link-icon">
                {data.worksLinkLabel?.[locale]}
              </a>
            </div>
          </div>

          <div className={styles.worksList}>
            {data.selectedWorks?.map((work: any) => (
              <WorkCard
                key={work.slug.current}
                title={work.title}
                slug={work.slug.current}
                cardImage={work.cardImage}
                service={work.services?.title?.[locale]}
              />
            ))}
          </div>
        </section>

        {/* Clients*/}
        <section className="pt-small" data-theme="alt" id="clients">
          <h2 className="text-size-large">{data.clientsHeading?.[locale]}</h2>
          <div className={styles.clientsList}>
            {data.selectedClients?.map((client: any) => (
              <div key={client.name} className={styles.clientsItem}>
                {client.logo && (
                  <img
                    src={urlFor(client.logo).url()}
                    alt={client.name}
                    className={styles.clientsLogo}
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Services */}
        <section className="pt-small" id="services">
          <div className="flex-row gap-regular justify-between">
            <h2 className="text-size-large">
              {data.servicesHeading?.[locale]}
            </h2>
            <a href="/services" className="link-icon">
              {data.servicesLinkLabel?.[locale]}
            </a>
          </div>
          <div className="flex-col gap-large">
            {data.selectedServices?.map((service: any, index: number) => {
              const prices =
                service.pricing
                  ?.map((tier: any) => tier.price)
                  .filter(Boolean) ?? [];
              const minPrice = prices.length ? Math.min(...prices) : undefined;

              return (
                <ServiceCard
                  key={service.slug.current}
                  number={index + 1}
                  title={service.title?.[locale]}
                  description={service.shortDescription?.[locale]}
                  minPrice={minPrice}
                  slug={service.slug.current}
                />
              );
            })}
          </div>
        </section>

        {/* Products */}
        <section className="pt-small" id="products">
          <div className="flex-row gap-regular justify-between">
            <h2 className="text-size-large">
              {data.productsHeading?.[locale]}
            </h2>
            <a href="/products" className="link-icon">
              {data.productsLinkLabel?.[locale]}
            </a>
          </div>

          <div className={styles.productsListWrap}>
            <div className="hide-tablet"></div>
            <div className={styles.productsList}>
              {data.selectedProducts?.map((product: any) => {
                return (
                  <ProductCard
                    key={product.slug.current}
                    title={product.title?.[locale]}
                    description={product.description?.[locale]}
                    category={product.category?.title?.[locale]}
                    coverImage={product.coverImage}
                    slug={product.slug.current}
                    url={product.url}
                  />
                );
              })}
            </div>
          </div>
        </section>

        {/* Blog*/}
        <section className="pt-small" id="blog">
          <div className="flex-row gap-regular justify-between">
            <h2 className="text-size-large">{data.blogHeading?.[locale]}</h2>
            <a href="/blog" className="link-icon">
              {data.blogLinkLabel?.[locale]}
            </a>
          </div>

          <div className={styles.blogList}>
            {latestArticles?.map((article: any) => (
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
        </section>
      </main>

      <footer>{/* Footer */}</footer>
    </div>
  );
}
