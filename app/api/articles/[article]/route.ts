import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api";
import { getPublicArticle } from "@/lib/knowledge-base-api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ article: string }> },
) {
  try {
    const { article } = await params;
    return NextResponse.json(await getPublicArticle(article));
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    throw error;
  }
}
