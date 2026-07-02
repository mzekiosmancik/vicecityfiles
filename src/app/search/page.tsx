import Link from "next/link";
import { FileText, Package, Users } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SectionHeading } from "@/components/shared/section-heading";
import { buildMetadata } from "@/lib/seo";
import { searchAll } from "@/services/search";
import type { SearchResult } from "@/types";

export const metadata = buildMetadata({
  title: "Search the Archive",
  description: "Search every article, wiki file, product, and community post on Vice City Files.",
  path: "/search",
  noIndex: true,
});

const TYPE_META: Record<SearchResult["type"], { label: string; icon: typeof FileText; color: string }> = {
  article: { label: "News & Articles", icon: FileText, color: "text-neon-blue" },
  wiki: { label: "Wiki Files", icon: Users, color: "text-neon-pink" },
  product: { label: "Merch", icon: Package, color: "text-neon-orange" },
  community: { label: "Community", icon: Users, color: "text-neon-purple" },
};

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q = "" } = await searchParams;
  const results = q ? await searchAll(q) : [];

  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    (acc[r.type] ??= []).push(r);
    return acc;
  }, {});

  return (
    <div className="container pt-28">
      <Breadcrumbs items={[{ label: "Search" }]} />
      <SectionHeading
        eyebrow="Records Department"
        title={q ? `Results for "${q}"` : "Search the Archive"}
        description={q ? `${results.length} file(s) match your query.` : "Use the search bar (Ctrl+K) to query the archive."}
      />

      {q && results.length === 0 && (
        <p className="glass rounded-lg p-10 text-center font-mono text-sm text-muted-foreground">
          No files match &quot;{q}&quot;. Try a different term.
        </p>
      )}

      {Object.entries(grouped).map(([type, items]) => {
        const meta = TYPE_META[type as SearchResult["type"]];
        return (
          <section key={type} className="mb-10" aria-labelledby={`search-${type}`}>
            <h2 id={`search-${type}`} className="evidence-tag mb-4 flex items-center gap-2">
              <meta.icon className={`h-4 w-4 ${meta.color}`} aria-hidden="true" />
              {meta.label} ({items.length})
            </h2>
            <div className="space-y-3">
              {items.map((result, i) => (
                <Link
                  key={`${type}-${i}`}
                  href={result.href}
                  className="glass neon-border-hover block rounded-lg p-5"
                >
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {result.category}
                  </p>
                  <h3 className="mt-1 font-display font-bold">{result.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{result.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
