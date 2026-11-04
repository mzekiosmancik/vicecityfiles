import {
  BookOpen,
  Clapperboard,
  FileText,
  Microscope,
  Newspaper,
  Radar,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";
import { RUMOR_LEVELS, type RumorLevel } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** Accent colour + icon per news category, so imageless stories still read at a glance. */
const CATEGORY_STYLES: Record<string, { color: string; icon: LucideIcon }> = {
  news: { color: "#00e5ff", icon: Newspaper },
  rumors: { color: "#ffe14d", icon: Radar },
  updates: { color: "#39ff88", icon: RefreshCw },
  trailers: { color: "#ff2d95", icon: Clapperboard },
  features: { color: "#a855f7", icon: FileText },
  guides: { color: "#39ff88", icon: BookOpen },
  analysis: { color: "#ff8a3d", icon: Microscope },
};

const FALLBACK = { color: "#a855f7", icon: FileText };

interface ArticleCoverProps {
  category: string;
  rumorLevel?: RumorLevel;
  /** Used to derive a stable "file number" so covers don't all look identical. */
  seed: string;
  className?: string;
}

function fileNumber(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return String(h % 10_000).padStart(4, "0");
}

/**
 * Typographic "case file" cover for articles without a featured image.
 * Decorative only — the card's title carries the meaning.
 */
export function ArticleCover({ category, rumorLevel, seed, className }: ArticleCoverProps) {
  const { color, icon: Icon } = CATEGORY_STYLES[category.toLowerCase()] ?? FALLBACK;
  const stamp = rumorLevel ? RUMOR_LEVELS[rumorLevel] : null;

  return (
    <div
      aria-hidden="true"
      className={cn("relative overflow-hidden bg-vice-black", className)}
      style={{
        backgroundImage: `radial-gradient(circle at 75% 30%, ${color}33, transparent 55%),
          linear-gradient(${color}14 1px, transparent 1px),
          linear-gradient(90deg, ${color}14 1px, transparent 1px)`,
        backgroundSize: "100% 100%, 24px 24px, 24px 24px",
      }}
    >
      {/* file tab */}
      <div className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color }}>
        Case File #{fileNumber(seed)} // {category}
      </div>

      {/* category glyph */}
      <Icon
        className="absolute -right-4 bottom-[-18%] h-[85%] w-auto opacity-25"
        style={{ color, filter: `drop-shadow(0 0 18px ${color})` }}
        strokeWidth={1.25}
      />

      {/* rubber stamp */}
      {stamp && (
        <div
          className="absolute bottom-5 left-4 -rotate-6 rounded border-2 px-2.5 py-1 font-display text-sm font-black uppercase tracking-[0.2em]"
          style={{ color: stamp.color, borderColor: stamp.color, boxShadow: `0 0 12px ${stamp.color}55` }}
        >
          {stamp.label}
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-vice-black/60 via-transparent to-transparent" />
    </div>
  );
}
