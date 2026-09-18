import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbProps {
  items: { label: string; href?: string }[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
      {items.map((item, index) => (
        <span key={item.label} className="flex min-w-0 items-center gap-1.5">
          {index > 0 && <ChevronRight className="h-3 w-3 shrink-0" aria-hidden="true" />}
          {item.href ? (
            <Link href={item.href} className="inline-flex min-h-11 items-center rounded-md hover:text-primary">
              {item.label}
            </Link>
          ) : (
            <span aria-current="page" className="break-words font-medium text-foreground">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
