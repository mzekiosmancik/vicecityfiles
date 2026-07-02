export const SITE = {
  name: "Vice City Files",
  tagline: "Every File. Every Theory. Every Street.",
  altTagline: "Your Unofficial GTA 6 Archive",
  description:
    "The ultimate unofficial GTA 6 fan archive — news, guides, characters, vehicles, interactive maps, theories, and merchandise. Not affiliated with Rockstar Games.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://vicecityfiles.com",
  twitter: "@vicecityfiles",
  disclaimer:
    "Vice City Files is an unofficial fan site and is not affiliated with Rockstar Games or Take-Two Interactive. All trademarks belong to their respective owners.",
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Wiki", href: "/wiki" },
  { label: "News", href: "/news" },
  { label: "Guides", href: "/news?category=guides" },
  { label: "Map", href: "/map" },
  { label: "Media", href: "/media" },
  { label: "Merch", href: "/store" },
  { label: "Community", href: "/community" },
  { label: "About", href: "/about" },
] as const;

export const WIKI_CATEGORIES = [
  { slug: "characters", label: "Characters", icon: "users", accent: "pink", description: "Protagonists, villains, and every face on the street." },
  { slug: "vehicles", label: "Vehicles", icon: "car", accent: "blue", description: "Supercars, bikes, boats, and aircraft — full spec files." },
  { slug: "locations", label: "Locations", icon: "map-pin", accent: "purple", description: "Districts, landmarks, and hidden corners of Vice City." },
  { slug: "weapons", label: "Weapons", icon: "crosshair", accent: "orange", description: "Loadouts, stats, and where to find every piece." },
  { slug: "missions", label: "Missions", icon: "target", accent: "pink", description: "Story walkthroughs, gold medal requirements, and choices." },
  { slug: "businesses", label: "Businesses", icon: "building", accent: "blue", description: "Properties, fronts, and money-making operations." },
  { slug: "gangs", label: "Gangs", icon: "shield", accent: "purple", description: "Factions, territories, and power structures." },
  { slug: "easter-eggs", label: "Easter Eggs", icon: "egg", accent: "orange", description: "Secrets, references, and community discoveries." },
] as const;

export const NEWS_CATEGORIES = [
  "News",
  "Rumors",
  "Updates",
  "Trailers",
  "Features",
  "Guides",
  "Analysis",
] as const;

export const STORE_CATEGORIES = [
  "T-Shirts",
  "Hoodies",
  "Posters",
  "Caps",
  "Mugs",
  "Wallpapers",
  "Accessories",
] as const;

export const RUMOR_LEVELS = {
  confirmed: { label: "Confirmed", color: "#39ff88", value: 100 },
  likely: { label: "Likely", color: "#00e5ff", value: 70 },
  rumor: { label: "Rumor", color: "#ffe14d", value: 40 },
  debunked: { label: "Debunked", color: "#ff4d4d", value: 10 },
} as const;

export type RumorLevel = keyof typeof RUMOR_LEVELS;
