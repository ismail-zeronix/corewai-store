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
        "font-display font-semibold tracking-tight text-foreground",
        size === "default" ? "text-h2" : "text-title",
        className
      )}
      {...props}
    />
  )
}

// A quiet label for the rare case where a section needs context its heading does not
// carry (a brand name, a time limit). Deliberately not the tracked-out all-caps eyebrow
// it used to be: that treatment sat above every heading and read as decoration rather
// than information. If the label only restates the heading, delete it instead.
function Eyebrow({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-caption font-semibold text-muted-foreground", className)}
      {...props}
    />
  )
}

export { SectionHeading, Eyebrow }
