import Link from "next/link";
import {
  Building2,
  Car,
  Crosshair,
  Egg,
  MapPin,
  Shield,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  users: Users,
  car: Car,
  "map-pin": MapPin,
  crosshair: Crosshair,
  target: Target,
  building: Building2,
  shield: Shield,
  egg: Egg,
};

const ACCENTS = {
  pink: "group-hover:border-neon-pink/60 group-hover:shadow-neon-pink text-neon-pink",
  blue: "group-hover:border-neon-blue/60 group-hover:shadow-neon-blue text-neon-blue",
  purple: "group-hover:border-neon-purple/60 group-hover:shadow-neon-purple text-neon-purple",
  orange: "group-hover:border-neon-orange/60 group-hover:shadow-neon-pink text-neon-orange",
} as const;

interface WikiCardProps {
  slug: string;
  label: string;
  description: string;
  icon: string;
  accent: keyof typeof ACCENTS;
  count?: number;
  /** Phone layout: 2-up icon tiles without the description. Desktop is unchanged. */
  compact?: boolean;
}

export function WikiCard({ slug, label, description, icon, accent, count, compact = false }: WikiCardProps) {
  const Icon = ICONS[icon] ?? Users;
  const accentClasses = ACCENTS[accent];

  return (
    <Link href={`/wiki/${slug}`} className="group block h-full" aria-label={`Browse ${label} wiki`}>
      <div
        className={cn(
          "glass relative h-full rounded-lg p-6 transition-all duration-300 group-hover:-translate-y-1.5",
          compact && "p-4 sm:p-6",
          accentClasses,
        )}
      >
        <div className={cn("mb-4 flex items-center justify-between", compact && "mb-3 sm:mb-4")}>
          <Icon
            className={cn(
              "h-8 w-8 transition-transform duration-300 group-hover:scale-110",
              compact && "h-6 w-6 sm:h-8 sm:w-8",
            )}
            aria-hidden="true"
          />
          {typeof count === "number" && (
            <span className="font-mono text-xs text-muted-foreground">{count} files</span>
          )}
        </div>
        <h3
          className={cn(
            "font-display text-lg font-bold uppercase tracking-wide text-foreground",
            compact && "text-sm sm:text-lg",
          )}
        >
          {label}
        </h3>
        <p className={cn("mt-2 text-sm leading-relaxed text-muted-foreground", compact && "hidden sm:block")}>
          {description}
        </p>
        <span
          className={cn(
            "evidence-tag mt-4 inline-block opacity-0 transition-opacity duration-300 group-hover:opacity-100",
            compact && "hidden sm:inline-block",
          )}
        >
          Open File →
        </span>
      </div>
    </Link>
  );
}
