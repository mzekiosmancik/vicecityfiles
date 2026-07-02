import Link from "next/link";
import { ArrowRight, Fingerprint } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MediaImage } from "@/components/shared/media-image";
import { SectionHeading } from "@/components/shared/section-heading";
import { SlideUp } from "@/components/shared/motion";
import type { WikiEntry } from "@/types";

export function CharacterSpotlight({ character }: { character: WikiEntry | null }) {
  if (!character) return null;

  return (
    <section className="container py-20" aria-labelledby="character-spotlight">
      <SectionHeading eyebrow="Section 05 // Persons of Interest" title="Character Spotlight" />
      <SlideUp>
        <div className="glass overflow-hidden rounded-lg lg:grid lg:grid-cols-2">
          <MediaImage image={character.heroImage} className="aspect-[4/3] w-full lg:aspect-auto lg:h-full" sizes="(max-width: 1024px) 100vw, 50vw" />
          <div className="relative p-8 lg:p-12">
            <Fingerprint className="absolute right-8 top-8 h-16 w-16 text-neon-pink/10" aria-hidden="true" />
            <Badge>Active File</Badge>
            <h3 className="mt-4 font-display text-3xl font-extrabold uppercase tracking-tight">
              {character.title}
            </h3>
            <p className="mt-4 leading-relaxed text-muted-foreground">{character.summary}</p>
            <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 font-mono text-sm">
              {character.stats.slice(0, 4).map((stat) => (
                <div key={stat.label}>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">{stat.label}</dt>
                  <dd className="mt-1 text-neon-blue">{stat.value}</dd>
                </div>
              ))}
            </dl>
            <Button asChild className="mt-8" variant="outline">
              <Link href={`/wiki/characters/${character.slug}`}>
                Open Dossier <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </SlideUp>
    </section>
  );
}
