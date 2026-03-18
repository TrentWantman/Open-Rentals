"use client";

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";

// Notification types
export type NotificationType = "message" | "application" | "property" | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  link?: string;
  metadata?: {
    propertyId?: string;
    propertyName?: string;
    applicationId?: string;
    senderId?: string;
    senderName?: string;
    senderAvatar?: string;
  };
}

export interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

// Mock notification data for demonstration
const generateMockNotifications = (): Notification[] => {
  const now = new Date();

  return [
    {
      id: "1",
      type: "message",
      title: "New Message",
      message: "Sarah Johnson sent you a message about Brickell Heights Unit 2301",
      timestamp: new Date(now.getTime() - 5 * 60 * 1000), // 5 minutes ago
      isRead: false,
      link: "/dashboard/messages",
      metadata: {
        senderName: "Sarah Johnson",
        propertyName: "Brickell Heights Unit 2301",
      },
    },
    {
      id: "2",
      type: "application",
      title: "Application Update",
      message: "Your application for Ocean View Apartment has been approved!",
      timestamp: new Date(now.getTime() - 30 * 60 * 1000), // 30 minutes ago
      isRead: false,
      link: "/dashboard/applications",
      metadata: {
        propertyName: "Ocean View Apartment",
        applicationId: "app-123",
      },
    },
    {
      id: "3",
      type: "property",
      title: "Price Drop Alert",
      message: "Riverside Villa price has been reduced",
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      isRead: false,
      link: "/listings/coral-gables-villa",
      metadata: {
        propertyId: "prop-456",
        propertyName: "Riverside Villa",
      },
    },
    {
      id: "4",
      type: "message",
      title: "New Message",
      message: "Michael Chen replied to your inquiry about Midtown Loft",
      timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
      isRead: true,
      link: "/dashboard/messages",
      metadata: {
        senderName: "Michael Chen",
        propertyName: "Midtown Loft",
      },
    },
    {
      id: "5",
      type: "property",
      title: "New Listing Match",
      message: "A new property matching your saved search criteria is available",
      timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000), // 8 hours ago
      isRead: true,
      link: "/listings",
      metadata: {
        propertyName: "Downtown Condo",
      },
    },
    {
      id: "6",
      type: "application",
      title: "Document Required",
      message: "Please upload proof of income for your application to Uptown Tower",
      timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
      isRead: true,
      link: "/dashboard/applications",
      metadata: {
        propertyName: "Uptown Tower",
        applicationId: "app-789",
      },
    },
    {
      id: "7",
      type: "system",
      title: "Profile Incomplete",
      message: "Complete your profile to improve your application success rate",
      timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      isRead: true,
      link: "/dashboard/profile",
    },
    {
      id: "8",
      type: "property",
      title: "Viewing Reminder",
      message: "You have a scheduled viewing tomorrow at Coconut Grove Studio",
      timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      isRead: true,
      link: "/dashboard/viewings",
      metadata: {
        propertyName: "Coconut Grove Studio",
        propertyId: "prop-101",
      },
    },
  ];
};

const STORAGE_KEY = "notifications_state";

// Helper to safely access localStorage
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

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize notifications from storage or use mock data
  useEffect(() => {
    const stored = getStorageItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        const restored = parsed.map((n: Notification) => ({
          ...n,
          timestamp: new Date(n.timestamp),
        }));
        setNotifications(restored);
      } catch {
        setNotifications(generateMockNotifications());
      }
    } else {
      setNotifications(generateMockNotifications());
    }
    setIsInitialized(true);
  }, []);

  // Persist to storage when notifications change
  useEffect(() => {
    if (isInitialized) {
      setStorageItem(STORAGE_KEY, JSON.stringify(notifications));
    }
  }, [notifications, isInitialized]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const contextValue: NotificationsContextType = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  };

  return (
    <NotificationsContext.Provider value={contextValue}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications(): NotificationsContextType {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationsProvider");
  }
  return context;
}

// Helper function to format relative time
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// Helper to get notification icon color based on type
export function getNotificationTypeColor(type: NotificationType): string {
  switch (type) {
    case "message":
      return "text-sky-500 bg-sky-50";
    case "application":
      return "text-emerald-500 bg-emerald-50";
    case "property":
      return "text-amber-500 bg-amber-50";
    case "system":
      return "text-gray-500 bg-gray-50";
    default:
      return "text-gray-500 bg-gray-50";
  }
}
