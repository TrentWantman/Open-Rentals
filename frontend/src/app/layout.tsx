import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AuthProvider } from "@/lib/auth";
import { NotificationsProvider } from "@/lib/notifications";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://openrentals.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Open Rentals - Self-Hostable Rental Platform",
    template: "%s | Open Rentals",
  },
  description:
    "An open source rental listing platform with landlord verification, PostGIS geo-search, and a full application flow. Deploy it for your city.",
  keywords: [
    "open source rental platform",
    "rental listings",
    "landlord verification",
    "self-hosted real estate",
    "rental application",
    "property search",
  ],
  authors: [{ name: "Open Rentals" }],
  creator: "Open Rentals",
  publisher: "Open Rentals",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Open Rentals",
    title: "Open Rentals - Self-Hostable Rental Platform",
    description:
      "An open source rental listing platform with landlord verification, geo-search, and a full application flow.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Open Rentals",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Rentals - Self-Hostable Rental Platform",
    description:
      "An open source rental listing platform with landlord verification, geo-search, and a full application flow.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/favicon-16x16.png",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: siteUrl,
  },
  category: "real estate",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0ea5e9" },
    { media: "(prefers-color-scheme: dark)", color: "#0284c7" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// JSON-LD structured data for organization
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Open Rentals",
  url: "https://openrentals.dev",
  description: "An open source rental listing platform with landlord verification, geo-search, and a full application flow.",
  applicationCategory: "WebApplication",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Open Rentals",
  url: "https://openrentals.dev",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://openrentals.dev/listings?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-gradient-to-br from-sky-50 via-white to-emerald-50`}>
        <AuthProvider>
          <NotificationsProvider>
            {/* Skip to main content link for keyboard navigation */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-sky-600 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
            >
              Skip to main content
            </a>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main id="main-content" className="flex-1" role="main" tabIndex={-1}>
                {children}
              </main>
              <Footer />
            </div>
            <Toaster />
          </NotificationsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
