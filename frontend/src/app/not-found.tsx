import Link from "next/link";
import { PackageSearch } from "lucide-react";

export default function NotFound() {
  return (
    <main id="main-content" tabIndex={-1} className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-4 px-4 py-20 text-center">
      <PackageSearch className="size-10 text-primary" aria-hidden="true" />
      <p className="text-sm font-semibold text-primary">404 · Page not found</p>
      <h1 className="font-display text-2xl font-semibold">Let’s find something else</h1>
      <p className="text-sm text-muted-foreground">This page may have moved, or the product may no longer be available.</p>
      <Link href="/products" className="inline-flex min-h-11 items-center rounded-lg bg-primary px-5 text-sm font-semibold text-white">Browse products</Link>
    </main>
  );
}
