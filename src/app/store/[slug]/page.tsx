import { notFound } from "next/navigation";
import { Ruler, Star, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Gallery } from "@/components/shared/gallery";
import { MediaImage } from "@/components/shared/media-image";
import { ProductCard } from "@/components/shared/product-card";
import { AddToCart } from "@/features/store/add-to-cart";
import { buildMetadata, JsonLd, productJsonLd } from "@/lib/seo";
import { formatDate, formatPrice } from "@/lib/utils";
import { getProductBySlug, getProducts, getRelatedProducts } from "@/services/woocommerce";

export const revalidate = 600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getProducts({ limit: 100 });
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return buildMetadata({ noIndex: true });
  return buildMetadata({
    title: `${product.name} — Merch`,
    description: product.description,
    path: `/store/${product.slug}`,
    ogImage: product.images[0]?.url || undefined,
  });
}

const SIZE_GUIDE = [
  { size: "S", chest: '34–36"', length: '27"' },
  { size: "M", chest: '38–40"', length: '28"' },
  { size: "L", chest: '42–44"', length: '29"' },
  { size: "XL", chest: '46–48"', length: '30"' },
  { size: "2XL", chest: '50–52"', length: '31"' },
];

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);
  const isApparel = ["T-Shirts", "Hoodies"].includes(product.category);

  return (
    <div className="container pt-28">
      <JsonLd
        data={productJsonLd({
          name: product.name,
          description: product.description,
          slug: product.slug,
          price: product.price,
          currency: product.currency,
          rating: product.rating,
          reviewCount: product.reviewCount,
          inStock: product.inStock,
          image: product.images[0]?.url || undefined,
        })}
      />
      <Breadcrumbs items={[{ label: "Store", href: "/store" }, { label: product.name }]} />

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <MediaImage
            image={product.images[0] ?? { url: "", alt: product.name, placeholder: "purple" }}
            className="aspect-square w-full rounded-lg"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          {product.images.length > 1 && (
            <div className="mt-4">
              <Gallery images={product.images.slice(1)} />
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <Badge variant="blue">{product.category}</Badge>
          <h1 className="mt-3 font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-4">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-2xl font-bold text-neon-blue">{formatPrice(product.price)}</span>
              {product.compareAtPrice && (
                <span className="font-mono text-lg text-muted-foreground line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>
            {product.reviewCount > 0 && (
              <span className="flex items-center gap-1.5 font-mono text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-neon-yellow text-neon-yellow" aria-hidden="true" />
                {product.rating.toFixed(1)} ({product.reviewCount})
              </span>
            )}
          </div>

          <p className="mt-5 leading-relaxed text-muted-foreground">{product.description}</p>

          <Separator className="my-6" />
          <AddToCart product={product} />

          <div className="mt-6 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <Truck className="h-4 w-4 text-neon-green" aria-hidden="true" />
            Ships worldwide in 3–7 business days
          </div>

          {/* Size guide */}
          {isApparel && (
            <details className="glass mt-6 rounded-lg p-5">
              <summary className="flex cursor-pointer items-center gap-2 font-display text-sm font-bold uppercase tracking-wide">
                <Ruler className="h-4 w-4 text-neon-pink" aria-hidden="true" />
                Size Guide
              </summary>
              <table className="mt-4 w-full font-mono text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="pb-2">Size</th>
                    <th className="pb-2">Chest</th>
                    <th className="pb-2">Length</th>
                  </tr>
                </thead>
                <tbody>
                  {SIZE_GUIDE.map((row) => (
                    <tr key={row.size} className="border-b border-white/5 last:border-0">
                      <td className="py-2 text-neon-blue">{row.size}</td>
                      <td className="py-2">{row.chest}</td>
                      <td className="py-2">{row.length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
          )}
        </div>
      </div>

      {/* Reviews */}
      {product.reviews.length > 0 && (
        <section className="mt-16" aria-labelledby="reviews">
          <h2 id="reviews" className="mb-6 font-display text-2xl font-bold uppercase tracking-wide">
            <span className="gradient-text">Field Reviews</span>
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {product.reviews.map((review) => (
              <div key={review.id} className="glass rounded-lg p-5">
                <div className="flex items-center justify-between">
                  <p className="font-display font-bold">{review.author}</p>
                  <span className="flex" aria-label={`${review.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating ? "fill-neon-yellow text-neon-yellow" : "text-vice-line"}`}
                        aria-hidden="true"
                      />
                    ))}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{review.body}</p>
                <p className="mt-3 font-mono text-xs text-muted-foreground/60">{formatDate(review.date)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-16" aria-labelledby="related-products">
          <h2 id="related-products" className="mb-6 font-display text-2xl font-bold uppercase tracking-wide">
            <span className="gradient-text">Complete the Set</span>
          </h2>
          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            {related.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
