import { ShieldCheck, Truck, Lock, RotateCcw } from "lucide-react";

const items = [
  { icon: ShieldCheck, title: "100% Genuine", subtitle: "Authentic & branded" },
  { icon: Truck, title: "Fast Delivery", subtitle: "Across the UAE" },
  { icon: Lock, title: "Secure Payments", subtitle: "Cards, Tabby & Tamara" },
  { icon: RotateCcw, title: "Easy Returns", subtitle: "Within 7 days" },
];

export function TrustStrip() {
  return (
    <section className="mt-3 border-y border-mist bg-white sm:mt-6">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-mist px-4 sm:grid-cols-4 sm:divide-x sm:px-6 lg:px-8">
        {items.map(({ icon: Icon, title, subtitle }, i) => (
          <div
            key={title}
            className={`flex items-center gap-2.5 py-3 sm:justify-center sm:px-4 sm:py-6 ${
              i % 2 === 0 ? "pr-3" : "pl-3 sm:pl-0"
            } ${i < 2 ? "border-b border-mist sm:border-b-0" : ""}`}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 sm:h-9 sm:w-9">
              <Icon className="h-4 w-4 text-blue sm:h-5 sm:w-5" strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-xs font-semibold leading-tight text-ink sm:text-sm">{title}</p>
              <p className="text-[11px] leading-tight text-muted-foreground sm:text-xs">{subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
