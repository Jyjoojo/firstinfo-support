"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Bell, X, CheckCheck } from "lucide-react";
import {
  notificationsResponseSchema,
  toAppNotification,
  type NotificationsResponse,
} from "@/lib/notifications";
import { NotificationList } from "@/app/ui/dashboard/NotificationList";

type NotificationsBellProps = {
  initialNotifications: NotificationsResponse;
  historyHref: string;
};

export default function NotificationsBell({
  initialNotifications,
  historyHref,
}: NotificationsBellProps) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState(initialNotifications.data);
  const [unreadCount, setUnreadCount] = useState(initialNotifications.total_non_lues);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  const visible = useMemo(() => {
    const mapped = notifications.map((notification) => toAppNotification(notification));
    return filter === "unread"
      ? mapped.filter((notification) => !notification.read)
      : mapped;
  }, [filter, notifications]);

  async function changeFilter(nextFilter: "all" | "unread") {
    setFilter(nextFilter);
    setIsFiltering(true);
    try {
      const query = nextFilter === "unread" ? "?non_lues=true" : "";
      const response = await fetch(`/api/notifications${query}`);
      const parsed = notificationsResponseSchema.safeParse(await response.json().catch(() => null));
      if (!response.ok || !parsed.success) return;
      setNotifications(parsed.data.data);
      setUnreadCount(parsed.data.total_non_lues);
    } finally {
      setIsFiltering(false);
    }
  }

  async function markAsRead(id: string) {
    const notification = notifications.find((item) => item.id === id);
    if (!notification || notification.read_at) return;

    const response = await fetch(`/api/notifications/${id}/lire`, { method: "PATCH" });
    if (!response.ok) return;

    setNotifications((items) => items.map((item) => (
      item.id === id ? { ...item, read_at: new Date().toISOString() } : item
    )));
    setUnreadCount((count) => Math.max(0, count - 1));
  }

  async function markAllAsRead() {
    if (isUpdating || unreadCount === 0) return;
    setIsUpdating(true);

    try {
      const response = await fetch("/api/notifications/tout-lire", { method: "POST" });
      if (!response.ok) return;

      const readAt = new Date().toISOString();
      setNotifications((items) => items.map((item) => ({ ...item, read_at: item.read_at ?? readAt })));
      setUnreadCount(0);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-9 h-9 flex items-center justify-center cursor-pointer text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors relative"
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} non lues` : ""}`}
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-tertiary rounded-full" />
        )}
      </button>

      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-on-background/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        className={`fixed top-0 right-0 h-screen w-full max-w-[450px] bg-white shadow-2xl z-[70] flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Notifications"
      >
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

        <div className="px-6 py-4 border-b border-outline-variant/10 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => changeFilter("all")}
              disabled={isFiltering}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                filter === "all" ? "bg-tertiary text-white" : "bg-surface-container text-on-surface-variant"
              }`}
            >
              Tout
            </button>
            <button
              onClick={() => changeFilter("unread")}
              disabled={isFiltering}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                filter === "unread" ? "bg-tertiary text-white" : "bg-surface-container text-on-surface-variant"
              }`}
            >
              Non lues ({unreadCount})
            </button>
          </div>
          <button
            onClick={markAllAsRead}
            disabled={isUpdating || unreadCount === 0}
            className="text-primary text-xs font-bold hover:underline flex items-center gap-1 shrink-0 disabled:opacity-40"
          >
            <CheckCheck size={16} />
            Tout marquer comme lu
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <NotificationList notifications={visible} onRead={markAsRead} />
        </div>

        <div className="p-6 border-t border-outline-variant/20">
          <Link
            href={historyHref}
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
