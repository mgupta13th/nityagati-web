import { useEffect, useState, type FormEvent } from "react";
import { ApiError } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { fetchOrganizations, type OrganizationSummary } from "./organizationsApi";

const PAGE_SIZE = 20;

type LoadState = "loading" | "loaded" | "error";

export default function OrganizationsListPage() {
  const { token } = useAuth();

  const [items, setItems] = useState<OrganizationSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [state, setState] = useState<LoadState>("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    let cancelled = false;
    setState("loading");
    setError(null);

    fetchOrganizations(token, { search: search || undefined, page, size: PAGE_SIZE })
      .then((response) => {
        if (cancelled) return;
        setItems(response.items);
        setTotal(response.total);
        setHasMore(response.has_more);
        setState("loaded");
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof ApiError ? err.message : "Unable to load organizations. Please try again.",
        );
        setState("error");
      });

    return () => {
      cancelled = true;
    };
  }, [token, page, search]);

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <section>
      <h2>Organizations</h2>

      <form onSubmit={handleSearchSubmit}>
        <label htmlFor="org-search">Search</label>
        <br />
        <input
          id="org-search"
          type="text"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Name, mobile, or email"
        />
        <button type="submit">Search</button>
      </form>

      {state === "loading" && <p>Loading organizations...</p>}

      {state === "error" && <p role="alert">{error}</p>}

      {state === "loaded" && items.length === 0 && <p>No organizations found.</p>}

      {state === "loaded" && items.length > 0 && (
        <>
          <table>
            <thead>
              <tr>
                <th>Organization</th>
                <th>Status</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((organization) => (
                <tr key={organization.id}>
                  <td>{organization.name}</td>
                  <td>{organization.is_active ? "Active" : "Inactive"}</td>
                  <td>{new Date(organization.created_at).toLocaleDateString()}</td>
                  <td>
                    {/* Organization Details is a later commit -- disabled,
                        not a link to a route that doesn't exist yet. */}
                    <button type="button" disabled title="Organization details are not available yet">
                      View
                    </button>
                  </td>
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
