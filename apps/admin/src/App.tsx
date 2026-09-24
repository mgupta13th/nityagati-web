import { BrowserRouter, Route, Routes } from "react-router";
import { AuthProvider } from "./auth/AuthContext";
import LoginPage from "./auth/LoginPage";
import RequireAuth from "./auth/RequireAuth";
import AppLayout from "./layouts/AppLayout";
import OrganizationsListPage from "./organizations/OrganizationsListPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <AppLayout>
                  <OrganizationsListPage />
                </AppLayout>
              </RequireAuth>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
