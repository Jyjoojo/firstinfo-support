import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Ticket } from "@/lib/tickets";

interface TicketStatusStepperProps {
  currentStatus: Ticket["statut"];
}

const STEPS: { key: Ticket["statut"]; label: string }[] = [
  { key: "nouveau", label: "Nouveau" },
  { key: "en cours", label: "En cours" },
  { key: "résolu", label: "Résolu" },
  { key: "fermé", label: "Fermé" },
];

export default function TicketStatusStepper({ currentStatus }: TicketStatusStepperProps) {
  const currentIndex = STEPS.findIndex((step) => step.key === currentStatus);

  return (
    <div className="bg-surface-container-lowest rounded-xl card-shadow px-5 py-3 border border-outline-variant/20">
      <div className="flex items-start">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          const isLast = index === STEPS.length - 1;

          return (
            <div key={step.key} className={cn("flex items-center", !isLast && "flex-1")}>
              {/* Étape (cercle + label) */}
              <div className="flex flex-col items-center gap-2 shrink-0">
                {/* Chevron au-dessus de l'étape active */}
                <div className="h-4 flex items-center justify-center">
                  {isActive && (
                    <ChevronDown className="w-4 h-4 text-primary" strokeWidth={3} />
                  )}
                </div>

                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center border-2 font-bold text-sm transition-colors",
                    isCompleted && "bg-primary-container border-secondary text-on-secondary",
                    isActive && "bg-primary-container border-primary-container text-on-primary",
                    !isCompleted && !isActive && "bg-surface-container-lowest border-outline-variant text-on-surface-variant"
                  )}
                >
                  {isCompleted ? <Check className="w-4 h-4" strokeWidth={3} /> : index + 1}
                </div>

                <span
                  className={cn(
                    "text-xs whitespace-nowrap",
                    (isCompleted || isActive) && "font-bold text-on-surface-variant",
                    !isCompleted && !isActive && "text-on-surface-variant opacity-60"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Ligne de connexion vers l'étape suivante */}
              {!isLast && (
                <div
                  className={cn(
                    "h-0.5 flex-1 rounded-full transition-colors",
                    isCompleted ? "bg-primary-container/40" : "bg-secondary",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
