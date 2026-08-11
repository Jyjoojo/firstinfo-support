import { NextResponse } from "next/server";
import { z } from "zod";
import { ApiError, apiFetch } from "@/lib/api";

const paramsSchema = z.object({ ticket: z.string().uuid() }).strict();
const priorityPatchSchema = z.object({
  priorite: z.enum(["basse", "normale", "haute", "urgente"]),
}).strict();

function apiErrorResponse(error: ApiError) {
  const body = typeof error.details === "object" && error.details !== null
    ? error.details
    : { message: error.message };
  return NextResponse.json(body, { status: error.status });
}

function invalidRequest(message: string, errors: unknown) {
  return NextResponse.json({ message, errors }, { status: 422 });
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ ticket: string }> },
) {
  const params = paramsSchema.safeParse(await context.params);
  if (!params.success) {
    return invalidRequest("Identifiant de ticket invalide.", params.error.flatten().fieldErrors);
  }

  try {
    const data = await apiFetch<unknown>(`/api/tickets/${params.data.ticket}`, {
      redirectOnUnauthorized: false,
    });
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ApiError) return apiErrorResponse(error);
    throw error;
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ ticket: string }> },
) {
  const params = paramsSchema.safeParse(await context.params);
  const body = priorityPatchSchema.safeParse(await request.json().catch(() => null));
  if (!params.success) {
    return invalidRequest("Identifiant de ticket invalide.", params.error.flatten().fieldErrors);
  }
  if (!body.success) {
    return invalidRequest("Priorité invalide.", body.error.flatten().fieldErrors);
  }

  try {
    const data = await apiFetch<unknown>(`/api/tickets/${params.data.ticket}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body.data),
      redirectOnUnauthorized: false,
    });
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ApiError) return apiErrorResponse(error);
    throw error;
  }
}
