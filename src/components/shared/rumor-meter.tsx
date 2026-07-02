import { RUMOR_LEVELS, type RumorLevel } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Rumor Meter — credibility rating displayed on news articles.
 * Confirmed → Likely → Rumor → Debunked
 */
export function RumorMeter({ level, compact = false }: { level: RumorLevel; compact?: boolean }) {
  const config = RUMOR_LEVELS[level];

  if (compact) {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest"
        style={{ borderColor: `${config.color}66`, color: config.color, backgroundColor: `${config.color}14` }}
      >
        <span className="h-1.5 w-1.5 animate-pulse-neon rounded-full" style={{ backgroundColor: config.color }} />
        {config.label}
      </span>
    );
  }

  return (
    <div className="glass rounded-lg p-4" role="meter" aria-valuenow={config.value} aria-valuemin={0} aria-valuemax={100} aria-label={`Rumor meter: ${config.label}`}>
      <div className="mb-2 flex items-center justify-between">
        <span className="evidence-tag">Rumor Meter</span>
        <span className="font-mono text-sm font-bold uppercase tracking-widest" style={{ color: config.color }}>
          {config.label}
        </span>
      </div>
      <div className="flex h-2 gap-1 overflow-hidden rounded-full">
        {(["debunked", "rumor", "likely", "confirmed"] as const).map((step) => (
          <div
            key={step}
            className={cn("flex-1 rounded-full transition-colors", RUMOR_LEVELS[step].value <= config.value ? "" : "!bg-vice-line")}
            style={{ backgroundColor: RUMOR_LEVELS[step].value <= config.value ? config.color : undefined }}
          />
        ))}
      </div>
      <div className="mt-1.5 flex justify-between font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
        <span>Debunked</span>
        <span>Rumor</span>
        <span>Likely</span>
        <span>Confirmed</span>
      </div>
    </div>
  );
}
