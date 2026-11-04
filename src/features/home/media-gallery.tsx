import Link from "next/link";
import { Clapperboard, Image as ImageIcon, MonitorPlay, Palette } from "lucide-react";
import { SectionHeading, sectionEyebrow } from "@/components/shared/section-heading";
import { StaggerContainer, StaggerItem } from "@/components/shared/motion";
import { MediaImage } from "@/components/shared/media-image";
import { cn } from "@/lib/utils";
import type { ImageAsset, MediaKind } from "@/types";

const TILE_TINT = {
  pink: "from-neon-pink/10 to-transparent",
  purple: "from-neon-purple/10 to-transparent",
  blue: "from-neon-blue/10 to-transparent",
  orange: "from-neon-orange/10 to-transparent",
} as const;

const MEDIA_TILES = [
  {
    label: "Wallpapers",
    kind: "wallpaper" as const,
    description: "High-res stills for your desktop",
    icon: ImageIcon,
    href: "/media#wallpapers",
    placeholder: "pink" as const,
  },
  {
    label: "Fan Art",
    kind: "fanart" as const,
    description: "Community illustrations & renders",
    icon: Palette,
    href: "/media#fanart",
    placeholder: "purple" as const,
  },
  {
    label: "Videos",
    kind: "video" as const,
    description: "Official trailers & videos",
    icon: Clapperboard,
    href: "/media#videos",
    placeholder: "orange" as const,
  },
  {
    label: "Breakdowns",
    kind: "breakdown" as const,
    description: "Analysis breakdowns & documentaries",
    icon: MonitorPlay,
    href: "/media#breakdowns",
    placeholder: "blue" as const,
  },
];

interface MediaGallerySectionProps {
  /** Cover image and item count per media kind (from getMediaLibrary). */
  library: Record<MediaKind, { cover?: ImageAsset; count: number }>;
  index: number;
}

export function MediaGallerySection({ library, index }: MediaGallerySectionProps) {
  // Image tiles only when every tile has one; a mix of photos and placeholders looks broken.
  const withImages = MEDIA_TILES.every((t) => library[t.kind].cover);
  return (
    <section className="container py-14 sm:py-20" aria-labelledby="media-gallery">
      <SectionHeading id="media-gallery"
        eyebrow={sectionEyebrow(index, "Evidence Locker")}
        title="Media Gallery"
        description="Wallpapers, fanart, video breakdowns, and the complete trailer archive."
      />
      <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MEDIA_TILES.map((tile) => (
          <StaggerItem key={tile.label} className="h-full">
            <Link href={tile.href} className="group block h-full">
              {withImages ? (
                <div className="glass neon-border-hover h-full overflow-hidden rounded-lg">
                  <MediaImage
                    image={library[tile.kind].cover!}
                    className="aspect-video w-full transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 25vw"
                  />
                  <div className="p-5">
                    <div className="flex items-center gap-2">
                      <tile.icon className="h-5 w-5 text-neon-blue" aria-hidden="true" />
                      <h3 className="font-display font-bold uppercase tracking-wide">{tile.label}</h3>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{tile.description}</p>
                  </div>
                </div>
              ) : (
                // No gallery images yet: compact icon tiles instead of four identical placeholders.
                <div
                  className={cn(
                    "glass neon-border-hover flex h-full items-start gap-4 rounded-lg bg-gradient-to-br p-5",
                    TILE_TINT[tile.placeholder],
                  )}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-black/30">
                    <tile.icon className="h-5 w-5 text-neon-blue transition-colors group-hover:text-neon-pink" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="flex items-baseline justify-between gap-2 font-display font-bold uppercase tracking-wide">
                      {tile.label}
                      {library[tile.kind].count > 0 && (
                        <span className="font-mono text-[10px] font-normal text-neon-blue">{library[tile.kind].count}</span>
                      )}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{tile.description}</p>
                  </div>
                </div>
              )}
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
