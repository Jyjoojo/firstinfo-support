import Link from "next/link";
import { AlertTriangle, BarChart3 } from "lucide-react";
import { tickets, type Ticket as SupportTicket } from "@/lib/tickets";
import { statusStyles } from "@/lib/styles";
import DashboardMetricCard from "@/app/ui/dashboard/admin/DashboardMetricCard";
import { TicketDistributionChart, TicketTrendChart } from "@/app/ui/dashboard/admin/DashboardCharts";
import TechnicianPerformanceTable from "@/app/ui/dashboard/admin/TechnicianPerformanceTable";

const statusLabels: Record<SupportTicket["statut"], string> = {
  nouveau: "Nouveaux",
  "en cours": "En cours",
  résolu: "Résolus",
  fermé: "Fermés",
};

export default function DashboardPage() {
  const totalTickets = tickets.length;
  const unresolvedTickets = tickets.filter((ticket) => ticket.statut === "nouveau" || ticket.statut === "en cours");
  const urgentTickets = tickets.filter((ticket) => ticket.priorite === "urgente");
  const statusBreakdown = (Object.keys(statusLabels) as SupportTicket["statut"][])
    .map((status) => ({ label: statusLabels[status], value: tickets.filter((ticket) => ticket.statut === status).length, color: statusStyles[status].chartColor }))
    .filter(({ value }) => value > 0);
  const technicianPerformance = Object.values(
    tickets.reduce<Record<string, { name: string; assigned: number; resolved: number }>>((result, ticket) => {
      if (!ticket.assigneA) return result;
      const technician = result[ticket.assigneA] ?? { name: ticket.assigneA, assigned: 0, resolved: 0 };
      technician.assigned += 1;
      technician.resolved += Number(ticket.statut === "résolu" || ticket.statut === "fermé");
      result[ticket.assigneA] = technician;
      return result;
    }, {}),
  ).map((technician) => ({
    ...technician,
    active: technician.assigned - technician.resolved,
    resolutionRate: Math.round((technician.resolved / technician.assigned) * 100),
    averageTime: technician.resolved ? "3 h 42" : "—",
  }));
  const trendData = [
    { label: "Sem. 1", tickets: 3 },
    { label: "Sem. 2", tickets: 2 },
    { label: "Sem. 3", tickets: 3 },
    { label: "Sem. 4", tickets: totalTickets - 8 },
  ];

  return (
    <div className="w-full max-w-7xl p-6 lg:p-8">
      <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mt-1 text-2xl font-bold text-on-surface">Vue d&apos;ensemble</h1>
          <p className="mt-1 text-sm text-on-surface-variant">Suivez l&apos;activité, la charge et la performance de l&apos;équipe support.</p>
        </div>
        <Link href="/dashboard/admin/rapports" className="inline-flex items-center gap-2 self-start rounded-lg border border-primary/30 px-3.5 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/5 sm:self-auto">
          <BarChart3 size={17} /> Voir les rapports
        </Link>
      </div>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardMetricCard icon="tickets" iconClass="bg-primary/10 text-primary" eyebrow="Volume de tickets" value={totalTickets.toLocaleString("fr-FR")} detail="Tickets enregistrés" trend={{ value: "+12 %", positive: true }} delay={0} />
        <DashboardMetricCard icon="clock" iconClass="bg-teal-700/10 text-teal-700" eyebrow="Résolution moyenne" value="4 h 12" detail="Objectif : moins de 5 h" trend={{ value: "-5 %" }} delay={0.07} />
        <DashboardMetricCard icon="gauge" iconClass="bg-amber-600/10 text-amber-700" eyebrow="Charge techniciens" value="82 %" detail={`${unresolvedTickets.length} tickets à traiter`} delay={0.14} />
        <DashboardMetricCard icon="alert" iconClass="bg-red-600/10 text-red-600" eyebrow="Urgents en attente" value={String(urgentTickets.length)} detail="Priorité critique P1" alert delay={0.21} />
      </section>

      <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-5">
        <article className="rounded-2xl border border-outline-variant/20 bg-white p-6 shadow-sm xl:col-span-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-on-surface">Tendance des tickets</h2>
              <p className="mt-1 text-sm text-on-surface-variant">Volume des demandes créées sur les quatre dernières semaines.</p>
            </div>
            <span className="rounded-md bg-primary-container px-3 py-1.5 text-sm font-semibold text-on-primary-container">30 jours</span>
          </div>
          <TicketTrendChart data={trendData} />
          <div className="mt-4 flex flex-wrap gap-6 border-t border-outline-variant/20 pt-4">
            <div><p className="text-xl font-bold text-primary">{unresolvedTickets.length}</p><p className="text-sm text-on-surface-variant">Tickets ouverts</p></div>
            <div><p className="text-xl font-bold text-emerald-700">{tickets.filter((ticket) => ticket.statut === "résolu").length}</p><p className="text-sm text-on-surface-variant">Tickets résolus</p></div>
          </div>
        </article>

        <article className="rounded-2xl border border-outline-variant/20 bg-white p-6 shadow-sm xl:col-span-2">
          <h2 className="text-xl font-bold text-on-surface">Répartition des tickets</h2>
          <p className="mt-1 text-sm text-on-surface-variant">Photo instantanée par statut.</p>
          <TicketDistributionChart data={statusBreakdown} />
        </article>
      </section>

      <TechnicianPerformanceTable technicians={technicianPerformance} reportsHref="/dashboard/admin/rapports" />

      {/* <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/60 p-4 text-sm text-amber-950">
        <div className="flex gap-3"><AlertTriangle className="mt-0.5 shrink-0 text-amber-700" size={18} /><p><strong>À approfondir dans les rapports :</strong> tendances par période, répartition par catégorie et priorité, ainsi que le détail des SLA par technicien.</p></div>
      </section> */}
    </div>
  );
}
