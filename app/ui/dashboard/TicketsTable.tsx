"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown, ChevronLeft, ChevronRight, Eye, Search } from "lucide-react";
import { motion } from "motion/react";
import SelectFilter from "@/app/ui/dashboard/SelectFiltre";
import type {
  ApiCategory,
  ClientTicket,
  TicketFilters,
  TicketPriority,
  TicketStatus,
  TicketsResponse,
} from "@/lib/ticket-contracts";

type SortKey = "reference" | "titre" | "statut" | "priorite" | "created_at";

const statusOptions = [
  { value: "all", label: "Tous les statuts" },
  { value: "nouveau", label: "Nouveau" },
  { value: "en_cours", label: "En cours" },
  { value: "en_attente", label: "En attente" },
  { value: "resolu", label: "Résolu" },
  { value: "ferme", label: "Fermé" },
];

const priorityOptions = [
  { value: "all", label: "Toutes priorités" },
  { value: "basse", label: "Basse" },
  { value: "normale", label: "Normale" },
  { value: "haute", label: "Haute" },
  { value: "urgente", label: "Urgente" },
];

const statusLabels: Record<TicketStatus, string> = {
  nouveau: "Nouveau",
  en_cours: "En cours",
  en_attente: "En attente",
  resolu: "Résolu",
  ferme: "Fermé",
};

const statusStyles: Record<TicketStatus, string> = {
  nouveau: "border-blue-300 bg-blue-50 text-blue-700",
  en_cours: "border-orange-300 bg-orange-50 text-orange-700",
  en_attente: "border-amber-300 bg-amber-50 text-amber-700",
  resolu: "border-green-300 bg-green-50 text-green-700",
  ferme: "border-slate-300 bg-slate-100 text-slate-700",
};

const priorityLabels: Record<TicketPriority, string> = {
  basse: "Basse",
  normale: "Normale",
  haute: "Haute",
  urgente: "Urgente",
};

const priorityStyles: Record<TicketPriority, string> = {
  basse: "border-emerald-300 bg-emerald-50 text-emerald-700",
  normale: "border-sky-300 bg-sky-50 text-sky-700",
  haute: "border-amber-300 bg-amber-50 text-amber-700",
  urgente: "border-red-300 bg-red-50 text-red-700",
};

function SortButton({
  label,
  sortKey,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  onSort: (key: SortKey) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      className="inline-flex items-center gap-1.5 font-semibold hover:text-primary"
    >
      {label}
      <ArrowUpDown size={13} />
    </button>
  );
}

function formatDate(value: string) {
  const date = new Date(value.replace(" ", "T"));
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(date);
}

export default function TicketsTable({
  tickets,
  pagination,
  categories,
  filters,
}: {
  tickets: ClientTicket[];
  pagination: TicketsResponse["meta"];
  categories: ApiCategory[];
  filters: TicketFilters;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(filters.search ?? "");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortAscending, setSortAscending] = useState(false);

  function navigateWithFilter(name: string, value?: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "all") params.delete(name);
    else params.set(name, value);
    if (name !== "page") params.delete("page");

    startTransition(() => {
      router.replace(`${pathname}${params.size ? `?${params.toString()}` : ""}`);
    });
  }

  useEffect(() => {
    if (search === (filters.search ?? "")) return;
    const timeout = window.setTimeout(() => navigateWithFilter("search", search.trim()), 400);
    return () => window.clearTimeout(timeout);
    // navigateWithFilter depends on the current URL and is intentionally refreshed after navigation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filters.search]);

  const visibleTickets = useMemo(() => [...tickets].sort((first, second) => {
    const comparison = String(first[sortKey]).localeCompare(String(second[sortKey]), "fr-FR", {
      numeric: true,
    });
    return sortAscending ? comparison : -comparison;
  }), [sortAscending, sortKey, tickets]);

  function updateSort(key: SortKey) {
    if (key === sortKey) setSortAscending((ascending) => !ascending);
    else {
      setSortKey(key);
      setSortAscending(true);
    }
  }

  const categoryOptions = [
    { value: "all", label: "Toutes catégories" },
    ...categories.map((category) => ({ value: category.id, label: category.libelle })),
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${isPending ? "opacity-70" : ""}`}
    >
      <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher un ticket"
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none transition focus:border-sky-400"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <SelectFilter
            items={statusOptions}
            value={filters.statut ?? "all"}
            onValueChange={(value) => navigateWithFilter("statut", value)}
            placeholder="Statut"
            className="w-40"
          />
          <SelectFilter
            items={priorityOptions}
            value={filters.priorite ?? "all"}
            onValueChange={(value) => navigateWithFilter("priorite", value)}
            placeholder="Priorité"
            className="w-40"
          />
          <SelectFilter
            items={categoryOptions}
            value={filters.categorie_id ?? "all"}
            onValueChange={(value) => navigateWithFilter("categorie_id", value)}
            placeholder="Catégorie"
            className="w-44"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left">
          <thead className="border-b border-slate-200 bg-white text-xs tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3"><SortButton label="ID Ticket" sortKey="reference" onSort={updateSort} /></th>
              <th className="px-2 py-3"><SortButton label="Titre" sortKey="titre" onSort={updateSort} /></th>
              <th className="px-4 py-3 font-semibold">Catégorie</th>
              <th className="px-4 py-3"><SortButton label="Statut" sortKey="statut" onSort={updateSort} /></th>
              <th className="px-4 py-3"><SortButton label="Priorité" sortKey="priorite" onSort={updateSort} /></th>
              <th className="px-4 py-3 font-semibold">Assigné à</th>
              <th className="px-4 py-3"><SortButton label="Créé le" sortKey="created_at" onSort={updateSort} /></th>
              <th className="px-4 py-3 font-semibold">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {visibleTickets.map((ticket, index) => (
              <motion.tr
                key={ticket.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: index * 0.03 }}
                className="transition-colors hover:bg-slate-50"
              >
                <td className="px-4 py-3 text-sm whitespace-nowrap font-medium text-tertiary">{ticket.reference}</td>
                <td className="px-4 py-3">
                  <div className="min-w-60 max-w-md">
                    <p className="font-semibold text-slate-800">{ticket.titre}</p>
                    <p className="mt-1 line-clamp-1 text-xs text-slate-500">{ticket.description}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">{ticket.categorie?.libelle ?? "Sans catégorie"}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[ticket.statut]}`}>
                    {statusLabels[ticket.statut]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${priorityStyles[ticket.priorite]}`}>
                    {priorityLabels[ticket.priorite]}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">{ticket.technicien_assigne?.nom_complet ?? "Non assigné"}</td>
                <td className="px-4 py-3 text-sm whitespace-nowrap text-slate-600">{formatDate(ticket.created_at)}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/dashboard/client/tickets/${ticket.id}`}
                    aria-label={`Voir le ticket ${ticket.reference}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
                  >
                    <Eye size={15} />
                    Voir
                  </Link>
                </td>
              </motion.tr>
            ))}

            {!visibleTickets.length && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-sm text-slate-500">
                  Aucun ticket ne correspond à vos filtres.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <span>
          {pagination.total === 0
            ? "Aucun ticket"
            : `${pagination.from}–${pagination.to} sur ${pagination.total} tickets`}
        </span>
        <div className="flex items-center gap-2">
          <span>Page {pagination.current_page} sur {pagination.last_page}</span>
          <button
            type="button"
            onClick={() => navigateWithFilter("page", String(pagination.current_page - 1))}
            disabled={pagination.current_page <= 1 || isPending}
            aria-label="Page précédente"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 disabled:opacity-40"
          >
            <ChevronLeft size={17} />
          </button>
          <button
            type="button"
            onClick={() => navigateWithFilter("page", String(pagination.current_page + 1))}
            disabled={pagination.current_page >= pagination.last_page || isPending}
            aria-label="Page suivante"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 disabled:opacity-40"
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
    </motion.section>
  );
}
