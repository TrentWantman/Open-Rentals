"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

// Token storage keys
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "renter" | "landlord" | "admin";
  isVerified: boolean;
  avatarUrl?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "renter" | "landlord";
}

export interface AuthError {
  message: string;
  code?: string;
  field?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<boolean>;
  getAccessToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Helper to safely access localStorage (handles SSR)
const getStorageItem = (key: string): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const setStorageItem = (key: string, value: string): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
};

const removeStorageItem = (key: string): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Failed to remove from localStorage:", error);
  }
};

// Parse API error responses
const parseApiError = async (res: Response): Promise<AuthError> => {
  try {
    const data = await res.json();
    if (typeof data.detail === "string") {
      return { message: data.detail };
    }
    if (Array.isArray(data.detail)) {
      // Handle validation errors
      const firstError = data.detail[0];
      return {
        message: firstError?.msg || "Validation error",
        field: firstError?.loc?.[1],
      };
    }
    return { message: data.detail?.message || "An error occurred" };
  } catch {
    return { message: `Request failed with status ${res.status}` };
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const getAccessToken = useCallback((): string | null => {
    return getStorageItem(ACCESS_TOKEN_KEY);
  }, []);

  const clearTokens = useCallback(() => {
    removeStorageItem(ACCESS_TOKEN_KEY);
    removeStorageItem(REFRESH_TOKEN_KEY);
    setUser(null);
  }, []);

  const fetchUser = useCallback(async (token: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/api/v1/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser({
          id: data.id,
          email: data.email,
          firstName: data.first_name || "",
          lastName: data.last_name || "",
          role: data.role,
          isVerified: data.is_landlord_verified ?? false,
          avatarUrl: data.avatar_url,
        });
        return true;
      }

      // Token is invalid or expired
      if (res.status === 401) {
        clearTokens();
      }
      return false;
    } catch (error) {
      console.error("Failed to fetch user:", error);
      return false;
    }
  }, [clearTokens]);

  const refreshAuth = useCallback(async (): Promise<boolean> => {
    const refreshToken = getStorageItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) return false;

    try {
      const res = await fetch(`${API_URL}/api/v1/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (res.ok) {
        const data = await res.json();
        setStorageItem(ACCESS_TOKEN_KEY, data.access_token);
        if (data.refresh_token) {
          setStorageItem(REFRESH_TOKEN_KEY, data.refresh_token);
        }
        return await fetchUser(data.access_token);
      }

      clearTokens();
      return false;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      clearTokens();
      return false;
    }
  }, [fetchUser, clearTokens]);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = getStorageItem(ACCESS_TOKEN_KEY);

      if (token) {
        const success = await fetchUser(token);
        if (!success) {
          // Try to refresh the token
          await refreshAuth();
        }
      }

      setIsLoading(false);
      setIsInitialized(true);
    };

    initAuth();
  }, [fetchUser, refreshAuth]);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    const res = await fetch(`${API_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData,
    });

    if (!res.ok) {
      const error = await parseApiError(res);
      throw new Error(error.message);
    }

    const data = await res.json();

    // Store tokens
    setStorageItem(ACCESS_TOKEN_KEY, data.access_token);
    if (data.refresh_token) {
      setStorageItem(REFRESH_TOKEN_KEY, data.refresh_token);
    }

    // Fetch user data
    const success = await fetchUser(data.access_token);
    if (!success) {
      throw new Error("Failed to fetch user data after login");
    }
  }, [fetchUser]);

  const register = useCallback(async (data: RegisterData): Promise<void> => {
    const res = await fetch(`${API_URL}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        first_name: data.firstName,
        last_name: data.lastName,
        role: data.role,
      }),
    });

    if (!res.ok) {
      const error = await parseApiError(res);
      throw new Error(error.message);
    }

    // Auto-login after successful registration
    await login(data.email, data.password);
  }, [login]);

  const logout = useCallback(() => {
    clearTokens();
  }, [clearTokens]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshAuth,
    getAccessToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Custom hook for protected routes
export function useRequireAuth(redirectTo: string = "/login") {
  const { user, isLoading, isAuthenticated } = useAuth();

  return {
    user,
    isLoading,
    isAuthenticated,
    shouldRedirect: !isLoading && !isAuthenticated,
    redirectTo,
  };
}

// Custom hook to redirect authenticated users away from auth pages
export function useRedirectIfAuthenticated(redirectTo: string = "/dashboard") {
  const { user, isLoading, isAuthenticated } = useAuth();

  return {
    user,
    isLoading,
    isAuthenticated,
    shouldRedirect: !isLoading && isAuthenticated,
    redirectTo,
  };
}
