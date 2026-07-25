"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldGroup,
} from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function EditMessageDialog({
  messageId,
  initialContent,
  onEdit,
}: {
  messageId: number;
  initialContent: string;
  onEdit: (content: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState(initialContent);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setContent(initialContent);
    }

    setOpen(nextOpen);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const updatedContent = content.trim();

    if (!updatedContent) {
      return;
    }

    // TODO: appeler l'API de mise à jour du message avec { messageId, content }.
    onEdit(updatedContent);
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          title="Modifier le message"
          aria-label="Modifier le message"
          className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
        >
          <Pencil size={15} />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Modifier le message
            </DialogTitle>
            <DialogDescription>
              Modifiez le contenu du message #{messageId + 1}.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-5">
            <Field>
              <Label htmlFor={`message-content-${messageId}`}>
                Contenu
              </Label>
              <Textarea
                id={`message-content-${messageId}`}
                value={content}
                onChange={(event) => setContent(event.target.value)}
                className="min-h-32"
              />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
              >
                Annuler
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="cursor-pointer bg-primary-container/80 hover:bg-primary-container"
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteMessageDialog({
  messageId,
  onDelete,
}: {
  messageId: number;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);

  const confirm = () => {
    // TODO: appeler l'API de suppression du message avec { messageId }.
    onDelete();
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          title="Supprimer le message"
          aria-label="Supprimer le message"
          className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-red-600 transition-colors hover:bg-red-50"
        >
          <Trash2 size={15} />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            Supprimer ce message ?
          </DialogTitle>
          <DialogDescription>
            Le message #{messageId + 1} sera supprimé de la conversation.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
            >
              Annuler
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            onClick={confirm}
          >
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminMessageActions({
  messageId,
  content,
  onEdit,
  onDelete,
}: {
  messageId: number;
  content: string;
  onEdit: (content: string) => void;
  onDelete: () => void;
}) {
  return (
    <div className="mt-1 flex justify-end gap-1">
      <EditMessageDialog
        messageId={messageId}
        initialContent={content}
        onEdit={onEdit}
      />
      <DeleteMessageDialog
        messageId={messageId}
        onDelete={onDelete}
      />
    </div>
  );
}
