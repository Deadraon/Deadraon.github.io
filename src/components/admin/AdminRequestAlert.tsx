"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Sparkles, X, ArrowRight, Bell } from "lucide-react";

export function AdminRequestAlert() {
  const { user, isLoaded } = useUser();
  const [unreadCount, setUnreadCount] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only proceed if user is loaded and logged in
    if (!isLoaded || !user) return;

    // Check if the logged in user is the admin
    const isAdmin = user.primaryEmailAddress?.emailAddress === "deadraon@gmail.com";
    if (!isAdmin) return;

    // Check if we already dismissed it in this browser session
    const isDismissed = sessionStorage.getItem("admin_tool_alert_dismissed") === "true";
    if (isDismissed) return;

    // Fetch unread requests count
    const checkUnread = async () => {
      try {
        const res = await fetch("/api/admin/tool-requests/unread");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.count > 0) {
            setUnreadCount(data.count);
            setVisible(true);
          }
        }
      } catch (err) {
        console.error("Failed to fetch unread tool requests alert:", err);
      }
    };

    checkUnread();
  }, [isLoaded, user]);

  const handleDismiss = () => {
    sessionStorage.setItem("admin_tool_alert_dismissed", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up max-w-sm w-full px-4 sm:px-0">
      <div className="glass-dark border border-primary/30 rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,112,243,0.2)] shadow-black/80 relative overflow-hidden flex gap-4">
        {/* Pulsing red top notification glow */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#be38f3] to-transparent" />
        
        {/* Icon */}
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 relative">
          <Bell className="w-5 h-5 text-primary animate-bounce" />
          <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-500 border-2 border-background animate-pulse" />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          <div>
            <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
              Admin Alert
              <span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wide">
                Action Required
              </span>
            </h4>
            <p className="text-xs text-white/60 leading-relaxed mt-1">
              You have <strong className="text-white font-semibold">{unreadCount} unread tool request{unreadCount > 1 ? "s" : ""}</strong> from users.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/tool-requests"
              onClick={() => setVisible(false)}
              className="flex items-center gap-1 text-xs font-bold text-primary hover:text-white transition-colors"
            >
              View Requests
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={handleDismiss}
              className="text-xs font-medium text-white/30 hover:text-white/60 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="text-white/20 hover:text-white/50 transition-colors self-start"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
