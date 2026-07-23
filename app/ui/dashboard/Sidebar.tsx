"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Plus,
  Settings,
  ShieldCheck,
  Ticket,
  Users,
} from "lucide-react";

const sidebarIcons = {
  dashboard: LayoutDashboard,
  tickets: Ticket,
  users: Users,
  reports: BarChart3,
  knowledge: BookOpen,
  settings: Settings,
};

export type SidebarNavItem = {
  href: string;
  label: string;
  icon: keyof typeof sidebarIcons;
};

type SidebarProps = {
  navItems: SidebarNavItem[];
  homeHref: string;
  title: string;
  subtitle?: string;
  primaryAction?: {
    href: string;
    label: string;
  };
  supportHref?: string;
};

export default function Sidebar({
  navItems,
  homeHref,
  title,
  subtitle = "Expert Sage Solutions",
  primaryAction,
  supportHref,
}: SidebarProps) {
  const pathname = usePathname();
  const activeHref = navItems
    .filter((item) => item.href === homeHref ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <aside className="hidden lg:flex flex-col h-screen fixed left-0 top-0 border-r border-outline-variant/30 bg-white w-60 z-50">
      <div className="px-5 py-6">
        <div className="flex items-center gap-3 mb-8">
          <div className=" flex items-center justify-center shrink-0">
            {/* <ShieldCheck size={18} className="text-white" /> */}
            <Image
              src="/logofirstinfo-v2.png"
              width={50}
              height={50}
              className="font-headline-md text-headline-md font-bold text-tertiary"
              alt="First Info CI Logo"
            />
          </div>
          <div>
            <h1 className="font-bold text-sm text-on-surface leading-tight">{title}</h1>
            <p className="text-[11px] text-on-surface-variant">{subtitle}</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map(({ href, label, icon }) => {
            const Icon = sidebarIcons[icon];
            const isActive = href === activeHref;

            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${isActive
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

      <div className="mt-auto p-4 space-y-4">
        {primaryAction && (
          <Link href={primaryAction.href} className="w-full bg-tertiary hover:bg-primary/90 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-sm font-semibold text-sm transition-all active:scale-95">
            <Plus size={18} />
            {primaryAction.label}
          </Link>
        )}
        <div className="border-t border-outline-variant/30 pt-4 space-y-1">
          {supportHref && (
            <Link href={supportHref} className="flex items-center gap-3 text-on-surface-variant hover:bg-surface-variant/50 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors">
              <HelpCircle size={19} />
              Aide &amp; Support
            </Link>
          )}
          <Link href="/" className="flex items-center gap-3 text-on-surface-variant hover:bg-surface-variant/50 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors">
            <LogOut size={19} />
            Déconnexion
          </Link>
        </div>
      </div>
    </aside>
  );
}
