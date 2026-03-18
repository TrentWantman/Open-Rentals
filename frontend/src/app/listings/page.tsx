"use client";

import { useState, Suspense, useMemo, useCallback, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PropertyCard } from "@/components/properties/property-card";
import { PropertyFilters, Filters } from "@/components/properties/property-filters";
import { PropertyCardSkeletonGrid } from "@/components/ui/loading-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { propertiesApi } from "@/lib/api";

const PropertyMap = dynamic(
  () => import("@/components/properties/property-map").then((mod) => mod.PropertyMap),
  {
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sky-50 to-white rounded-xl border border-sky-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-500 text-sm">Loading map...</span>
        </div>
      </div>
    ),
    ssr: false,
  }
);
import {
  Search,
  MapPin,
  Grid3X3,
  Map,
  SlidersHorizontal,
  X,
  Home,
  Sparkles,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";

function ListingsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [view, setView] = useState<"grid" | "map">("grid");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const [filters, setFilters] = useState<Filters>(() => {
    const neighborhood = searchParams.get("neighborhood");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const beds = searchParams.get("beds");
    const baths = searchParams.get("baths");

    return {
      priceMin: minPrice ? Number(minPrice) : null,
      priceMax: maxPrice ? Number(maxPrice) : null,
      beds: beds ? Number(beds) : null,
      baths: baths ? Number(baths) : null,
      neighborhoods: neighborhood ? [neighborhood] : [],
    };
  });

  // Fetch listings from API
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const fetchListings = async () => {
      try {
        const result = await propertiesApi.list({
          q: searchQuery || undefined,
          minPrice: filters.priceMin ?? undefined,
          maxPrice: filters.priceMax ?? undefined,
          beds: filters.beds ?? undefined,
          baths: filters.baths ?? undefined,
          neighborhood: filters.neighborhoods[0] ?? undefined,
          limit: 50,
        });
        if (!cancelled) {
          setListings(result.data ?? []);
          setTotalCount(result.total ?? 0);
        }
      } catch {
        if (!cancelled) setListings([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchListings();
    return () => { cancelled = true; };
  }, [searchQuery, filters]);

  // Derive unique neighborhoods from results for the filter sidebar
  const availableNeighborhoods = useMemo(() => {
    const seen = new Set<string>();
    listings.forEach((l) => {
      if (l.neighborhood) seen.add(l.neighborhood);
    });
    return Array.from(seen).sort();
  }, [listings]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.priceMin !== null || filters.priceMax !== null) count++;
    if (filters.beds !== null) count++;
    if (filters.baths !== null) count++;
    if (filters.neighborhoods.length > 0) count++;
    return count;
  }, [filters]);

  const handleFiltersChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters);
  }, []);

  const clearAllFilters = useCallback(() => {
    setSearchQuery("");
    setFilters({ priceMin: null, priceMax: null, beds: null, baths: null, neighborhoods: [] });
  }, []);

  const closeMobileFilters = useCallback(() => setShowMobileFilters(false), []);

  const pageTitle = useMemo(() => {
    if (searchQuery) return `Results for "${searchQuery}"`;
    if (filters.neighborhoods.length === 1) return `Properties in ${filters.neighborhoods[0]}`;
    if (filters.neighborhoods.length > 1) return `Properties in ${filters.neighborhoods.length} neighborhoods`;
    return "All Properties";
  }, [searchQuery, filters.neighborhoods]);

  // Map center: derive from first listing with coordinates, or use defaults
  const mapCenter = useMemo(() => {
    const first = listings.find((l) => l.latitude && l.longitude);
    return first
      ? { lat: first.latitude, lng: first.longitude }
      : { lat: 0, lng: 0 };
  }, [listings]);

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-sky-50/30 to-white">
      {/* Search Header */}
      <div className="border-b border-sky-100 bg-white/70 backdrop-blur-xl sticky top-16 z-30 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-sky-500 transition-colors" />
              <Input
                placeholder="Search by location, neighborhood, or address..."
                className="pl-12 h-12 bg-white/80 border-gray-200 focus:border-sky-400 focus:ring-sky-400/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-gray-100"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("md:hidden relative h-10", activeFilterCount > 0 && "border-sky-300 bg-sky-50/50 text-sky-700")}
                  >
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge className="ml-2 h-5 min-w-[20px] px-1.5 bg-sky-500 text-white text-xs">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full max-w-sm bg-white/95 backdrop-blur-xl p-0 flex flex-col">
                  <SheetHeader className="p-4 pb-2 border-b border-gray-100">
                    <SheetTitle className="text-gray-900 flex items-center gap-2">
                      <SlidersHorizontal className="h-5 w-5 text-sky-500" />
                      Filters
                      {activeFilterCount > 0 && (
                        <Badge className="ml-auto h-6 px-2 bg-sky-100 text-sky-700">{activeFilterCount} active</Badge>
                      )}
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex-1 overflow-y-auto p-4">
                    <PropertyFilters
                      filters={filters}
                      onFiltersChange={handleFiltersChange}
                      neighborhoods={availableNeighborhoods}
                      onClose={closeMobileFilters}
                    />
                  </div>
                  <SheetFooter className="p-4 border-t border-gray-100 bg-white/80">
                    <div className="text-center text-sm text-gray-500 w-full">
                      {listings.length} propert{listings.length === 1 ? "y" : "ies"} found
                    </div>
                  </SheetFooter>
                </SheetContent>
              </Sheet>

              <Tabs value={view} onValueChange={(v) => setView(v as "grid" | "map")}>
                <TabsList className="bg-white/60 border border-gray-200">
                  <TabsTrigger value="grid" className="gap-2 data-[state=active]:bg-sky-50 data-[state=active]:text-sky-700">
                    <Grid3X3 className="h-4 w-4" />
                    <span className="hidden sm:inline">Grid</span>
                  </TabsTrigger>
                  <TabsTrigger value="map" className="gap-2 data-[state=active]:bg-sky-50 data-[state=active]:text-sky-700">
                    <Map className="h-4 w-4" />
                    <span className="hidden sm:inline">Map</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 md:hidden">
              {filters.neighborhoods.map((neighborhood) => (
                <Badge
                  key={neighborhood}
                  variant="secondary"
                  className="bg-sky-100 text-sky-700 hover:bg-sky-200 cursor-pointer transition-colors"
                  onClick={() => handleFiltersChange({ ...filters, neighborhoods: filters.neighborhoods.filter((n) => n !== neighborhood) })}
                >
                  {neighborhood}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
              {filters.beds !== null && (
                <Badge variant="secondary" className="bg-sky-100 text-sky-700 hover:bg-sky-200 cursor-pointer transition-colors" onClick={() => handleFiltersChange({ ...filters, beds: null })}>
                  {filters.beds === 0 ? "Studio" : `${filters.beds}+ beds`}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
              {filters.baths !== null && (
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 cursor-pointer transition-colors" onClick={() => handleFiltersChange({ ...filters, baths: null })}>
                  {filters.baths}+ baths
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
              {(filters.priceMin !== null || filters.priceMax !== null) && (
                <Badge variant="secondary" className="bg-sky-100 text-sky-700 hover:bg-sky-200 cursor-pointer transition-colors" onClick={() => handleFiltersChange({ ...filters, priceMin: null, priceMax: null })}>
                  {filters.priceMin && filters.priceMax
                    ? `$${filters.priceMin.toLocaleString()} - $${filters.priceMax.toLocaleString()}`
                    : filters.priceMin
                    ? `$${filters.priceMin.toLocaleString()}+`
                    : `Under $${filters.priceMax?.toLocaleString()}`}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-72 shrink-0">
            <Card variant="glass" className="sticky top-40 p-5 bg-white/70 backdrop-blur-xl border-sky-100/50 shadow-lg max-h-[calc(100vh-12rem)] overflow-y-auto">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-sky-500" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge className="ml-auto h-5 px-1.5 bg-sky-100 text-sky-700 text-xs">{activeFilterCount}</Badge>
                )}
              </h2>
              <PropertyFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                neighborhoods={availableNeighborhoods}
              />
            </Card>
          </aside>

          {/* Listings */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{pageTitle}</h1>
                <p className="text-gray-600 mt-1 flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  {loading ? "Loading..." : `${listings.length} propert${listings.length === 1 ? "y" : "ies"} found`}
                </p>
              </div>
              {(activeFilterCount > 0 || searchQuery) && (
                <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-gray-600 hover:text-sky-700 hover:bg-sky-50">
                  <X className="h-4 w-4 mr-1" />
                  Clear all
                </Button>
              )}
            </div>

            {loading ? (
              <PropertyCardSkeletonGrid count={6} />
            ) : view === "grid" ? (
              <div className={cn("grid gap-6", listings.length > 0 ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" : "")}>
                {listings.map((listing, index) => (
                  <div
                    key={listing.id}
                    className="animate-in fade-in-0 slide-in-from-bottom-4"
                    style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
                  >
                    <PropertyCard property={listing} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[calc(100vh-16rem)] rounded-xl overflow-hidden shadow-lg border border-sky-100/50">
                <PropertyMap
                  listings={listings}
                  center={mapCenter}
                  onMarkerClick={(id) => {
                    const listing = listings.find((l) => l.id === id);
                    if (listing) router.push(`/listings/${listing.slug}`);
                  }}
                />
              </div>
            )}

            {!loading && listings.length === 0 && (
              <Card variant="glass" className="p-12 text-center bg-white/70 backdrop-blur-xl border-sky-100/50 shadow-lg animate-in fade-in-0 zoom-in-95 duration-300">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-sky-200/30 rounded-full blur-xl animate-pulse" />
                  <MapPin className="h-16 w-16 text-sky-400 relative" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  No properties match your search. Try adjusting your filters or search terms.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="outline" onClick={clearAllFilters} className="border-sky-200 text-sky-700 hover:bg-sky-50">
                    <X className="h-4 w-4 mr-2" />
                    Clear all filters
                  </Button>
                  <Button variant="neon" onClick={clearAllFilters}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    View all properties
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ListingsPageSkeleton() {
  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-sky-50/30 to-white">
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
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          <aside className="hidden md:block w-72 shrink-0">
            <Card variant="glass" className="sticky top-40 p-5 bg-white/70 backdrop-blur-xl border-sky-100/50 shadow-lg">
              <Skeleton className="h-6 w-24 mb-4" />
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
              </div>
            </Card>
          </aside>
          <div className="flex-1 min-w-0">
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

export default function ListingsPage() {
  return (
    <Suspense fallback={<ListingsPageSkeleton />}>
      <ListingsPageContent />
    </Suspense>
  );
}
