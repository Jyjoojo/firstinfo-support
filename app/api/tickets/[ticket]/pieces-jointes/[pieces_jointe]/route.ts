import { NextResponse } from "next/server";

function backendUrl(path: string) {
  const baseUrl = process.env.TICKETS_API_URL;
  return baseUrl ? `${baseUrl.replace(/\/$/, "")}${path}` : null;
}

export async function DELETE(request: Request, { params }: { params: Promise<{ ticket: string; pieces_jointe: string }> }) {
  const { ticket, pieces_jointe } = await params;
  const url = backendUrl(`/api/tickets/${ticket}/pieces-jointes/${pieces_jointe}`);
  if (!url) return NextResponse.json({ message: "La variable TICKETS_API_URL n'est pas configurée." }, { status: 503 });

  const headers: HeadersInit = { Accept: "application/json" };
  const authorization = request.headers.get("authorization");
  if (authorization) headers.Authorization = authorization;

  const response = await fetch(url, { method: "DELETE", headers });
  return new NextResponse(response.body, { status: response.status, headers: { "Content-Type": response.headers.get("content-type") ?? "application/json" } });
}
