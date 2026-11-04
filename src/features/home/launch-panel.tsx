"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Download, Gamepad2, Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LAUNCH, RUMOR_LEVELS, type RumorLevel } from "@/lib/constants";
import { cn } from "@/lib/utils";

export interface LaunchHeadline {
  slug: string;
  title: string;
  category: string;
  rumorLevel?: RumorLevel;
}

type Phase = "pre" | "preload" | "released";

const DAY = 86_400_000;

/** Midnight in the viewer's own time zone — matches Rockstar's "midnight local" rollout. */
function localMidnight({ year, month, day }: { year: number; month: number; day: number }) {
  return new Date(year, month - 1, day).getTime();
}

function formatDate({ month, day }: { month: number; day: number }) {
  return new Date(2000, month - 1, day).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function splitDuration(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(s / 86_400),
    hours: Math.floor((s % 86_400) / 3_600),
    minutes: Math.floor((s % 3_600) / 60),
    seconds: s % 60,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

export function LaunchPanel({ headline }: { headline?: LaunchHeadline | null }) {
  // null until mounted: the countdown depends on the viewer's clock and time zone,
  // so the server renders a stable placeholder and the client fills it in.
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const releaseAt = localMidnight(LAUNCH.release);
  const preloadAt = localMidnight(LAUNCH.preload);
  const phase: Phase | null =
    now === null ? null : now >= releaseAt ? "released" : now >= preloadAt ? "preload" : "pre";
  const remaining = splitDuration(now === null ? 0 : releaseAt - now);
  const preloadDays = now === null ? 0 : Math.ceil((preloadAt - now) / DAY);

  const releaseDate = formatDate(LAUNCH.release);
  const preloadDate = formatDate(LAUNCH.preload);

  return (
    <aside
      aria-labelledby="launch-panel-title"
      className="glass-strong relative w-full max-w-md overflow-hidden rounded-xl p-6 sm:p-7"
    >
      {/* neon top edge */}
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue"
        aria-hidden="true"
      />

      <div className="flex items-center justify-between gap-3">
        <p id="launch-panel-title" className="evidence-tag flex items-center gap-2">
          <Timer className="h-3.5 w-3.5" aria-hidden="true" />
          {phase === "released" ? `${LAUNCH.game} // Status` : `${LAUNCH.game} // Launch countdown`}
        </p>
        {phase === "released" && <Badge variant="green" className="shrink-0 whitespace-nowrap">Out now</Badge>}
        {phase === "preload" && <Badge variant="green" className="shrink-0 whitespace-nowrap">Pre-load live</Badge>}
        {phase === "pre" && <Badge variant="blue" className="shrink-0 whitespace-nowrap">{releaseDate}</Badge>}
      </div>

      {phase === "released" ? (
        <div className="mt-5">
          <p className="font-display text-4xl font-black uppercase leading-none tracking-tight sm:text-5xl">
            <span className="gradient-text">Out now</span>
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Unlocked at midnight local time on {releaseDate}. Start with our guides and wiki files.
          </p>
        </div>
      ) : (
        <>
          <div
            role="timer"
            aria-live="off"
            className="mt-5 grid grid-cols-4 gap-2 text-center"
          >
            {(
              [
                ["Days", remaining.days],
                ["Hrs", remaining.hours],
                ["Min", remaining.minutes],
                ["Sec", remaining.seconds],
              ] as const
            ).map(([label, value]) => (
              <div key={label} className="rounded-lg border border-white/10 bg-black/30 px-1 py-3">
                <span
                  className={cn(
                    "block font-display text-3xl font-black tabular-nums sm:text-4xl",
                    label === "Days" ? "text-neon-pink-glow" : "text-foreground",
                  )}
                >
                  {now === null ? "--" : pad(value)}
                </span>
                <span className="mt-1 block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  {label}
                </span>
              </div>
            ))}
          </div>
          <p className="sr-only">
            {LAUNCH.game} unlocks at midnight local time on {releaseDate}.
          </p>

          <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
            <Download className="mt-0.5 h-4 w-4 shrink-0 text-neon-blue" aria-hidden="true" />
            {phase === "preload" ? (
              <span>
                <span className="text-neon-green">Pre-load is live</span> on PS5 and Xbox. Unlocks at midnight
                local time, {releaseDate}.
              </span>
            ) : (
              <span>
                Pre-load opens <span className="text-foreground">{preloadDate}</span>
                {phase === "pre" && preloadDays > 0 && (
                  <span className="text-neon-blue">
                    {" "}
                    (in {preloadDays} {preloadDays === 1 ? "day" : "days"})
                  </span>
                )}
                . Unlocks at midnight local time, {releaseDate}.
              </span>
            )}
          </p>
        </>
      )}

      {headline && (
        <Link
          href={`/news/${headline.slug}`}
          className="group mt-5 block rounded-lg border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-neon-blue/40"
        >
          <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <Gamepad2 className="h-3.5 w-3.5 text-neon-purple" aria-hidden="true" />
            Latest intel
            {headline.rumorLevel && (
              <span style={{ color: RUMOR_LEVELS[headline.rumorLevel].color }}>
                · {RUMOR_LEVELS[headline.rumorLevel].label}
              </span>
            )}
          </span>
          <span className="mt-2 line-clamp-2 block font-semibold leading-snug transition-colors group-hover:text-neon-blue">
            {headline.title}
          </span>
        </Link>
      )}

      <Link
        href={phase === "released" ? "/news?category=guides" : `/news/${LAUNCH.guideSlug}`}
        className="mt-5 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neon-blue transition-colors hover:text-neon-pink"
      >
        {phase === "released" ? "Browse guides" : "Full launch checklist"}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </aside>
  );
}
