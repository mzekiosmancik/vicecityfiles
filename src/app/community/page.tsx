import Link from "next/link";
import { Lightbulb, MessagesSquare, Palette } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SectionHeading } from "@/components/shared/section-heading";
import { StaggerContainer, StaggerItem } from "@/components/shared/motion";
import { CommunityPostCard } from "@/features/community/post-card";
import { buildMetadata } from "@/lib/seo";
import { MOCK_COMMUNITY } from "@/lib/mock-data";

export const metadata = buildMetadata({
  title: "Community — The Bureau",
  description:
    "Fan theories, fan art, and discussions from the Vice City Files community. Post evidence, rate theories, join the investigation.",
  path: "/community",
});

const SECTIONS = [
  {
    slug: "theories",
    label: "Fan Theories",
    icon: Lightbulb,
    description: "Evidence-backed speculation, rated by the community.",
    accent: "text-neon-yellow",
  },
  {
    slug: "fan-art",
    label: "Fan Art",
    icon: Palette,
    description: "Original artwork from the most talented investigators.",
    accent: "text-neon-pink",
  },
  {
    slug: "discussions",
    label: "Discussions",
    icon: MessagesSquare,
    description: "Open threads on everything from physics to soundtrack.",
    accent: "text-neon-blue",
  },
] as const;

export default function CommunityPage() {
  const trending = [...MOCK_COMMUNITY].sort((a, b) => b.likes - a.likes).slice(0, 4);

  return (
    <div className="container pt-28">
      <Breadcrumbs items={[{ label: "Community" }]} />
      <SectionHeading
        eyebrow="The Bureau // Open Investigation"
        title="Community"
        description="Profiles, likes, comments, and bookmarks go live with the auth provider. The case boards are already open."
      />

      <StaggerContainer className="grid gap-5 md:grid-cols-3">
        {SECTIONS.map((section) => (
          <StaggerItem key={section.slug} className="h-full">
            <Link href={`/community/${section.slug}`} className="group block h-full">
              <div className="glass neon-border-hover h-full rounded-lg p-6">
                <section.icon className={`h-8 w-8 ${section.accent}`} aria-hidden="true" />
                <h2 className="mt-4 font-display text-lg font-bold uppercase tracking-wide">{section.label}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{section.description}</p>
                <span className="evidence-tag mt-4 inline-block opacity-0 transition-opacity group-hover:opacity-100">
                  Enter →
                </span>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <section className="mt-16" aria-labelledby="trending">
        <h2 id="trending" className="mb-6 font-display text-2xl font-bold uppercase tracking-wide">
          <span className="gradient-text">Trending on the Board</span>
        </h2>
        <div className="grid gap-5 md:grid-cols-2">
          {trending.map((post) => (
            <CommunityPostCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
