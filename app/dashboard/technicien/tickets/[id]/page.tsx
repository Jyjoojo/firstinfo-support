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
import { ApiError } from "@/lib/api";
import { getAuthenticatedUser } from "@/lib/auth";
import { getTicket } from "@/lib/tickets-api";

function formatTime(value: string | null) {
  if (!value) return "—";
  const date = new Date(value.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return value;

  const parts = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? "";
  const month = part("month");

  return `${part("day")} ${month.charAt(0).toLocaleUpperCase("fr-FR")}${month.slice(1)} ${part("year")}, ${part("hour")}:${part("minute")}`;
}

export default async function TechnicianTicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let ticket;

  try {
    ticket = await getTicket(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
  const currentUser = await getAuthenticatedUser();

  const messages = ticket.commentaires.map((comment) => ({
    id: comment.id,
    author: comment.auteur.nom_complet,
    time: formatTime(comment.created_at),
    text: comment.contenu,
    client: comment.auteur.role === "client",
    own: comment.auteur.id === currentUser?.id,
    solution: comment.est_solution,
  }));

  return (
    <div className="w-full max-w-7xl p-6 lg:p-8">
      <Breadcrumb className="mb-5">
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink asChild><Link href="/dashboard/technicien">Tableau de bord</Link></BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink asChild><Link href="/dashboard/technicien/tickets">Tickets</Link></BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>{ticket.reference}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <aside className="space-y-5 xl:col-span-5">
          <TechnicianTicketDetailsCard key={ticket.updated_at} ticket={ticket} />

          <section className="rounded-2xl border border-outline-variant/30 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">Détails client</p>
            <div className="mt-4 flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Building2 size={22} /></span>
              <div className="min-w-0">
                <p className="font-bold text-on-surface">{ticket.client?.nom_complet ?? "Client non renseigné"}</p>
                <p className="truncate text-sm text-on-surface-variant">{ticket.client?.entreprise || "Entreprise non renseignée"}</p>
              </div>
            </div>
          </section>
        </aside>

        <main className="space-y-5 xl:col-span-7">
          <AdminTicketConversation ticketId={ticket.id} initialMessages={messages} viewerRole="technician" />
          <TicketAttachments
            ticketId={ticket.id}
            canEdit={Boolean(ticket.technicien_assigne) && !["resolu", "ferme"].includes(ticket.statut)}
          />
        </main>
      </div>
    </div>
  );
}
