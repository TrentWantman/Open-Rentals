import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to your Open Rentals account. Access your saved listings, track applications, and connect with verified landlords.",
  openGraph: {
    title: "Sign In | Open Rentals",
    description:
      "Sign in to your Open Rentals account. Access your saved listings and connect with verified landlords.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Sign In | Open Rentals",
    description:
      "Sign in to your Open Rentals account. Access your saved listings and connect with verified landlords.",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
