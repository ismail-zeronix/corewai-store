"use client";

import { SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose, SheetDescription } from "@/components/ui/sheet";
import { useMobileOverlay } from "@/components/home/use-mobile-overlay";
import { Filters } from "@/components/plp/Filters";
import type { FacetGroup } from "@/lib/vendure/search";

interface MobileFiltersProps {
  facets: FacetGroup[];
  priceBounds: { min: number; max: number };
  activeCount: number;
}

export function MobileFilters({ facets, priceBounds, activeCount }: MobileFiltersProps) {
  const { open, setOpen } = useMobileOverlay(1024);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="flex min-h-11 shrink-0 items-center gap-2 rounded-lg border border-border bg-white px-3 text-body-sm font-medium text-foreground outline-none hover:bg-cloud focus-visible:ring-2 focus-visible:ring-primary lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
        {activeCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-caption font-semibold text-white">
            {activeCount}
          </span>
        )}
      </SheetTrigger>
      <SheetContent side="bottom" className="mobile-sheet gap-0 rounded-t-xl">
        <SheetHeader className="shrink-0 border-b border-border pr-16">
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Narrow your selection by category, brand, price and availability.</SheetDescription>
        </SheetHeader>
        <div className="min-h-0 overflow-y-auto overscroll-contain p-4">
          <Filters facets={facets} priceBounds={priceBounds} />
        </div>
        <div className="shrink-0 border-t border-border p-4">
          <SheetClose className="flex min-h-11 w-full items-center justify-center rounded-lg bg-primary px-4 text-body-sm font-semibold text-white outline-none hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">View products</SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
