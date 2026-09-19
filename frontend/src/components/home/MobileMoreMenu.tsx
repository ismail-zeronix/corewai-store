"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ArrowUpRight } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useMobileOverlay } from "./use-mobile-overlay";

const moreLinks = [
  { label: "All products", href: "/products" },
  { label: "Brands", href: "/brands" },
  { label: "Deals & offers", href: "/deals" },
  { label: "New arrivals", href: "/new-arrivals" },
  { label: "Best sellers", href: "/best-sellers" },
];

export function MobileMoreMenu({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();
  const { open, setOpen } = useMobileOverlay();
  const active = open || moreLinks.some(({ href }) => pathname === href);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger aria-label="More shopping options" className={cn(
        "flex min-h-11 min-w-11 items-center justify-center rounded-lg outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary motion-safe:active:scale-95",
        compact ? "size-11" : "flex-col gap-0.5 px-1 text-xs font-medium",
        active ? "bg-blue/10 text-blue" : "text-muted-foreground hover:bg-cloud hover:text-ink",
      )}>
        <Menu className="size-5" aria-hidden="true" />{!compact && "More"}
      </SheetTrigger>
      <SheetContent side="bottom" className="mobile-sheet gap-0 rounded-t-xl">
        <SheetHeader className="shrink-0 border-b border-mist pr-16"><SheetTitle className="font-semibold tracking-tight">Explore CoreWAI</SheetTitle></SheetHeader>
        <nav aria-label="More shopping links" className="min-h-0 overflow-y-auto overscroll-contain p-3">
          {moreLinks.map(({ label, href }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} aria-current={pathname === href ? "page" : undefined}
              className={cn("flex min-h-11 items-center justify-between rounded-lg px-3 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary motion-safe:active:scale-[0.98]", pathname === href ? "bg-blue/10 text-blue" : "text-ink hover:bg-cloud")}>
              {label}<ArrowUpRight className="size-4 text-muted-foreground" aria-hidden="true" />
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
