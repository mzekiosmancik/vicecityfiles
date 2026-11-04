import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { ProductCard } from "@/components/shared/product-card";
import { SectionHeading, sectionEyebrow } from "@/components/shared/section-heading";
import { StaggerContainer, StaggerItem } from "@/components/shared/motion";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

const GRID_SLOTS = 4;

/** Span for the store CTA so the row is always full (static classes for Tailwind). */
const CTA_SPAN: Record<number, string> = {
  1: "col-span-1 lg:col-span-3",
  2: "col-span-2 lg:col-span-2",
  3: "col-span-1 lg:col-span-1",
};

export function MerchPreview({ products, index }: { products: Product[]; index: number }) {
  const shown = products.slice(0, GRID_SLOTS);
  return (
    <section className="container py-20" aria-labelledby="merch-preview">
      <div className="flex items-end justify-between gap-4">
        <SectionHeading id="merch-preview"
          eyebrow={sectionEyebrow(index, "Contraband")}
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
        {shown.map((product) => (
          <StaggerItem key={product.id} className="h-full">
            <ProductCard product={product} />
          </StaggerItem>
        ))}
        {shown.length < GRID_SLOTS && (
          <StaggerItem className={cn("h-full", CTA_SPAN[shown.length])}>
            <Link
              href="/store"
              className="glass neon-border-hover group flex h-full min-h-48 flex-col items-start justify-end gap-3 rounded-lg bg-gradient-to-br from-neon-pink/10 via-transparent to-neon-blue/10 p-6"
            >
              <ShoppingBag className="h-8 w-8 text-neon-pink" aria-hidden="true" />
              <span className="font-display text-xl font-bold uppercase tracking-wide">More drops incoming</span>
              <span className="text-sm text-muted-foreground">
                New neon designs land weekly. Browse everything in the full store.
              </span>
              <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-neon-blue transition-colors group-hover:text-neon-pink">
                Full store <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
          </StaggerItem>
        )}
      </StaggerContainer>
    </section>
  );
}
