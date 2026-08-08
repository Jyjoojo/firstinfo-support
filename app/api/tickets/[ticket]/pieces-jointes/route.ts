import { NextResponse } from "next/server";
import { ApiError, apiFetch } from "@/lib/api";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const acceptedExtensions = new Set(["pdf", "doc", "docx", "xls", "xlsx", "png", "jpg", "jpeg"]);

function apiErrorResponse(error: ApiError) {
  return NextResponse.json(
    typeof error.details === "object" && error.details !== null ? error.details : { message: error.message },
    { status: error.status },
  );
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ ticket: string }> },
) {
  const { ticket } = await context.params;
  try {
    const data = await apiFetch<unknown>(`/api/tickets/${encodeURIComponent(ticket)}/pieces-jointes`, {
      redirectOnUnauthorized: false,
    });
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof ApiError) return apiErrorResponse(error);
    throw error;
  }
}

export async function POST(
  request: Request,
  context: { params: Promise<{ ticket: string }> },
) {
  const { ticket } = await context.params;
  const formData = await request.formData().catch(() => null);
  const file = formData?.get("fichier");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Le champ fichier est requis." }, { status: 422 });
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ message: "Le fichier ne doit pas dépasser 10 Mo." }, { status: 422 });
  }

  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!extension || !acceptedExtensions.has(extension)) {
    return NextResponse.json({ message: "Le format du fichier n'est pas accepté." }, { status: 422 });
  }

  try {
    const data = await apiFetch<unknown>(`/api/tickets/${encodeURIComponent(ticket)}/pieces-jointes`, {
      method: "POST",
      body: formData,
      redirectOnUnauthorized: false,
    });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    if (error instanceof ApiError) return apiErrorResponse(error);
    throw error;
  }
}
