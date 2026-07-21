"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Ticket } from "@/lib/tickets";

export default function EditTicketDialog({ ticket, categories }: { ticket: Ticket; categories: string[] }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(ticket.titre);
  const [description, setDescription] = useState(ticket.contenu);
  const [status, setStatus] = useState<Ticket["statut"]>(ticket.statut);
  const [priority, setPriority] = useState<Ticket["priorite"]>(ticket.priorite);
  const [category, setCategory] = useState(ticket.categorie);
  const [titleError, setTitleError] = useState<string | null>(null);

  const resetForm = () => {
    setTitle(ticket.titre); setDescription(ticket.contenu); setStatus(ticket.statut); setPriority(ticket.priorite); setCategory(ticket.categorie); setTitleError(null);
  };
  const handleOpenChange = (nextOpen: boolean) => { if (nextOpen) resetForm(); setOpen(nextOpen); };
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) { setTitleError("Le titre du ticket est requis."); return; }
    // TODO: appeler l'API de mise à jour avec { title, description, status, priority, category }.
    toast.info("Modification prête", { description: "Configurez l'URL de l'API pour enregistrer les changements." });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/40 px-3 py-2 text-sm font-semibold hover:bg-surface-container-low cursor-pointer"><Pencil size={16} /> Modifier</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Modifier le ticket #{ticket.id}</DialogTitle>
            <DialogDescription>Modifiez les informations et la qualification du ticket.</DialogDescription>
          </DialogHeader>
          <FieldGroup className="py-5">
            <Field data-invalid={Boolean(titleError)}>
              <Label htmlFor={`ticket-title-${ticket.id}`}>Titre </Label>
              <Input id={`ticket-title-${ticket.id}`} value={title} onChange={(event) => { setTitle(event.target.value); if (titleError) setTitleError(null); }} aria-invalid={Boolean(titleError)} />
              <FieldError errors={titleError ? [{ message: titleError }] : []} />
            </Field>
            <Field>
              <Label htmlFor={`ticket-description-${ticket.id}`}>Description</Label>
              <Textarea id={`ticket-description-${ticket.id}`} value={description} onChange={(event) => setDescription(event.target.value)} />
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <Label>Statut</Label>
                <Select value={status} onValueChange={(value) => setStatus(value as Ticket["statut"])}>
                  <SelectTrigger className="w-full"><SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nouveau">Nouveau</SelectItem>
                    <SelectItem value="en cours">En cours</SelectItem>
                    <SelectItem value="résolu">Résolu</SelectItem>
                    <SelectItem value="fermé">Fermé</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <Label>Priorité</Label>
                <Select value={priority} onValueChange={(value) => setPriority(value as Ticket["priorite"])}>
                  <SelectTrigger className="w-full"><SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basse">Basse</SelectItem>
                    <SelectItem value="normale">Normale</SelectItem>
                    <SelectItem value="haute">Haute</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <Field>
              <Label>Catégorie</Label>
              <Select value={category} onValueChange={setCategory}><SelectTrigger className="w-full"><SelectValue />
              </SelectTrigger>
                <SelectContent>{categories.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Annuler</Button>
            </DialogClose>
            <Button type="submit" className="bg-primary-container/80 cursor-pointer hover:bg-primary-container">Enregistrer les modifications</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
