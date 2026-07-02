import Link from "next/link";
import { Clapperboard, Image as ImageIcon, MonitorPlay, Palette } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { StaggerContainer, StaggerItem } from "@/components/shared/motion";
import { MediaImage } from "@/components/shared/media-image";

const MEDIA_TILES = [
  {
    label: "Wallpapers",
    description: "Original 5K neon-noir wallpapers",
    icon: ImageIcon,
    href: "/media#wallpapers",
    placeholder: "pink" as const,
  },
  {
    label: "Fanart",
    description: "Community illustrations & renders",
    icon: Palette,
    href: "/media#fanart",
    placeholder: "purple" as const,
  },
  {
    label: "Videos",
    description: "Analysis breakdowns & documentaries",
    icon: MonitorPlay,
    href: "/media#videos",
    placeholder: "blue" as const,
  },
  {
    label: "Trailers",
    description: "Official trailer archive & timestamps",
    icon: Clapperboard,
    href: "/media#trailers",
    placeholder: "orange" as const,
  },
];

export function MediaGallerySection() {
  return (
    <section className="container py-20" aria-labelledby="media-gallery">
      <SectionHeading
        eyebrow="Section 07 // Evidence Locker"
        title="Media Gallery"
        description="Wallpapers, fanart, video breakdowns, and the complete trailer archive."
      />
      <StaggerContainer className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {MEDIA_TILES.map((tile) => (
          <StaggerItem key={tile.label} className="h-full">
            <Link href={tile.href} className="group block h-full">
              <div className="glass neon-border-hover h-full overflow-hidden rounded-lg">
                <MediaImage
                  image={{ url: "", alt: `${tile.label} preview`, placeholder: tile.placeholder }}
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
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
