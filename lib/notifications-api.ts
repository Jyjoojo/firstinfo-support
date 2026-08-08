import { api, ApiError } from "@/lib/api";
import {
  notificationsResponseSchema,
  notificationMessagesResponseSchema,
  notificationCategoriesResponseSchema,
  type NotificationCategory,
  type LaravelNotification,
  type NotificationsResponse,
} from "@/lib/notifications";

export async function getNotifications(
  options: { unreadOnly?: boolean; page?: number; category?: string } = {},
): Promise<NotificationsResponse> {
  const searchParams = new URLSearchParams();
  if (options.unreadOnly) searchParams.set("non_lues", "true");
  if (options.page) searchParams.set("page", String(options.page));
  if (options.category) searchParams.set("categorie", options.category);
  const query = searchParams.size > 0 ? `?${searchParams.toString()}` : "";

  const data = await api.get<unknown>(`/api/notifications${query}`);
  const parsed = notificationsResponseSchema.safeParse(data);

  if (!parsed.success) {
    throw new ApiError(502, "La réponse des notifications est invalide.", parsed.error.flatten());
  }

  return parsed.data;
}

export async function getNotificationCategories(): Promise<NotificationCategory[]> {
  const data = await api.get<unknown>("/api/notifications/categories");
  const parsed = notificationCategoriesResponseSchema.safeParse(data);

  if (!parsed.success) {
    throw new ApiError(502, "La réponse des catégories de notifications est invalide.", parsed.error.flatten());
  }

  return parsed.data.data;
}

export async function getNotificationMessages(): Promise<LaravelNotification[]> {
  const data = await api.get<unknown>("/api/notifications/messages");
  const parsed = notificationMessagesResponseSchema.safeParse(data);

  if (!parsed.success) {
    throw new ApiError(502, "La réponse des messages est invalide.", parsed.error.flatten());
  }

  return parsed.data.data;
}

export function emptyNotificationsResponse(): NotificationsResponse {
  return {
    data: [],
    links: { first: "", last: "", prev: null, next: null },
    meta: {
      current_page: 1,
      from: null,
      last_page: 1,
      links: [],
      path: "",
      per_page: 30,
      to: null,
      total: 0,
    },
    total_non_lues: 0,
  };
}
