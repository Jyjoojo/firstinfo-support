"use client";

import { Ticket, Info, History, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  type AppNotification,
  notificationTypeStyles,
  groupByDay,
} from "@/lib/notifications";

const icons = { ticket: Ticket, info: Info, history: History };

interface NotificationItemProps {
  notification: AppNotification;
  onDelete?: (id: string) => void;
  onRead?: (id: string) => void | Promise<void>;
  ticketBaseHref?: string;
}

export function NotificationItem({
  notification,
  onDelete,
  onRead,
  ticketBaseHref,
}: NotificationItemProps) {
  const router = useRouter();
  const style = notificationTypeStyles[notification.type];
  const Icon = icons[style.iconName];

  async function openNotification() {
    if (!notification.read) await onRead?.(notification.id);
    if (notification.ticketId && ticketBaseHref) {
      router.push(`${ticketBaseHref}/${notification.ticketId}`);
    }
  }

  return (
    <div className="group flex gap-4 p-3 bg-on-tertiary rounded-xl hover:bg-secondary-fixed-dim transition-colors">
      <div className={`w-10 h-10 rounded-lg ${style.bg} flex items-center justify-center shrink-0`}>
        <Icon size={19} className={style.text} />
      </div>
      <button
        type="button"
        onClick={openNotification}
        className="flex-1 min-w-0 cursor-pointer text-left"
      >
        <div className="flex justify-between items-start gap-2">
          <p className="text-sm font-bold text-on-surface leading-tight">{notification.title}</p>
          {!notification.read && (
            <span className="w-2 h-2 bg-tertiary rounded-full mt-1 shrink-0" />
          )}
        </div>
        <p className="text-xs text-on-surface-variant mt-1">{notification.description}</p>
        <p className="text-[10px] text-on-surface-variant mt-2">{notification.time}</p>
      </button>
      {onDelete && (
        <button
          onClick={() => onDelete(notification.id)}
          aria-label="Supprimer la notification"
          className="shrink-0 self-start w-8 h-8 flex items-center justify-center rounded-full text-on-surface-variant/50 opacity-60 hover:opacity-100 hover:bg-red-50 hover:text-red-600 lg:opacity-0 lg:group-hover:opacity-100 transition-all"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
}

interface NotificationListProps {
  notifications: AppNotification[];
  onDelete?: (id: string) => void;
  onRead?: (id: string) => void | Promise<void>;
  ticketBaseHref?: string;
}

export function NotificationList({
  notifications,
  onDelete,
  onRead,
  ticketBaseHref,
}: NotificationListProps) {
  const groups = groupByDay(notifications);

  if (groups.length === 0) {
    return (
      <p className="text-sm text-on-surface-variant text-center py-16">
        Aucune notification à afficher.
      </p>
    );
  }

  return (
    <>
      {groups.map((group) => (
        <div key={group.day} className="px-6 py-5 border-b border-outline-variant/10 last:border-0">
          <h3 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-4">
            {group.day}
          </h3>
          <div className="space-y-2">
            {group.items.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onDelete={onDelete}
                onRead={onRead}
                ticketBaseHref={ticketBaseHref}
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
