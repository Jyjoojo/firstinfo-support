import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  ClipboardPen,
  FileText,
  ImageIcon,
  MessageSquareText,
  Phone,
  Printer,
} from "lucide-react";
import CloseTicketButton from "@/app/ui/dashboard/CloseTicketButton";
import TicketConversationCard, { type TicketMessage } from "@/app/ui/dashboard/TicketConversationCard";
import TicketStatusStepper from "@/app/ui/dashboard/TicketStatusStepper";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ApiError } from "@/lib/api";
import { priorityStyles, ticketPriorityLabels } from "@/lib/styles";
import { getTicket } from "@/lib/tickets-api";

function formatDate(value: string | null, includeTime = false) {
  if (!value) return "Non renseignée";
  const date = new Date(value.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(includeTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(date);
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";
}

export default async function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let ticket;

  try {
    ticket = await getTicket(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  const PriorityIcon = priorityStyles[ticket.priorite].icon;
  const messages: TicketMessage[] = ticket.commentaires.map((comment) => ({
    id: comment.id,
    authorName: comment.auteur.nom_complet,
    authorInitials: initials(comment.auteur.nom_complet),
    role: comment.auteur.role === "client" ? "client" : "technicien",
    content: comment.contenu,
    date: formatDate(comment.created_at, true),
    isSolution: comment.est_solution,
    solutionValidated: Boolean(comment.solution_validee_at),
    solutionRejected: Boolean(comment.solution_rejetee_at),
  }));

  return (
    <div className="w-full p-6 lg:p-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList className="text-sm">
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/client" className="text-[15px] font-medium text-on-surface-variant hover:text-primary-container">Tableau de bord</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/client/tickets" className="text-[15px] font-medium text-on-surface-variant hover:text-primary-container">Mes Tickets</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-[15px] font-bold text-tertiary">#{ticket.reference}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-3 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex gap-2">
          <h2 className="text-lg font-medium text-on-surface">Titre : {ticket.titre}</h2>
          <div className="flex items-center gap-3">
            <span className={`ms-2 flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${priorityStyles[ticket.priorite].base}`}>
              {PriorityIcon && <PriorityIcon size={12} />}
              {ticketPriorityLabels[ticket.priorite]}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" className="flex items-center gap-2 rounded-lg border border-outline px-4 py-2 text-sm font-bold text-tertiary transition-colors hover:bg-surface-container">
            <Printer size={16} /> Imprimer
          </button>
          {ticket.statut === "resolu" && (
            <span className="flex items-center gap-2 rounded-lg bg-on-tertiary-container px-4 py-2 text-sm font-bold text-on-secondary">
              <CheckCircle2 size={16} /> Résolu
            </span>
          )}
        </div>
      </div>

      <div className="mb-stack-lg">
        <TicketStatusStepper currentStatus={ticket.statut} />
      </div>

      <div className="grid grid-cols-1 gap-gutter lg:grid-cols-12">
        <div className="space-y-gutter lg:col-span-8">
          <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-stack-lg card-shadow">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-tertiary-fixed/30">
                  <FileText size={16} className="text-tertiary" />
                </div>
                <div>
                  <h3 className="font-headline-md text-body-lg font-bold text-on-surface">Description du problème</h3>
                  <p className="font-label-sm text-on-surface-variant opacity-70">Publié le {formatDate(ticket.created_at, true)}</p>
                </div>
              </div>
            </div>
            <p className="mb-6 whitespace-pre-wrap text-body-md leading-relaxed text-on-surface-variant">{ticket.description}</p>

            {ticket.pieces_jointes.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {ticket.pieces_jointes.map((attachment) => {
                  const AttachmentIcon = attachment.type_mime.startsWith("image/") ? ImageIcon : ClipboardPen;
                  return (
                    <a
                      key={attachment.id}
                      href={`/api/pieces-jointes/${encodeURIComponent(attachment.id)}/afficher`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 rounded-lg border border-outline-variant px-3 py-2 transition-colors hover:bg-surface-container-low"
                    >
                      <AttachmentIcon className="shrink-0 text-tertiary" size={16} />
                      <span className="min-w-0">
                        <span className="block truncate text-sm">{attachment.nom_fichier}</span>
                        <span className="block text-xs text-on-surface-variant">{attachment.taille_lisible}</span>
                      </span>
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          <TicketConversationCard
            ticketId={ticket.id}
            ticketReference={ticket.reference}
            title={ticket.titre}
            productTag={ticket.categorie?.libelle ?? "Sans catégorie"}
            statut={ticket.statut}
            priorite={ticket.priorite}
            messages={messages}
            awaitingClientValidation={ticket.attend_validation_client}
          />
        </div>

        <div className="space-y-gutter lg:col-span-4">
          <div className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest p-6 card-shadow">
            <h4 className="mb-4 text-sm uppercase tracking-widest text-on-surface-variant opacity-50">Informations Ticket</h4>
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-outline-variant/20 py-2">
                <span className="text-on-surface-variant">Référence</span>
                <span className="font-bold text-on-surface">#{ticket.reference}</span>
              </div>
              <div className="flex items-center justify-between border-b border-outline-variant/20 py-2">
                <span className="text-on-surface-variant">Produit</span>
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-secondary" />
                  <span className="font-bold text-on-surface">{ticket.categorie?.libelle ?? "Sans catégorie"}</span>
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-outline-variant/20 py-2">
                <span className="font-body-md text-on-surface-variant">Création</span>
                <span className="text-on-surface">{formatDate(ticket.created_at)}</span>
              </div>
              <div className="flex items-center justify-between border-b border-outline-variant/20 py-2">
                <span className="font-body-md text-on-surface-variant">Dernière MAJ</span>
                <span className="text-on-surface">{formatDate(ticket.updated_at, true)}</span>
              </div>

              <div className="pt-2">
                {ticket.technicien_assigne ? (
                  <>
                    <p className="mb-3 font-body-md text-on-surface-variant">Technicien assigné</p>
                    <div className="relative flex items-center gap-3 rounded-lg bg-surface p-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-full border border-outline-variant">
                        <Image src="/sage-logo.svg" alt="Technicien support" fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-on-surface">{ticket.technicien_assigne.nom_complet}</p>
                        <p className="text-[12px] text-on-surface-variant">{ticket.technicien_assigne.specialite ?? "Support technique"}</p>
                      </div>
                      <Link href="#conversation-card" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-on-secondary-fixed-variant/10 text-on-secondary-fixed-variant transition-colors hover:bg-tertiary-container hover:text-white">
                        <MessageSquareText size={16} />
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-between py-2">
                    <span className="font-body-md text-on-surface-variant">Technicien assigné</span>
                    <span className="font-bold text-on-surface">Non assigné</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <CloseTicketButton
                  ticketId={ticket.id}
                  ticketReference={ticket.reference}
                  canClose={ticket.statut === "resolu"}
                />
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-xl border border-primary/20 bg-tertiary/5 p-6">
            <Image src="/support_agent.svg" width={100} height={100} alt="Support" className="absolute -bottom-5 -right-3 h-24 w-24 rotate-[25deg] text-primary/10 opacity-20 transition-transform group-hover:scale-110" />
            <h4 className="mb-2 font-bold text-tertiary/90">Besoin d&apos;aide immédiate ?</h4>
            <p className="relative z-10 mb-4 text-body-md text-on-surface-variant">Nos experts sont disponibles par téléphone pour les urgences critiques.</p>
            <a className="inline-flex items-center gap-2 font-bold text-tertiary/90 hover:underline" href="tel:+2250102030405">
              <Phone size={18} /> +225 01 02 03 04 05
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
