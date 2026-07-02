import "server-only";
import { MOCK_ARTICLES, MOCK_COMMUNITY, MOCK_PRODUCTS, MOCK_WIKI } from "@/lib/mock-data";
import { truncate } from "@/lib/utils";
import type { SearchResult } from "@/types";

/**
 * Global search across articles, wiki entries, products, and community posts.
 * In production this should also hit WPGraphQL's `search` argument (see
 * SEARCH_CONTENT query) and merge results; the local index guarantees the
 * feature works before the CMS is connected.
 */
export async function searchAll(term: string): Promise<SearchResult[]> {
  const q = term.trim().toLowerCase();
  if (q.length < 2) return [];

  const matches = (...fields: (string | undefined)[]) =>
    fields.some((f) => f?.toLowerCase().includes(q));

  const results: SearchResult[] = [];

  for (const a of MOCK_ARTICLES) {
    if (matches(a.title, a.excerpt, a.category, ...a.tags)) {
      results.push({
        type: "article",
        category: a.category,
        title: a.title,
        excerpt: truncate(a.excerpt, 120),
        href: `/news/${a.slug}`,
      });
    }
  }

  for (const w of MOCK_WIKI) {
    if (matches(w.title, w.summary, w.category, ...w.tags)) {
      results.push({
        type: "wiki",
        category: w.category.replace("-", " "),
        title: w.title,
        excerpt: truncate(w.summary, 120),
        href: `/wiki/${w.category}/${w.slug}`,
      });
    }
  }

  for (const p of MOCK_PRODUCTS) {
    if (matches(p.name, p.description, p.category)) {
      results.push({
        type: "product",
        category: p.category,
        title: p.name,
        excerpt: truncate(p.description, 120),
        href: `/store/${p.slug}`,
      });
    }
  }

  for (const c of MOCK_COMMUNITY) {
    if (matches(c.title, c.excerpt)) {
      results.push({
        type: "community",
        category: c.section.replace("-", " "),
        title: c.title,
        excerpt: truncate(c.excerpt, 120),
        href: `/community/${c.section}`,
      });
    }
  }

  return results.slice(0, 20);
}
