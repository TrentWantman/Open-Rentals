"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ListingDetailSkeleton } from "@/components/ui/loading-skeleton";
import { RentalApplicationModal } from "@/components/rental-application";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  CheckCircle,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MessageCircle,
  Shield,
  Star,
  Wifi,
  Car,
  Dumbbell,
  UtensilsCrossed,
  Waves,
  PawPrint,
  Snowflake,
  Loader2,
  Phone,
  Mail,
  User,
  Building,
  Clock,
  ArrowUpRight,
  Home,
  Tv,
  Wind,
  Lock,
  Sparkles,
  Trees,
  FileText,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Type definitions
interface Amenity {
  icon: LucideIcon;
  name: string;
  category: string;
}

interface Landlord {
  id: string;
  name: string;
  image: string;
  verified: boolean;
  responseRate: number;
  responseTime: string;
  listings: number;
  rating: number;
  reviews: number;
  phone?: string;
  email?: string;
}

interface Listing {
  id: string;
  slug: string;
  title: string;
  address: string;
  neighborhood: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  description: string;
  images: string[];
  verified: boolean;
  featured: boolean;
  available: boolean;
  availableDate: string;
  amenities: Amenity[];
  landlord: Landlord;
  coordinates: { lat: number; lng: number };
  leaseTerms: string[];
  petPolicy: string;
  utilities: string[];
}

// Mock data - in a real app, this would come from an API
const mockListing: Listing = {
  id: "1",
  slug: "luxury-brickell-highrise",
  title: "Luxury Brickell Highrise",
  address: "1000 Brickell Ave, Miami, FL 33131",
  neighborhood: "Brickell",
  price: 4500,
  beds: 2,
  baths: 2,
  sqft: 1200,
  description: `Experience luxury living in the heart of Brickell! This stunning 2-bedroom, 2-bathroom unit offers breathtaking views of Biscayne Bay and the Miami skyline.

Features include:
- Floor-to-ceiling windows with panoramic views
- Modern European kitchen with high-end appliances
- Spacious master suite with walk-in closet
- In-unit washer and dryer
- Private balcony

Building amenities include a state-of-the-art fitness center, rooftop pool, concierge service, and 24/7 security. Walking distance to Brickell City Centre, restaurants, and nightlife.`,
  images: [
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=1200&h=800&fit=crop",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&h=800&fit=crop",
  ],
  verified: true,
  featured: true,
  available: true,
  availableDate: "2024-02-01",
  amenities: [
    { icon: Wifi, name: "High-Speed Internet", category: "Technology" },
    { icon: Car, name: "Parking Included", category: "Building" },
    { icon: Dumbbell, name: "Fitness Center", category: "Building" },
    { icon: Waves, name: "Pool Access", category: "Building" },
    { icon: UtensilsCrossed, name: "In-Unit Kitchen", category: "Kitchen" },
    { icon: PawPrint, name: "Pet Friendly", category: "Policies" },
    { icon: Snowflake, name: "Central A/C", category: "Climate" },
    { icon: Tv, name: "Smart TV Ready", category: "Technology" },
    { icon: Wind, name: "In-Unit Laundry", category: "Appliances" },
    { icon: Lock, name: "24/7 Security", category: "Building" },
    { icon: Sparkles, name: "Concierge Service", category: "Building" },
    { icon: Trees, name: "Balcony/Terrace", category: "Outdoor" },
  ],
  landlord: {
    id: "landlord-1",
    name: "Miami Properties LLC",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop",
    verified: true,
    responseRate: 98,
    responseTime: "within 2 hours",
    listings: 12,
    rating: 4.9,
    reviews: 47,
    phone: "(305) 555-0123",
    email: "contact@miamiproperties.com",
  },
  coordinates: { lat: 25.7617, lng: -80.1918 },
  leaseTerms: ["12-month lease", "6-month available", "First & last month required"],
  petPolicy: "Dogs and cats welcome with $500 pet deposit. Max 2 pets, 50 lbs each.",
  utilities: ["Water included", "Electricity separate", "Internet ready"],
};

// Image Gallery component with smooth transitions
function ImageGallery({
  images,
  title,
  verified,
  featured,
}: {
  images: string[];
  title: string;
  verified: boolean;
  featured: boolean;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setIsImageLoading(true);
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setIsAutoPlaying(false);
  }, [images.length]);

  const handleNext = useCallback(() => {
    setDirection(1);
    setIsImageLoading(true);
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setIsAutoPlaying(false);
  }, [images.length]);

  const handleThumbnailClick = (index: number) => {
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? 1 : -1);
    setIsImageLoading(true);
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setDirection(1);
      setIsImageLoading(true);
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: window.location.href,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  return (
    <Card variant="glass" className="overflow-hidden bg-white/70 backdrop-blur-xl border-sky-100/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-sky-50 to-emerald-50/30">
        {/* Loading indicator */}
        {isImageLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-br from-sky-50 to-emerald-50/30">
            <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
          </div>
        )}

        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.2 },
            }}
            className="absolute inset-0"
          >
            <Image
              src={images[currentIndex]}
              alt={`${title} - Image ${currentIndex + 1}`}
              fill
              className="object-cover"
              priority={currentIndex === 0}
              sizes="(max-width: 1024px) 100vw, 66vw"
              onLoad={() => setIsImageLoading(false)}
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

        {/* Navigation Arrows */}
        <Button
          variant="glass"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg border-white/50 backdrop-blur-xl"
          onClick={handlePrev}
          aria-label="Previous image"
        >
          <ChevronLeft className="h-5 w-5 text-gray-700" />
        </Button>
        <Button
          variant="glass"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg border-white/50 backdrop-blur-xl"
          onClick={handleNext}
          aria-label="Next image"
        >
          <ChevronRight className="h-5 w-5 text-gray-700" />
        </Button>

        {/* Image Counter & Progress Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-2 rounded-full bg-white/90 backdrop-blur-xl shadow-lg border border-white/50">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={cn(
                "transition-all duration-300 rounded-full",
                currentIndex === index
                  ? "w-6 h-2 bg-gradient-to-r from-sky-500 to-emerald-500"
                  : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
              )}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {verified && (
            <Badge variant="success" className="shadow-lg backdrop-blur-sm">
              <CheckCircle className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          )}
          {featured && (
            <Badge variant="warning" className="shadow-lg backdrop-blur-sm">
              <Star className="h-3 w-3 mr-1" />
              Featured
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="glass"
            size="icon"
            onClick={() => {
              setIsSaved(!isSaved);
              toast.success(isSaved ? "Removed from saved" : "Saved to favorites");
            }}
            className="bg-white/90 hover:bg-white shadow-lg border-white/50 backdrop-blur-xl"
            aria-label={isSaved ? "Remove from saved" : "Save listing"}
          >
            <Heart
              className={cn(
                "h-5 w-5 transition-all duration-300",
                isSaved ? "fill-red-500 text-red-500 scale-110" : "text-gray-700"
              )}
            />
          </Button>
          <Button
            variant="glass"
            size="icon"
            onClick={handleShare}
            className="bg-white/90 hover:bg-white shadow-lg border-white/50 backdrop-blur-xl"
            aria-label="Share listing"
          >
            <Share2 className="h-5 w-5 text-gray-700" />
          </Button>
        </div>
      </div>

      {/* Thumbnail Strip */}
      <div className="flex gap-2 p-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent bg-gradient-to-r from-white/50 to-sky-50/30">
        {images.map((image, index) => (
          <motion.button
            key={index}
            onClick={() => handleThumbnailClick(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "relative w-20 h-14 rounded-lg overflow-hidden shrink-0 transition-all duration-300",
              currentIndex === index
                ? "ring-2 ring-sky-500 ring-offset-2 shadow-lg"
                : "opacity-60 hover:opacity-100 hover:shadow-md"
            )}
          >
            <Image
              src={image}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="object-cover"
              sizes="80px"
            />
          </motion.button>
        ))}
      </div>
    </Card>
  );
}

// Contact Form Component
function ContactForm({
  listingTitle,
}: {
  listingTitle: string;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: `Hi, I'm interested in the property "${listingTitle}". I would like to schedule a viewing.`,
  });
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to send a message");
      router.push("/login");
      return;
    }

    if (!formData.message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setIsSending(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Message sent successfully! The landlord will respond shortly.");
      setFormData((prev) => ({ ...prev, message: "" }));
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-gray-700 text-sm font-medium">
            Your Name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              className="pl-9"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-gray-700 text-sm font-medium">
            Phone
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="phone"
              type="tel"
              placeholder="(555) 123-4567"
              value={formData.phone}
              onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-gray-700 text-sm font-medium">
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
            className="pl-9"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message" className="text-gray-700 text-sm font-medium">
          Message
        </Label>
        <Textarea
          id="message"
          placeholder="Hi, I'm interested in this property..."
          value={formData.message}
          onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
          className="resize-none min-h-[100px]"
          rows={4}
        />
      </div>

      <Button
        type="submit"
        variant="gradient"
        className="w-full h-11 font-semibold"
        disabled={isSending}
      >
        {isSending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Sending...
          </>
        ) : (
          <>
            <MessageCircle className="h-4 w-4 mr-2" />
            Send Message
          </>
        )}
      </Button>
    </form>
  );
}

// Amenities Section Component
function AmenitiesSection({ amenities }: { amenities: Amenity[] }) {
  // Group amenities by category
  const grouped = amenities.reduce(
    (acc, amenity) => {
      if (!acc[amenity.category]) {
        acc[amenity.category] = [];
      }
      acc[amenity.category].push(amenity);
      return acc;
    },
    {} as Record<string, Amenity[]>
  );

  const categoryOrder = ["Building", "Technology", "Kitchen", "Appliances", "Climate", "Outdoor", "Policies"];
  const sortedCategories = Object.keys(grouped).sort(
    (a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b)
  );

  return (
    <Card variant="glass" className="p-6 bg-white/70 backdrop-blur-xl border-sky-100/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Home className="h-5 w-5 text-sky-500" />
        Amenities & Features
      </h2>

      <div className="space-y-6">
        {sortedCategories.map((category) => (
          <div key={category}>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
              {category}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {grouped[category].map((amenity, index) => {
                const IconComponent = amenity.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-sky-50/80 to-emerald-50/50 border border-sky-100/50 hover:border-sky-200/70 hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="p-2 rounded-lg bg-white/80 shadow-sm group-hover:shadow-md group-hover:bg-white transition-all duration-300">
                      <IconComponent className="h-4 w-4 text-sky-600" />
                    </div>
                    <span className="text-gray-700 text-sm font-medium">
                      {amenity.name}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// Map Section Component
function MapSection({
  address,
  neighborhood,
  coordinates,
}: {
  address: string;
  neighborhood: string;
  coordinates: { lat: number; lng: number };
}) {
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Simulate map loading
  useEffect(() => {
    const timer = setTimeout(() => setIsMapLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card variant="glass" className="p-6 bg-white/70 backdrop-blur-xl border-sky-100/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <MapPin className="h-5 w-5 text-emerald-500" />
        Location
      </h2>

      <div className="aspect-[16/9] rounded-xl overflow-hidden bg-gradient-to-br from-sky-50 to-emerald-50/50 border border-sky-100/50 relative">
        {!isMapLoaded ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
              <span className="text-sm text-gray-500">Loading map...</span>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0">
            <div className="relative w-full h-full bg-gradient-to-br from-sky-100/50 to-emerald-100/50">
              {/* Map background pattern */}
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(56,189,248,0.15) 1px, transparent 0)`,
                backgroundSize: '24px 24px'
              }} />

              {/* Center marker */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <motion.div
                  initial={{ scale: 0, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                  className="relative"
                >
                  <div className="absolute -inset-4 bg-sky-500/20 rounded-full animate-ping" />
                  <div className="absolute -inset-8 bg-sky-500/10 rounded-full animate-pulse" />
                  <div className="relative p-3 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-full shadow-lg shadow-sky-500/30">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                </motion.div>
              </div>

              {/* Location info overlay */}
              <motion.div
                className="absolute bottom-4 left-4 right-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="bg-white/95 backdrop-blur-xl rounded-xl p-4 shadow-lg border border-white/50">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{neighborhood}</h3>
                      <p className="text-sm text-gray-600 mt-1">{address}</p>
                    </div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0"
                    >
                      <Button variant="outline" size="sm" className="gap-1 hover:bg-sky-50 hover:border-sky-200 hover:text-sky-700 transition-colors">
                        Open in Maps
                        <ArrowUpRight className="h-3 w-3" />
                      </Button>
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>

      {/* Nearby landmarks */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <motion.div
          className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-sky-50/80 to-white border border-sky-100/50 hover:shadow-md transition-shadow"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="p-2 rounded-lg bg-sky-100">
            <Building className="h-4 w-4 text-sky-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Brickell City Centre</p>
            <p className="text-xs text-gray-500">5 min walk</p>
          </div>
        </motion.div>
        <motion.div
          className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-emerald-50/80 to-white border border-emerald-100/50 hover:shadow-md transition-shadow"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="p-2 rounded-lg bg-emerald-100">
            <UtensilsCrossed className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Restaurants & Cafes</p>
            <p className="text-xs text-gray-500">2 min walk</p>
          </div>
        </motion.div>
      </div>
    </Card>
  );
}

// JSON-LD Component for Property Listing
function PropertyJsonLd({ listing }: { listing: Listing }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Apartment",
    name: listing.title,
    description: listing.description,
    url: `https://openrentals.dev/listings/${listing.slug}`,
    image: listing.images,
    address: {
      "@type": "PostalAddress",
      streetAddress: listing.address.split(",")[0],
      addressLocality: "Miami",
      addressRegion: "FL",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: listing.coordinates.lat,
      longitude: listing.coordinates.lng,
    },
    numberOfRooms: listing.beds,
    numberOfBathroomsTotal: listing.baths,
    floorSize: {
      "@type": "QuantitativeValue",
      value: listing.sqft,
      unitCode: "FTK",
    },
    amenityFeature: listing.amenities.map((a) => ({
      "@type": "LocationFeatureSpecification",
      name: a.name,
    })),
    offers: {
      "@type": "Offer",
      price: listing.price,
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: listing.price,
        priceCurrency: "USD",
        unitText: "MONTH",
      },
      availability: listing.available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      availabilityStarts: listing.availableDate,
    },
    landlord: {
      "@type": "Organization",
      name: listing.landlord.name,
      image: listing.landlord.image,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// Main Property Detail Content
function PropertyDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [listing, setListing] = useState<Listing | null>(null);

  // Simulate fetching data
  useEffect(() => {
    const fetchListing = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 600));
        setListing(mockListing);
      } catch {
        toast.error("Failed to load listing");
      } finally {
        setIsLoading(false);
      }
    };

    fetchListing();
  }, [params.slug]);

  const handleApply = () => {
    if (!user) {
      toast.error("Please log in to apply for this property");
      router.push("/login");
      return;
    }

    // Check if user profile is complete (basic check - full name and email)
    if (!user.firstName || !user.lastName || !user.email) {
      toast.error("Please complete your profile before applying", {
        description: "Your profile needs a full name and email address.",
        action: {
          label: "Go to Profile",
          onClick: () => router.push("/dashboard"),
        },
      });
      return;
    }

    // Open the application modal
    setIsApplicationModalOpen(true);
  };

  if (isLoading || !listing) {
    return <ListingDetailSkeleton />;
  }

  return (
    <>
      <PropertyJsonLd listing={listing} />
      <div className="min-h-screen pt-20 pb-12 bg-gradient-to-b from-sky-50/50 via-white to-emerald-50/30">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link
            href="/listings"
            className="text-gray-500 hover:text-sky-600 transition-colors"
          >
            Listings
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <Link
            href={`/listings?neighborhood=${listing.neighborhood}`}
            className="text-gray-500 hover:text-sky-600 transition-colors"
          >
            {listing.neighborhood}
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <span className="text-gray-900 font-medium truncate max-w-[200px]">
            {listing.title}
          </span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <ImageGallery
              images={listing.images}
              title={listing.title}
              verified={listing.verified}
              featured={listing.featured}
            />

            {/* Property Info */}
            <Card variant="glass" className="p-6 bg-white/70 backdrop-blur-xl border-sky-100/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {listing.title}
                  </h1>
                  <p className="text-gray-600 flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-sky-500" />
                    {listing.address}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
                    ${listing.price.toLocaleString()}
                    <span className="text-lg text-gray-500 font-normal">/mo</span>
                  </div>
                  {listing.available && (
                    <p className="text-sm text-emerald-600 flex items-center justify-end gap-1 mt-1">
                      <Calendar className="h-4 w-4" />
                      Available {new Date(listing.availableDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </div>

              {/* Property Stats */}
              <div className="flex flex-wrap gap-6 py-4 border-y border-sky-100/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-sky-50 border border-sky-100">
                    <Bed className="h-5 w-5 text-sky-600" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{listing.beds}</p>
                    <p className="text-sm text-gray-500">Bedrooms</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                    <Bath className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{listing.baths}</p>
                    <p className="text-sm text-gray-500">Bathrooms</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-teal-50 border border-teal-100">
                    <Square className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{listing.sqft.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Sq. Ft.</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">About This Property</h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {listing.description}
                </p>
              </div>

              {/* Lease Terms & Policies */}
              <div className="mt-6 grid md:grid-cols-2 gap-6">
                <div className="p-4 rounded-xl bg-gradient-to-br from-sky-50/80 to-white border border-sky-100/50">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-sky-500" />
                    Lease Terms
                  </h3>
                  <ul className="space-y-2">
                    {listing.leaseTerms.map((term, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                        {term}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50/80 to-white border border-emerald-100/50">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <PawPrint className="h-4 w-4 text-emerald-500" />
                    Pet Policy
                  </h3>
                  <p className="text-sm text-gray-700">{listing.petPolicy}</p>
                  <div className="mt-3">
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      Utilities
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {listing.utilities.map((utility, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {utility}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Amenities */}
            <AmenitiesSection amenities={listing.amenities} />

            {/* Location */}
            <MapSection
              address={listing.address}
              neighborhood={listing.neighborhood}
              coordinates={listing.coordinates}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-6">
            {/* Apply Card */}
            <Card variant="glass" className="p-6 bg-white/70 backdrop-blur-xl border-sky-100/50 shadow-[0_8px_32px_rgba(0,0,0,0.08)] lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent mb-1">
                  ${listing.price.toLocaleString()}
                  <span className="text-lg text-gray-500 font-normal">/mo</span>
                </div>
                <p className="text-sm text-gray-500">Plus utilities (est. $150/mo)</p>
              </div>

              <div className="space-y-3 mb-6">
                <Button
                  variant="gradient"
                  className="w-full h-12 text-lg font-semibold"
                  onClick={handleApply}
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Apply Now
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-11 hover:bg-sky-50 hover:border-sky-200 hover:text-sky-700 transition-colors"
                  onClick={() => toast.info("Schedule Tour feature coming soon!")}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Schedule Tour
                </Button>
              </div>

              <Separator className="my-6 bg-sky-100/50" />

              {/* Landlord Info */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-14 w-14 ring-2 ring-sky-100 ring-offset-2">
                    <AvatarImage src={listing.landlord.image} alt={listing.landlord.name} />
                    <AvatarFallback className="bg-gradient-to-br from-sky-100 to-emerald-100 text-gray-700 font-semibold">
                      {listing.landlord.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        {listing.landlord.name}
                      </span>
                      {listing.landlord.verified && (
                        <Shield className="h-4 w-4 text-sky-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      <span className="font-medium text-gray-900">
                        {listing.landlord.rating}
                      </span>
                      <span>({listing.landlord.reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-gradient-to-br from-sky-50/80 to-emerald-50/50 border border-sky-100/50">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900">
                      {listing.landlord.responseRate}%
                    </p>
                    <p className="text-xs text-gray-500">Response</p>
                  </div>
                  <div className="text-center border-x border-sky-100/50">
                    <p className="text-lg font-semibold text-gray-900">
                      &lt;2h
                    </p>
                    <p className="text-xs text-gray-500">Reply Time</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900">
                      {listing.landlord.listings}
                    </p>
                    <p className="text-xs text-gray-500">Listings</p>
                  </div>
                </div>
              </div>

              <Separator className="my-6 bg-sky-100/50" />

              {/* Contact Form */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-sky-500" />
                  Contact Landlord
                </h3>
                <ContactForm listingTitle={listing.title} />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>

    {/* Rental Application Modal */}
    <RentalApplicationModal
      isOpen={isApplicationModalOpen}
      onClose={() => setIsApplicationModalOpen(false)}
      listingId={listing.id}
      listingTitle={listing.title}
      listingPrice={listing.price}
      listingAddress={listing.address}
    />
    </>
  );
}

export default function PropertyDetailPage() {
  return (
    <Suspense fallback={<ListingDetailSkeleton />}>
      <PropertyDetailContent />
    </Suspense>
  );
}
