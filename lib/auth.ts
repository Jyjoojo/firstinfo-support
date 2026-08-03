import { cookies } from "next/headers";
import { z } from "zod";

const authenticatedUserSchema = z.object({
  id: z.string(),
  nom: z.string(),
  prenom: z.string(),
  email: z.string().email(),
  role: z.string(),
  telephone: z.string().nullable().optional(),
  actif: z.boolean(),
  client: z
    .object({
      id: z.string(),
      entreprise: z.string(),
      secteur: z.string().nullable().optional(),
      est_client_officiel: z.boolean().optional(),
    })
    .nullable()
    .optional(),
});

export type AuthenticatedUser = z.infer<typeof authenticatedUserSchema>;

export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  const apiUrl = process.env.API_URL;
  const token = (await cookies()).get("auth_token")?.value;

  if (!apiUrl || !token) return null;

  try {
    const response = await fetch(`${apiUrl.replace(/\/$/, "")}/api/auth/me`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) return null;

    const result = authenticatedUserSchema.safeParse(await response.json());
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
