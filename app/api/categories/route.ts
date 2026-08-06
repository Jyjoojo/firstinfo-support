import { NextResponse } from "next/server";
import { ApiError, apiFetch } from "@/lib/api";

export async function GET() {
  try {
    const categories = await apiFetch<unknown>("/api/categories", {
      redirectOnUnauthorized: false,
    });
    return NextResponse.json(categories);
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
