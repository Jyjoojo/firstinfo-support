import { NextResponse } from "next/server";
import { ApiError, apiFetch } from "@/lib/api";

function errorResponse(error: ApiError) {
  const body = typeof error.details === "object" && error.details !== null
    ? error.details
    : { message: error.message };

  return NextResponse.json(body, { status: error.status });
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  try {
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const data = await apiFetch<unknown>("/api/tickets", {
        method: "POST",
        body: formData,
        redirectOnUnauthorized: false,
      });

      return NextResponse.json(data, { status: 201 });
    }

    const body = await request.json();
    const data = await apiFetch<unknown>("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      redirectOnUnauthorized: false,
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    if (error instanceof ApiError) return errorResponse(error);
    throw error;
  }
}
