"use client";

import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  DollarSign,
  Bed,
  Bath,
  MapPin,
  ChevronDown,
  X,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export interface Filters {
  priceMin: number | null;
  priceMax: number | null;
  beds: number | null;
  baths: number | null;
  neighborhoods: string[];
}

interface PropertyFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  neighborhoods?: string[];
  className?: string;
  onClose?: () => void;
}

const bedOptions = [
  { label: "Any", value: null },
  { label: "Studio", value: 0 },
  { label: "1+", value: 1 },
  { label: "2+", value: 2 },
  { label: "3+", value: 3 },
  { label: "4+", value: 4 },
];

const bathOptions = [
  { label: "Any", value: null },
  { label: "1+", value: 1 },
  { label: "2+", value: 2 },
  { label: "3+", value: 3 },
];

const pricePresets = [
  { label: "Under $3k", min: null, max: 3000 },
  { label: "$3k - $5k", min: 3000, max: 5000 },
  { label: "$5k - $8k", min: 5000, max: 8000 },
  { label: "$8k+", min: 8000, max: null },
];

// Collapsible filter section component
function FilterSection({
  title,
  icon: Icon,
  iconColor = "text-sky-500",
  children,
  defaultOpen = true,
  activeCount = 0,
}: {
  title: string;
  icon: React.ElementType;
  iconColor?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  activeCount?: number;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between w-full py-2 group",
          "transition-colors duration-200 hover:text-sky-600"
        )}
      >
        <span className="flex items-center gap-2 text-gray-800 font-medium">
          <Icon className={cn("h-4 w-4 transition-colors", iconColor)} />
          {title}
          {activeCount > 0 && (
            <Badge
              variant="secondary"
              className="h-5 min-w-[20px] px-1.5 bg-sky-100 text-sky-700 text-xs"
            >
              {activeCount}
            </Badge>
          )}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-gray-400 transition-transform duration-300 ease-out",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-300 ease-out",
          isOpen
            ? "grid-rows-[1fr] opacity-100 mt-3"
            : "grid-rows-[0fr] opacity-0 mt-0"
        )}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

export function PropertyFilters({
  filters,
  onFiltersChange,
  neighborhoods = [],
  className,
  onClose,
}: PropertyFiltersProps) {
  // Calculate active filter counts
  const priceActiveCount = useMemo(() => {
    return [filters.priceMin, filters.priceMax].filter(Boolean).length > 0
      ? 1
      : 0;
  }, [filters.priceMin, filters.priceMax]);

  const bedsActiveCount = filters.beds !== null ? 1 : 0;
  const bathsActiveCount = filters.baths !== null ? 1 : 0;
  const neighborhoodActiveCount = filters.neighborhoods.length;

  const totalActiveFilters =
    priceActiveCount +
    bedsActiveCount +
    bathsActiveCount +
    (neighborhoodActiveCount > 0 ? 1 : 0);

  const handleNeighborhoodToggle = useCallback(
    (neighborhood: string) => {
      const isSelected = filters.neighborhoods.includes(neighborhood);
      onFiltersChange({
        ...filters,
        neighborhoods: isSelected
          ? filters.neighborhoods.filter((n) => n !== neighborhood)
          : [...filters.neighborhoods, neighborhood],
      });
    },
    [filters, onFiltersChange]
  );

  const handlePricePreset = useCallback(
    (min: number | null, max: number | null) => {
      // Toggle off if same preset is clicked
      if (filters.priceMin === min && filters.priceMax === max) {
        onFiltersChange({ ...filters, priceMin: null, priceMax: null });
      } else {
        onFiltersChange({ ...filters, priceMin: min, priceMax: max });
      }
    },
    [filters, onFiltersChange]
  );

  const clearAllFilters = useCallback(() => {
    onFiltersChange({
      priceMin: null,
      priceMax: null,
      beds: null,
      baths: null,
      neighborhoods: [],
    });
  }, [onFiltersChange]);

  const isPresetActive = (min: number | null, max: number | null) => {
    return filters.priceMin === min && filters.priceMax === max;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header with clear all */}
      {totalActiveFilters > 0 && (
        <div
          className={cn(
            "flex items-center justify-between p-3 rounded-lg",
            "bg-gradient-to-r from-sky-50/80 to-emerald-50/60",
            "border border-sky-100/50",
            "animate-in fade-in-0 slide-in-from-top-2 duration-300"
          )}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-sky-500" />
            <span className="text-sm font-medium text-gray-700">
              {totalActiveFilters} filter{totalActiveFilters !== 1 ? "s" : ""}{" "}
              active
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-7 px-2 text-gray-500 hover:text-gray-700 hover:bg-white/60"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            Clear
          </Button>
        </div>
      )}

      {/* Price Range */}
      <FilterSection
        title="Price Range"
        icon={DollarSign}
        iconColor="text-sky-500"
        activeCount={priceActiveCount}
      >
        <div className="space-y-3">
          {/* Quick presets */}
          <div className="flex flex-wrap gap-2">
            {pricePresets.map((preset) => (
              <Button
                key={preset.label}
                variant={
                  isPresetActive(preset.min, preset.max) ? "neon" : "outline"
                }
                size="sm"
                onClick={() => handlePricePreset(preset.min, preset.max)}
                className={cn(
                  "text-xs h-7 transition-all duration-200",
                  isPresetActive(preset.min, preset.max) &&
                    "ring-2 ring-sky-200/50"
                )}
              >
                {preset.label}
              </Button>
            ))}
          </div>

          {/* Custom range inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                $
              </span>
              <Input
                type="number"
                placeholder="Min"
                value={filters.priceMin || ""}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    priceMin: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className="h-9 pl-7 text-sm"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                $
              </span>
              <Input
                type="number"
                placeholder="Max"
                value={filters.priceMax || ""}
                onChange={(e) =>
                  onFiltersChange({
                    ...filters,
                    priceMax: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className="h-9 pl-7 text-sm"
              />
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Bedrooms */}
      <FilterSection
        title="Bedrooms"
        icon={Bed}
        iconColor="text-sky-500"
        activeCount={bedsActiveCount}
      >
        <div className="flex flex-wrap gap-2">
          {bedOptions.map((option) => (
            <Button
              key={option.label}
              variant={filters.beds === option.value ? "neon" : "outline"}
              size="sm"
              onClick={() => onFiltersChange({ ...filters, beds: option.value })}
              className={cn(
                "min-w-[52px] h-8 text-sm transition-all duration-200",
                filters.beds === option.value && "ring-2 ring-sky-200/50"
              )}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </FilterSection>

      {/* Bathrooms */}
      <FilterSection
        title="Bathrooms"
        icon={Bath}
        iconColor="text-emerald-500"
        activeCount={bathsActiveCount}
      >
        <div className="flex flex-wrap gap-2">
          {bathOptions.map((option) => (
            <Button
              key={option.label}
              variant={filters.baths === option.value ? "neon-magenta" : "outline"}
              size="sm"
              onClick={() =>
                onFiltersChange({ ...filters, baths: option.value })
              }
              className={cn(
                "min-w-[52px] h-8 text-sm transition-all duration-200",
                filters.baths === option.value && "ring-2 ring-emerald-200/50"
              )}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </FilterSection>

      {/* Neighborhoods */}
      <FilterSection
        title="Neighborhoods"
        icon={MapPin}
        iconColor="text-emerald-500"
        activeCount={neighborhoodActiveCount}
        defaultOpen={true}
      >
        <div className="space-y-1">
          {neighborhoods.map((neighborhood) => {
            const isChecked = filters.neighborhoods.includes(neighborhood);
            return (
              <label
                key={neighborhood}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg cursor-pointer",
                  "transition-all duration-200",
                  isChecked
                    ? "bg-sky-50/80 border border-sky-200/50"
                    : "hover:bg-gray-50/80 border border-transparent"
                )}
              >
                <Checkbox
                  id={`neighborhood-${neighborhood}`}
                  checked={isChecked}
                  onCheckedChange={() => handleNeighborhoodToggle(neighborhood)}
                />
                <span
                  className={cn(
                    "text-sm transition-colors",
                    isChecked ? "text-gray-900 font-medium" : "text-gray-600"
                  )}
                >
                  {neighborhood}
                </span>
              </label>
            );
          })}
        </div>

        {/* Quick select/deselect all */}
        {neighborhoods.length > 0 && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                onFiltersChange({ ...filters, neighborhoods: [...neighborhoods] })
              }
              className="text-xs h-7 text-gray-500 hover:text-gray-700"
              disabled={filters.neighborhoods.length === neighborhoods.length}
            >
              Select all
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFiltersChange({ ...filters, neighborhoods: [] })}
              className="text-xs h-7 text-gray-500 hover:text-gray-700"
              disabled={filters.neighborhoods.length === 0}
            >
              Clear all
            </Button>
          </div>
        )}
      </FilterSection>

      {/* Clear All Filters Button - always visible at bottom */}
      <div className="pt-2">
        <Button
          variant="outline"
          className={cn(
            "w-full h-10 transition-all duration-200",
            totalActiveFilters > 0
              ? "border-sky-200 text-sky-700 hover:bg-sky-50 hover:border-sky-300"
              : "text-gray-400 border-gray-200"
          )}
          onClick={clearAllFilters}
          disabled={totalActiveFilters === 0}
        >
          <X className="h-4 w-4 mr-2" />
          Clear All Filters
          {totalActiveFilters > 0 && (
            <Badge className="ml-2 h-5 min-w-[20px] px-1.5 bg-sky-500 text-white text-xs">
              {totalActiveFilters}
            </Badge>
          )}
        </Button>
      </div>

      {/* Apply button for mobile */}
      {onClose && (
        <div className="pt-2">
          <Button
            variant="gradient"
            className="w-full h-11"
            onClick={onClose}
          >
            Show Results
          </Button>
        </div>
      )}
    </div>
  );
}
