import { NextResponse } from "next/server";
import { z } from "zod";
import { tickets } from "@/lib/tickets";

const paramsSchema = z.object({
  ticket: z
    .string()
    .trim()
    .min(1)
    .max(32)
    .regex(/^TK-\d+$/, "Identifiant de ticket invalide."),
});

const priorityPatchSchema = z
  .object({
    priorite: z.enum(["basse", "normale", "haute", "urgente"]),
  })
  .strict();

const actionPatchSchema = z
  .object({
    action: z.enum(["close", "reopen"]),
  })
  .strict();

const ticketPatchSchema = z.union([
  priorityPatchSchema,
  actionPatchSchema,
]);

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{ ticket: string }>;
  },
) {
  const parsedParams = paramsSchema.safeParse(await context.params);

  if (!parsedParams.success) {
    return NextResponse.json(
      {
        message: "Identifiant de ticket invalide.",
      },
      {
        status: 400,
      },
    );
  }

  const requestBody = await request.json().catch(() => null);
  const parsedBody = ticketPatchSchema.safeParse(requestBody);

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        message: "Les données de mise à jour sont invalides.",
      },
      {
        status: 400,
      },
    );
  }

  const ticket = tickets.find(
    (item) => item.id === parsedParams.data.ticket,
  );

  if (!ticket) {
    return NextResponse.json(
      {
        message: "Ticket introuvable.",
      },
      {
        status: 404,
      },
    );
  }

  // TODO: vérifier l’authentification et que le ticket est assigné au technicien.
  if ("priorite" in parsedBody.data) {
    ticket.priorite = parsedBody.data.priorite;
  } else if (parsedBody.data.action === "close") {
    if (ticket.statut !== "résolu") {
      return NextResponse.json(
        {
          message:
            "Seul un ticket résolu peut être clôturé.",
        },
        {
          status: 409,
        },
      );
    }

    ticket.statut = "fermé";
  } else {
    if (
      ticket.statut !== "résolu"
      && ticket.statut !== "fermé"
    ) {
      return NextResponse.json(
        {
          message:
            "Seul un ticket résolu ou fermé peut être réouvert.",
        },
        {
          status: 409,
        },
      );
    }

    ticket.statut = "nouveau";
  }

  ticket.dateModification = new Date().toISOString();

  return NextResponse.json({
    ticket: {
      id: ticket.id,
      statut: ticket.statut,
      priorite: ticket.priorite,
    },
  });
}
