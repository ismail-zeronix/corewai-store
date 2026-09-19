"use client";

import { cn } from "@/lib/utils";
import type { ProductOptionGroup, ProductVariant } from "@/lib/placeholder-data";

interface VariantSelectorProps {
  optionGroups: ProductOptionGroup[];
  variants: ProductVariant[];
  /** Currently selected option value id per group id. */
  selected: Record<string, string>;
  onSelect: (groupId: string, optionId: string) => void;
}

/**
 * Picks the option values that identify a variant (RAM, storage, colour…).
 *
 * Renders nothing for single-variant products, which is every product in the catalogue
 * today — the option groups simply are not there yet. Before this existed, the PDP read
 * `variants[0]` unconditionally, so a product with several configurations showed one
 * price and added whichever variant happened to be first to the cart.
 *
 * A value is disabled when no in-stock variant combines it with the other current
 * selections, so you cannot navigate into a combination that does not exist.
 */
export function VariantSelector({
  optionGroups,
  variants,
  selected,
  onSelect,
}: VariantSelectorProps) {
  if (optionGroups.length === 0 || variants.length <= 1) return null;

  function isAvailable(groupId: string, optionId: string): boolean {
    // Hold the other groups' selections fixed and ask whether any variant matches.
    const required = Object.entries(selected)
      .filter(([id]) => id !== groupId)
      .map(([, value]) => value);

    return variants.some(
      (variant) =>
        variant.optionIds.includes(optionId) &&
        required.every((value) => variant.optionIds.includes(value)),
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {optionGroups.map((group) => (
        <fieldset key={group.id}>
          <legend className="mb-2 text-body-sm font-semibold text-foreground">
            {group.name}
          </legend>
          <div className="flex flex-wrap gap-2">
            {group.options.map((option) => {
              const isSelected = selected[group.id] === option.id;
              const available = isAvailable(group.id, option.id);
              return (
                <button
                  key={option.id}
                  type="button"
                  disabled={!available}
                  aria-pressed={isSelected}
                  onClick={() => onSelect(group.id, option.id)}
                  className={cn(
                    "min-h-11 rounded-lg border px-4 text-body-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary",
                    isSelected
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border bg-white text-foreground hover:border-primary/40",
                    !available && "cursor-not-allowed text-muted-foreground line-through opacity-50",
                  )}
                >
                  {option.name}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
