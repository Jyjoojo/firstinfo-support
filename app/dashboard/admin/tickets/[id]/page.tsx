import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, FileText, ImageIcon, Paperclip, Plus, Upload, UserRoundCheck } from "lucide-react";
import { tickets } from "@/lib/tickets";
import { priorityStyles, statusStyles } from "@/lib/styles";
import TicketStatusStepper from "@/app/ui/dashboard/TicketStatusStepper";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { CloseTicketAction, DeleteTicketAction, ReopenTicketAction } from "@/app/ui/dashboard/admin/TicketDetailActions";
import EditTicketDialog from "@/app/ui/dashboard/admin/EditTicketDialog";
import AdminTicketConversation from "@/app/ui/dashboard/admin/AdminTicketConversation";

const formatDate = (date: string) => new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });

export default async function AdminTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ticket = tickets.find((item) => item.id === id);
  if (!ticket) notFound();

  const PriorityIcon = priorityStyles[ticket.priorite].icon;
  const categories = [...new Set(tickets.map((item) => item.categorie))];
  const messageRows = [
    { author: "Client", time: "09:18", text: ticket.contenu, client: true },
    { author: ticket.assigneA ?? "Équipe support", time: "10:45", text: "Bien reçu. Je procède à l'analyse de la demande et je reviens vers vous avec une première solution.", client: false },
    { author: "Client", time: "11:02", text: "Merci. Je reste disponible si vous avez besoin d'informations complémentaires.", client: true },
  ];

  return (
    <div className="w-full max-w-7xl p-6 lg:p-8">
      <Breadcrumb className="mb-5">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard/admin">Admin</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard/admin/tickets">Tickets</Link>
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
          <section className="overflow-hidden rounded-2xl border border-outline-variant/30 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant/20 p-5">
              <div><p className="text-sm font-medium text-on-surface-variant">Ticket ID</p><h1 className="mt-1 text-2xl font-bold text-tertiary">#{ticket.id}</h1></div>
              <div className="flex gap-2">
                <EditTicketDialog ticket={ticket} categories={categories} />
                <CloseTicketAction ticketId={ticket.id} />
              </div>
            </div>
            <div className="p-5"><TicketStatusStepper currentStatus={ticket.statut} /></div>
            <div className="border-t border-outline-variant/20 p-5">
              <p className="text-sm font-semibold text-on-surface-variant">Sujet</p>
              <h2 className="mt-2 text-xl font-bold leading-snug text-on-surface">{ticket.titre}</h2>
              <p className="mt-6 text-sm font-semibold text-on-surface-variant">Description</p>
              <p className="mt-2 whitespace-pre-line leading-7 text-on-surface">{ticket.contenu}</p>
              <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 text-sm">
                <div>
                  <p className="text-on-surface-variant">Statut</p>
                  <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[ticket.statut].base}`}>{ticket.statut}</span>
                </div>
                <div>
                  <p className="text-on-surface-variant">Priorité</p>
                  <span className={`mt-2 inline-flex items-center gap-1.5 text-sm font-semibold ${priorityStyles[ticket.priorite].base.replace(/border\s|bg-[^\s]+\s/g, "")}`}>{PriorityIcon && <PriorityIcon size={15} />}{ticket.priorite}</span>
                </div>
                <div>
                  <p className="text-on-surface-variant">Catégorie</p>
                  <p className="mt-1 font-semibold text-on-surface">{ticket.categorie}</p>
                </div>
                <div>
                  <p className="text-on-surface-variant">Technicien assigné</p>
                  <p className="mt-1 flex items-center gap-2 font-semibold text-on-surface">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary-container/20 text-[10px] text-primary">{ticket.assigneA?.split(" ").map((name) => name[0]).join("") ?? "—"}</span>
                    {ticket.assigneA ?? "Non assigné"}
                  </p>
                </div>
                <div>
                  <p className="text-on-surface-variant">Créé le</p>
                  <p className="mt-1 font-semibold text-on-surface">{formatDate(ticket.dateCreation)}
                  </p>
                </div>
                <div>
                  <p className="text-on-surface-variant">Dernière mise à jour</p>
                  <p className="mt-1 font-semibold text-on-surface">{formatDate(ticket.dateModification)}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-outline-variant/20 p-4"><DeleteTicketAction ticketId={ticket.id} /><ReopenTicketAction ticketId={ticket.id} status={ticket.statut} /></div>
          </section>
          <section className="rounded-2xl border border-outline-variant/30 bg-white p-5 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wider text-on-surface-variant">Détails client</p>
            <div className="mt-4 flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Building2 size={22} />
              </span>
              <div>
                <p className="font-bold text-on-surface">First Info CI</p>
                <p className="text-sm text-on-surface-variant">Support & services Sage</p>
              </div>
            </div>
          </section>
        </aside>

        <main className="space-y-5 xl:col-span-7">
          <AdminTicketConversation ticketId={ticket.id} initialMessages={messageRows} />
          <section className="rounded-2xl border border-outline-variant/30 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-bold text-on-surface">
                <Paperclip size={16} /> Pièces jointes (2)
              </h2>
              <button type="button" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                <Plus size={16} /> Ajouter
              </button>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-4">
                <FileText className="text-primary" size={19} />
                <p className="mt-2 font-semibold">journal_ticket.txt</p>
                <p className="text-xs text-on-surface-variant">1.2 MB</p>
              </div>
              <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low p-4">
                <ImageIcon className="text-primary" size={19} />
                <p className="mt-2 font-semibold">capture_erreur.png</p>
                <p className="text-xs text-on-surface-variant">450 KB</p>
              </div>
              <button type="button" className="flex min-h-28 flex-col items-center justify-center rounded-xl border-2 border-dashed border-outline-variant/30 text-sm text-on-surface-variant">
                <Upload size={22} />
                <span className="mt-2">Nouveau fichier</span>
              </button>
            </div>
          </section>
        </main>
      </div>

      <section className="mt-6 rounded-2xl border border-outline-variant/30 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><h2 className="flex items-center gap-2 text-lg font-bold uppercase tracking-wider text-on-surface"><UserRoundCheck size={19} className="text-primary" /> Historique des assignations</h2><button type="button" className="text-sm font-semibold text-primary">Voir tout</button></div><div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">{[{ name: ticket.assigneA ?? "Non assigné", source: ticket.assigneA ? "Assigné manuellement" : "File générale", date: formatDate(ticket.dateModification) }, { name: "Équipe support", source: "Routage automatique", date: formatDate(ticket.dateCreation) }, { name: "Non assigné", source: "File générale", date: formatDate(ticket.dateCreation) }].map((assignment, index) => <article key={index} className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-4"><p className="text-xs font-semibold uppercase text-on-surface-variant">{index === 0 ? "Manuelle" : index === 1 ? "Auto" : "Initiale"}</p><p className="mt-5 font-bold text-on-surface">{assignment.name}</p><p className="mt-1 text-sm text-on-surface-variant">{assignment.source}</p><p className="mt-5 border-t border-outline-variant/20 pt-3 text-xs text-on-surface-variant">{assignment.date}</p></article>)}</div></section>
    </div>
  );
}
