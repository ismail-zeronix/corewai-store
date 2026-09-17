"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Filters } from "@/components/plp/Filters";

interface MobileFiltersProps {
  brands: string[];
  priceBounds: { min: number; max: number };
  activeCount: number;
}

export function MobileFilters({ brands, priceBounds, activeCount }: MobileFiltersProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-9 items-center gap-1.5 rounded-lg border border-border bg-white px-3 text-sm font-medium text-foreground hover:bg-cloud lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4" />
        Filters
        {activeCount > 0 && (
          <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white">
            {activeCount}
          </span>
        )}
      </button>
      <SheetContent side="left" className="overflow-y-auto">
        <SheetHeader className="border-b border-border">
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="px-4 pb-6">
          <Filters brands={brands} priceBounds={priceBounds} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
