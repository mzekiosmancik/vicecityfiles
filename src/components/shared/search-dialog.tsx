"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Loader2, Package, Search, Users, X } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import type { SearchResult } from "@/types";

const TYPE_META = {
  article: { label: "News", icon: FileText, color: "text-neon-blue" },
  wiki: { label: "Wiki", icon: Users, color: "text-neon-pink" },
  product: { label: "Merch", icon: Package, color: "text-neon-orange" },
  community: { label: "Community", icon: Users, color: "text-neon-purple" },
} as const;

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 250);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      setQuery("");
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setResults([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then((res) => res.json())
      .then((data: { results: SearchResult[] }) => {
        if (!cancelled) setResults(data.results);
      })
      .catch(() => {
        if (!cancelled) setResults([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    (acc[r.type] ??= []).push(r);
    return acc;
  }, {});

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-start justify-center bg-vice-black/80 p-4 pt-[10vh] backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Global search"
        >
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="glass-strong w-full max-w-xl overflow-hidden rounded-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4">
              <Search className="h-4 w-4 shrink-0 text-neon-pink" aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && query.trim()) {
                    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                    onClose();
                  }
                }}
                placeholder="Search files, news, merch, theories…"
                className="h-14 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                aria-label="Search query"
              />
              {loading && <Loader2 className="h-4 w-4 animate-spin text-neon-blue" aria-hidden="true" />}
              <button onClick={onClose} aria-label="Close search" className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[50vh] overflow-y-auto p-2">
              {query.trim().length >= 2 && !loading && results.length === 0 && (
                <p className="p-6 text-center font-mono text-sm text-muted-foreground">
                  No files found for &quot;{query}&quot;
                </p>
              )}
              {Object.entries(grouped).map(([type, items]) => {
                const meta = TYPE_META[type as keyof typeof TYPE_META];
                return (
                  <div key={type} className="mb-2">
                    <p className="evidence-tag px-3 py-2">{meta.label}</p>
                    {items.map((result, i) => (
                      <button
                        key={`${type}-${i}`}
                        onClick={() => {
                          router.push(result.href);
                          onClose();
                        }}
                        className="flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left transition-colors hover:bg-white/5"
                      >
                        <meta.icon className={`mt-0.5 h-4 w-4 shrink-0 ${meta.color}`} aria-hidden="true" />
                        <span>
                          <span className="block text-sm font-medium">{result.title}</span>
                          <span className="block text-xs text-muted-foreground">{result.excerpt}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                );
              })}
              {query.trim().length < 2 && (
                <p className="p-6 text-center font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Type at least 2 characters to open the case files
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
