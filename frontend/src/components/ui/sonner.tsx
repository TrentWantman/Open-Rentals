"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  // Using light theme by default since we don't have ThemeProvider
  const theme = "light"

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      duration={4000}
      closeButton
      toastOptions={{
        className: "group-[.toaster]:!bg-white/90 group-[.toaster]:!backdrop-blur-xl group-[.toaster]:!text-gray-900 group-[.toaster]:!border-gray-200/60 group-[.toaster]:shadow-lg",
        classNames: {
          success: "group-[.toaster]:!bg-emerald-50/90 group-[.toaster]:!text-emerald-700 group-[.toaster]:!border-emerald-200/60",
          error: "group-[.toaster]:!bg-red-50/90 group-[.toaster]:!text-red-700 group-[.toaster]:!border-red-200/60",
          warning: "group-[.toaster]:!bg-amber-50/90 group-[.toaster]:!text-amber-700 group-[.toaster]:!border-amber-200/60",
          info: "group-[.toaster]:!bg-sky-50/90 group-[.toaster]:!text-sky-700 group-[.toaster]:!border-sky-200/60",
        },
      }}
      icons={{
        success: <CircleCheckIcon className="size-5 text-emerald-500" />,
        info: <InfoIcon className="size-5 text-sky-500" />,
        warning: <TriangleAlertIcon className="size-5 text-amber-500" />,
        error: <OctagonXIcon className="size-5 text-red-500" />,
        loading: <Loader2Icon className="size-5 animate-spin text-sky-500" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "0.5rem",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
