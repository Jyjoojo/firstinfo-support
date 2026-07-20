import Link from "next/link";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CircleAlert,
  Clock3,
  FileText,
  Gauge,
  Ticket,
} from "lucide-react";
import { tickets, type Ticket as SupportTicket } from "@/lib/tickets";

const statusLabels: Record<SupportTicket["statut"], string> = {
  nouveau: "Nouveaux",
  "en cours": "En cours",
  résolu: "Résolus",
  fermé: "Fermés",
};

const statusColors: Record<SupportTicket["statut"], string> = {
  nouveau: "#b26100",
  "en cours": "#0f766e",
  résolu: "#15803d",
  fermé: "#64748b",
};

const priorityLabels: Record<SupportTicket["priorite"], string> = {
  basse: "Basse",
  normale: "Normale",
  haute: "Haute",
  urgente: "Urgente",
};

function MetricCard({
  icon: Icon,
  iconClass,
  eyebrow,
  value,
  detail,
  trend,
  alert,
}: {
  icon: typeof Ticket;
  iconClass: string;
  eyebrow: string;
  value: string;
  detail: string;
  trend?: { value: string; positive?: boolean };
  alert?: boolean;
}) {
  return (
    <article className="rounded-2xl border border-outline-variant/20 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}>
          <Icon size={21} />
        </div>
        {trend && (
          <span className={`flex items-center gap-1 text-sm font-semibold ${trend.positive ? "text-emerald-700" : "text-red-600"}`}>
            {trend.value}
            {trend.positive ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
          </span>
        )}
        {alert && <span className="text-sm font-bold text-red-700">Action requise</span>}
      </div>
      <p className="max-w-40 text-sm font-medium uppercase tracking-[0.12em] text-on-surface-variant">{eyebrow}</p>
      <p className="mt-3 text-3xl font-bold tracking-tight text-on-surface">{value}</p>
      <p className="mt-3 text-sm font-medium text-on-surface-variant">{detail}</p>
    </article>
  );
}

function TicketTrendChart({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  const width = 600;
  const height = 210;
  const padding = 22;
  const points = values.map((value, index) => {
    const x = padding + (index * (width - padding * 2)) / (values.length - 1);
    const y = height - padding - (value / max) * (height - padding * 2 - 25);
    return `${x},${y}`;
  }).join(" ");
  const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-56 w-full" role="img" aria-label="Évolution des tickets sur quatre semaines">
      <defs>
        <linearGradient id="ticket-trend-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#a15c00" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#a15c00" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((line) => (
        <line key={line} x1={padding} x2={width - padding} y1={height * line} y2={height * line} stroke="#e8e4df" strokeDasharray="4 5" />
      ))}
      <polygon points={areaPoints} fill="url(#ticket-trend-fill)" />
      <polyline points={points} fill="none" stroke="#a15c00" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {values.map((value, index) => {
        const [x, y] = points.split(" ")[index].split(",");
        return <circle key={`${value}-${index}`} cx={x} cy={y} r="4.5" fill="#fff" stroke="#a15c00" strokeWidth="3" />;
      })}
    </svg>
  );
}

export default function DashboardPage() {
  const totalTickets = tickets.length;
  const unresolvedTickets = tickets.filter((ticket) => ticket.statut === "nouveau" || ticket.statut === "en cours");
  const urgentTickets = tickets.filter((ticket) => ticket.priorite === "urgente");
  const statusBreakdown = (Object.keys(statusLabels) as SupportTicket["statut"][])
    .map((status) => ({ status, count: tickets.filter((ticket) => ticket.statut === status).length }))
    .filter(({ count }) => count > 0);
  const distributionBackground = statusBreakdown.reduce<{ offset: number; stops: string[] }>(
    (result, { status, count }) => {
      const end = result.offset + (count / totalTickets) * 100;
      result.stops.push(`${statusColors[status]} ${result.offset}% ${end}%`);
      return { offset: end, stops: result.stops };
    },
    { offset: 0, stops: [] },
  ).stops.join(", ");
  const technicianPerformance = Object.values(
    tickets.reduce<Record<string, { name: string; assigned: number; resolved: number }>>((result, ticket) => {
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
  const weeklyTrend = [3, 2, 3, totalTickets - 8];

  return (
    <div className="w-full max-w-7xl p-6 lg:p-8">
      <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Pilotage du support</p>
          <h1 className="mt-1 text-2xl font-bold text-on-surface">Vue d&apos;ensemble</h1>
          <p className="mt-1 text-sm text-on-surface-variant">Suivez l&apos;activité, la charge et la performance de l&apos;équipe support.</p>
        </div>
        <Link href="/dashboard/admin/rapports" className="inline-flex items-center gap-2 self-start rounded-lg border border-primary/30 px-3.5 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/5 sm:self-auto">
          <BarChart3 size={17} /> Voir les rapports
        </Link>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Ticket} iconClass="bg-primary/10 text-primary" eyebrow="Volume de tickets" value={totalTickets.toLocaleString("fr-FR")} detail="Tickets enregistrés" trend={{ value: "+12 %", positive: true }} />
        <MetricCard icon={Clock3} iconClass="bg-teal-700/10 text-teal-700" eyebrow="Résolution moyenne" value="4 h 12" detail="Objectif : moins de 5 h" trend={{ value: "-5 %" }} />
        <MetricCard icon={Gauge} iconClass="bg-amber-600/10 text-amber-700" eyebrow="Charge techniciens" value="82 %" detail={`${unresolvedTickets.length} tickets à traiter`} />
        <MetricCard icon={CircleAlert} iconClass="bg-red-600/10 text-red-600" eyebrow="Urgents en attente" value={String(urgentTickets.length)} detail="Priorité critique P1" alert />
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
          <TicketTrendChart values={weeklyTrend} />
          <div className="mt-1 grid grid-cols-4 text-center text-xs text-on-surface-variant">
            <span>Semaine 1</span><span>Semaine 2</span><span>Semaine 3</span><span>Semaine 4</span>
          </div>
          <div className="mt-6 flex flex-wrap gap-6 border-t border-outline-variant/20 pt-5">
            <div><p className="text-2xl font-bold text-primary">{unresolvedTickets.length}</p><p className="text-sm text-on-surface-variant">Tickets ouverts</p></div>
            <div><p className="text-2xl font-bold text-emerald-700">{tickets.filter((ticket) => ticket.statut === "résolu").length}</p><p className="text-sm text-on-surface-variant">Tickets résolus</p></div>
          </div>
        </article>

        <article className="rounded-2xl border border-outline-variant/20 bg-white p-6 shadow-sm xl:col-span-2">
          <h2 className="text-xl font-bold text-on-surface">Répartition des tickets</h2>
          <p className="mt-1 text-sm text-on-surface-variant">Photo instantanée par statut.</p>
          <div className="my-7 flex items-center justify-center gap-7">
            <div className="relative h-36 w-36 rounded-full" style={{ background: `conic-gradient(${distributionBackground})` }}>
              <div className="absolute inset-5 flex flex-col items-center justify-center rounded-full bg-white">
                <span className="text-3xl font-bold text-on-surface">{totalTickets}</span>
                <span className="text-xs text-on-surface-variant">tickets</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {statusBreakdown.map(({ status, count }) => (
              <div key={status} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 text-on-surface-variant"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: statusColors[status] }} />{statusLabels[status]}</span>
                <span className="font-bold text-on-surface">{count} <span className="font-normal text-on-surface-variant">({Math.round((count / totalTickets) * 100)}%)</span></span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-6 rounded-2xl border border-outline-variant/20 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-on-surface">Performance des techniciens</h2>
            <p className="mt-1 text-sm text-on-surface-variant">Indicateurs calculés à partir des assignations des tickets.</p>
          </div>
          <Link href="/dashboard/admin/rapports" className="text-sm font-semibold text-primary hover:underline">Détail dans les rapports</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-y border-outline-variant/20 text-xs uppercase tracking-wider text-on-surface-variant">
              <tr><th className="py-3 font-semibold">Technicien</th><th className="py-3 font-semibold">Tickets assignés</th><th className="py-3 font-semibold">Tickets actifs</th><th className="py-3 font-semibold">Taux de résolution</th><th className="py-3 font-semibold">Temps moyen</th></tr>
            </thead>
            <tbody>
              {technicianPerformance.map((technician) => (
                <tr key={technician.name} className="border-b border-outline-variant/15 last:border-0">
                  <td className="py-4 font-semibold text-on-surface"><span className="mr-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary-container/15 text-xs text-primary">{technician.name.split(" ").map((part) => part[0]).join("")}</span>{technician.name}</td>
                  <td className="py-4 text-on-surface">{technician.assigned}</td>
                  <td className="py-4 text-on-surface">{technician.active}</td>
                  <td className="py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${technician.resolutionRate >= 80 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>{technician.resolutionRate}%</span></td>
                  <td className="py-4 text-on-surface">{technician.averageTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/60 p-4 text-sm text-amber-950">
        <div className="flex gap-3"><AlertTriangle className="mt-0.5 shrink-0 text-amber-700" size={18} /><p><strong>À approfondir dans les rapports :</strong> tendances par période, répartition par catégorie et priorité, ainsi que le détail des SLA par technicien.</p></div>
      </section>
    </div>
  );
}
