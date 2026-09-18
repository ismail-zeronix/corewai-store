"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductRail } from "./ProductRail";
import { SectionHeading, Eyebrow } from "@/components/ui/heading";
import type { Product } from "@/lib/placeholder-data";

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const tabs = [
    { label: "Featured", products },
    { label: "Best Sellers", products },
    { label: "New Arrivals", products: [...products].reverse() },
  ] as const;

  const [active, setActive] = useState<(typeof tabs)[number]["label"]>("Featured");
  const activeTab = tabs.find((tab) => tab.label === active) ?? tabs[0];

  return (
    <section className="bg-white py-6 sm:py-8 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3 sm:mb-6 sm:gap-4">
          <div>
            <Eyebrow>Featured Products</Eyebrow>
            <SectionHeading size="sm" className="mt-1">Handpicked just for you</SectionHeading>
          </div>

          <div aria-label="Product collections" className="flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-border bg-background p-1">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                type="button"
                onClick={() => setActive(tab.label)}
                aria-pressed={active === tab.label}
                className={`min-h-11 shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors sm:px-3.5 sm:py-1.5 sm:text-sm ${
                  active === tab.label
                    ? "bg-white text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <ProductRail products={activeTab.products} />

        <div className="mt-4 flex justify-center sm:hidden">
          <Link href="/products" className="group flex items-center gap-1 text-sm font-semibold text-foreground hover:text-primary">
            View all
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
