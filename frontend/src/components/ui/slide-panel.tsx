"use client";

import * as React from "react";
import { X, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const sizes = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-full",
};

interface SlidePanelProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: keyof typeof sizes;
  showBackButton?: boolean;
  onBack?: () => void;
  footer?: React.ReactNode;
  className?: string;
}

export function SlidePanel({
  open,
  onClose,
  title,
  description,
  children,
  size = "lg",
  showBackButton = false,
  onBack,
  footer,
  className,
}: SlidePanelProps) {
  // Close on escape
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  // Prevent body scroll when open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-gray-900/20 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
            }}
            className={cn(
              "fixed inset-y-0 right-0 z-50 flex flex-col w-full",
              "bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-2xl border-l border-gray-200/60",
              "shadow-[-10px_0_40px_rgba(0,0,0,0.1)]",
              sizes[size],
              className
            )}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200/60">
              {showBackButton && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={onBack || onClose}
                  className="text-gray-500 hover:text-gray-700 hover:bg-gray-100/60 -ml-1"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              )}
              <div className="flex-1 min-w-0">
                {title && (
                  <h2 className="text-base font-medium text-gray-900 truncate">
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="text-sm text-gray-500 truncate">{description}</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 hover:bg-gray-100/60 h-8 w-8 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-200/60 bg-white/70">
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Nested slide panel for multi-level navigation
interface NestedSlidePanelProps extends Omit<SlidePanelProps, 'open' | 'onClose'> {
  id: string;
}

interface SlidePanelStackContextType {
  push: (id: string) => void;
  pop: () => void;
  activeId: string | null;
  stack: string[];
}

const SlidePanelStackContext = React.createContext<SlidePanelStackContextType | null>(null);

export function useSlidePanelStack() {
  const context = React.useContext(SlidePanelStackContext);
  if (!context) {
    throw new Error("useSlidePanelStack must be used within SlidePanelStackProvider");
  }
  return context;
}

interface SlidePanelStackProviderProps {
  children: React.ReactNode;
}

export function SlidePanelStackProvider({ children }: SlidePanelStackProviderProps) {
  const [stack, setStack] = React.useState<string[]>([]);

  const push = React.useCallback((id: string) => {
    setStack((prev) => [...prev, id]);
  }, []);

  const pop = React.useCallback(() => {
    setStack((prev) => prev.slice(0, -1));
  }, []);

  const activeId = stack[stack.length - 1] || null;

  return (
    <SlidePanelStackContext.Provider value={{ push, pop, activeId, stack }}>
      {children}
    </SlidePanelStackContext.Provider>
  );
}

// Quick panel for simple content (replaces simple dialogs)
interface QuickPanelProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  title?: string;
  size?: keyof typeof sizes;
}

export function QuickPanel({ trigger, children, title, size = "md" }: QuickPanelProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div onClick={() => setOpen(true)}>{trigger}</div>
      <SlidePanel
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        size={size}
      >
        {children}
      </SlidePanel>
    </>
  );
}

// Panel content wrapper with padding
export function PanelContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("p-6", className)}>{children}</div>;
}

// Panel section with title
export function PanelSection({
  title,
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      {title && (
        <h3 className="text-sm font-medium uppercase tracking-wider text-sky-600/80">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

// Panel divider
export function PanelDivider() {
  return <div className="h-px bg-gray-200/60 my-6" />;
}
