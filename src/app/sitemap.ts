import type { MetadataRoute } from "next";
import { WIKI_CATEGORIES } from "@/lib/constants";
import { absoluteUrl } from "@/lib/utils";
import { getAllArticleSlugs, getAllWikiEntries } from "@/services/wordpress";
import { getProducts } from "@/services/woocommerce";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, wikiEntries, products] = await Promise.all([
    getAllArticleSlugs(),
    getAllWikiEntries(),
    getProducts({ limit: 100 }),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "hourly", priority: 1 },
    { url: absoluteUrl("/wiki"), changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/news"), changeFrequency: "hourly", priority: 0.9 },
    { url: absoluteUrl("/map"), changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/media"), changeFrequency: "weekly", priority: 0.6 },
    { url: absoluteUrl("/store"), changeFrequency: "daily", priority: 0.8 },
    { url: absoluteUrl("/community"), changeFrequency: "daily", priority: 0.7 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.4 },
  ];

  const wikiCategoryPages: MetadataRoute.Sitemap = WIKI_CATEGORIES.map((c) => ({
    url: absoluteUrl(`/wiki/${c.slug}`),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const wikiPages: MetadataRoute.Sitemap = wikiEntries.map((entry) => ({
    url: absoluteUrl(`/wiki/${entry.category}/${entry.slug}`),
    lastModified: entry.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: absoluteUrl(`/news/${a.slug}`),
    lastModified: a.modified,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: absoluteUrl(`/store/${p.slug}`),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticPages, ...wikiCategoryPages, ...wikiPages, ...articlePages, ...productPages];
}
