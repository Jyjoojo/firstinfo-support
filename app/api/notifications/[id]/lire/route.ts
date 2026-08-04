import { NextResponse } from "next/server";
import { z } from "zod";
import { api, ApiError } from "@/lib/api";

const paramsSchema = z.object({ id: z.string().uuid() }).strict();

export async function PATCH(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const params = paramsSchema.safeParse(await context.params);
  if (!params.success) {
    return NextResponse.json({ message: "Identifiant invalide." }, { status: 400 });
  }

  try {
    const result = await api.patch<unknown>(
      `/api/notifications/${params.data.id}/lire`,
      undefined,
    );
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    throw error;
  }
}
