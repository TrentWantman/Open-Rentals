"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Heart,
  FileText,
  MessageCircle,
  Settings,
  User,
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Bell,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Plus,
  Home,
  Calendar,
  CreditCard,
  BarChart3,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  comingSoon?: boolean;
}

const renterNavItems: NavItem[] = [
  { href: "/dashboard/renter", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/renter#saved", label: "Saved Listings", icon: Heart },
  { href: "/dashboard/renter#applications", label: "My Applications", icon: FileText },
  { href: "/dashboard/renter#messages", label: "Messages", icon: MessageCircle, badge: 3 },
  { href: "/dashboard/renter/schedule", label: "Scheduled Tours", icon: Calendar, comingSoon: true },
];

const landlordNavItems: NavItem[] = [
  { href: "/dashboard/landlord", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/landlord/properties", label: "My Properties", icon: Building2 },
  { href: "/dashboard/landlord#applications", label: "Applications", icon: Users, badge: 5 },
  { href: "/dashboard/landlord#messages", label: "Messages", icon: MessageCircle },
  { href: "/dashboard/landlord/earnings", label: "Earnings", icon: DollarSign, comingSoon: true },
  { href: "/dashboard/landlord/analytics", label: "Analytics", icon: BarChart3, comingSoon: true },
];

const commonNavItems: NavItem[] = [
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings, comingSoon: true },
  { href: "/help", label: "Help & Support", icon: HelpCircle, comingSoon: true },
];

interface DashboardSidebarProps {
  className?: string;
}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isLandlord = user?.role === "landlord";
  const navItems = isLandlord ? landlordNavItems : renterNavItems;

  const handleComingSoonClick = (label: string) => {
    toast.info(`${label} coming soon!`, {
      description: "This feature is currently under development.",
    });
  };

  const isActive = (href: string) => {
    // Handle hash links
    if (href.includes("#")) {
      const [basePath] = href.split("#");
      return pathname === basePath || pathname.startsWith(basePath);
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <Card
      variant="glass"
      className={cn(
        "sticky top-24 h-fit transition-all duration-300 bg-white/70 backdrop-blur-xl border-sky-100 shadow-lg",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {!isCollapsed && (
            <h2 className="font-semibold text-gray-900">
              {isLandlord ? "Landlord" : "Renter"} Menu
            </h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="shrink-0 h-8 w-8"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Quick Action */}
        {isLandlord && !isCollapsed && (
          <Button
            variant="gradient"
            className="w-full mb-6"
            asChild
          >
            <Link href="/dashboard/landlord/properties/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Link>
          </Button>
        )}

        {isLandlord && isCollapsed && (
          <Button
            variant="gradient"
            size="icon"
            className="w-full mb-6"
            asChild
          >
            <Link href="/dashboard/landlord/properties/new">
              <Plus className="h-4 w-4" />
            </Link>
          </Button>
        )}

        {/* Main Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href);

            if (item.comingSoon) {
              return (
                <button
                  key={item.href}
                  onClick={() => handleComingSoonClick(item.label)}
                  className={cn(
                    "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 transition-colors",
                    isCollapsed && "justify-center px-2"
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left text-sm">{item.label}</span>
                      <Badge variant="outline" className="text-xs bg-gray-100 text-gray-500 border-gray-200">
                        Soon
                      </Badge>
                    </>
                  )}
                </button>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                  active
                    ? "bg-sky-100 text-sky-700 font-medium"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80",
                  isCollapsed && "justify-center px-2"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-sm">{item.label}</span>
                    {item.badge && (
                      <Badge className="h-5 min-w-5 px-1.5 text-xs bg-sky-500">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="my-4 border-t border-gray-200/60" />

        {/* Common Navigation */}
        <nav className="space-y-1">
          {commonNavItems.map((item) => {
            const active = isActive(item.href);

            if (item.comingSoon) {
              return (
                <button
                  key={item.href}
                  onClick={() => handleComingSoonClick(item.label)}
                  className={cn(
                    "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100/80 transition-colors",
                    isCollapsed && "justify-center px-2"
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && (
                    <span className="flex-1 text-left text-sm">{item.label}</span>
                  )}
                </button>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                  active
                    ? "bg-sky-100 text-sky-700 font-medium"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80",
                  isCollapsed && "justify-center px-2"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && (
                  <span className="flex-1 text-sm">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Browse Listings Link */}
        {!isCollapsed && (
          <div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-sky-50 to-emerald-50 border border-sky-100">
            <p className="text-sm text-gray-600 mb-3">
              {isLandlord
                ? "Want to see how renters view listings?"
                : "Looking for your next home?"}
            </p>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href="/listings">
                <Home className="h-4 w-4 mr-2" />
                Browse Listings
              </Link>
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
