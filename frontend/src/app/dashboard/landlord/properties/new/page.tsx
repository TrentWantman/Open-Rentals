"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  Home,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Square,
  Wifi,
  Car,
  Dumbbell,
  Waves,
  PawPrint,
  Snowflake,
  UtensilsCrossed,
  Loader2,
  CheckCircle,
  X,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const neighborhoods = [
  "Brickell",
  "Coral Gables",
  "Miami Beach",
  "Wynwood",
  "Downtown",
  "Coconut Grove",
  "Little Havana",
  "Edgewater",
  "Midtown",
  "Design District",
];

const amenitiesList = [
  { id: "wifi", icon: Wifi, name: "High-Speed Internet" },
  { id: "parking", icon: Car, name: "Parking Included" },
  { id: "gym", icon: Dumbbell, name: "Fitness Center" },
  { id: "pool", icon: Waves, name: "Pool Access" },
  { id: "kitchen", icon: UtensilsCrossed, name: "In-Unit Kitchen" },
  { id: "pets", icon: PawPrint, name: "Pet Friendly" },
  { id: "ac", icon: Snowflake, name: "Central A/C" },
];

const propertyTypes = [
  "Apartment",
  "Condo",
  "Townhouse",
  "House",
  "Loft",
  "Studio",
];

// ZIP code validation regex (US format)
const ZIP_REGEX = /^\d{5}(-\d{4})?$/;

// Price validation
const isValidPrice = (price: string) => {
  const num = parseFloat(price);
  return !isNaN(num) && num > 0 && num <= 100000;
};

// Square feet validation
const isValidSqft = (sqft: string) => {
  const num = parseFloat(sqft);
  return !isNaN(num) && num > 0 && num <= 50000;
};

export default function NewPropertyPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    address: "",
    unit: "",
    neighborhood: "",
    city: "Miami",
    state: "FL",
    zip: "",
    price: "",
    beds: "",
    baths: "",
    sqft: "",
    description: "",
    amenities: [] as string[],
    availableDate: "",
    petPolicy: "allowed",
    images: [] as string[],
  });

  // Touched state for each step
  const [touchedStep1, setTouchedStep1] = useState({
    title: false,
    type: false,
  });
  const [touchedStep2, setTouchedStep2] = useState({
    address: false,
    neighborhood: false,
    city: false,
    state: false,
    zip: false,
  });
  const [touchedStep3, setTouchedStep3] = useState({
    price: false,
    beds: false,
    baths: false,
    sqft: false,
  });
  const [touchedStep4, setTouchedStep4] = useState({
    description: false,
  });

  // Validation for each step
  const validationStep1 = useMemo(() => ({
    title: {
      valid: formData.title.trim().length >= 5,
      message: formData.title.length === 0
        ? ""
        : formData.title.trim().length < 5
          ? "Title must be at least 5 characters"
          : "",
    },
    type: {
      valid: formData.type !== "",
      message: formData.type === "" ? "Please select a property type" : "",
    },
  }), [formData.title, formData.type]);

  const validationStep2 = useMemo(() => ({
    address: {
      valid: formData.address.trim().length >= 5,
      message: formData.address.length === 0
        ? ""
        : formData.address.trim().length < 5
          ? "Please enter a valid street address"
          : "",
    },
    neighborhood: {
      valid: formData.neighborhood !== "",
      message: formData.neighborhood === "" ? "Please select a neighborhood" : "",
    },
    city: {
      valid: formData.city.trim().length >= 2,
      message: formData.city.length === 0
        ? ""
        : formData.city.trim().length < 2
          ? "Please enter a valid city"
          : "",
    },
    state: {
      valid: formData.state.trim().length === 2,
      message: formData.state.length === 0
        ? ""
        : formData.state.trim().length !== 2
          ? "Please enter a valid state abbreviation (e.g., FL)"
          : "",
    },
    zip: {
      valid: ZIP_REGEX.test(formData.zip),
      message: formData.zip.length === 0
        ? ""
        : !ZIP_REGEX.test(formData.zip)
          ? "Please enter a valid ZIP code (e.g., 33131)"
          : "",
    },
  }), [formData.address, formData.neighborhood, formData.city, formData.state, formData.zip]);

  const validationStep3 = useMemo(() => ({
    price: {
      valid: isValidPrice(formData.price),
      message: formData.price.length === 0
        ? ""
        : !isValidPrice(formData.price)
          ? "Please enter a valid monthly rent ($1 - $100,000)"
          : "",
    },
    beds: {
      valid: formData.beds !== "",
      message: formData.beds === "" ? "Please select number of bedrooms" : "",
    },
    baths: {
      valid: formData.baths !== "",
      message: formData.baths === "" ? "Please select number of bathrooms" : "",
    },
    sqft: {
      valid: isValidSqft(formData.sqft),
      message: formData.sqft.length === 0
        ? ""
        : !isValidSqft(formData.sqft)
          ? "Please enter valid square footage (1 - 50,000 sq ft)"
          : "",
    },
  }), [formData.price, formData.beds, formData.baths, formData.sqft]);

  const validationStep4 = useMemo(() => ({
    description: {
      valid: formData.description.length >= 50,
      message: formData.description.length === 0
        ? ""
        : formData.description.length < 50
          ? `${50 - formData.description.length} more characters required`
          : "",
    },
  }), [formData.description]);

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAmenity = (amenityId: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((a) => a !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Property listed successfully!");
      router.push("/dashboard/landlord");
    } catch (error) {
      toast.error("Failed to create listing");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auth protection
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    } else if (!isLoading && user && user.role !== "landlord") {
      router.push("/dashboard/renter");
    }
  }, [user, isLoading, router]);

  const canProceed = () => {
    switch (step) {
      case 1:
        return validationStep1.title.valid && validationStep1.type.valid;
      case 2:
        return validationStep2.address.valid && validationStep2.neighborhood.valid &&
               validationStep2.city.valid && validationStep2.state.valid && validationStep2.zip.valid;
      case 3:
        return validationStep3.price.valid && validationStep3.beds.valid &&
               validationStep3.baths.valid && validationStep3.sqft.valid;
      case 4:
        return validationStep4.description.valid;
      default:
        return true;
    }
  };

  const handleNextStep = () => {
    // Mark all fields in current step as touched
    switch (step) {
      case 1:
        setTouchedStep1({ title: true, type: true });
        break;
      case 2:
        setTouchedStep2({ address: true, neighborhood: true, city: true, state: true, zip: true });
        break;
      case 3:
        setTouchedStep3({ price: true, beds: true, baths: true, sqft: true });
        break;
      case 4:
        setTouchedStep4({ description: true });
        break;
    }

    if (canProceed()) {
      setStep(step + 1);
    } else {
      toast.error("Please fix the validation errors before proceeding");
    }
  };

  // Helper to get input border style based on validation state
  const getInputBorderClass = (valid: boolean, touched: boolean, value: string) => {
    if (!touched || value.length === 0) return "";
    return valid
      ? "border-emerald-500 focus-visible:ring-emerald-500"
      : "border-red-500 focus-visible:ring-red-500";
  };

  // Helper to get validation icon
  const ValidationIcon = ({ valid, touched, value }: { valid: boolean; touched: boolean; value: string }) => {
    if (!touched || value.length === 0) return null;
    return valid ? (
      <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
    ) : (
      <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 flex items-center justify-center">
        <Card variant="glass" className="p-8 text-center max-w-sm mx-4 bg-white/70 backdrop-blur-xl border-sky-100 shadow-lg">
          <Loader2 className="h-10 w-10 animate-spin text-sky-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Loading</h2>
          <p className="text-gray-600 text-sm">Please wait...</p>
        </Card>
      </div>
    );
  }

  // Redirect if not authenticated or wrong role
  if (!user || user.role !== "landlord") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/dashboard/landlord">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">List a New Property</h1>
          <p className="text-gray-600">
            Fill in the details below to create your property listing
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all",
                  s < step
                    ? "bg-sky-500 text-white"
                    : s === step
                    ? "bg-sky-100 text-sky-600 border-2 border-sky-500"
                    : "bg-gray-100 text-gray-500"
                )}
              >
                {s < step ? <CheckCircle className="h-5 w-5" /> : s}
              </div>
              {s < 5 && (
                <div
                  className={cn(
                    "w-12 md:w-24 h-1 mx-2",
                    s < step ? "bg-sky-500" : "bg-gray-200"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        <Card variant="glass" className="p-6 md:p-8 bg-white/60 backdrop-blur-sm border-sky-100 shadow-lg">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <CardTitle className="text-xl text-gray-900 mb-2">Basic Information</CardTitle>
                <CardDescription>Start with the basics about your property</CardDescription>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-700">
                    Property Title <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="title"
                      placeholder="e.g., Luxury Brickell Highrise"
                      className={cn("pr-10", getInputBorderClass(validationStep1.title.valid, touchedStep1.title, formData.title))}
                      value={formData.title}
                      onChange={(e) => updateFormData("title", e.target.value)}
                      onBlur={() => setTouchedStep1(prev => ({ ...prev, title: true }))}
                    />
                    <ValidationIcon valid={validationStep1.title.valid} touched={touchedStep1.title} value={formData.title} />
                  </div>
                  {touchedStep1.title && validationStep1.title.message && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {validationStep1.title.message}
                    </p>
                  )}
                  {touchedStep1.title && validationStep1.title.valid && (
                    <p className="text-sm text-emerald-500 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Great title!
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700">
                    Property Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(v) => {
                      updateFormData("type", v);
                      setTouchedStep1(prev => ({ ...prev, type: true }));
                    }}
                  >
                    <SelectTrigger className={cn(
                      touchedStep1.type && formData.type === "" && "border-red-500",
                      touchedStep1.type && formData.type !== "" && "border-emerald-500"
                    )}>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map((type) => (
                        <SelectItem key={type} value={type.toLowerCase()}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {touchedStep1.type && !validationStep1.type.valid && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {validationStep1.type.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <CardTitle className="text-xl text-gray-900 mb-2">Location</CardTitle>
                <CardDescription>Where is your property located?</CardDescription>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-gray-700">
                    Street Address <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="address"
                      placeholder="123 Main Street"
                      className={cn("pl-10 pr-10", getInputBorderClass(validationStep2.address.valid, touchedStep2.address, formData.address))}
                      value={formData.address}
                      onChange={(e) => updateFormData("address", e.target.value)}
                      onBlur={() => setTouchedStep2(prev => ({ ...prev, address: true }))}
                    />
                    <ValidationIcon valid={validationStep2.address.valid} touched={touchedStep2.address} value={formData.address} />
                  </div>
                  {touchedStep2.address && validationStep2.address.message && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {validationStep2.address.message}
                    </p>
                  )}
                  {touchedStep2.address && validationStep2.address.valid && (
                    <p className="text-sm text-emerald-500 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Valid address
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="unit" className="text-gray-700">Unit/Apt # (optional)</Label>
                    <Input
                      id="unit"
                      placeholder="e.g., 4B"
                      value={formData.unit}
                      onChange={(e) => updateFormData("unit", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">
                      Neighborhood <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.neighborhood}
                      onValueChange={(v) => {
                        updateFormData("neighborhood", v);
                        setTouchedStep2(prev => ({ ...prev, neighborhood: true }));
                      }}
                    >
                      <SelectTrigger className={cn(
                        touchedStep2.neighborhood && formData.neighborhood === "" && "border-red-500",
                        touchedStep2.neighborhood && formData.neighborhood !== "" && "border-emerald-500"
                      )}>
                        <SelectValue placeholder="Select neighborhood" />
                      </SelectTrigger>
                      <SelectContent>
                        {neighborhoods.map((n) => (
                          <SelectItem key={n} value={n}>
                            {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {touchedStep2.neighborhood && !validationStep2.neighborhood.valid && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {validationStep2.neighborhood.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-gray-700">
                      City <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="city"
                        className={cn("pr-10", getInputBorderClass(validationStep2.city.valid, touchedStep2.city, formData.city))}
                        value={formData.city}
                        onChange={(e) => updateFormData("city", e.target.value)}
                        onBlur={() => setTouchedStep2(prev => ({ ...prev, city: true }))}
                      />
                      <ValidationIcon valid={validationStep2.city.valid} touched={touchedStep2.city} value={formData.city} />
                    </div>
                    {touchedStep2.city && validationStep2.city.message && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {validationStep2.city.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-gray-700">
                      State <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="state"
                        maxLength={2}
                        className={cn("pr-10 uppercase", getInputBorderClass(validationStep2.state.valid, touchedStep2.state, formData.state))}
                        value={formData.state}
                        onChange={(e) => updateFormData("state", e.target.value.toUpperCase())}
                        onBlur={() => setTouchedStep2(prev => ({ ...prev, state: true }))}
                      />
                      <ValidationIcon valid={validationStep2.state.valid} touched={touchedStep2.state} value={formData.state} />
                    </div>
                    {touchedStep2.state && validationStep2.state.message && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {validationStep2.state.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip" className="text-gray-700">
                      ZIP Code <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="zip"
                        placeholder="33131"
                        className={cn("pr-10", getInputBorderClass(validationStep2.zip.valid, touchedStep2.zip, formData.zip))}
                        value={formData.zip}
                        onChange={(e) => updateFormData("zip", e.target.value)}
                        onBlur={() => setTouchedStep2(prev => ({ ...prev, zip: true }))}
                      />
                      <ValidationIcon valid={validationStep2.zip.valid} touched={touchedStep2.zip} value={formData.zip} />
                    </div>
                    {touchedStep2.zip && validationStep2.zip.message && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {validationStep2.zip.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Details */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <CardTitle className="text-xl text-gray-900 mb-2">Property Details</CardTitle>
                <CardDescription>Tell us more about your property</CardDescription>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-gray-700">
                    Monthly Rent <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="price"
                      type="number"
                      placeholder="4500"
                      className={cn("pl-10 pr-10", getInputBorderClass(validationStep3.price.valid, touchedStep3.price, formData.price))}
                      value={formData.price}
                      onChange={(e) => updateFormData("price", e.target.value)}
                      onBlur={() => setTouchedStep3(prev => ({ ...prev, price: true }))}
                    />
                    <ValidationIcon valid={validationStep3.price.valid} touched={touchedStep3.price} value={formData.price} />
                  </div>
                  {touchedStep3.price && validationStep3.price.message && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {validationStep3.price.message}
                    </p>
                  )}
                  {touchedStep3.price && validationStep3.price.valid && (
                    <p className="text-sm text-emerald-500 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      ${parseInt(formData.price).toLocaleString()}/month
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700">
                      Bedrooms <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.beds}
                      onValueChange={(v) => {
                        updateFormData("beds", v);
                        setTouchedStep3(prev => ({ ...prev, beds: true }));
                      }}
                    >
                      <SelectTrigger className={cn(
                        touchedStep3.beds && formData.beds === "" && "border-red-500",
                        touchedStep3.beds && formData.beds !== "" && "border-emerald-500"
                      )}>
                        <SelectValue placeholder="Beds" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Studio</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5+</SelectItem>
                      </SelectContent>
                    </Select>
                    {touchedStep3.beds && !validationStep3.beds.valid && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Required
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-700">
                      Bathrooms <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.baths}
                      onValueChange={(v) => {
                        updateFormData("baths", v);
                        setTouchedStep3(prev => ({ ...prev, baths: true }));
                      }}
                    >
                      <SelectTrigger className={cn(
                        touchedStep3.baths && formData.baths === "" && "border-red-500",
                        touchedStep3.baths && formData.baths !== "" && "border-emerald-500"
                      )}>
                        <SelectValue placeholder="Baths" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="1.5">1.5</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="2.5">2.5</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="3.5">3.5+</SelectItem>
                      </SelectContent>
                    </Select>
                    {touchedStep3.baths && !validationStep3.baths.valid && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Required
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sqft" className="text-gray-700">
                      Sq. Feet <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="sqft"
                        type="number"
                        placeholder="1200"
                        className={cn("pr-10", getInputBorderClass(validationStep3.sqft.valid, touchedStep3.sqft, formData.sqft))}
                        value={formData.sqft}
                        onChange={(e) => updateFormData("sqft", e.target.value)}
                        onBlur={() => setTouchedStep3(prev => ({ ...prev, sqft: true }))}
                      />
                      <ValidationIcon valid={validationStep3.sqft.valid} touched={touchedStep3.sqft} value={formData.sqft} />
                    </div>
                    {touchedStep3.sqft && validationStep3.sqft.message && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {validationStep3.sqft.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availableDate" className="text-gray-700">Available Date</Label>
                  <Input
                    id="availableDate"
                    type="date"
                    value={formData.availableDate}
                    onChange={(e) => updateFormData("availableDate", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Description & Amenities */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <CardTitle className="text-xl text-gray-900 mb-2">Description & Amenities</CardTitle>
                <CardDescription>Describe your property and select amenities</CardDescription>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-700">
                    Description <span className="text-red-500">*</span> (minimum 50 characters)
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your property in detail. Include unique features, nearby attractions, and what makes it special..."
                    rows={6}
                    className={cn(
                      touchedStep4.description && !validationStep4.description.valid && "border-red-500",
                      touchedStep4.description && validationStep4.description.valid && "border-emerald-500"
                    )}
                    value={formData.description}
                    onChange={(e) => updateFormData("description", e.target.value)}
                    onBlur={() => setTouchedStep4(prev => ({ ...prev, description: true }))}
                  />
                  <div className="flex items-center justify-between">
                    <p className={cn(
                      "text-xs",
                      formData.description.length >= 50 ? "text-emerald-500" : "text-gray-500"
                    )}>
                      {formData.description.length}/50 characters minimum
                      {formData.description.length >= 50 && (
                        <CheckCircle className="inline h-3 w-3 ml-1" />
                      )}
                    </p>
                    {touchedStep4.description && validationStep4.description.message && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {validationStep4.description.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-gray-700">Amenities</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {amenitiesList.map((amenity) => (
                      <button
                        key={amenity.id}
                        type="button"
                        onClick={() => toggleAmenity(amenity.id)}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg border transition-all text-left",
                          formData.amenities.includes(amenity.id)
                            ? "bg-sky-100 border-sky-400 text-sky-600"
                            : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                        )}
                      >
                        <amenity.icon className="h-5 w-5" />
                        <span className="text-sm">{amenity.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Photos */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <CardTitle className="text-xl text-gray-900 mb-2">Photos</CardTitle>
                <CardDescription>Add photos to showcase your property</CardDescription>
              </div>

              <div className="space-y-4">
                <div
                  className={cn(
                    "border-2 border-dashed rounded-xl p-12 text-center transition-colors",
                    "border-gray-300 hover:border-sky-400 cursor-pointer bg-gray-50"
                  )}
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-700 mb-2">
                    Drag and drop photos here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG up to 10MB each. Maximum 10 photos.
                  </p>
                  <Button variant="outline" className="mt-4">
                    Browse Files
                  </Button>
                </div>

                <p className="text-sm text-gray-600">
                  Tip: High-quality photos get 2x more views. Include photos of all rooms, amenities, and the building exterior.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {step < 5 ? (
              <Button
                variant="gradient"
                onClick={handleNextStep}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                variant="gradient"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Publish Listing
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
