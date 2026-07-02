import "server-only";
import { fetchGraphQL } from "@/graphql/client";
import { GET_PRODUCTS, GET_PRODUCT_BY_SLUG } from "@/graphql/queries";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import type { Product } from "@/types";

/* ── WooGraphQL response shapes ─────────────────────── */

interface WooImage {
  sourceUrl: string;
  altText: string;
}

interface WooProduct {
  id: string;
  slug: string;
  name: string;
  description: string;
  price?: string;
  regularPrice?: string;
  stockStatus?: string;
  image?: WooImage;
  galleryImages?: { nodes: WooImage[] };
  productCategories?: { nodes: { name: string }[] };
  reviewCount?: number;
  averageRating?: number;
  variations?: { nodes: { id: string; name: string; price?: string }[] };
  reviews?: { nodes: { content: string; date: string; author?: { node: { name: string } } }[] };
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").trim();
}

function mapProduct(p: WooProduct): Product {
  const price = parseFloat(p.price ?? "0");
  const regular = p.regularPrice ? parseFloat(p.regularPrice) : undefined;
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: stripHtml(p.description ?? ""),
    price,
    compareAtPrice: regular && regular > price ? regular : undefined,
    currency: "USD",
    category: p.productCategories?.nodes[0]?.name ?? "Merch",
    images: [
      ...(p.image ? [{ url: p.image.sourceUrl, alt: p.image.altText || p.name }] : []),
      ...(p.galleryImages?.nodes.map((g) => ({ url: g.sourceUrl, alt: g.altText || p.name })) ?? []),
    ],
    variants:
      p.variations?.nodes.map((v) => ({
        id: v.id,
        label: v.name.split(" - ").pop() ?? v.name,
        priceDelta: v.price ? parseFloat(v.price) - price : undefined,
      })) ?? [{ id: "default", label: "Standard" }],
    rating: p.averageRating ?? 0,
    reviewCount: p.reviewCount ?? 0,
    reviews:
      p.reviews?.nodes.map((r, i) => ({
        id: `woo-r${i}`,
        author: r.author?.node.name ?? "Anonymous",
        rating: 5,
        body: stripHtml(r.content),
        date: r.date,
      })) ?? [],
    inStock: p.stockStatus !== "OUT_OF_STOCK",
  };
}

/* ── Public API ─────────────────────────────────────── */

export async function getProducts(options: { category?: string; limit?: number } = {}): Promise<Product[]> {
  const data = await fetchGraphQL<{ products: { nodes: WooProduct[] } }>(
    GET_PRODUCTS,
    { first: options.limit ?? 24, category: options.category },
    { tags: ["woocommerce", "products"] },
  );

  if (data?.products?.nodes?.length) return data.products.nodes.map(mapProduct);

  let products = [...MOCK_PRODUCTS];
  if (options.category) {
    products = products.filter((p) => p.category.toLowerCase() === options.category!.toLowerCase());
  }
  return products.slice(0, options.limit ?? 24);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const data = await fetchGraphQL<{ product: WooProduct | null }>(
    GET_PRODUCT_BY_SLUG,
    { slug },
    { tags: ["woocommerce", "products", `product:${slug}`] },
  );

  if (data?.product) return mapProduct(data.product);
  return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const products = await getProducts({ limit: 24 });
  const featured = products.filter((p) => p.featured);
  return (featured.length ? featured : products).slice(0, limit);
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const products = await getProducts({ limit: 24 });
  return products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, limit);
}
