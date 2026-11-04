import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading, sectionEyebrow } from "@/components/shared/section-heading";
import { MobileMoreLink } from "@/components/shared/mobile-more-link";
import { WikiCard } from "@/components/shared/wiki-card";
import { StaggerContainer, StaggerItem } from "@/components/shared/motion";
import { MediaImage } from "@/components/shared/media-image";
import { WIKI_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { WikiEntry } from "@/types";

const CATEGORY_LABEL = Object.fromEntries(WIKI_CATEGORIES.map((c) => [c.slug, c.label])) as Record<string, string>;

const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export function WikiCategoriesSection({ index, recent = [] }: { index: number; recent?: WikiEntry[] }) {
  return (
    <section className="container py-14 sm:py-20" aria-labelledby="wiki-categories">
      <div className="flex items-end justify-between gap-4">
        <SectionHeading id="wiki-categories"
          eyebrow={sectionEyebrow(index, "The Archive")}
          title="Wiki Categories"
          description="Every file in the investigation, organized by department. Open a folder to dig in."
        />
        <Link
          href="/wiki"
          className="mb-10 hidden shrink-0 items-center gap-2 font-mono text-xs uppercase tracking-widest text-neon-blue transition-colors hover:text-neon-pink sm:flex"
        >
          All Files <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <StaggerContainer className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {WIKI_CATEGORIES.map((category) => (
          <StaggerItem key={category.slug} className="h-full">
            <WikiCard {...category} compact />
          </StaggerItem>
        ))}
      </StaggerContainer>

      {recent.length > 0 && (
        <div className="mt-10">
          <h3 className="evidence-tag mb-4">Latest file updates</h3>
          {/* Phones: swipe row with all of them. sm: 3×2 grid. lg: one row of 5 (no hidden overflow for mice). */}
          <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-5">
            {recent.map((entry, i) => (
              <li
                key={entry.id}
                className={cn("w-60 shrink-0 snap-start sm:w-auto", i >= 6 && "sm:hidden", i === 5 && "lg:hidden")}
              >
                <Link
                  href={`/wiki/${entry.category}/${entry.slug}`}
                  className="glass neon-border-hover group flex h-full items-center gap-3 rounded-lg p-2.5"
                >
                  <MediaImage
                    image={entry.heroImage}
                    className="h-14 w-14 shrink-0 rounded-md"
                    sizes="56px"
                  />
                  <span className="min-w-0">
                    <span className="block font-mono text-[10px] uppercase tracking-widest text-neon-blue">
                      {CATEGORY_LABEL[entry.category] ?? entry.category}
                    </span>
                    <span className="block truncate text-sm font-semibold transition-colors group-hover:text-neon-pink">
                      {entry.title}
                    </span>
                    <span className="block font-mono text-[10px] text-muted-foreground">
                      Updated <time dateTime={entry.updatedAt}>{shortDate(entry.updatedAt)}</time>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <MobileMoreLink href="/wiki">All files</MobileMoreLink>
    </section>
  );
}
