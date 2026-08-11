"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Mail, Plus, Send } from "lucide-react";
import { toast } from "sonner";
import AdminMessageActions from "@/app/ui/dashboard/admin/AdminMessageActions";
import { Textarea } from "@/components/ui/textarea";

type ConversationMessage = {
  id: string;
  author: string;
  time: string;
  text: string;
  client: boolean;
  admin?: boolean;
  own?: boolean;
  solution?: boolean;
};

type ErrorBody = { message?: string; errors?: Record<string, string[]> };

function errorMessage(body: ErrorBody, fallback: string) {
  return Object.values(body.errors ?? {}).flat()[0] ?? body.message ?? fallback;
}

export default function AdminTicketConversation({
  ticketId,
  initialMessages,
  viewerRole = "admin",
}: {
  ticketId: string;
  initialMessages: ConversationMessage[];
  viewerRole?: "admin" | "technician";
}) {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [comment, setComment] = useState("");
  const [markAsSolution, setMarkAsSolution] = useState(false);
  const [sending, setSending] = useState(false);

  async function addComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = comment.trim();
    if (text.length < 2) return;

    setSending(true);
    try {
      const response = await fetch(`/api/tickets/${ticketId}/commentaires`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contenu: text, est_solution: markAsSolution }),
      });
      const data = await response.json().catch(() => ({})) as ErrorBody & { commentaire?: { id?: string } };
      if (!response.ok) throw new Error(errorMessage(data, "Le commentaire n'a pas pu être ajouté."));

      setMessages((current) => [...current, {
        id: data.commentaire?.id ?? crypto.randomUUID(),
        author: "Vous",
        time: new Date().toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" }),
        text,
        client: false,
        admin: viewerRole === "admin",
        own: true,
        solution: markAsSolution,
      }]);
      setComment("");
      setMarkAsSolution(false);
      setShowCommentForm(false);
      toast.success(markAsSolution ? "Solution proposée" : "Commentaire ajouté");
      router.refresh();
    } catch (error) {
      toast.error("Envoi impossible", { description: error instanceof Error ? error.message : "Une erreur est survenue." });
    } finally {
      setSending(false);
    }
  }

  async function editMessage(messageId: string, content: string) {
    const response = await fetch(`/api/tickets/${ticketId}/commentaires/${messageId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contenu: content }),
    });
    const data = await response.json().catch(() => ({})) as ErrorBody;
    if (!response.ok) {
      const detail = errorMessage(data, "Le commentaire n'a pas pu être modifié.");
      toast.error("Modification impossible", { description: detail });
      throw new Error(detail);
    }
    setMessages((current) => current.map((message) => message.id === messageId ? { ...message, text: content } : message));
    toast.success("Commentaire modifié");
  }

  async function deleteMessage(messageId: string) {
    const response = await fetch(`/api/tickets/${ticketId}/commentaires/${messageId}`, { method: "DELETE" });
    const data = await response.json().catch(() => ({})) as ErrorBody;
    if (!response.ok) {
      const detail = errorMessage(data, "Le commentaire n'a pas pu être supprimé.");
      toast.error("Suppression impossible", { description: detail });
      throw new Error(detail);
    }
    setMessages((current) => current.filter((message) => message.id !== messageId));
    toast.success("Commentaire supprimé");
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-outline-variant/30 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant/20 p-5">
        <h2 className="flex items-center gap-2 text-xl font-bold text-on-surface"><Mail className="text-primary-container" />Conversation</h2>
        <div className="flex items-center gap-3">
          <span className="rounded-md bg-surface-container-low px-3 py-1 text-sm font-semibold">{messages.length} messages</span>
          <button type="button" onClick={() => setShowCommentForm((visible) => !visible)} className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/40 px-3 py-2 text-sm font-semibold hover:bg-surface-container-low"><Plus size={16} />Ajouter</button>
        </div>
      </div>

      <div className="max-h-[500px] space-y-5 overflow-y-auto p-5">
        {messages.length === 0 && <p className="py-10 text-center text-sm text-on-surface-variant">Aucun commentaire pour le moment.</p>}
        {messages.map((message) => {
          const canManage = viewerRole === "admin" || message.own === true;
          return (
            <div key={message.id} className={`flex flex-col gap-2 ${message.client ? "items-start" : "items-end"}`}>
              <div className="flex items-center gap-2 text-sm">
                <span className={`font-bold ${message.client ? "text-on-surface" : "text-tertiary"}`}>
                  {message.own || message.admin ? "Vous" : message.author}
                </span>
                {!message.client && (
                  <span className="text-xs text-on-surface-variant">{message.time}</span>
                )}
              </div>
              <div className="max-w-[88%]">
                <div className={`rounded-2xl border px-4 py-3 leading-6 ${message.client ? "border-outline-variant/20 bg-surface-container-low" : message.admin ? "border-outline-variant bg-primary-container text-on-primary-container" : "border-outline-variant bg-tertiary-fixed"}`}>
                  <p className="whitespace-pre-wrap">{message.text}</p>
                  {message.solution && <span className="mt-2 inline-flex rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">Solution proposée</span>}
                </div>
                {message.client && (
                  <p className="mt-1 text-left text-xs text-on-surface-variant">{message.time}</p>
                )}
                {canManage && <AdminMessageActions messageId={message.id} content={message.text} canDelete={!message.solution} onEdit={(content) => editMessage(message.id, content)} onDelete={() => deleteMessage(message.id)} />}
              </div>
            </div>
          );
        })}
      </div>

      {showCommentForm && (
        <form onSubmit={addComment} className="border-t border-outline-variant/20 p-5">
          <Textarea value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Ajouter un commentaire…" className="min-h-28" disabled={sending} />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm text-on-surface-variant"><input type="checkbox" checked={markAsSolution} onChange={(event) => setMarkAsSolution(event.target.checked)} disabled={sending} className="accent-primary" />Proposer comme solution</label>
            <button type="submit" disabled={sending || comment.trim().length < 2} className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary-container px-4 text-sm font-semibold text-white disabled:opacity-50">
              {sending ? <LoaderCircle className="animate-spin" size={17} /> : <Send size={17} />}{sending ? "Envoi…" : "Ajouter"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
