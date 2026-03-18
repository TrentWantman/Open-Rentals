"use client"

import * as React from "react"
import { Command as CommandPrimitive } from "cmdk"
import { SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "text-gray-800 flex h-full w-full flex-col overflow-hidden rounded-xl",
        // Light glassmorphism styling
        "bg-white/95 backdrop-blur-xl",
        "border border-gray-200",
        "shadow-[0_20px_60px_rgba(0,0,0,0.1),0_4px_20px_rgba(56,189,248,0.08)]",
        className
      )}
      {...props}
    />
  )
}

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string
  description?: string
  className?: string
  showCloseButton?: boolean
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn(
          "overflow-hidden p-0 border-0 bg-transparent shadow-none",
          "sm:max-w-[550px]",
          className
        )}
        showCloseButton={showCloseButton}
      >
        <Command className={cn(
          "[&_[cmdk-group-heading]]:text-sky-600 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider",
          "**:data-[slot=command-input-wrapper]:h-14",
          "[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2",
          "[&_[cmdk-group]]:px-2",
          "[&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0",
          "[&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5",
          "[&_[cmdk-input]]:h-14",
          "[&_[cmdk-item]]:px-3 [&_[cmdk-item]]:py-3",
          "[&_[cmdk-item]_svg]:h-4 [&_[cmdk-item]_svg]:w-4"
        )}>
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div
      data-slot="command-input-wrapper"
      className={cn(
        "flex h-14 items-center gap-3 px-4",
        "border-b border-gray-200",
        "bg-gradient-to-r from-sky-50/50 via-transparent to-emerald-50/50"
      )}
    >
      <div className="relative">
        <SearchIcon className="size-5 shrink-0 text-sky-500" />
      </div>
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "flex h-12 w-full bg-transparent text-base text-gray-800 outline-hidden",
          "placeholder:text-gray-400",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
      <div className="flex items-center gap-1">
        <kbd className="hidden rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 sm:inline">
          ESC
        </kbd>
      </div>
    </div>
  )
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto",
        className
      )}
      {...props}
    />
  )
}

function CommandEmpty({
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className="py-6 text-center text-sm"
      {...props}
    />
  )
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "text-gray-800 [&_[cmdk-group-heading]]:text-gray-500 overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
        className
      )}
      {...props}
    />
  )
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn("bg-gray-200 -mx-1 h-px", className)}
      {...props}
    />
  )
}

function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "relative flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm outline-hidden select-none",
        "text-gray-700 transition-all duration-200",
        // Hover/Selected state - light glassmorphism
        "data-[selected=true]:bg-sky-50",
        "data-[selected=true]:text-sky-700",
        "data-[selected=true]:border-l-2 data-[selected=true]:border-l-sky-400",
        // Icon styling
        "[&_svg:not([class*='text-'])]:text-gray-500",
        "data-[selected=true]:[&_svg:not([class*='text-'])]:text-sky-500",
        // Disabled state
        "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "ml-auto flex items-center gap-0.5 text-[10px] font-medium tracking-wide text-gray-500",
        "[&_kbd]:rounded [&_kbd]:border [&_kbd]:border-gray-200 [&_kbd]:bg-gray-50 [&_kbd]:px-1.5 [&_kbd]:py-0.5",
        className
      )}
      {...props}
    />
  )
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
