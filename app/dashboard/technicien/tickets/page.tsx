import TechnicianTicketsWorkspace from "@/app/ui/dashboard/technicien/TechnicianTicketsWorkspace";
import {
  getTechnicianTickets,
  getUnassignedTickets,
} from "@/lib/technician-tickets";

export default async function TechnicianTicketsPage() {
  const [myTickets, unassignedTickets] = await Promise.all([
    getTechnicianTickets(),
    getUnassignedTickets(),
  ]);

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
