import { useAuth } from "./auth/AuthContext";

// Placeholder authenticated screen -- Commit 2 proves the login/session
// guard works end to end; Organizations screens are a later commit.
export default function HomePage() {
  const { staff, logout } = useAuth();

  return (
    <main>
      <h1>Nityagati Management Console</h1>
      {staff && (
        <p>
          Signed in as {staff.name} ({staff.email})
        </p>
      )}
      <button type="button" onClick={logout}>
        Log out
      </button>
    </main>
  );
}
