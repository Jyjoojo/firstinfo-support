import { api, ApiError } from "@/lib/api";
import {
  notificationsResponseSchema,
  type NotificationsResponse,
} from "@/lib/notifications";

export async function getNotifications(
  options: { unreadOnly?: boolean; page?: number } = {},
): Promise<NotificationsResponse> {
  const searchParams = new URLSearchParams();
  if (options.unreadOnly) searchParams.set("non_lues", "true");
  if (options.page) searchParams.set("page", String(options.page));
  const query = searchParams.size > 0 ? `?${searchParams.toString()}` : "";

  const data = await api.get<unknown>(`/api/notifications${query}`);
  const parsed = notificationsResponseSchema.safeParse(data);

  if (!parsed.success) {
    throw new ApiError(502, "La réponse des notifications est invalide.", parsed.error.flatten());
  }

  return parsed.data;
}

export function emptyNotificationsResponse(): NotificationsResponse {
  return {
    current_page: 1,
    data: [],
    last_page: 1,
    next_page_url: null,
    per_page: 30,
    total: 0,
    total_non_lues: 0,
  };
}
