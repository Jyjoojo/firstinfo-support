"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Mail,
  MapPin,
  Plus,
  Search,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import type { SupportUser, UserRole } from "@/lib/users";

const PAGE_SIZE = 20;

const roleLabels: Record<UserRole, string> = {
  administrateur: "Administrateur",
  technicien: "Technicien",
  client: "Client",
};

const roleStyles: Record<UserRole, string> = {
  administrateur: "bg-violet-100 text-violet-800",
  technicien: "bg-sky-100 text-sky-800",
  client: "bg-amber-100 text-amber-800",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default function UsersManagementTable({ users }: { users: SupportUser[] }) {
  const [items, setItems] = useState(users);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<"all" | UserRole>("all");
  const [speciality, setSpeciality] = useState("all");
  const [status, setStatus] = useState<"all" | "active" | "inactive">("all");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const specialities = useMemo(
    () => [...new Set(items.flatMap((user) => user.specialite ? [user.specialite] : []))],
    [items],
  );

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("fr-FR");

    return items.filter((user) => {
      const matchesSearch = !query || [user.nom, user.prenoms, user.email]
        .join(" ")
        .toLocaleLowerCase("fr-FR")
        .includes(query);
      const matchesRole = role === "all" || user.role === role;
      const matchesSpeciality = speciality === "all" || user.specialite === speciality;
      const matchesStatus = status === "all"
        || (status === "active" && user.actif)
        || (status === "inactive" && !user.actif);

      return matchesSearch && matchesRole && matchesSpeciality && matchesStatus;
    });
  }, [items, role, search, speciality, status]);

  const pageCount = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visibleUsers = filteredUsers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const allVisibleSelected = visibleUsers.length > 0
    && visibleUsers.every((user) => selectedIds.has(user.id));

  const resetPage = () => setPage(1);

  const toggleSelection = (userId: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);

      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }

      return next;
    });
  };

  const toggleVisibleSelection = () => {
    setSelectedIds((current) => {
      const next = new Set(current);

      if (allVisibleSelected) {
        visibleUsers.forEach((user) => next.delete(user.id));
      } else {
        visibleUsers.forEach((user) => next.add(user.id));
      }

      return next;
    });
  };

  const toggleActiveStatus = (user: SupportUser) => {
    // TODO: appeler l'API d'activation/désactivation dès que son URL sera définie.
    setItems((current) => current.map((item) => (
      item.id === user.id ? { ...item, actif: !item.actif } : item
    )));
    toast.success(`Compte de ${user.prenoms} ${user.nom} ${user.actif ? "désactivé" : "activé"}.`);
  };

  const announcePendingAction = (action: "modifier" | "supprimer", user: SupportUser) => {
    // TODO: connecter ces actions aux endpoints de gestion des utilisateurs.
    toast.info(`Action « ${action} » à connecter pour ${user.prenoms} ${user.nom}.`);
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-outline-variant/20 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-outline-variant/20 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <label className="relative block w-full sm:max-w-sm">
            <span className="sr-only">Rechercher un utilisateur</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
              size={17}
            />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                resetPage();
              }}
              placeholder="Rechercher par nom ou email…"
              className="h-10 w-full rounded-lg border border-outline-variant/30 bg-white py-2 pl-10 pr-3 text-sm outline-none focus:border-primary"
            />
          </label>

          <select
            value={role}
            onChange={(event) => {
              setRole(event.target.value as "all" | UserRole);
              resetPage();
            }}
            className="h-10 rounded-lg border border-outline-variant/30 bg-white px-3 text-sm text-on-surface outline-none focus:border-primary"
            aria-label="Filtrer par rôle"
          >
            <option value="all">Tous les rôles</option>
            <option value="administrateur">Administrateurs</option>
            <option value="technicien">Techniciens</option>
            <option value="client">Clients</option>
          </select>

          <select
            value={speciality}
            onChange={(event) => {
              setSpeciality(event.target.value);
              resetPage();
            }}
            className="h-10 rounded-lg border border-outline-variant/30 bg-white px-3 text-sm text-on-surface outline-none focus:border-primary"
            aria-label="Filtrer par spécialité"
          >
            <option value="all">Toutes les spécialités</option>
            {specialities.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>

          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as "all" | "active" | "inactive");
              resetPage();
            }}
            className="h-10 rounded-lg border border-outline-variant/30 bg-white px-3 text-sm text-on-surface outline-none focus:border-primary"
            aria-label="Filtrer par statut"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="inactive">Inactifs</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => toast.info("Le formulaire de création sera relié à l’API utilisateurs.")}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-on-primary hover:bg-primary/90"
        >
          <Plus size={17} />
          Ajouter un utilisateur
        </button>
      </div>

      {selectedIds.size > 0 && (
        <div className="flex items-center gap-2 border-b border-outline-variant/20 bg-primary-container/30 px-5 py-3 text-sm font-medium text-on-surface">
          <UserCheck size={17} className="text-primary" />
          {selectedIds.size} utilisateur{selectedIds.size > 1 ? "s" : ""} sélectionné{selectedIds.size > 1 ? "s" : ""}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px] text-left">
          <thead className="border-b border-outline-variant/20 bg-surface-container-low text-xs uppercase tracking-wider text-on-surface-variant">
            <tr>
              <th className="w-12 px-5 py-4">
                <input
                  type="checkbox"
                  checked={allVisibleSelected}
                  onChange={toggleVisibleSelection}
                  aria-label="Sélectionner les utilisateurs visibles"
                  className="size-4 accent-primary"
                />
              </th>
              <th className="px-4 py-4 font-semibold">Nom & prénoms</th>
              <th className="px-4 py-4 font-semibold">Rôle</th>
              <th className="px-4 py-4 font-semibold">Email</th>
              <th className="px-4 py-4 font-semibold">Téléphone</th>
              <th className="px-4 py-4 font-semibold">Statut</th>
              <th className="px-4 py-4 font-semibold">Date création</th>
              <th className="px-5 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/15">
            {visibleUsers.map((user) => {
              const isExpanded = expandedId === user.id;

              return (
                <UserRow
                  key={user.id}
                  user={user}
                  isExpanded={isExpanded}
                  isSelected={selectedIds.has(user.id)}
                  onToggleExpanded={() => setExpandedId(isExpanded ? null : user.id)}
                  onToggleSelection={() => toggleSelection(user.id)}
                  onToggleActive={() => toggleActiveStatus(user)}
                  onAction={announcePendingAction}
                />
              );
            })}
            {visibleUsers.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-sm text-on-surface-variant">
                  Aucun utilisateur ne correspond aux filtres sélectionnés.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-outline-variant/20 px-5 py-4 text-sm text-on-surface-variant sm:flex-row sm:items-center sm:justify-between">
        <span>
          Affichage {filteredUsers.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0}-
          {Math.min(currentPage * PAGE_SIZE, filteredUsers.length)} de {filteredUsers.length} utilisateurs
        </span>
        <div className="flex items-center gap-2">
          <span>Page {currentPage} sur {pageCount}</span>
          <button
            type="button"
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            disabled={currentPage === 1}
            aria-label="Page précédente"
            className="inline-flex size-8 items-center justify-center rounded-lg border border-outline-variant/30 hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={17} />
          </button>
          <button
            type="button"
            onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
            disabled={currentPage === pageCount}
            aria-label="Page suivante"
            className="inline-flex size-8 items-center justify-center rounded-lg border border-outline-variant/30 hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
    </section>
  );
}

type UserRowProps = {
  user: SupportUser;
  isExpanded: boolean;
  isSelected: boolean;
  onToggleExpanded: () => void;
  onToggleSelection: () => void;
  onToggleActive: () => void;
  onAction: (action: "modifier" | "supprimer", user: SupportUser) => void;
};

function UserRow({
  user,
  isExpanded,
  isSelected,
  onToggleExpanded,
  onToggleSelection,
  onToggleActive,
  onAction,
}: UserRowProps) {
  return (
    <>
      <tr className={isSelected ? "bg-primary-container/20" : "transition-colors hover:bg-surface-container-low/70"}>
        <td className="px-5 py-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelection}
            aria-label={`Sélectionner ${user.prenoms} ${user.nom}`}
            className="size-4 accent-primary"
          />
        </td>
        <td className="px-4 py-4">
          <button
            type="button"
            onClick={onToggleExpanded}
            aria-expanded={isExpanded}
            className="group flex items-center gap-3 text-left"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-primary-container text-sm font-bold text-on-primary-container">
              {user.prenoms.charAt(0)}{user.nom.charAt(0)}
            </span>
            <span>
              <span className="block font-semibold text-on-surface text-sm">
                {user.nom} {user.prenoms}
              </span>
              <span className="mt-0.5 flex items-center gap-1 text-xs text-on-surface-variant group-hover:text-primary">
                Voir les informations
                <ChevronDown className={isExpanded ? "rotate-180 transition-transform" : "transition-transform"} size={14} />
              </span>
            </span>
          </button>
        </td>
        <td className="px-4 py-4">
          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${roleStyles[user.role]}`}>
            {roleLabels[user.role]}
          </span>
        </td>
        <td className="px-4 py-4 text-sm text-on-surface-variant">{user.email}</td>
        <td className="px-4 py-4 text-sm text-on-surface-variant">{user.telephone}</td>
        <td className="px-4 py-4">
          <button
            type="button"
            onClick={onToggleActive}
            className={user.actif
              ? "rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-200"
              : "rounded-full bg-stone-200 px-2.5 py-1 text-xs font-semibold text-stone-700 hover:bg-stone-300"}
            title={user.actif ? "Désactiver ce compte" : "Activer ce compte"}
          >
            {user.actif ? "Actif" : "Inactif"}
          </button>
        </td>
        <td className="px-4 py-4 text-sm text-on-surface-variant">{formatDate(user.createdAt)}</td>
        <td className="px-5 py-4">
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => onAction("modifier", user)}
              aria-label={`Modifier ${user.prenoms} ${user.nom}`}
              className="inline-flex size-8 items-center justify-center rounded-lg text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container"
            >
              <Edit3 size={16} />
            </button>
            <button
              type="button"
              onClick={() => onAction("supprimer", user)}
              aria-label={`Supprimer ${user.prenoms} ${user.nom}`}
              className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-destructive hover:bg-destructive/10"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </tr>
      {isExpanded && (
        <tr className="bg-surface-container-low/60">
          <td colSpan={8} className="px-6 py-5">
            <UserDetails user={user} />
          </td>
        </tr>
      )}
    </>
  );
}

function UserDetails({ user }: { user: SupportUser }) {
  if (user.role === "technicien") {
    return (
      <div className="grid gap-5 sm:grid-cols-3">
        <Detail label="Spécialité" value={user.specialite ?? "Non renseignée"} icon={<Users size={17} />} />
        <Detail label="Tickets en cours" value={String(user.ticketsEnCours ?? 0)} icon={<UserCheck size={17} />} />
        <Detail label="Date de mise à jour" value={formatDate(user.updatedAt)} />
      </div>
    );
  }

  if (user.role === "client") {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <Detail label="Entreprise" value={user.entreprise ?? "Non renseignée"} />
        <Detail label="Secteur" value={user.secteur ?? "Non renseigné"} />
        <Detail
          label="Client officiel"
          value={user.estClientOfficiel ? "Oui" : "Non"}
          valueClassName={user.estClientOfficiel ? "bg-emerald-100 text-emerald-800" : "bg-stone-200 text-stone-700"}
        />
        <Detail label="Adresse" value={user.adresse ?? "Non renseignée"} icon={<MapPin size={17} />} />
        <Detail label="Date de mise à jour" value={formatDate(user.updatedAt)} />
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-3">
      <Detail label="Rôle système" value="Administration du portail" icon={<Mail size={17} />} />
      <Detail label="Date de mise à jour" value={formatDate(user.updatedAt)} />
    </div>
  );
}

function Detail({
  label,
  value,
  icon,
  valueClassName,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  valueClassName?: string;
}) {
  return (
    <div>
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-on-surface-variant">{label}</p>
      <p className="flex items-center gap-2 text-sm font-medium text-on-surface">
        {icon && <span className="text-primary">{icon}</span>}
        {valueClassName ? <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${valueClassName}`}>{value}</span> : value}
      </p>
    </div>
  );
}
