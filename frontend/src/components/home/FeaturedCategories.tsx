import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { getCategories } from "@/lib/vendure/collections";

/**
 * Image tiles, driven by real Vendure collections.
 *
 * The tile treatment is the original one; what changed is the data behind it. The old
 * version rendered a nine-entry hardcoded list ("All-in-One PC", "Mini PC", "NAS &
 * Storage"…) whose every tile linked to a page with no products. Artwork is matched by
 * slug from the existing icon set, and a collection with no matching image falls back to
 * its own featured asset.
 */
function tileImage(slug: string, fallback?: string): string | undefined {
  const known = [
    "laptops",
    "desktops",
    "monitors",
    "components",
    "networking",
    "printers",
    "accessories",
    "storage",
    "gaming",
  ];
  if (known.includes(slug)) return `/images/categories/icons/${slug}.png`;
  return fallback;
}

export async function FeaturedCategories() {
  const categories = await getCategories();
  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 section-y-tight sm:px-6 lg:px-8">
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 sm:gap-3 lg:grid-cols-9">
        {categories.map((category) => {
          const image = tileImage(category.slug, category.image);
          return (
            <Link key={category.slug} href={`/category/${category.slug}`} className="group">
              <Card
                size="sm"
                className="items-center gap-2 rounded-xl py-2 text-center transition-all hover:-translate-y-0.5 hover:shadow-elevated hover:ring-primary/30 sm:py-3"
              >
                <CardContent className="flex w-full flex-col items-center gap-1.5 px-2 sm:gap-2 sm:px-3">
                  <div className="relative aspect-square w-full overflow-hidden rounded-sm bg-white">
                    {image && (
                      <Image
                        src={image}
                        alt=""
                        fill
                        className="object-contain transition-transform duration-300 group-hover:scale-105"
                        sizes="(min-width: 1024px) 11vw, (min-width: 640px) 20vw, 25vw"
                      />
                    )}
                  </div>
                  <div className="w-full">
                    <h3 className="line-clamp-2 min-h-8 text-caption font-semibold text-foreground sm:text-body-sm">
                      {category.name}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
