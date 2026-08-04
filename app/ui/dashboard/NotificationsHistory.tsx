"use client";

import { useMemo, useState } from "react";
import { CheckCheck, Loader2, Trash2 } from "lucide-react";
import {
  notificationsResponseSchema,
  toAppNotification,
  type LaravelNotification,
  type NotificationsResponse,
  type NotificationType,
} from "@/lib/notifications";
import { NotificationList } from "@/app/ui/dashboard/NotificationList";
import ConfirmDialog from "@/app/ui/dashboard/ConfirmDialog";

type FilterKey = "all" | "unread" | NotificationType;

const filters: { key: FilterKey; label: string }[] = [
  { key: "all", label: "Tout" },
  { key: "unread", label: "Non lues" },
  { key: "ticket", label: "Tickets" },
  { key: "info", label: "Système" },
  { key: "contract", label: "Contrats" },
];

export default function NotificationsHistory({
  initialNotifications,
}: {
  initialNotifications: NotificationsResponse;
}) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [notifications, setNotifications] = useState<LaravelNotification[]>(initialNotifications.data);
  const [unreadCount, setUnreadCount] = useState(initialNotifications.total_non_lues);
  const [nextPage, setNextPage] = useState(
    initialNotifications.current_page < initialNotifications.last_page
      ? initialNotifications.current_page + 1
      : null,
  );
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  const visible = useMemo(() => notifications
    .map((notification) => toAppNotification(notification))
    .filter((notification) => {
      if (filter === "all") return true;
      if (filter === "unread") return !notification.read;
      return notification.type === filter;
    }), [filter, notifications]);

  async function changeFilter(nextFilter: FilterKey) {
    setFilter(nextFilter);
    const needsReload = nextFilter === "unread" || filter === "unread";
    if (!needsReload) return;

    setIsFiltering(true);
    try {
      const query = nextFilter === "unread" ? "?non_lues=true" : "";
      const response = await fetch(`/api/notifications${query}`);
      const parsed = notificationsResponseSchema.safeParse(await response.json().catch(() => null));
      if (!response.ok || !parsed.success) return;
      setNotifications(parsed.data.data);
      setUnreadCount(parsed.data.total_non_lues);
      setNextPage(parsed.data.current_page < parsed.data.last_page ? parsed.data.current_page + 1 : null);
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

  async function deleteOne(id: string) {
    const response = await fetch(`/api/notifications/${id}`, { method: "DELETE" });
    if (!response.ok) return;

    const deleted = notifications.find((notification) => notification.id === id);
    setNotifications((items) => items.filter((notification) => notification.id !== id));
    if (deleted && !deleted.read_at) setUnreadCount((count) => Math.max(0, count - 1));
  }

  async function deleteVisible() {
    setIsUpdating(true);
    try {
      const ids = visible.map((notification) => notification.id);
      const results = await Promise.all(
        ids.map(async (id) => ({
          id,
          ok: (await fetch(`/api/notifications/${id}`, { method: "DELETE" })).ok,
        })),
      );
      const deletedIds = new Set(results.filter((result) => result.ok).map((result) => result.id));
      const deletedUnread = notifications.filter(
        (notification) => deletedIds.has(notification.id) && !notification.read_at,
      ).length;
      setNotifications((items) => items.filter((notification) => !deletedIds.has(notification.id)));
      setUnreadCount((count) => Math.max(0, count - deletedUnread));
      setConfirmClearOpen(false);
    } finally {
      setIsUpdating(false);
    }
  }

  async function loadMore() {
    if (!nextPage || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const unreadQuery = filter === "unread" ? "&non_lues=true" : "";
      const response = await fetch(`/api/notifications?page=${nextPage}${unreadQuery}`);
      const parsed = notificationsResponseSchema.safeParse(await response.json().catch(() => null));
      if (!response.ok || !parsed.success) return;

      setNotifications((items) => [...items, ...parsed.data.data]);
      setUnreadCount(parsed.data.total_non_lues);
      setNextPage(parsed.data.current_page < parsed.data.last_page ? parsed.data.current_page + 1 : null);
    } finally {
      setIsLoadingMore(false);
    }
  }

  return (
    <div className="p-6 lg:p-8 w-full">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl lg:text-2xl font-bold text-on-surface">Notifications</h2>
          {unreadCount > 0 && (
            <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
              {unreadCount} nouvelles
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={markAllAsRead}
            disabled={isUpdating || unreadCount === 0}
            className="text-primary text-sm font-bold hover:underline flex items-center gap-1.5 disabled:opacity-40"
          >
            <CheckCheck size={17} />
            Tout marquer comme lu
          </button>
          <button
            onClick={() => setConfirmClearOpen(true)}
            disabled={visible.length === 0 || isUpdating}
            className="bg-primary/10 text-primary hover:bg-red-100 disabled:opacity-40 px-4 py-2 rounded-full font-bold text-xs flex items-center gap-1.5"
          >
            <Trash2 size={15} />
            Supprimer les affichées
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => changeFilter(key)}
            disabled={isFiltering}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${
              filter === key
                ? "bg-tertiary text-white"
                : "bg-white border border-outline-variant/40 text-on-surface-variant"
            }`}
          >
            {label}{key === "unread" ? ` (${unreadCount})` : ""}
          </button>
        ))}
      </div>

      <div className="bg-surface-container-low/60 rounded-xl overflow-hidden">
        <NotificationList notifications={visible} onRead={markAsRead} onDelete={deleteOne} />
      </div>

      {nextPage && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={loadMore}
            disabled={isLoadingMore}
            className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/50 bg-white px-5 py-2.5 text-sm font-bold"
          >
            {isLoadingMore && <Loader2 size={16} className="animate-spin" />}
            Afficher plus
          </button>
        </div>
      )}

      <ConfirmDialog
        open={confirmClearOpen}
        title="Supprimer les notifications affichées ?"
        description="Cette action supprimera définitivement les notifications correspondant au filtre actuel."
        confirmLabel="Supprimer"
        onConfirm={deleteVisible}
        onCancel={() => setConfirmClearOpen(false)}
      />
    </div>
  );
}
