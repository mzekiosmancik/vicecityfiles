import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ProductCard } from "@/components/shared/product-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { StaggerContainer, StaggerItem } from "@/components/shared/motion";
import { buildMetadata } from "@/lib/seo";
import { STORE_CATEGORIES } from "@/lib/constants";
import { getProducts } from "@/services/woocommerce";

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
  const products = await getProducts({ category });

  return (
    <div className="container pt-28">
      <Breadcrumbs items={[{ label: "Store" }]} />
      <SectionHeading
        eyebrow="Contraband Division // Original Designs Only"
        title="The Merch Store"
        description="Every design is original fan art. Printed on demand, shipped worldwide, paid via Stripe."
      />

      <nav className="mb-10 flex flex-wrap gap-2" aria-label="Store categories">
        <Link href="/store">
          <Badge variant={!category ? "default" : "outline"} className="cursor-pointer px-4 py-1.5">
            All
          </Badge>
        </Link>
        {STORE_CATEGORIES.map((cat) => (
          <Link key={cat} href={`/store?category=${encodeURIComponent(cat.toLowerCase())}`}>
            <Badge
              variant={category?.toLowerCase() === cat.toLowerCase() ? "default" : "outline"}
              className="cursor-pointer px-4 py-1.5 hover:border-neon-pink/40 hover:text-neon-pink"
            >
              {cat}
            </Badge>
          </Link>
        ))}
      </nav>

      {products.length === 0 ? (
        <p className="glass rounded-lg p-10 text-center font-mono text-sm text-muted-foreground">
          Nothing in this drop yet. Check back soon.
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
