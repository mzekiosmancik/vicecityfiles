import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MobileMoreLink } from "@/components/shared/mobile-more-link";
import { ArticleCard } from "@/components/shared/article-card";
import { SectionHeading, sectionEyebrow } from "@/components/shared/section-heading";
import { StaggerContainer, StaggerItem } from "@/components/shared/motion";
import type { Article } from "@/types";

export function FeaturedArticles({ articles, index }: { articles: Article[]; index: number }) {
  return (
    <section className="container py-14 sm:py-20" aria-labelledby="featured-articles">
      <div className="flex items-end justify-between gap-4">
        <SectionHeading id="featured-articles"
          eyebrow={sectionEyebrow(index, "Intel Reports")}
          title="Featured Articles"
          description="Deep-dive investigations, frame analysis, and rated rumors from the field team."
        />
        <Link
          href="/news"
          className="mb-10 hidden shrink-0 items-center gap-2 font-mono text-xs uppercase tracking-widest text-neon-blue transition-colors hover:text-neon-pink sm:flex"
        >
          Newsroom <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      {/* Phones: swipeable row bleeding to the screen edge, next card peeking. md+: grid. */}
      <StaggerContainer className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3">
        {articles.map((article) => (
          <StaggerItem key={article.id} className="h-full w-[85%] shrink-0 snap-start md:w-auto">
            <ArticleCard article={article} />
          </StaggerItem>
        ))}
      </StaggerContainer>
      <MobileMoreLink href="/news">Newsroom</MobileMoreLink>
    </section>
  );
}
