"use client";

import { useState } from "react";
import { X } from "lucide-react";

const offerMessages = [
  "Flash Sale — up to 50% off Electronics",
  "Free Shipping on orders over AED 300",
];

export function PromoStrip() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="flex items-center justify-center gap-3 bg-ink px-4 py-2 text-center text-xs font-medium text-white">
      <p className="min-w-0 truncate">{offerMessages.join("  ·  ")}</p>
      <button
        type="button"
        aria-label="Dismiss offer message"
        onClick={() => setDismissed(true)}
        className="flex size-6 shrink-0 items-center justify-center rounded-full outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/60"
      >
        <X className="size-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}
