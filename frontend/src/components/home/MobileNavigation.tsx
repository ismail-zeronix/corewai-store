"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart/cart-context";
import { cn } from "@/lib/utils";
import { MobileMoreMenu } from "./MobileMoreMenu";

const itemClass = "flex min-h-11 min-w-0 flex-col items-center justify-center gap-0.5 rounded-lg px-1 text-xs font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary motion-safe:active:scale-95";

export function MobileNavigation() {
  const pathname = usePathname();
  const { itemCount, isHydrated } = useCart();
  const items = [
    { label: "Home", href: "/", icon: Home, active: pathname === "/" },
    { label: "Categories", href: "/categories", icon: LayoutGrid, active: pathname === "/categories" || pathname.startsWith("/category/") },
    { label: "Cart", href: "/cart", icon: ShoppingCart, active: pathname === "/cart" || pathname === "/checkout" },
  ];

  return (
      <nav aria-label="Mobile navigation" className="mobile-bottom-nav fixed inset-x-0 bottom-0 z-50 border-t border-mist bg-white md:hidden">
        <div className="grid h-16 grid-cols-4 gap-1 px-3 py-2">
          {items.map(({ label, href, icon: Icon, active }) => (
            <Link key={href} href={href} aria-current={active ? "page" : undefined}
              aria-label={label === "Cart" && isHydrated ? `Cart, ${itemCount} items` : label}
              className={cn(itemClass, active ? "bg-blue/10 text-blue" : "text-muted-foreground hover:bg-cloud hover:text-ink")}>
              <span className="relative">
                <Icon className="size-5" aria-hidden="true" />
                {label === "Cart" && isHydrated && itemCount > 0 && (
                  <span aria-hidden="true" className="absolute -right-3 -top-1 min-w-5 rounded-full bg-lime px-1 text-center text-caption leading-5 font-semibold text-ink">{itemCount > 99 ? "99+" : itemCount}</span>
                )}
              </span>
              {label}
            </Link>
          ))}
          <MobileMoreMenu />
        </div>
      </nav>
  );
}
