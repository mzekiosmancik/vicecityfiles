import Link from "next/link";
import { ArrowRight, Clapperboard, Image as ImageIcon, MonitorPlay, Palette, type LucideIcon } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SectionHeading } from "@/components/shared/section-heading";
import { FadeIn } from "@/components/shared/motion";
import { MediaImageGrid } from "@/features/media/media-image-grid";
import { YouTubeGrid } from "@/features/media/youtube-grid";
import { MEDIA_SECTIONS } from "@/lib/media";
import { buildMetadata } from "@/lib/seo";
import { getMediaLibrary } from "@/services/wordpress";
import type { MediaKind } from "@/types";

export const revalidate = 300;

export const metadata = buildMetadata({
  title: "Media — Wallpapers, Fan Art, Videos & Trailers",
  description:
    "GTA VI wallpapers, community fan art, video breakdowns, and the official trailer archive — trailers play from Rockstar's own channel.",
  path: "/media",
});

const ICONS: Record<MediaKind, LucideIcon> = {
  wallpaper: ImageIcon,
  fanart: Palette,
  video: MonitorPlay,
  breakdown: Clapperboard,
};

const EMPTY: Partial<Record<MediaKind, { text: string; cta?: { label: string; href: string } }>> = {
  fanart: {
    text: "No fan art in the locker yet. Made something neon? Share it with the community and it could be featured here — always credited to you.",
    cta: { label: "Share your art", href: "/community/fan-art" },
  },
  breakdown: {
    text: "Frame-by-frame breakdowns are being cut right now. Until then, watch the official trailers above.",
    cta: { label: "Jump to videos", href: "#videos" },
  },
};

export default async function MediaPage() {
  const library = await getMediaLibrary();

  return (
    <div className="container pt-28">
      <Breadcrumbs items={[{ label: "Media" }]} />
      <SectionHeading
        eyebrow="Evidence Locker // Public Access"
        title="Media Gallery"
        description="Wallpapers, fan art, breakdowns and trailers. Official material is credited to Rockstar Games; trailers play from their channel, never rehosted."
      />

      {/* Section jump bar */}
      <nav aria-label="Media sections" className="no-scrollbar -mx-4 mb-12 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {MEDIA_SECTIONS.map((section) => {
          const Icon = ICONS[section.kind];
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="glass flex shrink-0 items-center gap-2 rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-neon-blue"
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {section.title}
              <span className="tabular-nums text-neon-blue">{library[section.kind].length}</span>
            </a>
          );
        })}
      </nav>

      {MEDIA_SECTIONS.map((section) => {
        const items = library[section.kind];
        const Icon = ICONS[section.kind];
        const empty = EMPTY[section.kind];
        return (
          <section
            key={section.id}
            id={section.id}
            className="mb-20 scroll-mt-24"
            aria-labelledby={`${section.id}-heading`}
          >
            <h2
              id={`${section.id}-heading`}
              className="flex items-center gap-3 font-display text-2xl font-bold uppercase tracking-wide"
            >
              <Icon className="h-6 w-6 text-neon-blue" aria-hidden="true" />
              <span className="gradient-text">{section.title}</span>
            </h2>
            <p className="mb-6 mt-2 max-w-2xl text-sm text-muted-foreground">{section.description}</p>

            <FadeIn>
              {items.length ? (
                section.kind === "video" || section.kind === "breakdown" ? (
                  <YouTubeGrid items={items} featureFirst={section.kind === "video"} />
                ) : (
                  <MediaImageGrid items={items} layout={section.kind === "fanart" ? "art" : "wallpapers"} />
                )
              ) : (
                <div className="glass flex flex-col items-start gap-4 rounded-lg p-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-xl text-sm text-muted-foreground">{empty?.text ?? "Nothing filed here yet."}</p>
                  {empty?.cta && (
                    <Link
                      href={empty.cta.href}
                      className="inline-flex shrink-0 items-center gap-2 font-mono text-xs uppercase tracking-widest text-neon-blue transition-colors hover:text-neon-pink"
                    >
                      {empty.cta.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  )}
                </div>
              )}
            </FadeIn>
          </section>
        );
      })}
    </div>
  );
}
