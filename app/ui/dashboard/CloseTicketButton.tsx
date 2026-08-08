"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type CloseTicketButtonProps = {
  ticketId: string;
  ticketReference: string;
  canClose: boolean;
};

type ApiErrorBody = {
  message?: string;
  errors?: Record<string, string[]>;
};

export default function CloseTicketButton({ ticketId, ticketReference, canClose }: CloseTicketButtonProps) {
  const router = useRouter();
  const [isClosing, setIsClosing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const closeTicket = async () => {
    if (!canClose || isClosing) return;
    setIsClosing(true);

    try {
      const response = await fetch(`/api/tickets/${encodeURIComponent(ticketId)}/fermer`, {
        method: "POST",
      });
      const data = await response.json().catch(() => ({})) as ApiErrorBody;

      if (!response.ok) {
        const message = Object.values(data.errors ?? {}).flat()[0]
          ?? data.message
          ?? "Le ticket n'a pas pu être clôturé.";
        throw new Error(message);
      }

      toast.success("Ticket clôturé", {
        description: `Le ticket ${ticketReference} a été clôturé avec succès.`,
      });
      setDialogOpen(false);
      router.refresh();
    } catch (error) {
      toast.error("Clôture impossible", {
        description: error instanceof Error ? error.message : "Le ticket n'a pas pu être clôturé.",
      });
    } finally {
      setIsClosing(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => { if (!isClosing) setDialogOpen(open); }}>
      <button
        type="button"
        onClick={() => setDialogOpen(true)}
        disabled={!canClose || isClosing}
        title={canClose ? "Clôturer le ticket" : "Le ticket doit être résolu avant d’être clôturé"}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-tertiary/90 px-4 py-3 font-medium text-surface transition-colors hover:bg-tertiary/70 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-tertiary/90"
      >
        <Archive size={16} />
        Clôturer le ticket
      </button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Clôturer le ticket ?</DialogTitle>
          <DialogDescription>
            Vous êtes sur le point de clôturer le ticket {ticketReference}. Confirmez cette action pour terminer définitivement son traitement.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isClosing}>Annuler</Button>
          </DialogClose>
          <Button type="button" onClick={() => void closeTicket()} disabled={isClosing} className="gap-2">
            {isClosing ? <LoaderCircle className="animate-spin" size={16} /> : <Archive size={16} />}
            {isClosing ? "Clôture..." : "Confirmer la clôture"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
