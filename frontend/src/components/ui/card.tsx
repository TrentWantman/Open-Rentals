import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardVariants = cva(
  "bg-gradient-to-br from-white/80 to-white/70 text-gray-900 flex flex-col gap-6 rounded-xl border border-gray-200/60 border-t-white/80 border-l-white/70 py-6 shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-2xl transition-all duration-300 ease-out transform-gpu will-change-[transform,box-shadow]",
  {
    variants: {
      variant: {
        default: "",
        glass: [
          "bg-gradient-to-br from-white/70 to-white/60",
          "backdrop-blur-[32px] backdrop-saturate-125",
          "border-gray-200/50 border-t-white/80 border-l-white/70",
          "shadow-[0_4px_24px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.95)]",
        ].join(" "),
        "glass-glow": [
          "bg-gradient-to-br from-white/70 to-white/60",
          "backdrop-blur-[32px] backdrop-saturate-125",
          "border-gray-200/50 border-t-white/80 border-l-white/70",
          "shadow-[0_4px_24px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.95)]",
        ].join(" "),
        neon: [
          "bg-gradient-to-br from-white/70 to-sky-50/50",
          "backdrop-blur-2xl border-sky-200/40",
          "shadow-[0_4px_20px_rgba(56,189,248,0.08),0_4px_16px_rgba(0,0,0,0.04)]",
        ].join(" "),
      },
      interactive: {
        true: "cursor-pointer",
        false: "",
      },
      hoverGlow: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        interactive: true,
        className: [
          "hover:shadow-[0_20px_48px_rgba(0,0,0,0.12),0_8px_24px_rgba(56,189,248,0.08),inset_0_1px_0_rgba(255,255,255,0.95)]",
          "hover:border-gray-300/70 hover:border-t-white/90",
          "hover:-translate-y-2",
          "active:scale-[0.98] active:translate-y-0",
          "focus-visible:ring-2 focus-visible:ring-sky-400/40 focus-visible:ring-offset-2",
        ].join(" "),
      },
      {
        hoverGlow: true,
        className: [
          "hover:border-sky-300/60",
          "hover:shadow-[0_20px_48px_rgba(56,189,248,0.15),0_8px_24px_rgba(16,185,129,0.08)]",
        ].join(" "),
      },
      {
        variant: "glass",
        interactive: true,
        className: [
          "hover:from-white/80 hover:to-white/70",
        ].join(" "),
      },
      {
        variant: "neon",
        hoverGlow: true,
        className: [
          "hover:border-sky-300/60",
          "hover:shadow-[0_20px_48px_rgba(56,189,248,0.18),0_12px_32px_rgba(0,0,0,0.08)]",
          "hover:-translate-y-2",
        ].join(" "),
      },
    ],
    defaultVariants: {
      variant: "default",
      interactive: false,
      hoverGlow: false,
    },
  }
)

interface CardProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof cardVariants> {
  animate?: boolean;
  animationDelay?: number;
}

function Card({
  className,
  variant,
  interactive,
  hoverGlow,
  animate = false,
  animationDelay = 0,
  style,
  ...props
}: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(
        cardVariants({ variant, interactive, hoverGlow }),
        animate && "opacity-0 animate-[card-entrance_0.5s_cubic-bezier(0.22,1,0.36,1)_forwards]",
        className
      )}
      style={{
        ...style,
        ...(animate && animationDelay > 0 ? { animationDelay: `${animationDelay}ms` } : {}),
      }}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold text-gray-900", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-gray-600 text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
