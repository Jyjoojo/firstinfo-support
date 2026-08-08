import NotificationsHistory from "@/app/ui/dashboard/NotificationsHistory";
import { getNotificationCategories, getNotifications } from "@/lib/notifications-api";
import { createNotificationReferenceTime } from "@/lib/notifications";
import { getAuthenticatedUser } from "@/lib/auth";

export default async function NotificationsHistoryPage() {
  const [notifications, categories] = await Promise.all([
    getNotifications(),
    getNotificationCategories(),
  ]);
  const user = await getAuthenticatedUser();
  const role = user?.role.toLowerCase();
  const ticketBaseHref = role === "technicien"
    ? "/dashboard/technicien/tickets"
    : role === "admin" || role === "administrateur"
      ? "/dashboard/admin/tickets"
      : "/dashboard/client/tickets";
  return (
    <NotificationsHistory
      initialNotifications={notifications}
      initialReferenceTime={createNotificationReferenceTime()}
      ticketBaseHref={ticketBaseHref}
      categories={categories}
    />
  );
}
