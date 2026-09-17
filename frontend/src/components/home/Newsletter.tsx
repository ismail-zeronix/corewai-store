import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Newsletter() {
  return (
    <section className="bg-ink py-6 sm:py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 sm:flex-row sm:justify-between sm:gap-5 sm:px-6 lg:px-8">
        <div className="text-center sm:text-left">
          <h2 className="font-display text-base font-semibold text-white sm:text-xl">
            Stay Updated
          </h2>
          <p className="mt-1 text-sm text-white/75">
            Get the latest deals, new arrivals and exclusive offers.
          </p>
        </div>
        <form className="flex w-full max-w-md gap-2">
          <Input
            type="email"
            required
            placeholder="Enter your email address"
            className="h-10 border-white/20 bg-white/15 text-white placeholder:text-white/60 focus-visible:ring-white sm:h-11"
          />
          <Button type="submit" className="h-10 shrink-0 bg-lime text-ink hover:bg-lime/90 sm:h-11">
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
}
