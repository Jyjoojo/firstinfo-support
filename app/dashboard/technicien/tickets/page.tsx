import TechnicianTicketsWorkspace from "@/app/ui/dashboard/technicien/TechnicianTicketsWorkspace";
import { tickets } from "@/lib/tickets";
import { getDemoTechnicianTickets } from "@/lib/technician-tickets";

export default function TechnicianTicketsPage() {
  const myTickets = getDemoTechnicianTickets(tickets);
  const unassignedTickets = tickets.filter(
    (ticket) => ticket.statut === "nouveau" && ticket.assigneA === null,
  );

  return (
    <div className="w-full max-w-7xl p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-on-surface">Mes tickets</h1>
        <p className="mt-1 text-base text-on-surface-variant">
          Traitez vos demandes assignées ou prenez en charge un ticket ouvert.
        </p>
      </div>

      <TechnicianTicketsWorkspace
        myTickets={myTickets}
        unassignedTickets={unassignedTickets}
      />
    </div>
  );
}
