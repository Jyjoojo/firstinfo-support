import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api";
import { getPublicArticles } from "@/lib/knowledge-base-api";

export async function GET() {
  try {
    return NextResponse.json(await getPublicArticles());
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    throw error;
  }
}
