import { NextResponse } from "next/server";
import { z } from "zod";
import { ApiError, apiFetch } from "@/lib/api";

const paramsSchema = z.object({ piece: z.string().uuid() }).strict();

export async function DELETE(_request: Request, context: { params: Promise<{ piece: string }> }) {
  const params = paramsSchema.safeParse(await context.params);
  if (!params.success) return NextResponse.json({ message: "Identifiant de pièce jointe invalide." }, { status: 422 });
  try {
    const data = await apiFetch<unknown>(`/api/pieces-jointes/${params.data.piece}`, {
      method: "DELETE",
      redirectOnUnauthorized: false,
    });
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ApiError) return NextResponse.json(typeof error.details === "object" && error.details !== null ? error.details : { message: error.message }, { status: error.status });
    throw error;
  }
}
