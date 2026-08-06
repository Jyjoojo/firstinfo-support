import { NextResponse } from "next/server";
import { ApiError, apiFetch } from "@/lib/api";

function apiErrorResponse(error: ApiError) {
  const body = typeof error.details === "object" && error.details !== null
    ? error.details
    : { message: error.message };
  return NextResponse.json(body, { status: error.status });
}

async function updateCategory(
  request: Request,
  context: { params: Promise<{ category: string }> },
) {
  const { category } = await context.params;

  try {
    const body = await request.json();
    const data = await apiFetch<unknown>(`/api/categories/${encodeURIComponent(category)}`, {
      method: request.method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      redirectOnUnauthorized: false,
    });
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ApiError) return apiErrorResponse(error);
    throw error;
  }
}

export const PUT = updateCategory;
export const PATCH = updateCategory;
