"use client";

import { Eye } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import type { RecentClientTicket } from "@/lib/client-dashboard-api";

const statusStyles: Record<string, string> = {
  "Nouveau": "bg-blue-50 text-blue-700 border-blue-100",
  "En cours": "bg-orange-50 text-orange-700 border-orange-100",
  "En attente": "bg-amber-50 text-amber-700 border-amber-100",
  "Résolu": "bg-green-50 text-green-700 border-green-100",
  "Fermé": "bg-slate-50 text-slate-700 border-slate-200",
  "Ouvert": "bg-blue-50 text-blue-700 border-blue-100",
  "Urgent": "bg-red-50 text-red-700 border-red-100",
};

const dotStyles: Record<string, string> = {
  "Nouveau": "bg-blue-500",
  "En cours": "bg-orange-500",
  "En attente": "bg-amber-500",
  "Résolu": "bg-green-500",
  "Fermé": "bg-slate-500",
  "Ouvert": "bg-blue-500",
  "Urgent": "bg-red-500",
};

const statusLabels: Record<string, string> = {
  nouveau: "Nouveau",
  ouvert: "Ouvert",
  en_cours: "En cours",
  en_attente: "En attente",
  resolu: "Résolu",
  ferme: "Fermé",
};

function statusLabel(status: string) {
  return statusLabels[status.toLowerCase()] ?? status;
}

function ticketDate(value: string) {
  const date = new Date(value.includes("T") ? value : value.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return value;

  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const daysAgo = Math.round((startOfToday.getTime() - startOfDate.getTime()) / 86_400_000);
  const time = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(date);
  if (daysAgo === 0) return `Aujourd'hui, ${time}`;
  if (daysAgo === 1) return `Hier, ${time}`;
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(date);
}

export default function TicketsTable({ tickets }: { tickets: RecentClientTicket[] }) {
  return (
    <div className="bg-white rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-surface-container-low border-b border-outline-variant/20">
          <tr>
            <th className="px-5 py-3 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              ID Ticket
            </th>
            <th className="px-5 py-3 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              Sujet
            </th>
            <th className="px-5 py-3 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              Statut
            </th>
            <th className="px-5 py-3 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              Date
            </th>
            <th className="px-5 py-3 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider text-center">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/10">
          {tickets.map((ticket, index) => {
            const label = statusLabel(ticket.statut);
            return (
            <motion.tr
              key={ticket.id}
              initial={{
                opacity: 0,
                x: -12,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.3,
                delay: index * 0.07,
              }}
              className="transition-colors hover:bg-surface-container-low/50"
            >
              <td className="px-5 py-3.5 text-primary text-sm">{ticket.reference}</td>
              <td className="px-5 py-3.5">
                <p className="font-bold text-on-surface text-sm">{ticket.titre}</p>
                <p className="text-[11px] text-on-surface-variant">{ticket.categorie?.libelle ?? "Non classé"}</p>
              </td>
              <td className="px-5 py-3.5">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${statusStyles[label] ?? "bg-slate-50 text-slate-700 border-slate-200"}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[label] ?? "bg-slate-500"}`} />
                  {label}
                </span>
              </td>
              <td className="px-5 py-3.5 text-sm text-on-surface-variant">{ticketDate(ticket.created_at)}</td>
              <td className="px-5 py-3.5 text-center">
                <Link href={`/dashboard/client/tickets/${ticket.id}`} aria-label={`Voir le ticket ${ticket.reference}`} className="w-8 h-8 inline-flex items-center justify-center rounded-full text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-all">
                  <Eye size={17} />
                </Link>
              </td>
            </motion.tr>
            );
          })}
          {tickets.length === 0 && (
            <tr><td colSpan={5} className="px-5 py-8 text-center text-sm text-on-surface-variant">Aucun ticket récent.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
