import KnowledgeBaseWidget from "@/app/ui/dashboard/client/KnowledgeBaseWidget";
import StatCard from "@/app/ui/dashboard/StatCard";
import TicketsTable from "@/app/ui/dashboard/client/TicketsTable";
import { DirectSupportWidget, MaintenanceNotice } from "@/app/ui/dashboard/client/SupportWidgets";
import { ClipboardList, Hourglass, CircleCheckBig, TrendingDown, ThumbsUp, ChevronRight } from "lucide-react";
import ContractsOverview from "@/app/ui/dashboard/client/ContractsOverview";


export default function DashboardPage() {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full">
      {/* WELCOME HEADER */}
      <div className="mb-6">
        <h2 className="text-xl lg:text-2xl font-bold text-on-surface">Tableau de bord</h2>
        <p className="text-on-surface-variant mt-1 text-sm">
          Bienvenue, voici un aperçu de vos demandes de support Sage.
        </p>
      </div>

      {/* KEY METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <StatCard
          icon={ClipboardList}
          iconColorClass="text-primary"
          bgColorClass="bg-primary/10"
          tag="Priorité Haute"
          label="Tickets Actifs"
          value="12"
          trend={{ icon: TrendingDown, value: "-2", colorClass: "text-green-600" }}
          helper="vs. semaine dernière"
        />
        <StatCard
          icon={Hourglass}
          iconColorClass="text-tertiary"
          bgColorClass="bg-tertiary/10"
          tag="En attente"
          label="Solutions en attente"
          value="05"
          helper="Moyenne réponse : 4h"
        />
        <StatCard
          icon={CircleCheckBig}
          iconColorClass="text-on-surface"
          bgColorClass="bg-tertiary-container/30"
          tag="Succès"
          label="Résolus ce mois-ci"
          value="48"
          trend={{ icon: ThumbsUp, value: "98%", colorClass: "text-green-600" }}
          helper="Taux de satisfaction"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* TICKETS TABLE SECTION */}
        <div className="xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-on-surface">Tickets Récents</h4>
            <a className="text-primary font-bold text-sm hover:underline flex items-center gap-1" href="#">
              Voir tout <ChevronRight size={16} />
            </a>
          </div>
          <TicketsTable />
          <ContractsOverview />
        </div>
          

        {/* SIDEBAR WIDGETS */}
        <div className="space-y-5">
          <KnowledgeBaseWidget />
          <DirectSupportWidget />
          <MaintenanceNotice />
        </div>
      </div>
    </div>
  );
}
