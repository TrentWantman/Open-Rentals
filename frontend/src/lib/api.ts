const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function getAuthToken(): Promise<string | null> {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
}

async function fetchWithAuth<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, headers: customHeaders, ...restOptions } = options;

  // Build URL with query params
  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  // Get auth token
  const token = await getAuthToken();

  // Build headers
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  // Make request
  const response = await fetch(url, {
    ...restOptions,
    headers,
  });

  // Handle response
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new ApiError(
      response.status,
      errorData?.message || `Request failed with status ${response.status}`,
      errorData
    );
  }

  // Parse JSON response
  const data = await response.json();
  return data as T;
}

// Auth endpoints
export const authApi = {
  login: async (email: string, password: string) => {
    return fetchWithAuth<{ token: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (data: {
    name: string;
    email: string;
    password: string;
    role: "renter" | "landlord";
  }) => {
    return fetchWithAuth<{ token: string; user: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  logout: async () => {
    return fetchWithAuth<void>("/auth/logout", {
      method: "POST",
    });
  },

  me: async () => {
    return fetchWithAuth<User>("/auth/me");
  },

  forgotPassword: async (email: string) => {
    return fetchWithAuth<{ message: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (token: string, newPassword: string) => {
    return fetchWithAuth<{ message: string }>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, new_password: newPassword }),
    });
  },
};

// Properties endpoints
export const propertiesApi = {
  list: async (filters?: {
    neighborhood?: string;
    minPrice?: number;
    maxPrice?: number;
    beds?: number;
    baths?: number;
    q?: string;
    page?: number;
    limit?: number;
  }) => {
    const params: Record<string, string> = {};
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params[key] = String(value);
        }
      });
    }
    return fetchWithAuth<{ items: Property[]; total: number; page: number }>("/properties", {
      params,
    });
  },

  get: async (id: string) => {
    return fetchWithAuth<Property>(`/properties/${id}`);
  },

  create: async (data: CreatePropertyData) => {
    return fetchWithAuth<Property>("/properties", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<CreatePropertyData>) => {
    return fetchWithAuth<Property>(`/properties/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return fetchWithAuth<void>(`/properties/${id}`, {
      method: "DELETE",
    });
  },
};

// Applications endpoints
export const applicationsApi = {
  list: async () => {
    return fetchWithAuth<Application[]>("/applications");
  },

  create: async (propertyId: string, data: CreateApplicationData) => {
    return fetchWithAuth<Application>("/applications", {
      method: "POST",
      body: JSON.stringify({ propertyId, ...data }),
    });
  },

  updateStatus: async (id: string, status: "approved" | "rejected") => {
    return fetchWithAuth<Application>(`/applications/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
};

// Messages endpoints
export const messagesApi = {
  list: async () => {
    return fetchWithAuth<Message[]>("/messages");
  },

  send: async (recipientId: string, content: string, propertyId?: string) => {
    return fetchWithAuth<Message>("/messages", {
      method: "POST",
      body: JSON.stringify({ recipientId, content, propertyId }),
    });
  },
};

// Saved listings endpoints
export const savedApi = {
  list: async () => {
    return fetchWithAuth<SavedListing[]>("/saved");
  },

  add: async (propertyId: string) => {
    return fetchWithAuth<SavedListing>("/saved", {
      method: "POST",
      body: JSON.stringify({ propertyId }),
    });
  },

  remove: async (propertyId: string) => {
    return fetchWithAuth<void>(`/saved/${propertyId}`, {
      method: "DELETE",
    });
  },
};

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: "renter" | "landlord";
  image?: string;
  verified?: boolean;
  createdAt: string;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  address: string;
  unit_number?: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  monthly_rent: string;
  bedrooms: number;
  bathrooms: string;
  square_feet?: number | null;
  property_type: string;
  images: { id: string; url: string; is_primary: boolean }[];
  amenities: Record<string, unknown> | null;
  is_verified: boolean;
  featured?: boolean;
  available?: boolean;
  available_date?: string;
  pets_allowed: boolean;
  latitude?: number | null;
  longitude?: number | null;
  coordinates?: { lat: number; lng: number };
  created_at: string;
  updated_at: string;
}

export interface CreatePropertyData {
  title: string;
  description: string;
  address: string;
  unit?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  propertyType: string;
  amenities: string[];
  availableDate?: string;
  images?: string[];
}

export interface Application {
  id: string;
  property: Property;
  applicant: User;
  status: "pending" | "approved" | "rejected";
  income?: number;
  creditScore?: number;
  message?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateApplicationData {
  income?: number;
  creditScore?: number;
  message?: string;
}

export interface Message {
  id: string;
  sender: User;
  recipient: User;
  property?: Property;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface SavedListing {
  id: string;
  property: Property;
  savedAt: string;
}

export { ApiError };
