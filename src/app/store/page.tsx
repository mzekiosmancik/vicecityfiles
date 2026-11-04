import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ProductCard } from "@/components/shared/product-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { StaggerContainer, StaggerItem } from "@/components/shared/motion";
import { buildMetadata } from "@/lib/seo";
import { getProducts, getStoreCategories } from "@/services/woocommerce";

export const revalidate = 600;

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export const metadata = buildMetadata({
  title: "Merch Store — Original Fan Gear",
  description:
    "Original fan-designed hoodies, tees, posters, caps, mugs, wallpapers, and accessories. Neon tropical aesthetic, zero copyright violations.",
  path: "/store",
});

export default async function StorePage({ searchParams }: PageProps) {
  const { category } = await searchParams;
  const [products, categories] = await Promise.all([getProducts({ category }), getStoreCategories()]);
  const activeCategory = categories.find((c) => c.slug === category);

  return (
    <div className="container pt-28">
      <Breadcrumbs items={[{ label: "Store" }]} />
      <SectionHeading
        eyebrow="Contraband Division // Original Designs Only"
        title="The Merch Store"
        description="Every design is original fan art. Printed on demand, shipped worldwide, paid via Stripe."
      />

      {/* Categories come from WooCommerce; hidden until there's more than one to choose from */}
      {categories.length > 0 && (
        <nav className="mb-10 flex flex-wrap gap-2" aria-label="Store categories">
          <Link href="/store">
            <Badge variant={!category ? "default" : "outline"} className="cursor-pointer px-4 py-1.5">
              All
            </Badge>
          </Link>
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/store?category=${encodeURIComponent(cat.slug)}`}>
              <Badge
                variant={category === cat.slug ? "default" : "outline"}
                className="cursor-pointer px-4 py-1.5 hover:border-neon-pink/40 hover:text-neon-pink"
              >
                {cat.name}
                <span className="ml-1.5 opacity-60">{cat.count}</span>
              </Badge>
            </Link>
          ))}
        </nav>
      )}

      {products.length === 0 ? (
        <p className="glass rounded-lg p-10 text-center font-mono text-sm text-muted-foreground">
          {activeCategory ? `Nothing in ${activeCategory.name} right now.` : "Nothing in this drop yet. Check back soon."}
        </p>
      ) : (
        <StaggerContainer className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <StaggerItem key={product.id} className="h-full">
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </div>
  );
}
