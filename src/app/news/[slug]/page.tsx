import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, Facebook, Link2, Twitter, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArticleCard } from "@/components/shared/article-card";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { MediaImage } from "@/components/shared/media-image";
import { RumorMeter } from "@/components/shared/rumor-meter";
import { articleJsonLd, buildMetadata, JsonLd } from "@/lib/seo";
import { absoluteUrl, formatDate } from "@/lib/utils";
import { getAllArticleSlugs, getArticleBySlug, getArticles } from "@/services/wordpress";

export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return buildMetadata({ noIndex: true });
  return buildMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/news/${article.slug}`,
    type: "article",
    publishedTime: article.publishedAt,
    authors: [article.author.name],
    ogImage: article.featuredImage.url || undefined,
  });
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const allArticles = await getArticles({ limit: 12 });
  const related = allArticles
    .filter((a) => a.id !== article.id && (a.category === article.category || a.tags.some((t) => article.tags.includes(t))))
    .slice(0, 3);

  const shareUrl = absoluteUrl(`/news/${article.slug}`);
  const shareText = encodeURIComponent(article.title);

  return (
    <div className="container pt-28">
      <JsonLd
        data={articleJsonLd({
          title: article.title,
          excerpt: article.excerpt,
          slug: article.slug,
          publishedAt: article.publishedAt,
          updatedAt: article.updatedAt,
          authorName: article.author.name,
          image: article.featuredImage.url || undefined,
        })}
      />
      <Breadcrumbs items={[{ label: "News", href: "/news" }, { label: article.title }]} />

      <article className="mx-auto max-w-3xl">
        <header>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="blue">{article.category}</Badge>
            {article.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="mt-4 font-display text-3xl font-black leading-tight tracking-tight sm:text-5xl">
            {article.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{article.excerpt}</p>

          <div className="mt-6 flex flex-wrap items-center gap-5 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-neon-pink" aria-hidden="true" />
              {article.author.name}
            </span>
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-neon-blue" aria-hidden="true" />
              {article.readTime} min read
            </span>
          </div>
        </header>

        <MediaImage
          image={article.featuredImage}
          className="mt-8 aspect-video w-full rounded-lg"
          sizes="(max-width: 768px) 100vw, 768px"
          priority
        />

        {article.rumorLevel && (
          <div className="mt-8">
            <RumorMeter level={article.rumorLevel} />
          </div>
        )}

        <div className="prose-invert mt-8 space-y-6 leading-relaxed text-foreground/90">
          {article.content.split("\n\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {/* Share */}
        <Separator className="my-10" />
        <div className="flex flex-wrap items-center gap-3">
          <span className="evidence-tag">Share Intel</span>
          <a
            href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="glass rounded-md p-2.5 transition-colors hover:text-neon-blue"
            aria-label="Share on X / Twitter"
          >
            <Twitter className="h-4 w-4" />
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="glass rounded-md p-2.5 transition-colors hover:text-neon-blue"
            aria-label="Share on Facebook"
          >
            <Facebook className="h-4 w-4" />
          </a>
          <Link
            href={shareUrl}
            className="glass rounded-md p-2.5 transition-colors hover:text-neon-pink"
            aria-label="Permalink"
          >
            <Link2 className="h-4 w-4" />
          </Link>
        </div>

        {/* Author box */}
        <div className="glass mt-10 flex items-center gap-4 rounded-lg p-6">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-vice-sunset font-display font-bold text-white">
            {article.author.name.charAt(0)}
          </span>
          <div>
            <p className="font-display font-bold">{article.author.name}</p>
            {article.author.bio && <p className="text-sm text-muted-foreground">{article.author.bio}</p>}
          </div>
        </div>
      </article>

      {/* Related articles */}
      {related.length > 0 && (
        <section className="mx-auto mt-16 max-w-5xl" aria-labelledby="related-articles">
          <h2 id="related-articles" className="mb-6 font-display text-2xl font-bold uppercase tracking-wide">
            <span className="gradient-text">Related Reports</span>
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {related.map((relatedArticle) => (
              <ArticleCard key={relatedArticle.id} article={relatedArticle} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
