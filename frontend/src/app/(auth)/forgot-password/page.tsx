"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { authApi } from "@/lib/api";
import { Loader2, Mail, ArrowLeft, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);

  // Validation state
  const validation = useMemo(() => {
    const emailValid = EMAIL_REGEX.test(email);
    return {
      valid: emailValid,
      message: email.length === 0 ? "" : emailValid ? "" : "Please enter a valid email address",
    };
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    if (!validation.valid) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      await authApi.forgotPassword(email);
      setIsSubmitted(true);
      toast.success("Check your email for reset instructions");
    } catch (error) {
      // Still show success for security (don't reveal if email exists)
      setIsSubmitted(true);
      toast.success("Check your email for reset instructions");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to get input border style
  const getInputBorderClass = () => {
    if (!touched || email.length === 0) return "";
    return validation.valid
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
          <CardTitle className="text-2xl font-bold text-gray-900">Check Your Email</CardTitle>
          <CardDescription className="text-gray-500">
            We&apos;ve sent password reset instructions to <span className="font-medium text-gray-700">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-sky-50 border border-sky-100 rounded-lg p-4">
            <p className="text-sm text-sky-700">
              If you don&apos;t see the email in your inbox, please check your spam folder. The reset link will expire in 1 hour.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => {
                setIsSubmitted(false);
                setEmail("");
                setTouched(false);
              }}
              variant="outline"
              className="w-full h-11 border-gray-200 text-gray-700 hover:bg-gray-50"
            >
              Try a different email
            </Button>

            <Link href="/login" className="block">
              <Button
                variant="ghost"
                className="w-full h-11 text-sky-600 hover:text-sky-700 hover:bg-sky-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sign In
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="glass" className="w-full bg-white/70 backdrop-blur-xl border-white/50 shadow-xl shadow-sky-100/50">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold text-gray-900">Forgot Password?</CardTitle>
        <CardDescription className="text-gray-500">
          No worries! Enter your email and we&apos;ll send you reset instructions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className={cn("pl-10 pr-10", getInputBorderClass())}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(true)}
                required
                autoFocus
              />
              {touched && email.length > 0 && (
                validation.valid ? (
                  <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                ) : (
                  <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
                )
              )}
            </div>
            {touched && validation.message && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {validation.message}
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
              "Send Reset Instructions"
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
