import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { categories } from "@/lib/placeholder-data";
import { whatsappUrl } from "@/lib/store-contact";
import { cn } from "@/lib/utils";

const shoppingLinks = [
  { label: "All products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Brands", href: "/brands" },
  { label: "Deals & offers", href: "/deals" },
  { label: "New arrivals", href: "/new-arrivals" },
  { label: "Best sellers", href: "/best-sellers" },
];

export function SiteFooter({ mobile = "full" }: { mobile?: "full" | "compact" | "hidden" }) {
  return (
    <>
      {mobile === "compact" && (
        <footer className="mt-auto border-t border-mist bg-white px-4 py-3 text-center text-xs text-muted-foreground md:hidden">
          <Link href="/products" className="inline-flex min-h-11 items-center rounded-lg px-3 font-medium text-primary">Continue shopping</Link>
          <p>© {new Date().getFullYear()} CoreWAI Supply.</p>
        </footer>
      )}
      <footer className={cn("mt-auto bg-blue text-white/80", mobile !== "full" && "hidden md:block")}>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
            <div>
              <Link href="/" aria-label="CoreWAI Supply home" className="inline-flex rounded-lg">
                <Image src="/corewai-logo.webp" alt="CoreWAI Supply" width={205} height={80} className="h-10 w-auto object-contain brightness-0 invert" />
              </Link>
              <p className="mt-3 text-sm">More Choices, A Brighter Tomorrow.</p>
              {whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-white/10 px-3 text-sm font-medium text-white hover:bg-white/20"><MessageCircle className="size-4" aria-hidden="true" />Chat with us on WhatsApp</a>}
            </div>
            <nav aria-label="Footer shopping links">
              <h2 className="mb-2 text-sm font-semibold text-white">Explore the store</h2>
              <ul>{shoppingLinks.map(({ href, label }) => <li key={href}><Link href={href} className="inline-flex min-h-11 items-center rounded-lg text-sm hover:text-white">{label}</Link></li>)}</ul>
            </nav>
            <nav aria-label="Footer categories">
              <h2 className="mb-2 text-sm font-semibold text-white">Shop by category</h2>
              <ul className="grid grid-cols-2 gap-x-4 lg:grid-cols-1">{categories.slice(0, 8).map(({ slug, name }) => <li key={slug}><Link href={`/category/${slug}`} className="inline-flex min-h-11 items-center rounded-lg text-sm hover:text-white">{name}</Link></li>)}</ul>
            </nav>
          </div>
          <p className="mt-6 border-t border-white/20 pt-5 text-xs">© {new Date().getFullYear()} CoreWAI Supply. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
