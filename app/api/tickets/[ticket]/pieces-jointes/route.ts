import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_CONTENT_LENGTH = 10 * 1024 * 1024;
const MAX_MULTIPART_CONTENT_LENGTH = MAX_CONTENT_LENGTH + 1024 * 1024;
const acceptedExtensions = new Set(["pdf", "doc", "docx", "xls", "xlsx", "png", "jpg", "jpeg", "zip"]);

function backendUrl(path: string) {
  const baseUrl = process.env.TICKETS_API_URL;
  return baseUrl ? `${baseUrl.replace(/\/$/, "")}${path}` : null;
}

function missingBackendResponse() {
  return NextResponse.json({ message: "La variable TICKETS_API_URL n'est pas configurée." }, { status: 503 });
}

function forwardHeaders(request: Request) {
  const headers: HeadersInit = { Accept: "application/json" };
  const authorization = request.headers.get("authorization");
  if (authorization) headers.Authorization = authorization;
  return headers;
}

export async function GET(request: Request, { params }: { params: Promise<{ ticket: string }> }) {
  const { ticket } = await params;
  const url = backendUrl(`/api/tickets/${ticket}/pieces-jointes`);
  if (!url) return missingBackendResponse();

  const response = await fetch(url, { headers: forwardHeaders(request) });
  return new NextResponse(response.body, { status: response.status, headers: { "Content-Type": response.headers.get("content-type") ?? "application/json" } });
}

export async function POST(request: Request, { params }: { params: Promise<{ ticket: string }> }) {
  const { ticket } = await params;
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_MULTIPART_CONTENT_LENGTH) {
    return NextResponse.json({ message: "Le fichier ne doit pas dépasser 10 Mo." }, { status: 413 });
  }

  const formData = await request.formData();
  const file = formData.get("fichier");
  if (!(file instanceof File)) return NextResponse.json({ message: "Le champ fichier est requis." }, { status: 400 });
  if (file.size > MAX_CONTENT_LENGTH) return NextResponse.json({ message: "Le fichier ne doit pas dépasser 10 Mo." }, { status: 413 });

  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!extension || !acceptedExtensions.has(extension)) {
    return NextResponse.json({ message: "Extension de fichier non autorisée." }, { status: 415 });
  }

  const url = backendUrl(`/api/tickets/${ticket}/pieces-jointes`);
  if (!url) return missingBackendResponse();

  const response = await fetch(url, {
    method: "POST",
    headers: forwardHeaders(request),
    body: formData,
  });
  return new NextResponse(response.body, { status: response.status, headers: { "Content-Type": response.headers.get("content-type") ?? "application/json" } });
}
