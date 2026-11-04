import { SectionHeading, sectionEyebrow } from "@/components/shared/section-heading";
import { FadeIn } from "@/components/shared/motion";
import { ViceMap } from "@/features/map/vice-map";

export function MapPreviewSection({ index }: { index: number }) {
  return (
    <section className="container py-14 sm:py-20" aria-labelledby="map-preview">
      <SectionHeading id="map-preview"
        eyebrow={sectionEyebrow(index, "Cartography Division")}
        title="The City Grid"
        description="A community-built speculative map. Click a district to read its case file."
      />
      <FadeIn>
        <ViceMap compact />
      </FadeIn>
    </section>
  );
}
