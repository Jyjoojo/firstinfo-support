"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArchiveRestore,
  CheckCircle2,
  Pencil,
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
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { priorityStyles, statusStyles } from "@/lib/styles";
import type { Ticket } from "@/lib/tickets";

const priorityOptions: Array<{
  value: Ticket["priorite"];
  label: string;
}> = [
  { value: "basse", label: "Basse" },
  { value: "normale", label: "Normale" },
  { value: "haute", label: "Haute" },
  { value: "urgente", label: "Urgente" },
];

type TicketPatch =
  | { action: "close" | "reopen" }
  | { priorite: Ticket["priorite"] };

type TicketPatchResponse = {
  ticket: {
    id: string;
    statut: Ticket["statut"];
    priorite: Ticket["priorite"];
  };
};

async function updateTicket(
  ticketId: string,
  payload: TicketPatch,
): Promise<TicketPatchResponse> {
  const response = await fetch(`/api/tickets/${ticketId}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = (await response.json().catch(() => null)) as
    | TicketPatchResponse
    | { message?: string }
    | null;

  if (!response.ok) {
    throw new Error(
      result && "message" in result && result.message
        ? result.message
        : "La modification du ticket a échoué.",
    );
  }

  return result as TicketPatchResponse;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function TechnicianTicketDetailsCard({
  ticket,
}: {
  ticket: Ticket;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(ticket.statut);
  const [priority, setPriority] = useState(ticket.priorite);
  const [selectedPriority, setSelectedPriority] = useState(ticket.priorite);
  const [priorityDialogOpen, setPriorityDialogOpen] = useState(false);
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<
    "priority" | "close" | "reopen" | null
  >(null);

  const PriorityIcon = priorityStyles[priority].icon;
  const canClose = status === "résolu";
  const canReopen = status === "résolu" || status === "fermé";

  const savePriority = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (selectedPriority === priority) {
      setPriorityDialogOpen(false);
      return;
    }

    setPendingAction("priority");

    try {
      const result = await updateTicket(ticket.id, {
        priorite: selectedPriority,
      });

      setPriority(result.ticket.priorite);
      setPriorityDialogOpen(false);
      toast.success("Priorité modifiée", {
        description: `La priorité du ticket #${ticket.id} est maintenant « ${result.ticket.priorite} ».`,
      });
      router.refresh();
    } catch (error) {
      toast.error("Modification impossible", {
        description:
          error instanceof Error
            ? error.message
            : "La priorité du ticket n’a pas pu être modifiée.",
      });
    } finally {
      setPendingAction(null);
    }
  };

  const closeTicket = async () => {
    setPendingAction("close");

    try {
      const result = await updateTicket(ticket.id, {
        action: "close",
      });

      setStatus(result.ticket.statut);
      setCloseDialogOpen(false);
      toast.success("Ticket clôturé", {
        description: `Le ticket #${ticket.id} est maintenant fermé.`,
      });
      router.refresh();
    } catch (error) {
      toast.error("Clôture impossible", {
        description:
          error instanceof Error
            ? error.message
            : "Le ticket n’a pas pu être clôturé.",
      });
    } finally {
      setPendingAction(null);
    }
  };

  const reopenTicket = async () => {
    setPendingAction("reopen");

    try {
      const result = await updateTicket(ticket.id, {
        action: "reopen",
      });

      setStatus(result.ticket.statut);
      toast.success("Ticket réouvert", {
        description: `Le ticket #${ticket.id} est de nouveau ouvert.`,
      });
      router.refresh();
    } catch (error) {
      toast.error("Réouverture impossible", {
        description:
          error instanceof Error
            ? error.message
            : "Le ticket n’a pas pu être réouvert.",
      });
    } finally {
      setPendingAction(null);
    }
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-outline-variant/30 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant/20 p-5">
        <div>
          <p className="text-sm font-medium text-on-surface-variant">
            Ticket ID
          </p>
          <h1 className="mt-1 text-2xl font-bold text-tertiary">
            #{ticket.id}
          </h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <Dialog
            open={priorityDialogOpen}
            onOpenChange={(open) => {
              setPriorityDialogOpen(open);

              if (open) {
                setSelectedPriority(priority);
              }
            }}
          >
            <DialogTrigger asChild>
              <button
                type="button"
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-outline-variant/40 px-3 py-2 text-sm font-semibold hover:bg-surface-container-low"
              >
                <Pencil size={16} />
                Modifier
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <form onSubmit={savePriority}>
                <DialogHeader>
                  <DialogTitle className="text-lg font-bold">
                    Modifier la priorité
                  </DialogTitle>
                  <DialogDescription>
                    Définissez la nouvelle priorité du ticket #{ticket.id}.
                  </DialogDescription>
                </DialogHeader>

                <Field className="py-5">
                  <Label htmlFor={`ticket-priority-${ticket.id}`}>
                    Priorité
                  </Label>
                  <Select
                    value={selectedPriority}
                    onValueChange={(value) =>
                      setSelectedPriority(value as Ticket["priorite"])
                    }
                  >
                    <SelectTrigger
                      id={`ticket-priority-${ticket.id}`}
                      className="w-full"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={pendingAction === "priority"}
                    >
                      Annuler
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    disabled={pendingAction === "priority"}
                    className="cursor-pointer bg-primary-container/80 hover:bg-primary-container"
                  >
                    {pendingAction === "priority"
                      ? "Enregistrement…"
                      : "Enregistrer"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {canClose && (
            <Dialog
              open={closeDialogOpen}
              onOpenChange={setCloseDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="cursor-pointer gap-2 bg-on-surface text-white hover:bg-on-surface/90">
                  <CheckCircle2 size={16} />
                  Clôturer
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-lg font-bold">
                    Clôturer le ticket #{ticket.id} ?
                  </DialogTitle>
                  <DialogDescription className="mt-2 text-base">
                    Le ticket sera marqué comme fermé. Vous pourrez le réouvrir
                    ultérieurement si nécessaire.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={pendingAction === "close"}
                    >
                      Annuler
                    </Button>
                  </DialogClose>
                  <Button
                    type="button"
                    onClick={closeTicket}
                    disabled={pendingAction === "close"}
                    className="cursor-pointer bg-tertiary/90 hover:bg-tertiary"
                  >
                    {pendingAction === "close"
                      ? "Traitement…"
                      : "Clôturer"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="p-5">
        <TicketStatusStepper currentStatus={status} />
      </div>

      <div className="border-t border-outline-variant/20 p-5">
        <p className="text-sm font-semibold text-on-surface-variant">
          Sujet
        </p>
        <h2 className="mt-2 text-xl font-bold leading-snug text-on-surface">
          {ticket.titre}
        </h2>

        <p className="mt-6 text-sm font-semibold text-on-surface-variant">
          Description
        </p>
        <p className="mt-2 whitespace-pre-line leading-7 text-on-surface">
          {ticket.contenu}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 text-sm">
          <div>
            <p className="text-on-surface-variant">Statut</p>
            <span
              className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[status].base}`}
            >
              {status}
            </span>
          </div>

          <div>
            <p className="text-on-surface-variant">Priorité</p>
            <span
              className={`mt-2 inline-flex items-center gap-1.5 text-sm font-semibold ${priorityStyles[priority].base.replace(/border\s|bg-[^\s]+\s/g, "")}`}
            >
              {PriorityIcon && <PriorityIcon size={15} />}
              {priority}
            </span>
          </div>

          <div>
            <p className="text-on-surface-variant">Catégorie</p>
            <p className="mt-1 font-semibold text-on-surface">
              {ticket.categorie}
            </p>
          </div>

          <div>
            <p className="text-on-surface-variant">Technicien assigné</p>
            <p className="mt-1 flex items-center gap-2 font-semibold text-on-surface">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary-container/20 text-[10px] text-primary">
                {ticket.assigneA
                  ?.split(" ")
                  .map((name) => name[0])
                  .join("") ?? "—"}
              </span>
              {ticket.assigneA ?? "Non assigné"}
            </p>
          </div>

          <div>
            <p className="text-on-surface-variant">Créé le</p>
            <p className="mt-1 font-semibold text-on-surface">
              {formatDate(ticket.dateCreation)}
            </p>
          </div>

          <div>
            <p className="text-on-surface-variant">
              Dernière mise à jour
            </p>
            <p className="mt-1 font-semibold text-on-surface">
              {formatDate(ticket.dateModification)}
            </p>
          </div>
        </div>
      </div>

      {canReopen && (
        <div className="flex justify-end border-t border-outline-variant/20 p-4">
          <Button
            type="button"
            variant="outline"
            onClick={reopenTicket}
            disabled={pendingAction === "reopen"}
            className="cursor-pointer gap-2 border-primary-container text-primary transition-colors hover:bg-primary-container hover:text-white"
          >
            <ArchiveRestore size={16} />
            {pendingAction === "reopen"
              ? "Réouverture…"
              : "Réouvrir"}
          </Button>
        </div>
      )}
    </section>
  );
}
