import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api";
import { getClientDashboard } from "@/lib/client-dashboard-api";

export async function GET() {
  try {
    const dashboard = await getClientDashboard({ redirectOnUnauthorized: false });
    return NextResponse.json(dashboard);
  } catch (error) {
    if (error instanceof ApiError) {
      const body = typeof error.details === "object" && error.details !== null
        ? error.details
        : { message: error.message };
      return NextResponse.json(body, { status: error.status });
    }
    throw error;
  }
}
