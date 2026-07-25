import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2 } from "lucide-react";
import AdminTicketConversation from "@/app/ui/dashboard/admin/AdminTicketConversation";
import TicketAttachments from "@/app/ui/dashboard/admin/TicketAttachments";
import TechnicianTicketDetailsCard from "@/app/ui/dashboard/technicien/TechnicianTicketDetailsCard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { tickets } from "@/lib/tickets";

export default async function TechnicianTicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ticket = tickets.find((item) => item.id === id);

  if (!ticket) {
    notFound();
  }

  const messageRows = [
    {
      author: "Client",
      time: "09:18",
      text: ticket.contenu,
      client: true,
    },
    {
      author: ticket.assigneA ?? "Équipe support",
      time: "10:45",
      text: "Bien reçu. Je procède à l’analyse de la demande et je reviens vers vous avec une première solution.",
      client: false,
      own: true,
    },
    {
      author: "Client",
      time: "11:02",
      text: "Merci. Je reste disponible si vous avez besoin d’informations complémentaires.",
      client: true,
    },
  ];

  return (
    <div className="w-full max-w-7xl p-6 lg:p-8">
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
              {ticket.id}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <aside className="space-y-5 xl:col-span-5">
          <TechnicianTicketDetailsCard ticket={ticket} />

          <section className="rounded-2xl border border-outline-variant/30 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">
              Détails client
            </p>
            <div className="mt-4 flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Building2 size={22} />
              </span>
              <div>
                <p className="font-bold text-on-surface">
                  First Info CI
                </p>
                <p className="text-sm text-on-surface-variant">
                  Support & services Sage
                </p>
              </div>
            </div>
          </section>
        </aside>

        <main className="space-y-5 xl:col-span-7">
          <AdminTicketConversation
            ticketId={ticket.id}
            initialMessages={messageRows}
            viewerRole="technician"
          />
          <TicketAttachments ticketId={ticket.id} />
        </main>
      </div>
    </div>
  );
}
