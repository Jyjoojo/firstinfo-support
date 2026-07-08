import { Search, HelpCircle, Bell } from "lucide-react";
import NotificationsBell from "./NotificationBell";

export default function TopBar() {
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
        <button className="w-9 h-9 flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors">
          <HelpCircle size={19} />
        </button>
        <NotificationsBell />
        <div className="h-6 w-px bg-outline-variant/30" />
        <div className="flex items-center gap-2.5 pl-1">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-on-surface leading-tight">Jean Dupont</p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">
              Admin Entreprise
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary/10 border border-outline-variant/30 flex items-center justify-center text-primary font-bold text-xs">
            JD
          </div>
        </div>
      </div>
    </header>
  );
}
