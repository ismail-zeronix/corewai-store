"use client";

import type { ReactNode } from "react";
import { Tabs, TabsList, TabsTab, TabsPanel } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

interface ProductTabsProps {
  description: ReactNode;
  specifications: ReactNode;
  reviews: ReactNode;
}

const TABS = [
  { value: "description", label: "Description" },
  { value: "specifications", label: "Specifications" },
  { value: "reviews", label: "Reviews" },
] as const;

export function ProductTabs({ description, specifications, reviews }: ProductTabsProps) {
  const content = { description, specifications, reviews };
  return (
    <>
    <Accordion defaultValue={["specifications"]} className="rounded-xl border border-mist bg-white px-3 md:hidden">
      {TABS.map((tab) => (
        <AccordionItem key={tab.value} value={tab.value}>
          <AccordionTrigger className="min-h-12 items-center font-semibold tracking-tight hover:no-underline">{tab.label}</AccordionTrigger>
          <AccordionContent className="pb-4">{content[tab.value]}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
    <Tabs defaultValue="description" className="hidden md:block">
      <TabsList>
        {TABS.map((tab) => (
          <TabsTab key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTab>
        ))}
      </TabsList>
      <TabsPanel value="description">{description}</TabsPanel>
      <TabsPanel value="specifications">{specifications}</TabsPanel>
      <TabsPanel value="reviews">{reviews}</TabsPanel>
    </Tabs>
    </>
  );
}
