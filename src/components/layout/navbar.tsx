"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Moon, Search, ShoppingCart, Sun, User, X } from "lucide-react";
import { useTheme } from "next-themes";
import { SearchDialog } from "@/components/shared/search-dialog";
import { useCart } from "@/providers/cart-provider";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { count } = useCart();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Cmd/Ctrl+K opens search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled ? "glass-strong border-b border-white/10" : "bg-transparent",
        )}
      >
        <div className="container flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2" aria-label={`${SITE.name} home`}>
            <span className="flex h-8 w-8 items-center justify-center rounded bg-vice-sunset font-display text-sm font-black text-white shadow-neon-pink">
              VC
            </span>
            <span className="hidden font-display text-lg font-extrabold uppercase tracking-wider sm:block">
              Vice City{" "}
              <span className="text-neon-pink-glow transition-all group-hover:brightness-125">Files</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            {NAV_LINKS.map((link) => {
              const base = link.href.split("?")[0];
              const active = base === "/" ? pathname === "/" : pathname.startsWith(base);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "rounded-md px-3 py-2 font-mono text-xs font-medium uppercase tracking-widest transition-colors",
                    active ? "text-neon-pink" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              className="rounded-md p-2 text-muted-foreground transition-colors hover:text-neon-blue"
              aria-label="Search (Ctrl+K)"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-md p-2 text-muted-foreground transition-colors hover:text-neon-yellow"
              aria-label="Toggle theme"
            >
              {mounted && theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            <Link
              href="/community"
              className="hidden rounded-md p-2 text-muted-foreground transition-colors hover:text-neon-purple sm:block"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </Link>
            <Link
              href="/store/cart"
              className="relative rounded-md p-2 text-muted-foreground transition-colors hover:text-neon-pink"
              aria-label={`Cart (${count} items)`}
            >
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-neon-pink px-1 font-mono text-[10px] font-bold text-white shadow-neon-pink">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="glass-strong overflow-hidden border-t border-white/10 lg:hidden"
              aria-label="Mobile navigation"
            >
              <div className="container grid gap-1 py-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="rounded-md px-3 py-2.5 font-mono text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:bg-white/5 hover:text-neon-pink"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
