"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, useRequireAuth } from "@/lib/auth";
import { ProfileCompletionWizard } from "@/components/profile/profile-completion-wizard";
import { Navbar } from "@/components/layout/navbar";
import { Loader2 } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { shouldRedirect, redirectTo } = useRequireAuth("/login");

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (shouldRedirect) {
      router.replace(redirectTo);
    }
  }, [shouldRedirect, redirectTo, router]);

  const handleComplete = () => {
    // Redirect to appropriate dashboard after completion
    if (user?.role === "landlord") {
      router.push("/dashboard/landlord");
    } else {
      router.push("/dashboard/renter");
    }
  };

  const handleDismiss = () => {
    // Also redirect to dashboard if dismissed
    if (user?.role === "landlord") {
      router.push("/dashboard/landlord");
    } else {
      router.push("/dashboard/renter");
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-sky-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show redirecting message if user is not authenticated
  if (shouldRedirect) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-sky-500 mx-auto mb-4" />
            <p className="text-gray-600">Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50">
      <Navbar />
      <main className="pt-24 pb-12 px-4">
        <div className="max-w-lg mx-auto">
          <ProfileCompletionWizard
            isModal={false}
            onComplete={handleComplete}
            onDismiss={handleDismiss}
          />
        </div>
      </main>
    </div>
  );
}
