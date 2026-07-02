import type { RumorLevel } from "@/lib/constants";

/* ── Shared ─────────────────────────────────────────── */

export interface SeoFields {
  title?: string;
  description?: string;
  ogImage?: string;
  canonical?: string;
}

export interface ImageAsset {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  /** Gradient fallback used when no CMS/Cloudinary asset exists yet */
  placeholder?: "pink" | "blue" | "purple" | "orange";
}

export interface Author {
  name: string;
  slug: string;
  avatar?: string;
  bio?: string;
}

/* ── News / Articles ────────────────────────────────── */

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: Author;
  publishedAt: string;
  updatedAt?: string;
  featuredImage: ImageAsset;
  readTime: number;
  rumorLevel?: RumorLevel;
  featured?: boolean;
  seo?: SeoFields;
}

/* ── Wiki ───────────────────────────────────────────── */

export type WikiCategorySlug =
  | "characters"
  | "vehicles"
  | "locations"
  | "weapons"
  | "missions"
  | "businesses"
  | "gangs"
  | "easter-eggs";

export interface WikiStat {
  label: string;
  value: string;
}

export interface WikiEntry {
  id: string;
  slug: string;
  category: WikiCategorySlug;
  title: string;
  summary: string;
  content: string;
  heroImage: ImageAsset;
  gallery: ImageAsset[];
  stats: WikiStat[];
  tags: string[];
  relatedSlugs: string[];
  updatedAt: string;
  seo?: SeoFields;
}

/* ── Store ──────────────────────────────────────────── */

export interface ProductVariant {
  id: string;
  label: string;
  priceDelta?: number;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  body: string;
  date: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  category: string;
  images: ImageAsset[];
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  reviews: ProductReview[];
  inStock: boolean;
  featured?: boolean;
  stripePriceId?: string;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image?: string;
  variant?: string;
  quantity: number;
}

/* ── Community ──────────────────────────────────────── */

export interface CommunityPost {
  id: string;
  slug: string;
  section: "theories" | "fan-art" | "discussions";
  title: string;
  excerpt: string;
  author: Author;
  likes: number;
  comments: number;
  createdAt: string;
  image?: ImageAsset;
}

/* ── Map ────────────────────────────────────────────── */

export interface MapRegion {
  id: string;
  name: string;
  description: string;
  color: string;
  /** SVG path for the stylized fallback map */
  path: string;
  /** [lng, lat] for Mapbox mode */
  center: [number, number];
  wikiSlug?: string;
}

/* ── Search ─────────────────────────────────────────── */

export interface SearchResult {
  type: "article" | "wiki" | "product" | "community";
  category: string;
  title: string;
  excerpt: string;
  href: string;
}
