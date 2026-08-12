import { NextResponse } from "next/server";
import { ApiError, apiFetch } from "@/lib/api";

function errorResponse(error: ApiError) {
  const body = typeof error.details === "object" && error.details !== null
    ? error.details
    : { message: error.message };
  return NextResponse.json(body, { status: error.status });
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ article: string }> },
) {
  try {
    const { article } = await params;
    const data = await apiFetch<unknown>(`/api/articles/${encodeURIComponent(article)}/soumettre`, {
      method: "POST",
      redirectOnUnauthorized: false,
    });
    return NextResponse.json(data ?? { message: "Article soumis à validation." });
  } catch (error) {
    if (error instanceof ApiError) return errorResponse(error);
    throw error;
  }
}
