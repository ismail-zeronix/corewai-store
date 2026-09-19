import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

/**
 * The previous hero overlaid a headline, an eyebrow and a CTA on top of a marketing
 * banner that already had its own headline and its own CTA baked into the pixels, so the
 * two collided at every width. It also carried two side tiles pointing at category pages
 * that returned nothing.
 *
 * This uses a clean product lineup shot instead — hardware weighted right, open space
 * left — so real type can sit in the image rather than fight it. The image is light, so
 * the headline is ink on a light wash rather than white on the usual dark scrim. The wash
 * is a flat tint sampled from the image's own left edge and carried across with one
 * horizontal fade, purely so the text keeps contrast at any crop.
 */
export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-xl bg-[#e8f1fb]">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/asus-zenbook-14.jpg"
            alt="Laptops, desktops, workstations, servers and networking hardware"
            fill
            priority
            sizes="(min-width: 1280px) 1216px, 100vw"
            className="object-cover object-[78%_center] md:object-right"
          />
          {/* The wash runs top-to-bottom on phones and left-to-right from md up, following
              where the text actually sits. A single horizontal ramp left the body copy
              lying across network switches at 390px. Long, even stops either way — a
              short ramp leaves a visible seam that reads as two images butted together. */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#e8f1fb] from-42% via-[#e8f1fb]/75 via-58% to-transparent to-76% md:bg-gradient-to-r md:from-25% md:via-[#e8f1fb]/70 md:via-45% md:to-transparent md:to-80%" />
        </div>

        <div className="relative flex min-h-[400px] flex-col justify-start p-6 sm:min-h-[440px] sm:p-10 md:justify-center lg:min-h-[480px] lg:p-14">
          <h1 className="max-w-[15ch] text-balance font-display text-display font-semibold text-ink">
            IT hardware, ready to ship
          </h1>
          <p className="mt-4 max-w-[34ch] text-body text-ink/70">
            Laptops, workstations and networking from ASUS, Lenovo, HP and Acer — with
            official UAE warranty.
          </p>
          <div className="mt-7">
            <Link href="/products" className={buttonVariants({ size: "touch" })}>
              Shop all products
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
