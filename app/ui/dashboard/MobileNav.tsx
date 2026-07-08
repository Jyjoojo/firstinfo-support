"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Ticket, BookOpen, User } from "lucide-react";

const items = [
  { href: "/dashboard/client", label: "Accueil", icon: LayoutDashboard },
  { href: "/dashboard/client/tickets", label: "Tickets", icon: Ticket },
  { href: "/dashboard/client/base-connaissances", label: "Base", icon: BookOpen },
  { href: "/dashboard/client/profil", label: "Profil", icon: User },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-outline-variant/20 flex justify-around items-center py-2.5 z-50">
      {items.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-1 ${
              isActive ? "text-primary" : "text-on-surface-variant"
            }`}
          >
            <Icon size={20} />
            <span className={`text-[10px] ${isActive ? "font-bold" : "font-medium"}`}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
