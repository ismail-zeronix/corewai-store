import * as React from "react"
import { cn } from "cn"

function ScrollRow({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "scrollbar-none -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1",
        "sm:-mx-6 sm:gap-4 sm:px-6",
        "lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0 lg:snap-none",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { ScrollRow }
