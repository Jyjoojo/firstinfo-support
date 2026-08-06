"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { TicketCategory } from "@/lib/ticket-categories";

type CategoryErrorResponse = {
  message?: string;
  errors?: Record<string, string[]>;
};

export default function EditTicketCategoryDialog({ category }: { category: TicketCategory }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState(category.label);
  const [description, setDescription] = useState(category.description);
  const [labelError, setLabelError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setLabel(category.label);
      setDescription(category.description);
      setLabelError(null);
    }
    setOpen(nextOpen);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanLabel = label.trim();
    if (!cleanLabel) {
      const message = "Le libellé de la catégorie est requis.";
      setLabelError(message);
      toast.error("Mise à jour impossible", { description: message });
      return;
    }

    setLabelError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/categories/${encodeURIComponent(category.id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          libelle: cleanLabel,
          description: description.trim() || null,
        }),
      });
      const data = await response.json().catch(() => ({})) as CategoryErrorResponse;

      if (!response.ok) {
        const message = data.errors?.libelle?.[0] ?? data.message ?? "La catégorie n'a pas pu être mise à jour.";
        setLabelError(data.errors?.libelle?.[0] ?? null);
        throw new Error(message);
      }

      setOpen(false);
      toast.success("Catégorie mise à jour", { description: `« ${cleanLabel} » a été enregistrée.` });
      router.refresh();
    } catch (error) {
      toast.error("Mise à jour impossible", {
        description: error instanceof Error ? error.message : "La catégorie n'a pas pu être mise à jour.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button type="button" title={`Modifier ${category.label}`} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-primary hover:bg-primary/10"><Pencil size={18} /></button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Modifier la catégorie</DialogTitle>
            <DialogDescription>Mettez à jour les informations de cette catégorie de tickets.</DialogDescription>
          </DialogHeader>
          <FieldGroup className="py-5">
            <Field data-invalid={Boolean(labelError)}>
              <Label htmlFor={`category-label-${category.id}`}>Libellé <span className="text-destructive">*</span></Label>
              <Input id={`category-label-${category.id}`} value={label} onChange={(event) => { setLabel(event.target.value); if (labelError) setLabelError(null); }} aria-invalid={Boolean(labelError)} />
              <FieldError errors={labelError ? [{ message: labelError }] : []} />
            </Field>
            <Field>
              <Label htmlFor={`category-description-${category.id}`}>Description</Label>
              <Textarea id={`category-description-${category.id}`} value={description} onChange={(event) => setDescription(event.target.value)} />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild><Button type="button" variant="outline">Annuler</Button></DialogClose>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Enregistrement..." : "Enregistrer"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
