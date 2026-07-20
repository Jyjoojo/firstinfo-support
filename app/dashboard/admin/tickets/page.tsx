import { Ticket } from "lucide-react";
import AdminTicketsTable from "@/app/ui/dashboard/admin/AdminTicketsTable";
import { tickets } from "@/lib/tickets";

export default function AdminTicketsPage() {
  return (
    <div className="w-full max-w-7xl p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Administration</p>
          <h1 className="mt-1 flex items-center gap-2 text-2xl font-bold text-on-surface"><Ticket size={24} className="text-primary" /> Tous les tickets</h1>
          <p className="mt-1 text-sm text-on-surface-variant">Consultez, filtrez et pilotez l&apos;ensemble des demandes de support.</p>
        </div>
      </div>
      <AdminTicketsTable tickets={tickets} />
    </div>
  );
}
