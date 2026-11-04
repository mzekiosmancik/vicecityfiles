import type { ImageAsset, MediaKind } from "@/types";

/* ── Sections ───────────────────────────────────────── */

export const MEDIA_SECTIONS: { kind: MediaKind; id: string; title: string; description: string }[] = [
  {
    kind: "wallpaper",
    id: "wallpapers",
    title: "Wallpapers",
    description: "High-resolution stills for your desktop. Official screenshots are credited to Rockstar Games.",
  },
  {
    kind: "fanart",
    id: "fanart",
    title: "Fan Art",
    description: "Community illustrations and renders — every piece credited to its artist.",
  },
  {
    kind: "video",
    id: "videos",
    title: "Videos & Trailers",
    description: "Official trailers and videos, played straight from YouTube. Never rehosted.",
  },
  {
    kind: "breakdown",
    id: "breakdowns",
    title: "Video Breakdowns",
    description: "Frame-by-frame analysis and evidence reviews.",
  },
];

/* ── CMS parsing ────────────────────────────────────── */

/** CMS category ("Fan Arts", "Video Breakdown", …) → MediaKind. Unknown values return null. */
export function parseMediaKind(raw?: string | null): MediaKind | null {
  const v = raw?.toLowerCase().replace(/[^a-z]/g, "") ?? "";
  if (!v) return null;
  if (v.startsWith("wallpaper") || v.startsWith("screenshot")) return "wallpaper";
  if (v.startsWith("fanart") || v === "art" || v === "artwork") return "fanart";
  if (v.includes("breakdown") || v === "analysis") return "breakdown";
  if (v.startsWith("video") || v.startsWith("trailer")) return "video";
  return null;
}

/** Accepts a bare 11-char ID or any youtube.com / youtu.be URL (watch, embed, shorts, live). */
export function parseYouTubeId(raw?: string): string | undefined {
  if (!raw) return undefined;
  const s = raw.trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  const m = s.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/))([\w-]{11})/);
  return m?.[1];
}

export function youtubeThumbnail(id: string, title: string): ImageAsset {
  return { url: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`, alt: title, width: 480, height: 360 };
}
