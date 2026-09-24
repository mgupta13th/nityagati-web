import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router";
import { ApiError } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { fetchStaff, setStaffStatus, type StaffAccountSummary } from "./staffApi";

const PAGE_SIZE = 20;

type LoadState = "loading" | "loaded" | "error";

export default function StaffListPage() {
  const { token, staff: currentStaff } = useAuth();

  const [items, setItems] = useState<StaffAccountSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [state, setState] = useState<LoadState>("loading");
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    if (!token) {
      return;
    }

    let cancelled = false;
    setState("loading");
    setError(null);

    fetchStaff(token, { search: search || undefined, page, size: PAGE_SIZE })
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
          err instanceof ApiError ? err.message : "Unable to load platform staff. Please try again.",
        );
        setState("error");
      });

    return () => {
      cancelled = true;
    };
    // reloadToken is bumped after a successful activate/deactivate so the
    // list reflects the change, without needing a full-page reload.
  }, [token, page, search, reloadToken]);

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  async function handleToggleStatus(account: StaffAccountSummary) {
    if (!token || pendingId) {
      return;
    }

    const nextActive = !account.is_active;

    if (!nextActive) {
      const confirmed = window.confirm(
        `Deactivate ${account.name} (${account.email})? They will no longer be able to sign in, ` +
          `and their current session (if any) stops working on their next request.`,
      );
      if (!confirmed) {
        return;
      }
    }

    setActionError(null);
    setPendingId(account.id);

    try {
      await setStaffStatus(token, account.id, nextActive);
      setReloadToken((current) => current + 1);
    } catch (err) {
      setActionError(
        err instanceof ApiError ? err.message : "Unable to update this account. Please try again.",
      );
    } finally {
      setPendingId(null);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <section>
      <h2>Platform Staff</h2>

      <p>
        <Link to="/staff/new">+ Create Platform Staff</Link>
      </p>

      <form onSubmit={handleSearchSubmit}>
        <label htmlFor="staff-search">Search</label>
        <br />
        <input
          id="staff-search"
          type="text"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Name or email"
        />
        <button type="submit">Search</button>
      </form>

      {actionError && <p role="alert">{actionError}</p>}

      {state === "loading" && <p>Loading platform staff...</p>}

      {state === "error" && <p role="alert">{error}</p>}

      {state === "loaded" && items.length === 0 && <p>No platform staff accounts found.</p>}

      {state === "loaded" && items.length > 0 && (
        <>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((account) => {
                const isSelf = currentStaff?.id === account.id;
                return (
                  <tr key={account.id}>
                    <td>{account.name}</td>
                    <td>{account.email}</td>
                    <td>{account.is_active ? "Active" : "Inactive"}</td>
                    <td>{new Date(account.created_at).toLocaleDateString()}</td>
                    <td>
                      <button
                        type="button"
                        disabled={isSelf || pendingId === account.id}
                        title={isSelf ? "You cannot deactivate your own account" : undefined}
                        onClick={() => handleToggleStatus(account)}
                      >
                        {pendingId === account.id
                          ? "Updating..."
                          : account.is_active
                            ? "Deactivate"
                            : "Activate"}
                      </button>
                    </td>
                  </tr>
                );
              })}
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
