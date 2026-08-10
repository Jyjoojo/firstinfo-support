"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  CircleAlert,
  FileText,
  Paperclip,
  Pencil,
  Plus,
  Search,
  Shapes,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import FileUpload from "@/app/ui/FileUpload";
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
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  categoriesResponseSchema,
  clientTicketSchema,
  clientsSelectionResponseSchema,
  type ApiCategory,
  type ClientSelection,
  type ClientTicket,
  type TicketPriority,
} from "@/lib/ticket-contracts";

const ACCEPTED_EXTENSIONS = new Set([
  "pdf", "doc", "docx", "xls", "xlsx", "png", "jpg", "jpeg",
]);
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 5;

type FormField = "title" | "client" | "category" | "description" | "files";
type FormErrors = Partial<Record<FormField, string>>;

type TicketCreationResponse = {
  message?: string;
  ticket?: unknown;
  errors?: Record<string, string[]>;
};

const priorityOptions: Array<{ value: TicketPriority; label: string }> = [
  { value: "basse", label: "Basse" },
  { value: "normale", label: "Normale" },
  { value: "haute", label: "Haute" },
  { value: "urgente", label: "Urgente" },
];

function clientLabel(client: ClientSelection) {
  return client.entreprise
    ? `${client.nom_complet} — ${client.entreprise}`
    : client.nom_complet;
}

export default function CreateTicketDialog({
  categories,
  onCreated,
}: {
  categories: Array<ApiCategory | string>;
  onCreated?: (ticket: ClientTicket) => void;
}) {
  const router = useRouter();
  const providedCategories = useMemo(
    () => categories.filter((item): item is ApiCategory => typeof item !== "string"),
    [categories],
  );
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedClient, setSelectedClient] = useState<ClientSelection | null>(null);
  const [clientQuery, setClientQuery] = useState("");
  const [clients, setClients] = useState<ClientSelection[]>([]);
  const [clientListOpen, setClientListOpen] = useState(false);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState(providedCategories);
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState<TicketPriority>("normale");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    const controller = new AbortController();
    fetch("/api/categories", {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then((data: unknown) => {
        const parsed = categoriesResponseSchema.safeParse(data);
        if (parsed.success) setCategoryOptions(parsed.data);
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          toast.error("Impossible de charger les catégories.");
        }
      });

    return () => controller.abort();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (selectedClient && clientQuery === clientLabel(selectedClient)) return;

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setClientsLoading(true);
      const params = new URLSearchParams();
      if (clientQuery.trim()) params.set("search", clientQuery.trim());

      try {
        const response = await fetch(
          `/api/clients${params.size ? `?${params}` : ""}`,
          { headers: { Accept: "application/json" }, signal: controller.signal },
        );
        if (!response.ok) throw new Error("Impossible de charger les clients.");

        const data: unknown = await response.json();
        const parsed = clientsSelectionResponseSchema.safeParse(data);
        if (!parsed.success) throw new Error("La liste des clients est invalide.");
        setClients(Array.isArray(parsed.data) ? parsed.data : parsed.data.data);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setClients([]);
          toast.error("Chargement impossible", {
            description: error instanceof Error
              ? error.message
              : "Impossible de charger les clients.",
          });
        }
      } finally {
        if (!controller.signal.aborted) setClientsLoading(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [clientQuery, open, selectedClient]);

  function resetForm() {
    setTitle("");
    setSelectedClient(null);
    setClientQuery("");
    setClients([]);
    setClientListOpen(false);
    setCategory("");
    setPriority("normale");
    setDescription("");
    setFiles([]);
    setErrors({});
  }

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) resetForm();
    setOpen(nextOpen);
  }

  function validateFiles() {
    if (files.length > MAX_FILES) {
      return `Vous pouvez joindre au maximum ${MAX_FILES} fichiers.`;
    }

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) return `${file.name} dépasse 10 Mo.`;
      const extension = file.name.split(".").pop()?.toLowerCase();
      if (!extension || !ACCEPTED_EXTENSIONS.has(extension)) {
        return `${file.name} n'est pas dans un format accepté.`;
      }
    }

    return "";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fileError = validateFiles();
    const nextErrors: FormErrors = {};

    if (title.trim().length < 5) nextErrors.title = "Le titre doit contenir au moins 5 caractères.";
    if (!selectedClient) nextErrors.client = "Sélectionnez le client concerné.";
    if (!category) nextErrors.category = "Sélectionnez une catégorie.";
    if (description.trim().length < 10) nextErrors.description = "La description doit contenir au moins 10 caractères.";
    if (fileError) nextErrors.files = fileError;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !selectedClient) return;

    const formData = new FormData();
    formData.append("titre", title.trim());
    formData.append("description", description.trim());
    formData.append("priorite", priority);
    formData.append("categorie_id", category);
    formData.append("client_id", selectedClient.id);
    files.forEach((file) => formData.append("fichiers[]", file));

    setSubmitting(true);
    try {
      const response = await fetch("/api/tickets", { method: "POST", body: formData });
      const data = await response.json().catch(() => ({})) as TicketCreationResponse;

      if (!response.ok) {
        const validationMessage = Object.values(data.errors ?? {}).flat()[0];
        throw new Error(validationMessage ?? data.message ?? "La création du ticket a échoué.");
      }

      const parsedTicket = clientTicketSchema.safeParse(data.ticket);
      toast.success("Ticket créé avec succès", {
        description: parsedTicket.success
          ? `Le ticket ${parsedTicket.data.reference} a été créé.`
          : data.message,
      });
      if (parsedTicket.success) onCreated?.(parsedTicket.data);
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error("Création impossible", {
        description: error instanceof Error
          ? error.message
          : "La création du ticket a échoué.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 self-start rounded-lg bg-primary-container px-4 text-sm font-semibold text-on-primary-container transition-colors hover:bg-primary-container/90 sm:self-auto"
        >
          <Plus size={17} />
          Créer un ticket
        </button>
      </DialogTrigger>

      <DialogContent className="flex max-h-[90vh] flex-col overflow-hidden sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Créer un nouveau ticket</DialogTitle>
          <DialogDescription className="text-base">
            Renseignez le client et les informations nécessaires à la prise en charge.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <FieldGroup className="min-h-0 flex-1 overflow-y-auto px-2 py-3 pr-1">
            <Field data-invalid={Boolean(errors.title)}>
              <FieldLabel htmlFor="technician-ticket-title">
                <Pencil size={16} className="text-tertiary" />
                Titre du ticket *
              </FieldLabel>
              <Input
                id="technician-ticket-title"
                value={title}
                maxLength={255}
                onChange={(event) => {
                  setTitle(event.target.value);
                  setErrors((current) => ({ ...current, title: undefined }));
                }}
                placeholder="Erreur lors de la clôture de Sage 100"
                aria-invalid={Boolean(errors.title)}
              />
              <FieldError errors={errors.title ? [{ message: errors.title }] : []} />
            </Field>

            <Field data-invalid={Boolean(errors.client)}>
              <FieldLabel htmlFor="technician-ticket-client">
                <UserRound size={16} className="text-tertiary" />
                Client concerné *
              </FieldLabel>
              <div
                className="relative"
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) setClientListOpen(false);
                }}
              >
                <Search className="pointer-events-none absolute left-3 top-3 z-10 size-4 text-on-surface-variant" />
                <Input
                  id="technician-ticket-client"
                  role="combobox"
                  aria-autocomplete="list"
                  aria-controls="technician-client-options"
                  aria-expanded={clientListOpen}
                  aria-invalid={Boolean(errors.client)}
                  value={clientQuery}
                  onFocus={() => setClientListOpen(true)}
                  onChange={(event) => {
                    setClientQuery(event.target.value);
                    setSelectedClient(null);
                    setClientListOpen(true);
                    setErrors((current) => ({ ...current, client: undefined }));
                  }}
                  className="pl-10"
                  placeholder="Rechercher par nom, e-mail ou entreprise…"
                  autoComplete="off"
                />
                {clientListOpen && (
                  <div
                    id="technician-client-options"
                    role="listbox"
                    className="absolute z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-outline-variant/30 bg-white p-1 shadow-lg"
                  >
                    {clientsLoading ? (
                      <div className="flex items-center justify-center gap-2 px-3 py-6 text-sm text-on-surface-variant">
                        <Spinner /> Recherche des clients…
                      </div>
                    ) : clients.length ? clients.map((client) => (
                      <button
                        key={client.id}
                        type="button"
                        role="option"
                        aria-selected={selectedClient?.id === client.id}
                        className="flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left hover:bg-surface-container-low"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => {
                          setSelectedClient(client);
                          setClientQuery(clientLabel(client));
                          setClientListOpen(false);
                          setErrors((current) => ({ ...current, client: undefined }));
                        }}
                      >
                        <Building2 className="mt-0.5 size-4 shrink-0 text-tertiary" />
                        <span className="min-w-0">
                          <span className="block font-semibold text-on-surface">{client.nom_complet}</span>
                          <span className="block truncate text-xs text-on-surface-variant">
                            {[client.entreprise, client.email].filter(Boolean).join(" · ")}
                          </span>
                        </span>
                      </button>
                    )) : (
                      <p className="px-3 py-6 text-center text-sm text-on-surface-variant">
                        Aucun client actif trouvé.
                      </p>
                    )}
                  </div>
                )}
              </div>
              <FieldError errors={errors.client ? [{ message: errors.client }] : []} />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={Boolean(errors.category)}>
                <FieldLabel htmlFor="technician-ticket-category">
                  <Shapes size={16} className="text-tertiary" />
                  Catégorie *
                </FieldLabel>
                <Select value={category} onValueChange={(value) => {
                  setCategory(value);
                  setErrors((current) => ({ ...current, category: undefined }));
                }}>
                  <SelectTrigger id="technician-ticket-category" className="w-full" aria-invalid={Boolean(errors.category)}>
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((item) => (
                      <SelectItem key={item.id} value={item.id}>{item.libelle}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={errors.category ? [{ message: errors.category }] : []} />
              </Field>

              <Field>
                <FieldLabel htmlFor="technician-ticket-priority">
                  <CircleAlert size={16} className="text-tertiary" />
                  Niveau de priorité *
                </FieldLabel>
                <Select value={priority} onValueChange={(value) => setPriority(value as TicketPriority)}>
                  <SelectTrigger id="technician-ticket-priority" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <Field data-invalid={Boolean(errors.description)}>
              <FieldLabel htmlFor="technician-ticket-description">
                <FileText size={16} className="text-tertiary" />
                Description du problème *
              </FieldLabel>
              <Textarea
                id="technician-ticket-description"
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value);
                  setErrors((current) => ({ ...current, description: undefined }));
                }}
                placeholder="Décrivez le problème, les étapes et les messages d’erreur affichés…"
                className="min-h-28"
                aria-invalid={Boolean(errors.description)}
              />
              <FieldError errors={errors.description ? [{ message: errors.description }] : []} />
            </Field>

            <Field data-invalid={Boolean(errors.files)}>
              <FieldLabel>
                <Paperclip size={16} className="text-tertiary" />
                Pièces jointes <span className="font-normal text-on-surface-variant">(facultatif)</span>
              </FieldLabel>
              <FileUpload onFilesChange={(nextFiles) => {
                setFiles(nextFiles);
                setErrors((current) => ({ ...current, files: undefined }));
              }} />
              <FieldError errors={errors.files ? [{ message: errors.files }] : []} />
            </Field>
          </FieldGroup>

          <DialogFooter className="border-t border-outline-variant/20 pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={submitting}>Annuler</Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={submitting}
              className="cursor-pointer bg-primary-container text-on-primary-container hover:bg-primary-container/90"
            >
              {submitting && <Spinner />}
              {submitting ? "Création…" : "Créer le ticket"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
