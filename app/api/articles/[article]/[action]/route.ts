import { NextResponse } from "next/server";
import { ApiError, apiFetch } from "@/lib/api";

const actions = new Set(["soumettre", "valider", "refuser", "publier", "depublier", "archiver", "restaurer"]);

function errorResponse(error: ApiError) {
  const body = typeof error.details === "object" && error.details !== null ? error.details : { message: error.message };
  return NextResponse.json(body, { status: error.status });
}

export async function POST(request: Request, { params }: { params: Promise<{ article: string; action: string }> }) {
  const { article, action } = await params;
  if (!actions.has(action)) return NextResponse.json({ message: "Action inconnue." }, { status: 404 });

  try {
    const contentType = request.headers.get("content-type") ?? "";
    const body = contentType.includes("application/json") ? await request.json().catch(() => undefined) : undefined;
    const data = await apiFetch<unknown>(`/api/articles/${encodeURIComponent(article)}/${action}`, {
      method: "POST",
      ...(body === undefined ? {} : { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }),
      redirectOnUnauthorized: false,
    });
    return NextResponse.json(data ?? { message: "Action effectuée." });
  } catch (error) {
    if (error instanceof ApiError) return errorResponse(error);
    throw error;
  }
}
