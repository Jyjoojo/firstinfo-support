"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type CategoryErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

export default function NewTicketCategoryDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [description, setDescription] = useState("");
  const [labelError, setLabelError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanLabel = label.trim();

    if (!cleanLabel) {
      const message = "Le libellé de la catégorie est requis.";
      setLabelError(message);
      toast.error("Création impossible", { description: message });
      return;
    }

    setLabelError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          libelle: cleanLabel,
          description: description.trim() || null,
        }),
      });
      const data = await response.json().catch(() => ({})) as CategoryErrorResponse;

      if (!response.ok) {
        const message = data.errors?.libelle?.[0] ?? data.message ?? "La catégorie n'a pas pu être créée.";
        setLabelError(data.errors?.libelle?.[0] ?? null);
        throw new Error(message);
      }

      setLabel("");
      setDescription("");
      setOpen(false);
      toast.success("Catégorie créée", { description: `« ${cleanLabel} » a été ajoutée avec succès.` });
      router.refresh();
    } catch (error) {
      toast.error("Création impossible", {
        description: error instanceof Error ? error.message : "La catégorie n'a pas pu être créée.",
      });
    } finally {
      setIsSubmitting(false);
    }
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
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Création..." : "Créer la catégorie"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
