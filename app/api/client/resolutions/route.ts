import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api";
import { getClientResolutions } from "@/lib/knowledge-base-api";

export async function GET() {
  try {
    return NextResponse.json(await getClientResolutions({ redirectOnUnauthorized: false }));
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    throw error;
  }
}
