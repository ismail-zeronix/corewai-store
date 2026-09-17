"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  Menu,
  LayoutGrid,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SearchDialog } from "@/components/home/SearchDialog";
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

const offerMessages = [
  "Flash Sale — up to 50% off Electronics",
  "Free Shipping on orders over AED 300",
  "New Arrivals dropping every week",
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
          <span className="text-xs text-muted-foreground">{category.itemCount}</span>
        </Link>
      ))}
    </div>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const { itemCount } = useCart();

  const closeMenu = () => setMenuOpen(false);
  const closeCategories = () => setCategoriesOpen(false);

  return (
    <header className="border-b border-mist bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:h-[76px] sm:gap-4 sm:px-6 lg:px-8">
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
          <button
            type="button"
            aria-label="Wishlist"
            className="hidden items-center justify-center rounded-xl p-2.5 text-ink hover:bg-cloud md:flex"
          >
            <Heart className="h-5 w-5 text-muted-foreground" />
          </button>

          <button
            type="button"
            aria-label="Account"
            className="hidden items-center justify-center rounded-xl p-2.5 text-ink hover:bg-cloud md:flex"
          >
            <User className="h-5 w-5 text-muted-foreground" />
          </button>

          <SearchDialog triggerClassName="flex items-center justify-center rounded-xl p-2.5 text-ink hover:bg-cloud md:hidden" />

          <Link
            href="/cart"
            aria-label="Cart"
            className="relative flex items-center justify-center rounded-xl p-2.5 text-ink hover:bg-cloud"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-lime text-[10px] font-bold text-ink">
                {itemCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className="flex items-center rounded-xl p-2.5 text-ink hover:bg-cloud md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="hidden bg-blue md:block">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
          <Sheet open={categoriesOpen} onOpenChange={setCategoriesOpen}>
            <button
              type="button"
              onClick={() => setCategoriesOpen(true)}
              className="flex shrink-0 items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-ink hover:bg-cloud"
            >
              <LayoutGrid className="h-4 w-4" />
              All Categories
            </button>
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

          <nav className="flex shrink-0 items-center gap-1">
            {primaryNav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium hover:bg-white/10 hover:text-white ${
                  item.label === "Deals / Offers" ? "text-lime font-semibold" : "text-white/75"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-2 hidden min-w-0 flex-1 items-center gap-2 overflow-hidden rounded-full bg-white/10 px-4 py-1.5 lg:flex">
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-lime" />
            <div className="flex min-w-0 overflow-hidden">
              <div className="flex shrink-0 animate-marquee items-center gap-10 whitespace-nowrap text-xs font-medium text-white/90">
                {[...offerMessages, ...offerMessages].map((message, index) => (
                  <span key={`${message}-${index}`}>{message}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left">
          <SheetHeader className="border-b border-mist">
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>

          <nav className="flex flex-col gap-0.5 px-2 pt-2">
            {primaryNav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMenu}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-ink hover:bg-cloud"
              >
                {item.label}
                {item.label === "Deals / Offers" && (
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-lime" />
                )}
              </Link>
            ))}
          </nav>

          <div className="mt-1 flex items-center justify-between px-3 pb-1 pt-3">
            <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Shop by Category
            </span>
          </div>
          <CategoryList onNavigate={closeMenu} />
        </SheetContent>
      </Sheet>
    </header>
  );
}
