// Minimal, hand-written request wrapper -- no generated OpenAPI types yet
// (deliberately deferred, see the readiness report Commit 2 implements).
// Just enough to call the two Platform Staff auth endpoints this commit
// needs: base URL from VITE_API_BASE_URL, optional bearer token, and
// backend error-shape extraction ({"detail": "..."} or
// {"detail": {"message": "..."}}).

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
}

async function extractErrorMessage(response: Response): Promise<string> {
  try {
    const data: unknown = await response.json();
    if (data && typeof data === "object" && "detail" in data) {
      const detail = (data as { detail: unknown }).detail;
      if (typeof detail === "string") {
        return detail;
      }
      if (
        detail &&
        typeof detail === "object" &&
        "message" in detail &&
        typeof (detail as { message: unknown }).message === "string"
      ) {
        return (detail as { message: string }).message;
      }
    }
  } catch {
    // Response body was not JSON -- fall through to statusText.
  }
  return response.statusText || `Request failed with status ${response.status}`;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    throw new ApiError(response.status, await extractErrorMessage(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
