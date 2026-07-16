"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"

interface MessagePreview {
    id: string
    ticketId: string
    ticketTitle: string
    authorName: string
    authorInitials: string
    excerpt: string
    time: string
    unread: boolean
    statusColor: string // couleur du tag ticket selon son statut
}

const messages: MessagePreview[] = [
    {
        id: "1",
        ticketId: "TK-5007",
        ticketTitle: "Erreur synchronisation Sage 100 Cloud",
        authorName: "Sarah Koffi",
        authorInitials: "SK",
        excerpt: "Pouvez-vous réessayer la synchronisation et me dire si l'erreur persiste ?",
        time: "il y a 45 min",
        unread: true,
        statusColor: "#895100",
    },
    {
        id: "2",
        ticketId: "TK-4011",
        ticketTitle: "Blocage export comptable",
        authorName: "Ibrahim Traoré",
        authorInitials: "IT",
        excerpt: "Le ticket a été marqué comme résolu, n'hésitez pas si besoin.",
        time: "hier",
        unread: true,
        statusColor: "#006a62",
    },
    {
        id: "3",
        ticketId: "TK-5009",
        ticketTitle: "Demande d'ajout d'utilisateur",
        authorName: "Awa Bamba",
        authorInitials: "AB",
        excerpt: "Votre demande a été transmise à l'équipe technique.",
        time: "3 j",
        unread: false,
        statusColor: "#835401",
    },
]

export default function MailBox() {
    const [open, setOpen] = useState(false)
    const unreadCount = messages.filter((m) => m.unread).length

    return (
        <Drawer direction="right" open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <button className="relative w-9 h-9 flex items-center justify-center cursor-pointer text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors">
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
                    {messages.map((message) => (
                        <Link
                            key={message.id}
                            href={`/dashboard/client/tickets/${message.ticketId}#dernier-message`}
                            onClick={() => setOpen(false)}
                            className="relative block bg-surface-container-lowest border border-outline-variant/40 hover:border-primary/40 hover:bg-surface-container-low rounded-xl px-4 py-3 transition-colors"
                        >
                            {message.unread && (
                                <span className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-primary-container" />
                            )}
                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-full bg-primary/10 border border-outline-variant/30 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                                    {message.authorInitials}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-sm font-bold text-on-surface truncate">
                                            {message.authorName}
                                        </span>
                                        <span className="text-[11px] text-on-surface-variant shrink-0">
                                            {message.time}
                                        </span>
                                    </div>
                                    <p
                                        className="text-[11px] font-bold mt-0.5"
                                        style={{ color: message.statusColor }}
                                    >
                                        #{message.ticketId} &middot; {message.ticketTitle}
                                    </p>
                                    <p className="text-xs text-on-surface-variant mt-1 truncate">
                                        {message.excerpt}
                                    </p>
                                </div>
                                {message.unread && (
                                    <span className="w-2 h-2 rounded-full bg-primary-container shrink-0 mt-1" />
                                )}
                            </div>
                        </Link>
                    ))}

                    {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center text-center py-16 text-on-surface-variant">
                            <Paperclip size={28} className="mb-2 opacity-40" />
                            <p className="text-sm">Aucun message pour le moment.</p>
                        </div>
                    )}
                </div>

                <DrawerFooter>
                    <Button variant="outline" className="w-full">
                        Marquer tout comme lu
                    </Button>
                    <DrawerClose asChild>
                        <Button variant="ghost" className="w-full bg-primary-container hover:bg-primary-container/90 cursor-pointer">
                            Fermer
                        </Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
