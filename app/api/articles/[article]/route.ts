import { NextResponse } from "next/server";
import { ApiError, apiFetch } from "@/lib/api";
import { getPublicArticle } from "@/lib/knowledge-base-api";

function errorResponse(error: ApiError) {
  const body = typeof error.details === "object" && error.details !== null
    ? error.details
    : { message: error.message };
  return NextResponse.json(body, { status: error.status });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ article: string }> },
) {
  try {
    const { article } = await params;
    if (new URL(request.url).searchParams.get("espace") === "technicien") {
      const data = await apiFetch<unknown>(`/api/articles/${encodeURIComponent(article)}`, {
        redirectOnUnauthorized: false,
      });
      return NextResponse.json(data);
    }
    return NextResponse.json(await getPublicArticle(article));
  } catch (error) {
    if (error instanceof ApiError) return errorResponse(error);
    throw error;
  }
}

async function updateArticle(request: Request, article: string, method: "PUT" | "PATCH") {
  const body = await request.json();
  return apiFetch<unknown>(`/api/articles/${encodeURIComponent(article)}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    redirectOnUnauthorized: false,
  });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ article: string }> }) {
  try {
    const { article } = await params;
    const data = await updateArticle(request, article, "PATCH");
    return NextResponse.json(data ?? { message: "Article mis à jour." });
  } catch (error) {
    if (error instanceof ApiError) return errorResponse(error);
    throw error;
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ article: string }> }) {
  try {
    const { article } = await params;
    const data = await updateArticle(request, article, "PUT");
    return NextResponse.json(data ?? { message: "Article mis à jour." });
  } catch (error) {
    if (error instanceof ApiError) return errorResponse(error);
    throw error;
  }
}
