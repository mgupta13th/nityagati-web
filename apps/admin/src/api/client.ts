// Minimal, hand-written request wrapper -- no generated OpenAPI types yet
// (deliberately deferred, see the readiness report Commit 2 implements).
// Just enough to call the Platform Staff API surface this app needs:
// base URL from VITE_API_BASE_URL, optional bearer token, and backend
// error-shape extraction ({"detail": "..."} or
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

// Centralized session-expiry handling (Commit 7): a token-bearing request
// that comes back 401 means require_platform_staff rejected the session
// (expired, invalid, or the account was deactivated) -- every 401 branch
// in that dependency is unambiguously about session validity, never
// about a specific action being disallowed (that would be 403). A
// request with NO token (the login call itself) never triggers this --
// a wrong-password 401 from /platform-admin/auth/login must stay a
// plain form error, not a global logout, and it can't reach this branch
// since it never sets options.token.
//
// One handler, registered once by AuthContext (see that file for its
// registration effect and lifecycle notes) -- deliberately not
// duplicated in every page's own .catch(). Calling it only clears local
// session state and lets the existing RequireAuth/<Navigate> guard
// redirect declaratively; it never itself calls fetch or navigates, so
// it cannot trigger another request that could 401 again -- no loop is
// possible.
type UnauthorizedHandler = () => void;
let unauthorizedHandler: UnauthorizedHandler | null = null;

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null): void {
  unauthorizedHandler = handler;
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
    if (response.status === 401 && options.token && unauthorizedHandler) {
      unauthorizedHandler();
    }
    throw new ApiError(response.status, await extractErrorMessage(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
