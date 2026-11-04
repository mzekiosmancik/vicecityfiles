"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaImage } from "@/components/shared/media-image";
import { LEONIDA_OUTLINE, type MapRegionData } from "@/lib/map";
import { cn } from "@/lib/utils";
import type { ImageAsset } from "@/types";

interface ViceMapProps {
  regions: MapRegionData[];
  /** Uploaded map art (WordPress media slug `city-grid-map`); replaces the illustration. */
  mapImage?: ImageAsset | null;
  compact?: boolean;
}

/**
 * The City Grid: Leonida regions from the wiki. Click a region (on the map, its pin,
 * or the list) to see every location file inside it under the region name.
 */
export function ViceMap({ regions, mapImage, compact = false }: ViceMapProps) {
  const [activeId, setActiveId] = useState(regions[0]?.id);
  const active = regions.find((r) => r.id === activeId) ?? regions[0];

  if (!active) {
    return (
      <div className="glass rounded-lg p-8 text-center text-sm text-muted-foreground">
        Map data is loading from the archive. Check back shortly.
      </div>
    );
  }

  const color = active.shape?.color ?? "#00e5ff";
  const aspect = mapImage?.width && mapImage?.height ? mapImage.width / mapImage.height : 1;

  return (
    <div className={cn("grid gap-6", compact ? "lg:grid-cols-[1.25fr_1fr]" : "lg:grid-cols-[1.5fr_1fr]")}>
      {/* ── Map ─────────────────────────────────────── */}
      <div>
        <div
          className="glass relative w-full overflow-hidden rounded-lg bg-[#07131a]"
          style={{ aspectRatio: String(aspect) }}
        >
          {mapImage ? (
            <Image
              src={mapImage.url}
              alt={mapImage.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          ) : (
            <IllustratedLeonida regions={regions} activeId={active.id} onSelect={setActiveId} />
          )}

          {/* Pins: the accessible controls on the map */}
          {regions.map((region) => {
            if (!region.shape) return null;
            const isActive = region.id === active.id;
            return (
              <button
                key={region.id}
                type="button"
                onClick={() => setActiveId(region.id)}
                aria-pressed={isActive}
                aria-label={`Show locations in ${region.name}`}
                className="group absolute z-10 -translate-x-1/2 -translate-y-full"
                style={{ left: `${region.shape.pin.x}%`, top: `${region.shape.pin.y}%` }}
              >
                <span
                  className={cn(
                    "mb-1 block whitespace-nowrap rounded border bg-vice-black/85 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest backdrop-blur transition-opacity sm:text-[10px]",
                    isActive ? "opacity-100" : "hidden opacity-70 group-hover:opacity-100 sm:block",
                  )}
                  style={{ color: region.shape.color, borderColor: `${region.shape.color}66` }}
                >
                  {region.name}
                </span>
                <MapPin
                  className={cn("mx-auto h-5 w-5 transition-transform group-hover:scale-110", isActive && "scale-125")}
                  style={{
                    color: region.shape.color,
                    fill: isActive ? `${region.shape.color}55` : "#07060b",
                    filter: `drop-shadow(0 0 ${isActive ? 8 : 4}px ${region.shape.color})`,
                  }}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>
        <p className="evidence-tag mt-2 text-muted-foreground">Fan-made map // Not official</p>

        {/* Region list: same selection, easy to tap on phones */}
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {regions.map((region) => {
            const isActive = region.id === active.id;
            const c = region.shape?.color ?? "#00e5ff";
            return (
              <button
                key={region.id}
                type="button"
                onClick={() => setActiveId(region.id)}
                aria-pressed={isActive}
                className={cn(
                  "glass flex items-center justify-between gap-2 rounded-md px-3 py-2 text-left font-mono text-[10px] uppercase tracking-wider transition-all",
                  isActive ? "border-white/30" : "text-muted-foreground hover:text-foreground",
                )}
                style={isActive ? { color: c, boxShadow: `0 0 12px ${c}44` } : undefined}
              >
                <span className="truncate">{region.name}</span>
                <span className="shrink-0 tabular-nums opacity-70">{region.places.length}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Region file ─────────────────────────────── */}
      <motion.div
        key={active.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="glass flex flex-col overflow-hidden rounded-lg"
        aria-live="polite"
      >
        <div className="relative">
          <MediaImage image={active.image} className="aspect-[16/7] w-full" sizes="(max-width: 1024px) 100vw, 40vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-vice-panel via-vice-panel/30 to-transparent" />
        </div>

        <div className="-mt-10 relative flex flex-1 flex-col p-6 pt-0">
          {active.type && <p className="evidence-tag mb-1">{active.type}</p>}
          <h3 className="flex items-center gap-2 font-display text-2xl font-bold uppercase tracking-wide">
            <MapPin className="h-5 w-5 shrink-0" style={{ color }} aria-hidden="true" />
            {active.name}
          </h3>
          {active.tagline && (
            <p className="mt-1 font-mono text-xs uppercase tracking-widest" style={{ color }}>
              “{active.tagline}”
            </p>
          )}
          {active.summary && (
            <p className={cn("mt-3 text-sm leading-relaxed text-muted-foreground", compact && "line-clamp-3")}>
              {active.summary}
            </p>
          )}

          {/* Locations under the region name */}
          <div className="mt-5 border-t border-white/10 pt-4">
            <p className="evidence-tag mb-3">
              Locations in {active.name} ({active.places.length})
            </p>
            {active.places.length ? (
              <ul className={cn("space-y-1.5", compact && "max-h-64 overflow-y-auto pr-1")}>
                {active.places.map((place) => (
                  <li key={place.id}>
                    <Link
                      href={`/wiki/${place.category}/${place.slug}`}
                      className="group flex items-center gap-3 rounded-md p-1.5 transition-colors hover:bg-white/[0.04]"
                    >
                      <MediaImage image={place.image} className="h-10 w-10 shrink-0 rounded" sizes="40px" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold transition-colors group-hover:text-neon-blue">
                          {place.title}
                        </span>
                        <span className="block truncate font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                          {place.categoryLabel}
                          {place.area && ` · ${place.area}`}
                        </span>
                      </span>
                      <ArrowRight
                        className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No location files filed here yet.</p>
            )}
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
            <Link
              href={`/wiki/locations/${active.slug}`}
              className="evidence-tag inline-flex items-center gap-1 transition-colors hover:text-neon-pink"
            >
              Open region file <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            {compact && (
              <Button asChild variant="outline-blue" size="sm" className="ml-auto">
                <Link href="/map">Full map</Link>
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/** Original neon illustration of Leonida (0–100 space). Decorative; pins carry semantics. */
function IllustratedLeonida({
  regions,
  activeId,
  onSelect,
}: {
  regions: MapRegionData[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <>
      {/* water: radar grid + depth glow */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 70% 60%, rgba(0,229,255,0.10), transparent 60%), linear-gradient(rgba(0,229,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.07) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 5% 5%, 5% 5%",
        }}
        aria-hidden="true"
      />
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
        {/* landmass */}
        <path
          d={LEONIDA_OUTLINE}
          fill="#14111d"
          stroke="rgba(0,229,255,0.55)"
          strokeWidth={0.35}
          style={{ filter: "drop-shadow(0 0 2px rgba(0,229,255,0.5))" }}
        />
        {/* regions */}
        {regions.map((region) => {
          if (!region.shape) return null;
          const isActive = region.id === activeId;
          return (
            <path
              key={region.id}
              d={region.shape.path}
              fill={`${region.shape.color}${isActive ? "55" : "1f"}`}
              stroke={region.shape.color}
              strokeWidth={isActive ? 0.6 : 0.25}
              strokeLinejoin="round"
              className="cursor-pointer transition-all duration-300 hover:brightness-150"
              style={isActive ? { filter: `drop-shadow(0 0 1.5px ${region.shape.color})` } : undefined}
              onClick={() => onSelect(region.id)}
            />
          );
        })}
        {/* Lake Leonida */}
        <ellipse cx={63.5} cy={46.5} rx={3.2} ry={2.6} fill="#07131a" stroke="rgba(0,229,255,0.5)" strokeWidth={0.25} />
        {/* compass */}
        <g transform="translate(90 12)" fill="none" stroke="rgba(0,229,255,0.6)" strokeWidth={0.3}>
          <circle r={4} />
          <path d="M0 -5 L1.2 0 L0 5 L-1.2 0 Z" fill="rgba(0,229,255,0.25)" />
        </g>
        <text x={90} y={5} textAnchor="middle" fontSize={2.4} fill="rgba(0,229,255,0.8)" fontFamily="monospace">
          N
        </text>
        <text x={6} y={60} fontSize={2.6} letterSpacing={0.8} fill="rgba(0,229,255,0.35)" fontFamily="monospace">
          GULF
        </text>
        <text x={86} y={44} fontSize={2.6} letterSpacing={0.8} fill="rgba(0,229,255,0.35)" fontFamily="monospace" textAnchor="middle">
          OCEAN
        </text>
        <text x={8} y={7} fontSize={3.4} letterSpacing={1.4} fill="rgba(255,255,255,0.55)" fontFamily="monospace">
          STATE OF LEONIDA
        </text>
      </svg>
    </>
  );
}
