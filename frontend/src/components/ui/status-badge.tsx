"use client";

import { Badge } from "./badge";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Loader2,
  Package,
  Truck,
  FileText,
} from "lucide-react";

type StatusType =
  | "pending"
  | "processing"
  | "success"
  | "warning"
  | "error"
  | "draft"
  | "confirmed"
  | "exported"
  | "shipped"
  | "invoiced";

interface StatusConfig {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  className: string;
}

const statusConfigs: Record<StatusType, StatusConfig> = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-amber-50/80 text-amber-700 border-amber-200/60 shadow-sm",
  },
  processing: {
    label: "Processing",
    icon: Loader2,
    className: "bg-sky-50/80 text-sky-600 border-sky-200/60 shadow-sm",
  },
  success: {
    label: "Success",
    icon: CheckCircle,
    className: "bg-emerald-50/80 text-emerald-600 border-emerald-200/60 shadow-sm",
  },
  warning: {
    label: "Warning",
    icon: AlertCircle,
    className: "bg-orange-50/80 text-orange-600 border-orange-200/60 shadow-sm",
  },
  error: {
    label: "Error",
    icon: XCircle,
    className: "bg-red-50/80 text-red-600 border-red-200/60 shadow-sm",
  },
  draft: {
    label: "Draft",
    icon: FileText,
    className: "bg-gray-50/80 text-gray-600 border-gray-200/60 shadow-sm",
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle,
    className: "bg-emerald-50/80 text-emerald-600 border-emerald-200/60 shadow-sm",
  },
  exported: {
    label: "Exported",
    icon: Package,
    className: "bg-emerald-50/80 text-emerald-600 border-emerald-200/60 shadow-sm",
  },
  shipped: {
    label: "Shipped",
    icon: Truck,
    className: "bg-sky-50/80 text-sky-600 border-sky-200/60 shadow-sm",
  },
  invoiced: {
    label: "Invoiced",
    icon: FileText,
    className: "bg-emerald-50/80 text-emerald-600 border-emerald-200/60 shadow-sm",
  },
};

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  showIcon?: boolean;
  size?: "sm" | "default";
  className?: string;
}

export function StatusBadge({
  status,
  label,
  showIcon = true,
  size = "default",
  className,
}: StatusBadgeProps) {
  const config = statusConfigs[status];
  const Icon = config.icon;
  const isProcessing = status === "processing";

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium border",
        config.className,
        size === "sm" ? "text-xs px-1.5 py-0.5" : "text-xs px-2 py-1",
        className
      )}
    >
      {showIcon && (
        <Icon
          className={cn(
            "mr-1",
            size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5",
            isProcessing && "animate-spin"
          )}
        />
      )}
      {label || config.label}
    </Badge>
  );
}
