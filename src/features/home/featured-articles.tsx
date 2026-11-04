import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ArticleCard } from "@/components/shared/article-card";
import { SectionHeading, sectionEyebrow } from "@/components/shared/section-heading";
import { StaggerContainer, StaggerItem } from "@/components/shared/motion";
import type { Article } from "@/types";

export function FeaturedArticles({ articles, index }: { articles: Article[]; index: number }) {
  return (
    <section className="container py-20" aria-labelledby="featured-articles">
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

      <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <StaggerItem key={article.id} className="h-full">
            <ArticleCard article={article} />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
