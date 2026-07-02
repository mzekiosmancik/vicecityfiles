"use client";

import { useState } from "react";
import { Check, Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/providers/cart-provider";
import { cn, formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

export function AddToCart({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [variant, setVariant] = useState(product.variants[0]?.id);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const selectedVariant = product.variants.find((v) => v.id === variant);
  const unitPrice = product.price + (selectedVariant?.priceDelta ?? 0);

  const handleAdd = () => {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: selectedVariant ? `${product.name} — ${selectedVariant.label}` : product.name,
        price: unitPrice,
        variant,
        image: product.images[0]?.url,
      },
      quantity,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Variant selector */}
      {product.variants.length > 1 && (
        <div>
          <p className="evidence-tag mb-3">Select Option</p>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Product variant">
            {product.variants.map((v) => (
              <button
                key={v.id}
                role="radio"
                aria-checked={variant === v.id}
                onClick={() => setVariant(v.id)}
                className={cn(
                  "glass min-w-12 rounded-md px-4 py-2 font-mono text-sm transition-all",
                  variant === v.id
                    ? "border-neon-pink/60 text-neon-pink shadow-neon-pink"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {v.label}
                {v.priceDelta ? ` (+${formatPrice(v.priceDelta)})` : ""}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity + Add */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="glass flex items-center rounded-md">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="p-3 text-muted-foreground transition-colors hover:text-neon-pink"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center font-mono" aria-live="polite">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => Math.min(99, q + 1))}
            className="p-3 text-muted-foreground transition-colors hover:text-neon-blue"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <Button size="lg" variant="gradient" onClick={handleAdd} disabled={!product.inStock} className="flex-1 sm:flex-none">
          {added ? (
            <>
              <Check className="h-5 w-5" aria-hidden="true" /> Added
            </>
          ) : (
            <>
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              {product.inStock ? `Add to Cart — ${formatPrice(unitPrice * quantity)}` : "Sold Out"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
