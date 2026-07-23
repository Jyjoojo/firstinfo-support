"use client";

import { useId, useMemo, useState } from "react";
import { Camera, PencilLine, BadgeCheck, EyeOffIcon, EyeIcon, CheckIcon, XIcon } from "lucide-react"
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
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"

const requirements = [
    { regex: /.{8,}/, text: "Au moins 8 caractères" },
    { regex: /[0-9]/, text: "Au moins 1 chiffre" },
    { regex: /[a-z]/, text: "Au moins 1 lettre miniscule" },
    { regex: /[A-Z]/, text: "Au moins 1 lettre majuscule" },
];

export default function ParametrePage() {
    const id = useId();
    const [password, setPassword] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    const passwordsMatch = useMemo(() => {
        return password === confirmPassword;
    }, [password, confirmPassword]);
    const strength = requirements.map((req) => ({
        met: req.regex.test(password),
        text: req.text,
    }));
    const strengthScore = useMemo(() => {
        return strength.filter((req) => req.met).length;
    }, [strength]);
    const getStrengthColor = (score: number) => {
        if (score === 0) return "bg-border";
        if (score <= 1) return "bg-red-500";
        if (score <= 2) return "bg-orange-500";
        if (score === 3) return "bg-amber-500";
        return "bg-emerald-500";
    };
    const getStrengthText = (score: number) => {
        if (score === 0) return "Entrer un mot de passe";
        if (score <= 2) return "Mot de passe faible";
        if (score === 3) return "Mot de passe moyen";
        return "Mot de passe fort";
    };

    return (
        <div className="p-6 lg:p-8 max-w-7xl mx-auto w-full">
            <div className="mb-6">
                <h2 className="text-xl lg:text-2xl font-bold text-on-surface">Paramètres</h2>
                <p className="text-on-surface-variant mt-1 text-base">
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
                        <AvatarImage
                            src="https://github.com/shadcn.png"
                            alt="Avatar de l&apos;utilisateur"
                        />
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
                    <p className="text-sm text-on-surface-variant">
                        Abidjan, Côte d&apos;Ivoire
                    </p>
                </div>
            </div>
            <div className="flex gap-5">
                <div className="flex-1 flex-wrap items-center md:gap-10 mb-5 bg-surface-container-lowest py-6 ps-10 pe-6 rounded-xl border border-outline-variant/20">
                    <div className="flex w-full items-center justify-between border-b-2 border-outline-variant/20 pb-2 mb-9">
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
                    <div className="mb-6 grid w-full grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
                        <div className="flex flex-col gap-2">
                            <p className="text-sm text-on-surface-variant">Nom</p>
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
                <div className="flex-1 flex-col flex-wrap md:gap-1 mb-5 bg-surface-container-lowest py-6 ps-10 pe-6 rounded-xl border border-outline-variant/20">
                    <h2 className="text-lg font-medium text-on-surface">Modifier mot de passe</h2>
                    <p className="text-on-surface-variant text-[15px] mb-6">
                        Entrez un nouveau mot de passe pour protéger votre compte.
                    </p>
                    <form className="flex flex-col gap-3">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor={id}>Nouveau mot de passe</Label>
                            <InputGroup className="w-lg">
                                <InputGroupInput
                                    required
                                    aria-describedby={`${id}-description`}
                                    id={id}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    type={isVisible ? "text" : "password"}
                                    value={password}
                                    className="[&::-ms-reveal]:hidden [&::-webkit-reveal]:hidden"
                                />
                                <InputGroupAddon align="inline-end">
                                    <Button
                                        aria-label={isVisible ? "Hide password" : "Show password"}
                                        onClick={() => setIsVisible(!isVisible)}
                                        size="icon-xs"
                                        variant="ghost"
                                    >
                                        {isVisible ? (
                                            <EyeOffIcon aria-hidden="true" />
                                        ) : (
                                            <EyeIcon aria-hidden="true" />
                                        )}
                                    </Button>
                                </InputGroupAddon>
                            </InputGroup>
                        </div>
                        <div
                            aria-label="Password strength"
                            aria-valuemax={4}
                            aria-valuemin={0}
                            aria-valuenow={strengthScore}
                            className="h-1 w-lg overflow-hidden rounded-full bg-border"
                            role="progressbar"
                            tabIndex={-1}
                        >
                            <div
                                className={`h-full ${getStrengthColor(strengthScore)} transition-all duration-500 ease-out`}
                                style={{ width: `${(strengthScore / 4) * 100}%` }}
                            />
                        </div>
                        <p
                            className="font-medium text-foreground text-sm"
                            id={`${id}-description`}
                        >
                            {getStrengthText(strengthScore)}. Doit contenir:
                        </p>
                        <ul aria-label="Password requirements" className="flex flex-col gap-1.5">
                            {strength.map((req) => (
                                <li className="flex items-center gap-2" key={req.text}>
                                    {req.met ? (
                                        <CheckIcon
                                            aria-hidden="true"
                                            className="size-4 text-emerald-500"
                                        />
                                    ) : (
                                        <XIcon
                                            aria-hidden="true"
                                            className="size-4 text-muted-foreground/80"
                                        />
                                    )}
                                    <span
                                        className={`text-xs ${req.met ? "text-emerald-600" : "text-muted-foreground"}`}
                                    >
                                        {req.text}
                                        <span className="sr-only">
                                            {req.met ? " - Requirement met" : " - Requirement not met"}
                                        </span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <div className="flex flex-col gap-2 mt-4">
                            <Label htmlFor={`${id}-confirm`}>Confirmation du mot de passe</Label>

                            <InputGroup className="w-lg">
                                <InputGroupInput
                                    required
                                    id={`${id}-confirm`}
                                    placeholder="Confirmer le mot de passe"
                                    type={isConfirmVisible ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="[&::-ms-reveal]:hidden [&::-webkit-reveal]:hidden"
                                />

                                <InputGroupAddon align="inline-end">
                                    <Button
                                        type="button"
                                        aria-label={isConfirmVisible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                                        onClick={() => setIsConfirmVisible(!isConfirmVisible)}
                                        size="icon-xs"
                                        variant="ghost"
                                    >
                                        {isConfirmVisible ? (
                                            <EyeOffIcon aria-hidden="true" />
                                        ) : (
                                            <EyeIcon aria-hidden="true" />
                                        )}
                                    </Button>
                                </InputGroupAddon>
                            </InputGroup>
                        </div>
                        {confirmPassword && !passwordsMatch && (
                            <p className="text-sm text-red-600">
                                Les mots de passe ne correspondent pas.
                            </p>
                        )}
                        <Button
                            type="submit"
                            className="mt-6 w-lg bg-primary-container hover:bg-primary-container/90"
                            disabled={!passwordsMatch || strengthScore < 4}
                        >
                            Enregistrer
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
