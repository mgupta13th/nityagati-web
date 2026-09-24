import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router";
import { ApiError } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import {
  fetchOrganization,
  fetchOrganizationUsers,
  type OrganizationUserSummary,
} from "./organizationsApi";

const PAGE_SIZE = 20;

type LoadState = "loading" | "loaded" | "not-found" | "error";

export default function OrganizationUsersPage() {
  const { organizationId } = useParams<{ organizationId: string }>();
  const { token } = useAuth();

  const [organizationName, setOrganizationName] = useState<string | null>(null);
  const [items, setItems] = useState<OrganizationUserSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [state, setState] = useState<LoadState>("loading");
  const [error, setError] = useState<string | null>(null);

  // Organization name for a clear page title -- fetched independently of
  // the paginated/searchable user list below; a failure here is silently
  // ignored since the users fetch surfaces the same not-found/error state.
  useEffect(() => {
    if (!token || !organizationId) {
      return;
    }
    fetchOrganization(token, organizationId)
      .then((organization) => setOrganizationName(organization.name))
      .catch(() => {});
  }, [token, organizationId]);

  useEffect(() => {
    if (!token || !organizationId) {
      return;
    }

    let cancelled = false;
    setState("loading");
    setError(null);

    fetchOrganizationUsers(token, organizationId, {
      search: search || undefined,
      page,
      size: PAGE_SIZE,
    })
      .then((response) => {
        if (cancelled) return;
        setItems(response.items);
        setTotal(response.total);
        setHasMore(response.has_more);
        setState("loaded");
      })
      .catch((err) => {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setState("not-found");
          return;
        }
        setError(err instanceof ApiError ? err.message : "Unable to load users. Please try again.");
        setState("error");
      });

    return () => {
      cancelled = true;
    };
  }, [token, organizationId, page, search]);

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <section>
      <p>
        <Link to={`/organizations/${organizationId}`}>&larr; Back to Organization</Link>
      </p>

      <h2>Users{organizationName ? ` — ${organizationName}` : ""}</h2>

      {state !== "not-found" && (
        <form onSubmit={handleSearchSubmit}>
          <label htmlFor="user-search">Search</label>
          <br />
          <input
            id="user-search"
            type="text"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Name, mobile, or email"
          />
          <button type="submit">Search</button>
        </form>
      )}

      {state === "loading" && <p>Loading users...</p>}

      {state === "not-found" && <p>Organization not found.</p>}

      {state === "error" && <p role="alert">{error}</p>}

      {state === "loaded" && items.length === 0 && <p>No users found.</p>}

      {state === "loaded" && items.length > 0 && (
        <>
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.mobile}</td>
                  <td>{user.email ?? "—"}</td>
                  <td>{user.role}</td>
                  <td>{user.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p>
            Page {page} of {totalPages} ({total} total)
          </p>
          <button type="button" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
            Previous
          </button>
          <button type="button" disabled={!hasMore} onClick={() => setPage((current) => current + 1)}>
            Next
          </button>
        </>
      )}
    </section>
  );
}
