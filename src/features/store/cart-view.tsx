"use client";

import { useState } from "react";
import Link from "next/link";
import { CreditCard, Loader2, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/providers/cart-provider";
import { formatPrice } from "@/lib/utils";

export function CartView() {
  const { items, subtotal, removeItem, updateQuantity } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ slug: i.slug, variant: i.variant, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Checkout failed.");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed.");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="glass mx-auto max-w-lg rounded-lg p-12 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-neon-pink/50" aria-hidden="true" />
        <h2 className="mt-4 font-display text-xl font-bold uppercase">Your stash is empty</h2>
        <p className="mt-2 text-sm text-muted-foreground">Nothing in the evidence bag yet.</p>
        <Button asChild variant="gradient" className="mt-6">
          <Link href="/store">Browse the Store</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={`${item.productId}-${item.variant}`} className="glass flex items-center gap-4 rounded-lg p-4">
            <div className="h-16 w-16 shrink-0 rounded-md bg-gradient-to-br from-neon-purple/40 to-vice-black" />
            <div className="min-w-0 flex-1">
              <Link href={`/store/${item.slug}`} className="font-display font-bold hover:text-neon-pink">
                {item.name}
              </Link>
              <p className="font-mono text-sm text-neon-blue">{formatPrice(item.price)}</p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variant)}
                className="glass rounded p-1.5 text-muted-foreground hover:text-neon-pink"
                aria-label={`Decrease quantity of ${item.name}`}
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-8 text-center font-mono text-sm">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variant)}
                className="glass rounded p-1.5 text-muted-foreground hover:text-neon-blue"
                aria-label={`Increase quantity of ${item.name}`}
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <button
              onClick={() => removeItem(item.productId, item.variant)}
              className="p-2 text-muted-foreground transition-colors hover:text-destructive"
              aria-label={`Remove ${item.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>

      <aside className="glass h-fit rounded-lg p-6 lg:sticky lg:top-24">
        <h2 className="font-display text-lg font-bold uppercase tracking-wide">Order Summary</h2>
        <Separator className="my-4" />
        <div className="flex justify-between font-mono text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="mt-2 flex justify-between font-mono text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="text-neon-green">Calculated at checkout</span>
        </div>
        <Separator className="my-4" />
        <div className="flex justify-between font-display text-lg font-bold">
          <span>Total</span>
          <span className="text-neon-blue">{formatPrice(subtotal)}</span>
        </div>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
        <Button variant="gradient" size="lg" className="mt-6 w-full" onClick={handleCheckout} disabled={loading}>
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <CreditCard className="h-5 w-5" aria-hidden="true" />}
          {loading ? "Opening Stripe…" : "Checkout with Stripe"}
        </Button>
        <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Secure payment via Stripe Checkout
        </p>
      </aside>
    </div>
  );
}
