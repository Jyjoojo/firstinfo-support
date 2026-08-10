import { z } from "zod";
import { api, ApiError } from "@/lib/api";

const categorySchema = z.object({
  id: z.string().min(1),
  libelle: z.string(),
});

export const recentTicketSchema = z.object({
  id: z.string().min(1),
  reference: z.string().min(1),
  titre: z.string(),
  categorie: categorySchema.nullable(),
  statut: z.string(),
  created_at: z.string(),
});

export const popularArticleSchema = z.object({
  id: z.string().min(1),
  titre: z.string(),
  categorie: categorySchema.nullable(),
  vues: z.coerce.number().int().nonnegative(),
});

const clientDashboardSchema = z.object({
  tickets_actifs: z.coerce.number().int().nonnegative(),
  solutions_en_attente: z.coerce.number().int().nonnegative(),
  tickets_recents: z.array(recentTicketSchema),
  articles_plus_vus: z.array(popularArticleSchema),
});

export type RecentClientTicket = z.infer<typeof recentTicketSchema>;
export type PopularKnowledgeArticle = z.infer<typeof popularArticleSchema>;
export type ClientDashboard = z.infer<typeof clientDashboardSchema>;

export async function getClientDashboard(options: { redirectOnUnauthorized?: boolean } = {}): Promise<ClientDashboard> {
  const payload = await api.get<unknown>("/api/client/dashboard", options);
  const parsed = clientDashboardSchema.safeParse(payload);

  if (!parsed.success) {
    throw new ApiError(502, "La réponse du tableau de bord client est invalide.", parsed.error.flatten());
  }

  return parsed.data;
}
