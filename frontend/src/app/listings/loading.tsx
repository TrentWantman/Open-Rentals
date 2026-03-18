import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PropertyCardSkeletonGrid } from "@/components/ui/loading-skeleton";

export default function ListingsLoading() {
  return (
    <div className="min-h-screen pt-20">
      {/* Search Header Skeleton */}
      <div className="border-b border-sky-100 bg-white/70 backdrop-blur-xl sticky top-16 z-30 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Skeleton className="h-12 w-full rounded-md" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-24 rounded-md md:hidden" />
              <Skeleton className="h-10 w-32 rounded-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Desktop Sidebar Skeleton */}
          <aside className="hidden md:block w-72 shrink-0">
            <Card variant="glass" className="sticky top-40 p-5 bg-white/60 backdrop-blur-sm border-sky-100 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-6 w-16" />
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <div className="flex gap-2">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 flex-1" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <div className="flex gap-2">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-9 w-12 rounded-md" />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <div className="flex gap-2">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-9 w-12 rounded-md" />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <div className="flex flex-wrap gap-2">
                    {[...Array(6)].map((_, i) => (
                      <Skeleton key={i} className="h-8 w-24 rounded-full" />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </aside>

          {/* Listings Skeleton */}
          <div className="flex-1 min-w-0">
            {/* Results Header Skeleton */}
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>

            <PropertyCardSkeletonGrid count={6} />
          </div>
        </div>
      </div>
    </div>
  );
}
