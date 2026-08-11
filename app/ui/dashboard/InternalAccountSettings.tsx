"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, CheckIcon, EyeIcon, EyeOffIcon, XIcon } from "lucide-react";
import { motion } from "motion/react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";

type ProfileUser = {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string | null;
  role: string;
  actif: boolean;
  specialite?: string | null;
  technicien?: { specialite?: string | null } | null;
};

type ProfileFields = Pick<ProfileUser, "nom" | "prenom" | "email"> & {
  telephone: string;
};

type ProfileUpdatePayload = Partial<Omit<ProfileFields, "telephone">> & {
  telephone?: string | null;
};

type PasswordFields = {
  ancien_mot_de_passe: string;
  nouveau_mot_de_passe: string;
  confirmation_mot_de_passe: string;
};

type FieldErrors = Partial<Record<keyof ProfileFields | keyof PasswordFields, string[]>>;

type ApiPayload = {
  message?: string;
  errors?: FieldErrors;
  user?: ProfileUser;
};

const passwordRequirements = [
  { regex: /.{8,}/, text: "Au moins 8 caractères" },
  { regex: /[a-z]/, text: "Au moins une lettre minuscule" },
  { regex: /[A-Z]/, text: "Au moins une lettre majuscule" },
  { regex: /[0-9]/, text: "Au moins un chiffre" },
];

const panelAnimation = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

function initials(user: ProfileUser) {
  return `${user.prenom.trim().charAt(0)}${user.nom.trim().charAt(0)}`.toUpperCase() || "?";
}

function roleLabel(role: string) {
  const normalizedRole = role.toLowerCase();
  if (normalizedRole === "admin" || normalizedRole === "administrateur") return "Administrateur";
  if (normalizedRole === "technicien") return "Technicien";
  return role;
}

function specialty(user: ProfileUser) {
  return user.specialite ?? user.technicien?.specialite ?? (user.role.toLowerCase() === "technicien" ? "Spécialité non renseignée" : "Administration");
}

function firstError(errors: FieldErrors, field: keyof FieldErrors) {
  return errors[field]?.[0];
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-xs text-destructive">{message}</p> : null;
}

async function readResponse(response: Response) {
  return response.json().catch(() => ({})) as Promise<ApiPayload>;
}

export default function InternalAccountSettings() {
  const router = useRouter();
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileFields>({ nom: "", prenom: "", email: "", telephone: "" });
  const [profileErrors, setProfileErrors] = useState<FieldErrors>({});
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [passwords, setPasswords] = useState<PasswordFields>({
    ancien_mot_de_passe: "",
    nouveau_mot_de_passe: "",
    confirmation_mot_de_passe: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<FieldErrors>({});
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [savingPassword, setSavingPassword] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<keyof PasswordFields, boolean>>({
    ancien_mot_de_passe: false,
    nouveau_mot_de_passe: false,
    confirmation_mot_de_passe: false,
  });

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const response = await fetch("/api/auth/me", { headers: { Accept: "application/json" } });
        const payload = await response.json().catch(() => ({})) as ProfileUser & { message?: string };
        if (!response.ok) throw new Error(payload.message ?? "Impossible de charger votre profil.");
        if (!cancelled) {
          setUser(payload);
          setProfile({
            nom: payload.nom ?? "",
            prenom: payload.prenom ?? "",
            email: payload.email ?? "",
            telephone: payload.telephone ?? "",
          });
        }
      } catch (error) {
        if (!cancelled) setLoadError(error instanceof Error ? error.message : "Impossible de charger votre profil.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadProfile();
    return () => { cancelled = true; };
  }, []);

  const strength = useMemo(() => passwordRequirements.map((requirement) => ({
    ...requirement,
    met: requirement.regex.test(passwords.nouveau_mot_de_passe),
  })), [passwords.nouveau_mot_de_passe]);
  const strengthScore = strength.filter((requirement) => requirement.met).length;

  function updateProfile(field: keyof ProfileFields, value: string) {
    setProfile((current) => ({ ...current, [field]: value }));
    setProfileErrors((current) => ({ ...current, [field]: undefined }));
    setProfileMessage(null);
  }

  function updatePassword(field: keyof PasswordFields, value: string) {
    setPasswords((current) => ({ ...current, [field]: value }));
    setPasswordErrors((current) => ({ ...current, [field]: undefined }));
    setPasswordMessage(null);
  }

  async function submitProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;

    const payload: ProfileUpdatePayload = {};
    if (profile.nom.trim() !== user.nom) payload.nom = profile.nom.trim();
    if (profile.prenom.trim() !== user.prenom) payload.prenom = profile.prenom.trim();
    if (profile.email.trim() !== user.email) payload.email = profile.email.trim();
    if (profile.telephone.trim() !== (user.telephone ?? "")) payload.telephone = profile.telephone.trim() || null;

    if (Object.keys(payload).length === 0) {
      setProfileMessage("Aucune modification à enregistrer.");
      return;
    }

    setSavingProfile(true);
    setProfileErrors({});
    setProfileMessage(null);
    try {
      const response = await fetch("/api/auth/profil", {
        method: "PATCH",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await readResponse(response);
      if (!response.ok) {
        setProfileErrors(result.errors ?? {});
        setProfileMessage(result.message ?? "La mise à jour du profil a échoué.");
        return;
      }
      if (!result.user) {
        setProfileMessage("La réponse de mise à jour du profil est invalide.");
        return;
      }

      const nextUser = { ...user, ...result.user };
      setUser(nextUser);
      setProfile({
        nom: nextUser.nom,
        prenom: nextUser.prenom,
        email: nextUser.email,
        telephone: nextUser.telephone ?? "",
      });
      setProfileMessage(result.message ?? "Profil mis à jour.");
      router.refresh();
    } catch {
      setProfileMessage("Le service est momentanément indisponible.");
    } finally {
      setSavingProfile(false);
    }
  }

  async function submitPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordErrors({});
    setPasswordMessage(null);
    setSavingPassword(true);

    try {
      const response = await fetch("/api/auth/profil", {
        method: "PATCH",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(passwords),
      });
      const result = await readResponse(response);
      if (!response.ok) {
        setPasswordErrors(result.errors ?? {});
        setPasswordMessage(result.message ?? "La modification du mot de passe a échoué.");
        return;
      }

      setPasswords({ ancien_mot_de_passe: "", nouveau_mot_de_passe: "", confirmation_mot_de_passe: "" });
      setPasswordMessage(result.message ?? "Mot de passe mis à jour.");
      if (result.user) setUser((current) => current ? { ...current, ...result.user } : current);
    } catch {
      setPasswordMessage("Le service est momentanément indisponible.");
    } finally {
      setSavingPassword(false);
    }
  }

  if (loading) {
    return <div className="flex flex-1 items-center justify-center"><Spinner aria-label="Chargement du profil" className="size-8 text-primary" /></div>;
  }

  if (loadError || !user) {
    return <div role="alert" className="m-6 rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">{loadError ?? "Profil introuvable."}</div>;
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">Paramètres</h1>
        <p className="mt-1 text-sm text-on-surface-variant">Gérez vos informations personnelles et la sécurité de votre compte.</p>
      </div>

      <div>
        <h2 className="mb-4 ps-2 text-lg font-medium text-on-surface lg:text-xl">Mon profil</h2>
        <motion.section initial="hidden" animate="visible" variants={panelAnimation} className="flex items-center gap-5 rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6">
          <Avatar className="size-20 border-2 border-white shadow-sm">
            <AvatarFallback className="bg-primary/10 text-xl font-bold text-primary">{initials(user)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="flex items-center gap-2 text-xl font-semibold text-on-surface">
              {user.prenom} {user.nom}
              {user.actif && <BadgeCheck aria-label="Compte actif" className="size-5 text-emerald-600" />}
            </h3>
            <p className="mt-1 text-sm text-on-surface-variant">{specialty(user)}</p>
            <p className="text-sm text-on-surface-variant">Abidjan, Côte d&apos;Ivoire</p>
          </div>
        </motion.section>
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-2">
        <motion.section initial="hidden" animate="visible" variants={panelAnimation} className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6">
          <div className="mb-5 border-b border-outline-variant/20 pb-4">
            <h2 className="text-lg font-semibold text-on-surface">Informations personnelles</h2>
            <p className="mt-1 text-sm text-on-surface-variant">Modifiez uniquement les informations que vous souhaitez actualiser.</p>
          </div>
          <form onSubmit={submitProfile} className="grid gap-5 sm:grid-cols-2">
            {(["nom", "prenom", "email", "telephone"] as const).map((field) => {
              const labels = { nom: "Nom", prenom: "Prénoms", email: "Adresse e-mail", telephone: "Contact" };
              return (
                <div key={field} className="space-y-2">
                  <Label htmlFor={`profile-${field}`}>{labels[field]}</Label>
                  <Input
                    id={`profile-${field}`}
                    type={field === "email" ? "email" : field === "telephone" ? "tel" : "text"}
                    value={profile[field]}
                    maxLength={field === "email" ? 254 : field === "telephone" ? 20 : 100}
                    onChange={(event) => updateProfile(field, event.target.value)}
                    aria-invalid={Boolean(firstError(profileErrors, field))}
                  />
                  <FieldError message={firstError(profileErrors, field)} />
                </div>
              );
            })}
            <div className="space-y-2">
              <p className="text-sm text-on-surface-variant">Spécialité</p>
              <p className="font-medium text-on-surface">{specialty(user)}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-on-surface-variant">Rôle</p>
              <p className="font-medium text-on-surface">{roleLabel(user.role)}</p>
            </div>
            <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
              <Button type="submit" disabled={savingProfile} className="bg-primary-container hover:bg-primary-container/90">
                {savingProfile && <Spinner aria-hidden="true" className="mr-2" />}
                Enregistrer les informations
              </Button>
              {profileMessage && <p role="status" className="text-sm text-on-surface-variant">{profileMessage}</p>}
            </div>
          </form>
        </motion.section>

        <motion.section initial="hidden" animate="visible" variants={panelAnimation} className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6">
          <div className="mb-5 border-b border-outline-variant/20 pb-4">
            <h2 className="text-lg font-semibold text-on-surface">Modifier le mot de passe</h2>
            <p className="mt-1 text-sm text-on-surface-variant">Saisissez votre mot de passe actuel puis choisissez le nouveau.</p>
          </div>
          <form onSubmit={submitPassword} className="space-y-5">
            {([
              ["ancien_mot_de_passe", "Mot de passe actuel"],
              ["nouveau_mot_de_passe", "Nouveau mot de passe"],
              ["confirmation_mot_de_passe", "Confirmation du nouveau mot de passe"],
            ] as const).map(([field, label]) => (
              <div key={field} className="space-y-2">
                <Label htmlFor={field}>{label}</Label>
                <div className="relative">
                  <Input
                    id={field}
                    type={visiblePasswords[field] ? "text" : "password"}
                    value={passwords[field]}
                    onChange={(event) => updatePassword(field, event.target.value)}
                    autoComplete={field === "ancien_mot_de_passe" ? "current-password" : "new-password"}
                    className="pr-10"
                    aria-invalid={Boolean(firstError(passwordErrors, field))}
                    required
                  />
                  <button
                    type="button"
                    aria-label={visiblePasswords[field] ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    onClick={() => setVisiblePasswords((current) => ({ ...current, [field]: !current[field] }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {visiblePasswords[field] ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                  </button>
                </div>
                <FieldError message={firstError(passwordErrors, field)} />
              </div>
            ))}

            <div className="space-y-3 rounded-lg bg-surface-container-low p-4">
              <div className="h-1.5 overflow-hidden rounded-full bg-border" role="progressbar" aria-label="Robustesse du nouveau mot de passe" aria-valuemin={0} aria-valuemax={4} aria-valuenow={strengthScore}>
                <div className={`h-full transition-all ${strengthScore < 2 ? "bg-red-500" : strengthScore < 4 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${(strengthScore / 4) * 100}%` }} />
              </div>
              <ul className="grid gap-2 sm:grid-cols-2">
                {strength.map((requirement) => (
                  <li key={requirement.text} className={`flex items-center gap-2 text-xs ${requirement.met ? "text-emerald-700" : "text-muted-foreground"}`}>
                    {requirement.met ? <CheckIcon className="size-4" /> : <XIcon className="size-4" />}
                    {requirement.text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit" disabled={savingPassword} className="bg-primary-container hover:bg-primary-container/90">
                {savingPassword && <Spinner aria-hidden="true" className="mr-2" />}
                Modifier le mot de passe
              </Button>
              {passwordMessage && <p role="status" className="text-sm text-on-surface-variant">{passwordMessage}</p>}
            </div>
          </form>
        </motion.section>
      </div>
    </div>
  );
}
