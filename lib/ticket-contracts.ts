import { z } from "zod";

export const ticketStatusSchema = z.enum([
  "nouveau",
  "en_cours",
  "en_attente",
  "resolu",
  "ferme",
]);

export const ticketPrioritySchema = z.enum([
  "basse",
  "normale",
  "haute",
  "urgente",
]);

const ticketCategorySummarySchema = z.object({
  id: z.string().min(1),
  libelle: z.string(),
});

const ticketClientSchema = z.object({
  id: z.string().min(1),
  nom_complet: z.string(),
  entreprise: z.string(),
});

const assignedTechnicianSchema = z.object({
  id: z.string().min(1),
  nom_complet: z.string(),
  specialite: z.string().nullable().optional(),
});

export const clientTicketSchema = z.object({
  id: z.string().min(1),
  reference: z.string().min(1),
  titre: z.string(),
  description: z.string(),
  statut: ticketStatusSchema,
  priorite: ticketPrioritySchema,
  source_creation: z.string(),
  date_resolution: z.string().nullable(),
  attend_validation_client: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  categorie: ticketCategorySummarySchema.nullable(),
  client: ticketClientSchema.nullable(),
  technicien_assigne: assignedTechnicianSchema.nullable(),
});

const paginationLinkSchema = z.object({
  url: z.string().nullable(),
  label: z.string(),
  page: z.coerce.number().int().positive().nullable(),
  active: z.boolean(),
});

export const ticketsResponseSchema = z.object({
  data: z.array(clientTicketSchema),
  links: z.object({
    first: z.string(),
    last: z.string(),
    prev: z.string().nullable(),
    next: z.string().nullable(),
  }),
  meta: z.object({
    current_page: z.coerce.number().int().positive(),
    from: z.coerce.number().int().positive().nullable(),
    last_page: z.coerce.number().int().positive(),
    links: z.array(paginationLinkSchema),
    path: z.string(),
    per_page: z.coerce.number().int().positive(),
    to: z.coerce.number().int().positive().nullable(),
    total: z.coerce.number().int().nonnegative(),
  }),
});

export const categorySchema = z.object({
  id: z.string().min(1),
  libelle: z.string(),
  description: z.string().nullable().optional(),
}).passthrough();

export const categoriesResponseSchema = z.array(categorySchema);

export type ClientTicket = z.infer<typeof clientTicketSchema>;
export type TicketStatus = z.infer<typeof ticketStatusSchema>;
export type TicketPriority = z.infer<typeof ticketPrioritySchema>;
export type TicketsResponse = z.infer<typeof ticketsResponseSchema>;
export type ApiCategory = z.infer<typeof categorySchema>;

export type TicketFilters = {
  search?: string;
  statut?: TicketStatus;
  priorite?: TicketPriority;
  categorie_id?: string;
  page?: number;
};
