import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SectionHeading } from "@/components/shared/section-heading";
import { ViceMap } from "@/features/map/vice-map";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Interactive Vice City Map",
  description:
    "Explore the community-built speculative map of Vice City — districts, landmarks, and location case files. Fan-made, not official.",
  path: "/map",
});

export default function MapPage() {
  return (
    <div className="container pt-28">
      <Breadcrumbs items={[{ label: "Map" }]} />
      <SectionHeading
        eyebrow="Cartography Division // Speculative"
        title="The City Grid"
        description="A community-built map assembled from official footage analysis. Click a district to open its case file. Mapbox satellite mode activates when a token is configured."
      />
      <ViceMap />
      <p className="mt-8 rounded-lg border border-neon-yellow/20 bg-neon-yellow/5 p-4 font-mono text-xs leading-relaxed text-muted-foreground">
        ⚠ This map is speculative fan cartography based on public footage. It is not official material and will be
        updated as new evidence is confirmed. To enable the Mapbox GL powered version, set NEXT_PUBLIC_MAPBOX_TOKEN and
        swap in the MapboxMap component documented in the README.
      </p>
    </div>
  );
}
