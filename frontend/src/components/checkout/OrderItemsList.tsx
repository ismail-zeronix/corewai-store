import Image from "next/image";
import { formatAed } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CartItem } from "@/lib/cart/cart-context";

interface OrderItemsListProps {
  items: CartItem[];
  className?: string;
}

export function OrderItemsList({ items, className }: OrderItemsListProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-3">
          <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-cloud ring-1 ring-border">
            <Image src={item.image} alt={item.name} fill sizes="48px" className="object-contain p-1" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-foreground">{item.name}</span>
            <span className="block text-xs text-muted-foreground">× {item.quantity}</span>
          </span>
          <span className="shrink-0 text-sm font-semibold text-foreground tabular-nums">
            {formatAed(item.price * item.quantity)}
          </span>
        </div>
      ))}
    </div>
  );
}
