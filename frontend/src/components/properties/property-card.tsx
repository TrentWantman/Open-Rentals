"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  CheckCircle,
  Star,
  Heart,
} from "lucide-react";

export interface Property {
  id: string;
  slug: string;
  title: string;
  address: string;
  neighborhood: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  images?: string[];
  verified?: boolean;
  featured?: boolean;
  available?: boolean;
  coordinates?: { lat: number; lng: number };
}

interface PropertyCardProps {
  property: Property;
  className?: string;
  index?: number;
}

export function PropertyCard({ property, className, index = 0 }: PropertyCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  // Create a descriptive alt text for the property image
  const imageAltText = `${property.title} - ${property.beds} bedroom${property.beds !== 1 ? 's' : ''}, ${property.baths} bathroom${property.baths !== 1 ? 's' : ''} property in ${property.neighborhood}`;

  // Create accessible label for the entire card link
  const cardAriaLabel = `View details for ${property.title} at ${property.address}. ${property.beds} bed${property.beds !== 1 ? 's' : ''}, ${property.baths} bath${property.baths !== 1 ? 's' : ''}, ${property.sqft.toLocaleString()} square feet. $${property.price.toLocaleString()} per month.${property.verified ? ' Verified listing.' : ''}${property.featured ? ' Featured property.' : ''}${property.available === false ? ' Currently not available.' : ''}`;

  return (
    <article className="h-full">
      <Link
        href={`/listings/${property.slug}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 rounded-xl"
        aria-label={cardAriaLabel}
      >
        <Card
          variant="glass"
          interactive
          hoverGlow
          animate
          animationDelay={index * 80}
          className={cn(
            "overflow-hidden h-full group",
            "hover:shadow-[0_32px_64px_rgba(14,165,233,0.12),0_16px_32px_rgba(0,0,0,0.08)]",
            className
          )}
        >
        {/* Image Container with zoom effect */}
        <div className="relative h-56 overflow-hidden rounded-t-xl">
          {/* Skeleton loader - decorative */}
          {!imageLoaded && (
            <div className="absolute inset-0 skeleton" aria-hidden="true" />
          )}

          <Image
            src={property.image}
            alt={imageAltText}
            fill
            onLoad={() => setImageLoaded(true)}
            className={cn(
              "object-cover transition-all duration-700 ease-out",
              "group-hover:scale-110 group-hover:brightness-105",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
          />

          {/* Premium gradient overlay - decorative */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-300" aria-hidden="true" />

          {/* Subtle shine effect on hover - decorative */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />

          {/* Badges with shine effect - visual only, info in aria-label */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2" aria-hidden="true">
            {property.verified && (
              <Badge
                variant="success"
                className="badge-shine shadow-lg backdrop-blur-md bg-emerald-500/90 border-emerald-400/50 text-white"
              >
                <CheckCircle className="h-3 w-3 mr-1" aria-hidden="true" />
                Verified
              </Badge>
            )}
            {property.featured && (
              <Badge
                variant="warning"
                className="badge-shine shadow-lg backdrop-blur-md bg-amber-500/90 border-amber-400/50 text-white"
              >
                <Star className="h-3 w-3 mr-1 fill-current" aria-hidden="true" />
                Featured
              </Badge>
            )}
          </div>

          {/* Like Button */}
          <button
            type="button"
            onClick={handleLikeClick}
            aria-label={isLiked ? `Remove ${property.title} from favorites` : `Add ${property.title} to favorites`}
            aria-pressed={isLiked}
            className={cn(
              "absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300",
              "hover:scale-110 active:scale-95",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900",
              isLiked
                ? "bg-rose-500/90 text-white shadow-[0_4px_12px_rgba(244,63,94,0.4)]"
                : "bg-white/80 text-gray-600 hover:bg-white hover:text-rose-500 shadow-lg"
            )}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-transform duration-300",
                isLiked && "fill-current animate-[heart-pop_0.4s_cubic-bezier(0.22,1,0.36,1)]"
              )}
              aria-hidden="true"
            />
          </button>

          {/* Availability Badge - visual only, info in aria-label */}
          {property.available === false && (
            <Badge
              variant="destructive"
              className="absolute top-12 right-3 shadow-lg backdrop-blur-md"
              aria-hidden="true"
            >
              Not Available
            </Badge>
          )}

          {/* Premium Price Tag with animation - visual only, info in aria-label */}
          <div className="absolute bottom-3 left-3 group/price" aria-hidden="true">
            <div className={cn(
              "bg-white/95 backdrop-blur-xl border border-white/50 shadow-[0_8px_24px_rgba(0,0,0,0.12)] px-4 py-2 rounded-xl",
              "transition-all duration-300 ease-out",
              "group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.16)] group-hover:scale-105",
              "group-hover/price:bg-gradient-to-r group-hover/price:from-sky-50 group-hover/price:to-emerald-50"
            )}>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                ${property.price.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500 ml-1 font-medium">/mo</span>
            </div>
          </div>
        </div>

        <CardContent className="p-5">
          {/* Title with hover effect */}
          <h3 className={cn(
            "text-lg font-semibold text-gray-900 mb-2 line-clamp-1",
            "transition-all duration-300 ease-out",
            "group-hover:text-sky-600 group-hover:translate-x-0.5"
          )}>
            {property.title}
          </h3>

          {/* Address with icon animation */}
          <p className="text-sm text-gray-600 mb-4 flex items-center line-clamp-1 group/address">
            <MapPin className="h-4 w-4 mr-1.5 shrink-0 text-sky-500 transition-transform duration-300 group-hover/address:scale-110" aria-hidden="true" />
            <span className="sr-only">Address: </span>
            <span className="transition-colors duration-300 group-hover:text-gray-800">{property.address}</span>
          </p>

          {/* Property Details with hover effects - using description list for semantics */}
          <dl className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-gray-700 transition-all duration-300 hover:text-sky-600 group/detail">
              <Bed className="h-4 w-4 text-sky-500 transition-transform duration-300 group-hover/detail:scale-110" aria-hidden="true" />
              <dt className="sr-only">Bedrooms</dt>
              <dd>
                <span className="font-medium">{property.beds}</span>
                <span className="text-gray-500 ml-1">{property.beds === 1 ? 'bed' : 'beds'}</span>
              </dd>
            </div>
            <div className="flex items-center gap-1.5 text-gray-700 transition-all duration-300 hover:text-emerald-600 group/detail">
              <Bath className="h-4 w-4 text-emerald-500 transition-transform duration-300 group-hover/detail:scale-110" aria-hidden="true" />
              <dt className="sr-only">Bathrooms</dt>
              <dd>
                <span className="font-medium">{property.baths}</span>
                <span className="text-gray-500 ml-1">{property.baths === 1 ? 'bath' : 'baths'}</span>
              </dd>
            </div>
            <div className="flex items-center gap-1.5 text-gray-700 transition-all duration-300 hover:text-emerald-600 group/detail">
              <Square className="h-4 w-4 text-emerald-500 transition-transform duration-300 group-hover/detail:scale-110" aria-hidden="true" />
              <dt className="sr-only">Square footage</dt>
              <dd>
                <span className="font-medium">{property.sqft.toLocaleString()}</span>
                <span className="text-gray-500 ml-1">sqft</span>
              </dd>
            </div>
          </dl>

          {/* Neighborhood Tag with premium styling */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <span className="sr-only">Neighborhood: </span>
            <Badge
              variant="secondary"
              className={cn(
                "text-xs font-medium px-3 py-1",
                "bg-gradient-to-r from-gray-50 to-sky-50/50 text-gray-700",
                "border border-gray-200/60 shadow-sm",
                "transition-all duration-300",
                "group-hover:from-sky-50 group-hover:to-emerald-50/50 group-hover:border-sky-200/60 group-hover:text-sky-700"
              )}
            >
              {property.neighborhood}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
    </article>
  );
}
