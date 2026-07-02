import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Gallery } from "@/components/shared/gallery";
import { SectionHeading } from "@/components/shared/section-heading";
import { FadeIn } from "@/components/shared/motion";
import { buildMetadata } from "@/lib/seo";
import type { ImageAsset } from "@/types";

export const metadata = buildMetadata({
  title: "Media — Wallpapers, Fanart, Videos & Trailers",
  description:
    "Original wallpapers, community fanart, video breakdowns, and the complete official trailer archive with timestamps.",
  path: "/media",
});

const WALLPAPERS: ImageAsset[] = [
  { url: "", alt: "Neon boulevard at midnight — original wallpaper", placeholder: "pink" },
  { url: "", alt: "Palm sunset gradient — original wallpaper", placeholder: "orange" },
  { url: "", alt: "Rain-slicked downtown — original wallpaper", placeholder: "blue" },
  { url: "", alt: "Marina lights — original wallpaper", placeholder: "purple" },
  { url: "", alt: "VHS beach static — original wallpaper", placeholder: "pink" },
  { url: "", alt: "Skyline reflections — original wallpaper", placeholder: "blue" },
];

const FANART: ImageAsset[] = [
  { url: "", alt: "Ocean Drive repaint by NoirBrush", placeholder: "purple" },
  { url: "", alt: "Character concept study by community artist", placeholder: "pink" },
  { url: "", alt: "Swamp airboat scene by GatorGrl", placeholder: "orange" },
];

const SECTIONS = [
  { id: "wallpapers", title: "Wallpapers", description: "Original 5K neon-noir wallpapers, free to download.", images: WALLPAPERS },
  { id: "fanart", title: "Fanart", description: "Community illustrations — every piece credited to its artist.", images: FANART },
] as const;

const VIDEO_PLACEHOLDERS = [
  { id: "videos", title: "Video Breakdowns", description: "Frame-analysis documentaries and evidence reviews from our team. Hosted on Cloudinary / YouTube embeds once connected." },
  { id: "trailers", title: "Trailer Archive", description: "Official trailer index with community timestamps and shot catalogs. Embeds link to official channels only — we never rehost copyrighted footage." },
] as const;

export default function MediaPage() {
  return (
    <div className="container pt-28">
      <Breadcrumbs items={[{ label: "Media" }]} />
      <SectionHeading
        eyebrow="Evidence Locker // Public Access"
        title="Media Gallery"
        description="Original art only — official footage is linked, never rehosted."
      />

      {SECTIONS.map((section) => (
        <FadeIn key={section.id}>
          <section id={section.id} className="mb-16 scroll-mt-24" aria-labelledby={`${section.id}-heading`}>
            <h2 id={`${section.id}-heading`} className="font-display text-2xl font-bold uppercase tracking-wide">
              <span className="gradient-text">{section.title}</span>
            </h2>
            <p className="mb-6 mt-2 text-sm text-muted-foreground">{section.description}</p>
            <Gallery images={[...section.images]} />
          </section>
        </FadeIn>
      ))}

      {VIDEO_PLACEHOLDERS.map((section) => (
        <FadeIn key={section.id}>
          <section id={section.id} className="mb-16 scroll-mt-24" aria-labelledby={`${section.id}-heading`}>
            <h2 id={`${section.id}-heading`} className="font-display text-2xl font-bold uppercase tracking-wide">
              <span className="gradient-text">{section.title}</span>
            </h2>
            <p className="mb-6 mt-2 text-sm text-muted-foreground">{section.description}</p>
            <div className="glass grid aspect-[21/9] place-items-center rounded-lg">
              <p className="px-6 text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Video embeds activate when the CMS media library is connected
              </p>
            </div>
          </section>
        </FadeIn>
      ))}
    </div>
  );
}
