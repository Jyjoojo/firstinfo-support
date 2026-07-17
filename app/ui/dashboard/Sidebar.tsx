"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Ticket,
  BookOpen,
  MessageSquare,
  Settings,
  Plus,
  HelpCircle,
  LogOut,
  ShieldCheck,
} from "lucide-react";

const navItems = [
  { href: "/dashboard/client", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/dashboard/client/tickets", label: "Mes Tickets", icon: Ticket },
  { href: "/dashboard/client/base-connaissances", label: "Base de connaissances", icon: BookOpen },
  { href: "/dashboard/client/parametres", label: "Paramètres", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <aside className="hidden lg:flex flex-col h-screen fixed left-0 top-0 border-r border-outline-variant/30 bg-white w-60 z-50">
      <div className="px-5 py-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shrink-0">
            <ShieldCheck size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-on-surface leading-tight">Portail Client</h1>
            <p className="text-[11px] text-on-surface-variant">Expert Sage Solutions</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            // Le lien est actif si le chemin actuel commence par le href du lien.
            // Cas spécial pour le tableau de bord qui ne doit être actif que sur sa page exacte.
            const isActive = mounted && (
              href === "/dashboard/client"
                ? pathname === href
                : pathname.startsWith(href));

            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary-container text-on-primary-container"
                    : "text-on-surface-variant hover:bg-surface-variant/50"
                }`}
              >
                <Icon size={19} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
      {/* TODO: Ajouter les bons chemins pour les liens d'aide et de déconnexion */}
      <div className="mt-auto p-4 space-y-4">
        <button className="w-full bg-tertiary hover:bg-primary/90 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-sm font-semibold text-sm transition-all active:scale-95">
          <Plus size={18} />
          Nouveau Ticket
        </button>
        <div className="border-t border-outline-variant/30 pt-4 space-y-1">
          <Link
            href="/dashboard/client/aide-support"
            className="flex items-center gap-3 text-on-surface-variant hover:bg-surface-variant/50 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
          >
            <HelpCircle size={19} />
            Aide &amp; Support
          </Link>
          {/* TODO: Ajouter le bon lien de déconnexion */}
          <Link
            href="/"
            className="flex items-center gap-3 text-on-surface-variant hover:bg-surface-variant/50 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
          >
            <LogOut size={19} />
            Déconnexion
          </Link>
        </div>
      </div>
    </aside>
  );
}
