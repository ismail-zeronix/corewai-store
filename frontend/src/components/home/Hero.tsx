import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-3 sm:px-6 sm:pt-4 lg:px-8 lg:pt-6">
      <div className="grid gap-3 lg:grid-cols-3 lg:gap-4">
        <Link
          href="/products"
          className="group relative flex aspect-[2/1] max-h-[220px] w-full items-end overflow-hidden rounded-xl bg-cloud md:aspect-[16/9] md:max-h-none lg:col-span-2 lg:aspect-auto lg:h-[420px] lg:rounded-3xl"
        >
          <Image
            src="/images/hero/corewai-its-products-and-service.jpg"
            alt="CoreWAI IT products and services, featuring laptops, desktops and networking equipment"
            fill
            priority
            sizes="(min-width: 1280px) 800px, (min-width: 1024px) 66vw, (min-width: 640px) calc(100vw - 48px), calc(100vw - 32px)"
            className="object-cover object-center motion-safe:transition-transform motion-safe:duration-500 md:group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
          <div className="relative p-4 max-[340px]:p-3 md:p-8 lg:p-10">
            <p className="text-xs font-bold uppercase tracking-widest text-lime">
              Tech for work and home
            </p>
            <h1 className="mt-2 max-w-md text-balance font-display text-2xl font-semibold leading-tight tracking-tight text-white max-[340px]:mt-1 max-[340px]:text-xl md:text-4xl lg:text-5xl">
              Built for the next level
            </h1>
            <span className={buttonVariants({ size: "lg", className: "mt-3 max-[340px]:mt-2 md:mt-5" })}>
              Explore products
            </span>
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
              alt="ROG Xbox Ally-KJP — Republic of Gamers in alliance with Kojima Productions"
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
