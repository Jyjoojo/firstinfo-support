import { tickets, type Ticket as SupportTicket } from "@/lib/tickets";
import { getDemoTechnicianTickets } from "@/lib/technician-tickets";
import { statusStyles } from "@/lib/styles";
import DashboardMetricCard from "@/app/ui/dashboard/admin/DashboardMetricCard";
import { TicketDistributionChart, TicketTrendChart } from "@/app/ui/dashboard/admin/DashboardCharts";
import TechnicianWorkOverview from "@/app/ui/dashboard/technicien/TechnicianWorkOverview";

const statusLabels: Record<SupportTicket["statut"], string> = {
  nouveau: "Nouveaux",
  "en cours": "En cours",
  résolu: "Résolus",
  fermé: "Fermés",
};

export default function DashboardPage() {
  // TODO: remplacer cette sélection par les tickets du technicien authentifié.
  const myTickets = getDemoTechnicianTickets(tickets);
  const unresolvedTickets = myTickets.filter(
    (ticket) => ticket.statut === "nouveau" || ticket.statut === "en cours",
  );
  const urgentTickets = myTickets.filter(
    (ticket) => ticket.priorite === "urgente",
  );
  const resolvedTickets = myTickets.filter(
    (ticket) => ticket.statut === "résolu" || ticket.statut === "fermé",
  );
  const statusBreakdown = (Object.keys(statusLabels) as SupportTicket["statut"][])
    .map((status) => ({
      label: statusLabels[status],
      value: myTickets.filter((ticket) => ticket.statut === status).length,
      color: statusStyles[status].chartColor,
    }))
    .filter(({ value }) => value > 0);
  const trendData = [
    { label: "Sem. 1", tickets: 2 },
    { label: "Sem. 2", tickets: 4 },
    { label: "Sem. 3", tickets: 5 },
    { label: "Sem. 4", tickets: myTickets.length },
  ];

  return (
    <div className="w-full max-w-7xl p-6 lg:p-8">
      <div className="mb-7">
        <div>
          <h1 className="mt-1 text-2xl font-bold text-on-surface">
            Mon tableau de bord
          </h1>
          <p className="mt-1 text-base text-on-surface-variant">
            Suivez vos tickets, vos priorités et votre performance.
          </p>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardMetricCard
          icon="tickets"
          iconClass="bg-primary/10 text-primary"
          eyebrow="Tickets assignés"
          value={myTickets.length.toLocaleString("fr-FR")}
          detail="Tous mes tickets"
          delay={0}
        />
        <DashboardMetricCard
          icon="gauge"
          iconClass="bg-amber-600/10 text-amber-700"
          eyebrow="À traiter"
          value={String(unresolvedTickets.length)}
          detail="Nouveaux et en cours"
          delay={0.07}
        />
        <DashboardMetricCard
          icon="alert"
          iconClass="bg-red-600/10 text-red-600"
          eyebrow="Urgents / en retard"
          value={String(urgentTickets.length)}
          detail="À prioriser aujourd’hui"
          alert
          delay={0.14}
        />
        <DashboardMetricCard
          icon="clock"
          iconClass="bg-teal-700/10 text-teal-700"
          eyebrow="Résolus sur 30 jours"
          value={String(resolvedTickets.length)}
          detail="Temps moyen : 4 h 12"
          trend={{ value: "+8 %", positive: true }}
          delay={0.21}
        />
      </section>

      <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-5">
        <article className="rounded-2xl border border-outline-variant/20 bg-white p-6 shadow-sm xl:col-span-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-on-surface">
                Tendance de mes tickets
              </h2>
              <p className="mt-1 text-sm text-on-surface-variant">
                Évolution des tickets qui me sont assignés.
              </p>
            </div>
            <span className="rounded-md bg-primary-container px-3 py-1.5 text-sm font-semibold text-on-primary-container">30 jours</span>
          </div>
          <TicketTrendChart data={trendData} />
          <div className="mt-4 flex flex-wrap gap-6 border-t border-outline-variant/20 pt-4">
            <div>
              <p className="text-xl font-bold text-primary">
                {unresolvedTickets.length}
              </p>
              <p className="text-sm text-on-surface-variant">
                Tickets ouverts
              </p>
            </div>
            <div>
              <p className="text-xl font-bold text-emerald-700">
                {resolvedTickets.length}
              </p>
              <p className="text-sm text-on-surface-variant">
                Tickets résolus
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-2xl border border-outline-variant/20 bg-white p-6 shadow-sm xl:col-span-2">
          <h2 className="text-xl font-bold text-on-surface">
            Répartition de mes tickets
          </h2>
          <p className="mt-1 text-sm text-on-surface-variant">
            Ma charge actuelle par statut.
          </p>
          <TicketDistributionChart data={statusBreakdown} />
        </article>
      </section>

      <TechnicianWorkOverview tickets={myTickets} />
    </div>
  );
}
