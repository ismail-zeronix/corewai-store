import Link from "next/link";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams: Record<string, string | undefined>;
}

function buildHref(basePath: string, searchParams: Record<string, string | undefined>, page: number): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value) params.set(key, value);
  }
  if (page > 1) {
    params.set("page", String(page));
  }
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

function getPageNumbers(current: number, total: number): Array<number | "ellipsis"> {
  const pages = new Set<number>([1, total]);
  for (let page = current - 1; page <= current + 1; page++) {
    if (page >= 1 && page <= total) pages.add(page);
  }
  const sorted = Array.from(pages).sort((a, b) => a - b);

  const result: Array<number | "ellipsis"> = [];
  let previous = 0;
  for (const page of sorted) {
    if (previous && page - previous > 1) result.push("ellipsis");
    result.push(page);
    previous = page;
  }
  return result;
}

export function Pagination({ currentPage, totalPages, basePath, searchParams }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav aria-label="Pagination" className="mt-8 flex flex-wrap items-center justify-center gap-1.5">
      <PageLink
        href={buildHref(basePath, searchParams, currentPage - 1)}
        disabled={currentPage <= 1}
        label="Previous"
      />

      <span className="px-2 text-sm text-muted-foreground sm:hidden">Page {currentPage} of {totalPages}</span>
      {pages.map((page, index) =>
        page === "ellipsis" ? (
          <span key={`ellipsis-${index}`} className="hidden px-1.5 text-sm sm:inline text-muted-foreground">
            …
          </span>
        ) : (
          <Link
            key={page}
            href={buildHref(basePath, searchParams, page)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
            className={cn(
              "hidden h-11 min-w-11 sm:flex items-center justify-center rounded-lg border border-border bg-white px-2 text-sm font-medium text-foreground hover:bg-cloud outline-none focus-visible:ring-2 focus-visible:ring-primary",
              page === currentPage && "border-primary bg-primary text-white hover:bg-primary"
            )}
          >
            {page}
          </Link>
        )
      )}

      <PageLink
        href={buildHref(basePath, searchParams, currentPage + 1)}
        disabled={currentPage >= totalPages}
        label="Next"
      />
    </nav>
  );
}

function PageLink({ href, disabled, label }: { href: string; disabled: boolean; label: string }) {
  if (disabled) {
    return (
      <span className="flex h-11 items-center justify-center rounded-lg border border-border bg-white px-3 text-sm font-medium text-muted-foreground opacity-50">
        {label}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className="flex h-11 items-center justify-center rounded-lg border border-border bg-white px-3 text-sm font-medium text-foreground hover:bg-cloud outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {label}
    </Link>
  );
}
