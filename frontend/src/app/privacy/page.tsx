"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, Database, Mail, Trash2, Globe, Users } from "lucide-react";

export default function PrivacyPolicyPage() {
  const lastUpdated = "December 26, 2025";

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-sky-50 to-white">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sky-100 mb-6">
            <Shield className="h-8 w-8 text-sky-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: {lastUpdated}</p>
        </div>

        {/* Content */}
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg">
          <CardContent className="p-8 space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="h-6 w-6 text-sky-600" />
                Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Open Rentals (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information
                when you use our rental platform and services. Please read this policy carefully. By using
                our services, you consent to the data practices described in this policy.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Database className="h-6 w-6 text-sky-600" />
                Information We Collect
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Personal Information</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Name, email address, and phone number</li>
                    <li>Account credentials (encrypted passwords)</li>
                    <li>Profile information and avatar</li>
                    <li>For landlords: Company name and verification documents</li>
                    <li>For renters: Employment information and rental history</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Property Information</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Property addresses and descriptions</li>
                    <li>Photos and virtual tour links</li>
                    <li>Rental prices and availability</li>
                    <li>Geographic coordinates for map features</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Usage Information</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Device information and browser type</li>
                    <li>IP address and approximate location</li>
                    <li>Pages visited and features used</li>
                    <li>Search queries and filter preferences</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Eye className="h-6 w-6 text-sky-600" />
                How We Use Your Information
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>To provide and maintain our rental platform services</li>
                <li>To process rental applications and facilitate communication between landlords and renters</li>
                <li>To verify landlord identities and property ownership</li>
                <li>To send you important updates about your account, applications, or listings</li>
                <li>To improve our services based on usage patterns and feedback</li>
                <li>To detect and prevent fraud, abuse, and security incidents</li>
                <li>To comply with legal obligations and enforce our terms of service</li>
              </ul>
            </section>

            {/* Data Sharing */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="h-6 w-6 text-sky-600" />
                How We Share Your Information
              </h2>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  We do not sell your personal information. We may share your information in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li><strong>With landlords/renters:</strong> To facilitate the rental process, we share relevant contact and application information between parties</li>
                  <li><strong>Service providers:</strong> We work with trusted third parties for payment processing (Stripe), email delivery, cloud hosting, and analytics</li>
                  <li><strong>Legal requirements:</strong> We may disclose information when required by law, subpoena, or to protect our rights</li>
                  <li><strong>Business transfers:</strong> In the event of a merger or acquisition, user data may be transferred</li>
                </ul>
              </div>
            </section>

            {/* Third-Party Services */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Services</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our platform integrates with the following third-party services:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Stripe:</strong> For secure payment processing (PCI DSS compliant)</li>
                <li><strong>Mapbox:</strong> For interactive maps and location services</li>
                <li><strong>Cloudinary:</strong> For image storage and optimization</li>
                <li><strong>SendGrid/SMTP:</strong> For email delivery</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Each service has its own privacy policy governing their use of your data.
              </p>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Lock className="h-6 w-6 text-sky-600" />
                Data Security
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-4">
                <li>SSL/TLS encryption for all data in transit</li>
                <li>Bcrypt password hashing with salt</li>
                <li>JWT tokens with secure expiration for authentication</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls and audit logging</li>
              </ul>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">GDPR Rights (EU Residents)</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Right to access your personal data</li>
                    <li>Right to rectification of inaccurate data</li>
                    <li>Right to erasure (&quot;right to be forgotten&quot;)</li>
                    <li>Right to data portability</li>
                    <li>Right to object to processing</li>
                    <li>Right to withdraw consent</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">CCPA Rights (California Residents)</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                    <li>Right to know what personal information is collected</li>
                    <li>Right to delete personal information</li>
                    <li>Right to opt-out of sale of personal information (we do not sell your data)</li>
                    <li>Right to non-discrimination for exercising rights</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Trash2 className="h-6 w-6 text-sky-600" />
                Data Retention
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We retain your personal information for as long as your account is active or as needed to provide
                services. After account deletion, we may retain certain information for up to 7 years to comply
                with legal obligations, resolve disputes, and enforce agreements. You can request deletion of
                your data at any time by contacting us.
              </p>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookies and Tracking</h2>
              <p className="text-gray-700 leading-relaxed">
                We use essential cookies and local storage to maintain your session and preferences.
                For more details, please see our{" "}
                <Link href="/cookies" className="text-sky-600 hover:text-sky-700 underline">
                  Cookie Policy
                </Link>.
              </p>
            </section>

            {/* Children */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Children&apos;s Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                Our services are not intended for individuals under 18 years of age. We do not knowingly
                collect personal information from children. If you believe we have collected information
                from a child, please contact us immediately.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="h-6 w-6 text-sky-600" />
                Contact Us
              </h2>
              <p className="text-gray-700 leading-relaxed">
                For questions about this Privacy Policy or to exercise your rights, contact us at:
              </p>
              <div className="mt-4 p-4 bg-sky-50 rounded-lg">
                <p className="text-gray-800 font-medium">Open Rentals Privacy Team</p>
                <p className="text-gray-700">Email: privacy@openrentals.dev</p>
                <p className="text-gray-700">Address: 123 Brickell Ave, Miami, FL 33131</p>
              </div>
            </section>

            {/* Changes */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material
                changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
                Continued use of our services after changes constitutes acceptance of the updated policy.
              </p>
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
