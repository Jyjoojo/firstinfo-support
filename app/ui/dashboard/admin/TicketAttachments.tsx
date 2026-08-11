"use client";

import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  Download,
  Eye,
  FileText,
  ImageIcon,
  LoaderCircle,
  Paperclip,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

type Attachment = {
  id: string | number;
  name: string;
  size?: string;
  url?: string;
  viewUrl?: string;
};

const acceptedExtensions = ["pdf", "doc", "docx", "xls", "xlsx", "png", "jpg", "jpeg", "zip"];
const MAX_CONTENT_LENGTH = 10 * 1024 * 1024;

function normalizeAttachment(item: Record<string, unknown>): Attachment {
  const id = String(item.id ?? item.uuid ?? item.pieces_jointe_id ?? item.nom_fichier ?? crypto.randomUUID());
  return {
    id,
    name: String(item.nom_fichier ?? item.name ?? item.filename ?? "Fichier joint"),
    size: item.taille ? String(item.taille) : item.size ? String(item.size) : undefined,
    url: `/api/pieces-jointes/${encodeURIComponent(id)}/telecharger`,
    viewUrl: `/api/pieces-jointes/${encodeURIComponent(id)}/afficher`,
  };
}

export default function TicketAttachments({ ticketId, canEdit = true }: { ticketId: string; canEdit?: boolean }) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadAttachments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/tickets/${ticketId}/pieces-jointes`, {
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("Impossible de charger les pièces jointes.");

      const payload = await response.json() as unknown;
      const list = Array.isArray(payload)
        ? payload
        : Array.isArray((payload as { data?: unknown[] }).data)
          ? (payload as { data: unknown[] }).data
          : [];
      setAttachments(
        list
          .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
          .map(normalizeAttachment),
      );
    } catch (error) {
      toast.error("Chargement impossible", { description: error instanceof Error ? error.message : "Une erreur est survenue." });
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      void loadAttachments();
    }, 0);

    return () => window.clearTimeout(loadTimer);
  }, [loadAttachments]);

  const uploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !canEdit) return;

    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension || !acceptedExtensions.includes(extension)) {
      toast.error("Format non accepté", { description: `Extensions autorisées : ${acceptedExtensions.join(", ")}.` });
      return;
    }
    if (file.size > MAX_CONTENT_LENGTH) {
      toast.error("Fichier trop volumineux", { description: "La taille maximale autorisée est de 10 Mo." });
      return;
    }

    const formData = new FormData();
    formData.append("fichier", file);
    setUploading(true);
    try {
      const response = await fetch(`/api/tickets/${ticketId}/pieces-jointes`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      if (!response.ok) throw new Error("L'envoi de la pièce jointe a échoué.");

      toast.success("Pièce jointe ajoutée", { description: file.name });
      await loadAttachments();
    } catch (error) {
      toast.error("Ajout impossible", { description: error instanceof Error ? error.message : "Une erreur est survenue." });
    } finally {
      setUploading(false);
    }
  };

  const deleteAttachment = async (attachment: Attachment) => {
    try {
      const response = await fetch(`/api/pieces-jointes/${attachment.id}`, {
        method: "DELETE",
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("La suppression de la pièce jointe a échoué.");

      setAttachments((current) => current.filter((item) => item.id !== attachment.id));
      toast.success("Pièce jointe supprimée", { description: attachment.name });
    } catch (error) {
      toast.error("Suppression impossible", { description: error instanceof Error ? error.message : "Une erreur est survenue." });
    }
  };

  return (
    <section className="rounded-2xl border border-outline-variant/30 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-bold text-on-surface">
          <Paperclip size={19} />
          Pièces jointes ({attachments.length})
        </h2>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading || !canEdit}
          className="inline-flex cursor-pointer items-center gap-2 text-sm font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading ? <LoaderCircle size={16} className="animate-spin" /> : <Plus size={16} />}
          {canEdit ? "Ajouter" : "Ajout indisponible"}
        </button>
        <input
          ref={inputRef}
          type="file"
          onChange={uploadFile}
          accept={acceptedExtensions.map((extension) => `.${extension}`).join(",")}
          className="hidden"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {loading ? (
          <div className="col-span-full flex min-h-28 items-center justify-center text-sm text-on-surface-variant">
            <LoaderCircle size={18} className="mr-2 animate-spin" />
            Chargement…
          </div>
        ) : attachments.length ? (
          attachments.map((attachment) => {
            const isImage = /\.(png|jpe?g)$/i.test(attachment.name);
            return (
              <article key={attachment.id} className="group relative rounded-xl border border-outline-variant/30 bg-surface-container-low p-4">
                {isImage ? <ImageIcon className="text-primary" size={22} /> : <FileText className="text-primary" size={22} />}
                <p className="mt-2 truncate pr-7 font-semibold">{attachment.name}</p>
                {attachment.size && <p className="text-xs text-on-surface-variant">{attachment.size}</p>}
                <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  {attachment.viewUrl && <a href={attachment.viewUrl} target="_blank" rel="noreferrer" title="Afficher" className="inline-flex h-7 w-7 items-center justify-center rounded-md text-primary hover:bg-primary/10"><Eye size={15} /></a>}
                  {attachment.url && <a href={attachment.url} target="_blank" rel="noreferrer" title="Télécharger" className="inline-flex h-7 w-7 items-center justify-center rounded-md text-primary hover:bg-primary/10"><Download size={15} /></a>}
                  {canEdit && <button type="button" title="Supprimer" onClick={() => deleteAttachment(attachment)} className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-red-600 hover:bg-red-50"><Trash2 size={15} /></button>}
                </div>
              </article>
            );
          })
        ) : (
          <button type="button" disabled={!canEdit} onClick={() => inputRef.current?.click()} className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-outline-variant/30 text-sm text-on-surface-variant hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-50">
            <Upload size={22} />
            <span className="mt-2">{canEdit ? "Ajouter un fichier" : "Aucune pièce jointe"}</span>
          </button>
        )}
      </div>
    </section>
  );
}
