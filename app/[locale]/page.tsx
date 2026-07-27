import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import styles from "./page.module.css";
import WorkCard from "@/components/WorkCard";
import workCardStyles from "@/components/WorkCard.module.css";
import ServiceCard from "@/components/ServiceCard";

const HOME_QUERY = `*[_type == "home"][0]{
  heroTitle,
  worksHeading,
  worksText,
  worksLinkLabel,
  selectedWorks[]->{ title, slug, cardImage, services[0]->{ title } },
  clientsHeading,
  selectedClients[]->{ name, logo },
  servicesHeading,
  servicesLinkLabel,
  selectedServices[]->{ title, slug, shortDescription, pricing },  productsHeading,
  productsLinkLabel,
  selectedProducts[]->{ title, slug },
  blogHeading,
  blogLinkLabel,
  selectedArticles[]->{ title, slug }
}`;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const data = await client.fetch(HOME_QUERY)

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
          <div className="grid-2">
            <h2 className="text-size-large">{data.worksHeading?.[locale]}</h2>
            <div className="flex-col gap-regular">
              <p>{data.worksText?.[locale]}</p>
              <a href="/works" className="link-icon">
                {data.worksLinkLabel?.[locale]}
              </a>
            </div>
          </div>

          <div className={workCardStyles.worksList}>
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
            <h2 className="text-size-large">{data.servicesHeading?.[locale]}</h2>
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
        </section>
      </main>

      <footer>{/* Footer */}</footer>
    </div>
  );
}
