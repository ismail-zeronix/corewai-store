import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Newsletter() {
  return (
    <section className="bg-ink py-6 sm:py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <h2 className="font-display text-lg font-semibold text-white sm:text-xl">Discover something new</h2>
          <p className="mt-1 text-sm text-white/75">Explore the latest additions to CoreWAI Supply.</p>
        </div>
        <Link href="/new-arrivals" className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg bg-lime px-5 text-sm font-semibold text-ink hover:bg-lime/90">Shop new arrivals<ArrowRight className="size-4" aria-hidden="true" /></Link>
      </div>
    </section>
  );
}
