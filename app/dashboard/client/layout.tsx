import type { ReactNode } from "react";
import Sidebar from "@/app/ui/dashboard/Sidebar";
import MobileNav from "@/app/ui/dashboard/MobileNav";
import TopBar from "@/app/ui/dashboard/TopBar";


export default function PortailLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen flex bg-background text-on-surface overflow-hidden">
      <Sidebar />

      {/* lg:pl-60 compense la largeur de la sidebar fixe (w-60) */}
      <div className="flex-1 flex flex-col lg:pl-60 h-full">
        <TopBar />

        {/* Seule cette zone défile : sidebar et topbar restent fixes */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0 flex flex-col">
          <div className="flex-1 bg-secondary">{children}</div>

          {/* <footer className="mt-auto border-t border-outline-variant/20 bg-white shrink-0">
            <div className="px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs text-on-surface-variant font-medium">
                © 2024 First Info CI. Partenaire certifié Sage Expert.
              </p>
              <div className="flex gap-6">
                <a className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors" href="#">
                  Mentions Légales
                </a>
                <a className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors" href="#">
                  Confidentialité
                </a>
                <a className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors" href="#">
                  Support
                </a>
              </div>
            </div>
          </footer> */}
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
