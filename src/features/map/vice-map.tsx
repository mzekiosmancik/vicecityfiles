"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MAP_REGIONS } from "@/lib/mock-data";

/**
 * Stylized interactive fan map with clickable regions. The full-page /map
 * route swaps in Mapbox GL when NEXT_PUBLIC_MAPBOX_TOKEN is set.
 */
export function ViceMap({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState(MAP_REGIONS[0]);

  return (
    <div className={`grid gap-6 ${compact ? "lg:grid-cols-[1.4fr_1fr]" : "lg:grid-cols-[1.6fr_1fr]"}`}>
      <div className="glass vhs-overlay relative overflow-hidden rounded-lg bg-vice-black p-4">
        {/* radar grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,229,255,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.25) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
          aria-hidden="true"
        />
        <svg viewBox="0 0 100 100" className="relative w-full" role="img" aria-label="Stylized fan map of Vice City regions">
          {/* water */}
          <rect x="0" y="0" width="100" height="100" fill="transparent" />
          {MAP_REGIONS.map((region) => (
            <motion.path
              key={region.id}
              d={region.path}
              fill={active.id === region.id ? `${region.color}55` : `${region.color}22`}
              stroke={region.color}
              strokeWidth={active.id === region.id ? 0.8 : 0.4}
              className="cursor-pointer transition-all"
              whileHover={{ scale: 1.01 }}
              onClick={() => setActive(region)}
              onMouseEnter={() => setActive(region)}
              role="button"
              aria-label={`Select ${region.name}`}
              style={{ filter: active.id === region.id ? `drop-shadow(0 0 4px ${region.color})` : undefined }}
            />
          ))}
        </svg>
        <p className="evidence-tag absolute bottom-3 left-4">Fan-Made Speculative Map // Not Official</p>
      </div>

      <div className="flex flex-col gap-4">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="glass flex-1 rounded-lg p-6"
        >
          <div className="mb-3 flex items-center gap-2">
            <MapPin className="h-5 w-5" style={{ color: active.color }} aria-hidden="true" />
            <h3 className="font-display text-xl font-bold uppercase tracking-wide">{active.name}</h3>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">{active.description}</p>
          {active.wikiSlug && (
            <Link
              href={`/wiki/locations/${active.wikiSlug}`}
              className="evidence-tag mt-4 inline-block transition-colors hover:text-neon-pink"
            >
              Open Location File →
            </Link>
          )}
        </motion.div>

        <div className="grid grid-cols-3 gap-2">
          {MAP_REGIONS.map((region) => (
            <button
              key={region.id}
              onClick={() => setActive(region)}
              className={`glass rounded-md px-2 py-2 font-mono text-[10px] uppercase tracking-wider transition-all ${
                active.id === region.id ? "border-white/30" : "text-muted-foreground hover:text-foreground"
              }`}
              style={active.id === region.id ? { color: region.color, boxShadow: `0 0 12px ${region.color}44` } : undefined}
            >
              {region.name}
            </button>
          ))}
        </div>

        <Button asChild variant="outline-blue" className="w-full">
          <Link href="/map">Open Full Map</Link>
        </Button>
      </div>
    </div>
  );
}
