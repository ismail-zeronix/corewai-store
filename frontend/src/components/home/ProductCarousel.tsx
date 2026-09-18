"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { SectionHeading, Eyebrow } from "@/components/ui/heading";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/placeholder-data";

interface ProductCarouselProps {
  products: Product[];
}

export function ProductCarousel({ products }: ProductCarouselProps) {
  if (products.length === 0) return null;

  return (
    <section className="bg-white py-6 sm:py-8 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3 sm:mb-6">
          <div>
            <Eyebrow>More To Explore</Eyebrow>
            <SectionHeading size="sm" className="mt-1">
              Recommended For You
            </SectionHeading>
          </div>
          <Link
            href="/products"
            className="group flex items-center gap-1 text-xs font-semibold text-foreground hover:text-primary sm:text-sm"
          >
            <span className="sm:hidden">View All</span>
            <span className="hidden sm:inline">View All Products</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 sm:h-4 sm:w-4" />
          </Link>
        </div>

        <Carousel
          opts={{ align: "start", loop: true }}
          className="px-1"
        >
          <CarouselContent>
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className="basis-[40%] sm:basis-1/3 md:basis-1/4 lg:basis-1/6"
              >
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-3 size-11 hidden lg:flex" />
          <CarouselNext className="-right-3 size-11 hidden lg:flex" />
        </Carousel>
      </div>
    </section>
  );
}
