import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description:
    "Join Open Rentals today. Create a free account to save listings, apply for rentals, or list your property as a verified landlord.",
  openGraph: {
    title: "Create Account | Open Rentals",
    description:
      "Join Open Rentals today. Create a free account to save listings, apply for rentals, or list your property as a verified landlord.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Create Account | Open Rentals",
    description:
      "Join Open Rentals today. Create a free account to save listings, apply for rentals, or list your property.",
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
