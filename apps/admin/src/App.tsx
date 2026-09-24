import type { ReactNode } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { AuthProvider } from "./auth/AuthContext";
import LoginPage from "./auth/LoginPage";
import RequireAuth from "./auth/RequireAuth";
import AppLayout from "./layouts/AppLayout";
import CreateOrganizationPage from "./organizations/CreateOrganizationPage";
import OrganizationsListPage from "./organizations/OrganizationsListPage";

function ProtectedPage({ children }: { children: ReactNode }) {
  return (
    <RequireAuth>
      <AppLayout>{children}</AppLayout>
    </RequireAuth>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          {/* / keeps working (Commit 3 behavior) and is otherwise
              equivalent to /organizations, the newly-named route. */}
          <Route
            path="/"
            element={
              <ProtectedPage>
                <OrganizationsListPage />
              </ProtectedPage>
            }
          />
          <Route
            path="/organizations"
            element={
              <ProtectedPage>
                <OrganizationsListPage />
              </ProtectedPage>
            }
          />
          <Route
            path="/organizations/new"
            element={
              <ProtectedPage>
                <CreateOrganizationPage />
              </ProtectedPage>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
