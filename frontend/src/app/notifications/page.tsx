"use client";

import { useState, useMemo } from "react";
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
  Trash2,
  X,
  Filter,
  ArrowLeft,
} from "lucide-react";

// Icon mapping for notification types
const notificationIcons: Record<NotificationType, typeof MessageSquare> = {
  message: MessageSquare,
  application: FileText,
  property: Home,
  system: Settings,
};

const notificationTypeLabels: Record<NotificationType, string> = {
  message: "Messages",
  application: "Applications",
  property: "Properties",
  system: "System",
};

type FilterType = "all" | NotificationType;

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll } =
    useNotifications();
  const [filter, setFilter] = useState<FilterType>("all");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const filteredNotifications = useMemo(() => {
    let result = notifications;

    if (filter !== "all") {
      result = result.filter((n) => n.type === filter);
    }

    if (showUnreadOnly) {
      result = result.filter((n) => !n.isRead);
    }

    return result;
  }, [notifications, filter, showUnreadOnly]);

  const filterOptions: { value: FilterType; label: string }[] = [
    { value: "all", label: "All" },
    { value: "message", label: "Messages" },
    { value: "application", label: "Applications" },
    { value: "property", label: "Properties" },
    { value: "system", label: "System" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="container max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-500 mt-1">
                {unreadCount > 0
                  ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
                  : "All caught up!"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-sky-600 border-sky-200 hover:bg-sky-50 hover:border-sky-300"
                  onClick={markAllAsRead}
                >
                  <CheckCheck className="h-4 w-4 mr-1.5" />
                  Mark all read
                </Button>
              )}
              {notifications.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                  onClick={clearAll}
                >
                  <Trash2 className="h-4 w-4 mr-1.5" />
                  Clear all
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filter:</span>
              <div className="flex flex-wrap gap-1">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFilter(option.value)}
                    className={cn(
                      "px-3 py-1 text-sm rounded-full transition-colors",
                      filter === option.value
                        ? "bg-sky-100 text-sky-700 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Unread Toggle */}
            <div className="flex items-center gap-2 sm:ml-auto">
              <button
                onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-colors",
                  showUnreadOnly
                    ? "bg-sky-100 text-sky-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <div
                  className={cn(
                    "w-4 h-4 rounded border-2 flex items-center justify-center transition-colors",
                    showUnreadOnly ? "bg-sky-500 border-sky-500" : "border-gray-300"
                  )}
                >
                  {showUnreadOnly && <Check className="h-3 w-3 text-white" />}
                </div>
                Unread only
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-xl shadow-sm overflow-hidden">
          {filteredNotifications.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {filteredNotifications.map((notification) => {
                const Icon = notificationIcons[notification.type];
                const colorClass = getNotificationTypeColor(notification.type);

                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "group relative flex gap-4 px-4 sm:px-6 py-4 transition-colors hover:bg-gray-50/80",
                      !notification.isRead && "bg-sky-50/40"
                    )}
                  >
                    {/* Unread indicator */}
                    {!notification.isRead && (
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-sky-500" />
                    )}

                    {/* Icon */}
                    <div
                      className={cn(
                        "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center",
                        colorClass
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          {notification.link ? (
                            <Link
                              href={notification.link}
                              onClick={() => markAsRead(notification.id)}
                              className="block"
                            >
                              <p
                                className={cn(
                                  "text-sm sm:text-base leading-snug",
                                  !notification.isRead ? "text-gray-900 font-semibold" : "text-gray-800 font-medium"
                                )}
                              >
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                            </Link>
                          ) : (
                            <>
                              <p
                                className={cn(
                                  "text-sm sm:text-base leading-snug",
                                  !notification.isRead ? "text-gray-900 font-semibold" : "text-gray-800 font-medium"
                                )}
                              >
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                            </>
                          )}

                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs text-gray-400">
                              {formatRelativeTime(notification.timestamp)}
                            </span>
                            <span
                              className={cn(
                                "px-2 py-0.5 text-xs rounded-full",
                                colorClass
                              )}
                            >
                              {notificationTypeLabels[notification.type]}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex-shrink-0 flex items-center gap-1 opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-400 hover:text-sky-600 hover:bg-sky-50"
                              onClick={() => markAsRead(notification.id)}
                              title="Mark as read"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                            onClick={() => deleteNotification(notification.id)}
                            title="Delete notification"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Actions */}
                    <div className="flex-shrink-0 flex items-center gap-1 sm:hidden">
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-sky-600 hover:bg-sky-50"
                          onClick={() => markAsRead(notification.id)}
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => deleteNotification(notification.id)}
                        title="Delete notification"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-100 to-emerald-100 flex items-center justify-center mb-4">
                <Bell className="h-8 w-8 text-sky-500" />
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {notifications.length === 0
                  ? "No notifications yet"
                  : "No notifications match your filters"}
              </p>
              <p className="text-sm text-gray-500 mt-1 text-center max-w-sm">
                {notifications.length === 0
                  ? "When you receive messages, application updates, or property alerts, they will appear here."
                  : "Try adjusting your filters to see more notifications."}
              </p>
              {notifications.length > 0 && filter !== "all" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    setFilter("all");
                    setShowUnreadOnly(false);
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        {notifications.length > 0 && (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {(["message", "application", "property", "system"] as NotificationType[]).map((type) => {
              const count = notifications.filter((n) => n.type === type).length;
              const unread = notifications.filter((n) => n.type === type && !n.isRead).length;
              const Icon = notificationIcons[type];
              const colorClass = getNotificationTypeColor(type);

              return (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={cn(
                    "bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-xl p-4 text-left transition-all hover:shadow-md hover:border-sky-200",
                    filter === type && "ring-2 ring-sky-400 border-transparent"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colorClass)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 capitalize">{notificationTypeLabels[type]}</p>
                      <div className="flex items-baseline gap-1">
                        <p className="text-lg font-bold text-gray-900">{count}</p>
                        {unread > 0 && (
                          <span className="text-xs text-sky-600 font-medium">({unread} new)</span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
