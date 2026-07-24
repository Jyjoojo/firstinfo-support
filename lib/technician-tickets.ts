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
  return tickets.filter((ticket) =>
    demoTechnicianTicketIds.includes(ticket.id),
  );
}
