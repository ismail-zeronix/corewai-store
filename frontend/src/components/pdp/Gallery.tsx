"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface GalleryProps {
  images: string[];
  alt: string;
}

export function Gallery({ images, alt }: GalleryProps) {
  const [active, setActive] = useState(0);
  const track = useRef<HTMLDivElement>(null);

  function showImage(index: number) {
    const element = track.current;
    if (!element) return;
    element.scrollTo({ left: element.clientWidth * index, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  return (
    <section aria-label="Product images" aria-roledescription="carousel" className="min-w-0">
      <div ref={track} tabIndex={0} aria-label="Swipe to browse product images"
        onScroll={(event) => {
          const element = event.currentTarget;
          setActive(Math.max(0, Math.min(images.length - 1, Math.round(element.scrollLeft / element.clientWidth))));
        }}
        className="scrollbar-none -mx-4 flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain border-y border-mist bg-white outline-none focus-visible:ring-2 focus-visible:ring-primary md:mx-0 md:rounded-xl md:border">
        {images.map((src, index) => (
          <div key={`${src}-${index}`} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${images.length}`} className="relative aspect-[4/3] w-full shrink-0 snap-center md:aspect-square">
            <Image src={src} alt={`${alt}${images.length > 1 ? ` — view ${index + 1}` : ""}`} fill priority={index === 0} className="object-contain p-4 md:p-6" sizes="(min-width: 1024px) 45vw, 100vw" />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <>
          <div className="scrollbar-none flex items-center justify-between gap-2 overflow-x-auto md:hidden">
            <div className="flex items-center" aria-label="Choose product image">
              {images.map((src, index) => (
                <button key={`${src}-${index}`} type="button" aria-label={`View image ${index + 1}`} aria-current={index === active ? "true" : undefined} onClick={() => showImage(index)}
                  className="flex size-11 shrink-0 items-center justify-center rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  <span className={cn("h-1.5 rounded-full motion-safe:transition-all", index === active ? "w-4 bg-primary" : "w-1.5 bg-mist")} />
                </button>
              ))}
            </div>
            <span className="shrink-0 text-xs text-muted-foreground tabular-nums">{active + 1} / {images.length}</span>
          </div>
          <div className="scrollbar-none mt-3 hidden gap-2 overflow-x-auto p-1 md:flex">
            {images.map((src, index) => (
              <button key={`${src}-${index}`} type="button" onClick={() => showImage(index)} aria-label={`View image ${index + 1}`} aria-current={index === active ? "true" : undefined}
                className={cn("relative size-16 shrink-0 overflow-hidden rounded-lg bg-white ring-1 outline-none focus-visible:ring-2 focus-visible:ring-primary", index === active ? "ring-2 ring-primary" : "ring-border hover:ring-primary/40")}>
                <Image src={src} alt="" fill className="object-contain p-1.5" sizes="64px" />
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
