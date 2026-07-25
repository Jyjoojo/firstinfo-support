import Link from "next/link";
import {
  Activity,
  FolderKanban,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import CategoriesPageTransition from "@/app/ui/dashboard/admin/CategoriesPageTransition";
import TicketCategoriesTable from "@/app/ui/dashboard/TicketCategoriesTable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ticketCategories } from "@/lib/ticket-categories";

export default function TechnicianTicketCategoriesPage() {
  return (
    <CategoriesPageTransition>
      <div className="w-full max-w-7xl p-6 lg:p-8">
        <div className="mb-7">
          <Breadcrumb className="mb-5">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/dashboard/technicien">
                    Tableau de bord
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/dashboard/technicien/tickets">
                    Tickets
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  Catégories
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="mt-2 text-2xl font-bold text-on-surface">
            Catégories des tickets
          </h1>
          <p className="mt-1 text-base text-on-surface-variant">
            Visualisez les catégories utilisées pour qualifier les demandes
            de support.
          </p>
        </div>

        <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <article className="flex items-center gap-4 rounded-xl border border-outline-variant/20 bg-white p-5 shadow-lg">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-tertiary">
              <FolderKanban size={21} />
            </span>
            <div>
              <p className="text-sm font-medium text-on-surface-variant">
                Total catégories
              </p>
              <p className="text-2xl font-bold text-on-surface">
                {ticketCategories.length}
              </p>
            </div>
          </article>

          <article className="flex items-center gap-4 rounded-xl border border-outline-variant/20 bg-white p-5 shadow-lg">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-teal-700/10 text-teal-700">
              <RefreshCw size={21} />
            </span>
            <div>
              <p className="text-sm font-medium text-on-surface-variant">
                Mises à jour (24h)
              </p>
              <p className="text-2xl font-bold text-on-surface">
                4
              </p>
            </div>
          </article>

          <article className="flex items-center gap-4 rounded-xl border border-outline-variant/20 bg-white p-5 shadow-lg">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-700/10 text-emerald-700">
              <ShieldCheck size={21} />
            </span>
            <div>
              <p className="text-sm font-medium text-on-surface-variant">
                Activité du système
              </p>
              <p className="font-semibold text-on-surface">
                Base de données synchronisée
              </p>
            </div>
            <Activity
              className="ml-auto text-emerald-700"
              size={20}
            />
          </article>
        </section>

        <TicketCategoriesTable
          categories={ticketCategories}
          readOnly
        />
      </div>
    </CategoriesPageTransition>
  );
}
