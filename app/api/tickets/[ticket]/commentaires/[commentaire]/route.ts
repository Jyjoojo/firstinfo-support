import { NextResponse } from "next/server";
import { z } from "zod";
import { ApiError, apiFetch } from "@/lib/api";

const paramsSchema = z.object({
  ticket: z.string().uuid(),
  commentaire: z.string().uuid(),
}).strict();
const updateSchema = z.object({ contenu: z.string().trim().min(2) }).strict();

function errorResponse(error: ApiError) {
  return NextResponse.json(typeof error.details === "object" && error.details !== null ? error.details : { message: error.message }, { status: error.status });
}

export async function PATCH(request: Request, context: { params: Promise<{ ticket: string; commentaire: string }> }) {
  const params = paramsSchema.safeParse(await context.params);
  const body = updateSchema.safeParse(await request.json().catch(() => null));
  if (!params.success || !body.success) return NextResponse.json({ message: "Les données du commentaire sont invalides." }, { status: 422 });
  try {
    const data = await apiFetch<unknown>(`/api/tickets/${params.data.ticket}/commentaires/${params.data.commentaire}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body.data),
      redirectOnUnauthorized: false,
    });
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ApiError) return errorResponse(error);
    throw error;
  }
}

export async function DELETE(_request: Request, context: { params: Promise<{ ticket: string; commentaire: string }> }) {
  const params = paramsSchema.safeParse(await context.params);
  if (!params.success) return NextResponse.json({ message: "Identifiant de commentaire invalide." }, { status: 422 });
  try {
    const data = await apiFetch<unknown>(`/api/tickets/${params.data.ticket}/commentaires/${params.data.commentaire}`, {
      method: "DELETE",
      redirectOnUnauthorized: false,
    });
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ApiError) return errorResponse(error);
    throw error;
  }
}
