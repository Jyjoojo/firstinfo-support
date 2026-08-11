import { NextResponse } from "next/server";
import { z } from "zod";
import { ApiError, apiFetch } from "@/lib/api";

const paramsSchema = z.object({ ticket: z.string().uuid() }).strict();

export async function POST(_request: Request, context: { params: Promise<{ ticket: string }> }) {
  const params = paramsSchema.safeParse(await context.params);
  if (!params.success) return NextResponse.json({ message: "Identifiant de ticket invalide." }, { status: 422 });

  try {
    const data = await apiFetch<unknown>(`/api/tickets/${params.data.ticket}/reprendre`, { method: "POST", redirectOnUnauthorized: false });
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ApiError) return NextResponse.json(typeof error.details === "object" && error.details !== null ? error.details : { message: error.message }, { status: error.status });
    throw error;
  }
}
