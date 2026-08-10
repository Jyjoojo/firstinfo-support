import { z } from "zod";
import { ApiError, api } from "@/lib/api";
import {
  clientTicketSchema,
  ticketsResponseSchema,
  type ClientTicket,
} from "@/lib/ticket-contracts";
import type { Ticket } from "@/lib/tickets";

export const demoTechnicianTicketIds = [
  "TK-1001",
  "TK-1002",
  "TK-1004",
  "TK-5007",
  "TK-5008",
  "TK-5009",
  "TK-5010",
];

export function getDemoTechnicianTickets(tickets: Ticket[]) {
  return tickets.filter((ticket) => demoTechnicianTicketIds.includes(ticket.id));
}

const technicianTicketsResponseSchema = z.union([
  ticketsResponseSchema,
  z.array(clientTicketSchema),
  z.object({ data: z.array(clientTicketSchema) }),
]);

function readTickets(data: unknown, label: string): ClientTicket[] {
  const parsed = technicianTicketsResponseSchema.safeParse(data);

  if (!parsed.success) {
    throw new ApiError(
      502,
      `La réponse des ${label} est invalide.`,
      parsed.error.flatten(),
    );
  }

  return Array.isArray(parsed.data) ? parsed.data : parsed.data.data;
}

export async function getTechnicianTickets(): Promise<ClientTicket[]> {
  const data = await api.get<unknown>("/api/tickets");
  return readTickets(data, "tickets du technicien");
}

export async function getUnassignedTickets(): Promise<ClientTicket[]> {
  const data = await api.get<unknown>("/api/tickets/non-assignes");
  return readTickets(data, "tickets non assignés");
}
