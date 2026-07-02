import Link from "next/link";
import { Radio } from "lucide-react";
import type { Article } from "@/types";

export function NewsTicker({ articles }: { articles: Article[] }) {
  const headlines = articles.slice(0, 6);
  if (!headlines.length) return null;

  // Duplicate for seamless loop
  const loop = [...headlines, ...headlines];

  return (
    <div className="pause-on-hover relative overflow-hidden border-y border-neon-blue/20 bg-vice-dark/80 py-2.5">
      <div className="absolute inset-y-0 left-0 z-10 flex items-center gap-2 border-r border-neon-blue/30 bg-vice-black px-4">
        <Radio className="h-4 w-4 animate-pulse-neon text-neon-blue" aria-hidden="true" />
        <span className="evidence-tag hidden sm:inline">Scanner Feed // Live</span>
      </div>
      <div className="animate-ticker flex w-max items-center gap-12 pl-48 font-mono text-sm">
        {loop.map((article, i) => (
          <Link
            key={`${article.id}-${i}`}
            href={`/news/${article.slug}`}
            className="flex items-center gap-3 whitespace-nowrap text-muted-foreground transition-colors hover:text-neon-blue"
          >
            <span className="text-neon-pink">▸</span>
            <span className="uppercase tracking-wide text-neon-blue/70">[{article.category}]</span>
            {article.title}
          </Link>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}
