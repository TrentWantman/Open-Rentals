"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ShimmerSkeleton, StatCardSkeleton, ChartSkeleton, ActivityFeedSkeleton } from "@/components/ui/loading-skeleton";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="space-y-2">
            <ShimmerSkeleton className="h-8 w-48" />
            <ShimmerSkeleton className="h-5 w-72" />
          </div>
          <div className="flex gap-3">
            <ShimmerSkeleton className="h-10 w-32 rounded-md" />
            <ShimmerSkeleton className="h-10 w-32 rounded-md" />
          </div>
        </div>

        {/* Stats Cards */}
        <StatCardSkeleton />

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Charts section */}
          <div className="lg:col-span-2 space-y-6">
            <ChartSkeleton />

            {/* Table section */}
            <Card className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <ShimmerSkeleton className="h-5 w-40" />
                    <ShimmerSkeleton className="h-4 w-56" />
                  </div>
                  <ShimmerSkeleton className="h-9 w-24 rounded-md" />
                </div>
              </CardHeader>
              <CardContent>
                {/* Table header */}
                <div className="flex gap-4 pb-3 border-b">
                  <ShimmerSkeleton className="h-4 flex-1" />
                  <ShimmerSkeleton className="h-4 w-24" />
                  <ShimmerSkeleton className="h-4 w-20" />
                  <ShimmerSkeleton className="h-4 w-24" />
                </div>
                {/* Table rows */}
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3 flex-1">
                      <ShimmerSkeleton className="h-12 w-12 rounded-lg" />
                      <div className="space-y-2">
                        <ShimmerSkeleton className="h-4 w-32" />
                        <ShimmerSkeleton className="h-3 w-48" />
                      </div>
                    </div>
                    <ShimmerSkeleton className="h-4 w-24" />
                    <ShimmerSkeleton className="h-6 w-20 rounded-full" />
                    <ShimmerSkeleton className="h-4 w-24" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick actions */}
            <Card className="overflow-hidden">
              <CardHeader>
                <ShimmerSkeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent className="space-y-3">
                <ShimmerSkeleton className="h-12 w-full rounded-md" />
                <ShimmerSkeleton className="h-12 w-full rounded-md" />
                <ShimmerSkeleton className="h-12 w-full rounded-md" />
              </CardContent>
            </Card>

            {/* Activity feed */}
            <Card className="overflow-hidden">
              <CardHeader>
                <div className="space-y-2">
                  <ShimmerSkeleton className="h-5 w-32" />
                  <ShimmerSkeleton className="h-4 w-48" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg border">
                    <ShimmerSkeleton className="h-8 w-8 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <ShimmerSkeleton className="h-4 w-3/4" />
                      <ShimmerSkeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
