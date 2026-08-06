"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Shapes, CircleAlert, FileText, Paperclip, InfoIcon } from "lucide-react";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Field,
    FieldLabel,
} from "@/components/ui/field"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Textarea } from "@/components/ui/textarea"
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert"
import FileUpload from "@/app/ui/FileUpload";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { priorityStyles } from "@/lib/styles";
import { categoriesResponseSchema, type ApiCategory } from "@/lib/ticket-contracts";

const ACCEPTED_EXTENSIONS = new Set(["pdf", "doc", "docx", "xls", "xlsx", "png", "jpg", "jpeg"]);
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 5;

type TicketCreationResponse = {
    ticket: {
        id: string;
        reference: string;
    };
};

type ValidationErrorResponse = {
    message?: string;
    errors?: Record<string, string[]>;
};

export default function NewTicketPage() {
    const router = useRouter();
    const [categorie, setCategorie] = useState("");
    const [priorite, setPriorite] = useState("basse");
    const [categories, setCategories] = useState<ApiCategory[]>([]);
    const [fichiers, setFichiers] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        let active = true;

        fetch("/api/categories", { headers: { Accept: "application/json" } })
            .then(async (response) => {
                if (!response.ok) throw new Error();
                return response.json();
            })
            .then((data: unknown) => {
                const parsed = categoriesResponseSchema.safeParse(data);
                if (active && parsed.success) setCategories(parsed.data);
            })
            .catch(() => {
                if (active) {
                    toast.error("Chargement impossible", {
                        description: "Impossible de charger les catégories.",
                    });
                }
            });

        return () => { active = false; };
    }, []);

    function validateFiles() {
        if (fichiers.length > MAX_FILES) return `Vous pouvez joindre au maximum ${MAX_FILES} fichiers.`;

        for (const fichier of fichiers) {
            if (fichier.size > MAX_FILE_SIZE) return `Le fichier ${fichier.name} dépasse 10 Mo.`;
            const extension = fichier.name.split(".").pop()?.toLowerCase();
            if (!extension || !ACCEPTED_EXTENSIONS.has(extension)) {
                return `Le fichier ${fichier.name} n'est pas dans un format accepté.`;
            }
        }

        return "";
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const titre = String(form.get("titre") ?? "").trim();
        const description = String(form.get("description") ?? "").trim();
        const fileError = validateFiles();

        if (fileError) {
            toast.error("Pièces jointes invalides", { description: fileError });
            return;
        }

        setIsSubmitting(true);
        try {
            let body: BodyInit;
            let headers: HeadersInit | undefined;

            if (fichiers.length > 0) {
                const ticketFormData = new FormData();
                ticketFormData.append("titre", titre);
                ticketFormData.append("description", description);
                ticketFormData.append("priorite", priorite);
                if (categorie) ticketFormData.append("categorie_id", categorie);
                fichiers.forEach((fichier) => ticketFormData.append("fichiers[]", fichier));
                body = ticketFormData;
            } else {
                headers = { "Content-Type": "application/json" };
                body = JSON.stringify({
                    titre,
                    description,
                    priorite,
                    categorie_id: categorie || null,
                });
            }

            const response = await fetch("/api/tickets", { method: "POST", headers, body });
            const data = await response.json().catch(() => ({})) as TicketCreationResponse & ValidationErrorResponse;

            if (!response.ok) {
                const validationMessages = Object.values(data.errors ?? {}).flat();
                throw new Error(validationMessages[0] ?? data.message ?? "La création du ticket a échoué.");
            }

            toast.success("Ticket créé avec succès", {
                description: `Ticket ${data.ticket.reference} créé avec succès.`,
            });
            router.push(`/dashboard/client/tickets/${data.ticket.id}`);
        } catch (submissionError) {
            toast.error("Création impossible", {
                description: submissionError instanceof Error
                    ? submissionError.message
                    : "La création du ticket a échoué.",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="w-full p-6 lg:p-8">
            <Link href="/dashboard/client/tickets" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary-container/50">
                <ArrowLeft size={16} />
                Retour aux tickets
            </Link>

            <div className="px-4">
                <div className="flex flex-col gap-3">
                    <h2 className="text-xl lg:text-2xl font-semibold text-slate-900">Créer un nouveau ticket</h2>
                    <p className="text-sm lg:text-base text-slate-600 mb-5">Veillez fournir les détails du ticket afin que nos experts puissent vous aider au mieux.</p>
                </div>
                <div className="mt-4 flex flex-col lg:flex-row lg:gap-8">
                    {/* Colonne du formulaire */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 border-lg bg-on-primary px-6 py-4 rounded-lg mb-5 lg:w-2/3">
                        <div className="flex flex-col mb-5">
                            <Field>
                                <FieldLabel htmlFor="input-titre"><Pencil size={16} className="inline-block text-tertiary" />Titre du ticket *</FieldLabel>
                                <Input id="input-titre" name="titre" type="text" minLength={5} required placeholder="Erreur lors de la clôture de Sage 100" className="focus-visible:border-primary-container focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2"/>
                            </Field>
                        </div>
                        <div className="flex gap-6 mb-5">
                            <div className="flex-1 flex-col gap-1">
                                <Field>
                                    <FieldLabel htmlFor="categories"><Shapes size={16} className="inline-block text-tertiary" />Catégorie de la solution *</FieldLabel>
                                    <Select required value={categorie} onValueChange={(value) => setCategorie(value ?? "")}>
                                        <SelectTrigger id="categories" className="w-full">
                                            <SelectValue placeholder="Selectionnez une catégorie" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Sage</SelectLabel>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id}>{category.libelle}</SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </Field>
                            </div>
                            <div className="flex-1 flex-col gap-1 ">
                                <Field>
                                    <FieldLabel htmlFor="priorite"><CircleAlert size={16} className="inline-block text-tertiary" />Niveau de priorité *</FieldLabel>
                                    <div>
                                        <ToggleGroup variant="outline" type="single" value={priorite} onValueChange={(value) => value && setPriorite(value)} className="flex flex-wrap items-center gap-2">
                                            <ToggleGroupItem value="basse" aria-label="Toggle basse" className={`flex-3 ${priorityStyles.basse.toggle}`}>
                                                Basse
                                            </ToggleGroupItem>
                                            <ToggleGroupItem value="normale" aria-label="Toggle normale" className={`flex-3 ${priorityStyles.normale.toggle}`}>
                                                Normale
                                            </ToggleGroupItem>
                                            <ToggleGroupItem value="haute" aria-label="Toggle haute" className={`flex-3 ${priorityStyles.haute.toggle}`}>
                                                Haute
                                            </ToggleGroupItem><ToggleGroupItem value="urgente" aria-label="Toggle urgente" className={`flex-3 ${priorityStyles.urgente.toggle}`}>
                                                Urgente
                                            </ToggleGroupItem>
                                        </ToggleGroup>
                                    </div>
                                </Field>
                            </div>
                        </div>
                        <div className="flex flex-col mb-5">
                            <Field>
                                <FieldLabel htmlFor="textarea-message"><FileText size={16} className="inline-block text-tertiary"/>Description du problème *</FieldLabel>
                                <Textarea id="textarea-message" name="description" minLength={10} className="focus-visible:primary-container" required placeholder={"Décrivez les étapes pour réproduire le problème, les messages d'erreurs affichés..."} />
                            </Field>
                        </div>
                        <div className="mb-10">
                            <Field>
                                <FieldLabel htmlFor="pieces-jointes"><Paperclip size={16} className="inline-block text-tertiary" />Pièces jointes (Captures d&apos;écran, Logs)</FieldLabel>
                                <FileUpload onFilesChange={setFichiers} />
                            </Field>
                        </div>
                        <div className="flex justify-end space-x-2 mb-4">
                            <Button type="reset" className="px-5 bg-white border-tertiary text-tertiary hover:bg-white cursor-pointer">Annuler</Button>
                            <Button type="submit" disabled={isSubmitting} className="px-10 bg-primary-container hover:bg-primary-container/90 text-on-primary-container cursor-pointer">
                                {isSubmitting ? "Création..." : "Créer le ticket"}
                            </Button>
                        </div>
                    </form>
                    {/* Colonne de l'alerte */}
                    <div className="lg:w-1/3 lg:mt-0">
                        <Alert className="bg-error-container py-5 h-fit">
                            <InfoIcon />
                            <AlertTitle>Besoin d&apos;une assistance immédiate ?</AlertTitle>
                            <AlertDescription>
                                Pour les urgences critiques bloquant votre production, <br />
                                <p className="mt-2">
                                    Vous pouvez également contacter notre hotline technique <br />
                                   au +225 07 59 09 87 32    
                                </p>
                                
                            </AlertDescription>
                        </Alert>
                    </div>
                </div>
            </div>
        </div>
    );
}
