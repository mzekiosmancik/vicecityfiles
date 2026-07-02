import { SectionHeading } from "@/components/shared/section-heading";
import { FadeIn } from "@/components/shared/motion";
import { ViceMap } from "@/features/map/vice-map";

export function MapPreviewSection() {
  return (
    <section className="container py-20" aria-labelledby="map-preview">
      <SectionHeading
        eyebrow="Section 04 // Cartography Division"
        title="The City Grid"
        description="A community-built speculative map. Click a district to read its case file."
      />
      <FadeIn>
        <ViceMap compact />
      </FadeIn>
    </section>
  );
}
