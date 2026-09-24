import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { setUnauthorizedHandler } from "../api/client";
import { fetchMe, login as loginRequest } from "./platformStaffApi";

// sessionStorage, not localStorage -- a platform-staff session should not
// silently outlive the tab, per the readiness report's security
// reasoning. The backend never issues a refresh token (short-lived
// access token only), so there is nothing longer-lived to protect here.
const TOKEN_STORAGE_KEY = "nityagati_admin_platform_staff_token";

interface PlatformStaffIdentity {
  id: string;
  email: string;
  name: string;
}

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  status: AuthStatus;
  staff: PlatformStaffIdentity | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [staff, setStaff] = useState<PlatformStaffIdentity | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // On load/refresh, a token already in sessionStorage is only a claim --
  // it may have expired or been issued before the account was
  // deactivated. Validate it against GET /platform-admin/auth/me (the
  // same require_platform_staff dependency every protected endpoint
  // uses) before ever trusting it, exactly mirroring how the backend
  // itself never trusts a JWT's embedded claims without re-deriving
  // authorization live.
  useEffect(() => {
    const storedToken = sessionStorage.getItem(TOKEN_STORAGE_KEY);

    if (!storedToken) {
      setStatus("unauthenticated");
      return;
    }

    fetchMe(storedToken)
      .then((me) => {
        setToken(storedToken);
        setStaff({ id: me.platform_staff_id, email: me.email, name: me.name });
        setStatus("authenticated");
      })
      .catch(() => {
        sessionStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken(null);
        setStaff(null);
        setStatus("unauthenticated");
      });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await loginRequest(email, password);
    sessionStorage.setItem(TOKEN_STORAGE_KEY, response.access_token);
    setToken(response.access_token);
    setStaff({
      id: response.platform_staff.id,
      email: response.platform_staff.email,
      name: response.platform_staff.name,
    });
    setStatus("authenticated");
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setStaff(null);
    setStatus("unauthenticated");
  }, []);

  // Registers this provider's own logout as api/client.ts's single
  // global 401 handler -- a token-bearing request that comes back 401
  // anywhere in the app (session expired mid-use, or the account was
  // just deactivated) clears the session the same way an explicit
  // logout does; RequireAuth's existing <Navigate> then redirects to
  // /login declaratively once `status` flips.
  //
  // The cleanup below (unregistering on unmount) is included for
  // correctness even though it's not expected to ever run in practice:
  // AuthProvider wraps the entire app once, directly inside
  // BrowserRouter in App.tsx, and is never conditionally rendered or
  // remounted during this app's lifetime -- it only unmounts when the
  // whole page does (navigation away, tab close, reload), at which
  // point the module-level handler reference is discarded anyway. The
  // cleanup exists so this stays correct even if that assumption ever
  // changes (e.g. a future test harness mounting/unmounting
  // AuthProvider repeatedly), not because a stale handler is reachable
  // today.
  useEffect(() => {
    setUnauthorizedHandler(logout);
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  const value = useMemo<AuthContextValue>(
    () => ({ status, staff, token, login, logout }),
    [status, staff, token, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
