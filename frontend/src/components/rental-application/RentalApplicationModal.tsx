"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { SegmentedProgress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  Building,
  DollarSign,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileText,
  Briefcase,
  CreditCard,
  Home,
  Send,
  Shield,
  Star,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  ssn: string;
}

interface EmploymentInfo {
  employmentStatus: string;
  employer: string;
  jobTitle: string;
  employmentLength: string;
  monthlyIncome: string;
  additionalIncome: string;
  incomeVerification: string;
  creditScoreRange: string;
}

interface Reference {
  name: string;
  relationship: string;
  phone: string;
  email: string;
}

interface ApplicationData {
  personalInfo: PersonalInfo;
  employmentInfo: EmploymentInfo;
  references: Reference[];
  additionalNotes: string;
  agreeToTerms: boolean;
  agreeToBackgroundCheck: boolean;
}

interface ValidationErrors {
  [key: string]: string;
}

interface RentalApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingId: string;
  listingTitle: string;
  listingPrice: number;
  listingAddress: string;
}

const STEPS = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "Employment", icon: Briefcase },
  { id: 3, title: "References", icon: Users },
  { id: 4, title: "Review", icon: FileText },
];

const EMPLOYMENT_STATUSES = [
  { value: "full-time", label: "Full-time Employee" },
  { value: "part-time", label: "Part-time Employee" },
  { value: "self-employed", label: "Self-Employed" },
  { value: "contractor", label: "Independent Contractor" },
  { value: "retired", label: "Retired" },
  { value: "student", label: "Student" },
  { value: "unemployed", label: "Currently Unemployed" },
];

const EMPLOYMENT_LENGTHS = [
  { value: "less-than-6-months", label: "Less than 6 months" },
  { value: "6-months-1-year", label: "6 months - 1 year" },
  { value: "1-2-years", label: "1-2 years" },
  { value: "2-5-years", label: "2-5 years" },
  { value: "5-plus-years", label: "5+ years" },
];

const INCOME_VERIFICATION_TYPES = [
  { value: "pay-stubs", label: "Recent Pay Stubs (last 2-3)" },
  { value: "tax-returns", label: "Tax Returns (last 2 years)" },
  { value: "bank-statements", label: "Bank Statements (last 3 months)" },
  { value: "employment-letter", label: "Employment Verification Letter" },
  { value: "1099-forms", label: "1099 Forms (Self-Employed)" },
];

const CREDIT_SCORE_RANGES = [
  { value: "excellent", label: "Excellent (750+)" },
  { value: "good", label: "Good (700-749)" },
  { value: "fair", label: "Fair (650-699)" },
  { value: "poor", label: "Poor (600-649)" },
  { value: "very-poor", label: "Very Poor (Below 600)" },
  { value: "no-credit", label: "No Credit History" },
];

const RELATIONSHIP_TYPES = [
  { value: "previous-landlord", label: "Previous Landlord" },
  { value: "employer", label: "Current/Previous Employer" },
  { value: "professional", label: "Professional Reference" },
  { value: "personal", label: "Personal Reference" },
];

const initialPersonalInfo: PersonalInfo = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  ssn: "",
};

const initialEmploymentInfo: EmploymentInfo = {
  employmentStatus: "",
  employer: "",
  jobTitle: "",
  employmentLength: "",
  monthlyIncome: "",
  additionalIncome: "",
  incomeVerification: "",
  creditScoreRange: "",
};

const initialReference: Reference = {
  name: "",
  relationship: "",
  phone: "",
  email: "",
};

export function RentalApplicationModal({
  isOpen,
  onClose,
  listingId,
  listingTitle,
  listingPrice,
  listingAddress,
}: RentalApplicationModalProps) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const [applicationData, setApplicationData] = useState<ApplicationData>({
    personalInfo: initialPersonalInfo,
    employmentInfo: initialEmploymentInfo,
    references: [{ ...initialReference }, { ...initialReference }],
    additionalNotes: "",
    agreeToTerms: false,
    agreeToBackgroundCheck: false,
  });

  // Pre-fill user data if available
  useEffect(() => {
    if (user && isOpen) {
      setApplicationData((prev) => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
        },
      }));
    }
  }, [user, isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setCurrentStep(1);
        setIsSubmitted(false);
        setApplicationId(null);
        setErrors({});
        setApplicationData({
          personalInfo: initialPersonalInfo,
          employmentInfo: initialEmploymentInfo,
          references: [{ ...initialReference }, { ...initialReference }],
          additionalNotes: "",
          agreeToTerms: false,
          agreeToBackgroundCheck: false,
        });
      }, 300);
    }
  }, [isOpen]);

  const updatePersonalInfo = useCallback(
    (field: keyof PersonalInfo, value: string) => {
      setApplicationData((prev) => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, [field]: value },
      }));
      // Clear error when user starts typing
      if (errors[`personal.${field}`]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[`personal.${field}`];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const updateEmploymentInfo = useCallback(
    (field: keyof EmploymentInfo, value: string) => {
      setApplicationData((prev) => ({
        ...prev,
        employmentInfo: { ...prev.employmentInfo, [field]: value },
      }));
      if (errors[`employment.${field}`]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[`employment.${field}`];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const updateReference = useCallback(
    (index: number, field: keyof Reference, value: string) => {
      setApplicationData((prev) => {
        const newRefs = [...prev.references];
        newRefs[index] = { ...newRefs[index], [field]: value };
        return { ...prev, references: newRefs };
      });
      if (errors[`reference.${index}.${field}`]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[`reference.${index}.${field}`];
          return newErrors;
        });
      }
    },
    [errors]
  );

  // Validation functions
  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    return /^[\d\s\-()]+$/.test(phone) && phone.replace(/\D/g, "").length >= 10;
  };

  const validateStep1 = (): boolean => {
    const newErrors: ValidationErrors = {};
    const { personalInfo } = applicationData;

    if (!personalInfo.firstName.trim()) {
      newErrors["personal.firstName"] = "First name is required";
    }
    if (!personalInfo.lastName.trim()) {
      newErrors["personal.lastName"] = "Last name is required";
    }
    if (!personalInfo.email.trim()) {
      newErrors["personal.email"] = "Email is required";
    } else if (!validateEmail(personalInfo.email)) {
      newErrors["personal.email"] = "Please enter a valid email address";
    }
    if (!personalInfo.phone.trim()) {
      newErrors["personal.phone"] = "Phone number is required";
    } else if (!validatePhone(personalInfo.phone)) {
      newErrors["personal.phone"] = "Please enter a valid phone number";
    }
    if (!personalInfo.dateOfBirth) {
      newErrors["personal.dateOfBirth"] = "Date of birth is required";
    } else {
      const age = Math.floor(
        (Date.now() - new Date(personalInfo.dateOfBirth).getTime()) /
          (365.25 * 24 * 60 * 60 * 1000)
      );
      if (age < 18) {
        newErrors["personal.dateOfBirth"] = "Applicant must be at least 18 years old";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: ValidationErrors = {};
    const { employmentInfo } = applicationData;

    if (!employmentInfo.employmentStatus) {
      newErrors["employment.employmentStatus"] = "Employment status is required";
    }

    // Only require employer details if employed
    const requiresEmployer = [
      "full-time",
      "part-time",
      "self-employed",
      "contractor",
    ].includes(employmentInfo.employmentStatus);

    if (requiresEmployer) {
      if (!employmentInfo.employer.trim()) {
        newErrors["employment.employer"] = "Employer name is required";
      }
      if (!employmentInfo.jobTitle.trim()) {
        newErrors["employment.jobTitle"] = "Job title is required";
      }
      if (!employmentInfo.employmentLength) {
        newErrors["employment.employmentLength"] = "Employment length is required";
      }
    }

    if (!employmentInfo.monthlyIncome.trim()) {
      newErrors["employment.monthlyIncome"] = "Monthly income is required";
    } else {
      const income = parseFloat(employmentInfo.monthlyIncome.replace(/[^0-9.]/g, ""));
      if (isNaN(income) || income < 0) {
        newErrors["employment.monthlyIncome"] = "Please enter a valid income amount";
      }
    }

    if (!employmentInfo.incomeVerification) {
      newErrors["employment.incomeVerification"] =
        "Please select how you will verify your income";
    }

    if (!employmentInfo.creditScoreRange) {
      newErrors["employment.creditScoreRange"] = "Credit score range is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: ValidationErrors = {};
    const { references } = applicationData;

    references.forEach((ref, index) => {
      if (!ref.name.trim()) {
        newErrors[`reference.${index}.name`] = "Reference name is required";
      }
      if (!ref.relationship) {
        newErrors[`reference.${index}.relationship`] = "Relationship is required";
      }
      if (!ref.phone.trim()) {
        newErrors[`reference.${index}.phone`] = "Phone number is required";
      } else if (!validatePhone(ref.phone)) {
        newErrors[`reference.${index}.phone`] = "Please enter a valid phone number";
      }
      if (!ref.email.trim()) {
        newErrors[`reference.${index}.email`] = "Email is required";
      } else if (!validateEmail(ref.email)) {
        newErrors[`reference.${index}.email`] = "Please enter a valid email address";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!applicationData.agreeToTerms) {
      newErrors["agreeToTerms"] = "You must agree to the terms and conditions";
    }
    if (!applicationData.agreeToBackgroundCheck) {
      newErrors["agreeToBackgroundCheck"] =
        "You must authorize the background check";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;

    switch (currentStep) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
      case 4:
        isValid = validateStep4();
        if (isValid) {
          handleSubmit();
          return;
        }
        break;
    }

    if (isValid && currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    } else if (!isValid) {
      toast.error("Please complete all required fields before proceeding");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate a mock application ID
      const newApplicationId = `APP-${Date.now().toString(36).toUpperCase()}`;
      setApplicationId(newApplicationId);
      setIsSubmitted(true);

      toast.success("Application submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit application. Please try again.");
      console.error("Application submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (value: string): string => {
    const num = parseFloat(value.replace(/[^0-9.]/g, ""));
    if (isNaN(num)) return value;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Render steps
  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-sky-100 to-emerald-100 mb-3">
          <User className="h-6 w-6 text-sky-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
        <p className="text-sm text-gray-600 mt-1">
          Please provide your personal details. All fields marked with * are required.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-gray-700">
            First Name <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="firstName"
              placeholder="John"
              value={applicationData.personalInfo.firstName}
              onChange={(e) => updatePersonalInfo("firstName", e.target.value)}
              className={cn(
                "pl-9",
                errors["personal.firstName"] && "border-red-400 focus-visible:border-red-400"
              )}
            />
          </div>
          {errors["personal.firstName"] && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors["personal.firstName"]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-gray-700">
            Last Name <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="lastName"
              placeholder="Doe"
              value={applicationData.personalInfo.lastName}
              onChange={(e) => updatePersonalInfo("lastName", e.target.value)}
              className={cn(
                "pl-9",
                errors["personal.lastName"] && "border-red-400 focus-visible:border-red-400"
              )}
            />
          </div>
          {errors["personal.lastName"] && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors["personal.lastName"]}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-700">
          Email Address <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="john.doe@example.com"
            value={applicationData.personalInfo.email}
            onChange={(e) => updatePersonalInfo("email", e.target.value)}
            className={cn(
              "pl-9",
              errors["personal.email"] && "border-red-400 focus-visible:border-red-400"
            )}
          />
        </div>
        {errors["personal.email"] && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors["personal.email"]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-gray-700">
          Phone Number <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="phone"
            type="tel"
            placeholder="(555) 123-4567"
            value={applicationData.personalInfo.phone}
            onChange={(e) => updatePersonalInfo("phone", e.target.value)}
            className={cn(
              "pl-9",
              errors["personal.phone"] && "border-red-400 focus-visible:border-red-400"
            )}
          />
        </div>
        {errors["personal.phone"] && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors["personal.phone"]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="dateOfBirth" className="text-gray-700">
          Date of Birth <span className="text-red-500">*</span>
        </Label>
        <Input
          id="dateOfBirth"
          type="date"
          value={applicationData.personalInfo.dateOfBirth}
          onChange={(e) => updatePersonalInfo("dateOfBirth", e.target.value)}
          className={cn(
            errors["personal.dateOfBirth"] && "border-red-400 focus-visible:border-red-400"
          )}
        />
        {errors["personal.dateOfBirth"] && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors["personal.dateOfBirth"]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="ssn" className="text-gray-700">
          Social Security Number (optional - for background check)
        </Label>
        <div className="relative">
          <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="ssn"
            type="password"
            placeholder="XXX-XX-XXXX"
            value={applicationData.personalInfo.ssn}
            onChange={(e) => updatePersonalInfo("ssn", e.target.value)}
            className="pl-9"
          />
        </div>
        <p className="text-xs text-gray-500">
          Your SSN is securely encrypted and only used for background verification.
        </p>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-emerald-100 to-sky-100 mb-3">
          <Briefcase className="h-6 w-6 text-emerald-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Employment & Income</h3>
        <p className="text-sm text-gray-600 mt-1">
          We need to verify your income to process your application.
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-700">
          Employment Status <span className="text-red-500">*</span>
        </Label>
        <Select
          value={applicationData.employmentInfo.employmentStatus}
          onValueChange={(value) => updateEmploymentInfo("employmentStatus", value)}
        >
          <SelectTrigger
            className={cn(
              "w-full",
              errors["employment.employmentStatus"] &&
                "border-red-400 focus-visible:border-red-400"
            )}
          >
            <SelectValue placeholder="Select your employment status" />
          </SelectTrigger>
          <SelectContent>
            {EMPLOYMENT_STATUSES.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors["employment.employmentStatus"] && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors["employment.employmentStatus"]}
          </p>
        )}
      </div>

      {["full-time", "part-time", "self-employed", "contractor"].includes(
        applicationData.employmentInfo.employmentStatus
      ) && (
        <>
          <div className="space-y-2">
            <Label htmlFor="employer" className="text-gray-700">
              Employer / Company Name <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="employer"
                placeholder="Company Name"
                value={applicationData.employmentInfo.employer}
                onChange={(e) => updateEmploymentInfo("employer", e.target.value)}
                className={cn(
                  "pl-9",
                  errors["employment.employer"] &&
                    "border-red-400 focus-visible:border-red-400"
                )}
              />
            </div>
            {errors["employment.employer"] && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors["employment.employer"]}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobTitle" className="text-gray-700">
                Job Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="jobTitle"
                placeholder="Software Engineer"
                value={applicationData.employmentInfo.jobTitle}
                onChange={(e) => updateEmploymentInfo("jobTitle", e.target.value)}
                className={cn(
                  errors["employment.jobTitle"] &&
                    "border-red-400 focus-visible:border-red-400"
                )}
              />
              {errors["employment.jobTitle"] && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors["employment.jobTitle"]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">
                Employment Length <span className="text-red-500">*</span>
              </Label>
              <Select
                value={applicationData.employmentInfo.employmentLength}
                onValueChange={(value) =>
                  updateEmploymentInfo("employmentLength", value)
                }
              >
                <SelectTrigger
                  className={cn(
                    "w-full",
                    errors["employment.employmentLength"] &&
                      "border-red-400 focus-visible:border-red-400"
                  )}
                >
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  {EMPLOYMENT_LENGTHS.map((length) => (
                    <SelectItem key={length.value} value={length.value}>
                      {length.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors["employment.employmentLength"] && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors["employment.employmentLength"]}
                </p>
              )}
            </div>
          </div>
        </>
      )}

      <Separator className="my-4 bg-sky-100/50" />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="monthlyIncome" className="text-gray-700">
            Monthly Gross Income <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="monthlyIncome"
              placeholder="5,000"
              value={applicationData.employmentInfo.monthlyIncome}
              onChange={(e) => updateEmploymentInfo("monthlyIncome", e.target.value)}
              onBlur={(e) => {
                if (e.target.value) {
                  updateEmploymentInfo(
                    "monthlyIncome",
                    formatCurrency(e.target.value).replace("$", "")
                  );
                }
              }}
              className={cn(
                "pl-9",
                errors["employment.monthlyIncome"] &&
                  "border-red-400 focus-visible:border-red-400"
              )}
            />
          </div>
          {errors["employment.monthlyIncome"] && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors["employment.monthlyIncome"]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="additionalIncome" className="text-gray-700">
            Additional Income (optional)
          </Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="additionalIncome"
              placeholder="0"
              value={applicationData.employmentInfo.additionalIncome}
              onChange={(e) => updateEmploymentInfo("additionalIncome", e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-gray-700">
          Income Verification Method <span className="text-red-500">*</span>
        </Label>
        <Select
          value={applicationData.employmentInfo.incomeVerification}
          onValueChange={(value) => updateEmploymentInfo("incomeVerification", value)}
        >
          <SelectTrigger
            className={cn(
              "w-full",
              errors["employment.incomeVerification"] &&
                "border-red-400 focus-visible:border-red-400"
            )}
          >
            <SelectValue placeholder="How will you verify your income?" />
          </SelectTrigger>
          <SelectContent>
            {INCOME_VERIFICATION_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors["employment.incomeVerification"] && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors["employment.incomeVerification"]}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-gray-700">
          Credit Score Range <span className="text-red-500">*</span>
        </Label>
        <Select
          value={applicationData.employmentInfo.creditScoreRange}
          onValueChange={(value) => updateEmploymentInfo("creditScoreRange", value)}
        >
          <SelectTrigger
            className={cn(
              "w-full",
              errors["employment.creditScoreRange"] &&
                "border-red-400 focus-visible:border-red-400"
            )}
          >
            <SelectValue placeholder="Select your credit score range" />
          </SelectTrigger>
          <SelectContent>
            {CREDIT_SCORE_RANGES.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  {range.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors["employment.creditScoreRange"] && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors["employment.creditScoreRange"]}
          </p>
        )}
      </div>

      {/* Income to rent ratio indicator */}
      {applicationData.employmentInfo.monthlyIncome && (
        <div className="p-4 rounded-xl bg-gradient-to-br from-sky-50/80 to-emerald-50/50 border border-sky-100/50">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Income to Rent Ratio:
            </span>
            {(() => {
              const income = parseFloat(
                applicationData.employmentInfo.monthlyIncome.replace(/[^0-9.]/g, "")
              );
              const ratio = income / listingPrice;
              const isGood = ratio >= 3;
              return (
                <Badge variant={isGood ? "success" : "warning"}>
                  {ratio.toFixed(1)}x {isGood ? "(Recommended)" : "(Below 3x)"}
                </Badge>
              );
            })()}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Most landlords require your monthly income to be at least 3x the rent.
          </p>
        </div>
      )}
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-sky-100 to-teal-100 mb-3">
          <Users className="h-6 w-6 text-teal-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">References</h3>
        <p className="text-sm text-gray-600 mt-1">
          Please provide 2 references who can vouch for your rental history or character.
        </p>
      </div>

      {applicationData.references.map((ref, index) => (
        <div
          key={index}
          className="p-4 rounded-xl bg-gradient-to-br from-white/80 to-sky-50/30 border border-sky-100/50"
        >
          <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-sky-100 text-sky-600 text-sm">
              {index + 1}
            </span>
            Reference {index + 1}
          </h4>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Jane Smith"
                    value={ref.name}
                    onChange={(e) => updateReference(index, "name", e.target.value)}
                    className={cn(
                      "pl-9",
                      errors[`reference.${index}.name`] &&
                        "border-red-400 focus-visible:border-red-400"
                    )}
                  />
                </div>
                {errors[`reference.${index}.name`] && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors[`reference.${index}.name`]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700">
                  Relationship <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={ref.relationship}
                  onValueChange={(value) =>
                    updateReference(index, "relationship", value)
                  }
                >
                  <SelectTrigger
                    className={cn(
                      "w-full",
                      errors[`reference.${index}.relationship`] &&
                        "border-red-400 focus-visible:border-red-400"
                    )}
                  >
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    {RELATIONSHIP_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors[`reference.${index}.relationship`] && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors[`reference.${index}.relationship`]}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-700">
                  Phone <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={ref.phone}
                    onChange={(e) => updateReference(index, "phone", e.target.value)}
                    className={cn(
                      "pl-9",
                      errors[`reference.${index}.phone`] &&
                        "border-red-400 focus-visible:border-red-400"
                    )}
                  />
                </div>
                {errors[`reference.${index}.phone`] && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors[`reference.${index}.phone`]}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700">
                  Email <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="jane@example.com"
                    value={ref.email}
                    onChange={(e) => updateReference(index, "email", e.target.value)}
                    className={cn(
                      "pl-9",
                      errors[`reference.${index}.email`] &&
                        "border-red-400 focus-visible:border-red-400"
                    )}
                  />
                </div>
                {errors[`reference.${index}.email`] && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors[`reference.${index}.email`]}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  );

  const renderStep4 = () => {
    const { personalInfo, employmentInfo, references } = applicationData;

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-emerald-100 to-sky-100 mb-3">
            <FileText className="h-6 w-6 text-emerald-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Review Your Application</h3>
          <p className="text-sm text-gray-600 mt-1">
            Please review all information before submitting.
          </p>
        </div>

        {/* Property Summary */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-sky-50/80 to-emerald-50/50 border border-sky-200/50">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-white/80 shadow-sm">
              <Home className="h-5 w-5 text-sky-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{listingTitle}</h4>
              <p className="text-sm text-gray-600">{listingAddress}</p>
              <p className="text-lg font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent mt-1">
                ${listingPrice.toLocaleString()}/month
              </p>
            </div>
          </div>
        </div>

        {/* Personal Info Summary */}
        <div className="p-4 rounded-xl bg-white/80 border border-gray-200/60">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <User className="h-4 w-4 text-sky-500" />
            Personal Information
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-500">Name:</span>
              <p className="font-medium text-gray-900">
                {personalInfo.firstName} {personalInfo.lastName}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Email:</span>
              <p className="font-medium text-gray-900">{personalInfo.email}</p>
            </div>
            <div>
              <span className="text-gray-500">Phone:</span>
              <p className="font-medium text-gray-900">{personalInfo.phone}</p>
            </div>
            <div>
              <span className="text-gray-500">Date of Birth:</span>
              <p className="font-medium text-gray-900">
                {new Date(personalInfo.dateOfBirth).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Employment Summary */}
        <div className="p-4 rounded-xl bg-white/80 border border-gray-200/60">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-emerald-500" />
            Employment & Income
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-500">Status:</span>
              <p className="font-medium text-gray-900">
                {
                  EMPLOYMENT_STATUSES.find(
                    (s) => s.value === employmentInfo.employmentStatus
                  )?.label
                }
              </p>
            </div>
            {employmentInfo.employer && (
              <div>
                <span className="text-gray-500">Employer:</span>
                <p className="font-medium text-gray-900">{employmentInfo.employer}</p>
              </div>
            )}
            <div>
              <span className="text-gray-500">Monthly Income:</span>
              <p className="font-medium text-gray-900">
                ${employmentInfo.monthlyIncome}
              </p>
            </div>
            <div>
              <span className="text-gray-500">Credit Score:</span>
              <p className="font-medium text-gray-900">
                {
                  CREDIT_SCORE_RANGES.find(
                    (r) => r.value === employmentInfo.creditScoreRange
                  )?.label
                }
              </p>
            </div>
          </div>
        </div>

        {/* References Summary */}
        <div className="p-4 rounded-xl bg-white/80 border border-gray-200/60">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Users className="h-4 w-4 text-teal-500" />
            References
          </h4>
          <div className="space-y-3">
            {references.map((ref, index) => (
              <div key={index} className="text-sm p-3 rounded-lg bg-gray-50/80">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">{ref.name}</p>
                  <Badge variant="secondary">
                    {
                      RELATIONSHIP_TYPES.find((r) => r.value === ref.relationship)
                        ?.label
                    }
                  </Badge>
                </div>
                <p className="text-gray-500 text-xs mt-1">
                  {ref.phone} | {ref.email}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Notes */}
        <div className="space-y-2">
          <Label className="text-gray-700">Additional Notes (optional)</Label>
          <Textarea
            placeholder="Any additional information you'd like to share..."
            value={applicationData.additionalNotes}
            onChange={(e) =>
              setApplicationData((prev) => ({
                ...prev,
                additionalNotes: e.target.value,
              }))
            }
            className="resize-none min-h-[80px]"
          />
        </div>

        {/* Terms and Agreements */}
        <div className="space-y-4 p-4 rounded-xl bg-gradient-to-br from-amber-50/80 to-white border border-amber-200/50">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="agreeToTerms"
              checked={applicationData.agreeToTerms}
              onChange={(e) =>
                setApplicationData((prev) => ({
                  ...prev,
                  agreeToTerms: e.target.checked,
                }))
              }
              className="mt-1 h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
            />
            <Label htmlFor="agreeToTerms" className="text-sm text-gray-700 cursor-pointer">
              I certify that all information provided is accurate and complete. I
              understand that providing false information may result in denial of my
              application. <span className="text-red-500">*</span>
            </Label>
          </div>
          {errors["agreeToTerms"] && (
            <p className="text-xs text-red-500 flex items-center gap-1 ml-7">
              <AlertCircle className="h-3 w-3" />
              {errors["agreeToTerms"]}
            </p>
          )}

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="agreeToBackgroundCheck"
              checked={applicationData.agreeToBackgroundCheck}
              onChange={(e) =>
                setApplicationData((prev) => ({
                  ...prev,
                  agreeToBackgroundCheck: e.target.checked,
                }))
              }
              className="mt-1 h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
            />
            <Label
              htmlFor="agreeToBackgroundCheck"
              className="text-sm text-gray-700 cursor-pointer"
            >
              I authorize the landlord to conduct a background check and credit check
              as part of this application process. <span className="text-red-500">*</span>
            </Label>
          </div>
          {errors["agreeToBackgroundCheck"] && (
            <p className="text-xs text-red-500 flex items-center gap-1 ml-7">
              <AlertCircle className="h-3 w-3" />
              {errors["agreeToBackgroundCheck"]}
            </p>
          )}
        </div>
      </motion.div>
    );
  };

  const renderSuccessState = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-sky-100 mb-6"
      >
        <CheckCircle className="h-10 w-10 text-emerald-600" />
      </motion.div>

      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        Application Submitted!
      </h3>
      <p className="text-gray-600 mb-6">
        Your application for <span className="font-semibold">{listingTitle}</span>{" "}
        has been submitted successfully.
      </p>

      <div className="p-4 rounded-xl bg-gradient-to-br from-sky-50/80 to-emerald-50/50 border border-sky-200/50 mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <FileText className="h-4 w-4 text-sky-600" />
          <span className="text-sm font-medium text-gray-700">Application ID:</span>
        </div>
        <p className="text-lg font-mono font-bold text-gray-900">{applicationId}</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-center gap-3 p-3 rounded-lg bg-white/80 border border-gray-200/60">
          <Clock className="h-5 w-5 text-sky-500" />
          <div className="text-left">
            <p className="text-sm font-medium text-gray-900">Processing Time</p>
            <p className="text-xs text-gray-500">
              Expect a response within 24-48 business hours
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 p-3 rounded-lg bg-white/80 border border-gray-200/60">
          <Mail className="h-5 w-5 text-emerald-500" />
          <div className="text-left">
            <p className="text-sm font-medium text-gray-900">Confirmation Sent</p>
            <p className="text-xs text-gray-500">
              Check your email for application details
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Button variant="gradient" onClick={onClose} className="w-full h-11">
          <CheckCircle className="h-4 w-4 mr-2" />
          Done
        </Button>
      </div>
    </motion.div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "sm:max-w-2xl max-h-[90vh] overflow-y-auto",
          "bg-white/95 backdrop-blur-xl",
          isSubmitted && "sm:max-w-lg"
        )}
        showCloseButton={!isSubmitting}
      >
        {!isSubmitted ? (
          <>
            <DialogHeader className="border-b border-sky-100/50 pb-4">
              <DialogTitle className="flex items-center gap-2">
                <Home className="h-5 w-5 text-sky-500" />
                Rental Application
              </DialogTitle>
              <DialogDescription>
                Applying for: {listingTitle} - ${listingPrice.toLocaleString()}/mo
              </DialogDescription>
            </DialogHeader>

            {/* Step Progress */}
            <div className="py-4">
              <SegmentedProgress
                steps={4}
                currentStep={currentStep - 1}
                variant="gradient"
              />
              <div className="flex justify-between mt-3">
                {STEPS.map((step) => {
                  const IconComponent = step.icon;
                  const isComplete = currentStep > step.id;
                  const isCurrent = currentStep === step.id;
                  return (
                    <div
                      key={step.id}
                      className={cn(
                        "flex flex-col items-center gap-1 transition-all duration-300",
                        isComplete && "text-emerald-600",
                        isCurrent && "text-sky-600",
                        !isComplete && !isCurrent && "text-gray-400"
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                          isComplete && "bg-emerald-100",
                          isCurrent && "bg-sky-100 ring-2 ring-sky-400/50",
                          !isComplete && !isCurrent && "bg-gray-100"
                        )}
                      >
                        {isComplete ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <IconComponent className="h-4 w-4" />
                        )}
                      </div>
                      <span className="text-xs font-medium hidden sm:block">
                        {step.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator className="bg-sky-100/50" />

            {/* Step Content */}
            <div className="py-4 min-h-[400px]">
              <AnimatePresence mode="wait">
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
                {currentStep === 4 && renderStep4()}
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-sky-100/50">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 1 || isSubmitting}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  Step {currentStep} of 4
                </span>
              </div>

              <Button
                variant="gradient"
                onClick={handleNext}
                disabled={isSubmitting}
                className="gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : currentStep === 4 ? (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Application
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </>
        ) : (
          renderSuccessState()
        )}
      </DialogContent>
    </Dialog>
  );
}
