import type { Metadata } from "next";
import Link from "next/link";
import { WhatsAppButton } from "@/components/home/WhatsAppButton";
import { Breadcrumb } from "@/components/plp/Breadcrumb";
import { categories } from "@/lib/placeholder-data";
import { iconMap } from "@/lib/icon-map";

export const metadata: Metadata = {
  title: "All Categories — CoreWAI Supply",
  description: "Browse every category at CoreWAI Supply — electronics, home & kitchen, and lifestyle gadgets.",
};

export default function CategoriesPage() {
  return (
    <>
      <main id="main-content" tabIndex={-1} className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Categories" }]} />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <h1 className="mb-6 font-display text-xl font-semibold text-foreground sm:text-2xl">
            All Categories
          </h1>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {categories.map((category) => {
              const Icon = iconMap[category.icon];
              return (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  className="group flex flex-col items-center gap-2.5 rounded-xl border border-border bg-white p-5 text-center transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elevated"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-xl bg-mist transition-colors group-hover:bg-gradient-to-br group-hover:from-blue group-hover:to-cyan">
                    {Icon && (
                      <Icon
                        className="h-7 w-7 text-primary transition-colors group-hover:text-white"
                        strokeWidth={1.75}
                      />
                    )}
                  </span>
                  <span className="text-sm font-semibold leading-tight text-foreground">{category.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      <WhatsAppButton />
    </>
  );
}
