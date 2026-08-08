import { z } from "zod";

export type NotificationType = "ticket" | "info" | "contract";
export type NotificationPeriod = "Aujourd'hui" | "Hier" | "Cette semaine" | "Plus ancien";

export const laravelNotificationSchema = z.object({
  id: z.string().min(1),
  type: z.string(),
  data: z.object({
    message: z.string().optional().default("Nouvelle notification"),
    type: z.string().optional().default("info"),
    ticket_id: z.union([z.string(), z.number()]).nullish(),
  }).passthrough(),
  read_at: z.string().nullable().optional().default(null),
  created_at: z.string(),
  updated_at: z.string().optional(),
}).passthrough();

export const notificationsResponseSchema = z.object({
  current_page: z.coerce.number().int().positive(),
  data: z.array(laravelNotificationSchema),
  last_page: z.coerce.number().int().positive(),
  next_page_url: z.string().nullable(),
  per_page: z.coerce.number().int().positive(),
  total: z.coerce.number().int().nonnegative(),
  total_non_lues: z.coerce.number().int().nonnegative(),
}).passthrough();

export type LaravelNotification = z.infer<typeof laravelNotificationSchema>;
export type NotificationsResponse = z.infer<typeof notificationsResponseSchema>;

export function createNotificationReferenceTime() {
  return new Date().toISOString();
}

export interface AppNotification {
  id: string;
  type: NotificationType;
  sourceType: string;
  title: string;
  description: string;
  time: string;
  day: NotificationPeriod;
  read: boolean;
  ticketId?: string;
}

export const notificationTypeStyles: Record<
  NotificationType,
  { bg: string; text: string; iconName: "ticket" | "info" | "history" }
> = {
  ticket: { bg: "bg-orange-50", text: "text-orange-700", iconName: "ticket" },
  info: { bg: "bg-blue-50", text: "text-blue-700", iconName: "info" },
  contract: { bg: "bg-green-50", text: "text-green-700", iconName: "history" },
};

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getPeriod(createdAt: Date, now: Date): NotificationPeriod {
  const days = Math.floor(
    (startOfDay(now).getTime() - startOfDay(createdAt).getTime()) / DAY_IN_MS,
  );

  if (days <= 0) return "Aujourd'hui";
  if (days === 1) return "Hier";
  if (days < 7) return "Cette semaine";
  return "Plus ancien";
}

function getRelativeTime(createdAt: Date, now: Date) {
  const seconds = Math.round((createdAt.getTime() - now.getTime()) / 1000);
  const formatter = new Intl.RelativeTimeFormat("fr", { numeric: "auto" });

  if (Math.abs(seconds) < 60) return formatter.format(seconds, "second");
  const minutes = Math.round(seconds / 60);
  if (Math.abs(minutes) < 60) return formatter.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return formatter.format(hours, "hour");
  const days = Math.round(hours / 24);
  if (Math.abs(days) < 7) return formatter.format(days, "day");

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: createdAt.getFullYear() === now.getFullYear() ? undefined : "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(createdAt);
}

function getVisualType(sourceType: string): NotificationType {
  const type = sourceType.toLowerCase();
  if (type.includes("contrat") || type.includes("contract")) return "contract";
  if (
    type.includes("ticket")
    || type.includes("statut")
    || type.includes("assign")
    || type.includes("message")
    || type.includes("resolu")
  ) return "ticket";
  return "info";
}

function getTitle(sourceType: string, visualType: NotificationType) {
  const labels: Record<string, string> = {
    statut_change: "Statut du ticket mis à jour",
    ticket_assigne: "Ticket assigné",
    nouveau_message: "Nouveau message",
    ticket_resolu: "Ticket résolu",
    contrat_expiration: "Échéance de contrat",
  };

  return labels[sourceType]
    ?? (visualType === "ticket"
      ? "Mise à jour d'un ticket"
      : visualType === "contract"
        ? "Information sur votre contrat"
        : "Information");
}

export function toAppNotification(
  notification: LaravelNotification,
  now = new Date(),
): AppNotification {
  const createdAt = new Date(notification.created_at);
  const visualType = getVisualType(notification.data.type);

  return {
    id: notification.id,
    type: visualType,
    sourceType: notification.data.type,
    title: getTitle(notification.data.type, visualType),
    description: notification.data.message,
    time: getRelativeTime(createdAt, now),
    day: getPeriod(createdAt, now),
    read: notification.read_at !== null,
    ticketId: notification.data.ticket_id == null
      ? undefined
      : String(notification.data.ticket_id),
  };
}

export const DAY_ORDER: NotificationPeriod[] = [
  "Aujourd'hui",
  "Hier",
  "Cette semaine",
  "Plus ancien",
];

export function groupByDay(notifications: AppNotification[]) {
  return DAY_ORDER.map((day) => ({
    day,
    items: notifications.filter((notification) => notification.day === day),
  })).filter((group) => group.items.length > 0);
}
