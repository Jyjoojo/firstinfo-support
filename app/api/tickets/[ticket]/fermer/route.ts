import { NextResponse } from "next/server";
import { ApiError, apiFetch } from "@/lib/api";

export async function POST(
  _request: Request,
  context: { params: Promise<{ ticket: string }> },
) {
  const { ticket } = await context.params;

  try {
    const data = await apiFetch<unknown>(`/api/tickets/${encodeURIComponent(ticket)}/fermer`, {
      method: "POST",
      redirectOnUnauthorized: false,
    });
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        typeof error.details === "object" && error.details !== null ? error.details : { message: error.message },
        { status: error.status },
      );
    }
    throw error;
  }
}
