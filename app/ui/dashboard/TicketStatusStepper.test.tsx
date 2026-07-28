import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TicketStatusStepper, { type TicketWorkflowStatus } from "./TicketStatusStepper";

const statuses: TicketWorkflowStatus[] = [
  "nouveau",
  "en_cours",
  "en_attente",
  "resolu",
  "ferme",
];

describe("TicketStatusStepper", () => {
  it.each(statuses)("marque correctement les étapes pour le statut %s", (status) => {
    render(<TicketStatusStepper currentStatus={status} />);
    const activeIndex = statuses.indexOf(status);

    statuses.forEach((step, index) => {
      expect(screen.getByTestId(`ticket-status-${step}`)).toHaveAttribute(
        "data-state",
        index < activeIndex ? "completed" : index === activeIndex ? "active" : "upcoming",
      );
    });
  });
});
