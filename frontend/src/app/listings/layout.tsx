import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Rental Properties",
  description:
    "Explore 1,200+ verified rental properties in Miami. Filter by neighborhood, price, bedrooms, and more. Find apartments in Brickell, Coral Gables, Miami Beach, Wynwood, and Coconut Grove.",
  keywords: [
    "Miami rental listings",
    "apartments for rent Miami",
    "Brickell rentals",
    "Miami Beach apartments",
    "Coral Gables homes for rent",
    "Wynwood lofts",
    "Coconut Grove rentals",
  ],
  openGraph: {
    title: "Browse Rental Properties | Open Rentals",
    description:
      "Explore 1,200+ verified rental properties in Miami. Filter by neighborhood, price, bedrooms, and more.",
    type: "website",
    images: [
      {
        url: "/og-listings.jpg",
        width: 1200,
        height: 630,
        alt: "Open Rental Properties - Browse Listings",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse Rental Properties | Open Rentals",
    description:
      "Explore 1,200+ verified rental properties in Miami. Filter by neighborhood, price, bedrooms, and more.",
    images: ["/og-listings.jpg"],
  },
};

export default function ListingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
