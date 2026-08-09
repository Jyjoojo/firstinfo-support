import { api, ApiError } from "@/lib/api";
import type { KnowledgeBaseArticle, MyResolution } from "@/lib/knowledge-base";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function relation(value: unknown): UnknownRecord | null {
  return isRecord(value) ? value : null;
}

function paginatedItems(payload: unknown, label: string): UnknownRecord[] {
  if (!isRecord(payload) || !Array.isArray(payload.data)) {
    throw new ApiError(502, `La réponse ${label} est invalide.`);
  }

  return payload.data.filter(isRecord);
}

function categoryLabel(article: UnknownRecord): string {
  const category = relation(article.categorie);
  return text(category?.libelle) ?? text(category?.nom) ?? "Non classé";
}

function plainText(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function excerpt(content: string): string {
  const normalized = plainText(content);
  return normalized.length > 180 ? `${normalized.slice(0, 177).trimEnd()}…` : normalized;
}

function readingTime(content: string): string {
  const words = plainText(content).split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 220))} min`;
}

function formatDate(value: unknown): string {
  const raw = text(value);
  if (!raw) return "Date inconnue";

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;

  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function technicianName(article: UnknownRecord): string {
  const technician = relation(article.technicien);
  const user = relation(technician?.user);
  const fullName = text(user?.nom_complet) ?? text(technician?.nom_complet);
  if (fullName) return fullName;

  const firstName = text(user?.prenom);
  const lastName = text(user?.nom);
  return [firstName, lastName].filter(Boolean).join(" ") || "Support technique";
}

function toPublicArticle(article: UnknownRecord): KnowledgeBaseArticle {
  const id = text(article.id);
  const title = text(article.titre);
  const content = text(article.contenu);
  if (!id || !title || !content) {
    throw new ApiError(502, "Un article reçu depuis l’API est incomplet.");
  }

  const category = categoryLabel(article);
  return {
    id,
    title,
    content,
    excerpt: excerpt(content),
    category,
    // L’API ne fournit pas de champ « module » distinct de la catégorie.
    module: category,
    readTime: readingTime(content),
    lastUpdated: formatDate(article.updated_at ?? article.created_at),
  };
}

function toClientResolution(article: UnknownRecord): MyResolution {
  const ticket = relation(article.ticket);
  const solution = relation(article.commentaire_solution)
    ?? relation(article.commentaireSolution);
  const id = text(article.id);
  const ticketId = text(ticket?.id) ?? text(article.ticket_id);
  const ticketReference = text(ticket?.reference);
  const title = text(ticket?.titre) ?? text(article.titre);
  const summary = text(solution?.contenu) ?? text(article.contenu);
  if (!id || !ticketId || !ticketReference || !title || !summary) {
    throw new ApiError(502, "Une résolution reçue depuis l’API est incomplète.");
  }

  const moduleLabel = categoryLabel(article);
  return {
    id,
    ticketId,
    ticketReference,
    title,
    summary,
    module: moduleLabel,
    resolvedDate: formatDate(ticket?.date_resolution ?? solution?.solution_validee_at),
    technician: technicianName(article),
    breadcrumb: ["Mes Résolutions", moduleLabel, title],
  };
}

export async function getPublicArticles(): Promise<KnowledgeBaseArticle[]> {
  const payload = await api.get<unknown>("/api/articles?perPage=100", {
    authenticated: false,
    redirectOnUnauthorized: false,
  });

  return paginatedItems(payload, "de la base de connaissances").map(toPublicArticle);
}

export async function getPublicArticle(id: string): Promise<KnowledgeBaseArticle> {
  const payload = await api.get<unknown>(`/api/articles/${encodeURIComponent(id)}`, {
    authenticated: false,
    redirectOnUnauthorized: false,
  });
  if (!isRecord(payload)) {
    throw new ApiError(502, "La réponse de l’article est invalide.");
  }

  return toPublicArticle(payload);
}

export async function getClientResolutions(options: { redirectOnUnauthorized?: boolean } = {}): Promise<MyResolution[]> {
  const payload = await api.get<unknown>("/api/client/resolutions?perPage=100", options);
  return paginatedItems(payload, "des résolutions").map(toClientResolution);
}
