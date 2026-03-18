"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, Home, ArrowLeft, MapPin } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      {/* Background gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-sky-50/50 via-white to-emerald-50/50 -z-10" />

      <Card variant="glass" className="max-w-lg w-full text-center bg-white/70 backdrop-blur-xl border-gray-200/60 shadow-xl">
        <CardHeader className="pb-4">
          {/* 404 Badge */}
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-sky-100 to-emerald-50 flex items-center justify-center shadow-lg shadow-sky-100/50">
            <span className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-emerald-500 bg-clip-text text-transparent">
              404
            </span>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Page Not Found
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            Oops! The page you&apos;re looking for doesn&apos;t exist or may have been moved.
            Let&apos;s get you back on track.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Helpful suggestions */}
          <div className="p-4 rounded-xl bg-sky-50/50 border border-sky-200/50 text-left">
            <p className="text-sm font-medium text-sky-700 mb-3">Here are some helpful links:</p>
            <ul className="space-y-2 text-sm text-sky-600">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <Link
                  href="/listings"
                  className="hover:text-sky-700 underline underline-offset-2"
                >
                  Browse all rental listings
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <Link
                  href="/listings?neighborhood=Brickell"
                  className="hover:text-sky-700 underline underline-offset-2"
                >
                  Search Brickell apartments
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                <Link
                  href="/"
                  className="hover:text-sky-700 underline underline-offset-2"
                >
                  Return to homepage
                </Link>
              </li>
            </ul>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="gradient"
              size="lg"
              asChild
              className="gap-2"
            >
              <Link href="/listings">
                <Search className="h-4 w-4" />
                Browse Listings
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
          </div>

          {/* Back navigation */}
          <div className="pt-4 border-t border-gray-200/60">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Go back to previous page
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
