import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { breadcrumbJsonLd, JsonLd } from "@/lib/seo";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          ...items.map((c) => ({ name: c.label, path: c.href ?? "/" })),
        ])}
      />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground">
          <li>
            <Link href="/" className="flex items-center gap-1 transition-colors hover:text-neon-blue">
              <Home className="h-3 w-3" aria-hidden="true" />
              Home
            </Link>
          </li>
          {items.map((crumb, i) => (
            <li key={i} className="flex items-center gap-1.5">
              <ChevronRight className="h-3 w-3 text-vice-line" aria-hidden="true" />
              {crumb.href && i < items.length - 1 ? (
                <Link href={crumb.href} className="transition-colors hover:text-neon-blue">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-foreground" aria-current="page">
                  {crumb.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
