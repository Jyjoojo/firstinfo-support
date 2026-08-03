import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

const AUTH_COOKIE = "auth_token";

const loginSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, "L'adresse e-mail est requise.")
      .max(254, "L'adresse e-mail est trop longue.")
      .email("L'adresse e-mail n'est pas valide."),
    password: z
      .string()
      .min(1, "Le mot de passe est requis.")
      .max(1024, "Le mot de passe est trop long."),
    remember: z.boolean().optional().default(false),
  })
  .strict();

export async function POST(request: Request) {
  const apiUrl = process.env.API_URL;

  if (!apiUrl) {
    return NextResponse.json(
      { message: "Le service d'authentification n'est pas configuré." },
      { status: 503 },
    );
  }

  const rawBody = await request.json().catch(() => null);
  const parsedBody = loginSchema.safeParse(rawBody);

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        message: "Les données de connexion sont invalides.",
        errors: z.flattenError(parsedBody.error).fieldErrors,
      },
      { status: 400 },
    );
  }

  const body = parsedBody.data;

  try {
    const response = await fetch(`${apiUrl.replace(/\/$/, "")}/api/auth/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: body.email, password: body.password }),
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        { message: data?.message ?? "La connexion a échoué." },
        { status: response.status },
      );
    }

    if (!data?.token || !data?.user) {
      return NextResponse.json(
        { message: "La réponse du service d'authentification est invalide." },
        { status: 502 },
      );
    }

    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE, data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: body.remember ? 60 * 60 * 24 * 7 : undefined,
    });

    return NextResponse.json({ success: true, user: data.user });
  } catch {
    return NextResponse.json(
      { message: "Le service d'authentification est momentanément indisponible." },
      { status: 503 },
    );
  }
}
