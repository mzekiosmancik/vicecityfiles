import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SectionHeading } from "@/components/shared/section-heading";
import { CartView } from "@/features/store/cart-view";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Your Cart",
  description: "Review your Vice City Files merch order and check out securely with Stripe.",
  path: "/store/cart",
  noIndex: true,
});

export default function CartPage() {
  return (
    <div className="container pt-28">
      <Breadcrumbs items={[{ label: "Store", href: "/store" }, { label: "Cart" }]} />
      <SectionHeading eyebrow="Evidence Bag" title="Your Cart" />
      <CartView />
    </div>
  );
}
