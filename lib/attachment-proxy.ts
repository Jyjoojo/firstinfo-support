import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function proxyAttachment(pieceId: string, action: "afficher" | "telecharger") {
  const apiUrl = process.env.API_URL;
  if (!apiUrl) {
    return NextResponse.json({ message: "Le service API n'est pas configuré." }, { status: 503 });
  }

  const token = (await cookies()).get("auth_token")?.value;
  const headers = new Headers({ Accept: "*/*" });
  if (token) headers.set("Authorization", `Bearer ${token}`);

  try {
    const response = await fetch(
      `${apiUrl.replace(/\/$/, "")}/api/pieces-jointes/${encodeURIComponent(pieceId)}/${action}`,
      { headers, cache: "no-store" },
    );
    const responseHeaders = new Headers();
    for (const name of ["content-type", "content-length", "content-disposition", "cache-control"]) {
      const value = response.headers.get(name);
      if (value) responseHeaders.set(name, value);
    }

    return new NextResponse(response.body, { status: response.status, headers: responseHeaders });
  } catch {
    return NextResponse.json({ message: "La pièce jointe est momentanément indisponible." }, { status: 503 });
  }
}
