import Link from "next/link";
import { Search } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeading, Eyebrow } from "@/components/ui/heading";
import { iconMap } from "@/lib/icon-map";
import { faqs, popularSearches } from "@/lib/placeholder-data";

export function FaqAndSearches() {
  return (
    <section className="bg-mist/30 py-6 sm:py-8 lg:py-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Eyebrow>Good to know</Eyebrow>
          <SectionHeading size="sm" className="mt-1">
            Frequently Asked Questions
          </SectionHeading>
          <p className="mt-2 hidden text-sm text-muted-foreground sm:block">
            Ordering electronics, appliances, and gadgets in the UAE — answered.
          </p>
        </div>

        <Accordion className="mt-5 rounded-2xl border border-border bg-white px-2 shadow-sm sm:px-4">
          {faqs.map((faq, index) => {
            const Icon = iconMap[faq.icon];
            return (
              <AccordionItem key={faq.question} value={`item-${index}`}>
                <AccordionTrigger className="gap-2.5 px-2 py-3 text-left font-display text-sm font-semibold text-foreground hover:no-underline sm:gap-3 sm:px-3 sm:py-3.5">
                  <span className="flex items-center gap-2.5 sm:gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary sm:h-8 sm:w-8">
                      {Icon && <Icon className="h-4 w-4" strokeWidth={1.75} />}
                    </span>
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-2 pl-11 text-sm text-muted-foreground sm:px-3 sm:pl-14">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        <div className="mt-8 border-t border-border pt-6">
          <div className="mb-3 flex items-center justify-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Eyebrow className="text-muted-foreground">Popular searches</Eyebrow>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {popularSearches.map((term) => (
              <Link
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="rounded-full border border-border bg-white px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary sm:text-sm"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
