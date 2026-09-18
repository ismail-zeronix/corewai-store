"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { formatAed } from "@/lib/format";
import { searchProductsPreview } from "@/lib/vendure/search-actions";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/placeholder-data";
import { useMobileOverlay } from "./use-mobile-overlay";

interface SearchDialogProps {
  triggerClassName?: string;
}

export function SearchDialog({ triggerClassName }: SearchDialogProps) {
  const { open, setOpen } = useMobileOverlay();
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger aria-label="Search products" className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-lg text-ink outline-none hover:bg-cloud focus-visible:ring-2 focus-visible:ring-primary motion-safe:active:scale-95",
        triggerClassName,
      )}>
        <Search className="size-5 shrink-0" aria-hidden="true" />
      </DialogTrigger>
      <DialogContent initialFocus={inputRef}>
        <DialogTitle className="sr-only">Search products</DialogTitle>
        <SearchContent inputRef={inputRef} close={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function SearchContent({ close, inputRef }: { close: () => void; inputRef: RefObject<HTMLInputElement | null> }) {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<{ query: string; products: Product[]; error: boolean } | null>(null);
  const router = useRouter();
  const trimmedQuery = query.trim();
  const isPending = trimmedQuery !== "" && response?.query !== trimmedQuery;
  const error = !isPending && response?.error;
  const results = !isPending && !error && trimmedQuery ? response?.products ?? [] : [];

  useEffect(() => {
    if (!trimmedQuery) return;
    let cancelled = false;
    const id = window.setTimeout(async () => {
      try {
        const products = await searchProductsPreview(trimmedQuery);
        if (!cancelled) setResponse({ query: trimmedQuery, products, error: false });
      } catch {
        if (!cancelled) setResponse({ query: trimmedQuery, products: [], error: true });
      }
    }, 200);
    return () => { cancelled = true; window.clearTimeout(id); };
  }, [trimmedQuery]);

  function goToResults() {
    if (!trimmedQuery) return;
    close();
    router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  }

  return (
    <>
      <form onSubmit={(event) => { event.preventDefault(); goToResults(); }} className="flex shrink-0 items-center gap-2 border-b border-mist py-2 pl-4 pr-16">
        <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <input ref={inputRef} value={query} onChange={(event) => {
          setQuery(event.target.value);
          if (event.target.value.trim() !== trimmedQuery) setResponse(null);
        }}
          type="search" enterKeyHint="search" aria-label="Search products and brands" placeholder="Search products & brands"
          className="h-11 w-full min-w-0 rounded-md bg-transparent px-2 text-base text-ink outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary" />
      </form>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2" aria-busy={isPending}>
        <p role="status" className="sr-only">{isPending ? "Searching products" : error ? "Search unavailable" : trimmedQuery ? `${results.length} preview results` : "Start typing to search"}</p>
        {!trimmedQuery && <p className="px-3 py-8 text-center text-sm text-muted-foreground">Start typing to search products and brands.</p>}
        {isPending && <div aria-hidden="true" className="flex flex-col gap-1">{[0, 1, 2].map((index) => (
          <div key={index} className="flex items-center gap-3 p-2">
            <Skeleton className="size-11 shrink-0 rounded-lg" />
            <span className="min-w-0 flex-1"><Skeleton className="h-3.5 w-3/4 rounded-sm" /><Skeleton className="mt-1.5 h-3 w-1/3 rounded-sm" /></span>
          </div>
        ))}</div>}
        {error && trimmedQuery && <p className="px-3 py-8 text-center text-sm text-muted-foreground">Search previews are unavailable. Try again or view all results below.</p>}
        {trimmedQuery && !isPending && !error && results.length === 0 && <p className="px-3 py-8 text-center text-sm text-muted-foreground">No products found for &ldquo;{trimmedQuery}&rdquo;</p>}
        {results.map((product) => (
          <Link key={product.id} href={`/product/${product.slug}`} onClick={close} className="flex min-h-11 items-center gap-3 rounded-lg p-2 outline-none hover:bg-cloud focus-visible:ring-2 focus-visible:ring-primary motion-safe:active:scale-[0.99]">
            <span className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-cloud ring-1 ring-mist"><Image src={product.image} alt="" fill sizes="44px" className="object-contain" /></span>
            <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-ink">{product.name}</span><span className="block truncate text-xs text-muted-foreground">{product.brand}</span></span>
            <span className="shrink-0 text-sm font-semibold text-ink tabular-nums">{formatAed(product.price)}</span>
          </Link>
        ))}
      </div>
      {trimmedQuery && <button type="button" onClick={goToResults} className="flex min-h-11 shrink-0 items-center justify-center gap-2 border-t border-mist px-4 py-3 text-sm font-semibold text-blue outline-none hover:bg-cloud focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary">
        <span className="truncate">View all results for &ldquo;{trimmedQuery}&rdquo;</span><ArrowRight className="size-4 shrink-0" aria-hidden="true" />
      </button>}
    </>
  );
}
