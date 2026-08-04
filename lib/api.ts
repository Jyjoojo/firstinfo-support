import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type ApiFetchOptions = RequestInit & {
  authenticated?: boolean;
  redirectOnUnauthorized?: boolean;
};

async function readResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204) return undefined;
  const contentType = response.headers.get("content-type") ?? "";
  return contentType.includes("application/json")
    ? response.json().catch(() => undefined)
    : response.text().catch(() => undefined);
}

export async function apiFetch<T>(
  endpoint: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  if (!endpoint.startsWith("/") || endpoint.startsWith("//")) {
    throw new ApiError(500, "Le chemin de l'API est invalide.");
  }

  const apiUrl = process.env.API_URL;
  if (!apiUrl) throw new ApiError(503, "Le service API n'est pas configuré.");

  const {
    authenticated = true,
    redirectOnUnauthorized = authenticated,
    ...requestOptions
  } = options;
  const headers = new Headers(requestOptions.headers);
  headers.set("Accept", "application/json");

  if (authenticated) {
    const token = (await cookies()).get("auth_token")?.value;
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${apiUrl.replace(/\/$/, "")}${endpoint}`, {
      ...requestOptions,
      headers,
      cache: requestOptions.cache ?? "no-store",
    });
  } catch {
    throw new ApiError(503, "Le service API est momentanément indisponible.");
  }

  const data = await readResponseBody(response);
  if (!response.ok) {
    if (response.status === 401 && redirectOnUnauthorized) {
      redirect("/auth/login?session=expired");
    }

    const message = typeof data === "object"
      && data !== null
      && "message" in data
      && typeof data.message === "string"
      ? data.message
      : "La requête API a échoué.";
    throw new ApiError(response.status, message, data);
  }

  return data as T;
}

function withJsonBody(body: unknown, options: ApiFetchOptions = {}) {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  return { ...options, headers, body: JSON.stringify(body) };
}

export const api = {
  get: <T>(endpoint: string, options: ApiFetchOptions = {}) =>
    apiFetch<T>(endpoint, { ...options, method: "GET" }),
  post: <T>(endpoint: string, body?: unknown, options: ApiFetchOptions = {}) =>
    apiFetch<T>(endpoint, {
      ...(body === undefined ? options : withJsonBody(body, options)),
      method: "POST",
    }),
  put: <T>(endpoint: string, body: unknown, options: ApiFetchOptions = {}) =>
    apiFetch<T>(endpoint, { ...withJsonBody(body, options), method: "PUT" }),
  patch: <T>(endpoint: string, body?: unknown, options: ApiFetchOptions = {}) =>
    apiFetch<T>(endpoint, {
      ...(body === undefined ? options : withJsonBody(body, options)),
      method: "PATCH",
    }),
  delete: <T>(endpoint: string, options: ApiFetchOptions = {}) =>
    apiFetch<T>(endpoint, { ...options, method: "DELETE" }),
};
