import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/heading";
import { brands } from "@/lib/placeholder-data";

function BrandCard({ brand }: { brand: string }) {
  return (
    <Card
      size="sm"
      className="h-12 w-24 shrink-0 flex-row items-center justify-center py-0 transition-colors hover:ring-primary/30 hover:shadow-sm sm:h-14 sm:w-28"
    >
      <span className="font-display text-xs font-semibold text-foreground/50">
        {brand}
      </span>
    </Card>
  );
}

export function BrandStrip() {
  const row = [...brands, ...brands];

  return (
    <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="mb-2.5 flex items-end justify-between sm:mb-3">
        <div>
          <SectionHeading size="sm">Popular Brands</SectionHeading>
          <p className="mt-0.5 hidden text-sm text-muted-foreground sm:block">
            Shop from the world&apos;s most trusted brands
          </p>
        </div>
        <Link
          href="/brands"
          className="group flex items-center gap-1 text-xs font-semibold text-foreground hover:text-primary sm:text-sm"
        >
          <span className="sm:hidden">View All</span>
          <span className="hidden sm:inline">View All Brands</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 sm:h-4 sm:w-4" />
        </Link>
      </div>

      <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="flex w-max animate-marquee-slow gap-3 hover:[animation-play-state:paused]">
          {row.map((brand, index) => (
            <BrandCard key={`row-${brand}-${index}`} brand={brand} />
          ))}
        </div>
      </div>
    </section>
  );
}
