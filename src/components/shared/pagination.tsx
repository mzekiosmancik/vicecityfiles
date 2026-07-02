import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pageHref = (page: number) => (page === 1 ? basePath : `${basePath}?page=${page}`);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1,
  );

  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2">
      {currentPage > 1 && (
        <Link
          href={pageHref(currentPage - 1)}
          className="glass flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:border-neon-pink/60 hover:text-neon-pink"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      )}
      {pages.map((page, i) => {
        const prevPage = pages[i - 1];
        const gap = prevPage !== undefined && page - prevPage > 1;
        return (
          <span key={page} className="flex items-center gap-2">
            {gap && <span className="font-mono text-muted-foreground">…</span>}
            <Link
              href={pageHref(page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={cn(
                "glass flex h-9 w-9 items-center justify-center rounded-md font-mono text-sm transition-colors",
                page === currentPage
                  ? "border-neon-pink/60 text-neon-pink shadow-neon-pink"
                  : "hover:border-neon-blue/60 hover:text-neon-blue",
              )}
            >
              {page}
            </Link>
          </span>
        );
      })}
      {currentPage < totalPages && (
        <Link
          href={pageHref(currentPage + 1)}
          className="glass flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:border-neon-pink/60 hover:text-neon-pink"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </nav>
  );
}
