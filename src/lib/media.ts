import type { ImageAsset, MediaItem, MediaKind } from "@/types";

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
    title: "Video Breakdowns",
    description: "Frame-by-frame analysis and evidence reviews.",
  },
  {
    kind: "trailer",
    id: "trailers",
    title: "Trailer Archive",
    description: "Official trailers, played straight from Rockstar Games' YouTube channel. Never rehosted.",
  },
];

/* ── CMS parsing ────────────────────────────────────── */

/** "Type: Fan Art" → "fanart". Unknown values return null. */
export function parseMediaKind(raw?: string): MediaKind | null {
  const v = raw?.toLowerCase().replace(/[^a-z]/g, "") ?? "";
  if (v.startsWith("wallpaper") || v === "screenshot" || v === "screenshots") return "wallpaper";
  if (v.startsWith("fanart") || v === "art" || v === "artwork") return "fanart";
  if (v.startsWith("trailer")) return "trailer";
  if (v.startsWith("video") || v.startsWith("breakdown") || v === "analysis") return "video";
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

/* ── Defaults (used only while a section has no CMS items) ── */

/**
 * Official GTA VI screenshots already in the WordPress media library (Rockstar's own
 * file names). Shown as wallpapers until editors add `Type: Wallpaper` gallery posts.
 */
export const DEFAULT_WALLPAPER_SLUGS = [
  "jason_duval_03",
  "lucia_caminos_02",
  "jason_duval_01",
  "cal_hampton_01",
  "boobie_ike_01",
  "drequan_priest_03",
  "real_dimez_04",
  "raul_bautista_04",
  "brian_heder_02",
];

export const OFFICIAL_CREDIT = "© Rockstar Games";
export const OFFICIAL_CREDIT_URL = "https://www.rockstargames.com/VI";

/** Official trailers on Rockstar's YouTube channel (IDs verified via YouTube oEmbed). */
export const DEFAULT_TRAILERS: MediaItem[] = [
  { id: "VQRLujxTm3c", title: "Grand Theft Auto VI Trailer 2", date: "2025-05-06" },
  { id: "QdBZY2fkU-0", title: "Grand Theft Auto VI Trailer 1", date: "2023-12-05" },
].map((t) => ({
  id: `yt-${t.id}`,
  kind: "trailer" as const,
  title: t.title,
  youtubeId: t.id,
  image: youtubeThumbnail(t.id, t.title),
  credit: "Rockstar Games",
  creditUrl: "https://www.youtube.com/@RockstarGames",
  date: t.date,
}));

/** "Jason_Duval_03" → "Jason Duval" */
export function titleFromFileName(name: string): string {
  return name
    .replace(/[-_]+\d+$/g, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}
