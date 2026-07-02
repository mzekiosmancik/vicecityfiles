import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArticleCard } from "@/components/shared/article-card";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Pagination } from "@/components/shared/pagination";
import { SectionHeading } from "@/components/shared/section-heading";
import { buildMetadata } from "@/lib/seo";
import { NEWS_CATEGORIES } from "@/lib/constants";
import { getArticles } from "@/services/wordpress";
import { cn } from "@/lib/utils";

export const revalidate = 300;

const PER_PAGE = 9;

interface PageProps {
  searchParams: Promise<{ category?: string; page?: string }>;
}

export const metadata = buildMetadata({
  title: "News & Intel Reports",
  description:
    "Breaking GTA 6 news, rated rumors, trailer analysis, guides, and features — every story runs through the Rumor Meter.",
  path: "/news",
});

export default async function NewsPage({ searchParams }: PageProps) {
  const { category, page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page ?? "1", 10) || 1);

  const allArticles = await getArticles({ category, limit: 100 });
  const totalPages = Math.max(1, Math.ceil(allArticles.length / PER_PAGE));
  const articles = allArticles.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  return (
    <div className="container pt-28">
      <Breadcrumbs items={[{ label: "News" }]} />
      <SectionHeading
        eyebrow="The Newsroom // Intel Division"
        title="News & Reports"
        description="Every story is sourced, dated, and rated on the Rumor Meter. No clickbait — just the case files."
      />

      {/* Category filter */}
      <nav className="mb-10 flex flex-wrap gap-2" aria-label="News categories">
        <Link href="/news">
          <Badge variant={!category ? "default" : "outline"} className="cursor-pointer px-4 py-1.5">
            All
          </Badge>
        </Link>
        {NEWS_CATEGORIES.map((cat) => (
          <Link key={cat} href={`/news?category=${cat.toLowerCase()}`}>
            <Badge
              variant={category?.toLowerCase() === cat.toLowerCase() ? "default" : "outline"}
              className={cn("cursor-pointer px-4 py-1.5 transition-colors", "hover:border-neon-pink/40 hover:text-neon-pink")}
            >
              {cat}
            </Badge>
          </Link>
        ))}
      </nav>

      {articles.length === 0 ? (
        <p className="glass rounded-lg p-10 text-center font-mono text-sm text-muted-foreground">
          No reports filed under this category yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, i) => (
            <ArticleCard key={article.id} article={article} priority={i < 3} />
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={category ? `/news?category=${category}` : "/news"}
      />
    </div>
  );
}
