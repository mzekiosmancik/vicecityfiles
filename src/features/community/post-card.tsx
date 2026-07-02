import { Bookmark, Heart, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MediaImage } from "@/components/shared/media-image";
import { formatDate } from "@/lib/utils";
import type { CommunityPost } from "@/types";

const SECTION_LABEL: Record<CommunityPost["section"], string> = {
  theories: "Theory",
  "fan-art": "Fan Art",
  discussions: "Discussion",
};

export function CommunityPostCard({ post }: { post: CommunityPost }) {
  return (
    <article className="glass neon-border-hover overflow-hidden rounded-lg">
      {post.image && (
        <MediaImage image={post.image} className="aspect-[2/1] w-full" sizes="(max-width: 768px) 100vw, 50vw" />
      )}
      <div className="p-5">
        <div className="flex items-center gap-2">
          <Badge variant="purple">{SECTION_LABEL[post.section]}</Badge>
          <span className="font-mono text-xs text-muted-foreground">{formatDate(post.createdAt)}</span>
        </div>
        <h3 className="mt-3 font-display text-lg font-bold leading-snug">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
          <span className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-vice-sunset font-display text-[10px] font-bold text-white">
              {post.author.name.charAt(0)}
            </span>
            {post.author.name}
          </span>
          <div className="flex items-center gap-4 font-mono text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5" aria-label={`${post.likes} likes`}>
              <Heart className="h-3.5 w-3.5 text-neon-pink" aria-hidden="true" />
              {post.likes.toLocaleString()}
            </span>
            <span className="flex items-center gap-1.5" aria-label={`${post.comments} comments`}>
              <MessageCircle className="h-3.5 w-3.5 text-neon-blue" aria-hidden="true" />
              {post.comments.toLocaleString()}
            </span>
            <Bookmark className="h-3.5 w-3.5 transition-colors hover:text-neon-yellow" aria-hidden="true" />
          </div>
        </div>
      </div>
    </article>
  );
}
