import { Star, BadgeCheck } from "lucide-react";
import { getProductReviews } from "@/lib/reviews";
import { ReviewForm } from "@/components/pdp/ReviewForm";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/placeholder-data";

interface ReviewsProps {
  product: Product;
}

const STAR_VALUES = [5, 4, 3, 2, 1] as const;

function relativeTime(daysAgo: number): string {
  if (daysAgo < 1) return "Today";
  if (daysAgo < 30) return `${daysAgo}d ago`;
  return `${Math.round(daysAgo / 30)}mo ago`;
}

export function Reviews({ product }: ReviewsProps) {
  const { average, total, breakdown, reviews } = getProductReviews(product.id, product.name);
  const roundedAverage = Math.round(average);

  return (
    <div className="flex flex-col gap-6">
      <p className="rounded-xl border border-border bg-cloud p-4 text-sm text-muted-foreground">These are sample reviews for preview purposes, not customer feedback.</p>
      <ReviewForm />

      <div className="grid grid-cols-1 gap-6 rounded-2xl border border-border bg-white p-4 sm:grid-cols-[auto_1fr] sm:p-5">
        <div className="flex flex-col items-center justify-center gap-1 sm:border-r sm:border-border sm:pr-6">
          <span className="font-display text-3xl font-bold text-foreground">{average.toFixed(1)}</span>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                key={index}
                className={cn("h-4 w-4", index < roundedAverage ? "fill-amber text-amber" : "text-mist")}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">{total} reviews</span>
        </div>

        <div className="flex flex-col justify-center gap-1.5">
          {STAR_VALUES.map((star) => (
            <div key={star} className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="w-2.5 shrink-0 text-right tabular-nums">{star}</span>
              <Star className="h-3 w-3 shrink-0 fill-amber text-amber" />
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-mist">
                <div className="h-full rounded-full bg-amber" style={{ width: `${breakdown[star]}%` }} />
              </div>
              <span className="w-8 shrink-0 text-right tabular-nums">{breakdown[star]}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col">
        {reviews.map((review) => (
          <div key={review.id} className="flex flex-col gap-1.5 border-b border-border py-4 last:border-b-0">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    className={cn("h-3.5 w-3.5", index < review.rating ? "fill-amber text-amber" : "text-mist")}
                  />
                ))}
              </div>
              {review.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-lime/20 px-2 py-0.5 text-[10px] font-semibold text-ink">
                  <BadgeCheck className="h-3 w-3" />
                  Sample review
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-foreground">{review.title}</p>
            <p className="text-sm text-muted-foreground">{review.body}</p>
            <p className="text-xs text-muted-foreground">
              {review.author} · {relativeTime(review.daysAgo)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
