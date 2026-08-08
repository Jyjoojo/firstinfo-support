"use client";

import { type FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, LoaderCircle, Paperclip, Send, XCircle } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { priorityStyles, statusStyles, type PriorityVariant, type StatusVariant } from "@/lib/styles";

export interface TicketMessage {
  id: string;
  authorName: string;
  authorInitials: string;
  role: "client" | "technicien";
  content: string;
  date: string;
  isSolution: boolean;
  solutionValidated: boolean;
  solutionRejected: boolean;
}

type ApiErrorBody = {
  message?: string;
  errors?: Record<string, string[]>;
};

interface TicketConversationCardProps {
  ticketId: string;
  ticketReference: string;
  title: string;
  productTag: string;
  statut: StatusVariant;
  priorite: PriorityVariant;
  messages: TicketMessage[];
  awaitingClientValidation: boolean;
}

async function responseError(response: Response, fallback: string) {
  const data = await response.json().catch(() => ({})) as ApiErrorBody;
  return Object.values(data.errors ?? {}).flat()[0] ?? data.message ?? fallback;
}

export default function TicketConversationCard({
  ticketId,
  ticketReference,
  title,
  productTag,
  statut,
  priorite,
  messages,
  awaitingClientValidation,
}: TicketConversationCardProps) {
  const router = useRouter();
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionError, setRejectionError] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canAddAttachment = statut !== "resolu" && statut !== "ferme";

  const uploadAttachment = async (file: File) => {
    if (!canAddAttachment) return;
    const acceptedExtensions = new Set(["pdf", "doc", "docx", "xls", "xlsx", "png", "jpg", "jpeg"]);
    const extension = file.name.split(".").pop()?.toLowerCase();

    if (!extension || !acceptedExtensions.has(extension)) {
      toast.error("Format non accepté", {
        description: "Formats autorisés : PDF, DOC, DOCX, XLS, XLSX, PNG, JPG et JPEG.",
      });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Fichier trop volumineux", { description: "La taille maximale autorisée est de 10 Mo." });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("fichier", file);
      const response = await fetch(`/api/tickets/${encodeURIComponent(ticketId)}/pieces-jointes`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error(await responseError(response, "La pièce jointe n'a pas pu être ajoutée."));

      toast.success("Pièce jointe ajoutée", { description: file.name });
      router.refresh();
    } catch (error) {
      toast.error("Ajout impossible", {
        description: error instanceof Error ? error.message : "La pièce jointe n'a pas pu être ajoutée.",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const sendComment = async () => {
    const content = draft.trim();
    if (content.length < 2 || isSending) return;

    setIsSending(true);
    try {
      const response = await fetch(`/api/tickets/${encodeURIComponent(ticketId)}/commentaires`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contenu: content, est_solution: false }),
      });
      if (!response.ok) throw new Error(await responseError(response, "Le commentaire n'a pas pu être envoyé."));

      setDraft("");
      toast.success("Commentaire envoyé");
      router.refresh();
    } catch (error) {
      toast.error("Envoi impossible", {
        description: error instanceof Error ? error.message : "Le commentaire n'a pas pu être envoyé.",
      });
    } finally {
      setIsSending(false);
    }
  };

  const approveSolution = async () => {
    if (isApproving) return;
    setIsApproving(true);

    try {
      const response = await fetch(`/api/tickets/${encodeURIComponent(ticketId)}/confirmer-resolution`, {
        method: "POST",
      });
      if (!response.ok) throw new Error(await responseError(response, "La solution n'a pas pu être approuvée."));

      toast.success("Solution approuvée", {
        description: `Le ticket ${ticketReference} est maintenant résolu.`,
      });
      router.refresh();
    } catch (error) {
      toast.error("Approbation impossible", {
        description: error instanceof Error ? error.message : "La solution n'a pas pu être approuvée.",
      });
    } finally {
      setIsApproving(false);
    }
  };

  const rejectSolution = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const reason = rejectionReason.trim();
    if (reason.length < 5) {
      setRejectionError("Le motif doit contenir au moins 5 caractères.");
      return;
    }

    setRejectionError("");
    setIsRejecting(true);
    try {
      const response = await fetch(`/api/tickets/${encodeURIComponent(ticketId)}/refuser-solution`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motif: reason }),
      });
      if (!response.ok) throw new Error(await responseError(response, "La solution n'a pas pu être refusée."));

      setRejectDialogOpen(false);
      setRejectionReason("");
      toast.success("Solution refusée", {
        description: `Le ticket ${ticketReference} repasse en cours de traitement.`,
      });
      router.refresh();
    } catch (error) {
      toast.error("Refus impossible", {
        description: error instanceof Error ? error.message : "La solution n'a pas pu être refusée.",
      });
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <>
      <div id="conversation-card" className="flex h-[600px] flex-col overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-lowest card-shadow">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-outline-variant/40 px-5 py-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="text-sm font-light text-on-surface-variant">#{ticketReference}</span>
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${statusStyles[statut].base}`}>{statut}</span>
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${priorityStyles[priorite].base}`}>{priorite}</span>
            </div>
            <h3 className="text-body-lg font-bold leading-snug text-on-surface">{title}</h3>
          </div>
          <span className="whitespace-nowrap rounded-full bg-surface-container px-3 py-1 text-[12px] font-bold text-on-surface-variant">{productTag}</span>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-4 scrollbar-thin">
          {messages.length === 0 && (
            <p className="py-10 text-center text-sm text-on-surface-variant">Aucun commentaire pour le moment.</p>
          )}
          {messages.map((message) => {
            const isClient = message.role === "client";
            const isPendingSolution = message.isSolution
              && !message.solutionValidated
              && !message.solutionRejected
              && awaitingClientValidation;

            return (
              <div key={message.id} className={`flex items-end gap-2 ${isClient ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${isClient ? "bg-primary-container text-surface" : "bg-inverse-surface text-inverse-on-surface"}`}>
                  {message.authorInitials}
                </div>
                <div className={`flex max-w-[82%] flex-col ${isClient ? "items-end" : "items-start"}`}>
                  {!isClient && <span className="mb-2 px-1 text-sm font-medium text-on-surface">{message.authorName}</span>}
                  <div className={`px-4 py-3 text-body-md leading-relaxed ${isClient ? "rounded-2xl rounded-br-sm bg-primary-container text-surface" : "rounded-2xl rounded-bl-sm bg-surface-container-low text-on-surface"}`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    {isPendingSolution && (
                      <div className="mt-4 border-t border-outline-variant/40 pt-4">
                        <p className="mb-3 text-sm font-semibold">Cette réponse a-t-elle résolu votre problème ?</p>
                        <div className="flex flex-wrap gap-2">
                          <Button type="button" size="sm" onClick={approveSolution} disabled={isApproving || isRejecting} className="gap-2 bg-primary-container text-on-primary-container hover:bg-primary-container/90">
                            {isApproving ? <LoaderCircle className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                            Approuver
                          </Button>
                          <Button type="button" size="sm" variant="outline" onClick={() => setRejectDialogOpen(true)} disabled={isApproving || isRejecting} className="gap-2">
                            <XCircle size={16} />
                            Refuser la solution
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="mt-1 px-1 text-[11px] text-on-surface-variant opacity-70">{isClient ? `${message.authorName} · ${message.date}` : message.date}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-2 border-t border-outline-variant/40 bg-surface-container-lowest p-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
            disabled={!canAddAttachment || isUploading}
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (file) void uploadAttachment(file);
            }}
          />
          <button type="button" aria-label="Joindre un fichier" title={canAddAttachment ? "Ajouter une pièce jointe" : "Impossible d’ajouter une pièce jointe à un ticket résolu"} onClick={() => fileInputRef.current?.click()} disabled={!canAddAttachment || isUploading} className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent">
            {isUploading ? <LoaderCircle className="animate-spin" size={16} /> : <Paperclip size={16} />}
          </button>
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => { if (event.key === "Enter") void sendComment(); }}
            type="text"
            placeholder="Répondez à votre ticket..."
            disabled={isSending}
            className="flex-1 rounded-full border-none bg-surface-container-low px-4 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:ring-2 focus:ring-secondary/20"
          />
          <button type="button" onClick={() => void sendComment()} aria-label="Envoyer" className="cursor-pointer rounded-full bg-primary-container p-3 text-on-primary transition-opacity hover:opacity-90 disabled:opacity-40" disabled={draft.trim().length < 2 || isSending}>
            {isSending ? <LoaderCircle className="animate-spin" size={16} /> : <Send size={16} />}
          </button>
        </div>
      </div>

      <Dialog open={rejectDialogOpen} onOpenChange={(open) => { setRejectDialogOpen(open); if (!open) setRejectionError(""); }}>
        <DialogContent>
          <form onSubmit={rejectSolution}>
            <DialogHeader>
              <DialogTitle>Refuser la solution</DialogTitle>
              <DialogDescription>Expliquez au technicien pourquoi la proposition ne résout pas votre problème.</DialogDescription>
            </DialogHeader>
            <div className="py-5">
              <label htmlFor="rejection-reason" className="mb-2 block text-sm font-semibold">Motif du refus</label>
              <Textarea id="rejection-reason" value={rejectionReason} onChange={(event) => { setRejectionReason(event.target.value); if (rejectionError) setRejectionError(""); }} minLength={5} maxLength={2000} required disabled={isRejecting} className="min-h-32" placeholder="Décrivez ce qui ne fonctionne toujours pas…" aria-invalid={Boolean(rejectionError)} />
              {rejectionError && <p className="mt-2 text-sm text-destructive">{rejectionError}</p>}
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline" disabled={isRejecting}>Annuler</Button></DialogClose>
              <Button type="submit" variant="destructive" disabled={isRejecting || rejectionReason.trim().length < 5} className="gap-2">
                {isRejecting ? <LoaderCircle className="animate-spin" size={16} /> : <XCircle size={16} />}
                Refuser la solution
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
