import Link from "next/link";
import { Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MediaImage } from "@/components/shared/media-image";
import { RumorMeter } from "@/components/shared/rumor-meter";
import { formatDate } from "@/lib/utils";
import type { Article } from "@/types";

export function ArticleCard({ article, priority = false }: { article: Article; priority?: boolean }) {
  return (
    <article className="group h-full">
      <Link href={`/news/${article.slug}`} className="glass neon-border-hover flex h-full flex-col overflow-hidden rounded-lg">
        <MediaImage
          image={article.featuredImage}
          className="aspect-video w-full transition-transform duration-500 group-hover:scale-[1.02]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
        />
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge variant="blue">{article.category}</Badge>
            {article.rumorLevel && <RumorMeter level={article.rumorLevel} compact />}
          </div>
          <h3 className="font-display text-lg font-bold leading-snug transition-colors group-hover:text-neon-pink">
            {article.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>
          <div className="mt-auto flex items-center gap-4 pt-4 font-mono text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <User className="h-3 w-3" aria-hidden="true" />
              {article.author.name}
            </span>
            <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {article.readTime} min
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
