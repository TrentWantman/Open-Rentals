"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import { Building2, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowRight, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const footerLinks = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Blog", href: "/blog" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "Safety", href: "/safety" },
    { label: "Contact Us", href: "/contact" },
    { label: "FAQs", href: "/faq" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Accessibility", href: "/accessibility" },
  ],
  explore: [
    { label: "All Listings", href: "/listings" },
    { label: "Map View", href: "/listings?view=map" },
    { label: "Register as Landlord", href: "/register?role=landlord" },
    { label: "GitHub", href: "https://github.com/TrentWantman/open-rentals" },
  ],
};

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
];

// Email validation regex - RFC 5322 compliant
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

type SubscriptionStatus = "idle" | "loading" | "success" | "error";

interface SubscriptionState {
  status: SubscriptionStatus;
  message: string;
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [subscriptionState, setSubscriptionState] = useState<SubscriptionState>({
    status: "idle",
    message: "",
  });

  const validateEmail = useCallback((emailValue: string): boolean => {
    if (!emailValue.trim()) {
      setEmailError("Email address is required");
      return false;
    }
    if (!EMAIL_REGEX.test(emailValue)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  }, []);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    // Clear error when user starts typing
    if (emailError) {
      setEmailError("");
    }
    // Reset subscription state when user modifies email
    if (subscriptionState.status !== "idle") {
      setSubscriptionState({ status: "idle", message: "" });
    }
  }, [emailError, subscriptionState.status]);

  const handleSubscribe = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      return;
    }

    setSubscriptionState({ status: "loading", message: "" });

    try {
      // Simulate API call - replace with actual subscription API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate success (in production, this would be an actual API call)
      setSubscriptionState({
        status: "success",
        message: "Thank you! You'll receive updates about new listings.",
      });
      setEmail("");
    } catch {
      setSubscriptionState({
        status: "error",
        message: "Something went wrong. Please try again.",
      });
    }
  }, [email, validateEmail]);

  return (
    <footer className="relative bg-gradient-to-b from-gray-50 to-white border-t border-gray-200" role="contentinfo">
      {/* Newsletter Section - Glassmorphism Style */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-10 md:py-12">
          <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-sky-100/80 via-emerald-50/60 to-teal-100/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_rgba(56,189,248,0.15),inset_0_1px_0_rgba(255,255,255,0.8)] p-6 sm:p-8 md:p-10 lg:p-12">
            {/* Decorative gradient orbs */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-sky-400/20 to-emerald-400/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-tr from-emerald-400/20 to-sky-400/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

            <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
              {/* Header */}
              <div className="mb-6 md:mb-8">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-sky-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2 md:mb-3">
                  Stay updated with new listings
                </h3>
                <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto">
                  Get notified when new properties match your criteria. No spam, unsubscribe anytime.
                </p>
              </div>

              {/* Subscription Form */}
              <form
                className="w-full max-w-md"
                onSubmit={handleSubscribe}
                noValidate
              >
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex-1 relative">
                    <label htmlFor="newsletter-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="newsletter-email"
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="Enter your email address"
                      disabled={subscriptionState.status === "loading" || subscriptionState.status === "success"}
                      aria-invalid={!!emailError}
                      aria-describedby={emailError ? "email-error" : undefined}
                      className={`
                        w-full h-12 px-4 rounded-xl
                        bg-white/80 backdrop-blur-sm
                        border-2 transition-all duration-200
                        text-gray-900 placeholder:text-gray-400
                        focus:outline-none focus:ring-0
                        disabled:opacity-60 disabled:cursor-not-allowed
                        ${emailError
                          ? "border-red-400 focus:border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.15)]"
                          : "border-gray-200/80 focus:border-sky-400 focus:shadow-[0_0_0_3px_rgba(56,189,248,0.2)]"
                        }
                        shadow-[inset_0_1px_2px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.06)]
                      `}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={subscriptionState.status === "loading" || subscriptionState.status === "success"}
                    className={`
                      h-12 px-6 rounded-xl font-semibold
                      transition-all duration-200
                      shadow-lg
                      whitespace-nowrap
                      ${subscriptionState.status === "success"
                        ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30"
                        : "bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 shadow-sky-500/30 hover:shadow-sky-500/40"
                      }
                      text-white
                      disabled:opacity-70 disabled:cursor-not-allowed
                      active:scale-[0.98]
                    `}
                  >
                    {subscriptionState.status === "loading" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        <span>Subscribing...</span>
                      </>
                    ) : subscriptionState.status === "success" ? (
                      <>
                        <CheckCircle className="h-4 w-4" aria-hidden="true" />
                        <span>Subscribed!</span>
                      </>
                    ) : (
                      <>
                        <span>Subscribe</span>
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </>
                    )}
                  </Button>
                </div>

                {/* Error Message */}
                {emailError && (
                  <p
                    id="email-error"
                    className="mt-2 text-sm text-red-600 flex items-center justify-center gap-1.5"
                    role="alert"
                  >
                    <AlertCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                    {emailError}
                  </p>
                )}

                {/* Success/Error Status Messages */}
                {subscriptionState.status === "success" && (
                  <p
                    className="mt-3 text-sm text-emerald-600 flex items-center justify-center gap-1.5 bg-emerald-50/80 rounded-lg py-2 px-3"
                    role="status"
                  >
                    <CheckCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                    {subscriptionState.message}
                  </p>
                )}
                {subscriptionState.status === "error" && (
                  <p
                    className="mt-3 text-sm text-red-600 flex items-center justify-center gap-1.5 bg-red-50/80 rounded-lg py-2 px-3"
                    role="alert"
                  >
                    <AlertCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                    {subscriptionState.message}
                  </p>
                )}
              </form>

              {/* Trust indicators */}
              <p className="mt-4 text-xs text-gray-500 flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                </svg>
                Your email is secure. We never share your information.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group" aria-label="Open Rentals - Go to homepage">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-emerald-500 flex items-center justify-center shadow-md shadow-sky-400/20 group-hover:shadow-sky-400/30 transition-shadow" aria-hidden="true">
                <Building2 className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <span className="text-xl font-bold">
                <span className="bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-transparent">Open</span>
                <span className="text-gray-900"> Rentals</span>
              </span>
            </Link>
            <p className="text-sm text-gray-600 mb-6 max-w-xs">
              Miami&apos;s most trusted rental platform. Find verified properties with transparent pricing and no hidden fees.
            </p>

            {/* Contact Info */}
            <address className="space-y-3 text-sm text-gray-600 mb-6 not-italic">
              <a
                href="https://maps.google.com/?q=Miami,+Florida"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-sky-600 transition-colors"
              >
                <MapPin className="h-4 w-4 text-sky-500 flex-shrink-0" aria-hidden="true" />
                <span>Miami, Florida</span>
              </a>
              <a
                href="mailto:hello@openrentals.dev"
                className="flex items-center gap-2 hover:text-sky-600 transition-colors"
              >
                <Mail className="h-4 w-4 text-sky-500 flex-shrink-0" aria-hidden="true" />
                <span>hello@openrentals.dev</span>
              </a>
              <a
                href="tel:+13055550123"
                className="flex items-center gap-2 hover:text-sky-600 transition-colors"
              >
                <Phone className="h-4 w-4 text-sky-500 flex-shrink-0" aria-hidden="true" />
                <span>(305) 555-0123</span>
              </a>
            </address>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-sky-50 flex items-center justify-center text-gray-600 hover:text-sky-600 transition-all"
                >
                  <social.icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <nav aria-label="Company">
            <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-sky-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Support Links */}
          <nav aria-label="Support">
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-sky-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal Links */}
          <nav aria-label="Legal">
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-sky-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Explore Links */}
          <nav aria-label="Explore">
            <h3 className="font-semibold text-gray-900 mb-4">Explore</h3>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-sky-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-gray-50/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <p className="text-sm text-gray-600">
                {currentYear} Open Rentals. All rights reserved.
              </p>
              <span className="hidden md:inline text-gray-300" aria-hidden="true">|</span>
              <p className="text-sm text-gray-500">
                Made with care in Miami
              </p>
            </div>
            <nav aria-label="Legal links" className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="text-sm text-gray-600 hover:text-sky-600 transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-gray-600 hover:text-sky-600 transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/cookies"
                className="text-sm text-gray-600 hover:text-sky-600 transition-colors"
              >
                Cookies
              </Link>
              <Link
                href="/sitemap"
                className="text-sm text-gray-600 hover:text-sky-600 transition-colors"
              >
                Sitemap
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
