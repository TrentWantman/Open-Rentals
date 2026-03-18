"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, useRequireAuth } from "@/lib/auth";
import { ProfileCompletionWizard } from "@/components/profile/profile-completion-wizard";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  Building2,
  Shield,
  Edit,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  DollarSign,
  Home,
  Loader2,
  Camera,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { shouldRedirect, redirectTo } = useRequireAuth("/login");
  const [showProfileWizard, setShowProfileWizard] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (shouldRedirect) {
      router.replace(redirectTo);
    }
  }, [shouldRedirect, redirectTo, router]);

  const isLandlord = user?.role === "landlord";
  const profileCompletion = profileComplete ? 100 : (isLandlord ? 45 : 65);

  const handleProfileComplete = useCallback(() => {
    setShowProfileWizard(false);
    setProfileComplete(true);
    toast.success("Profile updated successfully!", {
      description: "Your changes have been saved.",
    });
  }, []);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-sky-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show redirecting message if user is not authenticated
  if (shouldRedirect || !user) {
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

  const dashboardUrl = isLandlord ? "/dashboard/landlord" : "/dashboard/renter";

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50">
      <Navbar />
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            asChild
            className="mb-6"
          >
            <Link href={dashboardUrl}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>

          {/* Profile Header Card */}
          <Card variant="glass" className="p-6 mb-6 bg-white/70 backdrop-blur-xl border-sky-100 shadow-lg">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar Section */}
              <div className="relative">
                <Avatar className="h-28 w-28 ring-4 ring-white shadow-xl">
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback className="text-3xl bg-gradient-to-br from-sky-100 to-emerald-100 text-sky-600">
                    {user.firstName?.[0] || user.email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <button
                  className="absolute -bottom-2 -right-2 p-2.5 bg-white rounded-full shadow-lg cursor-pointer hover:bg-sky-50 transition-colors border border-gray-200"
                  onClick={() => toast.info("Photo upload coming soon!")}
                >
                  <Camera className="h-4 w-4 text-sky-600" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h1>
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "capitalize",
                        isLandlord
                          ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                          : "bg-sky-100 text-sky-700 border-sky-200"
                      )}
                    >
                      {user.role}
                    </Badge>
                    {user.isVerified && (
                      <Badge className="bg-emerald-500 text-white">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </p>

                {/* Profile Progress */}
                <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-sky-50/80 to-emerald-50/80 border border-sky-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                    <span className={cn(
                      "text-sm font-bold",
                      profileCompletion === 100 ? "text-emerald-600" : "text-sky-600"
                    )}>
                      {profileCompletion}%
                    </span>
                  </div>
                  <Progress value={profileCompletion} variant="gradient" className="h-2" />
                  {profileCompletion < 100 && (
                    <p className="text-xs text-gray-500 mt-2">
                      Complete your profile to unlock all features
                    </p>
                  )}
                </div>
              </div>

              {/* Edit Button */}
              <Button
                variant="gradient"
                onClick={() => setShowProfileWizard(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                {profileCompletion < 100 ? "Complete Profile" : "Edit Profile"}
              </Button>
            </div>
          </Card>

          {/* Profile Details Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card variant="glass" className="bg-white/70 backdrop-blur-sm border-sky-100 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5 text-sky-500" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoRow
                  icon={User}
                  label="Full Name"
                  value={`${user.firstName} ${user.lastName}`}
                  filled={!!(user.firstName && user.lastName)}
                />
                <InfoRow
                  icon={Mail}
                  label="Email"
                  value={user.email}
                  filled={true}
                />
                <InfoRow
                  icon={Phone}
                  label="Phone"
                  value="Not provided"
                  filled={false}
                />
                <InfoRow
                  icon={MapPin}
                  label="Location"
                  value="Not provided"
                  filled={false}
                />
              </CardContent>
            </Card>

            {/* Role-Specific Information */}
            {isLandlord ? (
              <Card variant="glass" className="bg-white/70 backdrop-blur-sm border-sky-100 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-emerald-500" />
                    Business Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InfoRow
                    icon={Building2}
                    label="Company Name"
                    value="Not provided"
                    filled={false}
                  />
                  <InfoRow
                    icon={Briefcase}
                    label="Business Type"
                    value="Not provided"
                    filled={false}
                  />
                  <InfoRow
                    icon={Home}
                    label="Properties Managed"
                    value="Not provided"
                    filled={false}
                  />
                  <InfoRow
                    icon={Shield}
                    label="Verification Status"
                    value={user.isVerified ? "Verified" : "Not verified"}
                    filled={user.isVerified}
                  />
                </CardContent>
              </Card>
            ) : (
              <Card variant="glass" className="bg-white/70 backdrop-blur-sm border-sky-100 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Home className="h-5 w-5 text-sky-500" />
                    Rental Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InfoRow
                    icon={DollarSign}
                    label="Income Range"
                    value="Not provided"
                    filled={false}
                  />
                  <InfoRow
                    icon={Briefcase}
                    label="Employment Status"
                    value="Not provided"
                    filled={false}
                  />
                  <InfoRow
                    icon={Calendar}
                    label="Desired Move-in Date"
                    value="Not provided"
                    filled={false}
                  />
                  <InfoRow
                    icon={MapPin}
                    label="Preferred Neighborhoods"
                    value="Not selected"
                    filled={false}
                  />
                </CardContent>
              </Card>
            )}

            {/* Preferences */}
            <Card variant="glass" className="bg-white/70 backdrop-blur-sm border-sky-100 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-teal-500" />
                  Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <PreferenceRow
                  label="Email Notifications"
                  enabled={true}
                />
                <PreferenceRow
                  label="SMS Notifications"
                  enabled={false}
                />
                <PreferenceRow
                  label="Marketing Emails"
                  enabled={false}
                />
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card variant="glass" className="bg-white/70 backdrop-blur-sm border-sky-100 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-gray-500" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => toast.info("Password change coming soon!")}
                >
                  Change Password
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => toast.info("Two-factor auth coming soon!")}
                >
                  Enable Two-Factor Authentication
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => toast.info("Account deletion coming soon!")}
                >
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Profile Completion Wizard Modal */}
      {showProfileWizard && (
        <ProfileCompletionWizard
          isModal={true}
          onComplete={handleProfileComplete}
          onDismiss={() => setShowProfileWizard(false)}
        />
      )}
    </div>
  );
}

// Helper Components
interface InfoRowProps {
  icon: React.ElementType;
  label: string;
  value: string;
  filled: boolean;
}

function InfoRow({ icon: Icon, label, value, filled }: InfoRowProps) {
  return (
    <div className="flex items-center gap-3">
      <div className={cn(
        "p-2 rounded-lg",
        filled ? "bg-emerald-50" : "bg-gray-100"
      )}>
        <Icon className={cn(
          "h-4 w-4",
          filled ? "text-emerald-500" : "text-gray-400"
        )} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className={cn(
          "text-sm truncate",
          filled ? "text-gray-900" : "text-gray-400 italic"
        )}>
          {value}
        </p>
      </div>
      {!filled && (
        <AlertCircle className="h-4 w-4 text-amber-500" />
      )}
    </div>
  );
}

interface PreferenceRowProps {
  label: string;
  enabled: boolean;
}

function PreferenceRow({ label, enabled }: PreferenceRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-700">{label}</span>
      <Badge
        variant="outline"
        className={cn(
          enabled
            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
            : "bg-gray-100 text-gray-500 border-gray-200"
        )}
      >
        {enabled ? "Enabled" : "Disabled"}
      </Badge>
    </div>
  );
}
