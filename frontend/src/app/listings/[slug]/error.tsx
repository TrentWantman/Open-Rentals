"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Home as HomeIcon, RefreshCw, Search, MapPin, AlertCircle } from "lucide-react";

export default function ListingDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Listing detail error:", error);
  }, [error]);

  // Check if it's a "not found" type error
  const isNotFoundError = error.message?.toLowerCase().includes("not found") ||
                          error.message?.toLowerCase().includes("404");

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      {/* Background gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-sky-50/50 via-white to-amber-50/30 -z-10" />

      <Card variant="glass" className="max-w-lg w-full text-center bg-white/70 backdrop-blur-xl border-gray-200/60 shadow-xl">
        <CardHeader className="pb-4">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-sky-100 to-amber-50 flex items-center justify-center shadow-lg shadow-sky-100/50">
            <HomeIcon className="h-10 w-10 text-sky-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {isNotFoundError ? "Property Not Found" : "Couldn't Load Property"}
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            {isNotFoundError
              ? "This property listing may have been removed or is no longer available. Let's help you find other great options."
              : "We encountered an issue loading this property. This could be a temporary problem with our servers."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Helpful info */}
          <div className="p-4 rounded-xl bg-sky-50/50 border border-sky-200/50 text-left">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-sky-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-sky-700 mb-2">
                  {isNotFoundError ? "Why might this happen?" : "What you can try:"}
                </p>
                <ul className="text-sm text-sky-600 space-y-1 list-disc list-inside">
                  {isNotFoundError ? (
                    <>
                      <li>The property was rented out</li>
                      <li>The landlord removed the listing</li>
                      <li>The URL may be incorrect</li>
                    </>
                  ) : (
                    <>
                      <li>Refresh the page</li>
                      <li>Check your internet connection</li>
                      <li>Try again in a few moments</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Error details (development only) */}
          {process.env.NODE_ENV === "development" && error.message && (
            <div className="p-4 rounded-xl bg-gray-50/50 border border-gray-200/50 text-left">
              <p className="text-sm font-medium text-gray-700 mb-1">Debug Info:</p>
              <p className="text-sm text-gray-600 font-mono break-all">
                {error.message}
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {!isNotFoundError && (
              <Button
                onClick={() => reset()}
                variant="gradient"
                size="lg"
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            )}
            <Button
              variant={isNotFoundError ? "gradient" : "outline"}
              size="lg"
              asChild
              className="gap-2"
            >
              <Link href="/listings">
                <Search className="h-4 w-4" />
                Browse All Listings
              </Link>
            </Button>
          </div>

          {/* Popular neighborhoods */}
          <div className="pt-4 border-t border-gray-200/60">
            <p className="text-sm text-gray-500 mb-3">
              Explore popular neighborhoods:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="neon" size="sm" asChild>
                <Link href="/listings?neighborhood=Brickell">
                  <MapPin className="h-3 w-3 mr-1" />
                  Brickell
                </Link>
              </Button>
              <Button variant="neon" size="sm" asChild>
                <Link href="/listings?neighborhood=Miami Beach">
                  <MapPin className="h-3 w-3 mr-1" />
                  Miami Beach
                </Link>
              </Button>
              <Button variant="neon" size="sm" asChild>
                <Link href="/listings?neighborhood=Coral Gables">
                  <MapPin className="h-3 w-3 mr-1" />
                  Coral Gables
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
