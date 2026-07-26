import { client } from '@/sanity/lib/client'
import styles from './page.module.css'
import ServiceCard from '@/components/ServiceCard'


const HOME_QUERY = `*[_type == "home"][0]{
  heroTitle,
  worksHeading,
  worksText,
  worksLinkLabel,
  selectedWorks[]->{ title, slug, cardImage },
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
}`

export default async function Home() {
  const data = await client.fetch(HOME_QUERY)

  return (
    <div className="page-wrapper">
      <header>{/* Header */}</header>

      <main>
        <section className={`${styles.hero} pt-small`} id="hero">
<div className={styles.heroContent}>
            <h1>{data.heroTitle?.en}</h1>
          </div>
        </section>

        <section className="pt-small" data-theme="alt" id="works">
          <div className="grid-2">
            <h2 className="text-size-large">{data.worksHeading?.en}</h2>
            <div className="flex-col gap-regular">
              <p>{data.worksText?.en}</p>
              <a href="/works" className="link-icon">{data.worksLinkLabel?.en}</a>
            </div>

          </div>
        </section>

        <section className="pt-small" data-theme="alt" id="clients">
          <h2 className="text-size-large">{data.clientsHeading?.en}</h2>
        </section>

        <section className="pt-small" id="services">
          <div className="flex-row gap-regular justify-between">          
            <h2 className="text-size-large">{data.servicesHeading?.en}</h2>
            <a href="/services" className="link-icon">{data.servicesLinkLabel?.en}</a>
          </div>
      <div className="flex-col gap-large">
{data.selectedServices?.map((service: any, index: number) => {
  const prices = service.pricing?.map((tier: any) => tier.price).filter(Boolean) ?? []
  const minPrice = prices.length ? Math.min(...prices) : undefined

  return (
    <ServiceCard
      key={service.slug.current}
      number={index + 1}
      title={service.title?.en}
      description={service.shortDescription?.en}
      minPrice={minPrice}
      slug={service.slug.current}
    />
  )
})}
  </div>
        </section>

        <section className="pt-small" id="products">
          <h2 className="text-size-large">{data.productsHeading?.en}</h2>
          <a href="/products" className="link-icon">{data.productsLinkLabel?.en}</a>
        </section>

        <section className="pt-small" id="blog">
          <div className="flex-row gap-regular justify-between"> 
          <h2 className="text-size-large">{data.blogHeading?.en}</h2>
          <a href="/blog" className="link-icon">{data.blogLinkLabel?.en}</a>
          </div>
        </section>
      </main>

      <footer>{/* Footer */}</footer>
    </div>
  )
}