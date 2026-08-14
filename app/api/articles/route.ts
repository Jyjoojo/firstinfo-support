import { NextResponse } from "next/server";
import { ApiError, apiFetch } from "@/lib/api";
import { getPublicArticles } from "@/lib/knowledge-base-api";

function errorResponse(error: ApiError) {
  const body = typeof error.details === "object" && error.details !== null
    ? error.details
    : { message: error.message };
  return NextResponse.json(body, { status: error.status });
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    if (["technicien", "admin"].includes(url.searchParams.get("espace") ?? "")) {
      url.searchParams.delete("espace");
      const query = url.searchParams.toString();
      const data = await apiFetch<unknown>(`/api/articles${query ? `?${query}` : ""}`, {
        redirectOnUnauthorized: false,
      });
      return NextResponse.json(data);
    }

    return NextResponse.json(await getPublicArticles());
  } catch (error) {
    if (error instanceof ApiError) return errorResponse(error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await apiFetch<unknown>("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      redirectOnUnauthorized: false,
    });
    return NextResponse.json(data ?? { message: "Article créé." }, { status: 201 });
  } catch (error) {
    if (error instanceof ApiError) return errorResponse(error);
    throw error;
  }
}
