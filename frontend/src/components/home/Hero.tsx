import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-3 sm:px-6 sm:pt-4 lg:px-8 lg:pt-6">
      <div className="grid gap-3 lg:grid-cols-3 lg:gap-4">
        <Link
          href="/category/gaming"
          className="group relative flex aspect-[4/3] w-full items-end overflow-hidden rounded-xl bg-cloud sm:aspect-[16/9] lg:col-span-2 lg:aspect-auto lg:h-[420px] lg:rounded-3xl"
        >
          <Image
            src="/images/hero/corewai-its-products-and-service.jpg"
            alt="ROG Xbox Ally X20 Bundle — pre-order and get a free ROG Pelta gaming headset"
            fill
            priority
            sizes="(min-width: 1024px) 66vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
          <div className="relative p-4 sm:p-6 lg:p-8">
            <p className="text-[11px] font-bold uppercase tracking-widest text-lime sm:text-xs">
              Republic of Gamers
            </p>
            <h1 className="mt-1 max-w-md text-balance font-display text-lg font-semibold leading-tight text-white sm:text-2xl lg:text-3xl">
              Built for the next level
            </h1>
            <Button size="lg" className="mt-3 sm:mt-4">
              Shop ROG Xbox Ally
            </Button>
          </div>
        </Link>

        <div className="hidden lg:col-span-1 lg:flex lg:flex-col lg:gap-4">
          <Link
            href="/category/laptops"
            className="group relative h-[202px] overflow-hidden rounded-3xl bg-cloud"
          >
            <Image
              src="/images/hero/all-in-one-pc-dubai.png"
              alt="Laptops, desktops and networking gear"
              fill
              sizes="33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-foreground">
              Laptops & Desktops
            </span>
          </Link>
          <Link
            href="/category/gaming"
            className="group relative h-[202px] overflow-hidden rounded-3xl bg-cloud"
          >
            <Image
              src="/images/hero/rog-xbox-ally.jpg"
              alt="ROG Flow Z13-KJP — Republic of Gamers in alliance with Kojima Productions"
              fill
              sizes="33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-foreground">
              ROG Flow Z13
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
