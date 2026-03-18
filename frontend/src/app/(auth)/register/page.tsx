"use client";

import { useState, Suspense, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth, useRedirectIfAuthenticated } from "@/lib/auth";
import { Loader2, Mail, Lock, User, ArrowRight, Home, Key, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type UserRole = "renter" | "landlord";

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Password strength calculation
const calculatePasswordStrength = (password: string): { score: number; label: string; color: string } => {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { score, label: "Weak", color: "bg-red-500" };
  if (score <= 4) return { score, label: "Medium", color: "bg-yellow-500" };
  return { score, label: "Strong", color: "bg-emerald-500" };
};

const roleOptions = [
  {
    role: "renter" as UserRole,
    title: "I'm looking to rent",
    description: "Browse listings, save favorites, and apply for properties",
    icon: Home,
    features: ["Save favorite listings", "Track applications", "Direct messaging with landlords"],
  },
  {
    role: "landlord" as UserRole,
    title: "I'm a landlord",
    description: "List properties, screen tenants, and manage rentals",
    icon: Key,
    features: ["List unlimited properties", "Tenant screening tools", "Analytics dashboard"],
  },
];

function RegisterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useAuth();
  const { shouldRedirect, isLoading: authLoading, user } = useRedirectIfAuthenticated();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"role" | "details">(
    searchParams.get("role") ? "details" : "role"
  );
  const [selectedRole, setSelectedRole] = useState<UserRole>(
    (searchParams.get("role") as UserRole) || "renter"
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
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
    const nameValid = formData.name.trim().length >= 2 && formData.name.trim().includes(" ") === false
      ? formData.name.trim().length >= 2
      : formData.name.trim().split(" ").filter(Boolean).length >= 1;
    const emailValid = EMAIL_REGEX.test(formData.email);
    const passwordValid = formData.password.length >= 8;
    const passwordsMatch = formData.password === formData.confirmPassword && formData.confirmPassword.length > 0;

    return {
      name: {
        valid: nameValid && formData.name.trim().length >= 2,
        message: formData.name.length === 0
          ? ""
          : formData.name.trim().length < 2
            ? "Name must be at least 2 characters"
            : "",
      },
      email: {
        valid: emailValid,
        message: formData.email.length === 0 ? "" : emailValid ? "" : "Please enter a valid email address",
      },
      password: {
        valid: passwordValid,
        message: formData.password.length === 0 ? "" : passwordValid ? "" : "Password must be at least 8 characters",
      },
      confirmPassword: {
        valid: passwordsMatch,
        message: formData.confirmPassword.length === 0
          ? ""
          : passwordsMatch
            ? ""
            : "Passwords do not match",
      },
    };
  }, [formData]);

  const passwordStrength = useMemo(() => calculatePasswordStrength(formData.password), [formData.password]);

  const passwordRequirements = useMemo(() => [
    { label: "At least 8 characters", met: formData.password.length >= 8 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(formData.password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(formData.password) },
    { label: "Contains a number", met: /[0-9]/.test(formData.password) },
    { label: "Contains special character", met: /[^A-Za-z0-9]/.test(formData.password) },
  ], [formData.password]);

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const isFormValid = validation.name.valid && validation.email.valid && validation.password.valid && validation.confirmPassword.valid;

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep("details");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    if (!isFormValid) {
      toast.error("Please fix the validation errors before submitting");
      return;
    }

    setIsLoading(true);

    try {
      // Split name into first/last name
      const nameParts = formData.name.trim().split(" ");
      const firstName = nameParts[0] || formData.name;
      const lastName = nameParts.slice(1).join(" ") || "";

      await register({
        email: formData.email,
        password: formData.password,
        firstName,
        lastName,
        role: selectedRole,
      });
      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";
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
        <CardTitle className="text-2xl font-bold text-gray-900">
          {step === "role" ? "Join Open Rentals" : "Create Your Account"}
        </CardTitle>
        <CardDescription className="text-gray-500">
          {step === "role"
            ? "Choose how you want to use Open Rentals"
            : `Signing up as a ${selectedRole}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {step === "role" ? (
          <div className="space-y-4">
            {roleOptions.map((option) => (
              <button
                key={option.role}
                onClick={() => handleRoleSelect(option.role)}
                className={cn(
                  "w-full p-5 rounded-xl text-left transition-all duration-200",
                  "border border-gray-200 hover:border-sky-300",
                  "bg-white/50 hover:bg-white/80",
                  "hover:shadow-lg hover:shadow-sky-100/50"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
                    <option.icon className="h-6 w-6 text-sky-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{option.title}</h3>
                    <p className="text-sm text-gray-500 mb-3">{option.description}</p>
                    <ul className="space-y-1">
                      {option.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-xs text-gray-600">
                          <CheckCircle className="h-3 w-3 text-emerald-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    className={cn("pl-10 pr-10", getInputBorderClass("name"))}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    onBlur={() => handleBlur("name")}
                    required
                  />
                  <ValidationIcon field="name" />
                </div>
                {touched.name && validation.name.message && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {validation.name.message}
                  </p>
                )}
              </div>

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
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a strong password"
                    className={cn("pl-10 pr-10", getInputBorderClass("password"))}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    onBlur={() => handleBlur("password")}
                    required
                    minLength={8}
                  />
                  <ValidationIcon field="password" />
                </div>
                {touched.password && validation.password.message && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {validation.password.message}
                  </p>
                )}

                {/* Password strength indicator */}
                {formData.password.length > 0 && (
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full transition-all duration-300",
                            passwordStrength.color
                          )}
                          style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                        />
                      </div>
                      <span className={cn(
                        "text-xs font-medium",
                        passwordStrength.label === "Weak" && "text-red-500",
                        passwordStrength.label === "Medium" && "text-yellow-600",
                        passwordStrength.label === "Strong" && "text-emerald-500"
                      )}>
                        {passwordStrength.label}
                      </span>
                    </div>

                    {/* Password requirements checklist */}
                    <div className="text-xs text-gray-500 bg-gray-50 rounded-md p-2">
                      <p className="font-medium mb-1">Password requirements:</p>
                      <ul className="space-y-0.5">
                        {passwordRequirements.map((req, i) => (
                          <li
                            key={i}
                            className={cn(
                              "flex items-center gap-1",
                              req.met ? "text-emerald-600" : "text-gray-500"
                            )}
                          >
                            {req.met ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : (
                              <span className="h-3 w-3 rounded-full border border-gray-300 inline-block" />
                            )}
                            {req.label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    className={cn("pl-10 pr-10", getInputBorderClass("confirmPassword"))}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    onBlur={() => handleBlur("confirmPassword")}
                    required
                  />
                  <ValidationIcon field="confirmPassword" />
                </div>
                {touched.confirmPassword && validation.confirmPassword.message && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {validation.confirmPassword.message}
                  </p>
                )}
                {/* Real-time password match indicator */}
                {formData.confirmPassword.length > 0 && formData.password.length > 0 && (
                  <p className={cn(
                    "text-sm flex items-center gap-1",
                    formData.password === formData.confirmPassword ? "text-emerald-500" : "text-gray-500"
                  )}>
                    {formData.password === formData.confirmPassword ? (
                      <>
                        <CheckCircle className="h-3 w-3" />
                        Passwords match
                      </>
                    ) : (
                      <>
                        <span className="h-3 w-3 rounded-full border border-gray-300 inline-block" />
                        Passwords must match
                      </>
                    )}
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
                  <>
                    Create Account
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <Button
              variant="ghost"
              className="w-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              onClick={() => setStep("role")}
            >
              Back to role selection
            </Button>
          </>
        )}

        <Separator className="bg-gray-200" />

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-sky-500 hover:text-sky-600 font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>

        <p className="text-center text-xs text-gray-400">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="text-gray-500 hover:text-gray-900">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-gray-500 hover:text-gray-900">
            Privacy Policy
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <Card variant="glass" className="w-full bg-white/70 backdrop-blur-xl border-white/50 shadow-xl shadow-sky-100/50">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
        </CardContent>
      </Card>
    }>
      <RegisterPageContent />
    </Suspense>
  );
}
