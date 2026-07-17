"use client";

import Link from "next/link";
import { useState } from "react";
import { MessageCircleQuestionMark, TicketIcon, ArrowRight, Phone, Mail, HelpCircle,
    MessageSquare, Bell, BookOpen,LifeBuoy,
} from "lucide-react"
import { Card } from "@/components/ui/card";
import { statusStyles } from "@/lib/styles";
import FaqAccordion from "@/components/ui/FaqAccordion";

const quickLinks = [
    {
        label: "Mes tickets",
        description: "Suivre mes demandes en cours",
        href: "/tickets",
        icon: TicketIcon,
    },
    {
        label: "Messagerie",
        description: "Consulter mes échanges",
        href: "/messagerie",
        icon: MessageSquare,
    },
    {
        label: "Notifications",
        description: "Historique des alertes",
        href: "/notifications",
        icon: Bell,
    },
    {
        label: "Base de connaissances",
        description: "Articles et guides",
        href: "/base-connaissances",
        icon: BookOpen,
    },
];

const faqItems = [
    {
        question: "Comment créer un ticket de support ?",
        answer:
            "Depuis le menu latéral, cliquez sur « Mes tickets » puis sur « Nouvelle demande ». Décrivez votre problème le plus précisément possible : un technicien vous sera assigné automatiquement selon sa spécialité.",
    },
    {
        question: "Comment suivre l'avancement de ma demande ?",
        answer:
            "Chaque ticket affiche son statut en temps réel (Ouvert, En cours, Résolu, Fermé) sur sa page de détail, ainsi que l'historique des échanges avec le technicien assigné.",
    },
    {
        question: "Qui peut consulter mes tickets ?",
        answer:
            "Seuls vous, le technicien assigné et les administrateurs habilités ont accès au contenu de vos demandes.",
    },
    {
        question: "Comment contacter directement un technicien ?",
        answer:
            "Utilisez la messagerie associée à votre ticket : tous les échanges y sont centralisés et notifiés automatiquement.",
    },
];

const ticketLifecycle: {
    key: keyof typeof statusStyles;
    label: string;
    description: string;
}[] = [
        {
            key: "nouveau",
            label: "Nouveau",
            description: "Votre demande a été enregistrée et est en attente de prise en charge.",
        },
        {
            key: "en cours",
            label: "En cours",
            description: "Un technicien travaille actuellement sur votre demande.",
        },
        {
            key: "résolu",
            label: "Résolu",
            description: "Une solution a été proposée, en attente de votre validation.",
        },
        {
            key: "fermé",
            label: "Fermé",
            description: "Le ticket est clôturé. Vous pouvez le rouvrir si besoin.",
        },
    ];


export default function AideSupportPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    return (
        <main className="max-w-[1280px] mx-auto px-6 py-10 space-y-20">
            {/* Hero */}
            <section
                className="relative rounded-2xl overflow-hidden min-h-[320px] flex items-center justify-center text-center px-6"
                style={{ backgroundColor: "#FFDCBC" }}
            >
                <div className="max-w-2xl">
                    <h1
                        className="font-bold mb-4"
                        style={{ color: "#2C1700", fontSize: "40px", lineHeight: 1.1 }}
                    >
                        Comment pouvons-nous vous aider ?
                    </h1>
                    <p style={{ color: "#683D00", fontSize: "18px", lineHeight: 1.6 }}>
                        Retrouvez ici les coordonnées de l'équipe support, les réponses
                        aux questions fréquentes et le fonctionnement de vos tickets.
                    </p>
                </div>
            </section>

            {/* Accès rapides */}
            <section>
                <div className="mb-6">
                    <h2
                        className="font-bold"
                        style={{ color: "#1A1C1C", fontSize: "28px" }}
                    >
                        Accès rapide
                    </h2>
                    <p style={{ color: "#544434", fontSize: "16px" }}>
                        Retrouvez rapidement les sections déjà à votre disposition.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {quickLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="group p-5 rounded-xl bg-white transition-all hover:-translate-y-0.5 border border-surface-container-highest"
                            style={{
                                boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
                            }}
                        >
                            <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-3 bg-primary-fixed text-surface-tint">
                                <link.icon size={19} />
                            </div>
                            <h3 className="font-semibold mb-1" style={{ color: "#1A1C1C" }}>
                                {link.label}
                            </h3>
                            <p className="text-sm" style={{ color: "#544434" }}>
                                {link.description}
                            </p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* FAQ + Contact */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* FAQ */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <HelpCircle size={19} className="text-primary" />
                        <h2 className="font-semibold text-xl text-on-background">
                            Questions fréquentes
                        </h2>
                    </div>

                    <FaqAccordion items={faqItems} defaultOpenIndex={0} />
                </div>

                {/* Contact Support */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <MessageCircleQuestionMark size={19} className="bg-secondary" />
                        <h2 className="font-semibold text-lg text-on-background text-xl">
                            Contacter le support
                        </h2>
                    </div>

                    <div
                        className="p-7 rounded-2xl space-y-5 relative overflow-hidden"
                        style={{ backgroundColor: "#006A62", color: "#FFFFFF" }}
                    >
                        <div
                            className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full"
                            style={{ backgroundColor: "rgba(255,255,255,0.08)", filter: "blur(30px)" }}
                        />

                        <h3 className="font-semibold relative z-10" style={{ fontSize: "20px" }}>
                            Besoin d'aide personnalisée ?
                        </h3>
                        <p className="relative z-10 text-sm" style={{ color: "rgba(255,255,255,0.85)" }}>
                            Notre équipe reste disponible pour toute question concernant vos tickets.
                        </p>

                        <div className="space-y-3 relative z-10">
                            <Link
                                href="/dashboard/client/tickets/nouveau"
                                className="flex items-center p-4 rounded-xl transition-all group"
                                style={{
                                    backgroundColor: "rgba(255,255,255,0.1)",
                                    border: "1px solid rgba(255,255,255,0.2)",
                                }}
                            >
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center mr-4"
                                    style={{ backgroundColor: "#FFFFFF", color: "#006A62" }}
                                >
                                    <TicketIcon size={19}/>
                                </div>
                                <div>
                                    <span className="block font-semibold">Ouvrir un ticket</span>
                                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>
                                        Réponse sous 2h ouvrées
                                    </span>
                                </div>
                            </Link>

                            <div
                                className="flex items-center p-4 rounded-xl"
                                style={{ backgroundColor: "#FF9F1C", color: "#683C00" }}
                            >
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center mr-4"
                                    style={{ backgroundColor: "#683C00", color: "#FF9F1C" }}
                                >
                                    <Phone size={19}/>
                                </div>
                                <div>
                                    <span className="block font-semibold">Support téléphonique</span>
                                    <span className="text-sm">+225 07 59 09 87 32</span>
                                </div>
                            </div>

                            <div
                                className="flex items-center p-4 rounded-xl"
                                style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                            >
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center mr-4"
                                    style={{ backgroundColor: "#FFFFFF", color: "#006A62" }}
                                >
                                    <Mail size={19}/>
                                </div>
                                <div>
                                    <span className="block font-semibold">Email</span>
                                    <span className="text-sm" style={{ color: "rgba(255,255,255,0.85)" }}>
                                        support@firstinfoci.com
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div
                            className="pt-4 text-center relative z-10"
                            style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}
                        >
                            <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
                                Disponible du Lundi au Vendredi
                                <br />
                                08:00 - 18:00 GMT
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Cycle de vie d'un ticket — légende explicative basée sur TicketStatusStepper */}
            <section>
                <div className="mb-6 flex items-center gap-2">
                    <TicketIcon className="w-5 h-5 text-tertiary" />
                    <h2 className="font-semibold text-on-background text-xl">
                        Comprendre le cycle de vie d'un ticket
                    </h2>
                </div>

                <Card className="border-outline-variant bg-surface-container-lowest p-7">
                    <div className="flex flex-col md:flex-row md:items-start gap-stack-lg md:gap-0">
                        {ticketLifecycle.map((status, index) => {
                            const { icon: StatusIcon } = statusStyles[status.key];
                            return (
                                <div
                                    key={status.key}
                                    className="flex-1 flex md:flex-col items-start md:items-center gap-4 md:gap-3 relative"
                                >
                                    {index < ticketLifecycle.length - 1 && (
                                        <div className="hidden md:block absolute top-4 left-1/2 w-full h-px bg-outline-variant z-0" />
                                    )}
                                    <div
                                        className={`w-9 h-9 rounded-full flex items-center justify-center relative z-10 ${statusStyles[status.key].base}`}
                                    >
                                        {StatusIcon && <StatusIcon className="w-4 h-4" />}
                                    </div>
                                    <div className="md:text-center">
                                        <p className="font-semibold text-label-sm text-on-surface mb-1">
                                            {status.label}
                                        </p>
                                        <p className="text-sm text-on-surface-variant max-w-[200px]">
                                            {status.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </section>
        </main>
    );
}
