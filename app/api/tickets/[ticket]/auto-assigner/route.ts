import { NextResponse } from "next/server";
import { ApiError, apiFetch } from "@/lib/api";

export async function POST(
  _request: Request,
  context: { params: Promise<{ ticket: string }> },
) {
  const { ticket } = await context.params;

  try {
    const data = await apiFetch<unknown>(
      `/api/tickets/${encodeURIComponent(ticket)}/auto-assigner`,
      { method: "POST", redirectOnUnauthorized: false },
    );

    return NextResponse.json(data, { status: 201 });
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
