import "server-only";
import { fetchGraphQL } from "@/graphql/client";
import {
  GET_ARTICLES,
  GET_ARTICLE_BY_SLUG,
  GET_ALL_ARTICLE_SLUGS,
  wikiEntriesQuery,
  wikiEntryBySlugQuery,
} from "@/graphql/queries";
import { MOCK_ARTICLES, MOCK_WIKI } from "@/lib/mock-data";
import { readingTime } from "@/lib/utils";
import type { Article, WikiCategorySlug, WikiEntry } from "@/types";
import type { RumorLevel } from "@/lib/constants";

/* ── WPGraphQL response shapes ──────────────────────── */

interface WpImage {
  sourceUrl: string;
  altText: string;
  mediaDetails?: { width: number; height: number };
}

interface WpPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  modified: string;
  categories?: { nodes: { name: string }[] };
  tags?: { nodes: { name: string }[] };
  author?: { node: { name: string; slug: string; avatar?: { url: string } } };
  featuredImage?: { node: WpImage };
  articleFields?: { rumorLevel?: string; featured?: boolean };
}

interface WpWikiNode {
  id: string;
  slug: string;
  title: string;
  modified: string;
  content: string;
  featuredImage?: { node: WpImage };
  wikiFields?: {
    summary?: string;
    stats?: string;
    relatedSlugs?: string;
    gallery?: WpImage[];
  };
}

/* ── Mappers ────────────────────────────────────────── */

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").trim();
}

function mapPost(post: WpPost): Article {
  const content = stripHtml(post.content ?? "");
  return {
    id: post.id,
    slug: post.slug,
    title: stripHtml(post.title),
    excerpt: stripHtml(post.excerpt ?? ""),
    content,
    category: post.categories?.nodes[0]?.name ?? "News",
    tags: post.tags?.nodes.map((t) => t.name) ?? [],
    author: {
      name: post.author?.node.name ?? "Vice City Files",
      slug: post.author?.node.slug ?? "staff",
      avatar: post.author?.node.avatar?.url,
    },
    publishedAt: post.date,
    updatedAt: post.modified,
    featuredImage: post.featuredImage
      ? {
          url: post.featuredImage.node.sourceUrl,
          alt: post.featuredImage.node.altText || stripHtml(post.title),
          width: post.featuredImage.node.mediaDetails?.width,
          height: post.featuredImage.node.mediaDetails?.height,
        }
      : { url: "", alt: stripHtml(post.title), placeholder: "purple" },
    readTime: readingTime(content),
    rumorLevel: (post.articleFields?.rumorLevel as RumorLevel) ?? undefined,
    featured: post.articleFields?.featured ?? false,
  };
}

const WIKI_GRAPHQL_NAMES: Record<WikiCategorySlug, { singular: string; plural: string }> = {
  characters: { singular: "character", plural: "characters" },
  vehicles: { singular: "vehicle", plural: "vehicles" },
  locations: { singular: "location", plural: "locations" },
  weapons: { singular: "weapon", plural: "weapons" },
  missions: { singular: "mission", plural: "missions" },
  businesses: { singular: "business", plural: "businesses" },
  gangs: { singular: "gang", plural: "gangs" },
  "easter-eggs": { singular: "easterEgg", plural: "easterEggs" },
};

function mapWikiNode(node: WpWikiNode, category: WikiCategorySlug): WikiEntry {
  return {
    id: node.id,
    slug: node.slug,
    category,
    title: stripHtml(node.title),
    summary: node.wikiFields?.summary ?? "",
    content: stripHtml(node.content ?? ""),
    heroImage: node.featuredImage
      ? { url: node.featuredImage.node.sourceUrl, alt: node.featuredImage.node.altText || node.title }
      : { url: "", alt: node.title, placeholder: "purple" },
    gallery: node.wikiFields?.gallery?.map((g) => ({ url: g.sourceUrl, alt: g.altText })) ?? [],
    stats: safeParseStats(node.wikiFields?.stats),
    tags: [],
    relatedSlugs: node.wikiFields?.relatedSlugs?.split(",").map((s) => s.trim()) ?? [],
    updatedAt: node.modified,
  };
}

function safeParseStats(raw?: string): { label: string; value: string }[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/* ── Public API: Articles ───────────────────────────── */

export async function getArticles(options: { category?: string; limit?: number } = {}): Promise<Article[]> {
  const data = await fetchGraphQL<{ posts: { nodes: WpPost[] } }>(
    GET_ARTICLES,
    { first: options.limit ?? 12, category: options.category },
    { tags: ["wordpress", "articles"] },
  );

  if (data?.posts?.nodes?.length) return data.posts.nodes.map(mapPost);

  let articles = [...MOCK_ARTICLES];
  if (options.category) {
    articles = articles.filter((a) => a.category.toLowerCase() === options.category!.toLowerCase());
  }
  return articles.slice(0, options.limit ?? 12);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const data = await fetchGraphQL<{ post: WpPost | null }>(
    GET_ARTICLE_BY_SLUG,
    { slug },
    { tags: ["wordpress", "articles", `article:${slug}`] },
  );

  if (data?.post) return mapPost(data.post);
  return MOCK_ARTICLES.find((a) => a.slug === slug) ?? null;
}

export async function getAllArticleSlugs(): Promise<{ slug: string; modified?: string }[]> {
  const data = await fetchGraphQL<{ posts: { nodes: { slug: string; modified: string }[] } }>(
    GET_ALL_ARTICLE_SLUGS,
    {},
    { tags: ["wordpress", "articles"] },
  );
  if (data?.posts?.nodes?.length) return data.posts.nodes;
  return MOCK_ARTICLES.map((a) => ({ slug: a.slug, modified: a.publishedAt }));
}

export async function getFeaturedArticles(limit = 3): Promise<Article[]> {
  const articles = await getArticles({ limit: 24 });
  const featured = articles.filter((a) => a.featured);
  return (featured.length ? featured : articles).slice(0, limit);
}

/* ── Public API: Wiki ───────────────────────────────── */

export async function getWikiEntries(category: WikiCategorySlug): Promise<WikiEntry[]> {
  const names = WIKI_GRAPHQL_NAMES[category];
  const data = await fetchGraphQL<Record<string, { nodes: WpWikiNode[] }>>(
    wikiEntriesQuery(names.plural),
    {},
    { tags: ["wordpress", "wiki", `wiki:${category}`] },
  );

  const nodes = data?.[names.plural]?.nodes;
  if (nodes?.length) return nodes.map((n) => mapWikiNode(n, category));
  return MOCK_WIKI.filter((e) => e.category === category);
}

export async function getWikiEntry(category: WikiCategorySlug, slug: string): Promise<WikiEntry | null> {
  const names = WIKI_GRAPHQL_NAMES[category];
  const data = await fetchGraphQL<Record<string, WpWikiNode | null>>(
    wikiEntryBySlugQuery(names.singular),
    { slug },
    { tags: ["wordpress", "wiki", `wiki:${category}:${slug}`] },
  );

  const node = data?.[names.singular];
  if (node) return mapWikiNode(node, category);
  return MOCK_WIKI.find((e) => e.category === category && e.slug === slug) ?? null;
}

export async function getAllWikiEntries(): Promise<WikiEntry[]> {
  return MOCK_WIKI; // In production, aggregate per-category queries here.
}
