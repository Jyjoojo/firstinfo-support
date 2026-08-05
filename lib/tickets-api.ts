import { api, ApiError } from "@/lib/api";
import {
  categoriesResponseSchema,
  ticketsResponseSchema,
  type ApiCategory,
  type TicketFilters,
  type TicketsResponse,
} from "@/lib/ticket-contracts";

export async function getTickets(filters: TicketFilters = {}): Promise<TicketsResponse> {
  const searchParams = new URLSearchParams();

  if (filters.search) searchParams.set("search", filters.search);
  if (filters.statut) searchParams.set("statut", filters.statut);
  if (filters.priorite) searchParams.set("priorite", filters.priorite);
  if (filters.categorie_id) searchParams.set("categorie_id", filters.categorie_id);
  if (filters.page && filters.page > 1) searchParams.set("page", String(filters.page));

  const query = searchParams.size ? `?${searchParams.toString()}` : "";
  const data = await api.get<unknown>(`/api/tickets${query}`);
  const parsed = ticketsResponseSchema.safeParse(data);

  if (!parsed.success) {
    throw new ApiError(502, "La réponse des tickets est invalide.", parsed.error.flatten());
  }

  return parsed.data;
}

export async function getCategories(): Promise<ApiCategory[]> {
  const data = await api.get<unknown>("/api/categories");
  const parsed = categoriesResponseSchema.safeParse(data);

  if (!parsed.success) {
    throw new ApiError(502, "La réponse des catégories est invalide.", parsed.error.flatten());
  }

  return parsed.data;
}
