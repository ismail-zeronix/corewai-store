"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, X } from "lucide-react";

export interface CartNotification {
  id: number;
  name: string;
  quantity: number;
}

export function CartToast({ notification, onDismiss }: {
  notification: CartNotification;
  onDismiss: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (hovered || focused) return;
    const timer = window.setTimeout(onDismiss, 5000);
    return () => window.clearTimeout(timer);
  }, [hovered, focused, onDismiss]);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
      className="pointer-events-auto flex items-start gap-3 rounded-xl border border-mist bg-white p-3 text-ink shadow-lg motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-2"
    >
      <span className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-full bg-lime">
        <Check className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1 pt-1">
        <p className="text-sm font-semibold">Added to cart</p>
        <p className="mt-0.5 line-clamp-2 break-words text-sm text-muted-foreground">
          {notification.quantity} × {notification.name}
        </p>
        <Link href="/cart" onClick={onDismiss}
          className="mt-1 inline-flex min-h-11 items-center rounded-lg px-2 text-sm font-semibold text-primary outline-none hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-primary">
          View cart
        </Link>
      </div>
      <button type="button" onClick={onDismiss} aria-label="Dismiss cart notification"
        className="flex size-11 shrink-0 items-center justify-center rounded-lg text-muted-foreground outline-none hover:bg-cloud focus-visible:ring-2 focus-visible:ring-primary">
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
