import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading, sectionEyebrow } from "@/components/shared/section-heading";
import { MobileMoreLink } from "@/components/shared/mobile-more-link";
import { RumorMeter } from "@/components/shared/rumor-meter";
import { FadeIn } from "@/components/shared/motion";
import { RUMOR_LEVELS, type RumorLevel } from "@/lib/constants";
import type { Article } from "@/types";

const LEVEL_ORDER = Object.keys(RUMOR_LEVELS) as RumorLevel[]; // confirmed → debunked

/** Minimum rated stories before the board is worth showing. */
export const INTEL_BOARD_MIN_RATED = 3;

export function rateableArticles(articles: Article[]) {
  return articles.filter((a): a is Article & { rumorLevel: RumorLevel } => Boolean(a.rumorLevel));
}

const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

interface IntelBoardProps {
  /** Recent articles; only rated ones are counted. */
  articles: Article[];
  /** Slugs already shown in Featured Articles, left out of the list (still counted). */
  excludeSlugs: string[];
  index: number;
}

/**
 * "What do we actually know?" — a tally of every rated story by Rumor Meter level,
 * plus the rated stories that aren't already featured above.
 */
export function IntelBoard({ articles, excludeSlugs, index }: IntelBoardProps) {
  const rated = rateableArticles(articles);
  const counts = LEVEL_ORDER.map((level) => ({
    level,
    count: rated.filter((a) => a.rumorLevel === level).length,
  }));
  const rows = rated.filter((a) => !excludeSlugs.includes(a.slug)).slice(0, 5);

  return (
    <section className="container py-14 sm:py-20" aria-labelledby="intel-board">
      <div className="flex items-end justify-between gap-4">
        <SectionHeading
          id="intel-board"
          eyebrow={sectionEyebrow(index, "Verification Desk")}
          title="Intel Board"
          description="Every story we publish is rated on the Rumor Meter. Here's where the evidence stands."
        />
        <Link
          href="/news"
          className="mb-10 hidden shrink-0 items-center gap-2 font-mono text-xs uppercase tracking-widest text-neon-blue transition-colors hover:text-neon-pink sm:flex"
        >
          All intel <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <FadeIn>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          {/* Tally */}
          <div className="glass rounded-lg p-5 sm:p-6">
            <p className="evidence-tag">Rumor Meter // {rated.length} stories rated</p>

            <div
              className="mt-5 flex h-3 overflow-hidden rounded-full bg-white/5"
              role="img"
              aria-label={counts.map((c) => `${c.count} ${RUMOR_LEVELS[c.level].label}`).join(", ")}
            >
              {counts
                .filter((c) => c.count > 0)
                .map((c) => (
                  <div
                    key={c.level}
                    className="h-full first:rounded-l-full last:rounded-r-full"
                    style={{
                      width: `${(c.count / rated.length) * 100}%`,
                      backgroundColor: RUMOR_LEVELS[c.level].color,
                      boxShadow: `0 0 12px ${RUMOR_LEVELS[c.level].color}88`,
                    }}
                  />
                ))}
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 sm:mt-6 sm:gap-y-5">
              {counts.map(({ level, count }) => (
                <div key={level} className={count === 0 ? "opacity-40" : undefined}>
                  <dt className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: RUMOR_LEVELS[level].color }}
                      aria-hidden="true"
                    />
                    {RUMOR_LEVELS[level].label}
                  </dt>
                  <dd className="mt-1 font-display text-3xl font-black tabular-nums" style={{ color: RUMOR_LEVELS[level].color }}>
                    {count}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Ledger of rated stories not already featured */}
          <div className="glass rounded-lg">
            <p className="evidence-tag border-b border-white/10 px-5 py-4 sm:px-6">More rated intel</p>
            {rows.length ? (
              <ul className="divide-y divide-white/5">
                {rows.map((article) => (
                  <li key={article.id}>
                    <Link
                      href={`/news/${article.slug}`}
                      className="group flex flex-col gap-2 px-5 py-4 transition-colors hover:bg-white/[0.03] sm:flex-row sm:items-start sm:gap-4 sm:px-6"
                    >
                      <span className="shrink-0 pt-0.5 sm:w-24">
                        <RumorMeter level={article.rumorLevel} compact />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="line-clamp-2 font-semibold leading-snug transition-colors group-hover:text-neon-blue">
                          {article.title}
                        </span>
                        <span className="mt-1 block font-mono text-xs text-muted-foreground">
                          {article.category} · <time dateTime={article.publishedAt}>{shortDate(article.publishedAt)}</time>
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-6 py-8 text-sm text-muted-foreground">
                Every rated story is already in Featured Articles above.
              </p>
            )}
          </div>
        </div>
      </FadeIn>
      <MobileMoreLink href="/news">All intel</MobileMoreLink>
    </section>
  );
}
