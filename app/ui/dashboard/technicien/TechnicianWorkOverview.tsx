"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, Gauge, ShieldCheck, ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import type { Ticket } from "@/lib/tickets";
import { priorityStyles, statusStyles } from "@/lib/styles";

const priorityOrder: Record<Ticket["priorite"], number> = {
  urgente: 0,
  haute: 1,
  normale: 2,
  basse: 3,
};


export default function TechnicianWorkOverview({
  tickets,
}: {
  tickets: Ticket[];
}) {
  const priorityTickets = [...tickets]
    .filter((ticket) => ticket.statut !== "résolu" && ticket.statut !== "fermé")
    .sort(
      (first, second) =>
        priorityOrder[first.priorite] - priorityOrder[second.priorite],
    )
    .slice(0, 5);

  return (
    <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-5">
      <motion.article
        initial={{ opacity: 0, x: -18 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="rounded-2xl border border-outline-variant/20 bg-white p-6 shadow-sm xl:col-span-2"
      >
        <h2 className="text-xl font-bold text-on-surface">Ma performance</h2>
        <p className="mt-1 text-sm text-on-surface-variant">
          Indicateurs personnels sur les 30 derniers jours.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <PerformanceItem
            icon={<CheckCircle2 size={18} />}
            label="Taux de résolution"
            value="86 %"
            color="text-emerald-700"
          />
          <PerformanceItem
            icon={<Clock3 size={18} />}
            label="Temps moyen"
            value="4 h 12"
            color="text-teal-700"
          />
          <PerformanceItem
            icon={<ShieldCheck size={18} />}
            label="Respect des SLA"
            value="94 %"
            color="text-primary"
          />
          <PerformanceItem
            icon={<Gauge size={18} />}
            label="Charge actuelle"
            value={`${priorityTickets.length} actifs`}
            color="text-amber-700"
          />
        </div>

        <div className="mt-6 border-t border-outline-variant/20 pt-5">
          <p className="text-sm font-semibold text-on-surface">
            Dernières assignations
          </p>
          <div className="mt-3 space-y-3">
            {tickets.slice(0, 3).map((ticket) => (
              <div
                key={ticket.id}
                className="flex items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-on-surface">
                    {ticket.titre}
                  </p>
                  <p className="mt-0.5 text-xs text-on-surface-variant">
                    {ticket.id} · {ticket.categorie}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-on-surface-variant">
                  {new Date(ticket.dateCreation).toLocaleDateString("fr-FR")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.article>

      <motion.article
        initial={{ opacity: 0, x: 18 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="rounded-2xl border border-outline-variant/20 bg-white px-6 pt-6 pb-0 shadow-sm xl:col-span-3"
      >
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-on-surface">
              Mes tickets prioritaires
            </h2>
            <p className="mt-1 text-sm text-on-surface-variant">
              Les demandes à prendre en charge en premier.
            </p>
          </div>
          <Link
            href="/dashboard/technicien/tickets"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            Voir tous mes tickets
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="w-full overflow-hidden">
          <table className="w-full table-fixed text-left text-sm">
            <thead className="border-y border-outline-variant/20 text-xs uppercase tracking-wider text-on-surface-variant">
              <tr>
                <th className="hidden w-[15%] py-3 font-semibold md:table-cell">
                  Ticket
                </th>
                <th className="w-[70%] py-3 pr-2 font-semibold sm:w-[45%] md:w-[37%]">
                  Sujet
                </th>
                <th className="w-[22%] py-3 font-semibold sm:w-[20%] md:w-[16%]">
                  Priorité
                </th>
                <th className="hidden w-[20%] py-3 font-semibold sm:table-cell md:w-[16%]">
                  Statut
                </th>
                <th className="w-[8%] py-3 font-semibold sm:w-[10%]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {priorityTickets.map((ticket, index) => {
                const PriorityIcon = priorityStyles[ticket.priorite].icon;

                return (
                  <motion.tr
                    key={ticket.id}
                    initial={{ opacity: 0, x: -14 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.25, delay: index * 0.05 }}
                    className="border-b border-outline-variant/15 last:border-0"
                  >
                    <td className="hidden py-4 font-semibold text-tertiary md:table-cell">
                      {ticket.id}
                    </td>
                    <td className="min-w-0 py-4 pr-2">
                      <p className="mb-0.5 text-xs font-semibold text-tertiary md:hidden">
                        {ticket.id}
                      </p>
                      <p className="truncate font-semibold text-on-surface">
                        {ticket.titre}
                      </p>
                      <p className="mt-0.5 text-xs text-on-surface-variant">
                        {ticket.categorie}
                      </p>
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-1.5 py-1 text-xs font-semibold ${priorityStyles[ticket.priorite].base}`}
                      >
                        {PriorityIcon && <PriorityIcon size={14} />}
                        {ticket.priorite}
                      </span>
                    </td>
                    <td className="hidden py-4 sm:table-cell">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[ticket.statut].base}`}
                      >
                        {ticket.statut}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <Link
                        href={`/dashboard/technicien/tickets/${ticket.id}`}
                        className="font-semibold text-primary hover:underline"
                      >
                        <ExternalLink size={16}/>
                      </Link>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.article>
    </section>
  );
}

function PerformanceItem({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-xl bg-surface-container-low p-4">
      <span className={`inline-flex ${color}`}>{icon}</span>
      <p className="mt-3 text-xl font-bold text-on-surface">{value}</p>
      <p className="mt-1 text-xs text-on-surface-variant">{label}</p>
    </div>
  );
}
