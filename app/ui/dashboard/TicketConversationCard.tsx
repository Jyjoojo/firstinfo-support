'use client';

import { useRef, useState } from 'react';
import { Paperclip, Send } from 'lucide-react'

// --- Types ---------------------------------------------------------------

type SenderRole = 'client' | 'technicien';

export interface TicketMessage {
  id: string;
  authorName: string;
  authorInitials: string;
  role: SenderRole;
  content: string;
  date: string; // ex: "12 mai 09:55"
}

interface StatusBadge {
  label: string;
  variant: 'en-cours' | 'resolu' | 'bloquant' | 'urgent';
}

interface TicketConversationCardProps {
  ticketId: string;
  title: string;
  productTag: string;
  badges: StatusBadge[];
  onBack?: () => void;
  onSend?: (content: string) => void;
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

// --- Styles des badges de statut -----------------------------------------

const badgeStyles: Record<StatusBadge['variant'], string> = {
  'en-cours': 'bg-[#FFBF69]/20 text-[#FF9F1C]',
  resolu: 'bg-secondary-container text-on-secondary-container',
  bloquant: 'bg-error-container text-on-error-container',
  urgent: 'bg-error-container text-on-error-container',
};

// --- Composant -------------------------------------------------------------

export default function TicketConversationCard({
  ticketId,
  title,
  productTag,
  badges,
  onBack,
  onSend,
}: TicketConversationCardProps) {
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    const value = draft.trim();
    if (!value) return;
    onSend?.(value);
    setDraft('');
    // Redescend en bas après l'envoi
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    });
  };

  return (
    <div className="flex flex-col bg-surface-container-lowest rounded-xl card-shadow border border-outline-variant/20 overflow-hidden h-[600px]">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-outline-variant/40 shrink-0">
        <div className="flex items-start gap-3">
          {onBack && (
            <button
              onClick={onBack}
              aria-label="Retour"
              className="mt-1 p-1 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
          )}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-label-sm text-on-surface-variant">{ticketId}</span>
              {badges.map((badge) => (
                <span
                  key={badge.label}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${badgeStyles[badge.variant]}`}
                >
                  {badge.label}
                </span>
              ))}
            </div>
            <h3 className="font-bold text-on-surface text-body-lg leading-snug">{title}</h3>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant text-[12px] font-bold whitespace-nowrap">
          {productTag}
        </span>
      </div>

      {/* Zone de messages scrollable */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-thin"
      >
        {messages.map((message) => {
          const isClient = message.role === 'client';
          return (
            <div
              key={message.id}
              className={`flex items-end gap-2 ${isClient ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[12px] font-bold ${isClient
                    ? 'bg-primary-container text-on-primary-container'
                    : 'bg-inverse-surface text-inverse-on-surface'
                  }`}
              >
                {message.authorInitials}
              </div>

              <div className={`flex flex-col max-w-[75%] ${isClient ? 'items-end' : 'items-start'}`}>
                {!isClient && (
                  <span className="font-label-sm text-on-surface mb-1 px-1">{message.authorName}</span>
                )}
                <div
                  className={`px-4 py-3 text-body-md leading-relaxed ${isClient
                      ? 'bg-primary-container text-on-primary-container rounded-2xl rounded-br-sm'
                      : 'bg-surface-container-low text-on-surface rounded-2xl rounded-bl-sm'
                    }`}
                >
                  {message.content}
                </div>
                <span className="text-[11px] text-on-surface-variant opacity-70 mt-1 px-1">
                  {isClient ? `${message.authorName} · ${message.date}` : message.date}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Champ de réponse */}
      <div className="shrink-0 border-t border-outline-variant/40 p-3 flex items-center gap-2 bg-surface-container-lowest">
        <button
          aria-label="Joindre un fichier"
          className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-full transition-colors"
        >
          <Paperclip size={16} />
        </button>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          type="text"
          placeholder="Répondez à votre ticket..."
          className="flex-1 bg-surface-container-low text-sm rounded-full px-4 py-2.5 font-body-md text-on-surface placeholder:text-on-surface-variant/70 border-none focus:outline-none focus:ring-2 focus:ring-secondary/20"
        />
        <button
          onClick={handleSend}
          aria-label="Envoyer"
          className="p-3 cursor-pointer bg-primary-container text-on-primary rounded-full hover:opacity-90 transition-opacity disabled:opacity-40"
          disabled={!draft.trim()}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
