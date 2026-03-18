"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building2, RefreshCw, Home, Search, AlertCircle } from "lucide-react";

export default function ListingsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Listings error:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      {/* Background gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-amber-50/30 via-white to-sky-50/50 -z-10" />

      <Card variant="glass" className="max-w-lg w-full text-center bg-white/70 backdrop-blur-xl border-gray-200/60 shadow-xl">
        <CardHeader className="pb-4">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center shadow-lg shadow-amber-100/50">
            <Building2 className="h-10 w-10 text-amber-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Unable to Load Listings
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            We had trouble loading the property listings. This could be a temporary issue
            with our servers or your connection.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Troubleshooting tips */}
          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/50 text-left">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-700 mb-2">Try these steps:</p>
                <ul className="text-sm text-amber-600 space-y-1 list-disc list-inside">
                  <li>Check your internet connection</li>
                  <li>Refresh the page</li>
                  <li>Clear your browser cache</li>
                  <li>Try again in a few minutes</li>
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
            <Button
              onClick={() => reset()}
              variant="gradient"
              size="lg"
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry Loading
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="gap-2"
            >
              <Link href="/">
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </Button>
          </div>

          {/* Alternative actions */}
          <div className="pt-4 border-t border-gray-200/60">
            <p className="text-sm text-gray-500 mb-3">
              Or try searching for specific properties:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="neon" size="sm" asChild>
                <Link href="/listings?neighborhood=Brickell">Brickell</Link>
              </Button>
              <Button variant="neon" size="sm" asChild>
                <Link href="/listings?neighborhood=Miami Beach">Miami Beach</Link>
              </Button>
              <Button variant="neon" size="sm" asChild>
                <Link href="/listings?neighborhood=Coral Gables">Coral Gables</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
