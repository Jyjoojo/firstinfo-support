import { NextResponse } from "next/server";
import { ApiError, apiFetch } from "@/lib/api";

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ message: "Les données du profil sont invalides." }, { status: 400 });
  }

  try {
    const result = await apiFetch<unknown>("/api/auth/profil", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      redirectOnUnauthorized: false,
    });
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ApiError) {
      const responseBody = typeof error.details === "object" && error.details !== null
        ? error.details
        : { message: error.message };
      return NextResponse.json(responseBody, { status: error.status });
    }
    throw error;
  }
}
