"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  toAppNotification,
  type LaravelNotification,
} from "@/lib/notifications";

function getAuthorName(notification: LaravelNotification) {
  const author = notification.donnees.auteur_nom;
  return typeof author === "string" && author.trim() ? author : "Support";
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase() || "S";
}

export default function MailBox({
  initialMessages,
  ticketBaseHref,
}: {
  initialMessages: LaravelNotification[];
  ticketBaseHref: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [isUpdating, setIsUpdating] = useState(false);
  const unreadCount = messages.filter((message) => !message.lu).length;
  const previews = useMemo(() => messages.map((message) => ({
    notification: message,
    display: toAppNotification(message),
    authorName: getAuthorName(message),
  })), [messages]);

  async function openMessage(notification: LaravelNotification) {
    if (!notification.lu) {
      const response = await fetch(`/api/notifications/${notification.id}/lire`, {
        method: "PATCH",
      });
      if (response.ok) {
        setMessages((items) => items.map((item) => item.id === notification.id
          ? { ...item, lu: true, lu_le: new Date().toISOString() }
          : item));
      }
    }

    const ticketId = notification.action?.ticket_id ?? notification.ticket_id;
    if (ticketId) {
      setOpen(false);
      router.push(`${ticketBaseHref}/${ticketId}#dernier-message`);
    }
  }

  async function markAllAsRead() {
    if (isUpdating || unreadCount === 0) return;
    setIsUpdating(true);
    try {
      const response = await fetch("/api/notifications/tout-lire", { method: "POST" });
      if (!response.ok) return;
      const readAt = new Date().toISOString();
      setMessages((items) => items.map((item) => ({
        ...item,
        lu: true,
        lu_le: item.lu_le ?? readAt,
      })));
      router.refresh();
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button
          className="relative w-9 h-9 flex items-center justify-center cursor-pointer text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors"
          aria-label={`Messagerie${unreadCount ? `, ${unreadCount} non lus` : ""}`}
        >
          <Mail size={19} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-[3px] rounded-full bg-tertiary text-white text-[10px] font-bold flex items-center justify-center leading-none">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DrawerTrigger>

      <DrawerContent className="w-[420px] sm:w-[460px] max-w-full">
        <DrawerHeader>
          <DrawerTitle className="text-xl font-bold">Messagerie</DrawerTitle>
          <DrawerDescription className="text-sm">
            Derniers messages reçus sur vos tickets.
          </DrawerDescription>
        </DrawerHeader>

        <div className="no-scrollbar overflow-y-auto px-4 flex-1 flex flex-col gap-2">
          {previews.map(({ notification, display, authorName }) => (
            <button
              type="button"
              key={notification.id}
              onClick={() => openMessage(notification)}
              className="relative block w-full text-left bg-surface-container-lowest border border-outline-variant/40 hover:border-primary/40 hover:bg-surface-container-low rounded-xl px-4 py-3 transition-colors"
            >
              {!notification.lu && (
                <span className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-primary-container" />
              )}
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 border border-outline-variant/30 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                  {getInitials(authorName)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-on-surface truncate">{authorName}</span>
                    <span className="text-[11px] text-on-surface-variant shrink-0">{display.time}</span>
                  </div>
                  <p className="text-[11px] font-bold mt-0.5 text-tertiary">
                    {notification.ticket_reference ?? "Ticket"} · {notification.ticket_titre ?? display.title}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">{display.description}</p>
                </div>
                {!notification.lu && <span className="w-2 h-2 rounded-full bg-primary-container shrink-0 mt-1" />}
              </div>
            </button>
          ))}

          {previews.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center py-16 text-on-surface-variant">
              <Paperclip size={28} className="mb-2 opacity-40" />
              <p className="text-sm">Aucun message pour le moment.</p>
            </div>
          )}
        </div>

        <DrawerFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={markAllAsRead}
            disabled={isUpdating || unreadCount === 0}
          >
            Tout marquer comme lu
          </Button>
          <DrawerClose asChild>
            <Button variant="ghost" className="w-full bg-primary-container hover:bg-primary-container/90 cursor-pointer">
              Fermer
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
