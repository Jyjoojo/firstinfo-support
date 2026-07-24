import type { ReactNode } from "react";
import Sidebar from "@/app/ui/dashboard/Sidebar";
import MobileNav from "@/app/ui/dashboard/MobileNav";
import TopBar from "@/app/ui/dashboard/TopBar";


export default function PortailLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen flex bg-background text-on-surface overflow-hidden">
      <Sidebar
        title="Portail Technicien"
        homeHref="/dashboard/technicien"
        navItems={[
          { href: "/dashboard/technicien", label: "Tableau de bord", icon: "dashboard" },
          { href: "/dashboard/technicien/tickets", label: "Mes tickets", icon: "tickets" },
          { href: "/dashboard/technicien/categories", label: "Catégories des tickets", icon: "tickets" },
          { href: "/dashboard/technicien/base-connaissances", label: "Gestion des connaissances", icon: "knowledge" },
          { href: "/dashboard/technicien/parametres", label: "Paramètres", icon: "settings" },
        ]}
      />

      {/* lg:pl-60 compense la largeur de la sidebar fixe (w-60) */}
      <div className="flex-1 flex flex-col lg:pl-60 h-full min-h-0">
        <TopBar />

        {/* Seule cette zone défile : sidebar et topbar restent fixes */}
        <main className="relative flex-1 min-h-0 overflow-y-auto pb-20 lg:pb-0 flex flex-col bg-secondary">
          <div className="flex flex-1 min-h-0 flex-col">{children}</div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
