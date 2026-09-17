"use client";

import { useState, type FormEvent } from "react";
import { Star, MessageSquarePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ReviewForm() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  function reset() {
    setRating(0);
    setHoverRating(0);
    setTitle("");
    setBody("");
  }

  function handleClose() {
    setOpen(false);
    setSubmitted(false);
    reset();
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="w-fit gap-1.5">
        <MessageSquarePlus className="h-4 w-4" />
        Write a Review
      </Button>
    );
  }

  if (submitted) {
    return (
      <div className="w-full rounded-2xl border border-border bg-white p-4 text-sm sm:p-5">
        <p className="font-medium text-greenink">Thanks! Your review will appear after moderation.</p>
        <button
          type="button"
          onClick={handleClose}
          className="mt-2 text-xs font-semibold text-primary hover:underline"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-3 rounded-2xl border border-border bg-white p-4 sm:p-5"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">Write a Review</p>
        <button
          type="button"
          aria-label="Cancel review"
          onClick={handleClose}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-1" onMouseLeave={() => setHoverRating(0)}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            aria-label={`Rate ${star} out of 5 stars`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            className="p-0.5"
          >
            <Star
              className={cn(
                "h-5 w-5 transition-colors",
                star <= (hoverRating || rating) ? "fill-amber text-amber" : "text-mist"
              )}
            />
          </button>
        ))}
      </div>

      <input
        type="text"
        required
        placeholder="Review title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        className="h-9 rounded-lg border border-border bg-white px-2.5 text-sm outline-none focus-visible:border-primary"
      />
      <textarea
        required
        rows={3}
        placeholder="Share your experience with this product…"
        value={body}
        onChange={(event) => setBody(event.target.value)}
        className="rounded-lg border border-border bg-white px-2.5 py-2 text-sm outline-none focus-visible:border-primary"
      />

      <Button type="submit" size="sm" disabled={rating === 0} className="w-fit">
        Submit Review
      </Button>
    </form>
  );
}
