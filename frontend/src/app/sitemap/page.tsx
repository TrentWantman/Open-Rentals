"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Map, Home, Building2, Users, HelpCircle, FileText, Shield, Cookie, Search, UserPlus, LogIn } from "lucide-react";

const sitemapSections = [
  {
    title: "Main Pages",
    icon: Home,
    links: [
      { label: "Home", href: "/" },
      { label: "Browse Listings", href: "/listings" },
      { label: "Login", href: "/login" },
      { label: "Register", href: "/register" },
    ],
  },
  {
    title: "Neighborhoods",
    icon: Building2,
    links: [
      { label: "Brickell", href: "/listings?neighborhood=Brickell" },
      { label: "Coral Gables", href: "/listings?neighborhood=Coral+Gables" },
      { label: "Miami Beach", href: "/listings?neighborhood=Miami+Beach" },
      { label: "Wynwood", href: "/listings?neighborhood=Wynwood" },
      { label: "Coconut Grove", href: "/listings?neighborhood=Coconut+Grove" },
    ],
  },
  {
    title: "Company",
    icon: Users,
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Support",
    icon: HelpCircle,
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Safety", href: "/safety" },
      { label: "Contact Us", href: "/contact" },
      { label: "FAQs", href: "/faq" },
    ],
  },
  {
    title: "Legal",
    icon: FileText,
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Accessibility", href: "/accessibility" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-sky-50 to-white">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sky-100 mb-6">
            <Map className="h-8 w-8 text-sky-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sitemap</h1>
          <p className="text-gray-600">
            Find your way around Open Rentals. All pages and sections are listed below.
          </p>
        </div>

        {/* Content */}
        <div className="grid gap-6 md:grid-cols-2">
          {sitemapSections.map((section) => (
            <Card
              key={section.title}
              className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg hover:shadow-xl transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center">
                    <section.icon className="h-5 w-5 text-sky-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
                </div>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-gray-600 hover:text-sky-600 transition-colors flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mt-8 bg-gradient-to-br from-sky-100/80 via-emerald-50/60 to-teal-100/80 backdrop-blur-xl border-white/60 shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              Quick Actions
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/listings"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 rounded-lg border border-gray-200 text-gray-700 hover:bg-white hover:border-sky-300 hover:text-sky-600 transition-all"
              >
                <Search className="h-4 w-4" />
                Search Listings
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-lg text-white hover:from-sky-600 hover:to-emerald-600 transition-all"
              >
                <UserPlus className="h-4 w-4" />
                Create Account
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 rounded-lg border border-gray-200 text-gray-700 hover:bg-white hover:border-sky-300 hover:text-sky-600 transition-all"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sky-600 hover:text-sky-700 font-medium"
          >
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
