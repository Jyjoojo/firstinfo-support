"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Eye,
  RotateCcw,
  Search,
  UserRoundCheck,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import CreateTicketDialog from "@/app/ui/dashboard/CreateTicketDialog";
import {
  priorityStyles,
  statusStyles,
  ticketPriorityLabels,
  ticketStatusLabels,
} from "@/lib/styles";
import type {
  ApiCategory,
  ClientTicket,
  TicketPriority,
  TicketStatus,
} from "@/lib/ticket-contracts";

type TicketView = "mine" | "unassigned";

const PAGE_SIZE = 8;

const statusOptions: TicketStatus[] = [
  "nouveau",
  "en_cours",
  "en_attente",
  "resolu",
  "ferme",
];

const priorityOptions: TicketPriority[] = [
  "basse",
  "normale",
  "haute",
  "urgente",
];

const priorityTextColors: Record<TicketPriority, string> = {
  basse: "text-emerald-700",
  normale: "text-sky-700",
  haute: "text-amber-700",
  urgente: "text-red-700",
};

type TechnicianTicketsWorkspaceProps = {
  myTickets: ClientTicket[];
  unassignedTickets: ClientTicket[];
  categories: ApiCategory[];
};

export default function TechnicianTicketsWorkspace({
  myTickets,
  unassignedTickets,
  categories: ticketCategories,
}: TechnicianTicketsWorkspaceProps) {
  const router = useRouter();
  const [assignedTickets, setAssignedTickets] = useState(myTickets);
  const [availableTickets, setAvailableTickets] = useState(unassignedTickets);
  const [activeView, setActiveView] = useState<TicketView>("mine");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [priority, setPriority] = useState("all");
  const [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [dateDialogOpen, setDateDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [ticketToClaim, setTicketToClaim] = useState<ClientTicket | null>(null);

  const sourceTickets =
    activeView === "mine" ? assignedTickets : availableTickets;

  const categories = useMemo(
    () =>
      [...new Set(sourceTickets.map(
        (ticket) => ticket.categorie?.libelle ?? "Sans catégorie",
      ))].sort(),
    [sourceTickets],
  );

  const filteredTickets = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("fr-FR");

    return sourceTickets.filter((ticket) => {
      const ticketDate = new Date(ticket.created_at.replace(" ", "T"));
      const categoryLabel = ticket.categorie?.libelle ?? "Sans catégorie";
      const matchesSearch =
        !query
        || [ticket.reference, ticket.titre, ticket.description, categoryLabel]
          .join(" ")
          .toLocaleLowerCase("fr-FR")
          .includes(query);
      const matchesCategory =
        category === "all" || categoryLabel === category;
      const matchesPriority =
        priority === "all" || ticket.priorite === priority;
      const matchesStatus =
        activeView === "unassigned"
        || status === "all"
        || ticket.statut === status;
      const matchesStart =
        !dateRange?.from || ticketDate >= dateRange.from;
      const matchesEnd =
        !dateRange?.to
        || ticketDate <= new Date(
          dateRange.to.getFullYear(),
          dateRange.to.getMonth(),
          dateRange.to.getDate(),
          23,
          59,
          59,
        );

      return (
        matchesSearch
        && matchesCategory
        && matchesPriority
        && matchesStatus
        && matchesStart
        && matchesEnd
      );
    });
  }, [
    activeView,
    category,
    dateRange,
    priority,
    search,
    sourceTickets,
    status,
  ]);

  const pageCount = Math.max(1, Math.ceil(filteredTickets.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visibleTickets = filteredTickets.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const resetFilters = () => {
    setSearch("");
    setCategory("all");
    setPriority("all");
    setStatus("all");
    setDateRange(undefined);
    setPage(1);
  };

  const changeView = (value: string) => {
    setActiveView(value as TicketView);
    resetFilters();
  };

  const dateLabel = dateRange?.from
    ? dateRange.to
      ? `${dateRange.from.toLocaleDateString("fr-FR")} – ${dateRange.to.toLocaleDateString("fr-FR")}`
      : dateRange.from.toLocaleDateString("fr-FR")
    : "Date de création";

  return (
    <>
      <Tabs value={activeView} onValueChange={changeView}>
        <TabsList className="mb-4 w-full bg-on-secondary-fixed-variant/10">
          <TabsTrigger value="mine">
            Mes tickets
            <span className="rounded-full bg-primary-container/20 px-2 py-0.5 text-xs text-primary">
              {assignedTickets.length}
            </span>
          </TabsTrigger>
          <TabsTrigger value="unassigned">
            Ouverts non assignés
            <span className="rounded-full bg-primary-container/20 px-2 py-0.5 text-xs text-primary">
              {availableTickets.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <div className="overflow-hidden rounded-2xl border border-outline-variant/20 bg-white shadow-sm">
          <div className="border-b border-outline-variant/20 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full max-w-md">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                />
                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Rechercher par ID, sujet, contenu ou catégorie…"
                  className="h-10 w-full rounded-lg border border-outline-variant/30 bg-white py-2 pl-10 pr-3 text-sm outline-none transition focus:border-primary"
                />
              </div>

              <CreateTicketDialog
                categories={ticketCategories}
                onCreated={(ticket) => {
                  setAvailableTickets((tickets) => [
                    ticket,
                    ...tickets.filter((item) => item.id !== ticket.id),
                  ]);
                  setPage(1);
                }}
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Select
                value={category}
                onValueChange={(value) => {
                  setCategory(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="min-w-48">
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {activeView === "mine" && (
                <Select
                  value={status}
                  onValueChange={(value) => {
                    setStatus(value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="min-w-40">
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    {statusOptions.map((item) => (
                      <SelectItem key={item} value={item}>
                        {ticketStatusLabels[item]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Select
                value={priority}
                onValueChange={(value) => {
                  setPriority(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="min-w-40">
                  <SelectValue placeholder="Toutes les priorités" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les priorités</SelectItem>
                    {priorityOptions.map((item) => (
                      <SelectItem key={item} value={item}>
                        {ticketPriorityLabels[item]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <button
                type="button"
                onClick={() => setDateDialogOpen(true)}
                className="inline-flex h-9 items-center gap-2 rounded-md border border-outline-variant/30 bg-white px-3 text-sm text-on-surface"
              >
                <CalendarDays size={16} />
                {dateLabel}
              </button>

              <button
                type="button"
                onClick={resetFilters}
                title="Réinitialiser les filtres"
                aria-label="Réinitialiser les filtres"
                className="inline-flex size-9 items-center justify-center rounded-md border border-outline-variant/30 text-on-surface-variant hover:bg-surface-container-low"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>

          <TabsContent value="mine" className="mt-0">
            <TicketsTable tickets={visibleTickets} mode="mine" />
          </TabsContent>
          <TabsContent value="unassigned" className="mt-0">
            <TicketsTable
              tickets={visibleTickets}
              mode="unassigned"
              onClaim={setTicketToClaim}
            />
          </TabsContent>

          <div className="flex flex-col gap-3 border-t border-outline-variant/20 px-5 py-4 text-sm text-on-surface-variant sm:flex-row sm:items-center sm:justify-between">
            <span>
              Affichage{" "}
              {filteredTickets.length
                ? (currentPage - 1) * PAGE_SIZE + 1
                : 0}
              -{Math.min(currentPage * PAGE_SIZE, filteredTickets.length)} sur{" "}
              {filteredTickets.length} tickets
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                disabled={currentPage === 1}
                aria-label="Page précédente"
                className="inline-flex size-9 items-center justify-center rounded-lg border border-outline-variant/30 disabled:opacity-40"
              >
                <ChevronLeft size={17} />
              </button>
              <span>
                Page {currentPage} sur {pageCount}
              </span>
              <button
                type="button"
                onClick={() =>
                  setPage((value) => Math.min(pageCount, value + 1))
                }
                disabled={currentPage === pageCount}
                aria-label="Page suivante"
                className="inline-flex size-9 items-center justify-center rounded-lg border border-outline-variant/30 disabled:opacity-40"
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        </div>
      </Tabs>

      <Dialog open={dateDialogOpen} onOpenChange={setDateDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Filtrer par date de création</DialogTitle>
            <DialogDescription>
              Sélectionnez une date de début et une date de fin.
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-x-auto">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={(range: DateRange | undefined) => {
                setDateRange(range);
                setPage(1);
              }}
              numberOfMonths={2}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={() => setDateDialogOpen(false)}
            >
              Appliquer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ClaimTicketDialog
        ticket={ticketToClaim}
        onOpenChange={(open) => !open && setTicketToClaim(null)}
        onClaimed={(ticket) => {
          const claimedTicket = { ...ticket, statut: "en_cours" as const };
          setAvailableTickets((tickets) =>
            tickets.filter((item) => item.id !== ticket.id),
          );
          setAssignedTickets((tickets) => [
            claimedTicket,
            ...tickets.filter((item) => item.id !== ticket.id),
          ]);
          setPage(1);
          setTicketToClaim(null);
          router.refresh();
        }}
      />
    </>
  );
}

function TicketsTable({
  tickets,
  mode,
  onClaim,
}: {
  tickets: ClientTicket[];
  mode: TicketView;
  onClaim?: (ticket: ClientTicket) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-230 text-left text-sm">
        <thead className="bg-surface-container-low text-xs uppercase tracking-wider text-on-surface-variant">
          <tr>
            <th className="px-5 py-4 font-semibold">ID ticket</th>
            <th className="px-4 py-4 font-semibold">Sujet</th>
            <th className="px-4 py-4 font-semibold">Catégorie</th>
            <th className="px-4 py-4 font-semibold">Statut</th>
            <th className="px-4 py-4 font-semibold">Priorité</th>
            {mode === "mine" && (
              <th className="px-4 py-4 font-semibold">Assigné à</th>
            )}
            <th className="px-4 py-4 font-semibold">Créé le</th>
            <th className="px-5 py-4 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/15">
          {tickets.map((ticket, index) => {
            const PriorityIcon = priorityStyles[ticket.priorite].icon;

            return (
              <motion.tr
                key={ticket.id}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.22, delay: index * 0.04 }}
                className="hover:bg-surface-container-low/70"
              >
                <td className="px-5 py-4 font-semibold text-tertiary">
                  {ticket.reference}
                </td>
                <td className="max-w-72 px-4 py-4">
                  <p className="truncate font-semibold text-on-surface">
                    {ticket.titre}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-on-surface-variant">
                    {ticket.description}
                  </p>
                </td>
                <td className="px-4 py-4 text-on-surface">
                  {ticket.categorie?.libelle ?? "Sans catégorie"}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[ticket.statut].base}`}
                  >
                    {ticketStatusLabels[ticket.statut]}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold ${priorityTextColors[ticket.priorite]}`}
                  >
                    {PriorityIcon && <PriorityIcon size={14} />}
                    {ticketPriorityLabels[ticket.priorite]}
                  </span>
                </td>
                {mode === "mine" && (
                  <td className="px-4 py-4 font-medium text-on-surface">
                    {ticket.technicien_assigne?.nom_complet ?? "Vous"}
                  </td>
                )}
                <td className="px-4 py-4 whitespace-nowrap text-on-surface-variant">
                  {new Date(ticket.created_at.replace(" ", "T")).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-5 py-4 text-right">
                  {mode === "mine" ? (
                    <Link
                      href={`/dashboard/technicien/tickets/${ticket.id}`}
                      title="Voir les détails"
                      aria-label={`Voir les détails du ticket ${ticket.reference}`}
                      className="inline-flex size-9 items-center justify-center rounded-lg text-primary hover:bg-primary/10"
                    >
                      <Eye size={17} />
                    </Link>
                  ) : (
                    <Button
                      className="bg-tertiary/90 cursor-pointer hover:bg-tertiary"
                      type="button"
                      size="sm"
                      onClick={() => onClaim?.(ticket)}
                    >
                      <UserRoundCheck size={16} />
                      S&apos;assigner
                    </Button>
                  )}
                </td>
              </motion.tr>
            );
          })}

          {tickets.length === 0 && (
            <tr>
              <td
                colSpan={mode === "mine" ? 8 : 7}
                className="px-5 py-12 text-center text-on-surface-variant"
              >
                Aucun ticket ne correspond aux filtres sélectionnés.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function ClaimTicketDialog({
  ticket,
  onOpenChange,
  onClaimed,
}: {
  ticket: ClientTicket | null;
  onOpenChange: (open: boolean) => void;
  onClaimed: (ticket: ClientTicket) => void;
}) {
  const [pending, setPending] = useState(false);

  const confirmClaim = async () => {
    if (!ticket) {
      return;
    }

    setPending(true);

    try {
      const response = await fetch(
        `/api/tickets/${encodeURIComponent(ticket.id)}/auto-assigner`,
        {
          method: "POST",
          headers: { Accept: "application/json" },
        },
      );
      const result = await response.json().catch(() => null) as
        | { message?: string; errors?: Record<string, string[]> }
        | null;

      if (!response.ok) {
        const validationMessage = result?.errors
          ? Object.values(result.errors).flat()[0]
          : undefined;
        throw new Error(
          validationMessage
          ?? result?.message
          ?? "Impossible de vous assigner ce ticket.",
        );
      }

      toast.success("Ticket assigné", {
        description: result?.message
          ?? `Le ticket ${ticket.reference} vous a bien été assigné.`,
      });
      onClaimed(ticket);
    } catch (error) {
      toast.error("Échec de l’assignation", {
        description:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue pendant l’assignation du ticket.",
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={Boolean(ticket)} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Prendre en charge ce ticket ?</DialogTitle>
          <DialogDescription className="text-base">
            Le ticket {ticket?.reference} vous sera assigné et apparaîtra ensuite dans
            l&apos;onglet Mes tickets.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={pending}>
              Annuler
            </Button>
          </DialogClose>
          <Button type="button" className="bg-tertiary" onClick={confirmClaim} disabled={pending}>
            <UserRoundCheck size={16} />
            {pending ? "Assignation…" : "M’assigner le ticket"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
