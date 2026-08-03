import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const AUTH_COOKIE = "auth_token";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  const apiUrl = process.env.API_URL;

  if (token && apiUrl) {
    try {
      await fetch(`${apiUrl.replace(/\/$/, "")}/api/auth/logout`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });
    } catch {
      // La suppression locale reste prioritaire si Laravel est indisponible.
    }
  }

  cookieStore.delete(AUTH_COOKIE);

  return NextResponse.json({ success: true });
}
