import { Search } from "lucide-react";
import NotificationsBell from "./NotificationBell";
import MailBox from "./MailBox";
import { getAuthenticatedUser } from "@/lib/auth";

function getInitials(firstName?: string, lastName?: string) {
  const firstInitial = firstName?.trim().charAt(0) ?? "";
  const lastInitial = lastName?.trim().charAt(0) ?? "";

  return `${firstInitial}${lastInitial}`.toUpperCase() || "?";
}

export default async function TopBar() {
  const user = await getAuthenticatedUser();
  const fullName = [user?.prenom, user?.nom].filter(Boolean).join(" ") || "Utilisateur";
  const role = user?.role.toLowerCase();
  const subtitle = role === "client"
    ? user?.client?.entreprise || "Client"
    : role === "technicien"
      ? "Technicien"
      : role === "admin" || role === "administrateur"
        ? "Admin entreprise"
        : "Compte utilisateur";
  const initials = getInitials(user?.prenom, user?.nom);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-outline-variant/20 px-6 py-3.5 flex items-center justify-between">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
          />
          <input
            type="text"
            placeholder="Rechercher ..."
            className="w-75 bg-surface-container-low border border-outline-variant/30 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          />
        </div>
      </div>
      <div className="flex items-center gap-3 ml-8">
        <MailBox />
        <NotificationsBell />
        <div className="h-6 w-px bg-outline-variant/30" />
        <div className="flex items-center gap-2.5 pl-1">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-on-surface leading-tight">{fullName}</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">
              {subtitle}
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary/10 border border-outline-variant/30 flex items-center justify-center text-primary font-bold text-xs">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
