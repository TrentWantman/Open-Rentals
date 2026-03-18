"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import {
  Home,
  Building2,
  LayoutDashboard,
  Menu,
  X,
  LogIn,
  UserPlus,
  User,
  Settings,
  Heart,
  LogOut,
  ChevronDown,
  Bell,
  Plus,
} from "lucide-react";
import { NotificationsDropdown } from "@/components/notifications";
import { useNotifications } from "@/lib/notifications";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/listings", label: "Listings", icon: Building2 },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, requiresAuth: true },
];

// Mobile notifications link component with unread count
function MobileNotificationsLink({ onClick }: { onClick: () => void }) {
  const { unreadCount } = useNotifications();

  return (
    <Link
      href="/notifications"
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 transition-colors"
    >
      <div className="relative">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] flex items-center justify-center px-1 text-[10px] font-bold text-white bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </div>
      <span className="font-medium">Notifications</span>
      {unreadCount > 0 && (
        <span className="ml-auto px-2 py-0.5 text-xs font-medium text-sky-600 bg-sky-50 rounded-full">
          {unreadCount} new
        </span>
      )}
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "U";
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const filteredNavLinks = navLinks.filter(
    (link) => !link.requiresAuth || isAuthenticated
  );

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm py-3"
          : "bg-transparent py-4"
      )}
      role="banner"
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between" aria-label="Main navigation">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" aria-label="Open Rentals - Go to homepage">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-sky-400/25 group-hover:shadow-sky-400/40 transition-shadow" aria-hidden="true">
              <Building2 className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <span className="text-xl font-bold">
              <span className="bg-gradient-to-r from-sky-500 to-emerald-500 bg-clip-text text-transparent">Open</span>
              <span className="text-gray-900"> Rentals</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {filteredNavLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 transition-colors",
                      isActive && "bg-sky-50 text-sky-600 hover:bg-sky-100 hover:text-sky-700"
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {isLoading ? (
              // Loading skeleton
              <div className="flex items-center gap-3">
                <div className="w-20 h-9 bg-gray-100 rounded-lg animate-pulse" />
                <div className="w-9 h-9 bg-gray-100 rounded-full animate-pulse" />
              </div>
            ) : isAuthenticated && user ? (
              // Logged in state
              <>
                {/* Add Listing Button (for landlords) */}
                {user.role === "landlord" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-sky-200 text-sky-600 hover:bg-sky-50 hover:border-sky-300"
                    asChild
                  >
                    <Link href="/dashboard/listings/new">
                      <Plus className="h-4 w-4" />
                      Add Listing
                    </Link>
                  </Button>
                )}

                {/* Notifications */}
                <NotificationsDropdown />

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-md hover:bg-gray-100/80 transition-all duration-200 outline-none focus:ring-2 focus:ring-sky-400/50 focus:ring-offset-2">
                    <Avatar className="h-8 w-8 ring-2 ring-white shadow-sm">
                      {user.avatarUrl ? (
                        <AvatarImage src={user.avatarUrl} alt={user.firstName} />
                      ) : null}
                      <AvatarFallback className="bg-gradient-to-br from-sky-400 to-emerald-500 text-white text-sm font-medium">
                        {getInitials(user.firstName, user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-gray-700 font-medium hidden lg:block">
                      {user.firstName}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 mt-2"
                    sideOffset={8}
                  >
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                        <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-700 w-fit capitalize">
                          {user.role}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/dashboard" className="flex items-center">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/dashboard/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/dashboard/favorites" className="flex items-center">
                        <Heart className="mr-2 h-4 w-4" />
                        Favorites
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/dashboard/settings" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              // Logged out state
              <>
                <Button
                  variant="ghost"
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
                  asChild
                >
                  <Link href="/login">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Link>
                </Button>
                <Button
                  className="bg-sky-500 hover:bg-sky-600 text-white shadow-md shadow-sky-500/25 hover:shadow-sky-500/40 transition-all"
                  asChild
                >
                  <Link href="/register">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Sign Up
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <div className="relative w-5 h-5">
              <span
                className={cn(
                  "absolute left-0 w-5 h-0.5 bg-current transition-all duration-300",
                  isMobileMenuOpen ? "top-2.5 rotate-45" : "top-1"
                )}
              />
              <span
                className={cn(
                  "absolute left-0 top-2.5 w-5 h-0.5 bg-current transition-all duration-300",
                  isMobileMenuOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
                )}
              />
              <span
                className={cn(
                  "absolute left-0 w-5 h-0.5 bg-current transition-all duration-300",
                  isMobileMenuOpen ? "top-2.5 -rotate-45" : "top-4"
                )}
              />
            </div>
          </Button>
        </nav>

        {/* Mobile Menu */}
        <div
          ref={mobileMenuRef}
          id="mobile-menu"
          role="navigation"
          aria-label="Mobile navigation"
          aria-hidden={!isMobileMenuOpen}
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
            isMobileMenuOpen
              ? "max-h-[500px] opacity-100 mt-4"
              : "max-h-0 opacity-0 mt-0"
          )}
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-xl border border-gray-200/50 shadow-lg p-4">
            {/* User info in mobile menu (if logged in) */}
            {isAuthenticated && user && (
              <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-200">
                <Avatar className="h-10 w-10 ring-2 ring-white shadow-sm">
                  {user.avatarUrl ? (
                    <AvatarImage src={user.avatarUrl} alt={user.firstName} />
                  ) : null}
                  <AvatarFallback className="bg-gradient-to-br from-sky-400 to-emerald-500 text-white text-sm font-medium">
                    {getInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <div className="flex flex-col gap-1">
              {filteredNavLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 transition-colors",
                      isActive && "bg-sky-50 text-sky-600"
                    )}
                  >
                    <link.icon className="h-5 w-5" />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Auth Section */}
            <div className="border-t border-gray-200 mt-4 pt-4">
              {isAuthenticated && user ? (
                // Logged in mobile menu items
                <div className="flex flex-col gap-1">
                  <MobileNotificationsLink onClick={() => setIsMobileMenuOpen(false)} />
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 transition-colors"
                  >
                    <User className="h-5 w-5" />
                    <span className="font-medium">Profile</span>
                  </Link>
                  <Link
                    href="/dashboard/favorites"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 transition-colors"
                  >
                    <Heart className="h-5 w-5" />
                    <span className="font-medium">Favorites</span>
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 transition-colors"
                  >
                    <Settings className="h-5 w-5" />
                    <span className="font-medium">Settings</span>
                  </Link>
                  {user.role === "landlord" && (
                    <Link
                      href="/dashboard/listings/new"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sky-600 hover:text-sky-700 hover:bg-sky-50 transition-colors"
                    >
                      <Plus className="h-5 w-5" />
                      <span className="font-medium">Add Listing</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors w-full text-left mt-2"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Sign out</span>
                  </button>
                </div>
              ) : (
                // Logged out mobile menu items
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    <LogIn className="h-4 w-4" />
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-sky-500 text-white hover:bg-sky-600 transition-colors font-medium shadow-md shadow-sky-500/25"
                  >
                    <UserPlus className="h-4 w-4" />
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
