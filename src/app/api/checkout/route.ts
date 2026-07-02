import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { getProductBySlug } from "@/services/woocommerce";
import { absoluteUrl } from "@/lib/utils";

/**
 * Stripe Checkout session creation.
 * Prices are ALWAYS resolved server-side from the product catalog —
 * client-supplied prices are never trusted (OWASP: broken access control).
 */

interface CheckoutRequestItem {
  slug: string;
  variant?: string;
  quantity: number;
}

export async function POST(request: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "Payments are not configured. Set STRIPE_SECRET_KEY." },
      { status: 503 },
    );
  }

  let body: { items?: CheckoutRequestItem[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const items = body.items;
  if (!Array.isArray(items) || items.length === 0 || items.length > 30) {
    return NextResponse.json({ error: "Cart must contain 1-30 items." }, { status: 400 });
  }

  const stripe = new Stripe(secretKey);
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  for (const item of items) {
    if (typeof item.slug !== "string" || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) {
      return NextResponse.json({ error: "Invalid cart item." }, { status: 400 });
    }

    const product = await getProductBySlug(item.slug);
    if (!product || !product.inStock) {
      return NextResponse.json({ error: `Product unavailable: ${item.slug}` }, { status: 400 });
    }

    const variant = item.variant ? product.variants.find((v) => v.id === item.variant) : undefined;
    const unitPrice = product.price + (variant?.priceDelta ?? 0);

    lineItems.push(
      product.stripePriceId
        ? { price: product.stripePriceId, quantity: item.quantity }
        : {
            quantity: item.quantity,
            price_data: {
              currency: product.currency.toLowerCase(),
              unit_amount: Math.round(unitPrice * 100),
              product_data: {
                name: variant ? `${product.name} — ${variant.label}` : product.name,
                metadata: { slug: product.slug },
              },
            },
          },
    );
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${absoluteUrl("/store/success")}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: absoluteUrl("/store/cart"),
      shipping_address_collection: { allowed_countries: ["US", "CA", "GB", "AU", "DE", "FR", "NL", "SE"] },
      automatic_tax: { enabled: false },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[stripe]", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Unable to create checkout session." }, { status: 500 });
  }
}
