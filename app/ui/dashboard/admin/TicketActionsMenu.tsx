"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  Eye,
  MoreVertical,
  Search,
  UserRoundCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supportUsers } from "@/lib/users";

type TicketActionsMenuProps = {
  ticketId: string;
  currentAssignee: string | null;
};

const technicians = supportUsers
  .filter((user) => user.role === "technicien" && user.actif)
  .map((user) => ({
    id: user.id,
    name: `${user.prenoms} ${user.nom}`,
    speciality: user.specialite ?? "Spécialité non renseignée",
    activeTickets: user.ticketsEnCours ?? 0,
  }));

export default function TicketActionsMenu({
  ticketId,
  currentAssignee,
}: TicketActionsMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [assignmentOpen, setAssignmentOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const closeOnOutsideClick = (event: MouseEvent) => {
      if (
        menuRef.current
        && !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  const openAssignmentDialog = () => {
    setMenuOpen(false);
    setAssignmentOpen(true);
  };

  return (
    <>
      <div ref={menuRef} className="relative">
        <button
          type="button"
          title="Actions du ticket"
          aria-label="Actions du ticket"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-primary/10 hover:text-primary"
        >
          <MoreVertical size={17} />
        </button>

        {menuOpen && (
          <div
            role="menu"
            className="absolute right-0 z-30 mt-1 w-44 rounded-lg border border-outline-variant/30 bg-white p-1 shadow-lg"
          >
            <Link
              href={`/dashboard/admin/tickets/${ticketId}`}
              role="menuitem"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-surface-container-low"
            >
              <Eye size={15} />
              Voir les détails
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={openAssignmentDialog}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-surface-container-low"
            >
              <UserRoundCheck size={15} />
              Assigner
            </button>
          </div>
        )}
      </div>

      <AssignTicketDialog
        ticketId={ticketId}
        currentAssignee={currentAssignee}
        open={assignmentOpen}
        onOpenChange={setAssignmentOpen}
      />
    </>
  );
}

type AssignTicketDialogProps = {
  ticketId: string;
  currentAssignee: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function AssignTicketDialog({
  ticketId,
  currentAssignee,
  open,
  onOpenChange,
}: AssignTicketDialogProps) {
  const initialTechnician = technicians.find(
    (technician) => technician.name === currentAssignee,
  );
  const [search, setSearch] = useState("");
  const [selectedTechnicianId, setSelectedTechnicianId] = useState(
    initialTechnician?.id ?? "",
  );
  const [pending, setPending] = useState(false);

  const filteredTechnicians = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("fr-FR");

    if (!query) {
      return technicians;
    }

    return technicians.filter((technician) =>
      [technician.name, technician.speciality]
        .join(" ")
        .toLocaleLowerCase("fr-FR")
        .includes(query),
    );
  }, [search]);

  const selectedTechnician = technicians.find(
    (technician) => technician.id === selectedTechnicianId,
  );

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      setSearch("");
    }
  };

  const submitAssignment = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!selectedTechnician) {
      return;
    }

    setPending(true);

    try {
      // TODO: appeler l'API d'assignation dès que l'endpoint sera disponible.
      toast.info("Assignation prête", {
        description: `${ticketId} sera assigné à ${selectedTechnician.name} lorsque l’API sera connectée.`,
      });
      handleOpenChange(false);
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Assigner le ticket {ticketId}</DialogTitle>
          <DialogDescription>
            Recherchez puis sélectionnez le technicien qui prendra en charge ce
            ticket.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submitAssignment} className="space-y-5">
          <div>
            <Label htmlFor={`technician-search-${ticketId}`}>
              Technicien
            </Label>
            <div className="relative mt-2">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
              />
              <Input
                id={`technician-search-${ticketId}`}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher par nom ou spécialité…"
                className="pl-9"
              />
            </div>
          </div>

          <div
            role="listbox"
            aria-label="Liste des techniciens"
            className="max-h-72 space-y-2 overflow-y-auto rounded-xl border border-outline-variant/25 p-2"
          >
            {filteredTechnicians.map((technician) => {
              const selected = technician.id === selectedTechnicianId;

              return (
                <button
                  key={technician.id}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => setSelectedTechnicianId(technician.id)}
                  className={
                    selected
                      ? "flex w-full items-center gap-3 rounded-lg border border-primary bg-primary-container/20 p-3 text-left"
                      : "flex w-full items-center gap-3 rounded-lg border border-transparent p-3 text-left hover:bg-surface-container-low"
                  }
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-container text-xs font-bold text-on-primary-container">
                    {technician.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-on-surface">
                      {technician.name}
                    </span>
                    <span className="mt-0.5 block text-xs text-on-surface-variant">
                      {technician.speciality} · {technician.activeTickets} ticket
                      {technician.activeTickets > 1 ? "s" : ""} en cours
                    </span>
                  </span>
                  {selected && (
                    <Check className="shrink-0 text-primary" size={18} />
                  )}
                </button>
              );
            })}

            {filteredTechnicians.length === 0 && (
              <p className="px-3 py-8 text-center text-sm text-on-surface-variant">
                Aucun technicien ne correspond à la recherche.
              </p>
            )}
          </div>

          {selectedTechnician && (
            <p className="text-sm text-on-surface-variant">
              Sélection :{" "}
              <strong className="text-on-surface">
                {selectedTechnician.name}
              </strong>
            </p>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={pending}>
                Annuler
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={!selectedTechnicianId || pending}
            >
              {pending ? "Assignation…" : "Assigner le ticket"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
