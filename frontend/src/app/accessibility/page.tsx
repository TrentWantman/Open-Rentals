"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Accessibility, Eye, Keyboard, Volume2, MousePointer2, Monitor, MessageSquare, Mail } from "lucide-react";

export default function AccessibilityPage() {
  const lastUpdated = "December 26, 2025";

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-sky-50 to-white">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sky-100 mb-6">
            <Accessibility className="h-8 w-8 text-sky-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Accessibility Statement</h1>
          <p className="text-gray-600">Last updated: {lastUpdated}</p>
        </div>

        {/* Content */}
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg">
          <CardContent className="p-8 space-y-8">
            {/* Commitment */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Commitment</h2>
              <p className="text-gray-700 leading-relaxed">
                Open Rentals is committed to ensuring digital accessibility for people with disabilities.
                We are continually improving the user experience for everyone and applying the relevant
                accessibility standards to ensure we provide equal access to all users.
              </p>
            </section>

            {/* Standards */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Conformance Status</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA.
                These guidelines explain how to make web content more accessible for people with disabilities
                and more user-friendly for everyone.
              </p>
              <div className="p-4 bg-sky-50 border border-sky-200 rounded-lg">
                <p className="text-sky-800">
                  <strong>Current Status:</strong> We are actively working to achieve and maintain WCAG 2.1 AA conformance.
                  Our team regularly audits the site and implements improvements.
                </p>
              </div>
            </section>

            {/* Accessibility Features */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Accessibility Features</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We have implemented the following accessibility features on our platform:
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Keyboard className="h-5 w-5 text-sky-600" />
                    <h3 className="font-medium text-gray-900">Keyboard Navigation</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    All interactive elements are accessible via keyboard. Use Tab to navigate, Enter/Space to activate.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Eye className="h-5 w-5 text-sky-600" />
                    <h3 className="font-medium text-gray-900">Screen Reader Support</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Our site works with major screen readers including NVDA, JAWS, VoiceOver, and TalkBack.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Monitor className="h-5 w-5 text-sky-600" />
                    <h3 className="font-medium text-gray-900">Responsive Design</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Content reflows and remains accessible at different zoom levels up to 400%.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <MousePointer2 className="h-5 w-5 text-sky-600" />
                    <h3 className="font-medium text-gray-900">Focus Indicators</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    Visible focus indicators help users track their position when navigating with keyboard.
                  </p>
                </div>
              </div>
            </section>

            {/* Additional Features */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Additional Accessibility Measures</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Alternative text:</strong> All meaningful images have descriptive alt text</li>
                <li><strong>Color contrast:</strong> Text meets WCAG AA contrast requirements</li>
                <li><strong>Form labels:</strong> All form inputs have associated labels</li>
                <li><strong>Error identification:</strong> Form errors are clearly identified and described</li>
                <li><strong>Skip links:</strong> Skip to main content link available for keyboard users</li>
                <li><strong>Consistent navigation:</strong> Navigation is consistent across all pages</li>
                <li><strong>Semantic HTML:</strong> Proper heading hierarchy and landmark regions</li>
                <li><strong>Motion reduction:</strong> Animations respect user preferences for reduced motion</li>
              </ul>
            </section>

            {/* Known Limitations */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Known Limitations</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Despite our efforts, some content may not be fully accessible:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Maps:</strong> Interactive maps may have limited accessibility. Contact us for property location assistance.</li>
                <li><strong>Third-party content:</strong> Some embedded content from third parties may not meet accessibility standards.</li>
                <li><strong>PDF documents:</strong> Some older PDFs may not be fully accessible. Contact us for accessible alternatives.</li>
              </ul>
            </section>

            {/* Assistive Technologies */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Volume2 className="h-6 w-6 text-sky-600" />
                Compatible Assistive Technologies
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our website is designed to be compatible with the following assistive technologies:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Screen readers (NVDA, JAWS, VoiceOver, TalkBack)</li>
                <li>Screen magnification software</li>
                <li>Speech recognition software</li>
                <li>Keyboard-only navigation</li>
                <li>Browser accessibility extensions</li>
              </ul>
            </section>

            {/* Browser Support */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Browser Compatibility</h2>
              <p className="text-gray-700 leading-relaxed">
                For the best accessible experience, we recommend using the latest versions of:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-4">
                <li>Google Chrome</li>
                <li>Mozilla Firefox</li>
                <li>Apple Safari</li>
                <li>Microsoft Edge</li>
              </ul>
            </section>

            {/* Feedback */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-sky-600" />
                Feedback
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We welcome your feedback on the accessibility of Open Rentals. If you encounter
                accessibility barriers or have suggestions for improvement, please let us know:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Describe the problem you encountered</li>
                <li>Include the page URL where you found the issue</li>
                <li>Tell us what assistive technology you were using</li>
              </ul>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="h-6 w-6 text-sky-600" />
                Contact Us
              </h2>
              <p className="text-gray-700 leading-relaxed">
                For accessibility-related questions or to report issues:
              </p>
              <div className="mt-4 p-4 bg-sky-50 rounded-lg">
                <p className="text-gray-800 font-medium">Open Rentals Accessibility Team</p>
                <p className="text-gray-700">Email: accessibility@openrentals.dev</p>
                <p className="text-gray-700">Phone: (305) 555-0124</p>
                <p className="text-gray-700 mt-2">
                  We aim to respond to accessibility feedback within 2 business days.
                </p>
              </div>
            </section>

            {/* Enforcement */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Enforcement Procedure</h2>
              <p className="text-gray-700 leading-relaxed">
                If you are not satisfied with our response to your accessibility concern, you may
                file a complaint with the U.S. Department of Justice or seek assistance from your
                local disability rights organization. We are committed to working with you to
                find a solution.
              </p>
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
                <Link
                  href="/cookies"
                  className="px-4 py-2 bg-sky-100 text-sky-700 rounded-lg hover:bg-sky-200 transition-colors"
                >
                  Cookie Policy
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
