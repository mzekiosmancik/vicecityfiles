"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/providers/cart-provider";

export default function CheckoutSuccessPage() {
  const { clear } = useCart();

  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center pt-24 text-center">
      <CheckCircle2 className="h-16 w-16 text-neon-green" aria-hidden="true" />
      <p className="evidence-tag mt-6">Transaction Complete</p>
      <h1 className="mt-3 font-display text-4xl font-black uppercase tracking-tight">
        <span className="gradient-text">Order Confirmed</span>
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        Your receipt is on its way to your inbox. The package ships in 3–7 business days. Welcome to the file.
      </p>
      <div className="mt-8 flex gap-4">
        <Button asChild variant="gradient">
          <Link href="/store">Keep Shopping</Link>
        </Button>
        <Button asChild variant="outline-blue">
          <Link href="/">Back to HQ</Link>
        </Button>
      </div>
    </div>
  );
}
