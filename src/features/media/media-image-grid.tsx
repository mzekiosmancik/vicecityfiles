"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, Maximize2, X } from "lucide-react";
import { MediaImage } from "@/components/shared/media-image";
import { cn } from "@/lib/utils";
import type { MediaItem } from "@/types";

interface MediaImageGridProps {
  items: MediaItem[];
  /** wallpapers: uniform 16:9 tiles. art: natural aspect ratios in a masonry layout. */
  layout?: "wallpapers" | "art";
}

export function MediaImageGrid({ items, layout = "wallpapers" }: MediaImageGridProps) {
  const [open, setOpen] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(null);
    lastTrigger.current?.focus();
  }, []);
  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? null : (i + d + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    if (open === null) return;
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, step]);

  const current = open === null ? null : items[open];

  return (
    <>
      <ul
        className={cn(
          layout === "wallpapers"
            ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            : "columns-2 gap-4 sm:columns-3 [&>li]:mb-4 [&>li]:break-inside-avoid",
        )}
      >
        {items.map((item, i) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={(e) => {
                lastTrigger.current = e.currentTarget;
                setOpen(i);
              }}
              className="glass neon-border-hover group block w-full overflow-hidden rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-pink"
              aria-label={`View ${item.title}`}
            >
              <div className="relative overflow-hidden">
                {layout === "art" && item.image.width && item.image.height ? (
                  <Image
                    src={item.image.url}
                    alt={item.image.alt}
                    width={item.image.width}
                    height={item.image.height}
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <MediaImage
                    image={item.image}
                    className="aspect-video w-full transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                )}
                <span className="absolute right-2 top-2 rounded-md bg-vice-black/70 p-1.5 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                  <Maximize2 className="h-4 w-4 text-white" aria-hidden="true" />
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-3 px-4 py-3">
                <span className="truncate text-sm font-semibold">{item.title}</span>
                {item.image.width && item.image.height && (
                  <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                    {item.image.width}×{item.image.height}
                  </span>
                )}
              </div>
              {item.credit && (
                <p className="-mt-2 truncate px-4 pb-3 font-mono text-[10px] uppercase tracking-widest text-neon-blue/80">
                  {layout === "art" ? "by " : ""}
                  {item.credit}
                </p>
              )}
            </button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {current && open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col bg-vice-black/95 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label={current.title}
            onClick={close}
          >
            <div className="flex items-center justify-between gap-4 p-4" onClick={(e) => e.stopPropagation()}>
              <p className="font-mono text-xs text-muted-foreground">
                {open + 1} / {items.length}
              </p>
              <div className="flex items-center gap-2">
                <a
                  href={current.fullUrl ?? current.image.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-white/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-neon-blue transition-colors hover:text-neon-pink"
                >
                  Full size <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={close}
                  className="rounded-full p-2 text-muted-foreground transition-colors hover:text-neon-pink"
                  aria-label="Close"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="relative min-h-0 flex-1 px-4 sm:px-16" onClick={(e) => e.stopPropagation()}>
              <motion.div
                key={current.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative h-full w-full"
              >
                {current.image.url ? (
                  <Image src={current.image.url} alt={current.image.alt} fill sizes="100vw" className="object-contain" />
                ) : (
                  <MediaImage image={current.image} className="h-full w-full rounded-lg" />
                )}
              </motion.div>
              {items.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    className="absolute left-1 top-1/2 -translate-y-1/2 rounded-full bg-vice-black/60 p-2 text-muted-foreground transition-colors hover:text-neon-blue sm:left-3"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="h-7 w-7" />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-vice-black/60 p-2 text-muted-foreground transition-colors hover:text-neon-blue sm:right-3"
                    aria-label="Next"
                  >
                    <ChevronRight className="h-7 w-7" />
                  </button>
                </>
              )}
            </div>

            <div className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
              <p className="font-display text-lg font-bold uppercase tracking-wide">{current.title}</p>
              {current.caption && <p className="mt-1 text-sm text-muted-foreground">{current.caption}</p>}
              {current.credit && (
                <p className="mt-1 font-mono text-xs uppercase tracking-widest text-neon-blue">
                  {current.creditUrl ? (
                    <a href={current.creditUrl} target="_blank" rel="noopener noreferrer" className="hover:text-neon-pink">
                      {current.credit}
                    </a>
                  ) : (
                    current.credit
                  )}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
