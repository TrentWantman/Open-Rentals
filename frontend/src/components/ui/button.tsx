import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-[3px] focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:ring-sky-400/50 aria-invalid:ring-destructive/20 aria-invalid:border-destructive transform-gpu will-change-transform",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground bg-white/60 backdrop-blur-xl border-gray-200 hover:bg-white/80 hover:border-gray-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground hover:bg-gray-100/50",
        link: "text-primary underline-offset-4 hover:underline",
        // Light Glass & Soft accent variants
        neon: [
          "relative border border-sky-300/50 bg-sky-100/40 text-sky-600",
          "hover:bg-sky-100/60 hover:border-sky-400/70 hover:text-sky-700",
          "hover:shadow-[0_4px_20px_rgba(56,189,248,0.2)]",
          "border-sky-300/40 bg-sky-50/50",
          "hover:bg-sky-100/50 hover:border-sky-400/60",
          "focus-visible:ring-sky-400/30 focus-visible:border-sky-400",
          "active:scale-[0.98] active:shadow-[0_2px_10px_rgba(56,189,248,0.15)]",
        ].join(" "),
        "neon-magenta": [
          "relative border border-emerald-300/50 bg-emerald-100/40 text-emerald-600",
          "hover:bg-emerald-100/60 hover:border-emerald-400/70 hover:text-emerald-700",
          "hover:shadow-[0_4px_20px_rgba(110,231,183,0.25)]",
          "border-emerald-300/40 bg-emerald-50/50",
          "hover:bg-emerald-100/50 hover:border-emerald-400/60",
          "focus-visible:ring-emerald-400/30 focus-visible:border-emerald-400",
          "active:scale-[0.98] active:shadow-[0_2px_10px_rgba(110,231,183,0.2)]",
        ].join(" "),
        "neon-purple": [
          "relative border border-teal-300/50 bg-teal-100/40 text-teal-600",
          "hover:bg-teal-100/60 hover:border-teal-400/70 hover:text-teal-700",
          "hover:shadow-[0_4px_20px_rgba(45,212,191,0.25)]",
          "border-teal-300/40 bg-teal-50/50",
          "hover:bg-teal-100/50 hover:border-teal-400/60",
          "focus-visible:ring-teal-400/30 focus-visible:border-teal-400",
          "active:scale-[0.98] active:shadow-[0_2px_10px_rgba(45,212,191,0.2)]",
        ].join(" "),
        gradient: [
          "relative border-0 text-white",
          "bg-gradient-to-r from-sky-500 via-emerald-500 to-teal-500",
          "hover:from-sky-400 hover:via-emerald-400 hover:to-teal-400",
          "hover:shadow-[0_4px_20px_rgba(56,189,248,0.3)]",
          "focus-visible:ring-sky-400/40",
          "active:scale-[0.98]",
          "before:absolute before:inset-0 before:rounded-md before:bg-gradient-to-r before:from-sky-500 before:via-emerald-500 before:to-teal-500 before:opacity-0 before:blur-xl before:transition-opacity before:duration-300",
          "hover:before:opacity-30",
        ].join(" "),
        glass: [
          "relative border border-gray-200/60 bg-white/70 text-gray-800 backdrop-blur-2xl backdrop-saturate-125",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_3px_rgba(0,0,0,0.05)]",
          "hover:bg-white/80 hover:border-gray-300/70",
          "hover:shadow-[0_4px_16px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.95)]",
          "focus-visible:ring-sky-300/30",
          "active:scale-[0.98]",
        ].join(" "),
        "glass-primary": [
          "relative border border-sky-200/50 bg-gradient-to-br from-white/80 to-sky-50/60 text-sky-700 backdrop-blur-2xl backdrop-saturate-125",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_1px_3px_rgba(56,189,248,0.1)]",
          "hover:from-white/90 hover:to-sky-100/70 hover:border-sky-300/60",
          "hover:shadow-[0_4px_16px_rgba(56,189,248,0.15),inset_0_1px_0_rgba(255,255,255,0.95)]",
          "focus-visible:ring-sky-400/30",
          "active:scale-[0.98]",
        ].join(" "),
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        xl: "h-12 rounded-lg px-8 text-base has-[>svg]:px-6",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface RippleStyle {
  left: number;
  top: number;
  width: number;
  height: number;
}

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  enableRipple = true,
  type = "button",
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    enableRipple?: boolean
  }) {
  const Comp = asChild ? Slot : "button"
  // Check if this is an icon-only button (no text children, only has icon size)
  const isIconButton = size === "icon" || size === "icon-sm" || size === "icon-lg"
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const [ripples, setRipples] = React.useState<RippleStyle[]>([])

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!enableRipple || asChild) {
        props.onClick?.(event)
        return
      }

      const button = buttonRef.current
      if (!button) {
        props.onClick?.(event)
        return
      }

      const rect = button.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = event.clientX - rect.left - size / 2
      const y = event.clientY - rect.top - size / 2

      const newRipple: RippleStyle = {
        left: x,
        top: y,
        width: size,
        height: size,
      }

      setRipples((prev) => [...prev, newRipple])

      // Remove ripple after animation
      setTimeout(() => {
        setRipples((prev) => prev.slice(1))
      }, 600)

      props.onClick?.(event)
    },
    [enableRipple, asChild, props]
  )

  if (asChild) {
    return (
      <Comp
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    )
  }

  return (
    <Comp
      ref={buttonRef}
      type={type}
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(
        buttonVariants({ variant, size, className }),
        "relative overflow-hidden"
      )}
      onClick={handleClick}
      {...props}
    >
      {/* Ripple effects - hidden from screen readers */}
      {ripples.map((ripple, index) => (
        <span
          key={index}
          aria-hidden="true"
          className="absolute rounded-full pointer-events-none animate-[ripple_0.6s_cubic-bezier(0.22,1,0.36,1)]"
          style={{
            left: ripple.left,
            top: ripple.top,
            width: ripple.width,
            height: ripple.height,
            background:
              variant === "default" || variant === "gradient"
                ? "radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%)"
                : "radial-gradient(circle, rgba(14,165,233,0.2) 0%, rgba(14,165,233,0.05) 100%)",
            transform: "scale(0)",
          }}
        />
      ))}
      {/* Hover shine effect - hidden from screen readers */}
      <span aria-hidden="true" className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none" />
      {props.children}
    </Comp>
  )
}

export { Button, buttonVariants }
