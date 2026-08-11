import { NextResponse } from "next/server";
import { z } from "zod";
import { ApiError, apiFetch } from "@/lib/api";

const paramsSchema = z.object({ ticket: z.string().uuid() }).strict();
const commentSchema = z.object({
  contenu: z.string().trim().min(2),
  est_solution: z.boolean().default(false),
}).strict();

function errorResponse(error: ApiError) {
  return NextResponse.json(typeof error.details === "object" && error.details !== null ? error.details : { message: error.message }, { status: error.status });
}

export async function GET(_request: Request, context: { params: Promise<{ ticket: string }> }) {
  const params = paramsSchema.safeParse(await context.params);
  if (!params.success) return NextResponse.json({ message: "Identifiant de ticket invalide." }, { status: 422 });
  try {
    const data = await apiFetch<unknown>(`/api/tickets/${params.data.ticket}/commentaires`, { redirectOnUnauthorized: false });
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ApiError) return errorResponse(error);
    throw error;
  }
}

export async function POST(request: Request, context: { params: Promise<{ ticket: string }> }) {
  const params = paramsSchema.safeParse(await context.params);
  const body = commentSchema.safeParse(await request.json().catch(() => null));
  if (!params.success || !body.success) return NextResponse.json({ message: "Les données du commentaire sont invalides." }, { status: 422 });
  try {
    const data = await apiFetch<unknown>(`/api/tickets/${params.data.ticket}/commentaires`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body.data),
      redirectOnUnauthorized: false,
    });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    if (error instanceof ApiError) return errorResponse(error);
    throw error;
  }
}
