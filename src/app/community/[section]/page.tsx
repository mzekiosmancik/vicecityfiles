import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SectionHeading } from "@/components/shared/section-heading";
import { StaggerContainer, StaggerItem } from "@/components/shared/motion";
import { CommunityPostCard } from "@/features/community/post-card";
import { buildMetadata } from "@/lib/seo";
import { MOCK_COMMUNITY } from "@/lib/mock-data";

const SECTIONS = {
  theories: {
    label: "Fan Theories",
    description: "Evidence-backed speculation from the community. Every theory gets rated on the board.",
  },
  "fan-art": {
    label: "Fan Art",
    description: "Original artwork inspired by the neon coast. Artists always credited.",
  },
  discussions: {
    label: "Discussions",
    description: "Open threads — physics, soundtrack predictions, map arguments, all of it.",
  },
} as const;

type SectionSlug = keyof typeof SECTIONS;

interface PageProps {
  params: Promise<{ section: string }>;
}

export function generateStaticParams() {
  return Object.keys(SECTIONS).map((section) => ({ section }));
}

export async function generateMetadata({ params }: PageProps) {
  const { section } = await params;
  const config = SECTIONS[section as SectionSlug];
  if (!config) return buildMetadata({ noIndex: true });
  return buildMetadata({
    title: `${config.label} — Community`,
    description: config.description,
    path: `/community/${section}`,
  });
}

export default async function CommunitySectionPage({ params }: PageProps) {
  const { section } = await params;
  const config = SECTIONS[section as SectionSlug];
  if (!config) notFound();

  const posts = MOCK_COMMUNITY.filter((p) => p.section === section);

  return (
    <div className="container pt-28">
      <Breadcrumbs items={[{ label: "Community", href: "/community" }, { label: config.label }]} />
      <SectionHeading eyebrow={`The Bureau // ${config.label}`} title={config.label} description={config.description} />

      {posts.length === 0 ? (
        <p className="glass rounded-lg p-10 text-center font-mono text-sm text-muted-foreground">
          The board is empty. Be the first to post when accounts go live.
        </p>
      ) : (
        <StaggerContainer className="grid gap-5 md:grid-cols-2">
          {posts.map((post) => (
            <StaggerItem key={post.id}>
              <CommunityPostCard post={post} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </div>
  );
}
