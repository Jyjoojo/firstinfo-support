import { Ticket } from "./tickets";
import {
    SquareArrowDown,
    DiamondMinus,
    CircleArrowUp,
    TriangleAlert,
    LucideIcon,
} from "lucide-react";

export type StatusVariant = Ticket["statut"];
export type PriorityVariant = Ticket["priorite"];

export const statusStyles: Record<StatusVariant, { base: string; icon?: string }> = {
  nouveau: { base: "border-blue-200 bg-blue-50 text-blue-700" },
  "en cours": { base: "border-orange-200 bg-orange-50 text-orange-700" },
  résolu: { base: "border-green-200 bg-green-50 text-green-700" },
  fermé: { base: "border-slate-200 bg-slate-100 text-slate-700" },
};

export const priorityStyles: Record<
  PriorityVariant,
  { base: string; icon?: LucideIcon; toggle: string }
> = {
  basse: {
    base: "border-emerald-200 bg-emerald-50 text-emerald-700",
    toggle: "data-[state=on]:bg-emerald-50 data-[state=on]:text-emerald-700 data-[state=on]:border-emerald-200",
    icon: SquareArrowDown,
  },
  normale: {
    base: "border-sky-200 bg-sky-50 text-sky-700",
    toggle: "data-[state=on]:bg-sky-50 data-[state=on]:text-sky-700 data-[state=on]:border-sky-200",
    icon: DiamondMinus,
  },
  haute: {
    base: "border-amber-200 bg-amber-50 text-amber-700",
    toggle: "data-[state=on]:bg-amber-50 data-[state=on]:text-amber-700 data-[state=on]:border-amber-200",
    icon: CircleArrowUp,
  },
  urgente: {
    base: "border-red-200 bg-red-50 text-red-700",
    toggle: "data-[state=on]:bg-red-50 data-[state=on]:text-red-700 data-[state=on]:border-red-200",
    icon: TriangleAlert,
  },
};