import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/shared/product-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { StaggerContainer, StaggerItem } from "@/components/shared/motion";
import type { Product } from "@/types";

export function MerchPreview({ products }: { products: Product[] }) {
  return (
    <section className="container py-20" aria-labelledby="merch-preview">
      <div className="flex items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Section 06 // Contraband"
          title="The Merch Store"
          description="Original fan-designed hoodies, tees, posters, mugs, and stickers. Zero copyright violations, maximum neon."
        />
        <Link
          href="/store"
          className="mb-10 hidden shrink-0 items-center gap-2 font-mono text-xs uppercase tracking-widest text-neon-blue transition-colors hover:text-neon-pink sm:flex"
        >
          Full Store <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <StaggerContainer className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        {products.map((product) => (
          <StaggerItem key={product.id} className="h-full">
            <ProductCard product={product} />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
