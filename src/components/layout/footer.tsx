import Link from "next/link";
import { NAV_LINKS, SITE, WIKI_CATEGORIES } from "@/lib/constants";

const FOOTER_LINKS = {
  Explore: NAV_LINKS.slice(1, 6).map((l) => ({ label: l.label, href: l.href })),
  Wiki: WIKI_CATEGORIES.slice(0, 5).map((c) => ({ label: c.label, href: `/wiki/${c.slug}` })),
  Community: [
    { label: "Fan Theories", href: "/community/theories" },
    { label: "Fan Art", href: "/community/fan-art" },
    { label: "Discussions", href: "/community/discussions" },
    { label: "About", href: "/about" },
  ],
} as const;

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-vice-dark/60">
      {/* neon accent line */}
      <div className="h-px bg-vice-sunset" aria-hidden="true" />
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded bg-vice-sunset font-display text-sm font-black text-white">
                VC
              </span>
              <span className="font-display text-lg font-extrabold uppercase tracking-wider">
                Vice City <span className="text-neon-pink">Files</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">{SITE.tagline}</p>
            <p className="evidence-tag mt-2">{SITE.altTagline}</p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <nav key={heading} aria-label={`Footer ${heading}`}>
              <h3 className="evidence-tag mb-4">{heading}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-neon-blue"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 border-t border-white/5 pt-8">
          <p className="mx-auto max-w-3xl text-center font-mono text-xs leading-relaxed text-muted-foreground">
            {SITE.disclaimer}
          </p>
          <p className="mt-4 text-center font-mono text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} {SITE.name} · Fan-made with neon ·{" "}
            <Link href="/feed.xml" className="hover:text-neon-blue">
              RSS
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
