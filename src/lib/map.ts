import { WIKI_CATEGORIES } from "@/lib/constants";
import type { ImageAsset, WikiCategorySlug, WikiEntry } from "@/types";

/**
 * Leonida map model. Regions are the CMS "locations" wiki entries; the places listed
 * under a region are other wiki entries whose stats name it (Location / City / Region).
 *
 * Geometry is for the original illustrated map (viewBox 0 0 100 100). Pin x/y are
 * percentages of the map box, so they also position pins on an uploaded map image
 * (adjust them here if that image is framed differently).
 */
export interface RegionShape {
  color: string;
  /** SVG path in the 0–100 illustrated-map space. */
  path: string;
  pin: { x: number; y: number };
}

export const REGION_SHAPES: Record<string, RegionShape> = {
  "port-gellhorn": {
    color: "#ff7849",
    path: "M4 13 L30 11 L31 24 L17 26 L4 23 Z",
    pin: { x: 17, y: 18 },
  },
  "mount-kalaga-national-park": {
    color: "#39ff88",
    path: "M30 11 L58 9.5 L62 12 L64 20 L48 22 L37 26.5 L31 24 Z",
    pin: { x: 47, y: 16 },
  },
  ambrosia: {
    color: "#ffe14d",
    path: "M37 26.5 L48 22 L64 20 L66.5 25 L70 35 L73 45 L55 48 L50.5 43.5 L46.5 36 L42.5 30.5 Z",
    pin: { x: 57, y: 34 },
  },
  grassrivers: {
    color: "#a855f7",
    path: "M55 48 L73 45 L72.5 58 L69 68 L70.5 82 L66.5 82.5 L61 75 L56.5 65 L52.5 54.5 Z",
    pin: { x: 62.5, y: 62 },
  },
  "vice-city": {
    color: "#ff2d95",
    path: "M73 45 L76 50 L80 61 L82 71 L80.5 79.5 L76.5 86 L70.5 87 L70.5 82 L69 68 L72.5 58 Z",
    pin: { x: 76.5, y: 69 },
  },
  "leonida-keys": {
    color: "#00e5ff",
    path:
      "M68 89.5 l3 -0.8 l0.6 1.6 l-3 0.9 Z M61.5 92 l3.4 -0.7 l0.4 1.5 l-3.4 0.8 Z M55 93.8 l3.4 -0.4 l0.2 1.5 l-3.4 0.5 Z M48.5 94.6 l3.4 -0.1 l0 1.5 l-3.4 0.1 Z M42.5 94.6 l3 0 l-0.1 1.5 l-3 -0.1 Z",
    pin: { x: 56, y: 93 },
  },
};

/** Coastline the regions sit on (slightly larger than the union of the shapes). */
export const LEONIDA_OUTLINE =
  "M3 12 L58 9 L62.5 11.5 L66.5 24 L70.5 35.5 L76.5 49.5 L80.5 61 L82.6 71 L81 80 L77 86.6 L70 87.8 L66 83 L60.5 75.5 L56 65.5 L52 55 L50 44.2 L46 36.5 L42 31 L36.5 27 L28 25 L17 26.6 L3 23.6 Z";

export interface MapPlace {
  id: string;
  slug: string;
  title: string;
  category: WikiCategorySlug;
  categoryLabel: string;
  /** Neighbourhood within the region, e.g. "Stockyard" from "Stockyard, Vice City". */
  area?: string;
  image: ImageAsset;
}

export interface MapRegionData {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  type?: string;
  summary: string;
  image: ImageAsset;
  shape: RegionShape | null;
  places: MapPlace[];
}

const PLACE_KEYS = ["location", "city", "region", "area"];

const CATEGORY_LABEL = Object.fromEntries(WIKI_CATEGORIES.map((c) => [c.slug, c.label])) as Record<string, string>;

const stat = (entry: WikiEntry, label: string) =>
  entry.stats.find((s) => s.label.toLowerCase() === label.toLowerCase())?.value;

const norm = (s: string) => s.toLowerCase().replace(/[’']/g, "").trim();

/** Display order: Vice City first, then outward. Regions not listed follow alphabetically. */
const DISPLAY_ORDER = [
  "vice-city",
  "leonida-keys",
  "grassrivers",
  "ambrosia",
  "port-gellhorn",
  "mount-kalaga-national-park",
];

export function buildMapRegions(entries: WikiEntry[]): MapRegionData[] {
  const regions = entries.filter((e) => e.category === "locations");
  const others = entries.filter((e) => e.category !== "locations");

  const result = regions.map<MapRegionData>((region) => {
    const regionName = stat(region, "Region") ?? region.title;
    const names = [norm(regionName), norm(region.title)];

    const places: MapPlace[] = [];
    for (const entry of others) {
      // Match on the first "Location/City/Region/Area" stat that names this region.
      let area: string | undefined;
      const matched = PLACE_KEYS.some((key) => {
        const value = stat(entry, key);
        if (!value) return false;
        const parts = value.split(",").map((p) => p.trim());
        const hit = parts.some((p) => names.includes(norm(p)));
        if (hit) {
          const rest = parts.filter((p) => !names.includes(norm(p)));
          area = rest.length ? rest.join(", ") : undefined;
        }
        return hit;
      });
      if (matched) {
        places.push({
          id: entry.id,
          slug: entry.slug,
          title: entry.title,
          category: entry.category,
          categoryLabel: CATEGORY_LABEL[entry.category] ?? entry.category,
          area,
          image: entry.heroImage,
        });
      }
    }
    places.sort((a, b) => a.categoryLabel.localeCompare(b.categoryLabel) || a.title.localeCompare(b.title));

    return {
      id: region.id,
      slug: region.slug,
      name: region.title,
      tagline: stat(region, "Tagline"),
      type: stat(region, "Type"),
      summary: region.summary,
      image: region.heroImage,
      shape: REGION_SHAPES[region.slug] ?? null,
      places,
    };
  });

  const rank = (slug: string) => {
    const i = DISPLAY_ORDER.indexOf(slug);
    return i === -1 ? DISPLAY_ORDER.length : i;
  };
  return result.sort((a, b) => rank(a.slug) - rank(b.slug) || a.name.localeCompare(b.name));
}
