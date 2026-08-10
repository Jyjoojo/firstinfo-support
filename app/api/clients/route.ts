import { NextResponse } from "next/server";
import { z } from "zod";
import { ApiError, apiFetch } from "@/lib/api";

const clientsQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  per_page: z.coerce.number().int().min(1).max(100).default(20),
}).strict();

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const rawQuery = Object.fromEntries(
    [...requestUrl.searchParams.keys()].map((key) => {
      const values = requestUrl.searchParams.getAll(key);
      return [key, values.length === 1 ? values[0] : values];
    }),
  );
  const parsedQuery = clientsQuerySchema.safeParse(rawQuery);

  if (!parsedQuery.success) {
    return NextResponse.json(
      {
        message: "Les paramètres de recherche sont invalides.",
        errors: parsedQuery.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const searchParams = new URLSearchParams({
    per_page: String(parsedQuery.data.per_page),
  });
  if (parsedQuery.data.search) {
    searchParams.set("search", parsedQuery.data.search);
  }

  try {
    const data = await apiFetch<unknown>(`/api/clients?${searchParams}`, {
      redirectOnUnauthorized: false,
    });
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ApiError) {
      const body = typeof error.details === "object" && error.details !== null
        ? error.details
        : { message: error.message };
      return NextResponse.json(body, { status: error.status });
    }

    throw error;
  }
}
