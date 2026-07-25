"use client";

import {
  type FormEvent,
  useState,
} from "react";
import {
  CircleAlert,
  FileText,
  Pencil,
  Plus,
  Shapes,
} from "lucide-react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { priorityStyles } from "@/lib/styles";
import type { Ticket } from "@/lib/tickets";

type FormErrors = Partial<
  Record<"title" | "category" | "description", string>
>;

const priorityOptions: Array<{
  value: Ticket["priorite"];
  label: string;
}> = [
  { value: "basse", label: "Basse" },
  { value: "normale", label: "Normale" },
  { value: "haute", label: "Haute" },
  { value: "urgente", label: "Urgente" },
];

export default function CreateTicketDialog({
  categories,
}: {
  categories: string[];
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] =
    useState<Ticket["priorite"]>("normale");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const resetForm = () => {
    setTitle("");
    setCategory("");
    setPriority("normale");
    setDescription("");
    setErrors({});
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      resetForm();
    }

    setOpen(nextOpen);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: FormErrors = {};

    if (!title.trim()) {
      nextErrors.title = "Le titre du ticket est requis.";
    }

    if (!category) {
      nextErrors.category = "La catégorie est requise.";
    }

    if (!description.trim()) {
      nextErrors.description = "La description est requise.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    /*
     * TODO: appeler l'API de création du ticket avec :
     * {
     *   titre: title.trim(),
     *   categorie: category,
     *   priorite: priority,
     *   contenu: description.trim(),
     * }
     */
    toast.info("Création en attente de l’API", {
      description:
        "Le formulaire est valide et prêt à être envoyé au backend.",
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 self-start rounded-lg bg-primary-container px-4 text-sm font-semibold text-on-primary-container transition-colors hover:bg-primary-container/90 sm:self-auto"
        >
          <Plus size={17} />
          Créer un ticket
        </button>
      </DialogTrigger>

      <DialogContent className="flex  flex-col overflow-hidden sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Créer un nouveau ticket
          </DialogTitle>
          <DialogDescription className="text-base">
            Renseignez les informations nécessaires à la prise en charge du
            ticket.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          <FieldGroup className="min-h-0 flex-1 overflow-y-auto py-3 pr-1 px-2">
            <Field data-invalid={Boolean(errors.title)}>
              <FieldLabel htmlFor="technician-ticket-title">
                <Pencil
                  size={16}
                  className="text-tertiary"
                />
                Titre du ticket *
              </FieldLabel>
              <Input
                id="technician-ticket-title"
                value={title}
                maxLength={255}
                onChange={(event) => {
                  setTitle(event.target.value);

                  if (errors.title) {
                    setErrors((current) => ({
                      ...current,
                      title: undefined,
                    }));
                  }
                }}
                className="focus-visible:border-primary-container focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2"
                placeholder="Erreur lors de la clôture de Sage 100"
                aria-invalid={Boolean(errors.title)}
              />
              <FieldError
                errors={
                  errors.title
                    ? [{ message: errors.title }]
                    : []
                }
              />
            </Field>

            <Field data-invalid={Boolean(errors.category)}>
              <FieldLabel htmlFor="technician-ticket-category">
                <Shapes
                  size={16}
                  className="text-tertiary"
                />
                Catégorie de la solution *
              </FieldLabel>
              <Select
                value={category}
                onValueChange={(value) => {
                  setCategory(value);

                  if (errors.category) {
                    setErrors((current) => ({
                      ...current,
                      category: undefined,
                    }));
                  }
                }}
              >
                <SelectTrigger
                  id="technician-ticket-category"
                  className="w-full"
                  aria-invalid={Boolean(errors.category)}
                >
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((item) => (
                    <SelectItem
                      key={item}
                      value={item}
                    >
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError
                errors={
                  errors.category
                    ? [{ message: errors.category }]
                    : []
                }
              />
            </Field>

            <Field>
              <FieldLabel>
                <CircleAlert
                  size={16}
                  className="text-tertiary"
                />
                Niveau de priorité *
              </FieldLabel>
              <ToggleGroup
                type="single"
                variant="outline"
                value={priority}
                onValueChange={(value) => {
                  if (value) {
                    setPriority(value as Ticket["priorite"]);
                  }
                }}
                className="flex w-full flex-wrap items-center gap-2"
              >
                {priorityOptions.map((option) => (
                  <ToggleGroupItem
                    key={option.value}
                    value={option.value}
                    aria-label={`Priorité ${option.label}`}
                    className={`flex-1 ${priorityStyles[option.value].toggle}`}
                  >
                    {option.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </Field>

            <Field data-invalid={Boolean(errors.description)}>
              <FieldLabel htmlFor="technician-ticket-description">
                <FileText
                  size={16}
                  className="text-tertiary"
                />
                Description du problème *
              </FieldLabel>
              <Textarea
                id="technician-ticket-description"
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value);

                  if (errors.description) {
                    setErrors((current) => ({
                      ...current,
                      description: undefined,
                    }));
                  }
                }}
                placeholder="Décrivez les étapes pour reproduire le problème et les messages d’erreur affichés…"
                className="min-h-36 focus-visible:border-primary-container focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2"
                aria-invalid={Boolean(errors.description)}
              />
              <FieldError
                errors={
                  errors.description
                    ? [{ message: errors.description }]
                    : []
                }
              />
            </Field>
          </FieldGroup>

          <DialogFooter className="border-t border-outline-variant/20 pt-4">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
              >
                Annuler
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="cursor-pointer bg-primary-container text-on-primary-container hover:bg-primary-container/90"
            >
              Créer le ticket
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
