import type { ReactNode } from "react";
import { Navigate } from "react-router";
import { useAuth } from "./AuthContext";

// Guards a route: unauthenticated (no token, or a token that failed
// validation against the backend) is sent to /login; an expired/invalid
// session surfaces the same way, since AuthContext's own session check
// clears the stored token and flips status to "unauthenticated" on any
// failure -- this component doesn't need to know why.
export default function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAuth();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
