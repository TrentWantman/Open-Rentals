import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-md border px-3 py-2 text-base md:text-sm",
        "bg-white/70 backdrop-blur-xl border-gray-200 text-gray-900",
        "placeholder:text-gray-400",
        "shadow-[inset_0_1px_2px_rgba(0,0,0,0.04),0_1px_0_rgba(255,255,255,0.8)]",
        "transition-all duration-150 outline-none",
        "hover:border-gray-300 hover:bg-white/80",
        "focus-visible:border-sky-400/60 focus-visible:bg-white/90",
        "focus-visible:shadow-[inset_0_1px_2px_rgba(0,0,0,0.04),0_0_0_2px_rgba(56,189,248,0.15)]",
        "aria-invalid:border-red-400/60",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
