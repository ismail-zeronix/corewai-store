"use client";

import type { ReactNode } from "react";
import { Tabs, TabsList, TabsTab, TabsPanel } from "@/components/ui/tabs";

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
  return (
    <Tabs defaultValue="description">
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
  );
}
