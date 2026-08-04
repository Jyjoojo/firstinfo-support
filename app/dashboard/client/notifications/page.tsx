import NotificationsHistory from "@/app/ui/dashboard/NotificationsHistory";
import { getNotifications } from "@/lib/notifications-api";

export default async function NotificationsHistoryPage() {
  const notifications = await getNotifications();
  return <NotificationsHistory initialNotifications={notifications} />;
}
