"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "./card";

// Base shimmer skeleton component
function ShimmerSkeleton({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("relative overflow-hidden rounded-md bg-muted", className)}
      {...props}
    >
      <motion.div
        className="absolute inset-0 -translate-x-full"
        animate={{
          translateX: ["100%", "-100%"],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(56,189,248,0.2), transparent)",
        }}
      />
    </div>
  );
}

// Card skeleton with shimmer
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <ShimmerSkeleton className="h-4 w-24" />
            <ShimmerSkeleton className="h-8 w-32" />
            <ShimmerSkeleton className="h-3 w-20" />
          </div>
          <ShimmerSkeleton className="h-12 w-12 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}

// Stat card skeleton (for dashboard stats)
export function StatCardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

// Fixed heights for chart skeleton to avoid hydration mismatch
const CHART_SKELETON_HEIGHTS = [75, 55, 85, 45, 65, 90, 60];

// Chart skeleton
export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <ShimmerSkeleton className="h-5 w-48" />
      </CardHeader>
      <CardContent>
        <div className="h-64 space-y-4">
          <div className="flex items-end justify-between h-full space-x-2">
            {CHART_SKELETON_HEIGHTS.map((height, i) => (
              <ShimmerSkeleton
                key={i}
                className="flex-1"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Table skeleton
export function TableSkeleton({
  rows = 5,
  columns = 4,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex gap-4 pb-3 border-b">
        {[...Array(columns)].map((_, i) => (
          <ShimmerSkeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {[...Array(rows)].map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 py-3">
          {[...Array(columns)].map((_, colIndex) => (
            <ShimmerSkeleton
              key={colIndex}
              className="h-4 flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// List item skeleton
export function ListItemSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 rounded-lg border",
        className
      )}
    >
      <div className="flex items-center gap-3 flex-1">
        <ShimmerSkeleton className="h-2 w-2 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <ShimmerSkeleton className="h-4 w-32" />
            <ShimmerSkeleton className="h-5 w-16 rounded-full" />
          </div>
          <ShimmerSkeleton className="h-3 w-48" />
        </div>
      </div>
      <div className="space-y-1 text-right">
        <ShimmerSkeleton className="h-3 w-16 ml-auto" />
        <ShimmerSkeleton className="h-3 w-20 ml-auto" />
      </div>
    </div>
  );
}

// Activity feed skeleton
export function ActivityFeedSkeleton({ items = 5 }: { items?: number }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-2">
          <ShimmerSkeleton className="h-5 w-32" />
          <ShimmerSkeleton className="h-4 w-48" />
        </div>
        <ShimmerSkeleton className="h-9 w-24 rounded-md" />
      </CardHeader>
      <CardContent className="space-y-2">
        {[...Array(items)].map((_, i) => (
          <ListItemSkeleton key={i} />
        ))}
      </CardContent>
    </Card>
  );
}

// Dashboard skeleton (full page)
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <ShimmerSkeleton className="h-8 w-48" />
          <ShimmerSkeleton className="h-5 w-64" />
        </div>
        <ShimmerSkeleton className="h-10 w-32 rounded-md" />
      </div>

      {/* Stats */}
      <StatCardSkeleton />

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>

      {/* Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ActivityFeedSkeleton />
        <CardSkeleton className="lg:col-span-1" />
      </div>
    </div>
  );
}

// Form skeleton
export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className="space-y-6">
      {[...Array(fields)].map((_, i) => (
        <div key={i} className="space-y-2">
          <ShimmerSkeleton className="h-4 w-24" />
          <ShimmerSkeleton className="h-10 w-full rounded-md" />
        </div>
      ))}
      <div className="flex gap-3 pt-4">
        <ShimmerSkeleton className="h-10 w-24 rounded-md" />
        <ShimmerSkeleton className="h-10 w-24 rounded-md" />
      </div>
    </div>
  );
}

// Property card skeleton (for listings grid)
export function PropertyCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("overflow-hidden h-full", className)}>
      {/* Image placeholder */}
      <div className="relative h-56 overflow-hidden">
        <ShimmerSkeleton className="h-full w-full rounded-none" />
        {/* Badge placeholders */}
        <div className="absolute top-3 left-3 flex gap-2">
          <ShimmerSkeleton className="h-6 w-20 rounded-full" />
        </div>
        {/* Price tag placeholder */}
        <div className="absolute bottom-3 left-3">
          <ShimmerSkeleton className="h-10 w-28 rounded-lg" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Title */}
        <ShimmerSkeleton className="h-6 w-3/4" />
        {/* Address */}
        <div className="flex items-center gap-1">
          <ShimmerSkeleton className="h-4 w-4 rounded" />
          <ShimmerSkeleton className="h-4 w-2/3" />
        </div>
        {/* Property details */}
        <div className="flex items-center gap-4">
          <ShimmerSkeleton className="h-4 w-16" />
          <ShimmerSkeleton className="h-4 w-16" />
          <ShimmerSkeleton className="h-4 w-20" />
        </div>
        {/* Neighborhood tag */}
        <div className="pt-4 border-t border-gray-100">
          <ShimmerSkeleton className="h-5 w-24 rounded-full" />
        </div>
      </div>
    </Card>
  );
}

// Property card skeleton grid
export function PropertyCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Listing detail skeleton
export function ListingDetailSkeleton() {
  return (
    <div className="min-h-screen pt-20 pb-12 bg-gradient-to-b from-sky-50/50 via-white to-emerald-50/30">
      <div className="container mx-auto px-4">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2 mb-6">
          <ShimmerSkeleton className="h-4 w-16" />
          <ShimmerSkeleton className="h-4 w-4" />
          <ShimmerSkeleton className="h-4 w-24" />
          <ShimmerSkeleton className="h-4 w-4" />
          <ShimmerSkeleton className="h-4 w-32" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery Skeleton */}
            <Card variant="glass" className="overflow-hidden bg-white/70 backdrop-blur-xl border-sky-100/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
              <ShimmerSkeleton className="aspect-[16/10] rounded-none" />
              {/* Thumbnail strip */}
              <div className="flex gap-2 p-4 bg-gradient-to-r from-white/50 to-sky-50/30">
                {[...Array(5)].map((_, i) => (
                  <ShimmerSkeleton key={i} className="w-20 h-14 rounded-lg shrink-0" />
                ))}
              </div>
            </Card>

            {/* Property Info Skeleton */}
            <Card variant="glass" className="p-6 space-y-4 bg-white/70 backdrop-blur-xl border-sky-100/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <ShimmerSkeleton className="h-8 w-64" />
                  <div className="flex items-center gap-1">
                    <ShimmerSkeleton className="h-4 w-4" />
                    <ShimmerSkeleton className="h-4 w-48" />
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <ShimmerSkeleton className="h-8 w-32" />
                  <ShimmerSkeleton className="h-4 w-24 ml-auto" />
                </div>
              </div>

              <div className="flex flex-wrap gap-6 py-4 border-y border-sky-100/50">
                <div className="flex items-center gap-3">
                  <ShimmerSkeleton className="h-10 w-10 rounded-lg" />
                  <div className="space-y-1">
                    <ShimmerSkeleton className="h-5 w-8" />
                    <ShimmerSkeleton className="h-3 w-16" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ShimmerSkeleton className="h-10 w-10 rounded-lg" />
                  <div className="space-y-1">
                    <ShimmerSkeleton className="h-5 w-8" />
                    <ShimmerSkeleton className="h-3 w-16" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ShimmerSkeleton className="h-10 w-10 rounded-lg" />
                  <div className="space-y-1">
                    <ShimmerSkeleton className="h-5 w-12" />
                    <ShimmerSkeleton className="h-3 w-12" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <ShimmerSkeleton className="h-6 w-40" />
                <ShimmerSkeleton className="h-4 w-full" />
                <ShimmerSkeleton className="h-4 w-full" />
                <ShimmerSkeleton className="h-4 w-3/4" />
                <ShimmerSkeleton className="h-4 w-full" />
                <ShimmerSkeleton className="h-4 w-2/3" />
              </div>

              {/* Lease Terms skeleton */}
              <div className="grid md:grid-cols-2 gap-6 pt-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-sky-50/80 to-white border border-sky-100/50">
                  <ShimmerSkeleton className="h-5 w-28 mb-3" />
                  <div className="space-y-2">
                    <ShimmerSkeleton className="h-4 w-32" />
                    <ShimmerSkeleton className="h-4 w-28" />
                    <ShimmerSkeleton className="h-4 w-36" />
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50/80 to-white border border-emerald-100/50">
                  <ShimmerSkeleton className="h-5 w-24 mb-3" />
                  <ShimmerSkeleton className="h-4 w-full" />
                  <ShimmerSkeleton className="h-4 w-3/4 mt-2" />
                </div>
              </div>
            </Card>

            {/* Amenities Skeleton */}
            <Card variant="glass" className="p-6 bg-white/70 backdrop-blur-xl border-sky-100/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
              <ShimmerSkeleton className="h-6 w-40 mb-6" />
              <div className="space-y-6">
                <div>
                  <ShimmerSkeleton className="h-4 w-20 mb-3" />
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-sky-50/80 to-emerald-50/50 border border-sky-100/50">
                        <ShimmerSkeleton className="h-8 w-8 rounded-lg" />
                        <ShimmerSkeleton className="h-4 w-24" />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <ShimmerSkeleton className="h-4 w-24 mb-3" />
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-sky-50/80 to-emerald-50/50 border border-sky-100/50">
                        <ShimmerSkeleton className="h-8 w-8 rounded-lg" />
                        <ShimmerSkeleton className="h-4 w-24" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* Location Skeleton */}
            <Card variant="glass" className="p-6 bg-white/70 backdrop-blur-xl border-sky-100/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
              <ShimmerSkeleton className="h-6 w-24 mb-4" />
              <ShimmerSkeleton className="aspect-[16/9] rounded-xl" />
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-sky-50/80 to-white border border-sky-100/50">
                  <ShimmerSkeleton className="h-8 w-8 rounded-lg" />
                  <div className="space-y-1">
                    <ShimmerSkeleton className="h-4 w-28" />
                    <ShimmerSkeleton className="h-3 w-16" />
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-emerald-50/80 to-white border border-emerald-100/50">
                  <ShimmerSkeleton className="h-8 w-8 rounded-lg" />
                  <div className="space-y-1">
                    <ShimmerSkeleton className="h-4 w-28" />
                    <ShimmerSkeleton className="h-3 w-16" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-6">
            <Card variant="glass" className="p-6 space-y-6 bg-white/70 backdrop-blur-xl border-sky-100/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
              <div className="text-center space-y-2">
                <ShimmerSkeleton className="h-10 w-36 mx-auto" />
                <ShimmerSkeleton className="h-4 w-32 mx-auto" />
              </div>

              <ShimmerSkeleton className="h-12 w-full rounded-lg" />
              <ShimmerSkeleton className="h-11 w-full rounded-lg" />

              <div className="border-t border-sky-100/50 pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <ShimmerSkeleton className="h-14 w-14 rounded-full" />
                  <div className="space-y-2">
                    <ShimmerSkeleton className="h-4 w-36" />
                    <ShimmerSkeleton className="h-3 w-28" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-gradient-to-br from-sky-50/80 to-emerald-50/50 border border-sky-100/50 mb-4">
                  <div className="text-center space-y-1">
                    <ShimmerSkeleton className="h-5 w-8 mx-auto" />
                    <ShimmerSkeleton className="h-3 w-12 mx-auto" />
                  </div>
                  <div className="text-center border-x border-sky-100/50 space-y-1">
                    <ShimmerSkeleton className="h-5 w-8 mx-auto" />
                    <ShimmerSkeleton className="h-3 w-16 mx-auto" />
                  </div>
                  <div className="text-center space-y-1">
                    <ShimmerSkeleton className="h-5 w-8 mx-auto" />
                    <ShimmerSkeleton className="h-3 w-14 mx-auto" />
                  </div>
                </div>
              </div>

              <div className="border-t border-sky-100/50 pt-6 space-y-4">
                <ShimmerSkeleton className="h-5 w-32" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <ShimmerSkeleton className="h-4 w-20" />
                    <ShimmerSkeleton className="h-9 w-full rounded-md" />
                  </div>
                  <div className="space-y-1.5">
                    <ShimmerSkeleton className="h-4 w-14" />
                    <ShimmerSkeleton className="h-9 w-full rounded-md" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <ShimmerSkeleton className="h-4 w-12" />
                  <ShimmerSkeleton className="h-9 w-full rounded-md" />
                </div>
                <div className="space-y-1.5">
                  <ShimmerSkeleton className="h-4 w-16" />
                  <ShimmerSkeleton className="h-24 w-full rounded-md" />
                </div>
                <ShimmerSkeleton className="h-11 w-full rounded-lg" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dashboard card skeleton (for saved listings and applications)
export function DashboardListingCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full">
      <ShimmerSkeleton className="h-48 rounded-none" />
      <div className="p-4 space-y-3">
        <ShimmerSkeleton className="h-6 w-28" />
        <ShimmerSkeleton className="h-5 w-3/4" />
        <div className="flex items-center gap-1">
          <ShimmerSkeleton className="h-4 w-4" />
          <ShimmerSkeleton className="h-4 w-2/3" />
        </div>
        <div className="flex items-center gap-4">
          <ShimmerSkeleton className="h-4 w-8" />
          <ShimmerSkeleton className="h-4 w-8" />
        </div>
      </div>
    </Card>
  );
}

// Dashboard application card skeleton
export function DashboardApplicationCardSkeleton() {
  return (
    <Card className="p-5">
      <div className="flex flex-col md:flex-row gap-4">
        <ShimmerSkeleton className="w-full md:w-40 h-28 rounded-lg shrink-0" />
        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
            <div className="space-y-2">
              <ShimmerSkeleton className="h-5 w-40" />
              <div className="flex items-center gap-1">
                <ShimmerSkeleton className="h-3 w-3" />
                <ShimmerSkeleton className="h-4 w-48" />
              </div>
            </div>
            <ShimmerSkeleton className="h-6 w-24 rounded-full" />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <ShimmerSkeleton className="h-4 w-24" />
            <ShimmerSkeleton className="h-4 w-32" />
            <ShimmerSkeleton className="h-4 w-28" />
          </div>
        </div>
        <div className="flex md:flex-col gap-2 shrink-0">
          <ShimmerSkeleton className="h-8 w-28 rounded-md" />
        </div>
      </div>
    </Card>
  );
}

// Renter dashboard skeleton
export function RenterDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="space-y-2">
            <ShimmerSkeleton className="h-8 w-64" />
            <ShimmerSkeleton className="h-5 w-48" />
          </div>
          <ShimmerSkeleton className="h-10 w-36 rounded-lg" />
        </div>

        {/* Profile completion card placeholder */}
        <Card className="p-6 mb-8 bg-sky-50/50">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1 space-y-3">
              <ShimmerSkeleton className="h-6 w-48" />
              <ShimmerSkeleton className="h-4 w-64" />
              <ShimmerSkeleton className="h-2 w-full" />
              <ShimmerSkeleton className="h-4 w-20" />
            </div>
            <ShimmerSkeleton className="h-10 w-36 rounded-lg" />
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-center gap-4">
                <ShimmerSkeleton className="h-12 w-12 rounded-xl" />
                <div className="space-y-2">
                  <ShimmerSkeleton className="h-6 w-8" />
                  <ShimmerSkeleton className="h-4 w-24" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Tabs skeleton */}
        <div className="mb-6">
          <ShimmerSkeleton className="h-10 w-80 rounded-lg" />
        </div>

        {/* Content grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <DashboardListingCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Landlord dashboard skeleton
export function LandlordDashboardSkeleton() {
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="space-y-2">
            <ShimmerSkeleton className="h-8 w-56" />
            <ShimmerSkeleton className="h-5 w-48" />
          </div>
          <ShimmerSkeleton className="h-10 w-32 rounded-lg" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <ShimmerSkeleton className="h-4 w-24" />
                  <ShimmerSkeleton className="h-8 w-16" />
                  <ShimmerSkeleton className="h-3 w-20" />
                </div>
                <ShimmerSkeleton className="h-12 w-12 rounded-xl" />
              </div>
            </Card>
          ))}
        </div>

        {/* Tabs skeleton */}
        <div className="mb-6">
          <ShimmerSkeleton className="h-10 w-96 rounded-lg" />
        </div>

        {/* Property list skeleton */}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <ShimmerSkeleton className="w-full md:w-48 h-32 rounded-lg shrink-0" />
                <div className="flex-1 min-w-0 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <ShimmerSkeleton className="h-6 w-48" />
                        <ShimmerSkeleton className="h-5 w-16 rounded-full" />
                      </div>
                      <div className="flex items-center gap-1">
                        <ShimmerSkeleton className="h-4 w-4" />
                        <ShimmerSkeleton className="h-4 w-56" />
                      </div>
                    </div>
                    <ShimmerSkeleton className="h-8 w-8 rounded" />
                  </div>
                  <div className="flex flex-wrap gap-6">
                    <ShimmerSkeleton className="h-4 w-28" />
                    <ShimmerSkeleton className="h-4 w-20" />
                    <ShimmerSkeleton className="h-4 w-28" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// Export the base shimmer for custom use
export { ShimmerSkeleton };
