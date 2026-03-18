import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-md border px-3 py-2 text-sm",
        "bg-white/70 backdrop-blur-xl border-gray-200 text-gray-900",
        "placeholder:text-gray-400",
        "shadow-[inset_0_1px_2px_rgba(0,0,0,0.04),0_1px_0_rgba(255,255,255,0.8)]",
        "transition-all duration-150 outline-none",
        "hover:border-gray-300 hover:bg-white/80",
        "focus-visible:border-sky-400/60 focus-visible:bg-white/90",
        "focus-visible:shadow-[inset_0_1px_2px_rgba(0,0,0,0.04),0_0_0_2px_rgba(56,189,248,0.15)]",
        "aria-invalid:border-red-400/60",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "file:text-gray-700 file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className
      )}
      {...props}
    />
  )
}

export { Input }
