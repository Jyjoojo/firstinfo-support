"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
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
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

function EditMessageDialog({ initialContent, onEdit }: { initialContent: string; onEdit: (content: string) => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState(initialContent);
  const [pending, setPending] = useState(false);

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { setOpen(nextOpen); if (nextOpen) setContent(initialContent); }}>
      <DialogTrigger asChild><button type="button" title="Modifier le message" aria-label="Modifier le message" className="inline-flex h-7 w-7 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container-low hover:text-primary"><Pencil size={15} /></button></DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={async (event) => {
          event.preventDefault();
          if (content.trim().length < 2) return;
          setPending(true);
          try { await onEdit(content.trim()); setOpen(false); } catch { /* Le parent affiche l'erreur. */ } finally { setPending(false); }
        }}>
          <DialogHeader><DialogTitle>Modifier le commentaire</DialogTitle><DialogDescription>Enregistrez le nouveau contenu de votre commentaire.</DialogDescription></DialogHeader>
          <FieldGroup className="py-5"><Field><Label htmlFor="message-content">Contenu</Label><Textarea id="message-content" value={content} onChange={(event) => setContent(event.target.value)} className="min-h-32" disabled={pending} /></Field></FieldGroup>
          <DialogFooter><DialogClose asChild><Button type="button" variant="outline" disabled={pending}>Annuler</Button></DialogClose><Button type="submit" disabled={pending || content.trim().length < 2} className="gap-2 bg-primary-container text-on-primary-container">{pending && <Spinner />}{pending ? "Enregistrement…" : "Enregistrer"}</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteMessageDialog({ onDelete }: { onDelete: () => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><button type="button" title="Supprimer le message" aria-label="Supprimer le message" className="inline-flex h-7 w-7 items-center justify-center rounded-md text-red-600 hover:bg-red-50"><Trash2 size={15} /></button></DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader><DialogTitle>Supprimer ce commentaire ?</DialogTitle><DialogDescription>Cette action est définitive. Une proposition de solution ne peut pas être supprimée.</DialogDescription></DialogHeader>
        <DialogFooter><DialogClose asChild><Button type="button" variant="outline" disabled={pending}>Annuler</Button></DialogClose><Button type="button" variant="destructive" disabled={pending} onClick={async () => { setPending(true); try { await onDelete(); setOpen(false); } catch { /* Le parent affiche l'erreur. */ } finally { setPending(false); } }}>{pending ? "Suppression…" : "Supprimer"}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminMessageActions({ content, onEdit, onDelete, canDelete = true }: { messageId: string; content: string; onEdit: (content: string) => Promise<void>; onDelete: () => Promise<void>; canDelete?: boolean }) {
  return <div className="mt-1 flex justify-end gap-1"><EditMessageDialog initialContent={content} onEdit={onEdit} />{canDelete && <DeleteMessageDialog onDelete={onDelete} />}</div>;
}
