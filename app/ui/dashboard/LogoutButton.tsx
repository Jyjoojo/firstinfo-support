"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function logout() {
    if (isPending) return;
    setIsPending(true);

    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/");
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={isPending}
      className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-variant/50 disabled:cursor-wait disabled:opacity-60"
    >
      <LogOut size={19} />
      {isPending ? "Déconnexion…" : "Déconnexion"}
    </button>
  );
}
