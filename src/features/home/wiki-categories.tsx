import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading, sectionEyebrow } from "@/components/shared/section-heading";
import { MobileMoreLink } from "@/components/shared/mobile-more-link";
import { WikiCard } from "@/components/shared/wiki-card";
import { StaggerContainer, StaggerItem } from "@/components/shared/motion";
import { WIKI_CATEGORIES } from "@/lib/constants";

export function WikiCategoriesSection({ index }: { index: number }) {
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
      <MobileMoreLink href="/wiki">All files</MobileMoreLink>
    </section>
  );
}
