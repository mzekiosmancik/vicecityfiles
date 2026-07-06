import "server-only";
import { fetchGraphQL } from "@/graphql/client";
import {
  GET_ARTICLES,
  GET_ARTICLE_BY_SLUG,
  GET_ALL_ARTICLE_SLUGS,
  GET_GALERY_ITEMS,
  wikiEntriesQuery,
  wikiEntryBySlugQuery,
} from "@/graphql/queries";
//import { MOCK_ARTICLES, MOCK_WIKI } from "@/lib/mock-data";
import { readingTime } from "@/lib/utils";
import type { Article, ImageAsset, WikiCategorySlug, WikiEntry } from "@/types";
import { RUMOR_LEVELS, type RumorLevel } from "@/lib/constants";

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
  articlefields?: { rumorlevel?: string | string[]; featured?: boolean };
}

interface WpWikiNode {
  id: string;
  slug: string;
  title: string;
  modified: string;
  content: string;
  featuredImage?: { node: WpImage };
  wikifields?: {
    summary?: string;
    stats?: string;
    relatedslugs?: string;
    image?: { node: WpImage };
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
    rumorLevel: normalizeRumorLevel(post.articlefields?.rumorlevel),
    featured: post.articlefields?.featured ?? false,
  };
}

function normalizeRumorLevel(raw?: string | string[]): RumorLevel | undefined {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return undefined;
  const key = value.toLowerCase() as RumorLevel;
  return key in RUMOR_LEVELS ? key : undefined;
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
    summary: node.wikifields?.summary ?? "",
    content: stripHtml(node.content ?? ""),
    heroImage: node.featuredImage
      ? { url: node.featuredImage.node.sourceUrl, alt: node.featuredImage.node.altText || node.title }
      : { url: "", alt: node.title, placeholder: "purple" },
    gallery: node.wikifields?.image
      ? [{ url: node.wikifields.image.node.sourceUrl, alt: node.wikifields.image.node.altText || node.title }]
      : [],
    stats: safeParseStats(node.wikifields?.stats),
    tags: [],
    relatedSlugs: node.wikifields?.relatedslugs?.split(",").map((s: string) => s.trim()) ?? [],
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

  // let articles = [...GET_ARTICLES];
  // if (options.category) {
  //   articles = articles.filter((a) => a.category.toLowerCase() === options.category!.toLowerCase());
  // }
  // return articles.slice(0, options.limit ?? 12);
  // Only return real API results; if none, return empty array
  return data?.posts?.nodes?.length ? data.posts.nodes.map(mapPost) : [];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const data = await fetchGraphQL<{ post: WpPost | null }>(
    GET_ARTICLE_BY_SLUG,
    { slug },
    { tags: ["wordpress", "articles", `article:${slug}`] },
  );

  return data?.post ? mapPost(data.post) : null;
}

export async function getAllArticleSlugs(): Promise<{ slug: string; modified?: string }[]> {
  const data = await fetchGraphQL<{ posts: { nodes: { slug: string; modified: string }[] } }>(
    GET_ALL_ARTICLE_SLUGS,
    {},
    { tags: ["wordpress", "articles"] },
  );
  return data?.posts?.nodes?.length ? data.posts.nodes : [];
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
  return nodes?.length ? nodes.map((n) => mapWikiNode(n, category)) : [];
}

export async function getWikiEntry(category: WikiCategorySlug, slug: string): Promise<WikiEntry | null> {
  const names = WIKI_GRAPHQL_NAMES[category];
  const data = await fetchGraphQL<Record<string, WpWikiNode | null>>(
    wikiEntryBySlugQuery(names.singular),
    { slug },
    { tags: ["wordpress", "wiki", `wiki:${category}:${slug}`] },
  );

  const node = data?.[names.singular];
  return node ? mapWikiNode(node, category) : null;
}

export async function getAllWikiEntries(): Promise<WikiEntry[]> {
  const categories: WikiCategorySlug[] = [
    "characters",
    "vehicles",
    "locations",
    "weapons",
    "missions",
    "businesses",
    "gangs",
    "easter-eggs",
  ];

  const results = await Promise.all(
    categories.map(async (category) => {
      const names = WIKI_GRAPHQL_NAMES[category];
      const data = await fetchGraphQL<Record<string, { nodes: WpWikiNode[] }>>(
        wikiEntriesQuery(names.plural),
        { first: 50 },
        { tags: ["wordpress", "wiki", `wiki:${category}`] },
      );
      const nodes = data?.[names.plural]?.nodes;
      return nodes?.length ? nodes.map((n) => mapWikiNode(n, category)) : [];
    })
  );

  return results.flat();
}

/* ── Public API: Media Gallery ──────────────────────── */

interface WpGaleryNode {
  id: string;
  title: string;
  featuredImage?: { node: WpImage };
}

export async function getGaleryImages(limit = 12): Promise<ImageAsset[]> {
  const data = await fetchGraphQL<{ galeries: { nodes: WpGaleryNode[] } }>(
    GET_GALERY_ITEMS,
    { first: limit },
    { tags: ["wordpress", "galery"] },
  );

  const nodes = data?.galeries?.nodes ?? [];
  return nodes
    .filter((n) => n.featuredImage)
    .map((n) => ({
      url: n.featuredImage!.node.sourceUrl,
      alt: n.featuredImage!.node.altText || stripHtml(n.title),
      width: n.featuredImage!.node.mediaDetails?.width,
      height: n.featuredImage!.node.mediaDetails?.height,
    }));
}
