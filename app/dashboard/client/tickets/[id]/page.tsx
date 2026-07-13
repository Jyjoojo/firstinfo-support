"use client";
import Link from "next/link";
import Image from 'next/image'

import {
  FileText,
  ImageIcon, ClipboardPen, Printer,
  CheckCircle2, MessageSquareText, ChevronsUp,
  Share2, Phone
} from "lucide-react";
import { notFound } from "next/navigation";
import { tickets } from "@/lib/tickets";
import TicketConversationCard, { TicketMessage } from "@/app/ui/dashboard/TicketConversationCard";
import {
  priorityStyles,
  statusStyles,
} from "@/lib/styles";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import TicketStatusStepper from "@/app/ui/dashboard/TicketStatusStepper";
import { Share } from "next/font/google";

export default async function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ticket = tickets.find((item) => item.id === id);

  const PriorityIcon = ticket ? priorityStyles[ticket.priorite].icon : null;
  const StatusIcon = ticket ? statusStyles[ticket.statut].icon : null;

  if (!ticket) {
    notFound();
  }

  const messages: TicketMessage[] = [
    {
      id: '1',
      authorName: 'Sarah Koffi',
      authorInitials: 'SK',
      role: 'technicien',
      content:
        "Bonjour Monsieur Dupont, je prends en charge votre demande. Il semble s'agir d'un conflit d'accès sur l'instance SQL Server. J'ai effectué un redémarrage des services Sage.",
      date: '12 Oct 10:30',
    },
    {
      id: '2',
      authorName: 'Jean Dupont',
      authorInitials: 'JD',
      role: 'client',
      content:
        "Merci pour votre réactivité. Malheureusement, j'ai toujours le même message d'erreur. Voici les nouveaux logs que je viens de générer après le redémarrage.",
      date: '12 Oct 11:15',
    },
  ];


  return (
    <div className="w-full p-6 lg:p-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList className="text-sm">
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/client" className="text-on-surface-variant text-[15px] font-medium hover:text-primary-container">Tableau de bord</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/client/tickets" className="text-on-surface-variant text-[15px] font-medium hover:text-primary-container">Mes Tickets</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-tertiary font-bold text-[15px]">#{ticket.id}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
        <div className="flex gap-2">
          <h2 className="text-lg font-medium text-on-surface">
            Titre : {ticket.titre}
          </h2>

          <div className="flex items-center gap-3">
            {/* <span className={`px-3 py-1 font-medium rounded-full text-sm flex items-center gap-1.5 ${statusStyles[ticket.statut].base}`}>
              {StatusIcon && <StatusIcon size={14} />}
              {ticket.statut}
            </span> */}
            <span className={`px-3 py-1 font-medium rounded-full text-sm flex items-center gap-1 ${priorityStyles[ticket.priorite].base}`}>
              {PriorityIcon && <PriorityIcon size={14} />}
              {ticket.priorite}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-outline text-tertiary text-sm font-bold rounded-lg hover:bg-surface-container transition-colors flex items-center gap-2">
            <Printer size={16} /> Imprimer
          </button>
          {ticket.statut === 'résolu' &&
            <button className="px-4 py-2 bg-on-tertiary-container text-on-secondary font-bold text-sm rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
              <CheckCircle2 size={16} />Résolu
            </button>
          }
        </div>
      </div>
      <div className="mb-stack-lg">
        <TicketStatusStepper currentStatus={ticket.statut} />
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Colonne principale */}
        <div className="lg:col-span-8 space-y-gutter">
          {/* Description du problème */}
          <div className="bg-surface-container-lowest rounded-xl card-shadow p-stack-lg border border-outline-variant/20">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-tertiary-fixed/30 flex items-center justify-center">
                  <FileText size={16} className="text-tertiary" />
                </div>
                <div>
                  <h3 className="font-headline-md text-body-lg font-bold text-on-surface">
                    Description du problème
                  </h3>
                  <p className="font-label-sm text-on-surface-variant opacity-70">
                    Publié le 12 Octobre 2023 à 09:15
                  </p>
                </div>
              </div>
            </div>
            <div className="text-body-md text-on-surface-variant leading-relaxed mb-6">
              Bonjour l&apos;équipe support,
              <br />
              <br />
              Depuis ce matin, nous rencontrons une erreur lors de la synchronisation entre Sage
              100 Cloud et notre interface de gestion commerciale. Le message d&apos;erreur
              suivant s&apos;affiche : &quot;Échec de la connexion au serveur SQL : erreur de
              délai d&apos;attente dépassé&quot;.
              <br />
              <br />
              Cela bloque l&apos;édition de nos factures clients. Pouvez-vous intervenir
              rapidement ?
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="px-3 py-2 border border-outline-variant rounded-lg flex items-center gap-3 cursor-pointer transition-colors">
                <ImageIcon className="text-tertiary" size={16} />
                <div className="overflow-hidden">
                  <p className="text-sm truncate">capture_erreur_sql.png</p>
                  <p className="text-xs text-on-surface-variant">1.2 MB</p>
                </div>
              </div>
              <div className="px-3 py-2 border border-tertiary/30 rounded-lg flex items-center gap-3 cursor-pointer transition-colors">
                <ClipboardPen className="text-tertiary" size={16} />
                <div className="overflow-hidden">
                  <p className="text-sm truncate">logs_systeme.log</p>
                  <p className="text-xs text-on-surface-variant">256 KB</p>
                </div>
              </div>
            </div>
          </div>

          {/* Conversation — nouvelle card scrollable */}
          <TicketConversationCard
            ticketId={"#" + ticket.id}
            title={ticket.titre}
            productTag={ticket.categorie}
            statut={ticket.statut}
            priorite={ticket.priorite}
            onSend={(content) => {
              // TODO: POST /api/tickets/{id}/messages
              console.log('Nouveau message :', content);
            }}
          />
        </div>

        {/* Colonne latérale */}
        <div className="lg:col-span-4 space-y-gutter">
          <div className="bg-surface-container-lowest rounded-xl card-shadow p-6 border border-outline-variant/20">
            <h4 className="text-sm uppercase tracking-widest text-on-surface-variant opacity-50 mb-4">
              Informations Ticket
            </h4>
            <div className="space-y-5">
              <div className="flex justify-between items-center py-2 border-b border-outline-variant/20">
                <span className="text-on-surface-variant">ID Ticket</span>
                <span className="font-bold text-on-surface">#{ticket.id}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-outline-variant/20">
                <span className="text-on-surface-variant">Produit</span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-secondary rounded-full" />
                  <span className="font-bold text-on-surface">{ticket.categorie}</span>
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-outline-variant/20">
                <span className="text-on-surface-variant font-body-md">Création</span>
                <span className="text-on-surface">12 Oct 2023</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-outline-variant/20">
                <span className="text-on-surface-variant font-body-md">Dernière MAJ</span>
                <span className="text-on-surface">il y a 45 min</span>
              </div>

              <div className="pt-2">
                <p className="text-on-surface-variant font-body-md mb-3">Technicien Assigné</p>
                <div className="flex items-center gap-3 p-3 bg-surface rounded-lg relative">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant relative">
                    <Image
                      src="/sage-logo.svg"
                      alt="Sarah Koffi"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-on-surface">{ticket.assigneA}</p>
                    <p className="text-[12px] text-on-surface-variant">Consultante Senior ERP</p>
                  </div>
                  <Link href="#conversation-card" className="w-8 h-8 rounded-full bg-on-secondary-fixed-variant/10 text-on-secondary-fixed-variant flex items-center justify-center hover:bg-tertiary-container hover:text-white transition-colors shrink-0">
                    <MessageSquareText size={16} />
                  </Link>
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <button className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-error-container/20 text-error font-bold rounded-lg hover:bg-error-container hover:text-on-error-container transition-colors">
                  <ChevronsUp size={16} /> Escalader le ticket
                </button>
                <button className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-tertiary/90 text-surface font-medium rounded-lg hover:bg-tertiary/70 transition-colors">
                  <Share2 size={16} /> Partager le ticket
                </button>
              </div>
            </div>
          </div>

          {/* Contact support rapide */}
          <div className="bg-tertiary/5 rounded-xl p-6 border border-primary/20 relative overflow-hidden group">
            <Image
              src="/support_agent.svg"
              width={100}
              height={100}
              alt="Picture of the author"
              className="absolute -right-3 -bottom-5 w-24 h-24 text-primary/10 opacity-20 rotate-[25deg] group-hover:scale-110 transition-transform"
            />
            <h4 className="font-bold text-tertiary/90 mb-2">Besoin d&apos;aide immédiate ?</h4>
            <p className="text-body-md text-on-surface-variant mb-4 relative z-10">
              Nos experts sont disponibles par téléphone pour les urgences critiques.
            </p>
            <a
              className="inline-flex items-center gap-2 text-tertiary/90 font-bold hover:underline"
              href="tel:+2250102030405"
            >
              <Phone size={18} /> +225 01 02 03 04 05
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
