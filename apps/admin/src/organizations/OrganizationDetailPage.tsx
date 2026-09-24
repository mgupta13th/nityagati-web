import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ApiError } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { fetchOrganization, setOrganizationStatus, type OrganizationDetail } from "./organizationsApi";

type LoadState = "loading" | "loaded" | "not-found" | "error";

export default function OrganizationDetailPage() {
  const { organizationId } = useParams<{ organizationId: string }>();
  const { token } = useAuth();

  const [organization, setOrganization] = useState<OrganizationDetail | null>(null);
  const [state, setState] = useState<LoadState>("loading");
  const [error, setError] = useState<string | null>(null);
  const [statusPending, setStatusPending] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !organizationId) {
      return;
    }

    let cancelled = false;
    setState("loading");
    setError(null);

    fetchOrganization(token, organizationId)
      .then((response) => {
        if (cancelled) return;
        setOrganization(response);
        setState("loaded");
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setState("not-found");
          return;
        }
        setError(
          err instanceof ApiError ? err.message : "Unable to load this organization. Please try again.",
        );
        setState("error");
      });

    return () => {
      cancelled = true;
    };
  }, [token, organizationId]);

  async function handleToggleStatus() {
    if (!token || !organization || statusPending) {
      return;
    }

    const nextActive = !organization.is_active;

    if (!nextActive) {
      const confirmed = window.confirm(
        `Deactivate ${organization.name}? Its users will not be able to sign in, and any of their ` +
          `current sessions stop working on their next request. This can be reversed at any time.`,
      );
      if (!confirmed) {
        return;
      }
    }

    setStatusError(null);
    setStatusPending(true);

    try {
      const updated = await setOrganizationStatus(token, organization.id, nextActive);
      setOrganization(updated);
    } catch (err) {
      setStatusError(
        err instanceof ApiError ? err.message : "Unable to update this organization. Please try again.",
      );
    } finally {
      setStatusPending(false);
    }
  }

  return (
    <section>
      <p>
        <Link to="/organizations">&larr; Back to Organizations</Link>
      </p>

      {state === "loading" && <p>Loading organization...</p>}

      {state === "not-found" && <p>Organization not found.</p>}

      {state === "error" && <p role="alert">{error}</p>}

      {state === "loaded" && organization && (
        <>
          <h2>{organization.name}</h2>

          <p>
            <Link to={`/organizations/${organization.id}/users`}>Users</Link>
          </p>

          <section>
            <h3>Organization</h3>
            <dl>
              <dt>Name</dt>
              <dd>{organization.name}</dd>
              <dt>Status</dt>
              <dd>
                {organization.is_active ? "Active" : "Inactive"}{" "}
                <button type="button" disabled={statusPending} onClick={handleToggleStatus}>
                  {statusPending
                    ? "Updating..."
                    : organization.is_active
                      ? "Deactivate"
                      : "Activate"}
                </button>
              </dd>
              <dt>Organization ID</dt>
              <dd>{organization.id}</dd>
              <dt>Created</dt>
              <dd>{new Date(organization.created_at).toLocaleDateString()}</dd>
            </dl>
            {statusError && <p role="alert">{statusError}</p>}
          </section>

          <section>
            <h3>Contact</h3>
            <dl>
              <dt>Mobile</dt>
              <dd>{organization.mobile ?? "—"}</dd>
              <dt>Email</dt>
              <dd>{organization.email ?? "—"}</dd>
              <dt>Address</dt>
              <dd>{organization.address ?? "—"}</dd>
            </dl>
          </section>

          {(organization.gstin || organization.pan) && (
            <section>
              <h3>Tax / Registration</h3>
              <dl>
                {organization.gstin && (
                  <>
                    <dt>GSTIN</dt>
                    <dd>{organization.gstin}</dd>
                  </>
                )}
                {organization.pan && (
                  <>
                    <dt>PAN</dt>
                    <dd>{organization.pan}</dd>
                  </>
                )}
              </dl>
            </section>
          )}

          <section>
            <h3>Owner</h3>
            {organization.owner ? (
              <dl>
                <dt>Name</dt>
                <dd>{organization.owner.name}</dd>
                <dt>Mobile</dt>
                <dd>{organization.owner.mobile}</dd>
                <dt>Email</dt>
                <dd>{organization.owner.email ?? "—"}</dd>
              </dl>
            ) : (
              <p>No owner is currently recorded for this organization.</p>
            )}
          </section>
        </>
      )}
    </section>
  );
}
