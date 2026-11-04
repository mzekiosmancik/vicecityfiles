import { SectionHeading, sectionEyebrow } from "@/components/shared/section-heading";
import { FadeIn } from "@/components/shared/motion";
import { ViceMap } from "@/features/map/vice-map";
import type { MapRegionData } from "@/lib/map";
import type { ImageAsset } from "@/types";

interface MapPreviewSectionProps {
  index: number;
  regions: MapRegionData[];
  mapImage?: ImageAsset | null;
}

export function MapPreviewSection({ index, regions, mapImage }: MapPreviewSectionProps) {
  return (
    <section className="container py-14 sm:py-20" aria-labelledby="map-preview">
      <SectionHeading id="map-preview"
        eyebrow={sectionEyebrow(index, "Cartography Division")}
        title="The City Grid"
        description="Every region of Leonida. Pick one to see the location files inside it."
      />
      <FadeIn>
        <ViceMap compact regions={regions} mapImage={mapImage} />
      </FadeIn>
    </section>
  );
}
