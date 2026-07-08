"use client";

import { useState } from "react";
import { CheckCheck, Trash2 } from "lucide-react";
import { allNotifications, type AppNotification, type NotificationType } from "@/lib/notifications";
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

export default function NotificationsHistoryPage() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [notifications, setNotifications] = useState<AppNotification[]>(allNotifications);
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const visible = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.read;
    return n.type === filter;
  });

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteOne = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
    setConfirmClearOpen(false);
  };

  return (
    <div className="p-6 lg:p-8 w-full">
      {/* Header */}
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
            className="text-primary text-sm font-bold hover:underline flex items-center gap-1.5"
          >
            <CheckCheck size={17} />
            Tout marquer comme lu
          </button>
          <button
            onClick={() => setConfirmClearOpen(true)}
            disabled={notifications.length === 0}
            className="bg-primary/10 text-primary hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2 rounded-full font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <Trash2 size={15} />
            Tout vider
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${
              filter === key
                ? "bg-tertiary text-white"
                : "bg-white border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container-low"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-surface-container-low/60 rounded-xl overflow-hidden">
        <NotificationList notifications={visible} onDelete={deleteOne} />
      </div>

      <ConfirmDialog
        open={confirmClearOpen}
        title="Vider toutes les notifications ?"
        description="Cette action supprimera définitivement toutes vos notifications. Vous ne pourrez pas les récupérer."
        confirmLabel="Tout supprimer"
        onConfirm={clearAll}
        onCancel={() => setConfirmClearOpen(false)}
      />
    </div>
  );
}
