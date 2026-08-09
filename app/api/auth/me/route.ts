import { NextResponse } from "next/server";
import { ApiError, apiFetch } from "@/lib/api";

export async function GET() {
  try {
    const user = await apiFetch<unknown>("/api/auth/me", {
      method: "GET",
      redirectOnUnauthorized: false,
    });
    return NextResponse.json(user);
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
