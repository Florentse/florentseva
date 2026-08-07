import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { SITE_URL } from "@/lib/siteUrl";

const SITEMAP_QUERY = `{
  "works": *[_type == "work" && defined(slug.current)]{ "slug": slug.current, _updatedAt },
  "services": *[_type == "service" && defined(slug.current)]{ "slug": slug.current, _updatedAt },
  "articles": *[_type == "article" && defined(slug.current)]{ "slug": slug.current, _updatedAt, publishedAt }
}`;

type SlugDoc = { slug: string; _updatedAt: string; publishedAt?: string };

type EntryOptions = {
  lastModified?: string | Date;
  changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority?: number;
};

function localizedEntry(path: string, opts: EntryOptions = {}): MetadataRoute.Sitemap {
  const enUrl = path ? `${SITE_URL}/${path}` : SITE_URL;
  const ruUrl = path ? `${SITE_URL}/ru/${path}` : `${SITE_URL}/ru`;
  const alternates = { languages: { en: enUrl, ru: ruUrl } };

  return [
    { url: enUrl, alternates, ...opts },
    { url: ruUrl, alternates, ...opts },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { works, services, articles } = await client.fetch<{
    works: SlugDoc[];
    services: SlugDoc[];
    articles: SlugDoc[];
  }>(SITEMAP_QUERY);

  const staticEntries: MetadataRoute.Sitemap = [
    ...localizedEntry("", { changeFrequency: "weekly", priority: 1 }),
    ...localizedEntry("about", { changeFrequency: "monthly", priority: 0.6 }),
    ...localizedEntry("contact", { changeFrequency: "monthly", priority: 0.5 }),
    ...localizedEntry("works", { changeFrequency: "weekly", priority: 0.8 }),
    ...localizedEntry("services", { changeFrequency: "weekly", priority: 0.8 }),
    ...localizedEntry("products", { changeFrequency: "weekly", priority: 0.8 }),
    ...localizedEntry("products/mortgage-calculator", { changeFrequency: "monthly", priority: 0.7 }),
    ...localizedEntry("products/prize-wheel", { changeFrequency: "monthly", priority: 0.7 }),
    ...localizedEntry("blog", { changeFrequency: "daily", priority: 0.7 }),
    ...localizedEntry("privacy-policy", { changeFrequency: "yearly", priority: 0.3 }),
    ...localizedEntry("cookies-policy", { changeFrequency: "yearly", priority: 0.3 }),
  ];

  const workEntries = (works ?? []).flatMap((work) =>
    localizedEntry(`works/${work.slug}`, {
      lastModified: work._updatedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    }),
  );

  const serviceEntries = (services ?? []).flatMap((service) =>
    localizedEntry(`services/${service.slug}`, {
      lastModified: service._updatedAt,
      changeFrequency: "monthly",
      priority: 0.7,
    }),
  );

  const articleEntries = (articles ?? []).flatMap((article) =>
    localizedEntry(`blog/${article.slug}`, {
      lastModified: article._updatedAt ?? article.publishedAt,
      changeFrequency: "weekly",
      priority: 0.6,
    }),
  );

  return [...staticEntries, ...workEntries, ...serviceEntries, ...articleEntries];
}
