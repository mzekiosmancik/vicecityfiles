import Link from "next/link";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MediaImage } from "@/components/shared/media-image";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const onSale = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <article className="group h-full">
      <Link href={`/store/${product.slug}`} className="glass neon-border-hover flex h-full flex-col overflow-hidden rounded-lg">
        <div className="relative">
          <MediaImage
            image={product.images[0] ?? { url: "", alt: product.name, placeholder: "purple" }}
            className="aspect-square w-full transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {onSale && (
            <Badge className="absolute left-3 top-3 bg-neon-pink text-white shadow-neon-pink">Sale</Badge>
          )}
          {!product.inStock && (
            <Badge variant="outline" className="absolute right-3 top-3 bg-vice-black/80">
              Sold Out
            </Badge>
          )}
        </div>
        <div className="flex flex-1 flex-col p-4">
          <p className="evidence-tag mb-1">{product.category}</p>
          <h3 className="font-display font-bold leading-snug transition-colors group-hover:text-neon-pink">
            {product.name}
          </h3>
          <div className="mt-auto flex items-center justify-between pt-3">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-lg font-bold text-neon-blue">{formatPrice(product.price)}</span>
              {onSale && (
                <span className="font-mono text-sm text-muted-foreground line-through">
                  {formatPrice(product.compareAtPrice!)}
                </span>
              )}
            </div>
            {product.reviewCount > 0 && (
              <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
                <Star className="h-3.5 w-3.5 fill-neon-yellow text-neon-yellow" aria-hidden="true" />
                {product.rating.toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
