"use client";

import { useState } from "react";
import { ArchiveRestore, CheckCircle2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Ticket } from "@/lib/tickets";

type ActionKind = "close" | "delete";

async function requestTicketAction(ticketId: string, action: "close" | "reopen" | "delete") {
  // TODO: appeler l'API tickets avec la bonne URL et la bonne méthode HTTP.
  // Exemple attendu : 
  await fetch(`/api/tickets/${ticketId}`, { method: "PATCH", body: JSON.stringify({ action }) })
  // throw new Error(`L'action « ${action} » nécessite la configuration de l'API pour le ticket #${ticketId}.`);
}

function TicketConfirmation({ ticketId, action, onConfirm }: { ticketId: string; action: ActionKind; onConfirm: () => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const isDelete = action === "delete";
  const label = isDelete ? "Supprimer" : "Clôturer";

  const confirm = async () => {
    setPending(true);
    try {
      await onConfirm();
      setOpen(false);
    } catch (error) {
      toast.error(`${label} impossible`, { description: error instanceof Error ? error.message : `Le ticket #${ticketId} n'a pas pu être traité.` });
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isDelete ? <Button variant="outline" className="cursor-pointer gap-2 border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700"><Trash2 size={16} /> Supprimer</Button> : <Button className="cursor-pointer gap-2 bg-on-surface text-white hover:bg-on-surface/90"><CheckCircle2 size={16} /> Clôturer</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">{label} le ticket #{ticketId} ?</DialogTitle>
          <DialogDescription className="text-base mt-2">{isDelete ? "Cette action supprimera définitivement le ticket et son historique. Elle est irréversible." : "Le ticket sera marqué comme fermé. Vous pourrez le réouvrir ultérieurement si nécessaire."}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild><Button type="button" variant="outline" disabled={pending}>Annuler</Button></DialogClose>
          <Button type="button" className="cursor-pointer bg-tertiary/90 hover:bg-tertiary" variant={isDelete ? "destructive" : "default"} onClick={confirm} disabled={pending}>{pending ? "Traitement…" : label}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function CloseTicketAction({ ticketId }: { ticketId: string }) {
  return <TicketConfirmation ticketId={ticketId} action="close" onConfirm={async () => { await requestTicketAction(ticketId, "close"); toast.success("Ticket clôturé", { description: `Le ticket #${ticketId} est maintenant fermé.` }); }} />;
}

export function DeleteTicketAction({ ticketId }: { ticketId: string }) {
  return <TicketConfirmation ticketId={ticketId} action="delete" onConfirm={async () => { await requestTicketAction(ticketId, "delete"); toast.success("Ticket supprimé", { description: `Le ticket #${ticketId} a été supprimé.` }); }} />;
}

export function ReopenTicketAction({ ticketId, status }: { ticketId: string; status: Ticket["statut"] }) {
  const isOpen = status === "nouveau";
  const reopen = async () => {
    try {
      await requestTicketAction(ticketId, "reopen");
      toast.success("Ticket réouvert", { description: `Le ticket #${ticketId} est de nouveau ouvert.` });
    } catch (error) {
      toast.error("Réouverture impossible", { description: error instanceof Error ? error.message : `Le ticket #${ticketId} n'a pas pu être réouvert.` });
    }
  };

  return <Button type="button" variant="outline" onClick={reopen} disabled={isOpen} className="cursor-pointer gap-2 border-primary-container text-primary hover:bg-primary-container hover:text-white transition-colors"><ArchiveRestore size={16} /> Réouvrir</Button>;
}
