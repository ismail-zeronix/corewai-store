import Link from "next/link";
import { SectionHeading } from "@/components/ui/heading";
import { shoppableSetups } from "@/lib/placeholder-data";
import { iconMap } from "@/lib/icon-map";

const setupCategories: Record<string, string> = { s1: "kitchen-appliances", s2: "laptops", s3: "smart-tvs", s4: "smart-home", s5: "toys" };

const palette = ["bg-ink", "bg-blue", "bg-cyanink", "bg-amberink"];

export function ShoppableSetups() {
  const [large, ...small] = shoppableSetups;

  return (
    <section className="mx-auto hidden max-w-7xl px-4 py-8 sm:px-6 sm:py-10 md:block lg:px-8">
      <div className="mb-5 flex items-baseline gap-2.5">
        <SectionHeading size="sm">Shop by interest</SectionHeading>
        <span className="text-sm text-muted-foreground">
          — everything for a routine, in one tap
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SetupCard
          setup={large}
          color={palette[0]}
          className="sm:col-span-2 lg:col-span-2 lg:row-span-2"
          featured
        />
        {small.map((setup, i) => (
          <SetupCard key={setup.id} setup={setup} color={palette[(i + 1) % palette.length]} />
        ))}
      </div>
    </section>
  );
}

function SetupCard({
  setup,
  color,
  className = "",
  featured = false,
}: {
  setup: (typeof shoppableSetups)[number];
  color: string;
  className?: string;
  featured?: boolean;
}) {
  const Icon = iconMap[setup.icon];

  return (
    <Link
      href={`/category/${setupCategories[setup.id] ?? "more"}`}
      className={`group flex flex-col justify-between rounded-2xl p-5 text-white transition-transform hover:-translate-y-0.5 ${color} ${
        featured ? "min-h-[280px]" : "min-h-[140px]"
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        {Icon && <Icon className="h-4 w-4 text-white/70" strokeWidth={2} />}

      </div>

      <div>
        <h3 className={`font-display font-bold leading-tight ${featured ? "text-2xl" : "text-base"}`}>
          {setup.title}
        </h3>
        {featured && (
          <p className="mt-1.5 max-w-xs text-sm text-white/75">{setup.description}</p>
        )}
        <div className="mt-3 flex items-center justify-between border-t border-white/15 pt-3">
          <span className="text-sm font-semibold">
            Explore category
          </span>
          <span className="text-sm text-white/60 transition-colors group-hover:text-lime">→</span>
        </div>
      </div>
    </Link>
  );
}
