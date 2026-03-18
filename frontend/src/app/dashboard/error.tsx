"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LayoutDashboard, RefreshCw, Home, LogOut, AlertCircle, Settings } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Dashboard error:", error);
  }, [error]);

  // Check if it's an authentication-related error
  const isAuthError = error.message?.toLowerCase().includes("auth") ||
                      error.message?.toLowerCase().includes("unauthorized") ||
                      error.message?.toLowerCase().includes("session");

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      {/* Background gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-sky-50/50 via-white to-teal-50/50 -z-10" />

      <Card variant="glass" className="max-w-lg w-full text-center bg-white/70 backdrop-blur-xl border-gray-200/60 shadow-xl">
        <CardHeader className="pb-4">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-sky-100 to-teal-50 flex items-center justify-center shadow-lg shadow-sky-100/50">
            <LayoutDashboard className="h-10 w-10 text-sky-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {isAuthError ? "Session Issue Detected" : "Dashboard Error"}
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            {isAuthError
              ? "There was a problem with your session. You may need to sign in again to continue."
              : "We encountered an issue loading your dashboard. Your data is safe and this is likely a temporary problem."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Context-specific help */}
          <div className="p-4 rounded-xl bg-sky-50/50 border border-sky-200/50 text-left">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-sky-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-sky-700 mb-2">
                  {isAuthError ? "What happened?" : "Common causes:"}
                </p>
                <ul className="text-sm text-sky-600 space-y-1 list-disc list-inside">
                  {isAuthError ? (
                    <>
                      <li>Your session may have expired</li>
                      <li>You may have been signed out</li>
                      <li>There was a problem verifying your identity</li>
                    </>
                  ) : (
                    <>
                      <li>Temporary server issues</li>
                      <li>Network connectivity problems</li>
                      <li>Browser cache conflicts</li>
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
              {error.digest && (
                <p className="text-xs text-gray-500 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {isAuthError ? (
              <>
                <Button
                  variant="gradient"
                  size="lg"
                  asChild
                  className="gap-2"
                >
                  <Link href="/login">
                    <LogOut className="h-4 w-4" />
                    Sign In Again
                  </Link>
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
              </>
            ) : (
              <>
                <Button
                  onClick={() => reset()}
                  variant="gradient"
                  size="lg"
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reload Dashboard
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
              </>
            )}
          </div>

          {/* Additional options */}
          <div className="pt-4 border-t border-gray-200/60">
            <p className="text-sm text-gray-500 mb-3">
              Need more help?
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="ghost" size="sm" asChild className="text-gray-600">
                <Link href="/contact">
                  Contact Support
                </Link>
              </Button>
              <span className="text-gray-300">|</span>
              <Button variant="ghost" size="sm" asChild className="text-gray-600">
                <Link href="/listings">
                  Browse Listings
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
