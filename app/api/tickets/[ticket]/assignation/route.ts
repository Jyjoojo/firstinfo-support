import { NextResponse } from "next/server";
import { z } from "zod";
import { ApiError, apiFetch } from "@/lib/api";

const paramsSchema = z.object({ ticket: z.string().uuid() }).strict();
const assignmentSchema = z.object({
  technicien_id: z.string().uuid(),
  motif: z.string().trim().max(500).optional(),
}).strict();

export async function POST(request: Request, context: { params: Promise<{ ticket: string }> }) {
  const params = paramsSchema.safeParse(await context.params);
  const body = assignmentSchema.safeParse(await request.json().catch(() => null));
  if (!params.success || !body.success) {
    return NextResponse.json({
      message: "Les données de transfert sont invalides.",
      errors: {
        ...(params.success ? {} : params.error.flatten().fieldErrors),
        ...(body.success ? {} : body.error.flatten().fieldErrors),
      },
    }, { status: 422 });
  }

  try {
    const data = await apiFetch<unknown>(`/api/tickets/${params.data.ticket}/assignation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body.data),
      redirectOnUnauthorized: false,
    });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    if (error instanceof ApiError) return NextResponse.json(typeof error.details === "object" && error.details !== null ? error.details : { message: error.message }, { status: error.status });
    throw error;
  }
}
