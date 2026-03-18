import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-white/80 backdrop-blur-xl border-gray-200/60 text-gray-800 [&>svg]:text-sky-500",
        destructive:
          "text-red-700 bg-red-50/80 backdrop-blur-xl border-red-200/60 [&>svg]:text-red-500 *:data-[slot=alert-description]:text-red-600",
        success:
          "text-emerald-700 bg-emerald-50/80 backdrop-blur-xl border-emerald-200/60 [&>svg]:text-emerald-500 *:data-[slot=alert-description]:text-emerald-600",
        warning:
          "text-amber-700 bg-amber-50/80 backdrop-blur-xl border-amber-200/60 [&>svg]:text-amber-500 *:data-[slot=alert-description]:text-amber-600",
        info:
          "text-sky-700 bg-sky-50/80 backdrop-blur-xl border-sky-200/60 [&>svg]:text-sky-500 *:data-[slot=alert-description]:text-sky-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight text-gray-800",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-gray-600 col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
