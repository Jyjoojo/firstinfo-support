"use client";

import { useMemo, useState } from "react";
import CountUp from "react-countup";
import type { DateRange } from "react-day-picker";
import {
  Archive,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  FileChartColumnIncreasing,
  FileText,
  Plus,
  TicketCheck,
  TriangleAlert,
  UserPlus,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import GenerateReportDrawer from "@/app/ui/dashboard/admin/GenerateReportDrawer";
import {
  CategoryBarChart,
  DonutChart,
  TicketEvolutionChart,
} from "@/app/ui/dashboard/admin/ReportsCharts";
import { statusStyles } from "@/lib/styles";

const REPORTS_PER_PAGE = 5;

const ticketEvolution = [
  { label: "01 juil.", created: 24, resolved: 18 },
  { label: "04 juil.", created: 31, resolved: 25 },
  { label: "07 juil.", created: 28, resolved: 30 },
  { label: "10 juil.", created: 39, resolved: 32 },
  { label: "13 juil.", created: 35, resolved: 38 },
  { label: "16 juil.", created: 44, resolved: 40 },
  { label: "19 juil.", created: 32, resolved: 36 },
  { label: "22 juil.", created: 40, resolved: 42 },
];

const statusDistribution = [
  {
    label: "Nouveaux",
    value: 32,
    color: statusStyles.nouveau.chartColor,
  },
  {
    label: "En cours",
    value: 46,
    color: statusStyles["en cours"].chartColor,
  },
  {
    label: "Résolus",
    value: 98,
    color: statusStyles.résolu.chartColor,
  },
  {
    label: "Fermés",
    value: 52,
    color: statusStyles.fermé.chartColor,
  },
];

const ticketCategories = [
  { label: "Sage 100", value: 72 },
  { label: "Sage Paie", value: 52 },
  { label: "Infrastructure", value: 41 },
  { label: "Comptabilité", value: 35 },
  { label: "Autres", value: 28 },
];

const knowledgeCategories = [
  { label: "Sage 100", value: 38 },
  { label: "Sage Paie", value: 29 },
  { label: "Infrastructure", value: 25 },
  { label: "Comptabilité", value: 21 },
  { label: "Autres", value: 15 },
];

const assignmentDistribution = [
  { label: "Manuel", value: 58, count: 132, color: "#fb923c" },
  { label: "Auto", value: 30, count: 68, color: "#eab308" },
  { label: "Soi-même", value: 12, count: 28, color: "#14b8a6" },
];

const technicians = [
  {
    name: "Jean-Marc Koffi",
    assigned: 18,
    resolved: 15,
    averageTime: "3 h 42",
  },
  {
    name: "Amadou Soro",
    assigned: 16,
    resolved: 14,
    averageTime: "4 h 08",
  },
  {
    name: "Marie Kouassi",
    assigned: 12,
    resolved: 11,
    averageTime: "4 h 31",
  },
  {
    name: "Ali Kouame",
    assigned: 10,
    resolved: 8,
    averageTime: "5 h 05",
  },
];

const mostViewedArticles = [
  { title: "Configuration SQL Server pour Sage 100", views: 1245 },
  { title: "Guide Migration Cloud Sage", views: 980 },
  { title: "Créer un exercice comptable", views: 756 },
  { title: "Rapprochement bancaire automatique", views: 615 },
];

const recentArticles = [
  { title: "Paramétrer les sauvegardes automatiques", date: "22 juil. 2026" },
  { title: "Corriger une DSN rejetée", date: "20 juil. 2026" },
  { title: "Guide des clôtures annuelles", date: "18 juil. 2026" },
  { title: "Installer Sage 100 sur un poste client", date: "16 juil. 2026" },
  { title: "Optimiser une base SQL Sage", date: "14 juil. 2026" },
];

const clientRanking = [
  { name: "First Info CI", count: 12 },
  { name: "Global Logistics CI", count: 9 },
  { name: "Tech Solutions", count: 7 },
  { name: "Société Martin & Co", count: 5 },
];

const generatedReports = Array.from({ length: 18 }, (_, index) => ({
  id: `RPT-${String(index + 1).padStart(3, "0")}`,
  generatedAt: `${String(22 - (index % 18)).padStart(2, "0")} juil. 2026`,
  period:
    index % 2 === 0
      ? "01 juil. – 22 juil. 2026"
      : "01 juin – 30 juin 2026",
  filters:
    index % 3 === 0
      ? ["Jean-Marc Koffi", "Sage 100"]
      : ["Tous les techniciens", "Toutes les catégories"],
  averageTime: index % 2 === 0 ? "4 h 12" : "4 h 38",
  totalTickets: index % 2 === 0 ? 228 : 194,
  resolvedTickets: index % 2 === 0 ? 176 : 151,
  lateTickets: index % 2 === 0 ? 14 : 11,
}));

type GeneratedReport = (typeof generatedReports)[number];

type MetricCardProps = {
  label: string;
  value: string | number;
  detail?: string;
  icon: React.ReactNode;
  alert?: boolean;
  delay?: number;
};

function MetricCard({
  label,
  value,
  detail,
  icon,
  alert = false,
  delay = 0,
}: MetricCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className={
        alert
          ? "rounded-xl border border-amber-300 bg-amber-50 p-4 shadow-sm"
          : "rounded-xl border border-outline-variant/20 bg-white p-4 shadow-sm"
      }
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.1em] text-on-surface-variant">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-on-surface">
            {typeof value === "number" ? (
              <CountUp
                end={value}
                duration={1.5}
                separator=" "
                enableScrollSpy
                scrollSpyOnce
              />
            ) : (
              value
            )}
          </p>
          {detail && (
            <p className="mt-2 text-xs font-medium text-on-surface-variant">
              {detail}
            </p>
          )}
        </div>
        <span
          className={
            alert
              ? "rounded-lg bg-amber-200 p-2.5 text-amber-800"
              : "rounded-lg bg-primary-container/15 p-2.5 text-primary"
          }
        >
          {icon}
        </span>
      </div>
    </motion.article>
  );
}

function ChartCard({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <article
      className={`rounded-2xl border border-outline-variant/20 bg-white p-6 shadow-sm ${className}`}
    >
      <h3 className="text-lg font-bold text-on-surface">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-on-surface-variant">{description}</p>
      )}
      <div className="mt-4">{children}</div>
    </article>
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-5">
      <h2 className="text-xl font-bold text-on-surface">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-on-surface-variant">{description}</p>
      )}
    </div>
  );
}

function AssignmentMethodSummary() {
  const gridTemplateColumns = assignmentDistribution
    .map((item) => `${item.value}fr`)
    .join(" ");

  return (
    <div>
      <div
        className="grid"
        style={{ gridTemplateColumns }}
      >
        {assignmentDistribution.map((item) => (
          <div key={item.label} className="min-w-0">
            <p className="mb-2 text-sm font-bold text-on-surface">
              {item.value}%
            </p>
            <div className="h-9 border-l border-outline-variant/30" />
            <div
              className="h-1.5 border-r-4 border-white last:border-r-0"
              style={{ backgroundColor: item.color }}
            />
          </div>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {assignmentDistribution.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-outline-variant/25 bg-white px-4 py-3 shadow-sm"
          >
            <p className="flex items-center gap-2 text-lg font-bold text-on-surface">
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              {item.count}
            </p>
            <p className="mt-1 text-sm text-on-surface-variant">
              {item.label}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-5 border-t border-outline-variant/20 pt-5">
        <div>
          <p className="text-3xl font-bold tracking-tight text-on-surface">
            228
          </p>
          <p className="mt-1 text-sm text-on-surface-variant">
            Tickets assignés
          </p>
        </div>
        <div>
          <p className="text-3xl font-bold tracking-tight text-on-surface">
            176
          </p>
          <p className="mt-1 text-sm text-on-surface-variant">
            Tickets résolus
          </p>
        </div>
      </div>
    </div>
  );
}

function ClientMetricCard({
  label,
  value,
  detail,
  icon,
  delay = 0,
}: {
  label: string;
  value: string;
  detail: string;
  icon: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
      whileHover={{ y: -3 }}
      className="relative flex min-h-56 flex-col rounded-xl border border-outline-variant/20 bg-white p-5 shadow-sm"
    >
      <span className="absolute right-5 top-5 rounded-lg bg-primary-container/15 p-2.5 text-primary">
        {icon}
      </span>

      <div className="flex flex-1 items-center justify-center">
        <p className="text-center text-6xl font-bold tracking-tight text-on-surface">
          {value}
        </p>
      </div>

      <div className="text-center">
        <p className="text-sm font-semibold text-on-surface">{label}</p>
        <p className="mt-1 text-xs font-medium text-on-surface-variant">
          {detail}
        </p>
      </div>
    </motion.article>
  );
}

export default function ReportsDashboard() {
  const [period, setPeriod] = useState("7-days");
  const [technician, setTechnician] = useState("all");
  const [category, setCategory] = useState("all");
  const [dateDialogOpen, setDateDialogOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [generateDrawerOpen, setGenerateDrawerOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<GeneratedReport | null>(
    null,
  );
  const [reportsPage, setReportsPage] = useState(1);

  const reportsPageCount = Math.ceil(
    generatedReports.length / REPORTS_PER_PAGE,
  );
  const visibleReports = useMemo(() => {
    const start = (reportsPage - 1) * REPORTS_PER_PAGE;
    return generatedReports.slice(start, start + REPORTS_PER_PAGE);
  }, [reportsPage]);

  const applyCustomRange = () => {
    if (dateRange?.from && dateRange.to) {
      setPeriod("custom");
      setDateDialogOpen(false);
    }
  };

  return (
    <div className="w-full max-w-7xl p-6 lg:p-8">
      <header className="mb-7">
        <h1 className="text-2xl font-bold text-on-surface">
          Rapports et statistiques
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Analysez l&apos;activité support, les contenus et l&apos;engagement
          client.
        </p>
      </header>

      <section className="mb-10 rounded-2xl border border-outline-variant/20 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              Période
            </p>
            <ToggleGroup
              type="single"
              variant="outline"
              value={period}
              onValueChange={(value) => value && setPeriod(value)}
              className="flex-wrap justify-start"
            >
              <ToggleGroupItem value="today">Aujourd&apos;hui</ToggleGroupItem>
              <ToggleGroupItem value="7-days">7 jours</ToggleGroupItem>
              <ToggleGroupItem value="30-days">30 jours</ToggleGroupItem>
              <ToggleGroupItem
                value="custom"
                onClick={() => setDateDialogOpen(true)}
              >
                <CalendarDays size={15} />
                Personnalisée
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Select value={technician} onValueChange={setTechnician}>
              <SelectTrigger className="min-w-52">
                <SelectValue placeholder="Tous les techniciens" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les techniciens</SelectItem>
                <SelectItem value="jean-marc">Jean-Marc Koffi</SelectItem>
                <SelectItem value="amadou">Amadou Soro</SelectItem>
                <SelectItem value="marie">Marie Kouassi</SelectItem>
              </SelectContent>
            </Select>

            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="min-w-52">
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                <SelectItem value="sage-100">Sage 100</SelectItem>
                <SelectItem value="paie">Sage Paie</SelectItem>
                <SelectItem value="infrastructure">Infrastructure</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <SectionHeading
          title="Statistiques tickets"
          description="Indicateurs calculés en direct pour les filtres sélectionnés."
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <MetricCard
            label="Temps moyen de résolution"
            value="4 h 12"
            detail="-5 % par rapport à la période précédente"
            icon={<Clock3 size={19} />}
          />
          <MetricCard
            label="Tickets sur la période"
            value="228"
            detail="176 tickets résolus"
            icon={<TicketCheck size={19} />}
            delay={0.06}
          />
          <MetricCard
            label="Tickets en retard"
            value="14"
            detail="6 tickets de priorité urgente"
            icon={<TriangleAlert size={19} />}
            alert
            delay={0.12}
          />
        </div>

        <div className="mt-6">
          <ChartCard
            title="Évolution du volume de tickets"
            description="Comparaison des tickets créés et résolus."
          >
            <TicketEvolutionChart data={ticketEvolution} />
          </ChartCard>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <ChartCard
            title="Répartition par statut"
            description="État actuel de la charge support."
          >
            <DonutChart data={statusDistribution} />
          </ChartCard>
          <ChartCard
            title="Répartition par catégorie"
            description="Volume des tickets par domaine."
          >
            <CategoryBarChart data={ticketCategories} />
          </ChartCard>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-5">
          <ChartCard
            title="Charge par technicien"
            description="Tickets assignés et résolus sur la période."
            className="xl:col-span-3"
          >
            <div className="space-y-5">
              {technicians.map((item) => (
                <div key={item.name}>
                  <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                    <span className="font-semibold text-on-surface">
                      {item.name}
                    </span>
                    <span className="text-on-surface-variant">
                      {item.assigned} assignés · {item.resolved} résolus
                    </span>
                  </div>
                  <div className="relative h-2.5 overflow-hidden rounded-full bg-surface-container">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-primary-container"
                      style={{ width: `${item.assigned * 5}%` }}
                    />
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-teal-700"
                      style={{ width: `${item.resolved * 5}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard
            title="Méthode d’assignation"
            description="Répartition entre manuel, auto et auto-assignation."
            className="xl:col-span-2"
          >
            <AssignmentMethodSummary />
          </ChartCard>
        </div>

        <div className="mt-6">
          <ChartCard
            title="Classement techniciens"
            description="Trié par nombre de tickets résolus."
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-160 text-left text-sm">
                <thead className="border-y border-outline-variant/20 text-xs uppercase tracking-wider text-on-surface-variant">
                  <tr>
                    <th className="py-3 font-semibold">Classement</th>
                    <th className="py-3 font-semibold">Technicien</th>
                    <th className="py-3 font-semibold">Tickets résolus</th>
                    <th className="py-3 font-semibold">Temps moyen</th>
                  </tr>
                </thead>
                <tbody>
                  {technicians.map((item, index) => (
                    <tr
                      key={item.name}
                      className="border-b border-outline-variant/15 last:border-0"
                    >
                      <td className="py-4 font-bold text-primary">
                        #{index + 1}
                      </td>
                      <td className="py-4 font-semibold text-on-surface">
                        {item.name}
                      </td>
                      <td className="py-4">{item.resolved}</td>
                      <td className="py-4">{item.averageTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>
        </div>
      </section>

      <section className="mb-12">
        <SectionHeading title="Statistiques base de connaissances" />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Total articles"
            value={128}
            icon={<BookOpen size={19} />}
          />
          <MetricCard
            label="Publiés"
            value={96}
            icon={<FileText size={19} />}
            delay={0.05}
          />
          <MetricCard
            label="Brouillons"
            value={12}
            icon={<FileText size={19} />}
            delay={0.1}
          />
          <MetricCard
            label="Archivés"
            value={20}
            icon={<Archive size={19} />}
            delay={0.15}
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-5">
          <ChartCard
            title="Articles les plus consultés"
            className="xl:col-span-2"
          >
            <div className="space-y-4">
              {mostViewedArticles.map((article, index) => (
                <div
                  key={article.title}
                  className="flex items-start justify-between gap-4"
                >
                  <div className="flex gap-3">
                    <span className="font-bold text-primary">#{index + 1}</span>
                    <p className="text-sm font-medium text-on-surface">
                      {article.title}
                    </p>
                  </div>
                  <span className="flex shrink-0 items-center gap-1 text-xs text-on-surface-variant">
                    <Eye size={14} />
                    {article.views.toLocaleString("fr-FR")}
                  </span>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard
            title="Articles par catégorie"
            className="xl:col-span-3"
          >
            <CategoryBarChart data={knowledgeCategories} color="#0f766e" />
          </ChartCard>
        </div>

        <div className="mt-6">
          <ChartCard title="Articles récemment publiés">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
              {recentArticles.map((article, index) => (
                <motion.div
                  key={article.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.08,
                    ease: "easeOut",
                  }}
                  className="border-l-2 border-primary-container pl-3"
                >
                  <p className="text-xs text-on-surface-variant">
                    {article.date}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-on-surface">
                    {article.title}
                  </p>
                </motion.div>
              ))}
            </div>
          </ChartCard>
        </div>
      </section>

      <section className="mb-12">
        <SectionHeading title="Statistiques clients" />
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
          <ClientMetricCard
            label="Clients actifs"
            value="64"
            detail="Sur la période sélectionnée"
            icon={<Users size={19} />}
          />
          <ClientMetricCard
            label="Nouveaux comptes"
            value="9"
            detail="+3 par rapport à la période précédente"
            icon={<UserPlus size={19} />}
            delay={0.06}
          />
          <ChartCard
            title="Clients avec le plus de tickets ouverts"
            className="xl:col-span-2"
          >
            <div className="space-y-3">
              {clientRanking.map((client, index) => (
                <div
                  key={client.name}
                  className="flex items-center justify-between rounded-lg bg-surface-container-low px-4 py-3"
                >
                  <span className="text-sm font-semibold text-on-surface">
                    <strong className="mr-3 text-primary">#{index + 1}</strong>
                    {client.name}
                  </span>
                  <span className="rounded-full bg-primary-container/20 px-2.5 py-1 text-xs font-bold text-primary">
                    {client.count} ouverts
                  </span>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </section>

      <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-low p-5 shadow-sm lg:p-6">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <FileChartColumnIncreasing className="text-primary" size={21} />
              <h2 className="text-xl font-bold text-on-surface">
                Rapports générés
              </h2>
            </div>
            <p className="mt-1 text-sm text-on-surface-variant">
              Historique figé des rapports créés précédemment.
            </p>
          </div>
          <Button onClick={() => setGenerateDrawerOpen(true)}>
            <Plus size={17} />
            Générer un rapport
          </Button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-outline-variant/20 bg-white">
          <table className="w-full min-w-200 text-left text-sm">
            <thead className="bg-surface-container text-xs uppercase tracking-wider text-on-surface-variant">
              <tr>
                <th className="px-5 py-4 font-semibold">Date de génération</th>
                <th className="px-5 py-4 font-semibold">Période couverte</th>
                <th className="px-5 py-4 font-semibold">Filtres appliqués</th>
                <th className="px-5 py-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleReports.map((report) => (
                <tr
                  key={report.id}
                  className="border-t border-outline-variant/15"
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold text-on-surface">
                      {report.generatedAt}
                    </p>
                    <p className="mt-1 text-xs text-on-surface-variant">
                      {report.id}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-on-surface-variant">
                    {report.period}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {report.filters.map((filter) => (
                        <span
                          key={filter}
                          className="rounded-full bg-primary-container/15 px-2.5 py-1 text-xs font-medium text-primary"
                        >
                          {filter}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedReport(report)}
                      className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                    >
                      Voir le détail
                      <ChevronRight size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-col gap-3 text-sm text-on-surface-variant sm:flex-row sm:items-center sm:justify-between">
          <span>
            Affichage {(reportsPage - 1) * REPORTS_PER_PAGE + 1}-
            {Math.min(reportsPage * REPORTS_PER_PAGE, generatedReports.length)}
            {" "}sur {generatedReports.length} rapports
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setReportsPage((value) => Math.max(1, value - 1))}
              disabled={reportsPage === 1}
              aria-label="Page précédente"
              className="inline-flex size-9 items-center justify-center rounded-lg border border-outline-variant/30 bg-white disabled:opacity-40"
            >
              <ChevronLeft size={17} />
            </button>
            <span>
              Page {reportsPage} sur {reportsPageCount}
            </span>
            <button
              type="button"
              onClick={() =>
                setReportsPage((value) =>
                  Math.min(reportsPageCount, value + 1),
                )
              }
              disabled={reportsPage === reportsPageCount}
              aria-label="Page suivante"
              className="inline-flex size-9 items-center justify-center rounded-lg border border-outline-variant/30 bg-white disabled:opacity-40"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </section>

      <Dialog open={dateDialogOpen} onOpenChange={setDateDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Période personnalisée</DialogTitle>
            <DialogDescription>
              Sélectionnez une date de début et une date de fin.
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-x-auto">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </div>
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={applyCustomRange}
              disabled={!dateRange?.from || !dateRange.to}
            >
              Appliquer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <GenerateReportDrawer
        open={generateDrawerOpen}
        onOpenChange={setGenerateDrawerOpen}
      />

      <ReportDetailDialog
        report={selectedReport}
        onOpenChange={(open) => !open && setSelectedReport(null)}
      />
    </div>
  );
}

function ReportDetailDialog({
  report,
  onOpenChange,
}: {
  report: GeneratedReport | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={Boolean(report)} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Détail du rapport {report?.id}</DialogTitle>
          <DialogDescription>
            Rapport figé couvrant la période {report?.period}.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2">
          {report?.filters.map((filter) => (
            <span
              key={filter}
              className="rounded-full bg-primary-container/15 px-2.5 py-1 text-xs font-medium text-primary"
            >
              {filter}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-surface-container-low p-4">
            <p className="text-xs uppercase tracking-wider text-on-surface-variant">
              Temps moyen de résolution
            </p>
            <p className="mt-2 text-2xl font-bold">{report?.averageTime}</p>
          </div>
          <div className="rounded-xl bg-surface-container-low p-4">
            <p className="text-xs uppercase tracking-wider text-on-surface-variant">
              Total tickets
            </p>
            <p className="mt-2 text-2xl font-bold">{report?.totalTickets}</p>
          </div>
          <div className="rounded-xl bg-surface-container-low p-4">
            <p className="text-xs uppercase tracking-wider text-on-surface-variant">
              Tickets résolus
            </p>
            <p className="mt-2 text-2xl font-bold text-teal-700">
              {report?.resolvedTickets}
            </p>
          </div>
          <div className="rounded-xl bg-amber-50 p-4">
            <p className="text-xs uppercase tracking-wider text-on-surface-variant">
              Tickets en retard
            </p>
            <p className="mt-2 text-2xl font-bold text-amber-800">
              {report?.lateTickets}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
