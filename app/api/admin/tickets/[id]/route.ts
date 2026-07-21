import { NextResponse } from "next/server";
import { tickets } from "@/lib/tickets";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ticket = tickets.find((item) => item.id === id);
  const { action } = await request.json() as { action?: "close" | "reopen" };

  if (!ticket) return NextResponse.json({ message: "Ticket introuvable." }, { status: 404 });
  if (action !== "close" && action !== "reopen") return NextResponse.json({ message: "Action non prise en charge." }, { status: 400 });

  return NextResponse.json({ id: ticket.id, status: action === "close" ? "fermé" : "nouveau" });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ticket = tickets.find((item) => item.id === id);

  if (!ticket) return NextResponse.json({ message: "Ticket introuvable." }, { status: 404 });
  return NextResponse.json({ id: ticket.id, deleted: true });
}
