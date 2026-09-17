import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { featuredCategories } from "@/lib/placeholder-data";

export function FeaturedCategories() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 sm:gap-3 lg:grid-cols-9">
        {featuredCategories.map((category) => (
          <Link key={category.slug} href={`/category/${category.slug}`} className="group">
            <Card
              size="sm"
              className="items-center gap-2 rounded-md py-2 text-center transition-all hover:-translate-y-0.5 hover:ring-primary/30 hover:shadow-md sm:py-3"
            >
              <CardContent className="flex w-full flex-col items-center gap-1.5 px-2 sm:gap-2 sm:px-3">
                <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-background">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                    sizes="(min-width: 1024px) 11vw, (min-width: 640px) 20vw, 25vw"
                  />
                </div>
                <div className="w-full">
                  <h3 className="truncate text-xs font-semibold text-foreground sm:text-sm">{category.name}</h3>
                  <p className="text-[11px] text-muted-foreground sm:text-xs">{category.itemCount}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
