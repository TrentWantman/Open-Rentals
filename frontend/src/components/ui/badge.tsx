import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-all duration-200 overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-sky-300/50 bg-sky-100/60 text-sky-700 shadow-[0_1px_3px_rgba(56,189,248,0.1)]",
        secondary:
          "border-gray-200/60 bg-gray-100/60 text-gray-600",
        destructive:
          "border-red-300/50 bg-red-100/60 text-red-700 shadow-[0_1px_3px_rgba(239,68,68,0.1)]",
        outline:
          "border-gray-300/60 text-gray-600 hover:bg-gray-100/50",
        success:
          "border-emerald-300/50 bg-emerald-100/60 text-emerald-700 shadow-[0_1px_3px_rgba(16,185,129,0.1)]",
        warning:
          "border-amber-300/50 bg-amber-100/60 text-amber-700 shadow-[0_1px_3px_rgba(245,158,11,0.1)]",
        processing:
          "border-sky-300/50 bg-sky-100/60 text-sky-700 animate-pulse shadow-[0_1px_6px_rgba(56,189,248,0.15)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
