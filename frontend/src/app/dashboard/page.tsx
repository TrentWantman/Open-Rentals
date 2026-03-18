"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login");
      } else {
        setRedirecting(true);
        if (user.role === "landlord") {
          router.push("/dashboard/landlord");
        } else {
          router.push("/dashboard/renter");
        }
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 flex items-center justify-center">
      <Card variant="glass" className="p-8 text-center max-w-sm mx-4 bg-white/70 backdrop-blur-xl border-sky-100 shadow-lg">
        <Loader2 className="h-10 w-10 animate-spin text-sky-500 mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          {isLoading ? "Loading..." : redirecting ? "Redirecting..." : "Preparing your dashboard"}
        </h2>
        <p className="text-gray-600 text-sm">
          {isLoading
            ? "Checking your authentication status"
            : redirecting
              ? `Taking you to your ${user?.role === "landlord" ? "landlord" : "renter"} dashboard`
              : "Please wait..."}
        </p>
      </Card>
    </div>
  );
}
