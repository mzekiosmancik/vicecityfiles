import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

/**
 * Section "see all" link for phones. The header-row version is hidden below `sm`
 * because it squeezes the heading, so this one sits under the content instead.
 */
export function MobileMoreLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="mt-6 flex items-center justify-center gap-2 rounded-lg border border-white/10 py-3 font-mono text-xs uppercase tracking-widest text-neon-blue transition-colors hover:text-neon-pink sm:hidden"
    >
      {children} <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  );
}
