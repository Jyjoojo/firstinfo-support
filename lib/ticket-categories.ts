import type { ApiCategory } from "@/lib/ticket-contracts";

export type TicketCategory = {
  id: string;
  label: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  icon: "accounting" | "hr" | "database" | "infrastructure" | "crm" | "security";
};

const categoryIconValues: TicketCategory["icon"][] = [
  "accounting", "hr", "database", "infrastructure", "crm", "security",
];

function iconForCategory(category: ApiCategory): TicketCategory["icon"] {
  const label = category.libelle.toLocaleLowerCase("fr-FR");
  if (label.includes("compta")) return "accounting";
  if (label.includes("paie") || label.includes("ressource")) return "hr";
  if (label.includes("base") || label.includes("donnée")) return "database";
  if (label.includes("infra") || label.includes("réseau")) return "infrastructure";
  if (label.includes("crm") || label.includes("commercial")) return "crm";
  if (label.includes("sécur") || label.includes("accès")) return "security";

  const hash = [...category.id].reduce((total, character) => total + character.charCodeAt(0), 0);
  return categoryIconValues[hash % categoryIconValues.length];
}

export function toTicketCategory(category: ApiCategory): TicketCategory {
  return {
    id: category.id,
    label: category.libelle,
    description: category.description ?? "",
    createdAt: category.created_at ?? "",
    updatedAt: category.updated_at ?? "",
    icon: iconForCategory(category),
  };
}

export function countUpdatedDuringLastDay(categories: TicketCategory[]) {
  const now = Date.now();
  return categories.filter((category) => {
    const updatedAt = new Date(category.updatedAt).getTime();
    return Number.isFinite(updatedAt) && now - updatedAt <= 24 * 60 * 60 * 1000;
  }).length;
}

export const ticketCategories: TicketCategory[] = [
  { id: "cat-accounting", label: "Comptabilité", description: "Tickets relatifs aux modules de comptabilité Sage.", createdAt: "2023-10-12", updatedAt: "2024-03-15", icon: "accounting" },
  { id: "cat-hr", label: "Ressources humaines", description: "Gestion de la paie, des congés et des dossiers collaborateurs.", createdAt: "2023-10-14", updatedAt: "2024-04-02", icon: "hr" },
  { id: "cat-database", label: "Base de données", description: "Performance, sauvegardes et maintenance des bases de données.", createdAt: "2023-10-20", updatedAt: "2023-10-20", icon: "database" },
  { id: "cat-infra", label: "Infrastructure", description: "Accès réseau, configuration de serveurs et VPN.", createdAt: "2024-01-05", updatedAt: "2024-05-22", icon: "infrastructure" },
  { id: "cat-crm", label: "Sage CRM", description: "Demandes liées au suivi commercial et à la relation client.", createdAt: "2024-02-08", updatedAt: "2024-05-30", icon: "crm" },
  { id: "cat-security", label: "Sécurité", description: "Accès, droits utilisateurs et alertes de sécurité.", createdAt: "2024-02-18", updatedAt: "2024-06-03", icon: "security" },
];
