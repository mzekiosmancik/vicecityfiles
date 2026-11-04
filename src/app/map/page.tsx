import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SectionHeading } from "@/components/shared/section-heading";
import { ViceMap } from "@/features/map/vice-map";
import { buildMetadata } from "@/lib/seo";
import { buildMapRegions } from "@/lib/map";
import { getAllWikiEntries, getMapImage } from "@/services/wordpress";

export const revalidate = 300;

export const metadata = buildMetadata({
  title: "Interactive Vice City Map",
  description:
    "Explore the regions of Leonida — Vice City, Leonida Keys, Grassrivers and more — and every location file inside them. Fan-made, not official.",
  path: "/map",
});

export default async function MapPage() {
  const [entries, mapImage] = await Promise.all([getAllWikiEntries(), getMapImage()]);
  const regions = buildMapRegions(entries);

  return (
    <div className="container pt-28">
      <Breadcrumbs items={[{ label: "Map" }]} />
      <SectionHeading
        eyebrow="Cartography Division // Speculative"
        title="The City Grid"
        description="Every region of Leonida from the archive. Pick a region to see the location files inside it."
      />
      <ViceMap regions={regions} mapImage={mapImage} />
      <p className="mt-8 rounded-lg border border-neon-yellow/20 bg-neon-yellow/5 p-4 font-mono text-xs leading-relaxed text-muted-foreground">
        ⚠ This is fan-made cartography based on public footage and official region names. It is not official material
        and will be updated as new evidence is confirmed.
      </p>
    </div>
  );
}
