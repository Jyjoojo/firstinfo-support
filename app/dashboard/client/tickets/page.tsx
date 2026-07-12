import Link from "next/link";
import { Plus } from "lucide-react";
import TicketsTable from "@/app/ui/dashboard/TicketsTable";
import { tickets } from "@/lib/tickets";

export default function TicketsPage() {
    return (
        <div className="w-full p-6 lg:p-8">
            <div className="mb-6 flex flex-col gap-4 p-1 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                    <h2 className="text-2xl font-semibold text-slate-900">Gestion des tickets</h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Suivez l’avancement de vos demandes, filtrez rapidement les incidents prioritaires et ouvrez un nouveau ticket en quelques clics.
                    </p>
                </div>

                <Link
                    href="/dashboard/client/tickets/nouveau"
                    className="inline-flex items-center justify-center gap-2 rounded-sm bg-tertiary px-4 py-2.5 text-sm font-bold text-on-primary transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Plus size={18} />
                    Nouveau ticket
                </Link>
            </div>

            <TicketsTable tickets={tickets} />
        </div>
    );
}