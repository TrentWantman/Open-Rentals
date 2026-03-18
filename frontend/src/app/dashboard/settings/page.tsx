"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Settings,
  Lock,
  Bell,
  Trash2,
  Eye,
  EyeOff,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Shield,
  Mail,
  MessageSquare,
  Smartphone,
  Globe,
  Moon,
  Sun,
  Monitor,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordErrors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

interface NotificationSettings {
  emailNewListings: boolean;
  emailApplicationUpdates: boolean;
  emailMessages: boolean;
  emailNewsletter: boolean;
  pushNewListings: boolean;
  pushApplicationUpdates: boolean;
  pushMessages: boolean;
  smsApplicationUpdates: boolean;
  smsMessages: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, logout, getAccessToken } = useAuth();

  const [activeTab, setActiveTab] = useState("password");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({});

  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNewListings: true,
    emailApplicationUpdates: true,
    emailMessages: true,
    emailNewsletter: false,
    pushNewListings: true,
    pushApplicationUpdates: true,
    pushMessages: true,
    smsApplicationUpdates: false,
    smsMessages: false,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const validatePassword = (): boolean => {
    const errors: PasswordErrors = {};

    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(passwordData.newPassword)) {
      errors.newPassword = "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(passwordData.newPassword)) {
      errors.newPassword = "Password must contain at least one lowercase letter";
    } else if (!/[0-9]/.test(passwordData.newPassword)) {
      errors.newPassword = "Password must contain at least one number";
    } else if (passwordData.newPassword === passwordData.currentPassword) {
      errors.newPassword = "New password must be different from current password";
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (passwordData.confirmPassword !== passwordData.newPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (passwordErrors[name as keyof PasswordErrors]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsChangingPassword(true);

    try {
      const token = getAccessToken();
      if (!token) {
        toast.error("Session expired. Please log in again.");
        router.push("/login");
        return;
      }

      // Simulate API call - replace with actual API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In production:
      // const response = await fetch(`${API_URL}/api/v1/auth/change-password`, {
      //   method: "POST",
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     current_password: passwordData.currentPassword,
      //     new_password: passwordData.newPassword,
      //   }),
      // });

      toast.success("Password changed successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Failed to change password:", error);
      toast.error("Failed to change password. Please try again.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveNotifications = async () => {
    setIsSavingNotifications(true);

    try {
      const token = getAccessToken();
      if (!token) {
        toast.error("Session expired. Please log in again.");
        router.push("/login");
        return;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Notification preferences saved");
    } catch (error) {
      console.error("Failed to save notifications:", error);
      toast.error("Failed to save preferences. Please try again.");
    } finally {
      setIsSavingNotifications(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      toast.error("Please type DELETE to confirm");
      return;
    }

    setIsDeletingAccount(true);

    try {
      const token = getAccessToken();
      if (!token) {
        toast.error("Session expired. Please log in again.");
        router.push("/login");
        return;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In production:
      // await fetch(`${API_URL}/api/v1/users/me`, {
      //   method: "DELETE",
      //   headers: { Authorization: `Bearer ${token}` },
      // });

      toast.success("Account deleted successfully");
      logout();
      router.push("/");
    } catch (error) {
      console.error("Failed to delete account:", error);
      toast.error("Failed to delete account. Please try again.");
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength: 25, label: "Weak", color: "bg-red-500" };
    if (strength <= 3) return { strength: 50, label: "Fair", color: "bg-amber-500" };
    if (strength <= 4) return { strength: 75, label: "Good", color: "bg-sky-500" };
    return { strength: 100, label: "Strong", color: "bg-emerald-500" };
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 pt-20 pb-12">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-sky-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading settings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const passwordStrength = getPasswordStrength(passwordData.newPassword);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild className="shrink-0">
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage your account preferences</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 grid w-full grid-cols-3">
            <TabsTrigger value="password" className="gap-2">
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
          </TabsList>

          {/* Password/Security Tab */}
          <TabsContent value="password">
            <Card variant="glass" className="bg-white/70 backdrop-blur-xl border-gray-200/60 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-sky-500" />
                  Change Password
                </CardTitle>
                <CardDescription>
                  Update your password to keep your account secure. We recommend using a strong, unique password.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter your current password"
                        className={cn("pr-10", passwordErrors.currentPassword && "border-red-400")}
                        aria-invalid={!!passwordErrors.currentPassword}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {passwordErrors.currentPassword && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {passwordErrors.currentPassword}
                      </p>
                    )}
                  </div>

                  <Separator />

                  {/* New Password */}
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Enter your new password"
                        className={cn("pr-10", passwordErrors.newPassword && "border-red-400")}
                        aria-invalid={!!passwordErrors.newPassword}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {passwordErrors.newPassword && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {passwordErrors.newPassword}
                      </p>
                    )}

                    {/* Password Strength Indicator */}
                    {passwordData.newPassword && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Password strength:</span>
                          <span className={cn(
                            "font-medium",
                            passwordStrength.label === "Weak" && "text-red-500",
                            passwordStrength.label === "Fair" && "text-amber-500",
                            passwordStrength.label === "Good" && "text-sky-500",
                            passwordStrength.label === "Strong" && "text-emerald-500"
                          )}>
                            {passwordStrength.label}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={cn("h-full transition-all duration-300", passwordStrength.color)}
                            style={{ width: `${passwordStrength.strength}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Confirm your new password"
                        className={cn("pr-10", passwordErrors.confirmPassword && "border-red-400")}
                        aria-invalid={!!passwordErrors.confirmPassword}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {passwordErrors.confirmPassword && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {passwordErrors.confirmPassword}
                      </p>
                    )}
                    {passwordData.confirmPassword &&
                     passwordData.confirmPassword === passwordData.newPassword &&
                     !passwordErrors.confirmPassword && (
                      <p className="text-sm text-emerald-500 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Passwords match
                      </p>
                    )}
                  </div>

                  {/* Password Requirements */}
                  <div className="bg-sky-50/50 rounded-lg p-4 border border-sky-100">
                    <p className="text-sm font-medium text-gray-700 mb-2">Password requirements:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li className={cn(
                        "flex items-center gap-2",
                        passwordData.newPassword.length >= 8 ? "text-emerald-600" : "text-gray-500"
                      )}>
                        {passwordData.newPassword.length >= 8 ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <div className="h-3 w-3 rounded-full border border-gray-300" />
                        )}
                        At least 8 characters
                      </li>
                      <li className={cn(
                        "flex items-center gap-2",
                        /[A-Z]/.test(passwordData.newPassword) ? "text-emerald-600" : "text-gray-500"
                      )}>
                        {/[A-Z]/.test(passwordData.newPassword) ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <div className="h-3 w-3 rounded-full border border-gray-300" />
                        )}
                        One uppercase letter
                      </li>
                      <li className={cn(
                        "flex items-center gap-2",
                        /[a-z]/.test(passwordData.newPassword) ? "text-emerald-600" : "text-gray-500"
                      )}>
                        {/[a-z]/.test(passwordData.newPassword) ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <div className="h-3 w-3 rounded-full border border-gray-300" />
                        )}
                        One lowercase letter
                      </li>
                      <li className={cn(
                        "flex items-center gap-2",
                        /[0-9]/.test(passwordData.newPassword) ? "text-emerald-600" : "text-gray-500"
                      )}>
                        {/[0-9]/.test(passwordData.newPassword) ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <div className="h-3 w-3 rounded-full border border-gray-300" />
                        )}
                        One number
                      </li>
                    </ul>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      variant="gradient"
                      disabled={isChangingPassword}
                    >
                      {isChangingPassword ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Changing Password...
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Change Password
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <div className="space-y-6">
              {/* Email Notifications */}
              <Card variant="glass" className="bg-white/70 backdrop-blur-xl border-gray-200/60 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-sky-500" />
                    Email Notifications
                  </CardTitle>
                  <CardDescription>
                    Choose what email notifications you want to receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNewListings" className="text-base cursor-pointer">
                        New Listings
                      </Label>
                      <p className="text-sm text-gray-500">
                        Get notified when new properties match your preferences
                      </p>
                    </div>
                    <Switch
                      id="emailNewListings"
                      checked={notifications.emailNewListings}
                      onCheckedChange={() => handleNotificationChange("emailNewListings")}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailApplicationUpdates" className="text-base cursor-pointer">
                        Application Updates
                      </Label>
                      <p className="text-sm text-gray-500">
                        Receive updates about your rental applications
                      </p>
                    </div>
                    <Switch
                      id="emailApplicationUpdates"
                      checked={notifications.emailApplicationUpdates}
                      onCheckedChange={() => handleNotificationChange("emailApplicationUpdates")}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailMessages" className="text-base cursor-pointer">
                        Messages
                      </Label>
                      <p className="text-sm text-gray-500">
                        Get notified when you receive new messages
                      </p>
                    </div>
                    <Switch
                      id="emailMessages"
                      checked={notifications.emailMessages}
                      onCheckedChange={() => handleNotificationChange("emailMessages")}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNewsletter" className="text-base cursor-pointer">
                        Newsletter
                      </Label>
                      <p className="text-sm text-gray-500">
                        Receive tips, market updates, and special offers
                      </p>
                    </div>
                    <Switch
                      id="emailNewsletter"
                      checked={notifications.emailNewsletter}
                      onCheckedChange={() => handleNotificationChange("emailNewsletter")}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Push Notifications */}
              <Card variant="glass" className="bg-white/70 backdrop-blur-xl border-gray-200/60 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-sky-500" />
                    Push Notifications
                  </CardTitle>
                  <CardDescription>
                    Manage push notifications on your devices
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <Label htmlFor="pushNewListings" className="text-base cursor-pointer">
                        New Listings
                      </Label>
                      <p className="text-sm text-gray-500">
                        Instant alerts for new matching properties
                      </p>
                    </div>
                    <Switch
                      id="pushNewListings"
                      checked={notifications.pushNewListings}
                      onCheckedChange={() => handleNotificationChange("pushNewListings")}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <Label htmlFor="pushApplicationUpdates" className="text-base cursor-pointer">
                        Application Updates
                      </Label>
                      <p className="text-sm text-gray-500">
                        Real-time updates on your applications
                      </p>
                    </div>
                    <Switch
                      id="pushApplicationUpdates"
                      checked={notifications.pushApplicationUpdates}
                      onCheckedChange={() => handleNotificationChange("pushApplicationUpdates")}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <Label htmlFor="pushMessages" className="text-base cursor-pointer">
                        Messages
                      </Label>
                      <p className="text-sm text-gray-500">
                        Instant message notifications
                      </p>
                    </div>
                    <Switch
                      id="pushMessages"
                      checked={notifications.pushMessages}
                      onCheckedChange={() => handleNotificationChange("pushMessages")}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* SMS Notifications */}
              <Card variant="glass" className="bg-white/70 backdrop-blur-xl border-gray-200/60 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-sky-500" />
                    SMS Notifications
                  </CardTitle>
                  <CardDescription>
                    Receive important updates via text message
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <Label htmlFor="smsApplicationUpdates" className="text-base cursor-pointer">
                        Application Updates
                      </Label>
                      <p className="text-sm text-gray-500">
                        Critical updates about your applications
                      </p>
                    </div>
                    <Switch
                      id="smsApplicationUpdates"
                      checked={notifications.smsApplicationUpdates}
                      onCheckedChange={() => handleNotificationChange("smsApplicationUpdates")}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <Label htmlFor="smsMessages" className="text-base cursor-pointer">
                        Urgent Messages
                      </Label>
                      <p className="text-sm text-gray-500">
                        Text alerts for time-sensitive messages
                      </p>
                    </div>
                    <Switch
                      id="smsMessages"
                      checked={notifications.smsMessages}
                      onCheckedChange={() => handleNotificationChange("smsMessages")}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button
                  variant="gradient"
                  onClick={handleSaveNotifications}
                  disabled={isSavingNotifications}
                >
                  {isSavingNotifications ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Preferences
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account">
            <div className="space-y-6">
              {/* Danger Zone */}
              <Card variant="glass" className="bg-white/70 backdrop-blur-xl border-red-200/60 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    Danger Zone
                  </CardTitle>
                  <CardDescription>
                    Irreversible and destructive actions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-red-50/50 border border-red-200 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">Delete Account</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" className="shrink-0">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Account
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                              <AlertTriangle className="h-5 w-5" />
                              Delete Your Account?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="space-y-4">
                              <p>
                                This action is <strong>permanent and irreversible</strong>. All your data will be deleted, including:
                              </p>
                              <ul className="list-disc list-inside text-sm space-y-1">
                                <li>Your profile information</li>
                                <li>All saved listings and favorites</li>
                                <li>Application history</li>
                                <li>Messages and conversations</li>
                                {user.role === "landlord" && (
                                  <li>All your property listings</li>
                                )}
                              </ul>
                              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                                <Label htmlFor="deleteConfirm" className="text-sm font-medium text-gray-700">
                                  Type <strong>DELETE</strong> to confirm:
                                </Label>
                                <Input
                                  id="deleteConfirm"
                                  value={deleteConfirmText}
                                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                                  placeholder="DELETE"
                                  className="mt-2"
                                />
                              </div>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setDeleteConfirmText("")}>
                              Cancel
                            </AlertDialogCancel>
                            <Button
                              variant="destructive"
                              onClick={handleDeleteAccount}
                              disabled={deleteConfirmText !== "DELETE" || isDeletingAccount}
                            >
                              {isDeletingAccount ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Deleting...
                                </>
                              ) : (
                                <>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete My Account
                                </>
                              )}
                            </Button>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">Export Your Data</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Download a copy of all your data before deleting your account.
                      </p>
                    </div>
                    <Button variant="outline" className="shrink-0">
                      <Globe className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
