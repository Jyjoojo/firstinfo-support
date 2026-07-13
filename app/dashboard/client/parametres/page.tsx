"use client";

import { Camera, PencilLine, BadgeCheck } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ParametrePage() {
    return (
        <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full">
            <div className="mb-6">
                <h2 className="text-xl lg:text-2xl font-bold text-on-surface">Paramètres</h2>
                <p className="text-on-surface-variant mt-1 text-sm">
                    Gèrez tes informations personnelles et les détails de ton compte.
                </p>
            </div>
            <div className="flex items-center gap-3 flex-row mb-4">
                <h2 className="text-lg lg:text-xl font-medium text-on-surface ps-2">Mon Profil</h2>
            </div>
            <div className="flex flex-wrap items-center mb-5 gap-6 md:gap-10 bg-surface-container-lowest py-6 ps-10 rounded-xl border border-outline-variant/20">
                <div className="relative w-fit">
                    <Avatar className="h-24 w-24 border-2 border-white">
                        {/* Remplacez par l'URL de l'image de l'utilisateur */}
                        <AvatarImage src="https://github.com/shadcn.png" alt="Avatar de l'utilisateur" />
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <label htmlFor="photo-upload" className="absolute bottom-0 right-0 w-8 h-8 bg-surface rounded-full flex items-center justify-center border-2 border-surface-container-lowest hover:bg-primary-container/80 transition-colors cursor-pointer">
                        <Camera size={16} className="text-on-primary-container" />
                        <input id="photo-upload" type="file" className="sr-only" />
                        <span className="sr-only">Changer la photo de profil</span>
                    </label>
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-medium mb-1 flex items-center gap-1.5">
                        Jean KOUASSI <BadgeCheck size={16} className="text-green-600 shrink-0" />
                    </h3>
                    <p className="text-sm text-on-surface-variant mb-1">Directeur RH</p>
                    <p className="text-sm text-on-surface-variant">Abidjan, Côte d'Ivoire</p>
                </div>
            </div>
            <div className="flex flex-wrap items-center md:gap-10 mb-5 bg-surface-container-lowest py-6 ps-10 pe-6 rounded-xl border border-outline-variant/20">
                <div className="flex w-full items-center justify-between border-b-2 border-outline-variant/20 pb-4">
                    <p className="font-medium text-lg text-on-surface">Information Personnelle</p>
                    <Dialog>
                        <form>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-1.5 cursor-pointer bg-primary-container text-surface-container-lowest hover:bg-primary-container/80 hover:text-surface-container-lowest transition-colors">Editer <PencilLine size={8} /></Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
                                <DialogHeader>
                                    <DialogTitle className="text-lg font-medium">Editer Informations Personnelles</DialogTitle>
                                    <DialogDescription>
                                        Modifiez vos informations ici. Cliquez sur Enregistrer lorsque vous avez terminé.
                                    </DialogDescription>
                                </DialogHeader>
                                <FieldGroup>
                                    <Field>
                                        <Label htmlFor="nom">Nom</Label>
                                        <Input id="nom" name="nom" defaultValue="KOUASSI" className="focus-visible:ring-primary-container" />
                                    </Field>
                                    <Field>
                                        <Label htmlFor="prenoms">Prénoms</Label>
                                        <Input id="prenoms" name="prenoms" defaultValue="Jean Navié" className="focus-visible:ring-primary-container" />
                                    </Field>
                                    <Field>
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" name="email" type="email" defaultValue="jeankouassi@gmail.com" className="focus-visible:ring-primary-container" />
                                    </Field>
                                    <Field>
                                        <Label htmlFor="contact">Contact</Label>
                                        <Input id="contact" name="contact" defaultValue="(+225) 0102471820" className="focus-visible:ring-primary-container" />
                                    </Field>
                                </FieldGroup>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline">Annuler</Button>
                                    </DialogClose>
                                    <Button type="submit" className="bg-primary-container">Enregistrer</Button>
                                </DialogFooter>
                            </DialogContent>
                        </form>
                    </Dialog>
                </div>
                <div className="grid grid-cols-3 gap-4 w-full">
                    <div className="flex flex-col gap-2">
                        <p className="text-sm text-on-surface-variant mb-1">Nom</p>
                        <p className="text-[15px] font-medium">KOUASSI</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-sm text-on-surface-variant mb-1">Prénoms</p>
                        <p className="text-[15px] font-medium">Jean Navié</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-sm text-on-surface-variant mb-1">Email adresse</p>
                        <p className="text-[15px] font-medium">jeankouassi@gmail.com</p>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-3 w-full">
                    <div className="flex flex-col gap-2">
                        <p className="text-sm text-on-surface-variant mb-1">Contact</p>
                        <p className="text-[15px] font-medium">(+225) 0102471820</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-sm text-on-surface-variant mb-1">Rôle</p>
                        <p className="text-[15px] font-medium">Client officiel</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap items-center md:gap-10 mb-5 bg-surface-container-lowest py-6 ps-10 pe-6 rounded-xl border border-outline-variant/20">
                <div className="flex w-full items-center justify-between border-b-2 border-outline-variant/20 pb-4">
                    <p className="font-medium text-lg text-on-surface">Supplémentaire</p>
                    <Button variant="outline" size="sm" className="gap-1.5 cursor-pointer bg-on-surface-container-lowest text-on-surface-variant hover:bg-on-surface-container-lowest/80 hover:text-on-surface-variant transition-colors">Editer <PencilLine size={8} /></Button>
                </div>
                <div className="grid grid-cols-3 gap-4 w-full">
                    <div className="flex flex-col gap-2">
                        <p className="text-sm text-on-surface-variant mb-1">Entreprise</p>
                        <p className="text-[15px] font-medium">MyTouchPoint</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-sm text-on-surface-variant mb-1">Secteur</p>
                        <p className="text-[15px] font-medium">Finance et paiements</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <p className="text-sm text-on-surface-variant mb-1">Adresse</p>
                        <p className="text-[15px] font-medium">2 Plateau Dokui</p>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-3 w-full">
                    <div className="flex flex-col gap-2">
                        <p className="text-sm text-on-surface-variant mb-1">Pays</p>
                        <p className="text-[15px] font-medium">Côte d'Ivoire</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap items-center md:gap-10 mb-5 bg-surface-container-lowest py-6 ps-10 pe-6 rounded-xl border border-outline-variant/20">
                
            </div>
        </div>
    );
}