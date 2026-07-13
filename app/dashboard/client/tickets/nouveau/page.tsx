"use client";

import Link from "next/link";
import { ArrowLeft, Pencil, Shapes, CircleAlert, FileText, Paperclip, InfoIcon } from "lucide-react";
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
    FieldDescription,
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

export default function NewTicketPage() {
    function handleFiles(files: FileList) {
        throw new Error("Function not implemented.");
    }

    return (
        <div className="w-full p-6 lg:p-8">
            <Link href="/dashboard/client/tickets" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary-container/50">
                <ArrowLeft size={16} />
                Retour aux tickets
            </Link>

            <div className="p-4">
                <div className="flex flex-col gap-3">
                    <h2 className="text-xl lg:text-2xl font-semibold text-slate-900">Créer un nouveau ticket</h2>
                    <p className="text-sm lg:text-base text-slate-600 mb-5">Veillez fournir les détails du ticket afin que nos experts puissent vous aider au mieux.</p>
                </div>
                <div className="mt-4 flex flex-col lg:flex-row lg:gap-8">
                    {/* Colonne du formulaire */}
                    <form className="flex flex-col gap-4 border-lg bg-on-primary px-6 py-4 rounded-lg mb-5 lg:w-2/3">
                        <div className="flex flex-col mb-5">
                            <Field>
                                <FieldLabel htmlFor="input-titre"><Pencil size={16} className="inline-block text-tertiary" />Titre du ticket *</FieldLabel>
                                <Input id="input-titre" type="text" required placeholder="Erreur lors de la clôture de Sage 100" className="focus-visible:border-primary-container focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-2"/>
                            </Field>
                        </div>
                        <div className="flex gap-6 mb-5">
                            <div className="flex-1 flex-col gap-1">
                                <Field>
                                    <FieldLabel htmlFor="categories"><Shapes size={16} className="inline-block text-tertiary" />Catégorie de la solution *</FieldLabel>
                                    <Select required>
                                        <SelectTrigger id="categories" className="w-full">
                                            <SelectValue placeholder="Selectionnez une catégorie" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Sage</SelectLabel>
                                                <SelectItem value="sage-100-comptabilite">Sage 100 Comptabilité</SelectItem>
                                                <SelectItem value="banana">Sage Paie & RH</SelectItem>
                                                <SelectItem value="sage-commerciale">Sage Gestion Commerciale</SelectItem>
                                                <SelectItem value="sage-immobilisations">Sage Immobilisations</SelectItem>
                                                <SelectItem value="sage-crm">Sage CRM</SelectItem>
                                                <SelectItem value="autre">Autre</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </Field>
                            </div>
                            <div className="flex-1 flex-col gap-1 ">
                                <Field>
                                    <FieldLabel htmlFor="priorite"><CircleAlert size={16} className="inline-block text-tertiary" />Niveau de priorité *</FieldLabel>
                                    <div>
                                        <ToggleGroup variant="outline" type="single" defaultValue="basse" className="flex flex-wrap items-center gap-2">
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
                                <Textarea id="textarea-message" className="focus-visible:primary-container" required placeholder="Décrivez les étapes pour réproduire le problème, les messages d'erreurs affichés..." />
                            </Field>
                        </div>
                        <div className="mb-10" onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                handleFiles(e.dataTransfer.files);
                            }}
                        >
                            <Field>
                                <FieldLabel htmlFor="pieces-jointes"><Paperclip size={16} className="inline-block text-tertiary" />Pièces jointes (Captures d'écran, Logs)</FieldLabel>
                                <FileUpload />
                            </Field>
                        </div>
                        <div className="flex justify-end space-x-2 mb-4">
                            <Button type="reset" className="px-5 bg-white border-tertiary text-tertiary hover:bg-white cursor-pointer">Annuler</Button>
                            <Button type="submit" className="px-10 bg-primary-container hover:bg-primary-container/90 text-on-primary-container cursor-pointer">Créer le ticket</Button>
                        </div>
                    </form>
                    {/* Colonne de l'alerte */}
                    <div className="lg:w-1/3 lg:mt-0">
                        <Alert className="bg-error-container py-5 h-fit">
                            <InfoIcon />
                            <AlertTitle>Besoin d'une assistance immédiate ?</AlertTitle>
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
