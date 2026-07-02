import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SectionHeading } from "@/components/shared/section-heading";
import { WikiCard } from "@/components/shared/wiki-card";
import { StaggerContainer, StaggerItem } from "@/components/shared/motion";
import { buildMetadata } from "@/lib/seo";
import { WIKI_CATEGORIES } from "@/lib/constants";
import { getAllWikiEntries } from "@/services/wordpress";

export const revalidate = 600;

export const metadata = buildMetadata({
  title: "Wiki — The Complete Archive",
  description:
    "The complete unofficial GTA 6 wiki: characters, vehicles, locations, weapons, missions, businesses, gangs, and easter eggs.",
  path: "/wiki",
});

export default async function WikiPage() {
  const entries = await getAllWikiEntries();
  const counts = entries.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="container pt-28">
      <Breadcrumbs items={[{ label: "Wiki" }]} />
      <SectionHeading
        eyebrow="The Archive // All Departments"
        title="Vice City Wiki"
        description="Every file in the investigation. Community-maintained, source-linked, and updated the moment new evidence drops."
      />
      <StaggerContainer className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {WIKI_CATEGORIES.map((category) => (
          <StaggerItem key={category.slug} className="h-full">
            <WikiCard {...category} count={counts[category.slug] ?? 0} />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}
