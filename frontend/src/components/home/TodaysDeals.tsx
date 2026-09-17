"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading, Eyebrow } from "@/components/ui/heading";
import { ProductRail } from "./ProductRail";
import type { Product } from "@/lib/placeholder-data";

// Countdown is a UI-only flourish, not backed by real promotion/discount data.
const COUNTDOWN_SECONDS = [
  2 * 86400 + 14 * 3600 + 32 * 60,
  3 * 86400 + 10 * 3600 + 15 * 60,
  4 * 86400 + 8 * 3600 + 42 * 60,
  3 * 86400 + 6 * 3600 + 5 * 60,
  2 * 86400 + 12 * 60,
];

function formatCountdown(totalSeconds: number) {
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m`;
}

interface TodaysDealsProps {
  products: Product[];
}

export function TodaysDeals({ products }: TodaysDealsProps) {
  const [secondsLeft, setSecondsLeft] = useState(() =>
    Object.fromEntries(
      products.map((product, index) => [
        product.id,
        COUNTDOWN_SECONDS[index % COUNTDOWN_SECONDS.length],
      ]),
    ),
  );

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((current) =>
        Object.fromEntries(
          Object.entries(current).map(([key, value]) => [key, value > 0 ? value - 1 : 0]),
        ),
      );
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-14">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3 sm:mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 shrink-0 animate-pulse rounded-full bg-destructive" />
            <Eyebrow className="text-destructive">Ends soon</Eyebrow>
          </div>
          <SectionHeading className="mt-1">Today&apos;s Deals</SectionHeading>
        </div>
        <Link href="/deals" className="group flex items-center gap-1 text-xs font-semibold text-foreground hover:text-primary sm:text-sm">
          View All
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 sm:h-4 sm:w-4" />
        </Link>
      </div>

      <ProductRail
        products={products}
        countdownLabels={Object.fromEntries(
          products.map((product) => [product.id, formatCountdown(secondsLeft[product.id])]),
        )}
      />
    </section>
  );
}
