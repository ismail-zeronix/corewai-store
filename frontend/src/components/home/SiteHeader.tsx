"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingCart, LayoutGrid } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SearchDialog } from "@/components/home/SearchDialog";
import { MobileMoreMenu } from "@/components/home/MobileMoreMenu";
import { useCart } from "@/lib/cart/cart-context";
import type { Category } from "@/lib/vendure/collections";

/**
 * Merchandising views ("Deals", "New Arrivals", "Best Sellers", "Brands") took four of
 * seven nav slots while all showing the same small catalogue. Products and Categories are
 * the two that actually change what you see; Deals earns the one price-motivated slot.
 */
const primaryNav = [
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Deals", href: "/deals" },
  { label: "New arrivals", href: "/new-arrivals" },
];

function CategoryList({
  categories,
  onNavigate,
}: {
  categories: Category[];
  onNavigate: () => void;
}) {
  return (
    <div className="flex-1 overflow-y-auto p-2">
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/category/${category.slug}`}
          onClick={onNavigate}
          className="flex min-h-11 items-center justify-between gap-3 rounded-lg px-3 text-body-sm font-medium text-ink outline-none hover:bg-cloud focus-visible:ring-2 focus-visible:ring-primary"
        >
          <span>{category.name}</span>
          {/* A real count, from the collection. The old nav advertised invented ones. */}
          <span className="text-caption tabular-nums text-muted-foreground">
            {category.productCount}
          </span>
        </Link>
      ))}
    </div>
  );
}

export function SiteHeader({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const { itemCount, isHydrated } = useCart();

  const closeCategories = () => setCategoriesOpen(false);
  const hasCategories = categories.length > 0;

  const cartBadge = isHydrated && itemCount > 0 && (
    <span
      aria-hidden="true"
      className="absolute right-0.5 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-caption font-semibold leading-none text-white"
    >
      {itemCount > 99 ? "99+" : itemCount}
    </span>
  );

  return (
    <header className="mobile-site-header sticky top-0 z-30 border-b border-mist bg-white">
      {/* Mobile: logo, search, cart, overflow menu. */}
      <div className="flex h-14 items-center gap-2 px-4 md:hidden">
        <Link
          href="/"
          aria-label="CoreWAI Supply home"
          className="flex min-h-11 items-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Image
            src="/corewai-logo.webp"
            alt="CoreWAI Supply"
            width={205}
            height={80}
            sizes="113px"
            priority
            className="h-10 w-auto object-contain"
          />
        </Link>
        <div className="ml-auto flex shrink-0 items-center gap-1">
          <SearchDialog />
          <Link
            href="/cart"
            aria-label={isHydrated ? `Cart, ${itemCount} items` : "Cart"}
            className="relative flex size-11 items-center justify-center rounded-lg text-ink outline-none hover:bg-cloud focus-visible:ring-2 focus-visible:ring-primary motion-safe:active:scale-95"
          >
            <ShoppingCart className="size-5" aria-hidden="true" />
            {cartBadge}
          </Link>
          <MobileMoreMenu compact />
        </div>
      </div>

      {/* Desktop: one row. The solid blue category bar and the auto-scrolling offer
          marquee that used to sit beneath this were the two loudest, most template-like
          elements on the page; search is now the widest thing in the header instead. */}
      <div className="mx-auto hidden h-20 max-w-7xl items-center gap-5 px-6 md:flex lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="CoreWAI Supply home"
        >
          <Image
            src="/corewai-logo.webp"
            alt="CoreWAI Supply"
            width={205}
            height={80}
            priority
            className="h-11 w-auto object-contain"
          />
        </Link>

        {hasCategories && (
          <Sheet open={categoriesOpen} onOpenChange={setCategoriesOpen}>
            <SheetTrigger className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-body-sm font-medium text-ink outline-none hover:bg-cloud focus-visible:ring-2 focus-visible:ring-primary">
              <LayoutGrid className="size-4" aria-hidden="true" />
              Categories
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader className="border-b border-mist">
                <SheetTitle>Shop by category</SheetTitle>
              </SheetHeader>
              <CategoryList categories={categories} onNavigate={closeCategories} />
            </SheetContent>
          </Sheet>
        )}

        <form
          action="/search"
          className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-lg border border-mist bg-cloud px-3 focus-within:border-primary"
        >
          <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <Input
            type="search"
            name="q"
            aria-label="Search products and brands"
            placeholder="Search products and brands"
            className="h-full border-none bg-transparent px-0 text-body-sm shadow-none focus-visible:ring-0"
          />
        </form>

        <nav aria-label="Main navigation" className="flex shrink-0 items-center gap-1">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className="rounded-lg px-3 py-2 text-body-sm font-medium text-muted-foreground outline-none hover:bg-cloud not-aria-[current=page]:hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary aria-[current=page]:font-semibold aria-[current=page]:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/cart"
          aria-label={isHydrated ? `Cart, ${itemCount} items` : "Cart"}
          className="relative flex size-11 shrink-0 items-center justify-center rounded-lg text-ink outline-none hover:bg-cloud focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ShoppingCart className="size-5" aria-hidden="true" />
          {cartBadge}
        </Link>
      </div>
    </header>
  );
}
