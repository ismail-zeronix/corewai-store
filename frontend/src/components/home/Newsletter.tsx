import Link from "next/link";

export function Newsletter() {
  return (
    <section className="bg-ink section-y-tight">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-5 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <h2 className="font-display text-h2 font-semibold tracking-tight text-white">
            New stock, first
          </h2>
          <p className="mt-1 text-body-sm text-white/70">
            See what landed most recently at CoreWAI Supply.
          </p>
        </div>
        {/* White, not lime. Lime is reserved for price drops so it keeps its meaning;
            here it was just "the bright colour" on a dark band. */}
        <Link
          href="/new-arrivals"
          className="inline-flex min-h-11 shrink-0 items-center rounded-lg bg-white px-5 text-body-sm font-semibold text-ink hover:bg-white/90"
        >
          Shop new arrivals
        </Link>
      </div>
    </section>
  );
}
