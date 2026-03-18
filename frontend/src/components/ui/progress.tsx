"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const progressVariants = cva(
  "relative h-2 w-full overflow-hidden rounded-full",
  {
    variants: {
      variant: {
        default: "bg-sky-500/20",
        neon: "bg-sky-500/10",
        gradient: "bg-gradient-to-r from-sky-500/10 via-emerald-500/10 to-sky-500/10",
        glass: "bg-white/60 backdrop-blur-sm border border-gray-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const indicatorVariants = cva(
  "h-full w-full flex-1 transition-all duration-500 ease-out",
  {
    variants: {
      variant: {
        default: "bg-sky-500",
        neon: [
          "bg-gradient-to-r from-sky-400 to-sky-500",
          "shadow-[0_0_10px_rgba(56,189,248,0.5),0_0_20px_rgba(56,189,248,0.3)]",
        ].join(" "),
        gradient: [
          "bg-gradient-to-r from-sky-500 via-emerald-500 to-sky-500",
          "shadow-[0_0_15px_rgba(16,185,129,0.4)]",
        ].join(" "),
        glass: [
          "bg-sky-500/50 backdrop-blur-sm",
        ].join(" "),
      },
      glow: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "neon",
        glow: true,
        className: "shadow-[0_0_15px_rgba(56,189,248,0.6),0_0_30px_rgba(56,189,248,0.4)]",
      },
      {
        variant: "gradient",
        glow: true,
        className: "shadow-[0_0_20px_rgba(16,185,129,0.5),0_0_40px_rgba(16,185,129,0.3)]",
      },
    ],
    defaultVariants: {
      variant: "default",
      glow: false,
    },
  }
)

interface ProgressProps
  extends React.ComponentProps<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {
  glow?: boolean
  indeterminate?: boolean
}

function Progress({
  className,
  value,
  variant,
  glow,
  indeterminate,
  ...props
}: ProgressProps) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(progressVariants({ variant }), className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          indicatorVariants({ variant, glow }),
          indeterminate && "animate-[indeterminate_1.5s_ease-in-out_infinite]"
        )}
        style={
          indeterminate
            ? { width: "40%", transform: "translateX(0)" }
            : { transform: `translateX(-${100 - (value || 0)}%)` }
        }
      />
    </ProgressPrimitive.Root>
  )
}

// Segmented progress for multi-step workflows
interface SegmentedProgressProps {
  steps: number
  currentStep: number
  variant?: "default" | "neon" | "gradient"
  className?: string
}

function SegmentedProgress({
  steps,
  currentStep,
  variant = "neon",
  className,
}: SegmentedProgressProps) {
  const segmentColors = {
    default: {
      complete: "bg-sky-500",
      active: "bg-sky-500/70",
      pending: "bg-sky-500/20",
    },
    neon: {
      complete: "bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.5)]",
      active: "bg-sky-400/70 shadow-[0_0_8px_rgba(56,189,248,0.4)] animate-pulse",
      pending: "bg-sky-500/10",
    },
    gradient: {
      complete: "bg-gradient-to-r from-sky-500 to-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]",
      active: "bg-gradient-to-r from-emerald-500 to-sky-500 shadow-[0_0_8px_rgba(56,189,248,0.4)] animate-pulse",
      pending: "bg-emerald-500/10",
    },
  }

  return (
    <div className={cn("flex gap-1.5", className)}>
      {Array.from({ length: steps }).map((_, i) => {
        const status = i < currentStep ? "complete" : i === currentStep ? "active" : "pending"
        return (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all duration-300",
              segmentColors[variant][status]
            )}
          />
        )
      })}
    </div>
  )
}

export { Progress, SegmentedProgress }
