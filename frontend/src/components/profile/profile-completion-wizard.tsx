"use client";

import { useState, useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress, SegmentedProgress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Phone,
  Camera,
  FileText,
  MapPin,
  DollarSign,
  Calendar,
  Building2,
  Shield,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Upload,
  Briefcase,
  Home,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface BaseProfileData {
  fullName: string;
  phone: string;
  bio: string;
  profilePhotoUrl: string;
}

interface PreferencesData {
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
}

interface RenterProfileData extends BaseProfileData, PreferencesData {
  incomeRange: string;
  moveInDate: string;
  preferredNeighborhoods: string[];
  hasPets: boolean;
  petDetails: string;
  employmentStatus: string;
  creditScoreRange: string;
}

interface LandlordProfileData extends BaseProfileData, PreferencesData {
  companyName: string;
  companyWebsite: string;
  businessType: string;
  numberOfProperties: string;
  yearsInBusiness: string;
  verificationDocuments: string[];
}

type ProfileData = RenterProfileData | LandlordProfileData;

interface ProfileCompletionWizardProps {
  onComplete?: () => void;
  onDismiss?: () => void;
  isModal?: boolean;
}

// Step configurations for different user roles
const RENTER_STEPS = [
  { id: "basic", title: "Basic Info", icon: User, description: "Tell us about yourself" },
  { id: "preferences", title: "Preferences", icon: Sparkles, description: "Customize your experience" },
  { id: "renter-details", title: "Rental Info", icon: Home, description: "Help landlords know you better" },
  { id: "complete", title: "Complete", icon: CheckCircle, description: "You're all set!" },
];

const LANDLORD_STEPS = [
  { id: "basic", title: "Basic Info", icon: User, description: "Tell us about yourself" },
  { id: "preferences", title: "Preferences", icon: Sparkles, description: "Customize your experience" },
  { id: "business", title: "Business Info", icon: Building2, description: "Your property management details" },
  { id: "verification", title: "Verification", icon: Shield, description: "Verify your identity" },
  { id: "complete", title: "Complete", icon: CheckCircle, description: "You're all set!" },
];

// Neighborhoods for renter preference selection — update these for your deployment city
const NEIGHBORHOODS = [
  "Downtown",
  "Midtown",
  "Uptown",
  "West Side",
  "East Side",
  "North End",
  "South End",
  "Arts District",
  "Financial District",
  "Waterfront",
  "Old Town",
  "University District",
  "Suburbs North",
  "Suburbs South",
  "Industrial District",
];

const INCOME_RANGES = [
  { value: "under-50k", label: "Under $50,000" },
  { value: "50k-75k", label: "$50,000 - $75,000" },
  { value: "75k-100k", label: "$75,000 - $100,000" },
  { value: "100k-150k", label: "$100,000 - $150,000" },
  { value: "150k-200k", label: "$150,000 - $200,000" },
  { value: "over-200k", label: "Over $200,000" },
];

const CREDIT_SCORE_RANGES = [
  { value: "excellent", label: "Excellent (750+)" },
  { value: "good", label: "Good (700-749)" },
  { value: "fair", label: "Fair (650-699)" },
  { value: "building", label: "Building Credit (Below 650)" },
];

const EMPLOYMENT_STATUS = [
  { value: "employed", label: "Employed Full-Time" },
  { value: "part-time", label: "Employed Part-Time" },
  { value: "self-employed", label: "Self-Employed" },
  { value: "retired", label: "Retired" },
  { value: "student", label: "Student" },
  { value: "other", label: "Other" },
];

const BUSINESS_TYPES = [
  { value: "individual", label: "Individual Owner" },
  { value: "llc", label: "LLC" },
  { value: "corporation", label: "Corporation" },
  { value: "partnership", label: "Partnership" },
  { value: "property-management", label: "Property Management Company" },
];

const PROPERTY_COUNTS = [
  { value: "1", label: "1 property" },
  { value: "2-5", label: "2-5 properties" },
  { value: "6-10", label: "6-10 properties" },
  { value: "11-25", label: "11-25 properties" },
  { value: "25+", label: "25+ properties" },
];

export function ProfileCompletionWizard({
  onComplete,
  onDismiss,
  isModal = false,
}: ProfileCompletionWizardProps) {
  const { user } = useAuth();
  const isLandlord = user?.role === "landlord";
  const steps = isLandlord ? LANDLORD_STEPS : RENTER_STEPS;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Form setup with default values
  const defaultValues = useMemo(() => {
    const base = {
      fullName: user ? `${user.firstName} ${user.lastName}`.trim() : "",
      phone: "",
      bio: "",
      profilePhotoUrl: user?.avatarUrl || "",
      emailNotifications: true,
      smsNotifications: false,
      marketingEmails: false,
    };

    if (isLandlord) {
      return {
        ...base,
        companyName: "",
        companyWebsite: "",
        businessType: "",
        numberOfProperties: "",
        yearsInBusiness: "",
        verificationDocuments: [],
      } as LandlordProfileData;
    }

    return {
      ...base,
      incomeRange: "",
      moveInDate: "",
      preferredNeighborhoods: [],
      hasPets: false,
      petDetails: "",
      employmentStatus: "",
      creditScoreRange: "",
    } as RenterProfileData;
  }, [user, isLandlord]);

  const {
    control,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm<ProfileData>({
    defaultValues,
    mode: "onChange",
  });

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;
  const isCompleteStep = currentStep.id === "complete";

  // Calculate overall progress
  const formValues = watch();
  const calculateProgress = useCallback(() => {
    let filledFields = 0;
    let totalFields = 0;

    // Base fields
    const baseFields = ["fullName", "phone", "bio", "profilePhotoUrl"];
    baseFields.forEach((field) => {
      totalFields++;
      if (formValues[field as keyof ProfileData]) filledFields++;
    });

    if (isLandlord) {
      const landlordFields = ["companyName", "businessType", "numberOfProperties"];
      landlordFields.forEach((field) => {
        totalFields++;
        if ((formValues as LandlordProfileData)[field as keyof LandlordProfileData]) filledFields++;
      });
    } else {
      const renterFields = ["incomeRange", "employmentStatus", "creditScoreRange"];
      renterFields.forEach((field) => {
        totalFields++;
        if ((formValues as RenterProfileData)[field as keyof RenterProfileData]) filledFields++;
      });
      // Check neighborhoods
      totalFields++;
      if ((formValues as RenterProfileData).preferredNeighborhoods?.length > 0) filledFields++;
    }

    return Math.round((filledFields / totalFields) * 100);
  }, [formValues, isLandlord]);

  const progress = calculateProgress();

  // Validate current step before moving forward
  const validateCurrentStep = async (): Promise<boolean> => {
    const stepId = currentStep.id;
    let fieldsToValidate: (keyof ProfileData)[] = [];

    switch (stepId) {
      case "basic":
        fieldsToValidate = ["fullName", "phone"] as (keyof ProfileData)[];
        break;
      case "preferences":
        // Preferences are optional
        return true;
      case "renter-details":
        fieldsToValidate = ["incomeRange", "employmentStatus"] as unknown as (keyof ProfileData)[];
        break;
      case "business":
        fieldsToValidate = ["companyName", "businessType", "numberOfProperties"] as unknown as (keyof ProfileData)[];
        break;
      case "verification":
        // Verification is optional for now
        return true;
      default:
        return true;
    }

    const result = await trigger(fieldsToValidate);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileData) => {
    if (!isCompleteStep) return;

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      onComplete?.();
    } catch (error) {
      console.error("Error submitting profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    if (currentStepIndex < steps.length - 2) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  // Step content components
  const renderBasicInfoStep = () => (
    <div className="space-y-6">
      {/* Profile Photo */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Avatar className="h-24 w-24 ring-4 ring-white shadow-lg">
            <AvatarImage src={photoPreview || user?.avatarUrl} />
            <AvatarFallback className="text-2xl bg-gradient-to-br from-sky-100 to-emerald-100 text-sky-600">
              {user?.firstName?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <label
            htmlFor="photo-upload"
            className="absolute -bottom-2 -right-2 p-2 bg-white rounded-full shadow-lg cursor-pointer hover:bg-sky-50 transition-colors border border-gray-200"
          >
            <Camera className="h-4 w-4 text-sky-600" />
          </label>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>
        <p className="text-sm text-gray-500">Click to upload a profile photo</p>
      </div>

      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="fullName" className="flex items-center gap-2">
          <User className="h-4 w-4 text-sky-500" />
          Full Name
        </Label>
        <Controller
          name="fullName"
          control={control}
          rules={{ required: "Full name is required" }}
          render={({ field }) => (
            <Input
              {...field}
              id="fullName"
              placeholder="Enter your full name"
              aria-invalid={!!errors.fullName}
            />
          )}
        />
        {errors.fullName && (
          <p className="text-sm text-red-500">{errors.fullName.message}</p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-sky-500" />
          Phone Number
        </Label>
        <Controller
          name="phone"
          control={control}
          rules={{
            required: "Phone number is required",
            pattern: {
              value: /^[\d\s\-\+\(\)]{10,}$/,
              message: "Please enter a valid phone number",
            },
          }}
          render={({ field }) => (
            <Input
              {...field}
              id="phone"
              type="tel"
              placeholder="(555) 123-4567"
              aria-invalid={!!errors.phone}
            />
          )}
        />
        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone.message}</p>
        )}
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio" className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-sky-500" />
          Short Bio
        </Label>
        <Controller
          name="bio"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              id="bio"
              placeholder={
                isLandlord
                  ? "Tell potential renters about yourself and your properties..."
                  : "Tell landlords a bit about yourself..."
              }
              rows={3}
            />
          )}
        />
        <p className="text-xs text-gray-500">
          A good bio helps build trust with {isLandlord ? "renters" : "landlords"}
        </p>
      </div>
    </div>
  );

  const renderPreferencesStep = () => (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-sky-50/50 border border-sky-100">
        <h4 className="font-medium text-gray-900 mb-1">Notification Preferences</h4>
        <p className="text-sm text-gray-600">Choose how you'd like to hear from us</p>
      </div>

      <div className="space-y-4">
        <Controller
          name="emailNotifications"
          control={control}
          render={({ field }) => (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200 hover:border-sky-200 transition-colors">
              <Checkbox
                id="emailNotifications"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <div className="flex-1">
                <Label htmlFor="emailNotifications" className="cursor-pointer">
                  Email Notifications
                </Label>
                <p className="text-sm text-gray-500 mt-0.5">
                  Receive updates about {isLandlord ? "applications and inquiries" : "new listings and application status"}
                </p>
              </div>
            </div>
          )}
        />

        <Controller
          name="smsNotifications"
          control={control}
          render={({ field }) => (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200 hover:border-sky-200 transition-colors">
              <Checkbox
                id="smsNotifications"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <div className="flex-1">
                <Label htmlFor="smsNotifications" className="cursor-pointer">
                  SMS Notifications
                </Label>
                <p className="text-sm text-gray-500 mt-0.5">
                  Get instant text alerts for important updates
                </p>
              </div>
            </div>
          )}
        />

        <Controller
          name="marketingEmails"
          control={control}
          render={({ field }) => (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/70 backdrop-blur-sm border border-gray-200 hover:border-sky-200 transition-colors">
              <Checkbox
                id="marketingEmails"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <div className="flex-1">
                <Label htmlFor="marketingEmails" className="cursor-pointer">
                  Marketing & Tips
                </Label>
                <p className="text-sm text-gray-500 mt-0.5">
                  {isLandlord
                    ? "Receive tips on managing properties and market insights"
                    : "Receive tips on apartment hunting and neighborhood guides"}
                </p>
              </div>
            </div>
          )}
        />
      </div>
    </div>
  );

  const renderRenterDetailsStep = () => (
    <div className="space-y-6">
      {/* Income Range */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-emerald-500" />
          Annual Income Range
        </Label>
        <Controller
          name="incomeRange"
          control={control}
          rules={{ required: "Please select your income range" }}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your income range" />
              </SelectTrigger>
              <SelectContent>
                {INCOME_RANGES.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {(errors as any).incomeRange && (
          <p className="text-sm text-red-500">{(errors as any).incomeRange?.message}</p>
        )}
      </div>

      {/* Employment Status */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-sky-500" />
          Employment Status
        </Label>
        <Controller
          name="employmentStatus"
          control={control}
          rules={{ required: "Please select your employment status" }}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your employment status" />
              </SelectTrigger>
              <SelectContent>
                {EMPLOYMENT_STATUS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {(errors as any).employmentStatus && (
          <p className="text-sm text-red-500">{(errors as any).employmentStatus?.message}</p>
        )}
      </div>

      {/* Credit Score Range */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-teal-500" />
          Credit Score Range
        </Label>
        <Controller
          name="creditScoreRange"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your credit score range" />
              </SelectTrigger>
              <SelectContent>
                {CREDIT_SCORE_RANGES.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Move-in Date */}
      <div className="space-y-2">
        <Label htmlFor="moveInDate" className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-sky-500" />
          Desired Move-in Date
        </Label>
        <Controller
          name="moveInDate"
          control={control}
          render={({ field }) => (
            <Input {...field} id="moveInDate" type="date" />
          )}
        />
      </div>

      {/* Preferred Neighborhoods */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-sky-500" />
          Preferred Neighborhoods
        </Label>
        <Controller
          name="preferredNeighborhoods"
          control={control}
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {NEIGHBORHOODS.map((neighborhood) => {
                const isSelected = (field.value as string[])?.includes(neighborhood);
                return (
                  <button
                    key={neighborhood}
                    type="button"
                    onClick={() => {
                      const current = field.value as string[] || [];
                      if (isSelected) {
                        field.onChange(current.filter((n) => n !== neighborhood));
                      } else {
                        field.onChange([...current, neighborhood]);
                      }
                    }}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                      isSelected
                        ? "bg-sky-500 text-white shadow-[0_2px_10px_rgba(56,189,248,0.3)]"
                        : "bg-white/70 text-gray-700 border border-gray-200 hover:border-sky-300 hover:bg-sky-50"
                    )}
                  >
                    {neighborhood}
                  </button>
                );
              })}
            </div>
          )}
        />
      </div>

      {/* Pets */}
      <div className="space-y-3">
        <Controller
          name="hasPets"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-3">
              <Checkbox
                id="hasPets"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <Label htmlFor="hasPets" className="cursor-pointer">
                I have pets
              </Label>
            </div>
          )}
        />

        {watch("hasPets") && (
          <Controller
            name="petDetails"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Describe your pets (e.g., 1 small dog, 2 cats)"
              />
            )}
          />
        )}
      </div>
    </div>
  );

  const renderBusinessInfoStep = () => (
    <div className="space-y-6">
      {/* Company Name */}
      <div className="space-y-2">
        <Label htmlFor="companyName" className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-sky-500" />
          Company/Business Name
        </Label>
        <Controller
          name="companyName"
          control={control}
          rules={{ required: "Company name is required" }}
          render={({ field }) => (
            <Input
              {...field}
              id="companyName"
              placeholder="Enter your company or business name"
              aria-invalid={!!(errors as any).companyName}
            />
          )}
        />
        {(errors as any).companyName && (
          <p className="text-sm text-red-500">{(errors as any).companyName?.message}</p>
        )}
        <p className="text-xs text-gray-500">
          If you're an individual owner, you can use your name
        </p>
      </div>

      {/* Business Type */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-emerald-500" />
          Business Type
        </Label>
        <Controller
          name="businessType"
          control={control}
          rules={{ required: "Please select a business type" }}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your business type" />
              </SelectTrigger>
              <SelectContent>
                {BUSINESS_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {(errors as any).businessType && (
          <p className="text-sm text-red-500">{(errors as any).businessType?.message}</p>
        )}
      </div>

      {/* Number of Properties */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Home className="h-4 w-4 text-teal-500" />
          Number of Properties
        </Label>
        <Controller
          name="numberOfProperties"
          control={control}
          rules={{ required: "Please select number of properties" }}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="How many properties do you manage?" />
              </SelectTrigger>
              <SelectContent>
                {PROPERTY_COUNTS.map((count) => (
                  <SelectItem key={count.value} value={count.value}>
                    {count.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {(errors as any).numberOfProperties && (
          <p className="text-sm text-red-500">{(errors as any).numberOfProperties?.message}</p>
        )}
      </div>

      {/* Company Website */}
      <div className="space-y-2">
        <Label htmlFor="companyWebsite" className="flex items-center gap-2">
          Website (optional)
        </Label>
        <Controller
          name="companyWebsite"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="companyWebsite"
              type="url"
              placeholder="https://www.yourcompany.com"
            />
          )}
        />
      </div>

      {/* Years in Business */}
      <div className="space-y-2">
        <Label htmlFor="yearsInBusiness" className="flex items-center gap-2">
          Years in Business
        </Label>
        <Controller
          name="yearsInBusiness"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="How long have you been in business?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">Just starting</SelectItem>
                <SelectItem value="1-2">1-2 years</SelectItem>
                <SelectItem value="3-5">3-5 years</SelectItem>
                <SelectItem value="5-10">5-10 years</SelectItem>
                <SelectItem value="10+">10+ years</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
    </div>
  );

  const renderVerificationStep = () => (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-emerald-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-gray-900">Verification Benefits</h4>
            <p className="text-sm text-gray-600 mt-1">
              Verified landlords get a badge on their profile and listings, increasing trust and visibility.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Upload Verification Documents</h4>
        <p className="text-sm text-gray-600">
          Upload one or more of the following to verify your identity:
        </p>

        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
            Government-issued ID
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
            Business license or registration
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
            Property ownership documents
          </li>
        </ul>

        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-sky-300 transition-colors cursor-pointer bg-white/50">
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            id="verification-docs"
          />
          <label htmlFor="verification-docs" className="cursor-pointer">
            <Upload className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-700">
              Drag and drop files here, or click to browse
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PDF, JPG, or PNG up to 10MB each
            </p>
          </label>
        </div>

        <p className="text-xs text-gray-500 italic">
          Documents are securely stored and only used for verification purposes.
          You can skip this step and verify later from your settings.
        </p>
      </div>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="text-center space-y-6 py-4">
      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-100 to-sky-100 flex items-center justify-center shadow-lg">
        <CheckCircle className="h-10 w-10 text-emerald-500" />
      </div>

      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Profile Complete!
        </h3>
        <p className="text-gray-600">
          {isLandlord
            ? "You're ready to start listing properties and connecting with renters."
            : "You're ready to start browsing listings and applying for your new home."}
        </p>
      </div>

      <div className="p-4 rounded-xl bg-gradient-to-r from-sky-50 to-emerald-50 border border-sky-100">
        <div className="flex items-center justify-center gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-sky-600">{progress}%</p>
            <p className="text-sm text-gray-600">Profile Complete</p>
          </div>
          <div className="h-12 w-px bg-gray-200" />
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-600">
              {isLandlord ? "Ready" : "Ready"}
            </p>
            <p className="text-sm text-gray-600">
              {isLandlord ? "To List" : "To Apply"}
            </p>
          </div>
        </div>
      </div>

      <Button
        variant="gradient"
        size="lg"
        className="w-full"
        onClick={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>Saving...</>
        ) : (
          <>
            {isLandlord ? "Go to Dashboard" : "Start Browsing"}
            <ChevronRight className="h-4 w-4 ml-1" />
          </>
        )}
      </Button>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep.id) {
      case "basic":
        return renderBasicInfoStep();
      case "preferences":
        return renderPreferencesStep();
      case "renter-details":
        return renderRenterDetailsStep();
      case "business":
        return renderBusinessInfoStep();
      case "verification":
        return renderVerificationStep();
      case "complete":
        return renderCompleteStep();
      default:
        return null;
    }
  };

  const containerClass = isModal
    ? "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
    : "";

  const cardClass = isModal
    ? "w-full max-w-lg max-h-[90vh] overflow-y-auto"
    : "w-full";

  return (
    <div className={containerClass}>
      <Card
        variant="glass"
        className={cn(
          cardClass,
          "bg-white/80 backdrop-blur-2xl border-sky-100 shadow-2xl"
        )}
      >
        {/* Header */}
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">
                {isCompleteStep ? "All Done!" : "Complete Your Profile"}
              </CardTitle>
              <CardDescription className="mt-1">
                {currentStep.description}
              </CardDescription>
            </div>
            {isModal && onDismiss && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={onDismiss}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Progress Section */}
          {!isCompleteStep && (
            <div className="mt-4 space-y-3">
              {/* Step indicator */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  Step {currentStepIndex + 1} of {steps.length - 1}
                </span>
                <span className="font-medium text-sky-600">{progress}% complete</span>
              </div>

              {/* Segmented progress */}
              <SegmentedProgress
                steps={steps.length - 1}
                currentStep={currentStepIndex}
                variant="gradient"
              />

              {/* Step pills */}
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {steps.slice(0, -1).map((step, index) => {
                  const StepIcon = step.icon;
                  const isActive = index === currentStepIndex;
                  const isComplete = index < currentStepIndex;

                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => {
                        if (isComplete) setCurrentStepIndex(index);
                      }}
                      disabled={!isComplete && !isActive}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                        isActive && "bg-sky-500 text-white shadow-[0_2px_10px_rgba(56,189,248,0.4)]",
                        isComplete && "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 cursor-pointer",
                        !isActive && !isComplete && "bg-gray-100 text-gray-400 cursor-not-allowed"
                      )}
                    >
                      <StepIcon className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">{step.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </CardHeader>

        {/* Content */}
        <CardContent className="pb-6">
          <form onSubmit={(e) => e.preventDefault()}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderCurrentStep()}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            {!isCompleteStep && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                <div>
                  {!isFirstStep && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleBack}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Back
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {currentStep.id !== "basic" && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleSkip}
                      className="text-gray-500"
                    >
                      Skip
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="gradient"
                    onClick={handleNext}
                  >
                    {currentStepIndex === steps.length - 2 ? "Complete" : "Continue"}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
