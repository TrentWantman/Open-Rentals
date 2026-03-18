"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { LandlordDashboardSkeleton } from "@/components/ui/loading-skeleton";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { ProfileCompletionWizard } from "@/components/profile/profile-completion-wizard";
import { toast } from "sonner";
import {
  Building2,
  Plus,
  Eye,
  MessageCircle,
  DollarSign,
  TrendingUp,
  Users,
  Home,
  Clock,
  CheckCircle,
  XCircle,
  MoreVertical,
  Calendar,
  MapPin,
  Loader2,
  User,
  Shield,
  Sparkles,
  Edit,
  Trash2,
  ExternalLink,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Send,
  FileText,
  AlertCircle,
  Percent,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Mock data
const stats = [
  {
    title: "Total Properties",
    value: "12",
    icon: Building2,
    trend: "+2 this month",
    trendUp: true,
    color: "text-sky-500",
    bgColor: "bg-sky-50",
  },
  {
    title: "Active Listings",
    value: "8",
    icon: Home,
    trend: "67% occupancy",
    trendUp: true,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
  },
  {
    title: "Total Views",
    value: "1,247",
    icon: Eye,
    trend: "+23% this week",
    trendUp: true,
    color: "text-teal-500",
    bgColor: "bg-teal-50",
  },
  {
    title: "Pending Applications",
    value: "5",
    icon: Users,
    trend: "3 new today",
    trendUp: true,
    color: "text-amber-500",
    bgColor: "bg-amber-50",
  },
];

const earningsStats = {
  totalEarnings: 156420,
  monthlyEarnings: 28500,
  pendingPayments: 4200,
  monthlyChange: 12.5,
};

const properties = [
  {
    id: "1",
    title: "Luxury Brickell Highrise",
    address: "1000 Brickell Ave, Miami, FL",
    price: 4500,
    status: "active",
    views: 342,
    applications: 3,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
  },
  {
    id: "2",
    title: "Coral Gables Villa",
    address: "245 Alhambra Circle, Coral Gables, FL",
    price: 6200,
    status: "active",
    views: 256,
    applications: 2,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
  },
  {
    id: "3",
    title: "Wynwood Loft",
    address: "2200 NW 2nd Ave, Miami, FL",
    price: 2800,
    status: "rented",
    views: 189,
    applications: 0,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
  },
];

const applications = [
  {
    id: "1",
    property: "Luxury Brickell Highrise",
    propertyId: "1",
    applicant: {
      name: "Sarah Johnson",
      email: "sarah@example.com",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    },
    date: "2024-01-15",
    status: "pending",
    income: 8500,
    creditScore: 720,
  },
  {
    id: "2",
    property: "Coral Gables Villa",
    propertyId: "2",
    applicant: {
      name: "Michael Chen",
      email: "michael@example.com",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    },
    date: "2024-01-14",
    status: "approved",
    income: 12000,
    creditScore: 780,
  },
  {
    id: "3",
    property: "Luxury Brickell Highrise",
    propertyId: "1",
    applicant: {
      name: "Emily Rodriguez",
      email: "emily@example.com",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    },
    date: "2024-01-13",
    status: "rejected",
    income: 4500,
    creditScore: 620,
  },
  {
    id: "4",
    property: "Coral Gables Villa",
    propertyId: "2",
    applicant: {
      name: "David Kim",
      email: "david@example.com",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    },
    date: "2024-01-12",
    status: "pending",
    income: 9200,
    creditScore: 740,
  },
];

const messages = [
  {
    id: "1",
    from: "Sarah Johnson",
    subject: "Question about Brickell Highrise",
    preview: "Hi, I was wondering if the unit includes parking...",
    date: "2024-01-15",
    unread: true,
    property: "Luxury Brickell Highrise",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  },
  {
    id: "2",
    from: "Michael Chen",
    subject: "Move-in date confirmation",
    preview: "Thank you for approving my application. I would like to confirm...",
    date: "2024-01-14",
    unread: true,
    property: "Coral Gables Villa",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  },
  {
    id: "3",
    from: "Platform Support",
    subject: "Your monthly earnings summary",
    preview: "Your earnings for January 2024 are now available...",
    date: "2024-01-10",
    unread: false,
    property: null,
    avatar: null,
  },
];

const statusColors: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-600 border-emerald-200",
  rented: "bg-sky-100 text-sky-600 border-sky-200",
  inactive: "bg-gray-100 text-gray-600 border-gray-200",
  pending: "bg-amber-100 text-amber-600 border-amber-200",
  approved: "bg-emerald-100 text-emerald-600 border-emerald-200",
  rejected: "bg-red-100 text-red-600 border-red-200",
};

export default function LandlordDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("properties");
  const [showProfileWizard, setShowProfileWizard] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);
  const [processingApp, setProcessingApp] = useState<string | null>(null);
  const [appStatuses, setAppStatuses] = useState<Record<string, string>>({});

  // Handle tab from URL hash
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && ["properties", "applications", "messages"].includes(hash)) {
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
  const profileCompletion = profileComplete ? 100 : 45;

  const handleProfileComplete = useCallback(() => {
    setShowProfileWizard(false);
    setProfileComplete(true);
    toast.success("Profile completed successfully!", {
      description: "Your business profile is now complete. Your listings will now show a verified badge.",
    });
  }, []);

  // Auth protection
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    } else if (!isLoading && user && user.role !== "landlord") {
      router.push("/dashboard/renter");
    }
  }, [user, isLoading, router]);

  const handleApproveApplication = async (appId: string, applicantName: string) => {
    setProcessingApp(appId);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setAppStatuses((prev) => ({ ...prev, [appId]: "approved" }));
    toast.success(`Application approved for ${applicantName}`, {
      description: "An email notification has been sent to the applicant.",
    });
    setProcessingApp(null);
  };

  const handleRejectApplication = async (appId: string, applicantName: string) => {
    setProcessingApp(appId);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setAppStatuses((prev) => ({ ...prev, [appId]: "rejected" }));
    toast.success(`Application declined for ${applicantName}`, {
      description: "The applicant has been notified.",
    });
    setProcessingApp(null);
  };

  const handleViewApplication = (appId: string) => {
    toast.info("Application details coming soon!", {
      description: "Full application review will be available shortly.",
    });
  };

  const handleEditProperty = (propertyId: string) => {
    toast.info("Property editing coming soon!", {
      description: "You will be able to edit property details shortly.",
    });
  };

  const handleDeactivateProperty = (propertyId: string, title: string) => {
    toast.success(`"${title}" has been deactivated`, {
      description: "This listing is no longer visible to renters.",
    });
  };

  const handleViewMessage = (messageId: string) => {
    toast.info("Messaging coming soon!", {
      description: "Full messaging functionality will be available shortly.",
    });
  };

  const handleViewEarnings = () => {
    toast.info("Earnings dashboard coming soon!", {
      description: "Detailed earnings reports will be available shortly.",
    });
  };

  // Loading state - use skeleton instead of spinner
  if (isLoading) {
    return <LandlordDashboardSkeleton />;
  }

  // Redirect if not authenticated or wrong role
  if (!user || user.role !== "landlord") {
    return null;
  }

  const displayName = user.firstName || "there";
  const pendingApplications = applications.filter(
    (app) => (appStatuses[app.id] || app.status) === "pending"
  );
  const unreadMessages = messages.filter((m) => m.unread).length;

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
                <p className="text-gray-600">Manage your properties and applications</p>
              </div>
              <Button variant="gradient" asChild>
                <Link href="/dashboard/landlord/properties/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </Link>
              </Button>
            </div>

            {/* Profile Completion Card for Landlords */}
            {profileCompletion < 100 && (
              <Card variant="glass" className="p-6 mb-8 bg-gradient-to-r from-emerald-50 to-sky-50 border-emerald-200 shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 rounded-lg bg-emerald-100">
                        <Shield className="h-5 w-5 text-emerald-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Complete Your Business Profile
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      A verified business profile builds trust with potential tenants. Complete your profile to get a verified badge on your listings.
                    </p>
                    <Progress value={profileCompletion} variant="gradient" className="h-2.5" />
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm text-emerald-600 font-medium">{profileCompletion}% complete</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Sparkles className="h-3 w-3" />
                        <span>Get the verified badge</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="gradient"
                    onClick={() => setShowProfileWizard(true)}
                  >
                    <Shield className="h-4 w-4 mr-2" />
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

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
                <Card key={index} variant="glass" className="p-5 bg-white/70 backdrop-blur-sm border-sky-100 shadow-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {stat.trendUp ? (
                          <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 text-red-500" />
                        )}
                        <p className="text-xs text-gray-500">{stat.trend}</p>
                      </div>
                    </div>
                    <div className={cn("p-3 rounded-xl", stat.bgColor)}>
                      <stat.icon className={cn("h-6 w-6", stat.color)} />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Earnings Summary Card */}
            <Card variant="glass" className="p-6 mb-8 bg-gradient-to-r from-emerald-50 to-sky-50 border-emerald-200 shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-xl bg-white/80 shadow-sm">
                    <DollarSign className="h-8 w-8 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
                    <p className="text-3xl font-bold text-gray-900">
                      ${earningsStats.totalEarnings.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        {earningsStats.monthlyChange}% this month
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">This Month</p>
                    <p className="text-xl font-bold text-gray-900">
                      ${earningsStats.monthlyEarnings.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-xl font-bold text-amber-600">
                      ${earningsStats.pendingPayments.toLocaleString()}
                    </p>
                  </div>
                </div>
                <Button variant="outline" onClick={handleViewEarnings}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </Card>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="properties">
                  <Building2 className="h-4 w-4 mr-2" />
                  Properties ({properties.length})
                </TabsTrigger>
                <TabsTrigger value="applications">
                  <Users className="h-4 w-4 mr-2" />
                  Applications
                  {pendingApplications.length > 0 && (
                    <Badge className="ml-2 h-5 px-1.5" variant="default">
                      {pendingApplications.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="messages">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Messages
                  {unreadMessages > 0 && (
                    <Badge className="ml-2 h-5 px-1.5" variant="default">
                      {unreadMessages}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              {/* Properties Tab */}
              <TabsContent value="properties">
                {properties.length > 0 ? (
                  <div className="grid gap-4">
                    {properties.map((property) => (
                      <Card key={property.id} variant="glass" className="p-4 bg-white/70 backdrop-blur-sm border-sky-100 shadow-lg">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden shrink-0">
                            <img
                              src={property.image}
                              alt={property.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    {property.title}
                                  </h3>
                                  <Badge
                                    variant="outline"
                                    className={cn("capitalize", statusColors[property.status])}
                                  >
                                    {property.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {property.address}
                                </p>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEditProperty(property.id)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Property
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link href={`/listings/${property.id}`}>
                                      <ExternalLink className="h-4 w-4 mr-2" />
                                      View Listing
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => setActiveTab("applications")}>
                                    <Users className="h-4 w-4 mr-2" />
                                    View Applications
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => handleDeactivateProperty(property.id, property.title)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Deactivate
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            <div className="flex flex-wrap gap-6 mt-4">
                              <div className="flex items-center gap-2 text-gray-700">
                                <DollarSign className="h-4 w-4 text-emerald-500" />
                                <span className="font-medium">${property.price.toLocaleString()}/mo</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <Eye className="h-4 w-4" />
                                <span>{property.views} views</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <Users className="h-4 w-4" />
                                <span>{property.applications} applications</span>
                              </div>
                            </div>

                            {property.status === "active" && property.applications > 0 && (
                              <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
                                <p className="text-sm text-amber-700 flex items-center gap-2">
                                  <AlertCircle className="h-4 w-4" />
                                  {property.applications} pending application{property.applications > 1 ? "s" : ""} to review
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                    <div className="text-center pt-4">
                      <Button variant="outline" asChild>
                        <Link href="/dashboard/landlord/properties">
                          View All Properties
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Card variant="glass" className="p-12 text-center bg-white/70 backdrop-blur-sm border-sky-100 shadow-lg">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sky-50 flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-sky-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties yet</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      List your first property to start receiving applications from qualified renters
                    </p>
                    <Button variant="gradient" asChild>
                      <Link href="/dashboard/landlord/properties/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Property
                      </Link>
                    </Button>
                  </Card>
                )}
              </TabsContent>

              {/* Applications Tab */}
              <TabsContent value="applications">
                {applications.length > 0 ? (
                  <div className="space-y-4">
                    {applications.map((app) => {
                      const currentStatus = appStatuses[app.id] || app.status;
                      const isProcessing = processingApp === app.id;

                      return (
                        <Card key={app.id} variant="glass" className="p-5 bg-white/70 backdrop-blur-sm border-sky-100 shadow-lg">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={app.applicant.image} />
                                <AvatarFallback className="bg-gradient-to-br from-sky-400 to-emerald-500 text-white">
                                  {app.applicant.name[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-semibold text-gray-900">{app.applicant.name}</h3>
                                <p className="text-sm text-gray-600">{app.applicant.email}</p>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 md:gap-8">
                              <div className="text-sm">
                                <p className="text-gray-500">Property</p>
                                <p className="text-gray-900 font-medium">{app.property}</p>
                              </div>
                              <div className="text-sm">
                                <p className="text-gray-500">Income</p>
                                <p className="text-gray-900">${app.income.toLocaleString()}/mo</p>
                              </div>
                              <div className="text-sm">
                                <p className="text-gray-500">Credit Score</p>
                                <p className={cn(
                                  "font-medium",
                                  app.creditScore >= 700 ? "text-emerald-600" :
                                  app.creditScore >= 650 ? "text-amber-600" : "text-red-600"
                                )}>
                                  {app.creditScore}
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className={cn("capitalize", statusColors[currentStatus])}
                              >
                                {currentStatus === "pending" && <Clock className="h-3 w-3 mr-1" />}
                                {currentStatus === "approved" && <CheckCircle className="h-3 w-3 mr-1" />}
                                {currentStatus === "rejected" && <XCircle className="h-3 w-3 mr-1" />}
                                {currentStatus}
                              </Badge>
                            </div>

                            <div className="flex gap-2">
                              {currentStatus === "pending" ? (
                                <>
                                  <Button
                                    size="sm"
                                    variant="neon"
                                    onClick={() => handleApproveApplication(app.id, app.applicant.name)}
                                    disabled={isProcessing}
                                  >
                                    {isProcessing ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <>
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        Approve
                                      </>
                                    )}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleRejectApplication(app.id, app.applicant.name)}
                                    disabled={isProcessing}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Decline
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleViewApplication(app.id)}
                                >
                                  <FileText className="h-4 w-4 mr-1" />
                                  View Details
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
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-50 flex items-center justify-center">
                      <Users className="h-8 w-8 text-amber-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications yet</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      When renters apply to your properties, you will be able to review their applications here
                    </p>
                  </Card>
                )}
              </TabsContent>

              {/* Messages Tab */}
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
                              <div>
                                <h4 className={cn(
                                  "font-medium text-gray-900",
                                  message.unread && "font-semibold"
                                )}>
                                  {message.from}
                                </h4>
                                {message.property && (
                                  <p className="text-xs text-sky-600">{message.property}</p>
                                )}
                              </div>
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
                        <ExternalLink className="h-4 w-4 ml-2" />
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
                      When renters message you about your properties, their messages will appear here
                    </p>
                  </Card>
                )}
              </TabsContent>
            </Tabs>

            {/* Quick Actions Card */}
            <Card variant="glass" className="mt-8 p-6 bg-gradient-to-r from-sky-50/80 to-emerald-50/80 backdrop-blur-sm border-sky-100 shadow-lg">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                  <Link href="/dashboard/landlord/properties/new">
                    <Plus className="h-5 w-5 text-sky-500" />
                    <span className="text-sm">Add Property</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                  <Link href="/dashboard/landlord/properties">
                    <Building2 className="h-5 w-5 text-emerald-500" />
                    <span className="text-sm">Manage Properties</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2"
                  onClick={handleViewEarnings}
                >
                  <BarChart3 className="h-5 w-5 text-teal-500" />
                  <span className="text-sm">View Earnings</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2"
                  onClick={() => toast.info("Pricing tools coming soon!")}
                >
                  <Percent className="h-5 w-5 text-amber-500" />
                  <span className="text-sm">Pricing Tools</span>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
