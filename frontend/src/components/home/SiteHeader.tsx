"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  ShoppingCart,
  LayoutGrid,
  ArrowRight,
} from "lucide-react";
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
import { categories } from "@/lib/placeholder-data";
import { useCart } from "@/lib/cart/cart-context";

const primaryNav = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Brands", href: "/brands" },
  { label: "Deals / Offers", href: "/deals" },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Best Sellers", href: "/best-sellers" },
];

function CategoryList({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="flex-1 overflow-y-auto px-2 py-2">
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/category/${category.slug}`}
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-medium text-ink hover:bg-cloud"
        >
          <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-cloud ring-1 ring-mist">
            <Image src={category.image} alt="" fill sizes="40px" className="object-cover" />
          </span>
          <span className="flex-1">{category.name}</span>

        </Link>
      ))}
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const { itemCount, isHydrated } = useCart();

  const closeCategories = () => setCategoriesOpen(false);

  return (
    <header className="mobile-site-header sticky top-0 z-30 border-b border-mist bg-white md:static md:z-auto">
      <div className="flex h-14 items-center justify-between gap-3 px-4 md:hidden">
        <Link href="/" aria-label="CoreWAI Supply home" className="flex min-h-11 items-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <Image src="/corewai-logo.webp" alt="CoreWAI Supply" width={205} height={80} sizes="113px" priority className="h-11 w-auto object-contain" />
        </Link>
        <div className="ml-auto flex shrink-0 items-center gap-1">
          <SearchDialog />
          <Link href="/cart" aria-label={isHydrated ? `Cart, ${itemCount} items` : "Cart"} className="relative flex size-11 items-center justify-center rounded-lg text-ink outline-none hover:bg-cloud focus-visible:ring-2 focus-visible:ring-primary motion-safe:active:scale-95">
            <ShoppingCart className="size-5" aria-hidden="true" />
            {isHydrated && itemCount > 0 && <span aria-hidden="true" className="absolute right-0 top-0.5 min-w-5 rounded-full bg-lime px-1 text-center text-caption font-semibold leading-5 text-ink">{itemCount > 99 ? "99+" : itemCount}</span>}
          </Link>
          <MobileMoreMenu compact />
        </div>
      </div>
      <div className="mx-auto hidden h-14 max-w-7xl md:flex items-center gap-3 px-4 sm:h-[76px] sm:gap-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center" aria-label="CoreWAI Supply home">
          <Image
            src="/corewai-logo.webp"
            alt="CoreWAI Supply"
            width={205}
            height={80}
            className="h-8 w-auto object-contain sm:h-13 lg:h-15"
            priority
          />
        </Link>

        <div className="hidden flex-1 items-center justify-center md:flex">
          <form action="/search" className="flex w-full max-w-xl items-center rounded-full border border-mist bg-cloud pl-4 pr-1.5 focus-within:border-blue">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <Input
              type="search"
              name="q"
              aria-label="Search products and brands"
              placeholder="Search for products, brands and more…"
              className="h-10 border-none bg-transparent text-sm shadow-none focus-visible:ring-0"
            />
            <button
              type="submit"
              className="hidden shrink-0 rounded-full bg-blue px-5 py-2 text-sm font-semibold text-white hover:bg-blue/90 sm:block"
            >
              Search
            </button>
          </form>
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Link
            href="/cart"
            aria-label={isHydrated ? `Cart, ${itemCount} items` : "Cart"}
            className="relative flex items-center justify-center rounded-xl p-2.5 text-ink hover:bg-cloud"
          >
            <ShoppingCart className="h-5 w-5" />
            {isHydrated && itemCount > 0 && (
              <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-lime px-1 text-caption font-bold text-ink">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className="hidden border-t border-mist md:block">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
          <Sheet open={categoriesOpen} onOpenChange={setCategoriesOpen}>
            <SheetTrigger
              className="flex shrink-0 items-center gap-2 rounded-full border border-border px-4 py-1.5 text-sm font-semibold text-ink hover:bg-cloud"
            >
              <LayoutGrid className="h-4 w-4" />
              All Categories
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader className="border-b border-mist">
                <SheetTitle>All Categories</SheetTitle>
              </SheetHeader>
              <CategoryList onNavigate={closeCategories} />
              <div className="border-t border-mist p-4">
                <Link
                  href="/categories"
                  onClick={closeCategories}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-cloud py-2.5 text-sm font-semibold text-blue hover:bg-mist"
                >
                  Browse All Categories
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </SheetContent>
          </Sheet>

          <nav aria-label="Main navigation" className="scrollbar-none flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
            {primaryNav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className="shrink-0 rounded-full px-3.5 py-2.5 text-sm font-medium text-foreground/75 hover:bg-cloud not-aria-[current=page]:hover:text-foreground aria-[current=page]:bg-cloud aria-[current=page]:font-semibold aria-[current=page]:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
