import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Apple, PlaySquare, X } from "lucide-react";
import { categories } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";

const columns = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "Products", href: "/products" },
      { label: "Categories", href: "/categories" },
      { label: "Brands", href: "/brands" },
      { label: "Deals / Offers", href: "/deals" },
      { label: "New Arrivals", href: "/new-arrivals" },
      { label: "Best Sellers", href: "/best-sellers" },
    ],
  },
  {
    title: "Customer Service",
    links: [
      { label: "Help Center", href: "/support" },
      { label: "Track Order", href: "/track-order" },
      { label: "Returns & Refunds", href: "/returns" },
      { label: "Shipping Info", href: "/shipping" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "About Us",
    links: [
      { label: "About CoreWAI", href: "/about" },
      { label: "Our Story", href: "/about#story" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
    ],
  },
];

const socialLinks = [
  { label: "Facebook", initials: "F", href: "https://facebook.com" },
  { label: "Instagram", initials: "IG", href: "https://instagram.com" },
  { label: "YouTube", initials: "YT", href: "https://youtube.com" },
  { label: "TikTok", initials: "TT", href: "https://tiktok.com" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Sitemap", href: "/sitemap" },
];

export function SiteFooter({ mobile = "full" }: { mobile?: "full" | "compact" | "hidden" }) {
  return (
    <>
    {mobile === "compact" && (
      <footer className="mt-auto border-t border-mist bg-white px-4 py-4 text-xs text-muted-foreground md:hidden">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <a href="https://wa.me/971500000000" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-1.5 rounded-md text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <MessageCircle className="size-4" aria-hidden="true" />Need help?
          </a>
          {legalLinks.slice(0, 2).map((link) => <Link key={link.href} href={link.href} className="inline-flex min-h-11 items-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary">{link.label}</Link>)}
        </div>
      </footer>
    )}
    <footer className={cn("mt-auto bg-blue text-white/70", mobile !== "full" && "hidden md:block")}>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid grid-cols-2 gap-5 sm:gap-6 sm:grid-cols-4">
          <div className="col-span-2">
            <Image
              src="/corewai-logo.webp"
              alt="CoreWAI Supply"
              width={205}
              height={80}
              className="h-8 w-auto object-contain brightness-0 invert sm:h-9"
            />
            <p className="mt-2.5 max-w-xs text-sm sm:mt-3">More Choices, A Brighter Tomorrow.</p>

            <a
              href="https://wa.me/971500000000"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/15 sm:mt-4"
            >
              <MessageCircle className="h-4 w-4 text-green" />
              Chat with us on WhatsApp
            </a>

            <div className="mt-3 flex items-center gap-2 sm:mt-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-xs font-semibold text-white/80 hover:border-white/50 hover:text-white"
                >
                  {social.initials}
                </a>
              ))}
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/80 hover:border-white/50 hover:text-white"
              >
                <X className="h-4 w-4" />
              </a>
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="mb-2.5 text-sm font-semibold text-white sm:mb-3">{column.title}</h3>
              <ul className="space-y-1.5 text-sm sm:space-y-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-5 border-t border-white/15 pt-5 sm:mt-6 sm:pt-6">
          <h3 className="mb-2.5 text-sm font-semibold text-white sm:mb-3">Shop by Category</h3>
          <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-sm sm:gap-x-4 sm:gap-y-2">
            {categories.map((category) => (
              <Link key={category.slug} href={`/category/${category.slug}`} className="hover:text-white">
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-5 border-t border-white/15 pt-5 sm:mt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:pt-6">
          <div className="flex flex-wrap gap-3">
            <a
              href="#"
              className="flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm hover:border-white/50 hover:text-white"
            >
              <Apple className="h-5 w-5" />
              <span>
                <span className="block text-[10px] leading-none text-white/50">Download on the</span>
                <span className="block text-sm font-semibold leading-tight text-white">App Store</span>
              </span>
            </a>
            <a
              href="#"
              className="flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm hover:border-white/50 hover:text-white"
            >
              <PlaySquare className="h-5 w-5" />
              <span>
                <span className="block text-[10px] leading-none text-white/50">Get it on</span>
                <span className="block text-sm font-semibold leading-tight text-white">Google Play</span>
              </span>
            </a>
          </div>

          <div className="flex items-center gap-4 text-xs">
            {legalLinks.map((link) => (
              <Link key={link.label} href={link.href} className="hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <p className="mt-5 border-t border-white/15 pt-5 text-center text-xs sm:text-left">
          © {new Date().getFullYear()} CoreWAI Supply. All rights reserved.
        </p>
      </div>
    </footer>
    </>
  );
}
