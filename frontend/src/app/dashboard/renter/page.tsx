"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { RenterDashboardSkeleton } from "@/components/ui/loading-skeleton";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { ProfileCompletionWizard } from "@/components/profile/profile-completion-wizard";
import { toast } from "sonner";
import {
  Heart,
  FileText,
  MessageCircle,
  Search,
  Home,
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Bed,
  Bath,
  ChevronRight,
  Bell,
  Calendar,
  ArrowRight,
  Loader2,
  Trash2,
  Eye,
  Send,
  AlertCircle,
  Star,
  TrendingUp,
  User,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data
const savedListings = [
  {
    id: "1",
    title: "Luxury Brickell Highrise",
    address: "1000 Brickell Ave, Miami, FL",
    price: 4500,
    beds: 2,
    baths: 2,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
    savedAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Miami Beach Oceanfront",
    address: "1500 Ocean Drive, Miami Beach, FL",
    price: 8500,
    beds: 3,
    baths: 3,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=600&fit=crop",
    savedAt: "2024-01-14",
  },
  {
    id: "3",
    title: "Coconut Grove Retreat",
    address: "3000 Bayshore Dr, Miami, FL",
    price: 5200,
    beds: 2,
    baths: 2,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
    savedAt: "2024-01-13",
  },
];

const applications = [
  {
    id: "1",
    property: {
      title: "Coral Gables Villa",
      address: "245 Alhambra Circle, Coral Gables, FL",
      price: 6200,
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
    },
    status: "pending",
    appliedAt: "2024-01-12",
    landlord: "Miami Properties LLC",
  },
  {
    id: "2",
    property: {
      title: "Downtown Miami Studio",
      address: "50 Biscayne Blvd, Miami, FL",
      price: 2200,
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop",
    },
    status: "approved",
    appliedAt: "2024-01-08",
    landlord: "Biscayne Rentals",
  },
  {
    id: "3",
    property: {
      title: "Wynwood Creative Loft",
      address: "2200 NW 2nd Ave, Miami, FL",
      price: 3200,
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
    },
    status: "rejected",
    appliedAt: "2024-01-05",
    landlord: "Arts District Properties",
  },
];

const messages = [
  {
    id: "1",
    from: "Miami Properties LLC",
    subject: "Re: Application for Coral Gables Villa",
    preview: "Thank you for your application. We would like to schedule a viewing...",
    date: "2024-01-15",
    unread: true,
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop",
  },
  {
    id: "2",
    from: "Biscayne Rentals",
    subject: "Congratulations! Your application is approved",
    preview: "We are pleased to inform you that your application has been approved...",
    date: "2024-01-14",
    unread: true,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop",
  },
  {
    id: "3",
    from: "Support Team",
    subject: "Welcome to Open Rentals!",
    preview: "Welcome to Open Rentals! Here are some tips to help you find your perfect home...",
    date: "2024-01-10",
    unread: false,
    avatar: null,
  },
];

const statusConfig = {
  pending: {
    label: "Pending Review",
    color: "bg-amber-100 text-amber-600 border-amber-200",
    icon: Clock,
  },
  approved: {
    label: "Approved",
    color: "bg-emerald-100 text-emerald-600 border-emerald-200",
    icon: CheckCircle,
  },
  rejected: {
    label: "Not Selected",
    color: "bg-red-100 text-red-600 border-red-200",
    icon: XCircle,
  },
};

export default function RenterDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("saved");
  const [savedItems, setSavedItems] = useState(savedListings);
  const [isRemoving, setIsRemoving] = useState<string | null>(null);
  const [showProfileWizard, setShowProfileWizard] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);

  // Handle tab from URL hash
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && ["saved", "applications", "messages"].includes(hash)) {
      setActiveTab(hash);
    }
  }, []);

  // Check if we should show the wizard from URL params
  useEffect(() => {
    const showWizard = searchParams.get("complete-profile");
    if (showWizard === "true") {
      setShowProfileWizard(true);
    }
  }, [searchParams]);

  // Calculate profile completion (in real app, this would come from backend)
  const profileCompletion = profileComplete ? 100 : 65;
  const unreadMessages = messages.filter((m) => m.unread).length;

  const handleProfileComplete = useCallback(() => {
    setShowProfileWizard(false);
    setProfileComplete(true);
    toast.success("Profile completed successfully!", {
      description: "Your profile is now complete. Landlords can now see your full information.",
    });
  }, []);

  // Auth protection
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    } else if (!isLoading && user && user.role !== "renter") {
      router.push("/dashboard/landlord");
    }
  }, [user, isLoading, router]);

  const handleRemoveSaved = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRemoving(id);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    setSavedItems((prev) => prev.filter((item) => item.id !== id));
    toast.success("Listing removed from saved");
    setIsRemoving(null);
  };

  const handleWithdrawApplication = (appId: string) => {
    toast.success("Application withdrawn successfully");
  };

  const handleViewMessage = (messageId: string) => {
    toast.info("Messaging coming soon!", {
      description: "Full messaging functionality will be available shortly.",
    });
  };

  const handleScheduleTour = (propertyId: string) => {
    toast.info("Tour scheduling coming soon!", {
      description: "You will be able to schedule property tours soon.",
    });
  };

  const handleContactLandlord = (landlord: string) => {
    toast.info("Contact feature coming soon!", {
      description: `You will be able to message ${landlord} soon.`,
    });
  };

  // Loading state - use skeleton instead of spinner
  if (isLoading) {
    return <RenterDashboardSkeleton />;
  }

  // Redirect if not authenticated or wrong role
  if (!user || user.role !== "renter") {
    return null;
  }

  const displayName = user.firstName || "there";

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="hidden lg:block">
            <DashboardSidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {displayName}!</h1>
                <p className="text-gray-600">Track your applications and saved properties</p>
              </div>
              <Button variant="gradient" asChild>
                <Link href="/listings">
                  <Search className="h-4 w-4 mr-2" />
                  Find Properties
                </Link>
              </Button>
            </div>

            {/* Profile Completion Card */}
            {profileCompletion < 100 && (
              <Card variant="glass" className="p-6 mb-8 bg-gradient-to-r from-sky-50 to-emerald-50 border-sky-200 shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 rounded-lg bg-sky-100">
                        <User className="h-5 w-5 text-sky-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Complete Your Profile
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      A complete profile increases your chances of getting approved by landlords. Add your income, employment info, and preferred neighborhoods.
                    </p>
                    <Progress value={profileCompletion} variant="gradient" className="h-2.5" />
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm text-sky-600 font-medium">{profileCompletion}% complete</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Sparkles className="h-3 w-3" />
                        <span>Takes 2-3 minutes</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="gradient"
                    onClick={() => setShowProfileWizard(true)}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Complete Profile
                  </Button>
                </div>
              </Card>
            )}

            {/* Profile Completion Wizard Modal */}
            {showProfileWizard && (
              <ProfileCompletionWizard
                isModal={true}
                onComplete={handleProfileComplete}
                onDismiss={() => setShowProfileWizard(false)}
              />
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card variant="glass" className="p-5 bg-white/70 backdrop-blur-sm border-sky-100 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-pink-50">
                    <Heart className="h-6 w-6 text-pink-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{savedItems.length}</p>
                    <p className="text-sm text-gray-600">Saved Listings</p>
                  </div>
                </div>
              </Card>
              <Card variant="glass" className="p-5 bg-white/70 backdrop-blur-sm border-sky-100 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-sky-50">
                    <FileText className="h-6 w-6 text-sky-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
                    <p className="text-sm text-gray-600">Applications</p>
                  </div>
                </div>
              </Card>
              <Card variant="glass" className="p-5 bg-white/70 backdrop-blur-sm border-sky-100 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-emerald-50">
                    <CheckCircle className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {applications.filter((a) => a.status === "approved").length}
                    </p>
                    <p className="text-sm text-gray-600">Approved</p>
                  </div>
                </div>
              </Card>
              <Card variant="glass" className="p-5 bg-white/70 backdrop-blur-sm border-sky-100 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-amber-50">
                    <MessageCircle className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{unreadMessages}</p>
                    <p className="text-sm text-gray-600">New Messages</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="saved">
                  <Heart className="h-4 w-4 mr-2" />
                  Saved ({savedItems.length})
                </TabsTrigger>
                <TabsTrigger value="applications">
                  <FileText className="h-4 w-4 mr-2" />
                  Applications ({applications.length})
                </TabsTrigger>
                <TabsTrigger value="messages">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Messages
                  {unreadMessages > 0 && (
                    <Badge className="ml-2 h-5 px-1.5" variant="default">{unreadMessages}</Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              {/* Saved Listings */}
              <TabsContent value="saved">
                {savedItems.length > 0 ? (
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {savedItems.map((listing) => (
                      <Link key={listing.id} href={`/listings/${listing.id}`}>
                        <Card variant="glass" interactive hoverGlow className="overflow-hidden h-full bg-white/70 backdrop-blur-sm border-sky-100 shadow-lg group">
                          <div className="relative h-48">
                            <img
                              src={listing.image}
                              alt={listing.title}
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                            <Button
                              variant="glass"
                              size="icon"
                              className="absolute top-3 right-3 bg-white/80 hover:bg-white"
                              onClick={(e) => handleRemoveSaved(listing.id, e)}
                              disabled={isRemoving === listing.id}
                            >
                              {isRemoving === listing.id ? (
                                <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                              ) : (
                                <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                              )}
                            </Button>
                            <div className="absolute bottom-3 left-3">
                              <Badge className="bg-white/90 text-gray-900 backdrop-blur-sm">
                                ${listing.price.toLocaleString()}/mo
                              </Badge>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-sky-600 transition-colors">
                              {listing.title}
                            </h3>
                            <p className="text-sm text-gray-600 flex items-center mb-3">
                              <MapPin className="h-4 w-4 mr-1 shrink-0" />
                              <span className="truncate">{listing.address}</span>
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-700">
                              <span className="flex items-center gap-1">
                                <Bed className="h-4 w-4" />
                                {listing.beds} beds
                              </span>
                              <span className="flex items-center gap-1">
                                <Bath className="h-4 w-4" />
                                {listing.baths} baths
                              </span>
                            </div>
                            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleScheduleTour(listing.id);
                                }}
                              >
                                <Calendar className="h-4 w-4 mr-1" />
                                Tour
                              </Button>
                              <Button
                                variant="neon"
                                size="sm"
                                className="flex-1"
                                onClick={(e) => {
                                  e.preventDefault();
                                  router.push(`/listings/${listing.id}?apply=true`);
                                }}
                              >
                                Apply Now
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Card variant="glass" className="p-12 text-center bg-white/70 backdrop-blur-sm border-sky-100 shadow-lg">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-pink-50 flex items-center justify-center">
                      <Heart className="h-8 w-8 text-pink-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No saved listings yet</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Save properties you are interested in to easily find them later and track their availability
                    </p>
                    <Button variant="gradient" asChild>
                      <Link href="/listings">
                        <Search className="h-4 w-4 mr-2" />
                        Browse Properties
                      </Link>
                    </Button>
                  </Card>
                )}
              </TabsContent>

              {/* Applications */}
              <TabsContent value="applications">
                {applications.length > 0 ? (
                  <div className="space-y-4">
                    {applications.map((app) => {
                      const status = statusConfig[app.status as keyof typeof statusConfig];
                      const StatusIcon = status.icon;

                      return (
                        <Card key={app.id} variant="glass" className="p-5 bg-white/70 backdrop-blur-sm border-sky-100 shadow-lg">
                          <div className="flex flex-col md:flex-row gap-4">
                            <div className="w-full md:w-40 h-28 rounded-lg overflow-hidden shrink-0">
                              <img
                                src={app.property.image}
                                alt={app.property.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                                <div>
                                  <h3 className="font-semibold text-gray-900">{app.property.title}</h3>
                                  <p className="text-sm text-gray-600 flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {app.property.address}
                                  </p>
                                </div>
                                <Badge variant="outline" className={cn("shrink-0", status.color)}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {status.label}
                                </Badge>
                              </div>

                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-3">
                                <span className="text-gray-900 font-medium">
                                  ${app.property.price.toLocaleString()}/mo
                                </span>
                                <span className="flex items-center gap-1">
                                  <Building2 className="h-3 w-3" />
                                  {app.landlord}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  Applied {new Date(app.appliedAt).toLocaleDateString()}
                                </span>
                              </div>

                              {app.status === "approved" && (
                                <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                                  <p className="text-sm text-emerald-700 flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                    <span>
                                      Congratulations! Your application has been approved. The landlord will contact you soon with next steps.
                                    </span>
                                  </p>
                                </div>
                              )}

                              {app.status === "rejected" && (
                                <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-200">
                                  <p className="text-sm text-gray-600 flex items-start gap-2">
                                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                    <span>
                                      Unfortunately, your application was not selected. Do not worry - keep applying to find your perfect home!
                                    </span>
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="flex md:flex-col gap-2 shrink-0">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/listings/${app.id}`}>
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Link>
                              </Button>
                              {app.status === "pending" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                  onClick={() => handleWithdrawApplication(app.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Withdraw
                                </Button>
                              )}
                              {app.status === "approved" && (
                                <Button
                                  variant="neon"
                                  size="sm"
                                  onClick={() => handleContactLandlord(app.landlord)}
                                >
                                  <Send className="h-4 w-4 mr-1" />
                                  Contact
                                </Button>
                              )}
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <Card variant="glass" className="p-12 text-center bg-white/70 backdrop-blur-sm border-sky-100 shadow-lg">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sky-50 flex items-center justify-center">
                      <FileText className="h-8 w-8 text-sky-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications yet</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      When you apply for properties, you can track your application status here
                    </p>
                    <Button variant="gradient" asChild>
                      <Link href="/listings">
                        <Search className="h-4 w-4 mr-2" />
                        Find Properties
                      </Link>
                    </Button>
                  </Card>
                )}
              </TabsContent>

              {/* Messages */}
              <TabsContent value="messages">
                {messages.length > 0 ? (
                  <div className="space-y-3">
                    {messages.map((message) => (
                      <Card
                        key={message.id}
                        variant="glass"
                        interactive
                        className={cn(
                          "p-4 cursor-pointer bg-white/70 backdrop-blur-sm border-sky-100 shadow-lg transition-all hover:shadow-xl",
                          message.unread && "border-l-4 border-l-sky-500"
                        )}
                        onClick={() => handleViewMessage(message.id)}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-emerald-500 flex items-center justify-center shrink-0 overflow-hidden">
                            {message.avatar ? (
                              <img
                                src={message.avatar}
                                alt={message.from}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <MessageCircle className="h-5 w-5 text-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className={cn(
                                "font-medium text-gray-900 truncate",
                                message.unread && "font-semibold"
                              )}>
                                {message.from}
                              </h4>
                              <span className="text-xs text-gray-500 shrink-0">
                                {new Date(message.date).toLocaleDateString()}
                              </span>
                            </div>
                            <p className={cn(
                              "text-sm mb-1",
                              message.unread ? "text-gray-900 font-medium" : "text-gray-700"
                            )}>
                              {message.subject}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {message.preview}
                            </p>
                          </div>
                          {message.unread && (
                            <div className="w-2 h-2 rounded-full bg-sky-500 shrink-0 mt-2" />
                          )}
                        </div>
                      </Card>
                    ))}
                    <div className="text-center pt-4">
                      <Button
                        variant="outline"
                        onClick={() => toast.info("Full messaging coming soon!")}
                      >
                        View All Messages
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Card variant="glass" className="p-12 text-center bg-white/70 backdrop-blur-sm border-sky-100 shadow-lg">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-50 flex items-center justify-center">
                      <MessageCircle className="h-8 w-8 text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No messages yet</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      When landlords respond to your applications, their messages will appear here
                    </p>
                  </Card>
                )}
              </TabsContent>
            </Tabs>

            {/* Quick Tips Card */}
            <Card variant="glass" className="mt-8 p-6 bg-gradient-to-r from-sky-50/80 to-emerald-50/80 backdrop-blur-sm border-sky-100 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-white/80 shrink-0">
                  <TrendingUp className="h-6 w-6 text-sky-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Tips to Get Approved Faster</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      Complete your profile with accurate information
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      Upload proof of income and employment
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      Add references from previous landlords
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      Apply to properties within your budget
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add Building2 icon import
import { Building2 } from "lucide-react";
