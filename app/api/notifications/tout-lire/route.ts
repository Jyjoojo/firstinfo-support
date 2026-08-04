import { NextResponse } from "next/server";
import { api, ApiError } from "@/lib/api";

export async function POST() {
  try {
    const result = await api.post<unknown>("/api/notifications/tout-lire");
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    throw error;
  }
}
