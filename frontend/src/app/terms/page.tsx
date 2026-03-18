"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Scale, FileText, Users, Shield, CreditCard, AlertTriangle, Home, Gavel } from "lucide-react";

export default function TermsOfServicePage() {
  const lastUpdated = "December 26, 2025";

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-sky-50 to-white">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sky-100 mb-6">
            <Scale className="h-8 w-8 text-sky-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600">Last updated: {lastUpdated}</p>
        </div>

        {/* Content */}
        <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-lg">
          <CardContent className="p-8 space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="h-6 w-6 text-sky-600" />
                Agreement to Terms
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Welcome to Open Rentals. These Terms of Service (&quot;Terms&quot;) govern your access to and use of
                our platform, website, and services (collectively, the &quot;Service&quot;). By accessing or using the
                Service, you agree to be bound by these Terms. If you do not agree, you may not use the Service.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                Please read these Terms carefully before using our Service. These Terms constitute a legally
                binding agreement between you and Open Rentals LLC (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
              </p>
            </section>

            {/* Eligibility */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="h-6 w-6 text-sky-600" />
                Eligibility
              </h2>
              <p className="text-gray-700 leading-relaxed">
                You must be at least 18 years old and capable of forming a binding contract to use our Service.
                By using the Service, you represent and warrant that:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-4">
                <li>You are at least 18 years of age</li>
                <li>You have the legal capacity to enter into these Terms</li>
                <li>You will use the Service only for lawful purposes</li>
                <li>All information you provide is accurate and complete</li>
                <li>You will maintain the security of your account credentials</li>
              </ul>
            </section>

            {/* User Accounts */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">User Accounts</h2>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  To access certain features of the Service, you must register for an account. You agree to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Provide accurate, current, and complete registration information</li>
                  <li>Maintain and promptly update your account information</li>
                  <li>Keep your password secure and confidential</li>
                  <li>Notify us immediately of any unauthorized account access</li>
                  <li>Accept responsibility for all activities under your account</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  We reserve the right to suspend or terminate accounts that violate these Terms or for
                  prolonged inactivity.
                </p>
              </div>
            </section>

            {/* Landlord Terms */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Home className="h-6 w-6 text-sky-600" />
                Landlord Terms
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you list properties on our platform as a landlord, you agree to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Provide accurate and complete property information</li>
                <li>Have legal authority to rent the listed properties</li>
                <li>Maintain properties in habitable condition per local laws</li>
                <li>Respond to rental inquiries in a timely manner</li>
                <li>Complete identity and property ownership verification when required</li>
                <li>Comply with all applicable landlord-tenant laws</li>
                <li>Not discriminate against applicants based on protected characteristics</li>
              </ul>
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-amber-800 font-medium flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Important Notice
                </p>
                <p className="text-amber-700 mt-2">
                  Landlords are solely responsible for the accuracy of their listings and compliance with
                  local housing regulations. Open Rentals does not verify the condition of properties.
                </p>
              </div>
            </section>

            {/* Renter Terms */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Renter Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you use our platform to find rental properties, you agree to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Provide accurate information in rental applications</li>
                <li>Only submit applications for properties you genuinely intend to rent</li>
                <li>Conduct your own due diligence on properties before signing leases</li>
                <li>Communicate respectfully with landlords and property managers</li>
                <li>Not misrepresent your qualifications or rental history</li>
              </ul>
            </section>

            {/* Fair Housing */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="h-6 w-6 text-sky-600" />
                Fair Housing Policy
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Open Rentals is committed to compliance with the Fair Housing Act and all applicable
                federal, state, and local fair housing laws. Discrimination based on the following is
                strictly prohibited:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Race, color, or national origin</li>
                <li>Religion</li>
                <li>Sex, sexual orientation, or gender identity</li>
                <li>Familial status (including children under 18)</li>
                <li>Disability</li>
                <li>Source of income (where applicable by law)</li>
                <li>Any other protected characteristic under applicable law</li>
              </ul>
              <div className="mt-4 p-4 bg-sky-50 border border-sky-200 rounded-lg">
                <p className="text-sky-800 font-medium">HUD Compliance</p>
                <p className="text-sky-700 mt-2">
                  We follow U.S. Department of Housing and Urban Development (HUD) guidelines.
                  If you believe you have experienced housing discrimination, you may file a complaint
                  with HUD at{" "}
                  <a
                    href="https://www.hud.gov/fairhousing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    hud.gov/fairhousing
                  </a>
                  .
                </p>
              </div>
            </section>

            {/* Payment Terms */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="h-6 w-6 text-sky-600" />
                Payment Terms
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Application Fees</h3>
                  <p className="text-gray-700">
                    Landlords may charge application fees through our platform. Application fees are
                    non-refundable once the landlord has reviewed your application, unless otherwise
                    required by law.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Platform Fees</h3>
                  <p className="text-gray-700">
                    Open Rentals may charge service fees for certain transactions. All applicable
                    fees will be clearly disclosed before you complete a transaction.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Processing</h3>
                  <p className="text-gray-700">
                    Payments are processed securely through Stripe. By making payments through our
                    platform, you agree to Stripe&apos;s terms of service.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Disputes</h3>
                  <p className="text-gray-700">
                    Payment disputes should first be addressed with the landlord. If unresolved,
                    contact our support team within 30 days of the transaction.
                  </p>
                </div>
              </div>
            </section>

            {/* Prohibited Conduct */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-sky-600" />
                Prohibited Conduct
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You agree not to engage in any of the following activities:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Posting false, misleading, or fraudulent listings</li>
                <li>Harassment, threats, or abusive behavior toward other users</li>
                <li>Discriminatory practices in violation of fair housing laws</li>
                <li>Attempting to bypass our payment system</li>
                <li>Scraping, data mining, or automated data collection</li>
                <li>Impersonating others or misrepresenting your identity</li>
                <li>Violating any applicable laws or regulations</li>
                <li>Interfering with the security or operation of our Service</li>
                <li>Uploading malicious software or content</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Intellectual Property</h2>
              <p className="text-gray-700 leading-relaxed">
                The Service and its original content, features, and functionality are owned by
                Open Rentals and are protected by copyright, trademark, and other intellectual
                property laws. You may not copy, modify, distribute, or reverse engineer any
                part of the Service without our express written permission.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                By posting content on our platform (such as property listings or reviews), you
                grant us a non-exclusive, worldwide, royalty-free license to use, display, and
                distribute that content in connection with the Service.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Gavel className="h-6 w-6 text-sky-600" />
                Limitation of Liability
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Open Rentals is a platform that connects landlords and renters. We are not a
                party to any rental agreements and do not guarantee:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>The accuracy or completeness of any listing information</li>
                <li>The condition, safety, or legality of any property</li>
                <li>The qualifications of any landlord or renter</li>
                <li>The outcome of any rental application or lease</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, MIAMI RENTALS SHALL NOT BE LIABLE FOR
                ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING
                FROM YOUR USE OF THE SERVICE. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT
                YOU PAID TO US IN THE 12 MONTHS PRECEDING THE CLAIM.
              </p>
            </section>

            {/* Dispute Resolution */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Dispute Resolution</h2>
              <p className="text-gray-700 leading-relaxed">
                Any disputes arising from these Terms or your use of the Service shall be resolved
                through binding arbitration in Miami-Dade County, Florida, in accordance with the
                rules of the American Arbitration Association. You agree to waive your right to
                participate in class action lawsuits.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                For small claims (under $10,000), you may choose to resolve disputes in small
                claims court in Miami-Dade County, Florida.
              </p>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Termination</h2>
              <p className="text-gray-700 leading-relaxed">
                We may terminate or suspend your account and access to the Service immediately,
                without prior notice, for conduct that we believe violates these Terms, is harmful
                to other users, or is otherwise inappropriate. You may terminate your account at
                any time by contacting us.
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify you of
                material changes by email or by posting a notice on the Service. Your continued
                use of the Service after changes become effective constitutes acceptance of the
                revised Terms.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Governing Law</h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the
                State of Florida, without regard to its conflict of law provisions. Any legal
                action must be brought in the state or federal courts located in Miami-Dade County,
                Florida.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
              <p className="text-gray-700 leading-relaxed">
                For questions about these Terms, please contact us:
              </p>
              <div className="mt-4 p-4 bg-sky-50 rounded-lg">
                <p className="text-gray-800 font-medium">Open Rentals Legal Team</p>
                <p className="text-gray-700">Email: legal@openrentals.dev</p>
                <p className="text-gray-700">Address: 123 Brickell Ave, Miami, FL 33131</p>
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
