import { NextResponse } from "next/server";
import { ApiError, apiFetch } from "@/lib/api";

export async function POST(
  request: Request,
  context: { params: Promise<{ ticket: string }> },
) {
  const { ticket } = await context.params;

  try {
    const body = await request.json();
    const data = await apiFetch<unknown>(`/api/tickets/${encodeURIComponent(ticket)}/refuser-solution`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
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
