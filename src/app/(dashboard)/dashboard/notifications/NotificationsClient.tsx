"use client";

import { useState } from "react";
import { CheckCircle, Info, AlertTriangle, CheckCheck } from "lucide-react";
import { formatRelativeDate } from "@/lib/utils";
import { markNotificationAsRead, markAllNotificationsAsRead } from "./actions";
import { toast } from "sonner";

export default function NotificationsClient({ initialNotifications }: { initialNotifications: any[] }) {
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    try {
      await markNotificationAsRead(id);
    } catch (e) {
      toast.error("Failed to update notification");
    }
  };

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await markAllNotificationsAsRead();
      toast.success("All caught up!");
    } catch (e) {
      toast.error("Failed to update notifications");
    }
  };

  if (notifications.length === 0) {
    return (
      <div className="text-center p-12 border border-dashed rounded-2xl">
        <p className="text-muted-foreground">You have no notifications yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {unreadCount > 0 && (
        <div className="flex justify-end">
          <button 
            onClick={handleMarkAllAsRead}
            className="text-sm flex items-center gap-2 text-primary hover:underline bg-primary/10 px-4 py-2 rounded-lg transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </button>
        </div>
      )}

      <div className="space-y-3">
        {notifications.map((notification) => (
          <div 
            key={notification._id}
            onClick={() => !notification.read && handleMarkAsRead(notification._id)}
            className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer flex gap-4 ${
              notification.read 
                ? "bg-card border-border opacity-70" 
                : "bg-primary/5 border-primary/20 shadow-sm"
            }`}
          >
            <div className="mt-1">
              {notification.type === "success" && <CheckCircle className="w-5 h-5 text-green-500" />}
              {notification.type === "warning" && <AlertTriangle className="w-5 h-5 text-orange-500" />}
              {notification.type === "info" && <Info className="w-5 h-5 text-blue-500" />}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start gap-2 mb-1">
                <h3 className={`font-medium ${!notification.read && "text-primary"}`}>
                  {notification.title}
                </h3>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatRelativeDate(new Date(notification.createdAt))}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{notification.message}</p>
            </div>
            {!notification.read && (
              <div className="flex items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
