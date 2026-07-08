"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, X, CheckCheck } from "lucide-react";
import { recentNotifications, type AppNotification } from "@/lib/notifications";
import { NotificationList } from "@/app/ui/dashboard/NotificationList";

export default function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState<AppNotification[]>(recentNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const visible = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-9 h-9 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors relative"
        aria-label="Notifications"
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-tertiary rounded-full" />
        )}
      </button>

      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-on-background/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-screen w-full max-w-[450px] bg-white shadow-2xl z-[70] flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Notifications"
      >
        {/* Header */}
        <div className="p-6 border-b border-outline-variant/20">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-on-surface">Notifications</h2>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
              aria-label="Fermer"
            >
              <X size={18} className="text-on-surface-variant" />
            </button>
          </div>
          <p className="text-sm text-on-surface-variant">
            Restez informé de l&apos;activité de vos tickets et solutions.
          </p>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 border-b border-outline-variant/10 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                filter === "all"
                  ? "bg-tertiary text-white"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              Tout
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                filter === "unread"
                  ? "bg-tertiary text-white"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              Non lues ({unreadCount})
            </button>
          </div>
          <button
            onClick={markAllAsRead}
            className="text-primary text-xs font-bold hover:underline flex items-center gap-1 shrink-0"
          >
            <CheckCheck size={16} />
            Tout marquer comme lu
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          <NotificationList notifications={visible} />
        </div>

        {/* Footer Action */}
        <div className="p-6 border-t border-outline-variant/20">
          <Link
            href="/dashboard/notifications"
            onClick={() => setOpen(false)}
            className="block w-full text-center py-3 border-2 border-outline-variant/50 text-on-surface font-bold text-sm rounded-lg hover:bg-surface-container transition-all"
          >
            Voir l&apos;historique complet
          </Link>
        </div>
      </div>
    </>
  );
}
