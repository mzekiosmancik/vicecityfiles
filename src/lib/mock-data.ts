import type { Article, CommunityPost, WikiEntry } from "@/types";

/**
 * Development/demo content. In production every getter in `src/services`
 * pulls from WordPress (WPGraphQL) / WooCommerce first and falls back to
 * this data only when the CMS is unreachable or unconfigured.
 *
 * All entries are original fan-fiction placeholders — no Rockstar assets.
 */

/* ── Articles ───────────────────────────────────────── */

const AUTHOR_MARA = { name: "Mezo", slug: "mara-delgado", bio: "Lead investigator at Vice City Files." };
const AUTHOR_JAX = { name: "Jax Romero", slug: "jax-romero", bio: "Guides & analysis editor." };

export const MOCK_ARTICLES: Article[] = [
  {
    id: "a1",
    slug: "trailer-frame-analysis-neon-district",
    title: "Frame-by-Frame: What the Neon District Shots Really Tell Us",
    excerpt:
      "We slowed every frame of the latest footage to 0.25x and catalogued 47 environmental details — including three storefronts that hint at returning businesses.",
    content:
      "Our investigation board is full. After a week of frame-by-frame review, the neon district footage reveals far more than a pretty skyline. Storefront signage, traffic density, and NPC routines all point to a living simulation deeper than anything in the series so far.\n\nThe standout discovery: a repeated radio tower motif appearing in three separate shots, always framed left-of-center. Community sleuths believe it marks a broadcast-related mechanic.\n\nWe also catalogued vehicle badges, palm species (yes, really), and a pelican with suspiciously scripted behavior. The full evidence list is below.",
    category: "Analysis",
    tags: ["analysis", "trailer", "neon-district"],
    author: AUTHOR_MARA,
    publishedAt: "2026-06-28T14:00:00Z",
    featuredImage: { url: "", alt: "Neon district skyline analysis board", placeholder: "pink" },
    readTime: 8,
    rumorLevel: "likely",
    featured: true,
  },
  {
    id: "a2",
    slug: "map-size-estimate-updated",
    title: "Updated Map Size Estimate: Bigger Than We Thought",
    excerpt:
      "Using landmark triangulation and travel-time math from public footage, our new estimate puts the playable area at roughly 1.7x the previous record.",
    content:
      "Triangulating from bridge lengths, beach curvature, and skyline sightlines, our cartography team has revised its estimate upward. The methodology, raw measurements, and margin of error are documented in full inside.\n\nKey takeaway: the metro area alone appears larger than any previous map, before counting the swamplands and keys to the south.",
    category: "Features",
    tags: ["map", "analysis"],
    author: AUTHOR_JAX,
    publishedAt: "2026-06-25T10:00:00Z",
    featuredImage: { url: "", alt: "Map triangulation diagram", placeholder: "blue" },
    readTime: 6,
    rumorLevel: "likely",
    featured: true,
  },
  {
    id: "a3",
    slug: "dual-protagonist-heist-economy",
    title: "How a Dual-Protagonist Structure Could Reshape the Heist Economy",
    excerpt:
      "Two playable leads means two reputations, two skill trees, and — if our sources are right — a shared stash with trust mechanics.",
    content:
      "The dual-protagonist rumor has circulated for years, but new details suggest the two leads share a criminal economy: one stash, two spenders. We break down how trust mechanics could gate late-game heists and what that means for replayability.",
    category: "Rumors",
    tags: ["rumors", "gameplay", "heists"],
    author: AUTHOR_MARA,
    publishedAt: "2026-06-21T09:00:00Z",
    featuredImage: { url: "", alt: "Heist planning board", placeholder: "purple" },
    readTime: 7,
    rumorLevel: "rumor",
  },
  {
    id: "a4",
    slug: "weather-system-hurricane-events",
    title: "Test Dynamic Hurricane Events: Confirmed Weather Tech Explained",
    excerpt:
      "Storm cells that reroute traffic, flood streets, and change mission availability — here is everything officially shown about the weather simulation.",
    content:
      "Weather is no longer wallpaper. Officially shown footage demonstrates storm fronts rolling in from the ocean with visible pressure effects: palms bending, awnings tearing, NPCs sheltering. We analyze what was demonstrated versus what remains speculation.",
    category: "News",
    tags: ["weather", "tech"],
    author: AUTHOR_JAX,
    publishedAt: "2026-06-18T16:30:00Z",
    featuredImage: { url: "", alt: "Storm rolling over the coast", placeholder: "orange" },
    readTime: 5,
    rumorLevel: "confirmed",
    featured: true,
  },
  {
    id: "a5",
    slug: "beginner-guide-what-we-know",
    title: "The Complete Beginner's Dossier: Everything Known So Far",
    excerpt:
      "New to the investigation? This continuously updated dossier covers every confirmed fact, ranked rumor, and debunked myth in one place.",
    content:
      "This is the master file. Every confirmed detail is sourced and dated; every rumor carries our Rumor Meter rating. Bookmark this page — it updates the moment new evidence lands.",
    category: "Guides",
    tags: ["guide", "beginners"],
    author: AUTHOR_JAX,
    publishedAt: "2026-06-15T08:00:00Z",
    featuredImage: { url: "", alt: "Evidence dossier folder", placeholder: "pink" },
    readTime: 12,
    rumorLevel: "confirmed",
  },
  {
    id: "a6",
    slug: "underwater-exploration-debunked",
    title: "The 'Full Ocean Floor City' Leak Is Fake — Here's the Proof",
    excerpt:
      "A viral screenshot claiming an underwater city district has been traced to a fan-made render from 2024. Case closed.",
    content:
      "Reverse image search, EXIF remnants, and the original artist's portfolio all confirm it: the viral 'ocean floor district' screenshot is a fan render. We show the receipts and talk to the artist whose work went viral without credit.",
    category: "Rumors",
    tags: ["debunked", "leaks"],
    author: AUTHOR_MARA,
    publishedAt: "2026-06-10T12:00:00Z",
    featuredImage: { url: "", alt: "Debunked stamp over a screenshot", placeholder: "blue" },
    readTime: 4,
    rumorLevel: "debunked",
  },
];

/* ── Wiki ───────────────────────────────────────────── */

export const MOCK_WIKI: WikiEntry[] = [
  {
    id: "w3",
    slug: "banshee-gt",
    category: "vehicles",
    title: "Banshee GT (Fan Spec Sheet)",
    summary: "Community spec sheet for the returning classic seen in official footage — estimated performance, customization, and spawn theories.",
    content:
      "## Spotted In\nOfficial footage appearances with timestamps.\n\n## Estimated Performance\nCommunity-modeled top speed and handling based on frame analysis.\n\n## Customization\nBodywork variants visible in public material.",
    heroImage: { url: "", alt: "Neon sports car silhouette", placeholder: "orange" },
    gallery: [
      { url: "", alt: "Side profile render", placeholder: "orange" },
      { url: "", alt: "Night shot", placeholder: "pink" },
    ],
    stats: [
      { label: "Class", value: "Sports" },
      { label: "Est. Top Speed", value: "128 mph" },
      { label: "Seats", value: "2" },
      { label: "Confirmed", value: "Yes — official footage" },
    ],
    tags: ["sports-car", "returning-vehicle"],
    relatedSlugs: ["ocean-drive"],
    updatedAt: "2026-06-20T00:00:00Z",
  },
  {
    id: "w4",
    slug: "ocean-drive",
    category: "locations",
    title: "Ocean Drive (District File)",
    summary: "The neon heart of Vice City's beachfront: art-deco hotels, nightlife, and every confirmed landmark along the strip.",
    content:
      "## District Overview\nThe most-shown location in official material. Art-deco facades, neon signage, and a beachfront promenade.\n\n## Confirmed Landmarks\nCatalogued buildings matched across trailer shots.\n\n## Activities (Speculated)\nNightclubs, street racing, and beachfront events based on environmental storytelling.",
    heroImage: { url: "", alt: "Neon beachfront strip", placeholder: "purple" },
    gallery: [
      { url: "", alt: "Beachfront at dusk", placeholder: "pink" },
      { url: "", alt: "Neon hotel row", placeholder: "purple" },
      { url: "", alt: "Palm-lined promenade", placeholder: "blue" },
    ],
    stats: [
      { label: "Region", value: "Vice Beach" },
      { label: "Type", value: "Entertainment District" },
      { label: "Confirmed", value: "Yes" },
    ],
    tags: ["district", "beach", "nightlife"],
    relatedSlugs: ["vice-beach", "banshee-gt"],
    updatedAt: "2026-06-22T00:00:00Z",
  },
  {
    id: "w5",
    slug: "vice-beach",
    category: "locations",
    title: "Vice Beach (Region File)",
    summary: "The full eastern barrier island: beaches, marinas, and the skyline that defines the reveal footage.",
    content:
      "## Overview\nThe barrier island region encompassing Ocean Drive, the marina district, and northern residential blocks.",
    heroImage: { url: "", alt: "Aerial coastline", placeholder: "blue" },
    gallery: [{ url: "", alt: "Coastline", placeholder: "blue" }],
    stats: [
      { label: "Type", value: "Region" },
      { label: "Districts", value: "4 (estimated)" },
    ],
    tags: ["region", "beach"],
    relatedSlugs: ["ocean-drive"],
    updatedAt: "2026-06-22T00:00:00Z",
  },
  {
    id: "w6",
    slug: "chrome-python",
    category: "weapons",
    title: "Chrome Python (Fan File)",
    summary: "The chromed revolver glimpsed in holster shots — community stat projections and reference history.",
    content: "## Sightings\nHolster close-ups catalogued from official stills.\n\n## Projected Stats\nCommunity estimates modeled on series history.",
    heroImage: { url: "", alt: "Revolver evidence file", placeholder: "orange" },
    gallery: [{ url: "", alt: "Holster detail", placeholder: "orange" }],
    stats: [
      { label: "Type", value: "Revolver" },
      { label: "Est. Damage", value: "High" },
      { label: "Confirmed", value: "Partial — holster only" },
    ],
    tags: ["sidearm"],
    relatedSlugs: [],
    updatedAt: "2026-06-12T00:00:00Z",
  },
  {
    id: "w7",
    slug: "midnight-heist",
    category: "missions",
    title: "The Midnight Setup (Speculated Mission)",
    summary: "Community reconstruction of the jewelry-store sequence shown in official footage — beats, choices, and likely outcomes.",
    content: "## Reconstruction\nShot-by-shot mission beat reconstruction from public footage.\n\n## Predicted Choices\nApproach variants the footage implies.",
    heroImage: { url: "", alt: "Heist planning file", placeholder: "pink" },
    gallery: [{ url: "", alt: "Storefront still", placeholder: "pink" }],
    stats: [
      { label: "Type", value: "Heist (speculated)" },
      { label: "Act", value: "Unknown" },
    ],
    tags: ["heist", "speculation"],
    relatedSlugs: ["lucia-placeholder", "jason-placeholder"],
    updatedAt: "2026-06-08T00:00:00Z",
  },
  {
    id: "w8",
    slug: "malibu-club-legacy",
    category: "businesses",
    title: "The Malibu Legacy (Business File)",
    summary: "Will the iconic club return? Evidence for and against, plus every nightclub storefront spotted so far.",
    content: "## Evidence Board\nStorefront comparisons across eras and what current footage shows.",
    heroImage: { url: "", alt: "Nightclub neon sign", placeholder: "purple" },
    gallery: [{ url: "", alt: "Club exterior", placeholder: "purple" }],
    stats: [
      { label: "Type", value: "Nightclub" },
      { label: "Status", value: "Rumored Return" },
    ],
    tags: ["nightclub", "legacy"],
    relatedSlugs: ["ocean-drive"],
    updatedAt: "2026-06-05T00:00:00Z",
  },
  {
    id: "w9",
    slug: "boulevard-kings",
    category: "gangs",
    title: "Boulevard Kings (Faction File)",
    summary: "Fan-named faction spotted controlling the northside blocks in ambient footage — colors, vehicles, and turf analysis.",
    content: "## Turf Analysis\nBlock-by-block mapping of gang colors visible in official material.",
    heroImage: { url: "", alt: "Gang territory map", placeholder: "blue" },
    gallery: [{ url: "", alt: "Territory heat map", placeholder: "blue" }],
    stats: [
      { label: "Turf", value: "Northside (est.)" },
      { label: "Colors", value: "Teal / Gold" },
      { label: "Status", value: "Fan-Named" },
    ],
    tags: ["faction"],
    relatedSlugs: [],
    updatedAt: "2026-06-02T00:00:00Z",
  },
  {
    id: "w10",
    slug: "pelican-glitch",
    category: "easter-eggs",
    title: "The Scripted Pelican (Easter Egg File)",
    summary: "A pelican with suspiciously deliberate flight paths appears in multiple shots. Coincidence, or the series' next great mystery?",
    content: "## The Evidence\nFlight path overlays across three separate shots. The community is convinced. We remain professionally skeptical.",
    heroImage: { url: "", alt: "Pelican flight path diagram", placeholder: "orange" },
    gallery: [{ url: "", alt: "Flight path overlay", placeholder: "orange" }],
    stats: [
      { label: "Sightings", value: "3" },
      { label: "Status", value: "Under Investigation" },
    ],
    tags: ["mystery", "community-find"],
    relatedSlugs: ["ocean-drive"],
    updatedAt: "2026-05-30T00:00:00Z",
  },
];

/* ── Community ──────────────────────────────────────── */

export const MOCK_COMMUNITY: CommunityPost[] = [
  {
    id: "c1",
    slug: "radio-tower-theory",
    section: "theories",
    title: "The Radio Tower Appears in Every Trailer Shot — Broadcast Mechanic Incoming?",
    excerpt: "Three appearances, always framed left-of-center. I mapped the sightlines and they converge on one district.",
    author: { name: "SignalHunter", slug: "signalhunter" },
    likes: 1284,
    comments: 342,
    createdAt: "2026-06-26T00:00:00Z",
    image: { url: "", alt: "Radio tower sightline map", placeholder: "blue" },
  },
  {
    id: "c2",
    slug: "ocean-drive-repaint",
    section: "fan-art",
    title: "I repainted Ocean Drive in 1986 vs 2026 styles [OC]",
    excerpt: "Side-by-side original illustration. Six weeks in Procreate. Prints soon!",
    author: { name: "NoirBrush", slug: "noirbrush" },
    likes: 3921,
    comments: 208,
    createdAt: "2026-06-24T00:00:00Z",
    image: { url: "", alt: "Ocean Drive fan illustration", placeholder: "pink" },
  },
  {
    id: "c3",
    slug: "physics-discussion",
    section: "discussions",
    title: "Vehicle physics expectations thread — arcade vs sim, where should it land?",
    excerpt: "After the boat wake analysis, I'm convinced the driving model is a hybrid. Discuss.",
    author: { name: "ApexJunkie", slug: "apexjunkie" },
    likes: 764,
    comments: 519,
    createdAt: "2026-06-22T00:00:00Z",
  },
  {
    id: "c4",
    slug: "swamp-region-theory",
    section: "theories",
    title: "The southern swamps are a full expansion-sized region — evidence inside",
    excerpt: "Airboat props, fauna variety, and a suspicious dock network. This isn't set dressing.",
    author: { name: "GatorGrl", slug: "gatorgrl" },
    likes: 987,
    comments: 156,
    createdAt: "2026-06-19T00:00:00Z",
    image: { url: "", alt: "Swamp region evidence collage", placeholder: "purple" },
  },
];
