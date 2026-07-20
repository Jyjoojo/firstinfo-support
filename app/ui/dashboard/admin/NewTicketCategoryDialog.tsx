"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function NewTicketCategoryDialog() {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [labelError, setLabelError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanLabel = label.trim();

    if (!cleanLabel) {
      const message = "Le libellé de la catégorie est requis.";
      setLabelError(message);
      toast.error("Création impossible", { description: message });
      return;
    }

    setLabelError(null);
    setLabel("");
    setDescription("");
    setOpen(false);
    toast.success("Catégorie créée", { description: `« ${cleanLabel} » a été ajoutée avec succès.` });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-10 gap-2 bg-primary-container px-4 text-sm font-bold text-on-primary-container hover:bg-primary-container/90"><Plus size={18} /> Nouvelle catégorie</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md w-500">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Nouvelle catégorie</DialogTitle>
            <DialogDescription>Créez une catégorie pour mieux qualifier les tickets de support.</DialogDescription>
          </DialogHeader>
          <FieldGroup className="py-5">
            <Field data-invalid={Boolean(labelError)}>
              <Label htmlFor="category-label">Libellé <span className="text-destructive">*</span></Label>
              <Input id="category-label" name="label" value={label} onChange={(event) => { setLabel(event.target.value); if (labelError) setLabelError(null); }} aria-invalid={Boolean(labelError)} placeholder="Ex. Comptabilité" autoFocus />
              <FieldError errors={labelError ? [{ message: labelError }] : []} />
            </Field>
            <Field>
              <Label htmlFor="category-description">Description</Label>
              <Textarea id="category-description" name="description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Décrivez les demandes associées à cette catégorie…" />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Annuler</Button></DialogClose>
            <Button type="submit">Créer la catégorie</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
