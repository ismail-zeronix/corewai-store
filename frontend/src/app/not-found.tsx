import type { Metadata } from "next";
import Link from "next/link";
import { PackageSearch } from "lucide-react";

/**
 * Routes that call `notFound()` sit behind a `loading.tsx`, so Next streams the loading
 * shell — and a 200 — before the not-found decision is reached. The status cannot be
 * changed after that first flush, which makes these soft 404s. `noindex` is what stops a
 * crawler treating them as real pages; dropping the sibling `loading.tsx` files would
 * restore a hard 404 at the cost of the skeletons.
 */
export const metadata: Metadata = {
  title: "Page not found — CoreWAI Supply",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-4 px-4 py-20 text-center"
    >
      <PackageSearch className="size-10 text-primary" aria-hidden="true" />
      <p className="text-body-sm font-semibold text-primary">404 · Page not found</p>
      <h1 className="font-display text-h1 font-semibold tracking-tight">
        Let’s find something else
      </h1>
      <p className="text-body-sm text-muted-foreground">
        This page may have moved, or the product may no longer be available.
      </p>
      <Link
        href="/products"
        className="mt-2 inline-flex min-h-11 items-center rounded-lg bg-primary px-5 text-body-sm font-semibold text-white hover:bg-primary/90"
      >
        Browse products
      </Link>
    </main>
  );
}
