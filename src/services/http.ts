/**
 * Minimal HTTP client for the Phase 2 backend.
 *
 * - Only reads NEXT_PUBLIC_API_BASE_URL (a public URL, never a secret).
 * - Server-only secrets must live in server code / route handlers and must
 *   never be prefixed with NEXT_PUBLIC_.
 * - Authentication should use secure, httpOnly, SameSite cookies issued by the
 *   backend — never tokens in localStorage.
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export const isBackendConfigured = API_BASE_URL.length > 0;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export async function http<T>(path: string, init?: RequestInit): Promise<T> {
  if (!isBackendConfigured) throw new ApiError(501, "Backend not configured (Phase 1 demo)");
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) throw new ApiError(res.status, `Request failed: ${res.status}`);
  return (await res.json()) as T;
}
