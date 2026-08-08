import { z } from "zod";

export type NotificationType = "ticket" | "info" | "contract";
export type NotificationPeriod = "Aujourd'hui" | "Hier" | "Cette semaine" | "Plus ancien";

const notificationActionSchema = z.object({
  type: z.literal("ouvrir_ticket"),
  ticket_id: z.string().min(1),
});

export const laravelNotificationSchema = z.object({
  id: z.string().min(1),
  type: z.string(),
  categorie: z.string().min(1),
  titre: z.string(),
  contenu: z.string(),
  lu: z.boolean(),
  lu_le: z.string().nullable(),
  cree_le: z.string(),
  ticket_id: z.string().nullable(),
  ticket_reference: z.string().nullable(),
  ticket_titre: z.string().nullable(),
  action: notificationActionSchema.nullable(),
  donnees: z.record(z.string(), z.unknown()),
}).passthrough();

const paginationLinkSchema = z.object({
  url: z.string().nullable(),
  label: z.string(),
  page: z.coerce.number().int().positive().nullable().optional(),
  active: z.boolean(),
});

export const notificationsResponseSchema = z.object({
  data: z.array(laravelNotificationSchema),
  links: z.object({
    first: z.string(),
    last: z.string(),
    prev: z.string().nullable(),
    next: z.string().nullable(),
  }),
  meta: z.object({
    current_page: z.coerce.number().int().positive(),
    from: z.coerce.number().int().positive().nullable(),
    last_page: z.coerce.number().int().positive(),
    links: z.array(paginationLinkSchema),
    path: z.string(),
    per_page: z.coerce.number().int().positive(),
    to: z.coerce.number().int().positive().nullable(),
    total: z.coerce.number().int().nonnegative(),
  }),
  total_non_lues: z.coerce.number().int().nonnegative(),
}).passthrough();

export const notificationMessagesResponseSchema = z.object({
  data: z.array(laravelNotificationSchema),
}).passthrough();

export const notificationCategorySchema = z.object({
  valeur: z.string().min(1),
  libelle: z.string().min(1),
});

export const notificationCategoriesResponseSchema = z.object({
  data: z.array(notificationCategorySchema),
}).passthrough();

export type LaravelNotification = z.infer<typeof laravelNotificationSchema>;
export type NotificationsResponse = z.infer<typeof notificationsResponseSchema>;
export type NotificationMessagesResponse = z.infer<typeof notificationMessagesResponseSchema>;
export type NotificationCategory = z.infer<typeof notificationCategorySchema>;

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
  ticketReference?: string;
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

function getVisualType(category: string): NotificationType {
  const normalizedCategory = category.toLowerCase();
  if (normalizedCategory === "ticket") return "ticket";
  if (normalizedCategory === "contrat" || normalizedCategory === "contract") return "contract";
  return "info";
}

export function toAppNotification(
  notification: LaravelNotification,
  now = new Date(),
): AppNotification {
  const createdAt = new Date(notification.cree_le);
  return {
    id: notification.id,
    type: getVisualType(notification.categorie),
    sourceType: notification.type,
    title: notification.titre,
    description: notification.contenu,
    time: getRelativeTime(createdAt, now),
    day: getPeriod(createdAt, now),
    read: notification.lu,
    ticketId: notification.action?.ticket_id ?? notification.ticket_id ?? undefined,
    ticketReference: notification.ticket_reference ?? undefined,
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
