"use client";

import {
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Search,
} from "lucide-react";
import { motion } from "motion/react";
import SelectFilter from "@/app/ui/dashboard/SelectFiltre";
import { priorityStyles, statusStyles } from "@/lib/styles";
import type { Ticket } from "@/lib/tickets";

type SortKey =
  | "id"
  | "titre"
  | "categorie"
  | "statut"
  | "priorite"
  | "assigneA"
  | "dateCreation";

const statusOptions = [
  { value: "all", label: "Tous les statuts" },
  { value: "nouveau", label: "Nouveau" },
  { value: "en cours", label: "En cours" },
  { value: "résolu", label: "Résolu" },
  { value: "fermé", label: "Fermé" },
];

const priorityOptions = [
  { value: "all", label: "Toutes priorités" },
  { value: "basse", label: "Basse" },
  { value: "normale", label: "Normale" },
  { value: "haute", label: "Haute" },
  { value: "urgente", label: "Urgente" },
];

function StatusBadge({
  status,
}: {
  status: Ticket["statut"];
}) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[status].base}`}
    >
      {status}
    </span>
  );
}

function PriorityBadge({
  priority,
}: {
  priority: Ticket["priorite"];
}) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${priorityStyles[priority].base}`}
    >
      {priority}
    </span>
  );
}

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

export default function TicketsTable({
  tickets,
}: {
  tickets: Ticket[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | Ticket["statut"]
  >("all");
  const [priorityFilter, setPriorityFilter] = useState<
    "all" | Ticket["priorite"]
  >("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("titre");
  const [sortAscending, setSortAscending] = useState(true);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const categories = useMemo(
    () =>
      [...new Set(tickets.map((ticket) => ticket.categorie))].sort(),
    [tickets],
  );

  const categoryOptions = useMemo(
    () => [
      {
        value: "all",
        label: "Toutes catégories",
      },
      ...categories.map((category) => ({
        value: category,
        label: category,
      })),
    ],
    [categories],
  );

  const filteredTickets = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .toLocaleLowerCase("fr-FR");

    return tickets.filter((ticket) => {
      const matchesSearch =
        !normalizedSearch
        || [
          ticket.id,
          ticket.titre,
          ticket.contenu,
          ticket.categorie,
          ticket.assigneA,
        ]
          .join(" ")
          .toLocaleLowerCase("fr-FR")
          .includes(normalizedSearch);
      const matchesStatus =
        statusFilter === "all"
        || ticket.statut === statusFilter;
      const matchesPriority =
        priorityFilter === "all"
        || ticket.priorite === priorityFilter;
      const matchesCategory =
        categoryFilter === "all"
        || ticket.categorie === categoryFilter;

      return (
        matchesSearch
        && matchesStatus
        && matchesPriority
        && matchesCategory
      );
    });
  }, [
    categoryFilter,
    priorityFilter,
    searchTerm,
    statusFilter,
    tickets,
  ]);

  const sortedTickets = useMemo(
    () =>
      [...filteredTickets].sort((first, second) => {
        const firstValue = String(first[sortKey] ?? "");
        const secondValue = String(second[sortKey] ?? "");
        const comparison = firstValue.localeCompare(
          secondValue,
          "fr-FR",
          {
            numeric: true,
          },
        );

        return sortAscending
          ? comparison
          : -comparison;
      }),
    [filteredTickets, sortAscending, sortKey],
  );

  const pageCount = Math.max(
    Math.ceil(sortedTickets.length / rowsPerPage),
    1,
  );
  const currentPage = Math.min(page, pageCount);
  const visibleTickets = sortedTickets.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const updateSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAscending((ascending) => !ascending);
    } else {
      setSortKey(key);
      setSortAscending(true);
    }

    setPage(1);
  };

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 20,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration: 0.45,
        ease: "easeOut",
      }}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setPage(1);
            }}
            placeholder="Rechercher un ticket"
            className="w-75 rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none ring-0 transition focus:border-sky-400"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <SelectFilter
            items={statusOptions}
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(
                value as "all" | Ticket["statut"],
              );
              setPage(1);
            }}
            placeholder="Statut"
            className="w-38"
          />
          <SelectFilter
            items={priorityOptions}
            value={priorityFilter}
            onValueChange={(value) => {
              setPriorityFilter(
                value as "all" | Ticket["priorite"],
              );
              setPage(1);
            }}
            placeholder="Priorité"
            className="w-38"
          />
          <SelectFilter
            items={categoryOptions}
            value={categoryFilter}
            onValueChange={(value) => {
              setCategoryFilter(value);
              setPage(1);
            }}
            placeholder="Catégorie"
            className="w-38"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left">
          <thead className="border-b border-slate-200 bg-white text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">
                <SortButton
                  label="ID Ticket"
                  sortKey="id"
                  onSort={updateSort}
                />
              </th>
              <th className="px-4 py-3">
                <SortButton
                  label="Titre"
                  sortKey="titre"
                  onSort={updateSort}
                />
              </th>
              <th className="px-4 py-3">
                <SortButton
                  label="Catégorie"
                  sortKey="categorie"
                  onSort={updateSort}
                />
              </th>
              <th className="px-4 py-3">
                <SortButton
                  label="Statut"
                  sortKey="statut"
                  onSort={updateSort}
                />
              </th>
              <th className="px-4 py-3">
                <SortButton
                  label="Priorité"
                  sortKey="priorite"
                  onSort={updateSort}
                />
              </th>
              <th className="px-4 py-3">
                <SortButton
                  label="Assigné à"
                  sortKey="assigneA"
                  onSort={updateSort}
                />
              </th>
              <th className="px-4 py-3">
                <SortButton
                  label="Créé le"
                  sortKey="dateCreation"
                  onSort={updateSort}
                />
              </th>
              <th className="px-4 py-3 font-semibold">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {visibleTickets.map((ticket, index) => (
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
                className="transition-colors hover:bg-slate-50"
              >
                <td className="px-4 py-3 text-sm font-medium text-tertiary">
                  {ticket.id}
                </td>
                <td className="px-4 py-3">
                  <div className="min-w-60">
                    <p className="font-semibold text-slate-800">
                      {ticket.titre}
                    </p>
                    <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                      {ticket.contenu}
                    </p>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">
                  {ticket.categorie}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={ticket.statut} />
                </td>
                <td className="px-4 py-3">
                  <PriorityBadge priority={ticket.priorite} />
                </td>
                <td className="px-4 py-3 text-sm text-slate-700">
                  {ticket.assigneA ?? "Non assigné"}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {new Date(ticket.dateCreation).toLocaleDateString(
                    "fr-FR",
                  )}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/dashboard/client/tickets/${ticket.id}`}
                    aria-label={`Voir le ticket ${ticket.id}`}
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
                <td
                  colSpan={8}
                  className="px-4 py-10 text-center text-sm text-slate-500"
                >
                  Aucun ticket ne correspond à vos filtres.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span>
            Lignes par page
          </span>
          <select
            value={rowsPerPage}
            onChange={(event) => {
              setRowsPerPage(Number(event.target.value));
              setPage(1);
            }}
            aria-label="Lignes par page"
            className="h-9 rounded-lg border border-slate-200 bg-white px-2 outline-none focus:border-sky-400"
          >
            {[5, 8, 10, 15].map((value) => (
              <option
                key={value}
                value={value}
              >
                {value}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span>
            Page {currentPage} sur {pageCount}
          </span>
          <button
            type="button"
            onClick={() =>
              setPage((value) => Math.max(1, value - 1))
            }
            disabled={currentPage === 1}
            aria-label="Page précédente"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 disabled:opacity-40"
          >
            <ChevronLeft size={17} />
          </button>
          <button
            type="button"
            onClick={() =>
              setPage((value) => Math.min(pageCount, value + 1))
            }
            disabled={currentPage === pageCount}
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
