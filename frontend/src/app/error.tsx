"use client";

import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function StoreError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <main id="main-content" tabIndex={-1} className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-4 px-4 py-20 text-center">
      <AlertCircle className="size-10 text-primary" aria-hidden="true" />
      <h1 className="font-display text-2xl font-semibold">We couldn’t load this page</h1>
      <p className="text-sm text-muted-foreground">Please try again in a moment, or return to the store.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <button type="button" onClick={retry} className="min-h-11 rounded-lg bg-primary px-5 text-sm font-semibold text-white">Try again</button>
        <Link href="/" className="inline-flex min-h-11 items-center rounded-lg border border-border bg-white px-5 text-sm font-semibold">Back to home</Link>
      </div>
    </main>
  );
}
