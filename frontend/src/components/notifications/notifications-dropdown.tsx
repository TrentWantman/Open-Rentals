"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  useNotifications,
  formatRelativeTime,
  getNotificationTypeColor,
  NotificationType,
} from "@/lib/notifications";
import {
  Bell,
  MessageSquare,
  FileText,
  Home,
  Settings,
  Check,
  CheckCheck,
  X,
  ChevronRight,
} from "lucide-react";

// Icon mapping for notification types
const notificationIcons: Record<NotificationType, typeof MessageSquare> = {
  message: MessageSquare,
  application: FileText,
  property: Home,
  system: Settings,
};

export function NotificationsDropdown() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } =
    useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
  };

  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <Button
        variant="ghost"
        size="icon"
        className="relative text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        {unreadCount > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] font-bold text-white bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full shadow-sm"
            aria-hidden="true"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
        {unreadCount > 0 && <span className="sr-only">You have {unreadCount} unread notifications</span>}
      </Button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-[380px] max-w-[calc(100vw-2rem)] origin-top-right z-[100]"
          role="menu"
          aria-label="Notifications"
        >
          <div className="bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-medium text-sky-600 bg-sky-50 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-sky-600 hover:text-sky-700 hover:bg-sky-50 h-7 px-2"
                  onClick={markAllAsRead}
                >
                  <CheckCheck className="h-3.5 w-3.5 mr-1" />
                  Mark all read
                </Button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-[400px] overflow-y-auto">
              {recentNotifications.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {recentNotifications.map((notification) => {
                    const Icon = notificationIcons[notification.type];
                    const colorClass = getNotificationTypeColor(notification.type);

                    return (
                      <div
                        key={notification.id}
                        className={cn(
                          "group relative flex gap-3 px-4 py-3 transition-colors hover:bg-gray-50/80",
                          !notification.isRead && "bg-sky-50/30"
                        )}
                      >
                        {/* Unread indicator */}
                        {!notification.isRead && (
                          <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-sky-500" />
                        )}

                        {/* Icon */}
                        <div
                          className={cn(
                            "flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center",
                            colorClass
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          {notification.link ? (
                            <Link
                              href={notification.link}
                              onClick={() => {
                                handleNotificationClick(notification.id);
                                setIsOpen(false);
                              }}
                              className="block"
                            >
                              <p
                                className={cn(
                                  "text-sm leading-snug",
                                  !notification.isRead ? "text-gray-900 font-medium" : "text-gray-700"
                                )}
                              >
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-[11px] text-gray-400 mt-1">
                                {formatRelativeTime(notification.timestamp)}
                              </p>
                            </Link>
                          ) : (
                            <>
                              <p
                                className={cn(
                                  "text-sm leading-snug",
                                  !notification.isRead ? "text-gray-900 font-medium" : "text-gray-700"
                                )}
                              >
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-[11px] text-gray-400 mt-1">
                                {formatRelativeTime(notification.timestamp)}
                              </p>
                            </>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex-shrink-0 flex items-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-gray-400 hover:text-sky-600 hover:bg-sky-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              title="Mark as read"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-gray-400 hover:text-red-600 hover:bg-red-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            title="Delete notification"
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <Bell className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">All caught up!</p>
                  <p className="text-xs text-gray-500 mt-1">No new notifications</p>
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="border-t border-gray-100 px-4 py-2">
                <Link
                  href="/notifications"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-1 py-2 text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors rounded-lg hover:bg-sky-50"
                >
                  View all notifications
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
