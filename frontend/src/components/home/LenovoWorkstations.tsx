import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Cpu } from "lucide-react";
import { SectionHeading, Eyebrow } from "@/components/ui/heading";

const LENOVO_HREF = "/products?brand=Lenovo";

export function LenovoWorkstations() {
  return (
    <section className="py-6 sm:py-8 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3 sm:mb-6">
          <div>
            <Eyebrow>Lenovo ThinkStation</Eyebrow>
            <SectionHeading size="sm" className="mt-1">
              Revolutionary Workstation Innovation
            </SectionHeading>
            <p className="mt-2 hidden max-w-xl text-sm text-muted-foreground sm:block">
              Certified performance for CAD, rendering, and AI workloads — built to outlast the upgrade cycle.
            </p>
          </div>
          <Link
            href={LENOVO_HREF}
            className="group flex items-center gap-1 text-xs font-semibold text-foreground hover:text-primary sm:text-sm"
          >
            <span className="sm:hidden">View all</span>
            <span className="hidden sm:inline">Shop All Workstations</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 sm:h-4 sm:w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:grid-rows-2">
          {/* Hero tile — chassis close-up, ships with its own gradient background */}
          <Link
            href={LENOVO_HREF}
            className="group relative flex min-h-[220px] flex-col justify-end overflow-hidden rounded-xl sm:col-span-2 sm:min-h-[320px] lg:col-span-2 lg:row-span-2"
          >
            <Image
              src="/images/bento-lenovo/blade-6-bg.png"
              alt="Lenovo ThinkStation P5 chassis close-up with front port cluster, lit against a blue-violet gradient"
              fill
              sizes="(min-width: 1024px) 50vw, (min-width: 640px) 66vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/40 to-transparent" />
            <div className="relative p-4 sm:p-8">
              <p className="text-caption font-bold uppercase tracking-widest text-lime ">
                ThinkStation P Series
              </p>
              <h3 className="mt-1 max-w-xs text-balance font-display text-lg font-semibold leading-tight text-white sm:max-w-sm sm:text-3xl">
                Precision-built for uncompromising performance
              </h3>
              <p className="mt-1.5 max-w-xs text-sm text-white/80 sm:mt-2 sm:max-w-sm">
                ISV-certified towers engineered for the most demanding workstation workloads.
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-ink transition-colors group-hover:bg-white/90 sm:mt-4">
                Shop ThinkStation
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>

          {/* CTA tile — solid brand color, no image */}
          <Link
            href={LENOVO_HREF}
            className="group flex min-h-[110px] flex-col justify-between rounded-xl bg-cyanink p-4 text-white transition-transform hover:-translate-y-0.5 sm:min-h-[140px] sm:p-5"
          >
            <Cpu className="h-5 w-5 text-white/70" strokeWidth={2} />
            <div>
              <h3 className="font-display text-base font-bold leading-tight">
                Configured for your workload
              </h3>
              <div className="mt-3 flex items-center justify-between border-t border-white/15 pt-3">
                <span className="text-sm font-semibold">Explore the range</span>
                <span className="text-sm text-white/60 transition-colors group-hover:text-lime">
                  →
                </span>
              </div>
            </div>
          </Link>

          {/* Product tile — full-bleed shot, ships with its own gradient background */}
          <Link
            href={LENOVO_HREF}
            className="group relative flex min-h-[140px] overflow-hidden rounded-xl sm:min-h-[180px]"
          >
            <Image
              src="/images/bento-lenovo/product-px.png"
              alt="Lenovo ThinkStation P5 tower at a three-quarter angle on a deep red gradient background"
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
            <div className="relative mt-auto p-4 sm:p-5">
              <h3 className="font-display text-sm font-semibold text-white sm:text-base">
                Tool-less chassis design
              </h3>
              <p className="mt-0.5 text-xs text-white/75">
                Open, upgrade, and service in seconds — no screwdriver required.
              </p>
            </div>
          </Link>

          {/* Lineup tile — transparent PNG (with its own PX/P7/P5 model labels) on a brand-navy backdrop */}
          <Link
            href={LENOVO_HREF}
            className="group flex min-h-[180px] flex-col items-center gap-2 overflow-hidden rounded-xl bg-ink p-4 transition-transform hover:-translate-y-0.5 sm:col-span-2 sm:min-h-[220px] sm:flex-row sm:gap-4 sm:p-5 lg:col-span-2 lg:p-6"
          >
            <div className="order-2 w-full sm:order-1 sm:max-w-[42%]">
              <h3 className="font-display text-base font-semibold text-white sm:text-lg">
                Three model lines, one design language
              </h3>
              <p className="mt-1 text-xs text-white/75 sm:text-sm">
                ThinkStation PX, P7 and P5 — the same tool-less build quality across every performance tier.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-lime">
                Compare models
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
            <div className="relative order-1 aspect-[1438/1298] w-4/5 shrink-0 sm:order-2 sm:w-3/5">
              <Image
                src="/images/bento-lenovo/blade-1-step-3.png"
                alt="Lenovo ThinkStation PX, P7, and P5 towers lined up side by side with model labels"
                fill
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 40vw, 80vw"
                className="object-contain transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
