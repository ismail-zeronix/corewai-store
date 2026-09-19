import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  items: { label: string; href?: string }[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex min-w-0 flex-wrap items-center gap-1.5 text-caption text-muted-foreground"
    >
      {items.map((item, index) => (
        <span key={item.label} className="flex min-w-0 items-center gap-1.5">
          {index > 0 && <ChevronRight className="size-3 shrink-0" aria-hidden="true" />}
          {item.href ? (
            <Link href={item.href} className="inline-flex min-h-11 items-center rounded-lg hover:text-primary">
              {item.label}
            </Link>
          ) : (
            // The current page truncates: IT product names run to ~120 characters, and
            // spilling the whole thing across the breadcrumb buried the page heading.
            // The full name is still the accessible name via `title`.
            <span
              aria-current="page"
              title={item.label}
              className="block max-w-[22ch] truncate font-medium text-foreground sm:max-w-[48ch]"
            >
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
