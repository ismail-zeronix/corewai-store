import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { promoBanners } from "@/lib/placeholder-data";

const themeStyles = {
  blue: "from-blue/90 via-blue/70 to-blue/20",
  green: "from-ink/90 via-ink/70 to-ink/20",
} as const;

export function PromoBanners() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {promoBanners.map((banner) => (
          <Link
            key={banner.id}
            href={banner.href}
            className="group relative flex min-h-[160px] items-end overflow-hidden rounded-xl sm:min-h-[220px]"
          >
            <Image
              src={banner.image}
              alt={banner.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${themeStyles[banner.theme]}`} />
            <div className="relative p-4 text-white sm:p-8">
              <p className="text-caption font-bold uppercase tracking-widest text-lime ">
                {banner.eyebrow}
              </p>
              <h3 className="mt-1 max-w-xs text-balance font-display text-base font-semibold leading-tight sm:text-xl">
                {banner.title}
              </h3>
              <p className="mt-1 text-sm text-white/85">{banner.description}</p>
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-ink transition-colors group-hover:bg-white/90 sm:mt-4">
                {banner.cta}
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
