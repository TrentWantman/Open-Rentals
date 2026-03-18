"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      {/* Background gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-rose-50/50 via-white to-sky-50/50 -z-10" />

      <Card variant="glass" className="max-w-lg w-full text-center bg-white/70 backdrop-blur-xl border-gray-200/60 shadow-xl">
        <CardHeader className="pb-4">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-rose-100 to-rose-50 flex items-center justify-center shadow-lg shadow-rose-100/50">
            <AlertTriangle className="h-10 w-10 text-rose-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Something went wrong
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            We encountered an unexpected error while processing your request.
            Don&apos;t worry, our team has been notified.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error details (only in development) */}
          {process.env.NODE_ENV === "development" && error.message && (
            <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200/50 text-left">
              <p className="text-sm font-medium text-rose-700 mb-1">Error Details:</p>
              <p className="text-sm text-rose-600 font-mono break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-rose-500 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
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
              Try Again
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

          {/* Additional help */}
          <div className="pt-4 border-t border-gray-200/60">
            <p className="text-sm text-gray-500">
              If the problem persists, please{" "}
              <Link
                href="/contact"
                className="text-sky-600 hover:text-sky-700 underline underline-offset-2"
              >
                contact our support team
              </Link>
              .
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
