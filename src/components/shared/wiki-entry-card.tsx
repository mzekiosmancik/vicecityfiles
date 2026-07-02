import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { MediaImage } from "@/components/shared/media-image";
import type { WikiEntry } from "@/types";

/**
 * Generic wiki entry card — powers CharacterCard, VehicleCard, MissionCard,
 * and every other wiki category listing with an evidence-file aesthetic.
 */
export function WikiEntryCard({ entry }: { entry: WikiEntry }) {
  return (
    <article className="group h-full">
      <Link
        href={`/wiki/${entry.category}/${entry.slug}`}
        className="glass neon-border-hover flex h-full flex-col overflow-hidden rounded-lg"
      >
        <div className="relative">
          <MediaImage
            image={entry.heroImage}
            className="aspect-[4/3] w-full transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          <span className="evidence-tag absolute left-3 top-3 rounded bg-vice-black/80 px-2 py-1 backdrop-blur">
            File #{entry.id.toUpperCase()}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-lg font-bold leading-snug transition-colors group-hover:text-neon-pink">
            {entry.title}
          </h3>
          <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">{entry.summary}</p>
          {entry.stats.length > 0 && (
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 border-t border-white/5 pt-3 font-mono text-xs">
              {entry.stats.slice(0, 2).map((stat) => (
                <div key={stat.label}>
                  <dt className="uppercase tracking-wider text-muted-foreground">{stat.label}</dt>
                  <dd className="truncate text-neon-blue">{stat.value}</dd>
                </div>
              ))}
            </dl>
          )}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {entry.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </Link>
    </article>
  );
}

export const CharacterCard = WikiEntryCard;
export const VehicleCard = WikiEntryCard;
export const MissionCard = WikiEntryCard;
