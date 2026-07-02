import { notFound } from "next/navigation";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Gallery } from "@/components/shared/gallery";
import { MediaImage } from "@/components/shared/media-image";
import { WikiEntryCard } from "@/components/shared/wiki-entry-card";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { WIKI_CATEGORIES } from "@/lib/constants";
import { absoluteUrl, formatDate, slugify } from "@/lib/utils";
import { getAllWikiEntries, getWikiEntry } from "@/services/wordpress";
import { MOCK_WIKI } from "@/lib/mock-data";
import type { WikiCategorySlug } from "@/types";

export const revalidate = 600;

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

export function generateStaticParams() {
  return MOCK_WIKI.map((entry) => ({ category: entry.category, slug: entry.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { category, slug } = await params;
  const entry = await getWikiEntry(category as WikiCategorySlug, slug);
  if (!entry) return buildMetadata({ noIndex: true });
  return buildMetadata({
    title: entry.title,
    description: entry.summary,
    path: `/wiki/${entry.category}/${entry.slug}`,
    ogImage: entry.heroImage.url || undefined,
  });
}

/** Split markdown-ish content into H2 sections for TOC + rendering */
function parseSections(content: string): { heading: string; body: string }[] {
  const parts = content.split(/^## /m).filter(Boolean);
  return parts.map((part) => {
    const [heading, ...rest] = part.split("\n");
    return { heading: heading.trim(), body: rest.join("\n").trim() };
  });
}

export default async function WikiEntryPage({ params }: PageProps) {
  const { category, slug } = await params;
  const config = WIKI_CATEGORIES.find((c) => c.slug === category);
  if (!config) notFound();

  const entry = await getWikiEntry(category as WikiCategorySlug, slug);
  if (!entry) notFound();

  const sections = parseSections(entry.content);
  const allEntries = await getAllWikiEntries();
  const related = allEntries.filter((e) => entry.relatedSlugs.includes(e.slug)).slice(0, 4);

  return (
    <div className="container pt-28">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: entry.title,
          description: entry.summary,
          dateModified: entry.updatedAt,
          mainEntityOfPage: absoluteUrl(`/wiki/${entry.category}/${entry.slug}`),
        }}
      />
      <Breadcrumbs
        items={[
          { label: "Wiki", href: "/wiki" },
          { label: config.label, href: `/wiki/${config.slug}` },
          { label: entry.title },
        ]}
      />

      {/* Hero */}
      <div className="relative overflow-hidden rounded-lg">
        <MediaImage image={entry.heroImage} className="aspect-[21/9] w-full" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-vice-black via-vice-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 sm:p-10">
          <Badge variant="blue">{config.label}</Badge>
          <h1 className="mt-3 font-display text-3xl font-black uppercase tracking-tight sm:text-5xl">
            {entry.title}
          </h1>
          <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Last updated {formatDate(entry.updatedAt)}
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
        {/* Main content */}
        <div>
          <p className="text-lg leading-relaxed text-muted-foreground">{entry.summary}</p>
          <Separator className="my-8" />

          {sections.map((section) => (
            <section key={section.heading} id={slugify(section.heading)} className="mb-10 scroll-mt-24">
              <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-neon-blue">
                {section.heading}
              </h2>
              <p className="mt-4 whitespace-pre-line leading-relaxed text-foreground/90">{section.body}</p>
            </section>
          ))}

          {entry.gallery.length > 0 && (
            <>
              <Separator className="my-8" />
              <Gallery images={entry.gallery} title="Evidence Gallery" />
            </>
          )}

          {/* Comments placeholder — wire to WPGraphQL comments or a provider like Giscus */}
          <Separator className="my-8" />
          <section aria-labelledby="comments">
            <h2 id="comments" className="flex items-center gap-2 font-display text-2xl font-bold uppercase tracking-wide">
              <MessageSquare className="h-6 w-6 text-neon-pink" aria-hidden="true" />
              Field Notes
            </h2>
            <div className="glass mt-4 rounded-lg p-8 text-center">
              <p className="font-mono text-sm text-muted-foreground">
                Comments open when you connect your WordPress backend (WPGraphQL comments) or a provider like Giscus.
              </p>
              <Link href="/community" className="evidence-tag mt-3 inline-block hover:text-neon-pink">
                Discuss in the Community →
              </Link>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {/* Table of contents */}
          {sections.length > 1 && (
            <nav className="glass rounded-lg p-5" aria-label="Table of contents">
              <p className="evidence-tag mb-3">Table of Contents</p>
              <ol className="space-y-2 text-sm">
                {sections.map((section, i) => (
                  <li key={section.heading}>
                    <a
                      href={`#${slugify(section.heading)}`}
                      className="flex gap-2 text-muted-foreground transition-colors hover:text-neon-blue"
                    >
                      <span className="font-mono text-neon-pink">{String(i + 1).padStart(2, "0")}</span>
                      {section.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* Statistics panel */}
          {entry.stats.length > 0 && (
            <div className="glass rounded-lg p-5">
              <p className="evidence-tag mb-3">Case Statistics</p>
              <dl className="space-y-3">
                {entry.stats.map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between gap-4 border-b border-white/5 pb-2 last:border-0">
                    <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{stat.label}</dt>
                    <dd className="text-right text-sm font-medium text-neon-blue">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Tags */}
          {entry.tags.length > 0 && (
            <div className="glass rounded-lg p-5">
              <p className="evidence-tag mb-3">Tags</p>
              <div className="flex flex-wrap gap-2">
                {entry.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Related content */}
      {related.length > 0 && (
        <section className="mt-16" aria-labelledby="related">
          <h2 id="related" className="mb-6 font-display text-2xl font-bold uppercase tracking-wide">
            <span className="gradient-text">Related Files</span>
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((relatedEntry) => (
              <WikiEntryCard key={relatedEntry.id} entry={relatedEntry} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
