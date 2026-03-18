"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  Shield,
  DollarSign,
  CheckCircle,
  ArrowRight,
  Star,
  Users,
  TrendingUp,
  Code2,
} from "lucide-react";
import { propertiesApi, type Property } from "@/lib/api";

const features = [
  {
    icon: Shield,
    title: "Verified Landlords",
    description: "Every landlord goes through identity verification and admin approval before their listings go live.",
  },
  {
    icon: DollarSign,
    title: "Transparent Pricing",
    description: "No hidden fees. All costs are displayed upfront so renters know exactly what they're paying.",
  },
  {
    icon: CheckCircle,
    title: "Built-in Application Flow",
    description: "Renters apply directly through the platform. Landlords manage and track every application in one place.",
  },
];

// Fallback images cycled for listings that have no uploaded photos
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop",
];

export function HomePageContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredListings, setFeaturedListings] = useState<Property[]>([]);

  useEffect(() => {
    propertiesApi
      .list({ limit: 3 })
      .then((res) => setFeaturedListings(res.data.slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?w=1920&q=80"
          alt="City skyline"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />

        <div className="absolute inset-0 backdrop-blur-[8px] bg-white/40" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/60" />

        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          <Badge className="mb-6 px-4 py-2 bg-white/80 backdrop-blur-md border-white/50 text-gray-800 shadow-lg" variant="default">
            <Code2 className="h-3 w-3 mr-1 text-sky-500" />
            Open Source Rentals
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-sm">
            <span className="bg-gradient-to-r from-sky-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">Find Your</span>
            <br />
            <span className="text-gray-900">Next Home</span>
          </h1>

          <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-10 drop-shadow-sm">
            A self-hostable rental platform with landlord verification, geo-search, and a full application flow.
            Deploy it for your city.
          </p>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white/70 backdrop-blur-xl p-2 rounded-2xl flex flex-col md:flex-row gap-2 shadow-xl shadow-sky-500/10 border border-white/60">
              <div className="relative flex-1">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-sky-500" />
                <Input
                  placeholder="Search by neighborhood, address, or ZIP..."
                  className="pl-12 h-14 text-lg bg-white/50 border-0 focus-visible:ring-0 text-gray-800 placeholder:text-gray-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button size="xl" variant="gradient" className="h-14 px-8 shadow-lg" asChild>
                <Link href={`/listings${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ""}`}>
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent" />
      </section>

      {/* Featured Listings */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Listings</h2>
              <p className="text-gray-600">Verified properties on the platform</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/listings">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((listing, i) => {
              const imgSrc =
                listing.images?.[0] ?? FALLBACK_IMAGES[i % FALLBACK_IMAGES.length];
              return (
                <Link key={listing.id} href={`/listings/${listing.slug}`}>
                  <Card variant="glass" interactive hoverGlow className="overflow-hidden h-full">
                    <div className="relative h-56">
                      <Image
                        src={imgSrc}
                        alt={listing.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading="lazy"
                      />
                      {listing.verified && (
                        <Badge className="absolute top-3 left-3" variant="success">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      {listing.featured && (
                        <Badge className="absolute top-3 right-3" variant="warning">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-5">
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        ${listing.price.toLocaleString()}<span className="text-sm font-normal text-gray-500">/mo</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{listing.title}</h3>
                      <p className="text-sm text-gray-600 mb-4 flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {listing.address}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-700">
                        <span>{listing.beds} beds</span>
                        <span className="text-gray-400">|</span>
                        <span>{listing.baths} baths</span>
                        {listing.sqft && (
                          <>
                            <span className="text-gray-400">|</span>
                            <span>{listing.sqft.toLocaleString()} sqft</span>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Open Rentals ships with everything you need to run a rental marketplace — verification, search, and applications out of the box.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((item, index) => (
              <Card key={index} variant="glass" className="text-center p-8 bg-white/60 backdrop-blur-sm border-sky-100 shadow-lg shadow-sky-100/20">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-sky-100 flex items-center justify-center">
                  <item.icon className="h-8 w-8 text-sky-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <Card variant="glass" className="p-12 text-center relative overflow-hidden bg-white/70 backdrop-blur-sm border-sky-100 shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 via-emerald-500/10 to-teal-500/10" />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
              <p className="text-gray-600 max-w-xl mx-auto mb-8">
                Browse listings, create an account, or fork the repo and deploy your own instance.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="xl" variant="gradient" asChild>
                  <Link href="/listings">
                    <Search className="h-5 w-5 mr-2" />
                    Browse Listings
                  </Link>
                </Button>
                <Button size="xl" variant="outline" asChild>
                  <Link href="/register">
                    <Users className="h-5 w-5 mr-2" />
                    Create Account
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Landlord CTA */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Badge className="mb-4" variant="default">For Landlords</Badge>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">List Your Property</h2>
              <p className="text-gray-600 mb-6">
                Get verified and list your properties. Renters can find, save, and apply directly through the platform.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-emerald-500 mr-3" />
                  Identity and ownership verification
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-emerald-500 mr-3" />
                  Application management dashboard
                </li>
                <li className="flex items-center text-gray-700">
                  <CheckCircle className="h-5 w-5 text-emerald-500 mr-3" />
                  Geo-search with PostGIS radius queries
                </li>
                <li className="flex items-center text-gray-700">
                  <TrendingUp className="h-5 w-5 text-emerald-500 mr-3" />
                  Property analytics and view tracking
                </li>
              </ul>
              <Button size="lg" variant="neon" asChild>
                <Link href="/register?role=landlord">
                  Get Started as Landlord
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <Card variant="glass" className="p-8">
                <div className="relative aspect-[3/2] w-full">
                  <Image
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop"
                    alt="Property management dashboard"
                    fill
                    className="rounded-lg object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    loading="lazy"
                  />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
