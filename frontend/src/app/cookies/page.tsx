"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Cookie, Info, Settings, Shield, ToggleLeft } from "lucide-react";

export default function CookiePolicyPage() {
  const lastUpdated = "December 26, 2025";

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-sky-50 to-white">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sky-100 mb-6">
            <Cookie className="h-8 w-8 text-sky-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
          <p className="text-gray-600">Last updated: {lastUpdated}</p>
        </div>

        {/* Content */}
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg">
          <CardContent className="p-8 space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Info className="h-6 w-6 text-sky-600" />
                What Are Cookies?
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Cookies are small text files stored on your device when you visit websites.
                They help websites remember your preferences, keep you logged in, and provide
                a better user experience. This policy explains how Open Rentals uses cookies
                and similar technologies.
              </p>
            </section>

            {/* Types of Cookies */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="h-6 w-6 text-sky-600" />
                Types of Cookies We Use
              </h2>
              <div className="space-y-6">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <h3 className="text-lg font-medium text-emerald-900 mb-2">
                    Essential Cookies (Required)
                  </h3>
                  <p className="text-emerald-800">
                    These are necessary for the website to function properly. They enable core
                    functionality like authentication, security, and remembering your preferences.
                    Without these cookies, you cannot use our platform.
                  </p>
                  <ul className="list-disc list-inside text-emerald-700 mt-3 space-y-1">
                    <li>Authentication tokens (stored in localStorage)</li>
                    <li>Session management</li>
                    <li>Security tokens (CSRF protection)</li>
                    <li>User preferences (theme, language)</li>
                  </ul>
                </div>

                <div className="p-4 bg-sky-50 border border-sky-200 rounded-lg">
                  <h3 className="text-lg font-medium text-sky-900 mb-2">
                    Functional Cookies
                  </h3>
                  <p className="text-sky-800">
                    These enhance your experience by remembering choices you make and providing
                    personalized features.
                  </p>
                  <ul className="list-disc list-inside text-sky-700 mt-3 space-y-1">
                    <li>Search preferences and filters</li>
                    <li>Recently viewed properties</li>
                    <li>Map zoom level and center position</li>
                    <li>Form data autofill</li>
                  </ul>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <h3 className="text-lg font-medium text-amber-900 mb-2">
                    Analytics Cookies (Optional)
                  </h3>
                  <p className="text-amber-800">
                    These help us understand how visitors interact with our website, allowing us
                    to improve our services. All data is aggregated and anonymous.
                  </p>
                  <ul className="list-disc list-inside text-amber-700 mt-3 space-y-1">
                    <li>Page views and navigation patterns</li>
                    <li>Device and browser information</li>
                    <li>Referral sources</li>
                    <li>Feature usage statistics</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Third-Party Cookies */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Services</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We integrate with trusted third-party services that may set their own cookies:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-200 px-4 py-2 text-left text-gray-900">Service</th>
                      <th className="border border-gray-200 px-4 py-2 text-left text-gray-900">Purpose</th>
                      <th className="border border-gray-200 px-4 py-2 text-left text-gray-900">Privacy Policy</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 text-gray-700">Stripe</td>
                      <td className="border border-gray-200 px-4 py-2 text-gray-700">Payment processing</td>
                      <td className="border border-gray-200 px-4 py-2">
                        <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">
                          stripe.com/privacy
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 text-gray-700">Mapbox</td>
                      <td className="border border-gray-200 px-4 py-2 text-gray-700">Interactive maps</td>
                      <td className="border border-gray-200 px-4 py-2">
                        <a href="https://www.mapbox.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">
                          mapbox.com/legal/privacy
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-4 py-2 text-gray-700">Cloudinary</td>
                      <td className="border border-gray-200 px-4 py-2 text-gray-700">Image hosting</td>
                      <td className="border border-gray-200 px-4 py-2">
                        <a href="https://cloudinary.com/privacy" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">
                          cloudinary.com/privacy
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Local Storage */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="h-6 w-6 text-sky-600" />
                Local Storage
              </h2>
              <p className="text-gray-700 leading-relaxed">
                In addition to cookies, we use browser local storage to store certain information
                on your device:
              </p>
              <ul className="list-disc list-inside text-gray-700 mt-4 space-y-2 ml-4">
                <li>
                  <strong>Authentication tokens:</strong> Secure JWT tokens that keep you logged in
                </li>
                <li>
                  <strong>User preferences:</strong> Settings like theme and display preferences
                </li>
                <li>
                  <strong>Search history:</strong> Recent searches to improve your experience
                </li>
              </ul>
              <p className="text-gray-700 mt-4">
                Local storage data remains on your device until you clear your browser data or
                log out of your account.
              </p>
            </section>

            {/* Managing Cookies */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ToggleLeft className="h-6 w-6 text-sky-600" />
                Managing Your Cookie Preferences
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You can control cookies through your browser settings. Here&apos;s how to manage
                cookies in popular browsers:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>
                  <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">
                    Google Chrome
                  </a>
                </li>
                <li>
                  <a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">
                    Mozilla Firefox
                  </a>
                </li>
                <li>
                  <a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">
                    Safari
                  </a>
                </li>
                <li>
                  <a href="https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">
                    Microsoft Edge
                  </a>
                </li>
              </ul>
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-amber-800">
                  <strong>Note:</strong> Blocking essential cookies may prevent you from using
                  certain features of our platform, such as logging in or saving preferences.
                </p>
              </div>
            </section>

            {/* Updates */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Updates to This Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in our
                practices or for legal reasons. We will post any changes on this page and update
                the &quot;Last updated&quot; date. We encourage you to review this policy periodically.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have questions about our use of cookies, please contact us:
              </p>
              <div className="mt-4 p-4 bg-sky-50 rounded-lg">
                <p className="text-gray-800 font-medium">Open Rentals Privacy Team</p>
                <p className="text-gray-700">Email: privacy@openrentals.dev</p>
              </div>
            </section>

            {/* Related Policies */}
            <section className="pt-6 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Related Policies</h2>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/privacy"
                  className="px-4 py-2 bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms"
                  className="px-4 py-2 bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 transition-colors"
                >
                  Terms of Service
                </Link>
              </div>
            </section>
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
