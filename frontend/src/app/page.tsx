import type { Metadata } from "next";
import { HomePageContent } from "@/components/home/home-page-content";

export const metadata: Metadata = {
  title: "Open Rentals - Self-Hostable Rental Platform",
  description:
    "An open source rental listing platform with landlord verification, geo-search, and a full application flow. Deploy it for your city.",
  openGraph: {
    title: "Open Rentals - Self-Hostable Rental Platform",
    description:
      "An open source rental listing platform with landlord verification, geo-search, and a full application flow.",
    type: "website",
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
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return <HomePageContent />;
}
