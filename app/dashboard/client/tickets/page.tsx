import Link from "next/link";
import { Plus } from "lucide-react";
import { z } from "zod";
import TicketsTable from "@/app/ui/dashboard/TicketsTable";
import { ticketPrioritySchema, ticketStatusSchema } from "@/lib/ticket-contracts";
import { getCategories, getTickets } from "@/lib/tickets-api";

const filtersSchema = z.object({
  search: z.string().trim().max(100).optional(),
  statut: ticketStatusSchema.optional(),
  priorite: ticketPrioritySchema.optional(),
  categorie_id: z.string().trim().min(1).max(64).optional(),
  page: z.coerce.number().int().positive().optional(),
});

type TicketsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function TicketsPage({ searchParams }: TicketsPageProps) {
  const rawSearchParams = await searchParams;
  const parsedFilters = filtersSchema.safeParse({
    search: firstValue(rawSearchParams.search) || undefined,
    statut: firstValue(rawSearchParams.statut) || undefined,
    priorite: firstValue(rawSearchParams.priorite) || undefined,
    categorie_id: firstValue(rawSearchParams.categorie_id) || undefined,
    page: firstValue(rawSearchParams.page) || undefined,
  });
  const filters = parsedFilters.success ? parsedFilters.data : {};
  const [tickets, categories] = await Promise.all([
    getTickets(filters),
    getCategories(),
  ]);

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
          className="inline-flex items-center justify-center gap-2 rounded-sm bg-tertiary px-4 py-2.5 text-sm font-bold text-on-primary transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <Plus size={18} />
          Nouveau ticket
        </Link>
      </div>

      <TicketsTable
        tickets={tickets.data}
        pagination={tickets.meta}
        categories={categories}
        filters={filters}
      />
    </div>
  );
}
