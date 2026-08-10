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
  // TicketResource omet cette clé lorsque la relation assignationActive
  // n'est pas chargée (notamment sur GET /tickets/non-assignes).
  technicien_assigne: assignedTechnicianSchema.nullable().optional().default(null),
});

export const ticketCommentSchema = z.object({
  id: z.string().min(1),
  contenu: z.string(),
  est_solution: z.boolean(),
  solution_validee_at: z.string().nullable(),
  solution_rejetee_at: z.string().nullable(),
  solution_validee_par_id: z.string().nullable(),
  created_at: z.string().nullable(),
  auteur: z.object({
    id: z.string().min(1),
    nom_complet: z.string(),
    role: z.string(),
  }),
});

export const ticketAttachmentSchema = z.object({
  id: z.string().min(1),
  nom_fichier: z.string(),
  type_mime: z.string(),
  taille: z.coerce.number().nonnegative(),
  taille_lisible: z.string(),
  date_upload: z.string().nullable(),
  url_affichage: z.string(),
  url_telechargement: z.string(),
});

export const ticketDetailSchema = clientTicketSchema.extend({
  commentaires: z.array(ticketCommentSchema),
  pieces_jointes: z.array(ticketAttachmentSchema),
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
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
}).passthrough();

export const categoriesResponseSchema = z.array(categorySchema);

export type ClientTicket = z.infer<typeof clientTicketSchema>;
export type TicketComment = z.infer<typeof ticketCommentSchema>;
export type TicketAttachment = z.infer<typeof ticketAttachmentSchema>;
export type TicketDetail = z.infer<typeof ticketDetailSchema>;
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
