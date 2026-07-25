"use client";

import {
  type FormEvent,
  useState,
} from "react";
import {
  Mail,
  Paperclip,
  Plus,
  Send,
} from "lucide-react";
import AdminMessageActions from "@/app/ui/dashboard/admin/AdminMessageActions";
import { Textarea } from "@/components/ui/textarea";

type ConversationMessage = {
  author: string;
  time: string;
  text: string;
  client: boolean;
  admin?: boolean;
  own?: boolean;
  solution?: boolean;
};

export default function AdminTicketConversation({
  ticketId,
  initialMessages,
  viewerRole = "admin",
}: {
  ticketId: string;
  initialMessages: ConversationMessage[];
  viewerRole?: "admin" | "technician";
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [comment, setComment] = useState("");
  const [markAsSolution, setMarkAsSolution] = useState(false);

  const addComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = comment.trim();

    if (!text) {
      return;
    }

    /*
     * TODO: appeler l'API de création de commentaire avec
     * { ticketId, text, markAsSolution }.
     * Lorsque markAsSolution est true, le backend transforme le message
     * en article de base de connaissances.
     */
    void ticketId;

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        author: "Vous",
        time: new Date().toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        text,
        client: false,
        admin: viewerRole === "admin",
        own: true,
        solution: markAsSolution,
      },
    ]);
    setComment("");
    setMarkAsSolution(false);
    setShowCommentForm(false);
  };

  const editMessage = (messageIndex: number, content: string) => {
    setMessages((currentMessages) =>
      currentMessages.map((message, index) =>
        index === messageIndex
          ? {
              ...message,
              text: content,
            }
          : message,
      ),
    );
  };

  const deleteMessage = (messageIndex: number) => {
    setMessages((currentMessages) =>
      currentMessages.filter((_, index) => index !== messageIndex),
    );
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-outline-variant/30 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant/20 p-5">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-on-surface">
          <Mail className="text-primary-container" />
          Espace technicien
        </h2>
        <div className="flex items-center gap-3">
          <span className="rounded-md bg-surface-container-low px-3 py-1 text-sm font-semibold">
            {messages.length} messages
          </span>
          <button
            type="button"
            onClick={() => setShowCommentForm((visible) => !visible)}
            className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/40 px-3 py-2 text-sm font-semibold text-on-surface hover:bg-surface-container-low"
          >
            <Plus size={16} />
            Ajouter un commentaire
          </button>
        </div>
      </div>

      <div className="max-h-[500px] space-y-5 overflow-y-auto p-5">
        {messages.map((message, index) => {
          const canManageMessage =
            viewerRole === "admin"
            || message.own === true;

          return (
            <div
              key={`${message.time}-${index}`}
              className={`flex flex-col gap-2 ${
                message.client
                  ? "items-start"
                  : "items-end"
              }`}
            >
              <div className="flex items-center gap-2 text-sm">
                <span
                  className={`font-bold ${
                    message.client
                      ? "text-on-surface"
                      : "text-tertiary"
                  }`}
                >
                  {message.admin || message.own
                    ? "Vous"
                    : message.author}
                </span>
                <span className="text-xs text-on-surface-variant">
                  {message.time}
                </span>
              </div>

              <div className="max-w-[88%]">
                <div
                  className={`rounded-2xl border px-4 py-3 leading-6 ${
                    message.client
                      ? "border-outline-variant/20 bg-surface-container-low"
                      : message.admin
                        ? "border-outline-variant bg-primary-container text-on-primary-container"
                        : "border-outline-variant bg-tertiary-fixed"
                  }`}
                >
                  {message.text}
                  {message.solution && (
                    <span className="ml-2 rounded bg-white/15 px-2 py-0.5 text-xs font-semibold">
                      Solution
                    </span>
                  )}
                </div>

                {canManageMessage && (
                  <AdminMessageActions
                    messageId={index}
                    content={message.text}
                    onEdit={(content) =>
                      editMessage(index, content)
                    }
                    onDelete={() => deleteMessage(index)}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showCommentForm && (
        <form
          onSubmit={addComment}
          className="border-t border-outline-variant/20 p-5"
        >
          <Textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Ajouter un commentaire…"
            className="min-h-28"
          />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm text-on-surface-variant">
              <input
                type="checkbox"
                checked={markAsSolution}
                onChange={(event) =>
                  setMarkAsSolution(event.target.checked)
                }
                className="accent-primary"
              />
              Marquer comme solution
            </label>
            <div className="flex items-center gap-2">
              <Paperclip
                size={18}
                className="text-on-surface-variant"
              />
              <button
                type="submit"
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary-container px-4 text-sm font-semibold text-white"
              >
                <Send size={17} />
                Ajouter
              </button>
            </div>
          </div>
        </form>
      )}
    </section>
  );
}
