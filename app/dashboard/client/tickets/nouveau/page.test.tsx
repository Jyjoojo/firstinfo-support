import type { AnchorHTMLAttributes } from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import NewTicketPage from "./page";

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={String(href)} {...props}>{children}</a>
  ),
}));

vi.mock("@/app/ui/FileUpload", () => ({ default: () => <div>Zone de fichiers</div> }));

describe("parcours de création de ticket", () => {
  afterEach(() => vi.restoreAllMocks());

  it("envoie les données saisies puis affiche la confirmation", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ id: "TK-2042" }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }),
    );
    render(<NewTicketPage />);

    await user.type(screen.getByLabelText(/Titre du ticket/i), "Erreur de clôture");
    await user.type(screen.getByLabelText(/Description du problème/i), "La clôture échoue avec le code 42.");
    await user.click(screen.getByRole("combobox", { name: /Catégorie de la solution/i }));
    const category = await screen.findByRole("option", { name: "Sage 100 Comptabilité" });
    await act(async () => fireEvent.click(category));
    await user.click(screen.getByRole("button", { name: "Créer le ticket" }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titre: "Erreur de clôture",
          description: "La clôture échoue avec le code 42.",
          categorie: "sage-100-comptabilite",
          priorite: "basse",
        }),
      });
    });
    expect(await screen.findByRole("status")).toHaveTextContent("Ticket TK-2042 créé avec succès.");
  });
});
