import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import styles from "./page.module.css";
import WorkCard from "@/components/WorkCard";
import workCardStyles from "@/components/WorkCard.module.css";
import ServiceCard from "@/components/ServiceCard";
import ArticleCard from "@/components/ArticleCard";

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
    selectedProducts[]->{ title, slug },
    blogHeading,
    blogLinkLabel
  },
  "latestArticles": *[_type == "article"] | order(publishedAt desc)[0...4]{
    title,
    slug,
    coverImage,
    publishedAt,
    category->{ title, slug }
  }
}`;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { home: data, latestArticles } = await client.fetch(HOME_QUERY);

  return (
    <div className="page-wrapper">
      <header>{/* Header */}</header>

      <main>
        <section className={`${styles.hero} pt-small`} id="hero">
          <div className={styles.heroContent}>
            <h1>{data.heroTitle?.[locale]}</h1>
          </div>
        </section>

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

        <section className="pt-small" id="products">
          <h2 className="text-size-large">{data.productsHeading?.[locale]}</h2>
          <a href="/products" className="link-icon">
            {data.productsLinkLabel?.[locale]}
          </a>
        </section>

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
