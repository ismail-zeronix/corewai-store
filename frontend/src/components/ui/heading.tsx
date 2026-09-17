import * as React from "react"
import { cn } from "cn"

function SectionHeading({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"h2"> & { size?: "default" | "sm" }) {
  return (
    <h2
      className={cn(
        "font-display font-semibold tracking-normal text-foreground",
        size === "default" ? "text-lg sm:text-2xl" : "text-base sm:text-xl",
        className
      )}
      {...props}
    />
  )
}

function Eyebrow({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "text-xs font-bold uppercase tracking-widest text-primary",
        className
      )}
      {...props}
    />
  )
}

export { SectionHeading, Eyebrow }
