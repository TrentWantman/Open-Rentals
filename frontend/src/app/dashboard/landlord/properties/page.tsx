"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Plus,
  Eye,
  Users,
  DollarSign,
  MapPin,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  ExternalLink,
  Loader2,
  Home,
  Filter,
  ArrowLeft,
  AlertCircle,
  Power,
  RefreshCw,
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
const mockProperties = [
  {
    id: "1",
    title: "Luxury Brickell Highrise",
    address: "1000 Brickell Ave, Miami, FL",
    price: 4500,
    beds: 2,
    baths: 2,
    sqft: 1200,
    status: "active",
    views: 342,
    applications: 3,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    title: "Coral Gables Villa",
    address: "245 Alhambra Circle, Coral Gables, FL",
    price: 6200,
    beds: 4,
    baths: 3,
    sqft: 2800,
    status: "active",
    views: 256,
    applications: 2,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
    createdAt: "2024-01-08",
  },
  {
    id: "3",
    title: "Wynwood Creative Loft",
    address: "2200 NW 2nd Ave, Miami, FL",
    price: 2800,
    beds: 1,
    baths: 1,
    sqft: 850,
    status: "rented",
    views: 189,
    applications: 0,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
    createdAt: "2024-01-05",
  },
  {
    id: "4",
    title: "Miami Beach Oceanfront",
    address: "1500 Ocean Drive, Miami Beach, FL",
    price: 8500,
    beds: 3,
    baths: 3,
    sqft: 2100,
    status: "inactive",
    views: 0,
    applications: 0,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop",
    createdAt: "2024-01-02",
  },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  active: { label: "Active", color: "bg-emerald-100 text-emerald-600 border-emerald-200" },
  rented: { label: "Rented", color: "bg-sky-100 text-sky-600 border-sky-200" },
  inactive: { label: "Inactive", color: "bg-gray-100 text-gray-600 border-gray-200" },
};

export default function PropertiesPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [properties, setProperties] = useState(mockProperties);

  // Auth protection
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    } else if (!isLoading && user && user.role !== "landlord") {
      router.push("/dashboard/renter");
    }
  }, [user, isLoading, router]);

  // Filter properties
  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || property.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 flex items-center justify-center">
        <Card variant="glass" className="p-8 text-center max-w-sm mx-4 bg-white/70 backdrop-blur-xl border-sky-100 shadow-lg">
          <Loader2 className="h-10 w-10 animate-spin text-sky-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Loading Properties</h2>
          <p className="text-gray-600 text-sm">Please wait while we load your properties...</p>
        </Card>
      </div>
    );
  }

  // Redirect if not authenticated or wrong role
  if (!user || user.role !== "landlord") {
    return null;
  }

  const handleDeleteProperty = (propertyId: string, title: string) => {
    setProperties(properties.filter((p) => p.id !== propertyId));
    toast.success(`"${title}" has been deleted`, {
      description: "The property listing has been permanently removed.",
    });
  };

  const handleDeactivateProperty = (propertyId: string, title: string) => {
    setProperties(properties.map((p) =>
      p.id === propertyId ? { ...p, status: "inactive" } : p
    ));
    toast.success(`"${title}" has been deactivated`, {
      description: "This listing is no longer visible to renters.",
    });
  };

  const handleReactivateProperty = (propertyId: string, title: string) => {
    setProperties(properties.map((p) =>
      p.id === propertyId ? { ...p, status: "active" } : p
    ));
    toast.success(`"${title}" is now active`, {
      description: "This listing is now visible to renters.",
    });
  };

  const handleEditProperty = (propertyId: string) => {
    toast.info("Property editing coming soon!", {
      description: "You will be able to edit property details shortly.",
    });
  };

  const handleViewApplications = (propertyId: string) => {
    toast.info("Applications view coming soon!", {
      description: "You will be able to view applications shortly.",
    });
  };

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
            <div className="mb-8">
              <Button variant="ghost" asChild className="mb-4">
                <Link href="/dashboard/landlord">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">My Properties</h1>
                  <p className="text-gray-600">
                    Manage all your property listings in one place
                  </p>
                </div>
                <Button variant="gradient" asChild>
                  <Link href="/dashboard/landlord/properties/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Property
                  </Link>
                </Button>
              </div>
            </div>

        {/* Filters */}
        <Card variant="glass" className="p-4 mb-6 bg-white/60 backdrop-blur-sm border-sky-100 shadow-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search properties..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card variant="glass" className="p-4 bg-white/60 backdrop-blur-sm border-sky-100 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-sky-50">
                <Building2 className="h-5 w-5 text-sky-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
                <p className="text-xs text-gray-600">Total</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-4 bg-white/60 backdrop-blur-sm border-sky-100 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50">
                <Home className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {properties.filter((p) => p.status === "active").length}
                </p>
                <p className="text-xs text-gray-600">Active</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-4 bg-white/60 backdrop-blur-sm border-sky-100 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-50">
                <Eye className="h-5 w-5 text-teal-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {properties.reduce((sum, p) => sum + p.views, 0)}
                </p>
                <p className="text-xs text-gray-600">Total Views</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-4 bg-white/60 backdrop-blur-sm border-sky-100 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-50">
                <Users className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {properties.reduce((sum, p) => sum + p.applications, 0)}
                </p>
                <p className="text-xs text-gray-600">Applications</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Properties List */}
        {filteredProperties.length > 0 ? (
          <div className="grid gap-4">
            {filteredProperties.map((property) => {
              const status = statusConfig[property.status];
              return (
                <Card
                  key={property.id}
                  variant="glass"
                  className="p-4 bg-white/60 backdrop-blur-sm border-sky-100 shadow-lg"
                >
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
                              className={cn("capitalize", status.color)}
                            >
                              {status.label}
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
                            <DropdownMenuItem onClick={() => handleViewApplications(property.id)}>
                              <Users className="h-4 w-4 mr-2" />
                              View Applications ({property.applications})
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {property.status === "active" ? (
                              <DropdownMenuItem
                                className="text-amber-600"
                                onClick={() => handleDeactivateProperty(property.id, property.title)}
                              >
                                <Power className="h-4 w-4 mr-2" />
                                Deactivate
                              </DropdownMenuItem>
                            ) : property.status === "inactive" ? (
                              <DropdownMenuItem
                                className="text-emerald-600"
                                onClick={() => handleReactivateProperty(property.id, property.title)}
                              >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Reactivate
                              </DropdownMenuItem>
                            ) : null}
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteProperty(property.id, property.title)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Property
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="flex flex-wrap gap-6 mt-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <DollarSign className="h-4 w-4 text-emerald-500" />
                          <span className="font-medium">
                            ${property.price.toLocaleString()}/mo
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <span className="text-sm">
                            {property.beds} bed | {property.baths} bath | {property.sqft.toLocaleString()} sqft
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-6 mt-3">
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <Eye className="h-4 w-4" />
                          <span>{property.views} views</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <Users className="h-4 w-4" />
                          <span>{property.applications} applications</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
            <Card variant="glass" className="p-12 text-center bg-white/70 backdrop-blur-sm border-sky-100 shadow-lg">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sky-50 flex items-center justify-center">
                <Building2 className="h-8 w-8 text-sky-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Get started by adding your first property listing"}
              </p>
              {!searchQuery && statusFilter === "all" && (
                <Button variant="gradient" asChild>
                  <Link href="/dashboard/landlord/properties/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Property
                  </Link>
                </Button>
              )}
            </Card>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
