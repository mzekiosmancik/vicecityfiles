import "server-only";
import { fetchGraphQL } from "@/graphql/client";
import { GET_PRODUCTS, GET_PRODUCT_BY_SLUG, GET_PRODUCT_CATEGORIES } from "@/graphql/queries";
import type { Product } from "@/types";

/*
 * WooCommerce via WooGraphQL. WooCommerce is the only source of products: if the
 * CMS is unreachable or a product doesn't exist, nothing is shown or sold — there
 * is deliberately no demo/mock fallback (checkout prices come from here too).
 */

/* ── WooGraphQL response shapes ─────────────────────── */

interface WooImage {
  sourceUrl: string;
  altText: string;
}

interface WooProduct {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  shortDescription?: string | null;
  featured?: boolean;
  status?: string;
  price?: string | null;
  regularPrice?: string | null;
  formattedPrice?: string | null;
  stockStatus?: string;
  image?: WooImage | null;
  galleryImages?: { nodes: WooImage[] };
  productCategories?: { nodes: { name: string; slug: string }[] };
  reviewCount?: number;
  averageRating?: number;
  variations?: { nodes: { id: string; name: string; price?: string | null; stockStatus?: string }[] };
  reviews?: {
    edges: { rating?: number; node: { content: string; date: string; author?: { node: { name: string } } } }[];
  };
}

export interface StoreCategory {
  name: string;
  slug: string;
  count: number;
}

/* ── Mapping ────────────────────────────────────────── */

function stripHtml(html?: string | null): string {
  return (html ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

/** WooGraphQL RAW prices can be "64", "80.00" or, for variable products, "25.00, 30.00". */
function parsePrice(raw?: string | null): number | undefined {
  if (!raw) return undefined;
  const n = parseFloat(raw.split(",")[0].replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : undefined;
}

/**
 * The store currency, read from WooCommerce's formatted price ("$64.00", "64,00 €").
 * WooGraphQL doesn't expose the currency setting directly. STORE_CURRENCY (ISO code)
 * overrides this, e.g. for "$" stores that aren't USD.
 */
const SYMBOL_TO_ISO: Record<string, string> = { $: "USD", "€": "EUR", "£": "GBP", "₺": "TRY", "¥": "JPY", "₹": "INR" };

function detectCurrency(formatted?: string | null): string {
  if (process.env.STORE_CURRENCY) return process.env.STORE_CURRENCY.toUpperCase();
  const decoded = (formatted ?? "").replace(/&#36;/g, "$").replace(/&euro;/g, "€").replace(/&pound;/g, "£");
  const symbol = Object.keys(SYMBOL_TO_ISO).find((s) => decoded.includes(s));
  return symbol ? SYMBOL_TO_ISO[symbol] : "USD";
}

function categoryName(name?: string): string {
  return !name || name.toLowerCase() === "uncategorized" ? "Merch" : name;
}

function mapProduct(p: WooProduct): Product | null {
  const price = parsePrice(p.price);
  if (price === undefined) return null; // no price in WooCommerce → not sellable, don't show
  const regular = parsePrice(p.regularPrice);
  const variations = p.variations?.nodes ?? [];

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: stripHtml(p.description) || stripHtml(p.shortDescription),
    price,
    compareAtPrice: regular && regular > price ? regular : undefined,
    currency: detectCurrency(p.formattedPrice),
    category: categoryName(p.productCategories?.nodes[0]?.name),
    images: [
      ...(p.image ? [{ url: p.image.sourceUrl, alt: p.image.altText || p.name }] : []),
      ...(p.galleryImages?.nodes?.map((g) => ({ url: g.sourceUrl, alt: g.altText || p.name })) ?? []),
    ],
    variants: variations.length
      ? variations
          .filter((v) => v.stockStatus !== "OUT_OF_STOCK")
          .map((v) => {
            const vp = parsePrice(v.price);
            return {
              id: v.id,
              label: v.name.split(" - ").pop() ?? v.name,
              priceDelta: vp !== undefined && vp !== price ? vp - price : undefined,
            };
          })
      : [{ id: "default", label: "Standard" }],
    rating: p.averageRating ?? 0,
    reviewCount: p.reviewCount ?? 0,
    reviews:
      p.reviews?.edges?.map((e, i) => ({
        id: `woo-r${i}`,
        author: e.node.author?.node.name ?? "Anonymous",
        rating: e.rating ?? 0,
        body: stripHtml(e.node.content),
        date: e.node.date,
      })) ?? [],
    inStock: p.stockStatus !== "OUT_OF_STOCK",
    featured: p.featured ?? false,
  };
}

const isProduct = (p: Product | null): p is Product => p !== null;

/* ── Public API ─────────────────────────────────────── */

/** Published products, optionally filtered by WooCommerce category slug. */
export async function getProducts(options: { category?: string; limit?: number } = {}): Promise<Product[]> {
  const data = await fetchGraphQL<{ products: { nodes: WooProduct[] } }>(
    GET_PRODUCTS,
    { first: options.limit ?? 24, category: options.category || undefined },
    { tags: ["woocommerce", "products"] },
  );
  return (data?.products?.nodes ?? []).map(mapProduct).filter(isProduct);
}

/** A single published product, or null (unknown slug, draft, private, or CMS unreachable). */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const data = await fetchGraphQL<{ product: WooProduct | null }>(
    GET_PRODUCT_BY_SLUG,
    { slug },
    { tags: ["woocommerce", "products", `product:${slug}`] },
  );
  const product = data?.product;
  if (!product || (product.status && product.status !== "publish")) return null;
  return mapProduct(product);
}

/** Categories that currently have products ("Uncategorized" is left out of the filter). */
export async function getStoreCategories(): Promise<StoreCategory[]> {
  const data = await fetchGraphQL<{ productCategories: { nodes: StoreCategory[] } }>(
    GET_PRODUCT_CATEGORIES,
    {},
    { tags: ["woocommerce", "products"] },
  );
  return (data?.productCategories?.nodes ?? []).filter((c) => c.count > 0 && c.slug !== "uncategorized");
}

/** Products ticked "Featured" in WooCommerce; falls back to the newest products. */
export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const products = await getProducts({ limit: 24 });
  const featured = products.filter((p) => p.featured);
  return (featured.length ? featured : products).slice(0, limit);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const products = await getProducts({ limit: 24 });
  return products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, limit);
}
