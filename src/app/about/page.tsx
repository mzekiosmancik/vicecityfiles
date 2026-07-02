import Link from "next/link";
import { FileSearch, Scale, ShieldCheck, Sparkles } from "lucide-react";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SectionHeading } from "@/components/shared/section-heading";
import { FadeIn } from "@/components/shared/motion";
import { buildMetadata } from "@/lib/seo";
import { SITE } from "@/lib/constants";

export const metadata = buildMetadata({
  title: "About — The Case Behind the Files",
  description:
    "Vice City Files is an unofficial fan archive for GTA 6 news, wiki files, maps, and theories. Learn about the project, the team, and our content policy.",
  path: "/about",
});

const PRINCIPLES = [
  {
    icon: FileSearch,
    title: "Evidence First",
    body: "Every claim is sourced and dated. Rumors run through the Rumor Meter — Confirmed, Likely, Rumor, or Debunked — and we show our work.",
  },
  {
    icon: Scale,
    title: "Unofficial & Independent",
    body: SITE.disclaimer,
  },
  {
    icon: ShieldCheck,
    title: "No Stolen Assets",
    body: "We never rehost copyrighted footage, screenshots, or artwork. All visuals are original fan creations, credited placeholders, or official links.",
  },
  {
    icon: Sparkles,
    title: "Built by Fans",
    body: "Writers, cartographers, artists, and frame-analysis obsessives — all volunteers united by neon and palm trees.",
  },
];

export default function AboutPage() {
  return (
    <div className="container pt-28">
      <Breadcrumbs items={[{ label: "About" }]} />
      <SectionHeading
        eyebrow="Internal Affairs // Full Disclosure"
        title="About Vice City Files"
        description={`${SITE.tagline} — the story behind the archive.`}
      />

      <FadeIn>
        <div className="glass mx-auto max-w-3xl rounded-lg p-8 leading-relaxed text-muted-foreground">
          <p>
            Vice City Files started as a shared spreadsheet between six fans who slowed a trailer down to 0.25x speed
            and never recovered. Today it&apos;s a full archive: a community wiki, a rated newsroom, speculative
            cartography, an evidence locker of original art, and a merch store that funds the servers.
          </p>
          <p className="mt-4">
            We are not affiliated with Rockstar Games or Take-Two Interactive in any way. We&apos;re the fans in the
            parking lot with a corkboard, red string, and excellent taste in synthwave.
          </p>
        </div>
      </FadeIn>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {PRINCIPLES.map((principle) => (
          <FadeIn key={principle.title}>
            <div className="glass h-full rounded-lg p-6">
              <principle.icon className="h-8 w-8 text-neon-pink" aria-hidden="true" />
              <h2 className="mt-4 font-display text-lg font-bold uppercase tracking-wide">{principle.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{principle.body}</p>
            </div>
          </FadeIn>
        ))}
      </div>

      <FadeIn>
        <div className="glass mt-12 rounded-lg p-8 text-center">
          <h2 className="font-display text-xl font-bold uppercase tracking-wide">Takedown & Contact</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
            Rights holder with a concern, or a fan who spotted an error? Open a report in the{" "}
            <Link href="/community" className="text-neon-blue hover:text-neon-pink">
              community bureau
            </Link>{" "}
            and we&apos;ll respond fast.
          </p>
        </div>
      </FadeIn>
    </div>
  );
}
