"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight } from "lucide-react";
import { formatAed } from "@/lib/format";
import { searchProductsPreview } from "@/lib/vendure/search-actions";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/lib/placeholder-data";

interface SearchDialogProps {
  triggerClassName?: string;
}

export function SearchDialog({ triggerClassName }: SearchDialogProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setQuery("");
      setResults([]);
    }
  }

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 60);
    return () => window.clearTimeout(id);
  }, [open]);

  const trimmedQuery = query.trim();

  useEffect(() => {
    if (!trimmedQuery) return;
    const id = window.setTimeout(() => {
      startTransition(async () => {
        const data = await searchProductsPreview(trimmedQuery);
        setResults(data);
      });
    }, 200);
    return () => window.clearTimeout(id);
  }, [trimmedQuery]);

  const visibleResults = trimmedQuery ? results : [];

  function goToResults(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return;
    handleOpenChange(false);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Trigger
        aria-label="Search products"
        className={
          triggerClassName ??
          "flex items-center justify-center rounded-xl p-2.5 text-ink hover:bg-cloud"
        }
      >
        <Search className="h-5 w-5" />
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-ink/40 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <DialogPrimitive.Popup
          aria-label="Search"
          className="fixed inset-x-0 top-0 z-50 flex max-h-[80vh] flex-col overflow-hidden bg-white shadow-lg transition duration-150 ease-out data-ending-style:-translate-y-2 data-ending-style:opacity-0 data-starting-style:-translate-y-2 data-starting-style:opacity-0 sm:inset-x-auto sm:top-20 sm:left-1/2 sm:w-full sm:max-w-lg sm:-translate-x-1/2 sm:rounded-2xl"
        >
          <form
            onSubmit={(event) => {
              event.preventDefault();
              goToResults(query);
            }}
            className="flex items-center gap-2 border-b border-mist px-4 py-3"
          >
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="search"
              placeholder="Search for products, brands and more…"
              className="h-8 w-full min-w-0 border-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <DialogPrimitive.Close
              aria-label="Close search"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-cloud"
            >
              <X className="h-4 w-4" />
            </DialogPrimitive.Close>
          </form>

          <div className="flex-1 overflow-y-auto p-2">
            {!trimmedQuery && (
              <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                Start typing to search products and brands.
              </p>
            )}
            {trimmedQuery !== "" && isPending && visibleResults.length === 0 && (
              <div className="flex flex-col gap-1">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3 p-2">
                    <Skeleton className="h-11 w-11 shrink-0 rounded-lg" />
                    <span className="min-w-0 flex-1">
                      <Skeleton className="h-3.5 w-3/4 rounded-sm" />
                      <Skeleton className="mt-1.5 h-3 w-1/3 rounded-sm" />
                    </span>
                    <Skeleton className="h-3.5 w-12 shrink-0 rounded-sm" />
                  </div>
                ))}
              </div>
            )}
            {trimmedQuery !== "" && !isPending && visibleResults.length === 0 && (
              <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                No products found for &ldquo;{trimmedQuery}&rdquo;
              </p>
            )}
            {visibleResults.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                onClick={() => handleOpenChange(false)}
                className="flex items-center gap-3 rounded-xl p-2 hover:bg-cloud"
              >
                <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-cloud ring-1 ring-mist">
                  <Image src={product.image} alt="" fill sizes="44px" className="object-contain" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-foreground">
                    {product.name}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">{product.brand}</span>
                </span>
                <span className="shrink-0 text-sm font-semibold text-foreground">
                  {formatAed(product.price)}
                </span>
              </Link>
            ))}
          </div>

          {trimmedQuery !== "" && (
            <button
              type="button"
              onClick={() => goToResults(query)}
              className="flex items-center justify-center gap-1.5 border-t border-mist px-4 py-3 text-sm font-semibold text-primary hover:bg-cloud"
            >
              View all results for &ldquo;{trimmedQuery}&rdquo;
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
