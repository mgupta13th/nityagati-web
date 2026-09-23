import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
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
