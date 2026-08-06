import type { AnchorHTMLAttributes } from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import NewTicketPage from "./page";

const pushMock = vi.fn();
const toastSuccessMock = vi.fn();
const toastErrorMock = vi.fn();

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={String(href)} {...props}>{children}</a>
  ),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: toastSuccessMock,
    error: toastErrorMock,
  },
}));

vi.mock("@/app/ui/FileUpload", () => ({
  default: ({ onFilesChange }: { onFilesChange?: (files: File[]) => void }) => (
    <input
      aria-label="Zone de fichiers"
      type="file"
      multiple
      onChange={(event) => onFilesChange?.(Array.from(event.target.files ?? []))}
    />
  ),
}));

describe("parcours de création de ticket", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    pushMock.mockReset();
    toastSuccessMock.mockReset();
    toastErrorMock.mockReset();
  });

  it("charge les catégories, crée le ticket en JSON puis ouvre sa page", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify([
        { id: "category-1", libelle: "Sage 100 Comptabilité" },
      ]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        message: "Ticket créé avec succès.",
        ticket: { id: "ticket-2042", reference: "TK26-0042" },
      }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }));

    render(<NewTicketPage />);

    await user.type(screen.getByLabelText(/Titre du ticket/i), "Erreur de clôture");
    await user.type(screen.getByLabelText(/Description du problème/i), "La clôture échoue avec le code 42.");
    await user.click(screen.getByRole("combobox", { name: /Catégorie de la solution/i }));
    const category = await screen.findByRole("option", { name: "Sage 100 Comptabilité" });
    await act(async () => fireEvent.click(category));
    await user.click(screen.getByRole("button", { name: "Créer le ticket" }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenNthCalledWith(2, "/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titre: "Erreur de clôture",
          description: "La clôture échoue avec le code 42.",
          priorite: "basse",
          categorie_id: "category-1",
        }),
      });
    });
    expect(toastSuccessMock).toHaveBeenCalledWith("Ticket créé avec succès", {
      description: "Ticket TK26-0042 créé avec succès.",
    });
    expect(pushMock).toHaveBeenCalledWith("/dashboard/client/tickets/ticket-2042");
  });

  it("envoie les pièces jointes en multipart sans définir Content-Type", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify([
        { id: "category-1", libelle: "Sage 100 Comptabilité" },
      ]), { status: 200, headers: { "Content-Type": "application/json" } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        ticket: { id: "ticket-with-file", reference: "TK26-0043" },
      }), { status: 201, headers: { "Content-Type": "application/json" } }));

    render(<NewTicketPage />);

    await user.type(screen.getByLabelText(/Titre du ticket/i), "Erreur de clôture");
    await user.type(screen.getByLabelText(/Description du problème/i), "La clôture échoue avec le code 42.");
    await user.click(screen.getByRole("combobox", { name: /Catégorie de la solution/i }));
    await act(async () => fireEvent.click(await screen.findByRole("option", { name: "Sage 100 Comptabilité" })));
    await user.upload(screen.getByLabelText("Zone de fichiers"), new File(["capture"], "capture.png", { type: "image/png" }));
    await user.click(screen.getByRole("button", { name: "Créer le ticket" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    const request = fetchMock.mock.calls[1];
    const options = request[1] as RequestInit;
    const body = options.body as FormData;

    expect(request[0]).toBe("/api/tickets");
    expect(options.method).toBe("POST");
    expect(options.headers).toBeUndefined();
    expect(body).toBeInstanceOf(FormData);
    expect(body.get("categorie_id")).toBe("category-1");
    expect(body.get("fichiers[]")).toBeInstanceOf(File);
  });
});
