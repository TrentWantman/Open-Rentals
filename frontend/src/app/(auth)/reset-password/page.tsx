"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { authApi } from "@/lib/api";
import { Loader2, Lock, ArrowLeft, CheckCircle, XCircle, AlertCircle, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Password validation
const hasMinLength = (password: string) => password.length >= 8;
const hasUppercase = (password: string) => /[A-Z]/.test(password);
const hasDigit = (password: string) => /\d/.test(password);

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false,
  });

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      toast.error("Invalid reset link. Please request a new one.");
      router.push("/forgot-password");
    }
  }, [token, router]);

  // Validation state
  const validation = useMemo(() => {
    const passwordValid = hasMinLength(formData.password) && hasUppercase(formData.password) && hasDigit(formData.password);
    const confirmValid = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;

    return {
      password: {
        valid: passwordValid,
        minLength: hasMinLength(formData.password),
        hasUppercase: hasUppercase(formData.password),
        hasDigit: hasDigit(formData.password),
      },
      confirmPassword: {
        valid: confirmValid,
        message: formData.confirmPassword.length === 0 ? "" : confirmValid ? "" : "Passwords do not match",
      },
    };
  }, [formData]);

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const isFormValid = validation.password.valid && validation.confirmPassword.valid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ password: true, confirmPassword: true });

    if (!isFormValid) {
      toast.error("Please fix the validation errors");
      return;
    }

    if (!token) {
      toast.error("Invalid reset link");
      return;
    }

    setIsLoading(true);

    try {
      await authApi.resetPassword(token, formData.password);
      setIsSubmitted(true);
      toast.success("Password reset successfully!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to reset password. The link may have expired.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to get input border style
  const getInputBorderClass = (field: "password" | "confirmPassword") => {
    if (!touched[field] || formData[field].length === 0) return "";
    if (field === "password") {
      return validation.password.valid
        ? "border-emerald-500 focus-visible:ring-emerald-500"
        : "border-red-500 focus-visible:ring-red-500";
    }
    return validation.confirmPassword.valid
      ? "border-emerald-500 focus-visible:ring-emerald-500"
      : "border-red-500 focus-visible:ring-red-500";
  };

  // Success state
  if (isSubmitted) {
    return (
      <Card variant="glass" className="w-full bg-white/70 backdrop-blur-xl border-white/50 shadow-xl shadow-sky-100/50">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center mb-4 shadow-lg shadow-emerald-200/50">
            <CheckCircle className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Password Reset!</CardTitle>
          <CardDescription className="text-gray-500">
            Your password has been successfully updated. You can now sign in with your new password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/login" className="block">
            <Button className="w-full h-11 bg-gradient-to-r from-sky-500 to-sky-400 hover:from-sky-600 hover:to-sky-500 text-white shadow-lg shadow-sky-200/50">
              Sign In Now
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (!token) {
    return (
      <Card variant="glass" className="w-full bg-white/70 backdrop-blur-xl border-white/50 shadow-xl shadow-sky-100/50">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="glass" className="w-full bg-white/70 backdrop-blur-xl border-white/50 shadow-xl shadow-sky-100/50">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-sky-500 flex items-center justify-center mb-4 shadow-lg shadow-sky-200/50">
          <KeyRound className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900">Set New Password</CardTitle>
        <CardDescription className="text-gray-500">
          Create a strong password to secure your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700">New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="Enter new password"
                className={cn("pl-10 pr-10", getInputBorderClass("password"))}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                onBlur={() => handleBlur("password")}
                required
                autoFocus
              />
              {touched.password && formData.password.length > 0 && (
                validation.password.valid ? (
                  <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                ) : (
                  <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
                )
              )}
            </div>

            {/* Password requirements */}
            <div className="text-xs text-gray-500 bg-gray-50 rounded-md p-2 mt-2">
              <p className="font-medium mb-1">Password requirements:</p>
              <ul className="space-y-0.5">
                <li className={cn(
                  "flex items-center gap-1",
                  validation.password.minLength ? "text-emerald-600" : "text-gray-500"
                )}>
                  {validation.password.minLength ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <span className="h-3 w-3 rounded-full border border-gray-300 inline-block" />
                  )}
                  At least 8 characters
                </li>
                <li className={cn(
                  "flex items-center gap-1",
                  validation.password.hasUppercase ? "text-emerald-600" : "text-gray-500"
                )}>
                  {validation.password.hasUppercase ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <span className="h-3 w-3 rounded-full border border-gray-300 inline-block" />
                  )}
                  At least one uppercase letter
                </li>
                <li className={cn(
                  "flex items-center gap-1",
                  validation.password.hasDigit ? "text-emerald-600" : "text-gray-500"
                )}>
                  {validation.password.hasDigit ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <span className="h-3 w-3 rounded-full border border-gray-300 inline-block" />
                  )}
                  At least one number
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-700">Confirm New Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                className={cn("pl-10 pr-10", getInputBorderClass("confirmPassword"))}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                onBlur={() => handleBlur("confirmPassword")}
                required
              />
              {touched.confirmPassword && formData.confirmPassword.length > 0 && (
                validation.confirmPassword.valid ? (
                  <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                ) : (
                  <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
                )
              )}
            </div>
            {touched.confirmPassword && validation.confirmPassword.message && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {validation.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-gradient-to-r from-sky-500 to-sky-400 hover:from-sky-600 hover:to-sky-500 text-white shadow-lg shadow-sky-200/50"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>

        <Link href="/login" className="block">
          <Button
            variant="ghost"
            className="w-full h-11 text-sky-600 hover:text-sky-700 hover:bg-sky-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sign In
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <Card variant="glass" className="w-full bg-white/70 backdrop-blur-xl border-white/50 shadow-xl shadow-sky-100/50">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
        </CardContent>
      </Card>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
