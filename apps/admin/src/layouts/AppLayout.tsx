import type { ReactNode } from "react";
import { Link } from "react-router";
import { useAuth } from "../auth/AuthContext";

export default function AppLayout({ children }: { children: ReactNode }) {
  const { staff, logout } = useAuth();

  return (
    <div>
      <header>
        <h1>Nityagati Management Console</h1>
        <nav>
          <Link to="/organizations">Organizations</Link>
          {" | "}
          <Link to="/staff">Platform Staff</Link>
          {" | "}
          <Link to="/audit-events">Audit Events</Link>
          {" | "}
          <button type="button" onClick={logout}>
            Logout
          </button>
        </nav>
        {staff && (
          <p>
            Signed in as {staff.name} ({staff.email})
          </p>
        )}
      </header>
      <main>{children}</main>
    </div>
  );
}
