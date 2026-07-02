import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SectionHeading } from "@/components/shared/section-heading";
import { WikiEntryCard } from "@/components/shared/wiki-entry-card";
import { StaggerContainer, StaggerItem } from "@/components/shared/motion";
import { buildMetadata } from "@/lib/seo";
import { WIKI_CATEGORIES } from "@/lib/constants";
import { getWikiEntries } from "@/services/wordpress";
import type { WikiCategorySlug } from "@/types";

export const revalidate = 600;

interface PageProps {
  params: Promise<{ category: string }>;
}

function getCategory(slug: string) {
  return WIKI_CATEGORIES.find((c) => c.slug === slug);
}

export function generateStaticParams() {
  return WIKI_CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { category } = await params;
  const config = getCategory(category);
  if (!config) return buildMetadata({ noIndex: true });
  return buildMetadata({
    title: `${config.label} — Wiki`,
    description: `${config.description} Browse every ${config.label.toLowerCase()} file in the unofficial GTA 6 archive.`,
    path: `/wiki/${config.slug}`,
  });
}

export default async function WikiCategoryPage({ params }: PageProps) {
  const { category } = await params;
  const config = getCategory(category);
  if (!config) notFound();

  const entries = await getWikiEntries(category as WikiCategorySlug);

  return (
    <div className="container pt-28">
      <Breadcrumbs items={[{ label: "Wiki", href: "/wiki" }, { label: config.label }]} />
      <SectionHeading
        eyebrow={`Department // ${config.label}`}
        title={config.label}
        description={config.description}
      />
      {entries.length === 0 ? (
        <p className="glass rounded-lg p-10 text-center font-mono text-sm text-muted-foreground">
          No files in this department yet. The investigation continues.
        </p>
      ) : (
        <StaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {entries.map((entry) => (
            <StaggerItem key={entry.id} className="h-full">
              <WikiEntryCard entry={entry} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </div>
  );
}
