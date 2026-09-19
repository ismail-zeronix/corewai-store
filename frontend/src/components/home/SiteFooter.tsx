import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/store-contact";
import { getCategories } from "@/lib/vendure/collections";

const shoppingLinks = [
  { label: "All products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Deals & offers", href: "/deals" },
  { label: "New arrivals", href: "/new-arrivals" },
];

/**
 * Rendered once from the root layout.
 *
 * Which mobile treatment applies used to be a `mobile` prop passed by each page — which
 * meant 24 call sites, five of them inside a single checkout component. The page-scoped
 * variants are now driven from `globals.css` off the same `.product-page` / `.cart-page`
 * / `.checkout-page` body classes that already control the mobile nav and purchase bar.
 */
export async function SiteFooter() {
  const categories = await getCategories();

  return (
    <>
      {/* Shown instead of the full footer on cart and checkout, where a tall footer
          pushes the order summary out of reach. */}
      <footer className="site-footer-compact mt-auto hidden border-t border-mist bg-white px-4 py-3 text-center text-caption text-muted-foreground">
        <Link
          href="/products"
          className="inline-flex min-h-11 items-center rounded-lg px-3 font-medium text-primary"
        >
          Continue shopping
        </Link>
        <p>© {new Date().getFullYear()} CoreWAI Supply.</p>
      </footer>

      {/* Ink, not brand blue. A full-bleed #3a4efb slab was the largest area of
          maximum-saturation colour on the site and competed with every CTA above it. */}
      <footer className="site-footer-full mt-auto bg-ink text-white/70">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
            <div>
              <Link href="/" aria-label="CoreWAI Supply home" className="inline-flex rounded-lg">
                <Image
                  src="/corewai-logo.webp"
                  alt="CoreWAI Supply"
                  width={205}
                  height={80}
                  className="h-10 w-auto object-contain brightness-0 invert"
                />
              </Link>
              <p className="mt-4 max-w-xs text-body-sm">More choices, a brighter tomorrow.</p>
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg bg-white/10 px-4 text-body-sm font-medium text-white hover:bg-white/20"
                >
                  <MessageCircle className="size-4" aria-hidden="true" />
                  Chat with us on WhatsApp
                </a>
              )}
            </div>

            <nav aria-label="Footer shopping links">
              <h2 className="mb-1 text-body-sm font-semibold text-white">Explore the store</h2>
              <ul>
                {shoppingLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="inline-flex min-h-11 items-center rounded-lg text-body-sm hover:text-white"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Real collections. This column used to list eight hardcoded categories
                whose pages returned nothing. */}
            {categories.length > 0 && (
              <nav aria-label="Footer categories">
                <h2 className="mb-1 text-body-sm font-semibold text-white">Shop by category</h2>
                <ul className="grid grid-cols-2 gap-x-4 lg:grid-cols-1">
                  {categories.slice(0, 8).map(({ slug, name }) => (
                    <li key={slug}>
                      <Link
                        href={`/category/${slug}`}
                        className="inline-flex min-h-11 items-center rounded-lg text-body-sm hover:text-white"
                      >
                        {name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>

          <p className="mt-10 border-t border-white/15 pt-6 text-caption">
            © {new Date().getFullYear()} CoreWAI Supply. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
