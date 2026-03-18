"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth, useRedirectIfAuthenticated } from "@/lib/auth";
import { Loader2, Mail, Lock, ArrowRight, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { shouldRedirect, isLoading: authLoading, user } = useRedirectIfAuthenticated();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (shouldRedirect && user) {
      const destination = user.role === "landlord" ? "/dashboard/landlord" : "/dashboard/renter";
      router.replace(destination);
    }
  }, [shouldRedirect, user, router]);

  // Validation state
  const validation = useMemo(() => {
    const emailValid = EMAIL_REGEX.test(formData.email);
    const passwordValid = formData.password.length >= 8;

    return {
      email: {
        valid: emailValid,
        message: formData.email.length === 0 ? "" : emailValid ? "" : "Please enter a valid email address",
      },
      password: {
        valid: passwordValid,
        message: formData.password.length === 0 ? "" : passwordValid ? "" : "Password must be at least 8 characters",
      },
    };
  }, [formData]);

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const isFormValid = validation.email.valid && validation.password.valid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ email: true, password: true });

    if (!isFormValid) {
      toast.error("Please fix the validation errors before submitting");
      return;
    }

    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid email or password";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to get input border style based on validation state
  const getInputBorderClass = (field: keyof typeof validation) => {
    if (!touched[field] || formData[field].length === 0) return "";
    return validation[field].valid
      ? "border-emerald-500 focus-visible:ring-emerald-500"
      : "border-red-500 focus-visible:ring-red-500";
  };

  // Helper to get validation icon
  const ValidationIcon = ({ field }: { field: keyof typeof validation }) => {
    if (!touched[field] || formData[field].length === 0) return null;
    return validation[field].valid ? (
      <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
    ) : (
      <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
    );
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <Card variant="glass" className="w-full bg-white/70 backdrop-blur-xl border-white/50 shadow-xl shadow-sky-100/50">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
        </CardContent>
      </Card>
    );
  }

  // Show redirect message if user is authenticated
  if (shouldRedirect) {
    return (
      <Card variant="glass" className="w-full bg-white/70 backdrop-blur-xl border-white/50 shadow-xl shadow-sky-100/50">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-sky-500 mb-4" />
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="glass" className="w-full bg-white/70 backdrop-blur-xl border-white/50 shadow-xl shadow-sky-100/50">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
        <CardDescription className="text-gray-500">
          Sign in to access your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className={cn("pl-10 pr-10", getInputBorderClass("email"))}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onBlur={() => handleBlur("email")}
                required
              />
              <ValidationIcon field="email" />
            </div>
            {touched.email && validation.email.message && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {validation.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <Link
                href="/forgot-password"
                className="text-sm text-sky-500 hover:text-sky-600 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className={cn("pl-10 pr-10", getInputBorderClass("password"))}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                onBlur={() => handleBlur("password")}
                required
              />
              <ValidationIcon field="password" />
            </div>
            {touched.password && validation.password.message && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {validation.password.message}
              </p>
            )}
            {/* Password requirements hint */}
            <div className="text-xs text-gray-500 bg-gray-50 rounded-md p-2 mt-2">
              <p className="font-medium mb-1">Password requirements:</p>
              <ul className="space-y-0.5">
                <li className={cn(
                  "flex items-center gap-1",
                  formData.password.length >= 8 ? "text-emerald-600" : "text-gray-500"
                )}>
                  {formData.password.length >= 8 ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <span className="h-3 w-3 rounded-full border border-gray-300 inline-block" />
                  )}
                  At least 8 characters
                </li>
              </ul>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-gradient-to-r from-sky-500 to-sky-400 hover:from-sky-600 hover:to-sky-500 text-white shadow-lg shadow-sky-200/50"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </form>

        <div className="relative">
          <Separator className="bg-gray-200" />
          <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-xs text-gray-400">
            OR
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-11 bg-white/50 border-gray-200 text-gray-700 hover:bg-gray-50" disabled>
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </Button>
          <Button variant="outline" className="h-11 bg-white/50 border-gray-200 text-gray-700 hover:bg-gray-50" disabled>
            <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </Button>
        </div>

        <p className="text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-sky-500 hover:text-sky-600 font-medium transition-colors"
          >
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
