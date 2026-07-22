"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SupportUser, UserRole } from "@/lib/users";

type FormErrors = Record<string, string>;

type CreateUserDialogProps = {
  onCreated: (user: SupportUser) => void;
};

export default function CreateUserDialog({ onCreated }: CreateUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<UserRole>("technicien");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setRole("technicien");
    setErrors({});
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      resetForm();
    }
  };

  const validate = (data: FormData) => {
    const nextErrors: FormErrors = {};
    const nom = String(data.get("nom") ?? "").trim();
    const prenom = String(data.get("prenom") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const telephone = String(data.get("telephone") ?? "").trim();
    const specialite = String(data.get("specialite") ?? "").trim();

    if (!nom || nom.length > 100) {
      nextErrors.nom = "Le nom est requis et ne doit pas dépasser 100 caractères.";
    }

    if (!prenom || prenom.length > 100) {
      nextErrors.prenom = "Le prénom est requis et ne doit pas dépasser 100 caractères.";
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      nextErrors.email = "Saisissez une adresse email valide.";
    }

    if (password.length < 8) {
      nextErrors.password = "La valeur saisie doit contenir au moins 8 caractères.";
    }

    if (telephone.length > 20) {
      nextErrors.telephone = "Le téléphone ne doit pas dépasser 20 caractères.";
    }

    if (role === "technicien" && !specialite) {
      nextErrors.specialite = "La spécialité est requise pour un technicien.";
    }

    return nextErrors;
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextErrors = validate(formData);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const nom = String(formData.get("nom")).trim();
    const prenom = String(formData.get("prenom")).trim();
    const telephone = String(formData.get("telephone")).trim();
    const payload = {
      nom,
      prenom,
      email: String(formData.get("email")).trim(),
      password: String(formData.get("password")),
      role,
      ...(telephone ? { telephone } : {}),
      ...(role === "technicien" ? { specialite: String(formData.get("specialite")).trim() } : {}),
      ...(role === "client" ? {
        entreprise: String(formData.get("entreprise")).trim(),
        secteur: String(formData.get("secteur")).trim(),
        est_client_officiel: formData.get("est_client_officiel") === "on",
      } : {}),
    };

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => null) as { message?: string; errors?: Record<string, string[]> } | null;

      if (!response.ok) {
        const apiErrors = Object.fromEntries(
          Object.entries(result?.errors ?? {}).map(([key, messages]) => [key, messages[0]]),
        );
        setErrors(apiErrors);
        throw new Error(result?.message ?? "La création de l’utilisateur a échoué.");
      }

      const now = new Date().toISOString();
      onCreated({
        id: crypto.randomUUID(),
        nom,
        prenoms: prenom,
        email: payload.email,
        role,
        telephone,
        actif: true,
        createdAt: now,
        updatedAt: now,
        ...(role === "technicien" ? { specialite: payload.specialite, ticketsEnCours: 0 } : {}),
        ...(role === "client" ? {
          entreprise: payload.entreprise,
          secteur: payload.secteur,
          estClientOfficiel: payload.est_client_officiel,
        } : {}),
      });
      toast.success("Utilisateur créé", {
        description: `${prenom} ${nom} a été ajouté avec succès.`,
      });
      handleOpenChange(false);
    } catch (error) {
      toast.error("Création impossible", {
        description: error instanceof Error ? error.message : "Une erreur est survenue.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-on-primary hover:bg-primary/90"
        >
          <Plus size={17} />
          Ajouter un utilisateur
        </button>
      </DialogTrigger>
      <DialogContent className="border-0 bg-transparent p-0 shadow-none sm:max-w-lg">
        <Card className="max-h-[calc(90vh-2rem)] gap-0 py-0">
          <CardHeader className="border-b border-outline-variant/20 py-5">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Ajouter un utilisateur</DialogTitle>
              <DialogDescription className="text-base">
                Créez un compte administrateur, technicien ou client.
              </DialogDescription>
            </DialogHeader>
          </CardHeader>
          <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
            <CardContent className="min-h-0 flex-1 overflow-y-auto py-5">
              <FieldGroup className="gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field data-invalid={Boolean(errors.nom)}>
                    <Label htmlFor="user-nom">Nom *</Label>
                    <Input id="user-nom" name="nom" maxLength={100} aria-invalid={Boolean(errors.nom)} />
                    <FieldError>{errors.nom}</FieldError>
                  </Field>
                  <Field data-invalid={Boolean(errors.prenom)}>
                    <Label htmlFor="user-prenom">Prénom *</Label>
                    <Input id="user-prenom" name="prenom" maxLength={100} aria-invalid={Boolean(errors.prenom)} />
                    <FieldError>{errors.prenom}</FieldError>
                  </Field>
                </div>
                <Field data-invalid={Boolean(errors.email)}>
                  <Label htmlFor="user-email">Email *</Label>
                  <Input id="user-email" name="email" type="email" aria-invalid={Boolean(errors.email)} />
                  <FieldError>{errors.email}</FieldError>
                </Field>
                <Field data-invalid={Boolean(errors.password)}>
                  <Label htmlFor="user-password">Mot de passe *</Label>
                  <Input id="user-password" name="password" type="password" minLength={8} aria-invalid={Boolean(errors.password)} />
                  <FieldError>{errors.password}</FieldError>
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <Label htmlFor="user-role">Rôle *</Label>
                    <select
                      id="user-role"
                      name="role"
                      value={role}
                      onChange={(event) => setRole(event.target.value as UserRole)}
                      className="h-9 w-full rounded-md border border-input bg-transparent px-2.5 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
                    >
                      <option value="administrateur">Administrateur</option>
                      <option value="technicien">Technicien</option>
                      <option value="client">Client</option>
                    </select>
                  </Field>
                  <Field data-invalid={Boolean(errors.telephone)}>
                    <Label htmlFor="user-telephone">Téléphone</Label>
                    <Input id="user-telephone" name="telephone" maxLength={20} aria-invalid={Boolean(errors.telephone)} />
                    <FieldError>{errors.telephone}</FieldError>
                  </Field>
                </div>

                {role === "technicien" && (
                  <Field data-invalid={Boolean(errors.specialite)}>
                    <Label htmlFor="user-specialite">Spécialité *</Label>
                    <Input id="user-specialite" name="specialite" aria-invalid={Boolean(errors.specialite)} />
                    <FieldError>{errors.specialite}</FieldError>
                  </Field>
                )}

                {role === "client" && (
                  <div className="space-y-4 rounded-lg border border-outline-variant/30 p-4">
                    <Field>
                      <Label htmlFor="user-entreprise">Entreprise</Label>
                      <Input id="user-entreprise" name="entreprise" />
                    </Field>
                    <Field>
                      <Label htmlFor="user-secteur">Secteur</Label>
                      <Input id="user-secteur" name="secteur" />
                    </Field>
                    <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-on-surface">
                      <input name="est_client_officiel" type="checkbox" className="size-4 accent-primary" />
                      Client officiel
                    </label>
                  </div>
                )}
              </FieldGroup>
            </CardContent>
            <CardFooter className="justify-end gap-2 border-t border-outline-variant/20 py-4">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isSubmitting}>Annuler</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting} className="bg-primary-container/80 hover:bg-primary-container">
                {isSubmitting ? "Création…" : "Créer l’utilisateur"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
