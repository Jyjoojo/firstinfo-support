"use client";

import { useState } from "react";
import { Edit3 } from "lucide-react";
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
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SupportUser, UserRole } from "@/lib/users";

type EditUserDialogProps = {
  user: SupportUser;
};

export default function EditUserDialog({ user }: EditUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<UserRole>(user.role);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (nextOpen) {
      setRole(user.role);
      setErrors({});
    }
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const nextErrors: Record<string, string> = {};
    const nom = String(formData.get("nom") ?? "").trim();
    const prenom = String(formData.get("prenom") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const telephone = String(formData.get("telephone") ?? "").trim();
    const specialite = String(formData.get("specialite") ?? "").trim();

    if (!nom || nom.length > 100) {
      nextErrors.nom = "Le nom est requis et ne doit pas dépasser 100 caractères.";
    }

    if (!prenom || prenom.length > 100) {
      nextErrors.prenom = "Le prénom est requis et ne doit pas dépasser 100 caractères.";
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      nextErrors.email = "Saisissez une adresse email valide.";
    }

    if (telephone.length > 20) {
      nextErrors.telephone = "Le téléphone ne doit pas dépasser 20 caractères.";
    }

    if (role === "technicien" && !specialite) {
      nextErrors.specialite = "La spécialité est requise pour un technicien.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    // TODO: appeler l'endpoint de mise à jour dès que son URL et sa méthode sont disponibles.
    toast.info("Mise à jour à connecter", {
      description: "Les valeurs ont été validées. L’appel API sera ajouté dès que l’endpoint sera disponible.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={`Modifier ${user.prenoms} ${user.nom}`}
          className="inline-flex size-8 items-center justify-center rounded-lg text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container"
        >
          <Edit3 size={16} />
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Modifier l’utilisateur</DialogTitle>
          <DialogDescription className="text-base">
            Mettez à jour les informations de {user.prenoms} {user.nom}.
          </DialogDescription>
        </DialogHeader>
        <form key={user.id} onSubmit={submit} className="space-y-6">
          <FieldGroup className="gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={Boolean(errors.nom)}>
                <Label htmlFor={`edit-user-nom-${user.id}`}>Nom *</Label>
                <Input
                  id={`edit-user-nom-${user.id}`}
                  name="nom"
                  defaultValue={user.nom}
                  maxLength={100}
                  aria-invalid={Boolean(errors.nom)}
                />
                <FieldError>{errors.nom}</FieldError>
              </Field>
              <Field data-invalid={Boolean(errors.prenom)}>
                <Label htmlFor={`edit-user-prenom-${user.id}`}>Prénom *</Label>
                <Input
                  id={`edit-user-prenom-${user.id}`}
                  name="prenom"
                  defaultValue={user.prenoms}
                  maxLength={100}
                  aria-invalid={Boolean(errors.prenom)}
                />
                <FieldError>{errors.prenom}</FieldError>
              </Field>
            </div>
            <Field data-invalid={Boolean(errors.email)}>
              <Label htmlFor={`edit-user-email-${user.id}`}>Email *</Label>
              <Input
                id={`edit-user-email-${user.id}`}
                name="email"
                type="email"
                defaultValue={user.email}
                aria-invalid={Boolean(errors.email)}
              />
              <FieldError>{errors.email}</FieldError>
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <Label htmlFor={`edit-user-role-${user.id}`}>Rôle *</Label>
                <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                  <SelectTrigger id={`edit-user-role-${user.id}`} className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="administrateur">Administrateur</SelectItem>
                    <SelectItem value="technicien">Technicien</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field data-invalid={Boolean(errors.telephone)}>
                <Label htmlFor={`edit-user-telephone-${user.id}`}>Téléphone</Label>
                <Input
                  id={`edit-user-telephone-${user.id}`}
                  name="telephone"
                  defaultValue={user.telephone}
                  maxLength={20}
                  aria-invalid={Boolean(errors.telephone)}
                />
                <FieldError>{errors.telephone}</FieldError>
              </Field>
            </div>

            {role === "technicien" && (
              <Field data-invalid={Boolean(errors.specialite)}>
                <Label htmlFor={`edit-user-specialite-${user.id}`}>Spécialité *</Label>
                <Input
                  id={`edit-user-specialite-${user.id}`}
                  name="specialite"
                  defaultValue={user.specialite}
                  aria-invalid={Boolean(errors.specialite)}
                />
                <FieldError>{errors.specialite}</FieldError>
              </Field>
            )}

            {role === "client" && (
              <div className="space-y-4 rounded-lg border border-outline-variant/30 p-4">
                <Field>
                  <Label htmlFor={`edit-user-entreprise-${user.id}`}>Entreprise</Label>
                  <Input
                    id={`edit-user-entreprise-${user.id}`}
                    name="entreprise"
                    defaultValue={user.entreprise}
                  />
                </Field>
                <Field>
                  <Label htmlFor={`edit-user-secteur-${user.id}`}>Secteur</Label>
                  <Input
                    id={`edit-user-secteur-${user.id}`}
                    name="secteur"
                    defaultValue={user.secteur}
                  />
                </Field>
                <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-on-surface">
                  <input
                    name="est_client_officiel"
                    type="checkbox"
                    defaultChecked={user.estClientOfficiel}
                    className="size-4 accent-primary"
                  />
                  Client officiel
                </label>
              </div>
            )}
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Annuler</Button>
            </DialogClose>
            <Button type="submit" className="bg-primary-container/80 hover:bg-primary-container">Enregistrer les modifications</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
