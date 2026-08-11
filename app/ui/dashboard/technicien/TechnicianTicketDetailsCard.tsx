"use client";

import { type FormEvent, type ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArchiveRestore,
  ArrowRightLeft,
  CirclePause,
  Search,
  Pencil,
  Play,
} from "lucide-react";
import { toast } from "sonner";
import TicketStatusStepper from "@/app/ui/dashboard/TicketStatusStepper";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  priorityStyles,
  statusStyles,
  ticketPriorityLabels,
  ticketStatusLabels,
} from "@/lib/styles";
import {
  techniciansSelectionResponseSchema,
  type TechnicianSelection,
  type TicketDetail,
  type TicketPriority,
  type TicketStatus,
} from "@/lib/ticket-contracts";

const priorityOptions: Array<{ value: TicketPriority; label: string }> = [
  { value: "basse", label: "Basse" },
  { value: "normale", label: "Normale" },
  { value: "haute", label: "Haute" },
  { value: "urgente", label: "Urgente" },
];

type ApiErrorBody = { message?: string; errors?: Record<string, string[]> };

async function responseError(response: Response, fallback: string) {
  const body = await response.json().catch(() => ({})) as ApiErrorBody;
  return Object.values(body.errors ?? {}).flat()[0] ?? body.message ?? fallback;
}

function formatDate(value: string) {
  const date = new Date(value.replace(" ", "T"));
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
}

function technicianLabel(technician: TechnicianSelection) {
  return technician.specialite
    ? `${technician.nom_complet} — ${technician.specialite}`
    : technician.nom_complet;
}

function ConfirmationAction({
  title,
  description,
  label,
  icon,
  pending,
  onConfirm,
}: {
  title: string;
  description: string;
  label: string;
  icon: ReactNode;
  pending: boolean;
  onConfirm: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="gap-2">{icon}{label}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-base">{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild><Button type="button" variant="outline" disabled={pending}>Annuler</Button></DialogClose>
          <Button
            type="button"
            disabled={pending}
            className="gap-2 bg-primary-container text-on-primary-container"
            onClick={async () => {
              try {
                await onConfirm();
                setOpen(false);
              } catch {
                // L'action affiche déjà le détail de l'erreur et le dialogue reste ouvert.
              }
            }}
          >
            {pending && <Spinner />}{pending ? "Traitement…" : "Confirmer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function TechnicianTicketDetailsCard({ ticket }: { ticket: TicketDetail }) {
  const router = useRouter();
  const [status, setStatus] = useState<TicketStatus>(ticket.statut);
  const [priority, setPriority] = useState<TicketPriority>(ticket.priorite);
  const [selectedPriority, setSelectedPriority] = useState<TicketPriority>(ticket.priorite);
  const [priorityDialogOpen, setPriorityDialogOpen] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState<TechnicianSelection | null>(null);
  const [technicianQuery, setTechnicianQuery] = useState("");
  const [technicians, setTechnicians] = useState<TechnicianSelection[]>([]);
  const [technicianListOpen, setTechnicianListOpen] = useState(false);
  const [techniciansLoading, setTechniciansLoading] = useState(false);
  const [transferReason, setTransferReason] = useState("");
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const PriorityIcon = priorityStyles[priority].icon;
  const isAssigned = Boolean(ticket.technicien_assigne);
  const isClosed = status === "resolu" || status === "ferme";

  useEffect(() => {
    if (!transferDialogOpen) return;
    if (selectedTechnician && technicianQuery === technicianLabel(selectedTechnician)) return;

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setTechniciansLoading(true);
      const params = new URLSearchParams();
      if (technicianQuery.trim()) params.set("search", technicianQuery.trim());

      try {
        const response = await fetch(
          `/api/techniciens${params.size ? `?${params}` : ""}`,
          { headers: { Accept: "application/json" }, signal: controller.signal },
        );
        if (!response.ok) throw new Error(await responseError(response, "Impossible de charger les techniciens."));
        const data: unknown = await response.json();
        const parsed = techniciansSelectionResponseSchema.safeParse(data);
        if (!parsed.success) throw new Error("La liste des techniciens est invalide.");
        setTechnicians(Array.isArray(parsed.data) ? parsed.data : parsed.data.data);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setTechnicians([]);
          toast.error("Chargement impossible", {
            description: error instanceof Error ? error.message : "Impossible de charger les techniciens.",
          });
        }
      } finally {
        if (!controller.signal.aborted) setTechniciansLoading(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [selectedTechnician, technicianQuery, transferDialogOpen]);

  async function savePriority(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selectedPriority === priority) return setPriorityDialogOpen(false);
    setPendingAction("priority");

    try {
      const response = await fetch(`/api/tickets/${ticket.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priorite: selectedPriority }),
      });
      if (!response.ok) throw new Error(await responseError(response, "La priorité n'a pas pu être modifiée."));
      setPriority(selectedPriority);
      setPriorityDialogOpen(false);
      toast.success("Priorité modifiée");
      router.refresh();
    } catch (error) {
      toast.error("Modification impossible", { description: error instanceof Error ? error.message : "Une erreur est survenue." });
    } finally {
      setPendingAction(null);
    }
  }

  async function transition(endpoint: string, nextStatus: TicketStatus, successMessage: string) {
    setPendingAction(endpoint);
    try {
      const response = await fetch(`/api/tickets/${ticket.id}/${endpoint}`, { method: "POST" });
      if (!response.ok) throw new Error(await responseError(response, "Le statut n'a pas pu être modifié."));
      setStatus(nextStatus);
      toast.success(successMessage);
      router.refresh();
    } catch (error) {
      toast.error("Action impossible", { description: error instanceof Error ? error.message : "Une erreur est survenue." });
      throw error;
    } finally {
      setPendingAction(null);
    }
  }

  async function transferTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPendingAction("transfer");
    try {
      const response = await fetch(`/api/tickets/${ticket.id}/assignation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          technicien_id: selectedTechnician?.id,
          ...(transferReason.trim() ? { motif: transferReason.trim() } : {}),
        }),
      });
      if (!response.ok) throw new Error(await responseError(response, "Le ticket n'a pas pu être transféré."));
      toast.success("Ticket transféré", { description: "Le ticket a été confié au nouveau technicien." });
      setTransferDialogOpen(false);
      router.push("/dashboard/technicien/tickets");
      router.refresh();
    } catch (error) {
      toast.error("Transfert impossible", { description: error instanceof Error ? error.message : "Une erreur est survenue." });
    } finally {
      setPendingAction(null);
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-outline-variant/30 bg-white shadow-sm">
      <div className="border-b border-outline-variant/20 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-on-surface-variant">Ticket</p>
            <h1 className="mt-1 text-2xl font-bold text-tertiary">#{ticket.reference}</h1>
          </div>

          <div className="flex flex-wrap gap-2">
            {isAssigned && !isClosed && (
              <Dialog open={priorityDialogOpen} onOpenChange={(open) => {
                setPriorityDialogOpen(open);
                if (open) setSelectedPriority(priority);
              }}>
                <DialogTrigger asChild><Button type="button" variant="outline" className="gap-2"><Pencil size={16} />Modifier</Button></DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <form onSubmit={savePriority}>
                    <DialogHeader>
                      <DialogTitle>Modifier la priorité</DialogTitle>
                      <DialogDescription>Choisissez le nouveau niveau de priorité du ticket.</DialogDescription>
                    </DialogHeader>
                    <Field className="py-5">
                      <FieldLabel htmlFor="ticket-priority">Priorité</FieldLabel>
                      <Select value={selectedPriority} onValueChange={(value) => setSelectedPriority(value as TicketPriority)}>
                        <SelectTrigger id="ticket-priority" className="w-full"><SelectValue /></SelectTrigger>
                        <SelectContent>{priorityOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectContent>
                      </Select>
                    </Field>
                    <DialogFooter>
                      <DialogClose asChild><Button type="button" variant="outline" disabled={pendingAction === "priority"}>Annuler</Button></DialogClose>
                      <Button type="submit" disabled={pendingAction === "priority"} className="gap-2 bg-primary-container text-on-primary-container">
                        {pendingAction === "priority" && <Spinner />}{pendingAction === "priority" ? "Enregistrement…" : "Enregistrer"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}

            {status === "en_cours" && (
              <ConfirmationAction
                title="Mettre le ticket en attente ?"
                description="Le traitement sera suspendu jusqu'à sa reprise."
                label="Mettre en attente"
                icon={<CirclePause size={16} />}
                pending={pendingAction === "mettre-en-attente"}
                onConfirm={() => transition("mettre-en-attente", "en_attente", "Ticket mis en attente")}
              />
            )}
            {status === "en_attente" && (
              <ConfirmationAction
                title="Reprendre le traitement ?"
                description="Le ticket repassera en cours de traitement."
                label="Reprendre"
                icon={<Play size={16} />}
                pending={pendingAction === "reprendre"}
                onConfirm={() => transition("reprendre", "en_cours", "Traitement repris")}
              />
            )}
            {isClosed && (
              <ConfirmationAction
                title="Rouvrir ce ticket ?"
                description="Le ticket repassera en cours de traitement."
                label="Rouvrir"
                icon={<ArchiveRestore size={16} />}
                pending={pendingAction === "reouvrir"}
                onConfirm={() => transition("reouvrir", "en_cours", "Ticket rouvert")}
              />
            )}

            {isAssigned && !isClosed && (
              <Dialog open={transferDialogOpen} onOpenChange={(open) => {
                setTransferDialogOpen(open);
                if (!open) {
                  setSelectedTechnician(null);
                  setTechnicianQuery("");
                  setTechnicians([]);
                  setTechnicianListOpen(false);
                  setTransferReason("");
                }
              }}>
                <DialogTrigger asChild><Button type="button" variant="outline" className="gap-2 border-tertiary text-tertiary"><ArrowRightLeft size={16} />Transférer</Button></DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <form onSubmit={transferTicket}>
                    <DialogHeader>
                      <DialogTitle>Transférer ce ticket ?</DialogTitle>
                      <DialogDescription>Le ticket quittera votre file et sera assigné au technicien indiqué.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-5">
                      <Field>
                        <FieldLabel htmlFor="transfer-technician">Nouveau technicien *</FieldLabel>
                        <div
                          className="relative"
                          onBlur={(event) => {
                            if (!event.currentTarget.contains(event.relatedTarget)) setTechnicianListOpen(false);
                          }}
                        >
                          <Search className="pointer-events-none absolute left-3 top-3 z-10 size-4 text-on-surface-variant" />
                          <Input
                            id="transfer-technician"
                            role="combobox"
                            aria-autocomplete="list"
                            aria-controls="transfer-technician-options"
                            aria-expanded={technicianListOpen}
                            value={technicianQuery}
                            onFocus={() => setTechnicianListOpen(true)}
                            onChange={(event) => {
                              setTechnicianQuery(event.target.value);
                              setSelectedTechnician(null);
                              setTechnicianListOpen(true);
                            }}
                            className="pl-10"
                            placeholder="Rechercher par nom, e-mail ou spécialité…"
                            autoComplete="off"
                          />
                          {technicianListOpen && (
                            <div
                              id="transfer-technician-options"
                              role="listbox"
                              className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-outline-variant/30 bg-white p-1 shadow-lg"
                            >
                              {techniciansLoading ? (
                                <div className="flex items-center justify-center gap-2 px-3 py-6 text-sm text-on-surface-variant"><Spinner />Recherche des techniciens…</div>
                              ) : technicians.length ? technicians.map((technician) => (
                                <button
                                  key={technician.id}
                                  type="button"
                                  role="option"
                                  aria-selected={selectedTechnician?.id === technician.id}
                                  className="w-full rounded-md px-3 py-2.5 text-left hover:bg-surface-container-low"
                                  onMouseDown={(event) => event.preventDefault()}
                                  onClick={() => {
                                    setSelectedTechnician(technician);
                                    setTechnicianQuery(technicianLabel(technician));
                                    setTechnicianListOpen(false);
                                  }}
                                >
                                  <span className="flex items-start justify-between gap-3">
                                    <span className="min-w-0">
                                      <span className="block font-semibold text-on-surface">{technician.nom_complet}</span>
                                      <span className="block truncate text-xs text-on-surface-variant">{technician.specialite ?? technician.email}</span>
                                    </span>
                                    <span className="shrink-0 rounded-full bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                                      {technician.tickets_en_cours} en cours
                                    </span>
                                  </span>
                                </button>
                              )) : (
                                <p className="px-3 py-6 text-center text-sm text-on-surface-variant">Aucun technicien actif trouvé.</p>
                              )}
                            </div>
                          )}
                        </div>
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="transfer-reason">Motif <span className="font-normal text-on-surface-variant">(facultatif)</span></FieldLabel>
                        <Textarea id="transfer-reason" value={transferReason} onChange={(event) => setTransferReason(event.target.value)} maxLength={500} className="min-h-24" placeholder="Expliquez brièvement le transfert…" />
                      </Field>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild><Button type="button" variant="outline" disabled={pendingAction === "transfer"}>Annuler</Button></DialogClose>
                      <Button type="submit" disabled={pendingAction === "transfer" || !selectedTechnician} className="gap-2 bg-tertiary text-white">
                        {pendingAction === "transfer" && <Spinner />}{pendingAction === "transfer" ? "Transfert…" : "Confirmer le transfert"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>

      <div className="p-5"><TicketStatusStepper currentStatus={status} /></div>

      <div className="border-t border-outline-variant/20 p-5">
        <p className="text-sm font-semibold text-on-surface-variant">Sujet</p>
        <h2 className="mt-2 text-xl font-bold leading-snug text-on-surface">{ticket.titre}</h2>
        <p className="mt-6 text-sm font-semibold text-on-surface-variant">Description</p>
        <p className="mt-2 whitespace-pre-line leading-7 text-on-surface">{ticket.description}</p>

        <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 text-sm">
          <div><p className="text-on-surface-variant">Statut</p><span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[status].base}`}>{ticketStatusLabels[status]}</span></div>
          <div><p className="text-on-surface-variant">Priorité</p><span className={`mt-2 inline-flex items-center gap-1.5 text-sm font-semibold ${priorityStyles[priority].base}`}>
            {PriorityIcon && <PriorityIcon size={15} />}{ticketPriorityLabels[priority]}
          </span></div>
          <div><p className="text-on-surface-variant">Catégorie</p><p className="mt-1 font-semibold text-on-surface">{ticket.categorie?.libelle ?? "Sans catégorie"}</p></div>
          <div><p className="text-on-surface-variant">Technicien assigné</p><p className="mt-1 font-semibold text-on-surface">{ticket.technicien_assigne?.nom_complet ?? "Non assigné"}</p></div>
          <div><p className="text-on-surface-variant">Créé le</p><p className="mt-1 font-semibold text-on-surface">{formatDate(ticket.created_at)}</p></div>
          <div><p className="text-on-surface-variant">Dernière mise à jour</p><p className="mt-1 font-semibold text-on-surface">{formatDate(ticket.updated_at)}</p></div>
        </div>
      </div>
    </section>
  );
}
