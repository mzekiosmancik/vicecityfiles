"use client";

import Image from "next/image";
import { useState } from "react";
import { Play } from "lucide-react";
import type { MediaItem } from "@/types";

/**
 * YouTube videos as click-to-load cards: only the thumbnail loads up front; the
 * privacy-enhanced (youtube-nocookie) player is inserted when someone presses play.
 */
export function YouTubeGrid({ items, featureFirst = false }: { items: MediaItem[]; featureFirst?: boolean }) {
  return (
    <ul className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {items.map((item, i) =>
        item.youtubeId ? (
          <li key={item.id} className={featureFirst && i === 0 && items.length % 2 === 1 ? "md:col-span-2" : undefined}>
            <YouTubeCard item={item} />
          </li>
        ) : null,
      )}
    </ul>
  );
}

function YouTubeCard({ item }: { item: MediaItem }) {
  const [playing, setPlaying] = useState(false);
  const id = item.youtubeId!;

  return (
    <figure className="glass overflow-hidden rounded-lg">
      <div className="relative aspect-video bg-black">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={item.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="group absolute inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-pink"
            aria-label={`Play ${item.title}`}
          >
            <Image
              src={item.image.url}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover opacity-90 transition-opacity group-hover:opacity-100"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-vice-black/70 via-transparent to-transparent" />
            <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-neon-pink/90 shadow-neon-pink transition-transform group-hover:scale-110">
              <Play className="ml-1 h-7 w-7 fill-white text-white" aria-hidden="true" />
            </span>
          </button>
        )}
      </div>
      <figcaption className="flex items-start justify-between gap-4 px-4 py-3">
        <span className="min-w-0">
          <span className="block font-semibold leading-snug">{item.title}</span>
          {item.caption && <span className="mt-0.5 block text-sm text-muted-foreground">{item.caption}</span>}
        </span>
        <span className="shrink-0 text-right font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {item.credit &&
            (item.creditUrl ? (
              <a href={item.creditUrl} target="_blank" rel="noopener noreferrer" className="text-neon-blue hover:text-neon-pink">
                {item.credit}
              </a>
            ) : (
              <span className="text-neon-blue">{item.credit}</span>
            ))}
          {item.date && (
            <time dateTime={item.date} className="mt-0.5 block">
              {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })}
            </time>
          )}
        </span>
      </figcaption>
    </figure>
  );
}
