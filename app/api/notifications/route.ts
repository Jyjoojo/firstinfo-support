import { NextResponse } from "next/server";
import { z } from "zod";
import { ApiError } from "@/lib/api";
import { getNotifications } from "@/lib/notifications-api";

const querySchema = z.object({
  non_lues: z.enum(["true", "false"]).optional(),
  page: z.coerce.number().int().positive().optional(),
}).strict();

export async function GET(request: Request) {
  const query = querySchema.safeParse(
    Object.fromEntries(new URL(request.url).searchParams.entries()),
  );

  if (!query.success) {
    return NextResponse.json({ message: "Filtres invalides." }, { status: 400 });
  }

  try {
    const notifications = await getNotifications({
      unreadOnly: query.data.non_lues === "true",
      page: query.data.page,
    });
    return NextResponse.json(notifications);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    throw error;
  }
}
