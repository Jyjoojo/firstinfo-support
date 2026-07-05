import type { ReactNode } from "react";
import Image from "next/image";
import LoginShowcase from "../ui/LoginShowcase";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-container-low flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] min-h-[650px]">
        <div className="flex flex-col h-full px-8 py-10 lg:px-12 lg:py-12">
          <div className="mb-16 flex items-center gap-2">
            <Image src="/logofirstinfo-v2.png" width={80} height={80} alt="First Info CI Logo" />
          </div>
          {children}
        </div>

        <div className="hidden lg:block p-3">
          <LoginShowcase />
        </div>
      </div>
    </div>
  );
}
