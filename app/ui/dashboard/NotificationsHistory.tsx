"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCheck, Loader2, Trash2 } from "lucide-react";
import {
  notificationsResponseSchema,
  toAppNotification,
  type LaravelNotification,
  type NotificationCategory,
  type NotificationsResponse,
} from "@/lib/notifications";
import { NotificationList } from "@/app/ui/dashboard/NotificationList";
import ConfirmDialog from "@/app/ui/dashboard/ConfirmDialog";

export default function NotificationsHistory({
  initialNotifications,
  initialReferenceTime,
  ticketBaseHref,
  categories,
}: {
  initialNotifications: NotificationsResponse;
  initialReferenceTime: string;
  ticketBaseHref: string;
  categories: NotificationCategory[];
}) {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [notifications, setNotifications] = useState<LaravelNotification[]>(initialNotifications.data);
  const [unreadCount, setUnreadCount] = useState(initialNotifications.total_non_lues);
  const [nextPage, setNextPage] = useState(
    initialNotifications.meta.current_page < initialNotifications.meta.last_page
      ? initialNotifications.meta.current_page + 1
      : null,
  );
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [referenceTime, setReferenceTime] = useState(initialReferenceTime);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setReferenceTime(new Date().toISOString());
    }, 30_000);
    return () => window.clearInterval(interval);
  }, []);

  const visible = useMemo(() => notifications
    .map((notification) => toAppNotification(notification, new Date(referenceTime))), [notifications, referenceTime]);

  async function changeFilters(nextCategory: string, nextUnreadOnly: boolean) {
    setCategoryFilter(nextCategory);
    setUnreadOnly(nextUnreadOnly);
    setIsFiltering(true);
    try {
      const searchParams = new URLSearchParams();
      if (nextCategory !== "all") searchParams.set("categorie", nextCategory);
      if (nextUnreadOnly) searchParams.set("non_lues", "true");
      const query = searchParams.size ? `?${searchParams.toString()}` : "";
      const response = await fetch(`/api/notifications${query}`);
      const parsed = notificationsResponseSchema.safeParse(await response.json().catch(() => null));
      if (!response.ok || !parsed.success) return;
      setNotifications(parsed.data.data);
      setUnreadCount(parsed.data.total_non_lues);
      setNextPage(parsed.data.meta.current_page < parsed.data.meta.last_page
        ? parsed.data.meta.current_page + 1
        : null);
    } finally {
      setIsFiltering(false);
    }
  }

  async function markAsRead(id: string) {
    const notification = notifications.find((item) => item.id === id);
    if (!notification || notification.lu) return;

    const response = await fetch(`/api/notifications/${id}/lire`, { method: "PATCH" });
    if (!response.ok) return;

    setNotifications((items) => items.map((item) => (
      item.id === id ? { ...item, lu: true, lu_le: new Date().toISOString() } : item
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
      setNotifications((items) => items.map((item) => ({
        ...item,
        lu: true,
        lu_le: item.lu_le ?? readAt,
      })));
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
    if (deleted && !deleted.lu) setUnreadCount((count) => Math.max(0, count - 1));
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
        (notification) => deletedIds.has(notification.id) && !notification.lu,
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
      const searchParams = new URLSearchParams({ page: String(nextPage) });
      if (categoryFilter !== "all") searchParams.set("categorie", categoryFilter);
      if (unreadOnly) searchParams.set("non_lues", "true");
      const response = await fetch(`/api/notifications?${searchParams.toString()}`);
      const parsed = notificationsResponseSchema.safeParse(await response.json().catch(() => null));
      if (!response.ok || !parsed.success) return;

      setNotifications((items) => [...items, ...parsed.data.data]);
      setUnreadCount(parsed.data.total_non_lues);
      setNextPage(parsed.data.meta.current_page < parsed.data.meta.last_page
        ? parsed.data.meta.current_page + 1
        : null);
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

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <button
          onClick={() => changeFilters(categoryFilter, !unreadOnly)}
          disabled={isFiltering}
          className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${
            unreadOnly
              ? "bg-primary text-white"
              : "bg-white border border-outline-variant/40 text-on-surface-variant"
          }`}
        >
          Non lues ({unreadCount})
        </button>
        <span className="mx-1 h-6 w-px bg-outline-variant/30" aria-hidden="true" />
        <button
          onClick={() => changeFilters("all", unreadOnly)}
          disabled={isFiltering}
          className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${
            categoryFilter === "all"
              ? "bg-tertiary text-white"
              : "bg-white border border-outline-variant/40 text-on-surface-variant"
          }`}
        >
          Toutes les catégories
        </button>
        {categories.map(({ valeur, libelle }) => (
          <button
            key={valeur}
            onClick={() => changeFilters(valeur, unreadOnly)}
            disabled={isFiltering}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${
              categoryFilter === valeur
                ? "bg-tertiary text-white"
                : "bg-white border border-outline-variant/40 text-on-surface-variant"
            }`}
          >
            {libelle}
          </button>
        ))}
      </div>

      <div className="bg-surface-container-low/60 rounded-xl overflow-hidden">
        <NotificationList
          notifications={visible}
          onRead={markAsRead}
          onDelete={deleteOne}
          ticketBaseHref={ticketBaseHref}
        />
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
